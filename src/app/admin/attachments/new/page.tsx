"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createAttachmentAction } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Upload, File as FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Note: we remove file_url from schema because we handle the file separately
const formSchema = z.object({
  title: z.string().min(2, "Title is required").max(100),
  module_id: z.string().min(1, "Please select a module"),
});

interface ModuleOption {
  id: string;
  name: string;
  course_id: string;
  course_title: string;
}

export default function NewAttachmentPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      module_id: "",
    },
  });

  const watchModuleId = watch("module_id");

  useEffect(() => {
    const supabase = createClient();
    async function fetchModules() {
      try {
        const { data, error } = await supabase
          .from("modules")
          .select(`
            id,
            name,
            course_id,
            course:courses (
              title
            )
          `);
        if (data && !error) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            course_id: item.course_id,
            course_title: item.course?.title || "Unknown Course"
          }));
          setModules(formatted);
        }
      } catch (err) {
        console.error("Failed to load modules:", err);
      } finally {
        setLoadingModules(false);
      }
    }
    fetchModules();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const supabase = createClient();

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('course_attachments')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload file.");
      }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course_attachments')
        .getPublicUrl(filePath);

      // 3. Save to database
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("file_url", publicUrl);
      formData.append("module_id", values.module_id);

      const result = await createAttachmentAction(formData);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast.success("Attachment uploaded successfully!");
      router.push("/admin/attachments");
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  }

  const uniqueCourses = Array.from(
    new Map(modules.map((m) => [m.course_id, { id: m.course_id, title: m.course_title }])).values()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/attachments" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Attachment</h1>
          <p className="text-sm text-muted-foreground">Upload a file (PDF, Document, etc.) to Supabase Storage and assign it to a module.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              
              <Field>
                <FieldLabel>File Upload</FieldLabel>
                <FieldContent>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-8 hover:bg-muted/30 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:ring-2 focus-within:ring-primary hover:text-primary/80"
                        >
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                                // Auto-fill title if empty
                                const currentTitle = watch("title");
                                if (!currentTitle) {
                                  // Remove extension for title
                                  setValue("title", e.target.files[0].name.split('.').slice(0, -1).join('.'), { shouldValidate: true });
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-muted-foreground mt-1">
                        PDF, DOCX, ZIP, PNG up to 50MB
                      </p>
                    </div>
                  </div>
                  {file && (
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <FileIcon className="w-5 h-5 text-primary shrink-0" />
                      <div className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </div>
                      <div className="ml-auto text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setFile(null)}
                        className="ml-2 text-destructive hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="title">Attachment Title</FieldLabel>
                <FieldContent>
                  <Input
                    id="title"
                    placeholder="e.g., Essay Structure Cheat Sheet"
                    {...register("title")}
                  />
                </FieldContent>
                <FieldError errors={[errors.title]} />
              </Field>

              <Field>
                <FieldLabel>Course</FieldLabel>
                <FieldContent>
                  <Select
                    value={selectedCourseId}
                    onValueChange={(val) => {
                      setSelectedCourseId(val || "");
                      setValue("module_id", "");
                    }}
                    disabled={loadingModules}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select Course --">
                        {(val: string) => {
                          if (!val) return "-- Select Course --";
                          return uniqueCourses.find((c) => c.id === val)?.title || "-- Select Course --";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueCourses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              {selectedCourseId && (
                <Field>
                  <FieldLabel htmlFor="module_id">Associated Module</FieldLabel>
                  <FieldContent>
                    <Select
                      value={watchModuleId || ""}
                      onValueChange={(val) => setValue("module_id", val || "", { shouldValidate: true })}
                      disabled={loadingModules}
                    >
                      <SelectTrigger id="module_id">
                        <SelectValue placeholder="-- Select Module --">
                          {(val: string) => {
                            if (!val) return "-- Select Module --";
                            return modules.find((m) => m.id === val)?.name || "-- Select Module --";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {modules
                          .filter((m) => m.course_id === selectedCourseId)
                          .map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                  <FieldError errors={[errors.module_id]} />
                </Field>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/admin/attachments">
                  <Button type="button" variant="outline" disabled={uploading} className="cursor-pointer">Cancel</Button>
                </Link>
                <Button type="submit" disabled={uploading} className="cursor-pointer">
                  {uploading ? "Uploading & Saving…" : "Upload Attachment"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Storage Guidelines</CardTitle>
              <CardDescription>Supabase Storage Information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Direct Upload</h4>
                <p>Files uploaded here are stored directly in your Supabase `course_attachments` bucket.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Auto-Naming</h4>
                <p>The attachment title will automatically populate from the filename to save you time. You can edit it before saving.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
