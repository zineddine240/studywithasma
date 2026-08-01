"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCohort, updateCohort } from "@/lib/cohorts/actions";

const cohortSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  course_id: z.string().min(1, "Course is required"),
  course_type: z.string().min(1, "Course type is required"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  registration_deadline: z.string().optional(),
  max_students: z.coerce.number().min(1, "Must be at least 1"),
  status: z.string().min(1, "Status is required"),
  is_visible_for_registration: z.boolean().default(false),
  google_meet_url: z.string().optional(),
  zoom_url: z.string().optional(),
  timezone: z.string().default("UTC"),
  schedules: z.array(
    z.object({
      day_of_week: z.string().min(1, "Day is required"),
      start_time: z.string().min(1, "Start time is required"),
      end_time: z.string().min(1, "End time is required"),
    })
  )
});

type CohortFormValues = z.infer<typeof cohortSchema>;

interface CohortFormProps {
  initialData?: any;
  courses: { id: string; title: string }[];
  isEditing?: boolean;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Daily"];

export default function CohortForm({ initialData, courses, isEditing }: CohortFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<CohortFormValues>({
    resolver: zodResolver(cohortSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      course_id: initialData?.course_id || "",
      course_type: initialData?.course_type || "academic",
      description: initialData?.description || "",
      start_date: initialData?.start_date ? initialData.start_date.split('T')[0] : "",
      end_date: initialData?.end_date ? initialData.end_date.split('T')[0] : "",
      registration_deadline: initialData?.registration_deadline ? initialData.registration_deadline.substring(0, 16) : "",
      max_students: initialData?.max_students || 20,
      status: initialData?.status || "draft",
      is_visible_for_registration: initialData?.is_visible_for_registration ?? false,
      google_meet_url: initialData?.google_meet_url || "",
      zoom_url: initialData?.zoom_url || "",
      timezone: initialData?.timezone || "UTC",
      schedules: initialData?.schedules || [{ day_of_week: "Monday", start_time: "18:00", end_time: "20:00" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules"
  });

  const onSubmit = async (data: CohortFormValues) => {
    setIsSubmitting(true);
    try {
      // separate schedules from main data
      const { schedules, ...cohortData } = data;
      
      // format dates to ISO if needed, or leave as string if postgres accepts it
      if (!cohortData.end_date) cohortData.end_date = undefined;
      if (!cohortData.registration_deadline) {
        cohortData.registration_deadline = undefined;
      } else if (cohortData.registration_deadline.length === 16) {
        // convert datetime-local "YYYY-MM-DDThh:mm" to ISO
        cohortData.registration_deadline = new Date(cohortData.registration_deadline).toISOString();
      }

      const res = isEditing && initialData?.id
        ? await updateCohort(initialData.id, cohortData, schedules)
        : await createCohort(cohortData, schedules);

      if (res.error) throw new Error(res.error);

      toast.success(isEditing ? "Cohort updated!" : "Cohort created!");
      router.push("/admin/cohorts");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save cohort");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 rounded-2xl border border-border">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Link href="/admin/cohorts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h2 className="text-xl font-bold">{isEditing ? "Edit Group" : "Create New Group"}</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>Group Name *</FieldLabel>
          <FieldContent><Input placeholder="E.g. August Evening Batch" {...register("name")} /></FieldContent>
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel>Slug *</FieldLabel>
          <FieldContent><Input placeholder="august-evening-batch" {...register("slug")} /></FieldContent>
          <FieldError errors={[errors.slug]} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>Associated Course *</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="course_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
          <FieldError errors={[errors.course_id]} />
        </Field>

        <Field>
          <FieldLabel>Course Type *</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="course_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic IELTS</SelectItem>
                    <SelectItem value="general">General Training IELTS</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
          <FieldError errors={[errors.course_type]} />
        </Field>
      </div>

      <Field>
        <FieldLabel>Description</FieldLabel>
        <FieldContent><Textarea rows={3} placeholder="Optional cohort description..." {...register("description")} /></FieldContent>
        <FieldError errors={[errors.description]} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-6">
        <Field>
          <FieldLabel>Start Date *</FieldLabel>
          <FieldContent><Input type="date" {...register("start_date")} /></FieldContent>
          <FieldError errors={[errors.start_date]} />
        </Field>
        <Field>
          <FieldLabel>End Date</FieldLabel>
          <FieldContent><Input type="date" {...register("end_date")} /></FieldContent>
          <FieldError errors={[errors.end_date]} />
        </Field>
        <Field>
          <FieldLabel>Registration Deadline</FieldLabel>
          <FieldContent><Input type="datetime-local" {...register("registration_deadline")} /></FieldContent>
          <FieldError errors={[errors.registration_deadline]} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Field>
          <FieldLabel>Max Students *</FieldLabel>
          <FieldContent><Input type="number" min="1" {...register("max_students")} /></FieldContent>
          <FieldError errors={[errors.max_students]} />
        </Field>
        <Field>
          <FieldLabel>Status *</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="open">Open (Accepting)</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="active">Active (Ongoing)</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
          <FieldError errors={[errors.status]} />
        </Field>
        <Field>
          <FieldLabel>Visibility</FieldLabel>
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 accent-primary" {...register("is_visible_for_registration")} />
              <span className="font-medium">Visible on Registration Form</span>
            </label>
          </div>
          <FieldError errors={[errors.is_visible_for_registration]} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>Google Meet URL</FieldLabel>
          <FieldContent><Input placeholder="https://meet.google.com/..." {...register("google_meet_url")} /></FieldContent>
          <FieldError errors={[errors.google_meet_url]} />
        </Field>
        <Field>
          <FieldLabel>Timezone</FieldLabel>
          <FieldContent><Input placeholder="UTC or Africa/Algiers" {...register("timezone")} /></FieldContent>
          <FieldError errors={[errors.timezone]} />
        </Field>
      </div>

      {/* Schedules Section */}
      <div className="space-y-4 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Class Schedule</h3>
            <p className="text-sm text-muted-foreground">Add the regular study days and times.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ day_of_week: "Monday", start_time: "18:00", end_time: "20:00" })}>
            <Plus className="w-4 h-4 mr-1" /> Add Time
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border">
              <div className="grid grid-cols-3 gap-4 flex-1">
                <Field>
                  <FieldLabel>Day</FieldLabel>
                  <Controller
                    control={control}
                    name={`schedules.${index}.day_of_week`}
                    render={({ field: selectField }) => (
                      <Select value={selectField.value} onValueChange={selectField.onChange}>
                        <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.schedules?.[index]?.day_of_week && <p className="text-xs text-red-500 mt-1">{errors.schedules[index]?.day_of_week?.message}</p>}
                </Field>

                <Field>
                  <FieldLabel>Start Time</FieldLabel>
                  <Input type="time" {...register(`schedules.${index}.start_time`)} />
                  {errors.schedules?.[index]?.start_time && <p className="text-xs text-red-500 mt-1">{errors.schedules[index]?.start_time?.message}</p>}
                </Field>

                <Field>
                  <FieldLabel>End Time</FieldLabel>
                  <Input type="time" {...register(`schedules.${index}.end_time`)} />
                  {errors.schedules?.[index]?.end_time && <p className="text-xs text-red-500 mt-1">{errors.schedules[index]?.end_time?.message}</p>}
                </Field>
              </div>
              <Button type="button" variant="ghost" size="icon" className="mt-7 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-xl border border-dashed border-border">
              No schedules added yet.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit" disabled={isSubmitting} className="font-bold flex items-center gap-2 px-8">
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save Group"}
        </Button>
      </div>
    </form>
  );
}
