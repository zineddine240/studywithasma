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
import { updateLessonAction, deleteLessonAction } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { use, useEffect, useState } from "react";
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

export default function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [modules, setModules] = useState<ModuleOption[]>([]);
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
    async function loadData() {
      try {
        // Fetch lesson details
        const { data: lesson, error: lessonError } = await supabase
          .from("recorded_lessons")
          .select("*")
          .eq("id", id)
          .single();

        if (lessonError || !lesson) {
          toast.error("Lesson not found");
          router.push("/admin/lessons");
          return;
        }

        setValue("title", lesson.title);
        setValue("description", lesson.description || "");
        setValue("video_url", lesson.video_url);
        setValue("module_id", lesson.module_id || "none");

        // Fetch modules
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select(`
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
            course_title: item.course?.title || "Unknown Course"
          }));
          setModules(formatted);
          
          if (lesson.module_id) {
            const selectedModule = formatted.find(m => m.id === lesson.module_id);
            if (selectedModule) {
              setSelectedCourseId(selectedModule.course_id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load lesson:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, setValue, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) formData.append("description", values.description);
    formData.append("video_url", values.video_url);
    if (values.module_id && values.module_id !== "none" && selectedCourseId !== "global") {
      formData.append("module_id", values.module_id);
    } else {
      formData.append("module_id", "");
    }
    if (selectedCourseId && selectedCourseId !== "global") {
      formData.append("course_id", selectedCourseId);
    }

    try {
      const result = await updateLessonAction(id, formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success("Lesson updated successfully!");
        router.push("/admin/lessons");
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this recorded lesson?")) return;
    setDeleting(true);
    try {
      const res = await deleteLessonAction(id);
      if (res.error) {
        toast.error(res.error);
        setDeleting(false);
      } else {
        toast.success("Lesson deleted successfully");
        router.push("/admin/lessons");
      }
    } catch {
      toast.error("Failed to delete lesson");
      setDeleting(false);
    }
  }

  // Extract unique courses
  const uniqueCourses = Array.from(
    new Map(modules.map((m) => [m.course_id, { id: m.course_id, title: m.course_title }])).values()
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/lessons" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Recorded Lesson</h1>
            <p className="text-sm text-muted-foreground">Modify the details of this recorded lesson.</p>
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={deleting}
          onClick={handleDelete}
          className="cursor-pointer"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Lesson"}
        </Button>
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
                    disabled={loading}
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
                      disabled={loading}
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

        {/* Right Column: Information Card */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Lesson Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Any changes made here will be updated in real-time in the student portal under their respective course modules.
              </p>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Anti-Download Suggestion</h4>
                <p>Use Bunny.net Stream or Vimeo video URLs to prevent students from sharing or downloading files directly.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
