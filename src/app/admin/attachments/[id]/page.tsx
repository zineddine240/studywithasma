"use client";

import { use, useEffect, useState } from "react";
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
import { updateAttachmentAction } from "../../actions";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  File as FileIcon,
  Loader2,
  Paperclip,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

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

export default function EditAttachmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState<string>("");
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
    async function loadData() {
      try {
        // Fetch modules
        const { data: modulesData, error: modulesError } = await supabase.from(
          "modules",
        ).select(`
            id,
            name,
            course_id,
            course:courses (
              title
            )
          `);

        if (modulesData && !modulesError) {
          const formatted = modulesData.map((item: any) => ({
            id: item.id,
            name: item.name,
            course_id: item.course_id,
            course_title: item.course?.title || "Unknown Course",
          }));
          setModules(formatted);
        }

        // Fetch attachment details
        const { data: attData, error: attError } = await supabase
          .from("module_attachments")
          .select("*, module:modules(course_id)")
          .eq("id", id)
          .single();

        if (attError) throw attError;

        if (attData) {
          setValue("title", attData.title);
          setValue("module_id", attData.module_id);
          if (attData.module?.course_id) {
            setSelectedCourseId(attData.module.course_id);
          }
          setCurrentFileUrl(attData.file_url);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Failed to load attachment details.");
        router.push("/admin/attachments");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, router, setValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    const supabase = createClient();

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("module_id", values.module_id);

      // If there's a new file, upload it
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("course_attachments")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(uploadError.message || "Failed to upload file.");
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("course_attachments").getPublicUrl(filePath);

        formData.append("file_url", publicUrl);
      }

      const result = await updateAttachmentAction(id, formData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Attachment updated successfully!");
      router.push("/admin/attachments");
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  }

  const uniqueCourses = Array.from(
    new Map(
      modules.map((m) => [
        m.course_id,
        { id: m.course_id, title: m.course_title },
      ]),
    ).values(),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/attachments"
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Edit Attachment
          </h1>
          <p className="text-sm text-muted-foreground">
            Update the title, change the module, or replace the file.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <Field>
                <FieldLabel>Replace File (Optional)</FieldLabel>
                <FieldContent>
                  {!file && (
                    <div className="mb-4 p-3 rounded-lg border border-border bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground font-medium">
                          Current File
                        </span>
                      </div>
                      <a
                        href={currentFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View File ↗
                      </a>
                    </div>
                  )}

                  <div className="flex justify-center rounded-lg border border-dashed border-border px-6 py-8 hover:bg-muted/30 transition-colors">
                    <div className="text-center">
                      <Upload
                        className="mx-auto h-8 w-8 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:ring-2 focus-within:ring-primary hover:text-primary/80"
                        >
                          <span>Upload a replacement file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-muted-foreground mt-1">
                        Leave empty to keep the current file
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
                        Cancel Replacement
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select Course --">
                        {(val: string) => {
                          if (!val) return "-- Select Course --";
                          return (
                            uniqueCourses.find((c) => c.id === val)?.title ||
                            "-- Select Course --"
                          );
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
                      onValueChange={(val) =>
                        setValue("module_id", val || "", {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger id="module_id">
                        <SelectValue placeholder="-- Select Module --">
                          {(val: string) => {
                            if (!val) return "-- Select Module --";
                            return (
                              modules.find((m) => m.id === val)?.name ||
                              "-- Select Module --"
                            );
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
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="cursor-pointer"
                >
                  {uploading ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">
                Editing Attachments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">
                  Replacing Files
                </h4>
                <p>
                  If you upload a new file, it will instantly replace the
                  existing attachment link. The old file will still exist in
                  Storage but will no longer be linked here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
