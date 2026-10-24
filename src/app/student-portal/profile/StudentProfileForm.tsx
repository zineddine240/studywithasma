"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User, Mail, Globe, Phone, Target, FileText, Loader2, Save, BookOpen, Group } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateStudentProfileAction } from "../actions";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

const TARGET_BAND_OPTIONS = [
  { value: "5.0", label: "5.0" },
  { value: "5.5", label: "5.5" },
  { value: "6.0", label: "6.0" },
  { value: "6.5", label: "6.5" },
  { value: "7.0", label: "7.0" },
  { value: "7.5", label: "7.5" },
  { value: "8.0", label: "8.0" },
  { value: "8.5", label: "8.5" },
  { value: "9.0", label: "9.0" },
];

const studentProfileSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1, "Full name is required."),
  phone: z.string().optional(),
  country: z.string().optional(),
  target_band: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters.").optional(),
});

type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

interface StudentProfileFormProps {
  initialProfile: {
    email: string;
    full_name: string | null;
    phone: string | null;
    country: string | null;
    target_band: string | null;
    bio: string | null;
    enrolled_course: string | null;
    group_name: string | null;
    is_enrolled: boolean;
  };
}

export function StudentProfileForm({ initialProfile }: StudentProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      email: initialProfile.email,
      full_name: initialProfile.full_name || "",
      phone: initialProfile.phone || "",
      country: initialProfile.country || "",
      target_band: initialProfile.target_band || "",
      bio: initialProfile.bio || "",
    },
  });

  const onSubmit = async (data: StudentProfileFormValues) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("phone", data.phone || "");
    formData.append("country", data.country || "");
    formData.append("target_band", data.target_band || "");
    formData.append("bio", data.bio || "");

    const result = await updateStudentProfileAction(formData);

    if (result?.error) {
      setServerError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  const displayName = initialProfile.full_name || initialProfile.email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Profile Card Overview */}
      <Card className="rounded-2xl border border-border bg-card h-fit">
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold border border-primary/20 shadow-inner">
            {initial}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground">
              {displayName}
            </h3>
            <p className="text-sm text-muted-foreground truncate max-w-[240px]">
              {initialProfile.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <Badge variant={initialProfile.is_enrolled ? "default" : "secondary"} className="px-3 py-1 text-xs font-semibold">
              {initialProfile.is_enrolled ? "Enrolled Student" : "Pending Student"}
            </Badge>
          </div>

          <div className="w-full pt-4 border-t border-border space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                Course
              </span>
              <span className="font-bold text-foreground">
                {initialProfile.enrolled_course || "Not Enrolled"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Group className="w-3.5 h-3.5 text-primary" />
                Group
              </span>
              <span className="font-bold text-foreground">
                {initialProfile.group_name || "Self-Paced"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-primary" />
                Target Band
              </span>
              <span className="font-bold text-foreground">
                {initialProfile.target_band || "Not set"}
              </span>
            </div>
          </div>

          {initialProfile.bio && (
            <p className="text-xs text-muted-foreground max-w-xs pt-3 border-t border-border w-full text-left line-clamp-3">
              {initialProfile.bio}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Right Column: Edit Profile Form */}
      <Card className="lg:col-span-2 rounded-2xl border border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal information and study preferences.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {serverError && (
              <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium">
                {serverError}
              </div>
            )}

            {/* Email (Read-only) */}
            <Field>
              <FieldLabel htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address
              </FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  disabled
                  className="bg-muted/50 cursor-not-allowed opacity-80"
                  {...register("email")}
                />
              </FieldContent>
              <FieldError errors={[errors.email]} />
              <p className="text-xs text-muted-foreground mt-1">
                Your login email is managed by account registration and cannot be changed here.
              </p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor="full_name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register("full_name")}
                  />
                </FieldContent>
                <FieldError errors={[errors.full_name]} />
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone Number
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. +213 555 123 456"
                    {...register("phone")}
                  />
                </FieldContent>
                <FieldError errors={[errors.phone]} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Country */}
              <Field>
                <FieldLabel htmlFor="country" className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Country
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="country"
                    type="text"
                    placeholder="e.g. Algeria"
                    {...register("country")}
                  />
                </FieldContent>
                <FieldError errors={[errors.country]} />
              </Field>

              {/* Target Band */}
              <Field>
                <FieldLabel htmlFor="target_band" className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Target IELTS Band Score
                </FieldLabel>
                <FieldContent>
                  <Controller
                    name="target_band"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        value={field.value || null}
                        onValueChange={(val) => field.onChange(val || "")}
                      >
                        <ComboboxInput
                          id="target_band"
                          placeholder="Select target band score"
                        />
                        <ComboboxContent>
                          <ComboboxList>
                            <ComboboxEmpty>No match found</ComboboxEmpty>
                            {TARGET_BAND_OPTIONS.map((opt) => (
                              <ComboboxItem key={opt.value} value={opt.value}>
                                Band {opt.label}
                              </ComboboxItem>
                            ))}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    )}
                  />
                </FieldContent>
                <FieldError errors={[errors.target_band]} />
              </Field>
            </div>

            {/* Biography */}
            <Field>
              <FieldLabel htmlFor="bio" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                About Me / Goals
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="bio"
                  placeholder="Share a short summary about your IELTS preparation goals..."
                  rows={4}
                  className="resize-none"
                  {...register("bio")}
                />
              </FieldContent>
              <FieldError errors={[errors.bio]} />
            </Field>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="px-6 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
