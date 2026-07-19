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
import { Textarea } from "@/components/ui/textarea";
import { createLessonAction } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

const formSchema = z.object({
  title: z.string().min(2, "Title is required").max(100),
  description: z.string().optional(),
  video_url: z.string().url("Must be a valid URL"),
  module_id: z.string().optional(),
});

interface ModuleOption {
  id: string;
  name: string;
  course_id: string;
  course_title: string;
}

export default function NewLessonPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);

  const [selectedCourseId, setSelectedCourseId] = useState<string>("global");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      video_url: "",
      module_id: "none",
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
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) formData.append("description", values.description);
    formData.append("video_url", values.video_url);
    if (values.module_id && values.module_id !== "none" && selectedCourseId !== "global") {
      formData.append("module_id", values.module_id);
    }
    if (selectedCourseId && selectedCourseId !== "global") {
      formData.append("course_id", selectedCourseId);
    }

    try {
      const result = await createLessonAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success("Lesson published successfully!");
        router.push("/admin/lessons");
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  }

  // Extract unique courses
  const uniqueCourses = Array.from(
    new Map(modules.map((m) => [m.course_id, { id: m.course_id, title: m.course_title }])).values()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/lessons" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Recorded Lesson</h1>
          <p className="text-sm text-muted-foreground">Provide a link to a recorded video lesson for enrolled students to access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <Field>
                <FieldLabel htmlFor="title">Lesson Title</FieldLabel>
                <FieldContent>
                  <Input
                    id="title"
                    placeholder="e.g., Fundamentals of Writing"
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
                      setSelectedCourseId(val || "global");
                      setValue("module_id", "none");
                    }}
                    disabled={loadingModules}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select Course --">
                        {(val: string) => {
                          if (!val || val === "global") return "-- None (Global Lesson) --";
                          return uniqueCourses.find((c) => c.id === val)?.title || "-- Select Course --";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">-- None (Global Lesson) --</SelectItem>
                      {uniqueCourses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              {selectedCourseId && selectedCourseId !== "global" && (
                <Field>
                  <FieldLabel htmlFor="module_id">Associated Module</FieldLabel>
                  <FieldContent>
                    <Select
                      value={watchModuleId || "none"}
                      onValueChange={(val) => setValue("module_id", val || "none", { shouldValidate: true })}
                      disabled={loadingModules}
                    >
                      <SelectTrigger id="module_id">
                        <SelectValue placeholder="-- Select Module --">
                          {(val: string) => {
                            if (!val || val === "none") return "-- None --";
                            return modules.find((m) => m.id === val)?.name || "-- Select Module --";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- None --</SelectItem>
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

              <Field>
                <FieldLabel htmlFor="video_url">Video URL</FieldLabel>
                <FieldContent>
                  <Input
                    id="video_url"
                    type="url"
                    placeholder="https://youtube.com/watch?..."
                    {...register("video_url")}
                  />
                </FieldContent>
                <FieldError errors={[errors.video_url]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">
                  Description (Optional)
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id="description"
                    placeholder="Brief overview of the lesson..."
                    className="min-h-30"
                    {...register("description")}
                  />
                </FieldContent>
                <FieldError errors={[errors.description]} />
              </Field>

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/admin/lessons">
                  <Button type="button" variant="outline" className="cursor-pointer">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                  {isSubmitting ? "Saving…" : "Save Lesson"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Guidelines Card */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Lesson Guidelines</CardTitle>
              <CardDescription>Tips for uploading and structuring resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Video Hosting</h4>
                <p>Ensure the video is hosted on a reliable service like YouTube, Vimeo, or Google Drive, and that permissions are set to "Public" or "Unlisted".</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Module Association</h4>
                <p>Linking lessons to specific modules (e.g. Speaking, Writing) helps students find related content easily under their respective sections.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Sequencing</h4>
                <p>Prefix titles with week numbers or topics (e.g. <i>"Week 2: Listening Practice"</i>) to make navigation intuitive for students.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
