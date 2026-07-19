"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

// We'll fetch courses dynamically, so no hardcoded COURSE_OPTIONS here.

const ENGLISH_LEVEL_OPTIONS = [
  { value: "", label: "Select your level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "upper-intermediate", label: "Upper-Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "not-sure", label: "Not Sure" },
];

const TARGET_BAND_OPTIONS = [
  { value: "", label: "Select your target" },
  { value: "5.5", label: "5.5" },
  { value: "6.0", label: "6.0" },
  { value: "6.5", label: "6.5" },
  { value: "7.0", label: "7.0" },
  { value: "7.5+", label: "7.5+" },
  { value: "not-sure", label: "Not Sure" },
];

const REASON_OPTIONS = [
  { value: "", label: "Select your reason" },
  { value: "university-admission", label: "University Admission" },
  { value: "study-abroad", label: "Study Abroad" },
  { value: "work", label: "Work" },
  { value: "immigration", label: "Immigration" },
  { value: "personal-development", label: "Personal Development" },
  { value: "other", label: "Other" },
];

const requestAccessSchema = z.object({
  fullName: z.string().min(1, "Full Name is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string().min(1, "Phone / WhatsApp Number is required."),
  country: z.string().min(1, "Country is required."),
  course: z.string().min(1, "Please select a course."),
  englishLevel: z.string().min(1, "Please select your English level."),
  targetBand: z.string().min(1, "Please select your target band."),
  reason: z.string().min(1, "Please select your reason."),
  message: z.string().optional(),
  agreement: z.literal(true, {
    message: "You must accept the agreement before submitting."
  }),
});

type RequestAccessFormValues = z.infer<typeof requestAccessSchema>;

interface RequestAccessFormProps {
  defaultCourse?: string;
}

export default function RequestAccessForm({
  defaultCourse = "",
}: RequestAccessFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [courses, setCourses] = useState<{value: string, label: string}[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("courses")
        .select("slug, title")
        .order("created_at", { ascending: false });

      if (data) {
        const options = data.map((c) => ({ value: c.slug, label: c.title }));
        setCourses([{ value: "", label: "Select a course" }, ...options]);
      }
      setIsLoadingCourses(false);
    }
    fetchCourses();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequestAccessFormValues>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      country: "",
      course: defaultCourse,
      englishLevel: "",
      targetBand: "",
      reason: "",
      message: "",
    },
  });

  const onSubmit = async (data: RequestAccessFormValues) => {
    try {
      const response = await fetch("/api/enrollment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request.");
      }
      
      setSubmitted(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit request.");
    }
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 sm:py-24 px-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
          Request Submitted Successfully
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
          Thank you for your interest in Study with Asma. Your enrollment
          request has been received and will be reviewed shortly. You will be
          contacted by email or WhatsApp with the next steps.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary/80 transition-colors shadow-sm"
        >
          Return to Home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Row: Name + Email */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field>
          <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
          <FieldContent>
            <Input
              id="fullName"
              placeholder="Your full name"
              {...register("fullName")}
            />
          </FieldContent>
          <FieldError errors={[errors.fullName]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email Address *</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
          </FieldContent>
          <FieldError errors={[errors.email]} />
        </Field>
      </div>

      {/* Row: Password + Phone */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field>
          <FieldLabel htmlFor="password">Password *</FieldLabel>
          <FieldContent>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password")}
            />
          </FieldContent>
          <FieldError errors={[errors.password]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone / WhatsApp Number *</FieldLabel>
          <FieldContent>
            <Input
              id="phone"
              type="tel"
              placeholder="+213 000 000 000"
              {...register("phone")}
            />
          </FieldContent>
          <FieldError errors={[errors.phone]} />
        </Field>
      </div>

      {/* Country (Full Width or part of next row) */}
      <Field>
        <FieldLabel htmlFor="country">Country *</FieldLabel>
        <FieldContent>
          <Input
            id="country"
            placeholder="Your country"
            {...register("country")}
          />
        </FieldContent>
        <FieldError errors={[errors.country]} />
      </Field>

      {/* Selected Course */}
      <Field>
        <FieldLabel htmlFor="course">Selected Course *</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="course"
            render={({ field }) => (
              <Combobox value={field.value || null} onValueChange={(val) => field.onChange(val || "")} disabled={isLoadingCourses}>
                <ComboboxInput
                  placeholder={isLoadingCourses ? "Loading courses..." : "Select a course"}
                  className="w-full bg-background"
                />
                <ComboboxContent className="w-[var(--anchor-width)]">
                  <ComboboxList>
                    {courses.filter(c => c.value !== "").length === 0 ? (
                      <ComboboxEmpty>No courses found.</ComboboxEmpty>
                    ) : (
                      courses.filter(c => c.value !== "").map((opt) => (
                        <ComboboxItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </ComboboxItem>
                      ))
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
        </FieldContent>
        <FieldError errors={[errors.course]} />
      </Field>

      {/* Row: English Level + Target Band */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field>
          <FieldLabel htmlFor="englishLevel">Current English Level *</FieldLabel>
          <FieldContent>
          <Controller
            control={control}
            name="englishLevel"
            render={({ field }) => (
              <Combobox value={field.value || null} onValueChange={(val) => field.onChange(val || "")}>
                <ComboboxInput
                  placeholder="Select your level"
                  className="w-full bg-background"
                />
                <ComboboxContent className="w-[var(--anchor-width)]">
                  <ComboboxList>
                    {ENGLISH_LEVEL_OPTIONS.filter(c => c.value !== "").map((opt) => (
                      <ComboboxItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
          </FieldContent>
          <FieldError errors={[errors.englishLevel]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="targetBand">Target IELTS Band *</FieldLabel>
          <FieldContent>
          <Controller
            control={control}
            name="targetBand"
            render={({ field }) => (
              <Combobox value={field.value || null} onValueChange={(val) => field.onChange(val || "")}>
                <ComboboxInput
                  placeholder="Select your target"
                  className="w-full bg-background"
                />
                <ComboboxContent className="w-[var(--anchor-width)]">
                  <ComboboxList>
                    {TARGET_BAND_OPTIONS.filter(c => c.value !== "").map((opt) => (
                      <ComboboxItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
          </FieldContent>
          <FieldError errors={[errors.targetBand]} />
        </Field>
      </div>

      {/* Reason */}
      <Field>
        <FieldLabel htmlFor="reason">Reason for Taking IELTS *</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <Combobox value={field.value || null} onValueChange={(val) => field.onChange(val || "")}>
                <ComboboxInput
                  placeholder="Select your reason"
                  className="w-full bg-background"
                />
                <ComboboxContent className="w-[var(--anchor-width)]">
                  <ComboboxList>
                    {REASON_OPTIONS.filter(c => c.value !== "").map((opt) => (
                      <ComboboxItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
        </FieldContent>
        <FieldError errors={[errors.reason]} />
      </Field>

      {/* Message (optional) */}
      <Field>
        <FieldLabel htmlFor="message">Additional Message</FieldLabel>
        <FieldContent>
          <Textarea
            id="message"
            rows={4}
            placeholder="Anything else you'd like us to know..."
            {...register("message")}
          />
        </FieldContent>
        <FieldError errors={[errors.message]} />
      </Field>

      {/* Agreement */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-primary/40 accent-[#7C3AED]"
            {...register("agreement")}
          />
          <span className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
            I confirm that the information provided is correct and understand
            that submitting this form does not guarantee immediate enrollment or
            access to the course.
          </span>
        </label>
        {errors.agreement && (
          <p className="text-red-500 text-xs mt-1.5 font-medium ml-7">
            {errors.agreement.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-primary text-white px-10 py-3.5 rounded-full font-semibold hover:bg-primary/80 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
