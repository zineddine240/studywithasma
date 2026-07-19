"use client";

import { useForm, Controller } from "react-hook-form";
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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { updateLiveClassAction, deleteLiveClassAction } from "../../actions";
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
  meeting_link: z.string().url("Must be a valid URL"),
  scheduled_at: z.string().min(1, "Date and time are required"),
  module_id: z.string().optional(),
  recording_url: z.union([z.literal(""), z.string().url("Must be a valid URL")]).optional(),
});

interface ModuleOption {
  id: string;
  name: string;
  course_id: string;
  course_title: string;
}

export default function EditLiveClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("global");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      meeting_link: "",
      scheduled_at: "",
      module_id: "none",
      recording_url: "",
    },
  });

  const watchModuleId = watch("module_id");

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      try {
        // Fetch live class details
        const { data: liveClass, error: classError } = await supabase
          .from("live_classes")
          .select("*")
          .eq("id", id)
          .single();

        if (classError || !liveClass) {
          toast.error("Live class not found");
          router.push("/admin/live-classes");
          return;
        }

        setValue("title", liveClass.title);
        setValue("description", liveClass.description || "");
        setValue("meeting_link", liveClass.meeting_link);
        setValue("scheduled_at", liveClass.scheduled_at);
        setValue("module_id", liveClass.module_id || "none");
        setValue("recording_url", liveClass.recording_url || "");

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
          
          if (liveClass.module_id) {
            const selectedModule = formatted.find(m => m.id === liveClass.module_id);
            if (selectedModule) {
              setSelectedCourseId(selectedModule.course_id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load live class:", err);
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
    formData.append("meeting_link", values.meeting_link);

    const isoDate = new Date(values.scheduled_at).toISOString();
    formData.append("scheduled_at", isoDate);

    if (values.module_id && values.module_id !== "none" && selectedCourseId !== "global") {
      formData.append("module_id", values.module_id);
    } else {
      formData.append("module_id", "");
    }
    if (selectedCourseId && selectedCourseId !== "global") {
      formData.append("course_id", selectedCourseId);
    }
    
    if (values.recording_url) {
      formData.append("recording_url", values.recording_url);
    } else {
      formData.append("recording_url", "");
    }

    try {
      const result = await updateLiveClassAction(id, formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success("Live class updated successfully!");
        router.push("/admin/live-classes");
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this live class?")) return;
    setDeleting(true);
    try {
      const res = await deleteLiveClassAction(id);
      if (res.error) {
        toast.error(res.error);
        setDeleting(false);
      } else {
        toast.success("Live class deleted successfully");
        router.push("/admin/live-classes");
      }
    } catch {
      toast.error("Failed to delete live class");
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
          <Link href="/admin/live-classes" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Live Class</h1>
            <p className="text-sm text-muted-foreground">Modify the class details or attach a recording.</p>
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
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Class"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <FieldContent>
                  <Input
                    id="title"
                    placeholder="e.g., Reading Section Mastery"
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
                <FieldLabel htmlFor="meeting_link">Meeting Link</FieldLabel>
                <FieldContent>
                  <Input
                    id="meeting_link"
                    type="url"
                    placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                    {...register("meeting_link")}
                  />
                </FieldContent>
                <FieldError errors={[errors.meeting_link]} />
              </Field>

              <Field>
                <FieldLabel>Date and Time</FieldLabel>
                <FieldContent>
                  <Controller
                    name="scheduled_at"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pick a date and time"
                      />
                    )}
                  />
                </FieldContent>
                <FieldError errors={[errors.scheduled_at]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">
                  Description (Optional)
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id="description"
                    placeholder="What will we cover in this class?"
                    className="min-h-30"
                    {...register("description")}
                  />
                </FieldContent>
                <FieldError errors={[errors.description]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="recording_url">Recording URL (Optional)</FieldLabel>
                <FieldContent>
                  <Input
                    id="recording_url"
                    type="url"
                    placeholder="e.g., https://vimeo.com/..."
                    {...register("recording_url")}
                  />
                </FieldContent>
                <FieldError errors={[errors.recording_url]} />
              </Field>

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/admin/live-classes">
                  <Button type="button" variant="outline" className="cursor-pointer">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                  {isSubmitting ? "Saving…" : "Save Class"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Guidelines Card */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Editing Guidelines</CardTitle>
              <CardDescription>Tips for updating classes and adding recordings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Post-Class Recordings</h4>
                <p>Once the live class finishes, paste the video link into the Recording URL field. Students will then see a "Watch Recording" button instead of the old Zoom link.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Rescheduling</h4>
                <p>If you change the Date and Time, the class will automatically update in the students' upcoming schedules.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
