"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User, Mail, FileText, Loader2, Save } from "lucide-react";

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
import { updateProfileAction } from "../actions";

// Define the form validation schema
const profileSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1, "Full name is required."),
  bio: z.string().max(500, "Bio must be less than 500 characters.").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialProfile: {
    email: string;
    full_name: string | null;
    bio: string | null;
    role: "admin" | "teacher";
  };
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: initialProfile.email,
      full_name: initialProfile.full_name || "",
      bio: initialProfile.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("bio", data.bio || "");

    const result = await updateProfileAction(formData);

    if (result?.error) {
      setServerError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  const displayName = initialProfile.full_name || "Admin User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Visual Profile Card */}
      <Card className="rounded-2xl shadow-sm border border-border bg-card h-fit">
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
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold capitalize">
            {initialProfile.role} Portal
          </Badge>
          {initialProfile.bio && (
            <p className="text-xs text-muted-foreground max-w-xs pt-4 border-t border-border w-full text-left line-clamp-3">
              {initialProfile.bio}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Right Column: Edit Profile Form */}
      <Card className="lg:col-span-2 rounded-2xl shadow-sm border border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your public profile details and personal information.
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
                Email addresses cannot be changed directly. Contact support if you need to update it.
              </p>
            </Field>

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

            {/* Biography */}
            <Field>
              <FieldLabel htmlFor="bio" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Biography
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="bio"
                  placeholder="Write a short bio about yourself..."
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
                className="px-6 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm shadow-primary/10 hover:shadow-primary/20"
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
