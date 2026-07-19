"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setupAdminAction } from "./actions";

const setupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SetupFormValues = z.infer<typeof setupSchema>;

export default function SetupForm() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SetupFormValues) => {

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await setupAdminAction(formData);

      if (result?.error) {
        toast.error(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
      }
    } catch (e: any) {
      toast.error(e.message || JSON.stringify(e));
    }
  };

  return (
    <main className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-start gap-3 bg-secondary text-primary/80 p-4 rounded-xl border border-primary/50 shadow-sm">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
          <div className="text-sm leading-relaxed font-medium">
            <p className="font-bold mb-1">Welcome to StudyWithAsma!</p>
            <p>
              You are the first user to arrive. Please create your account
              below. You will be automatically granted Admin privileges.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 tracking-tight">
              Create Admin Account
            </h1>
            <p className="text-muted-foreground text-sm">
              Secure your platform by setting up the owner account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >

            <Field>
              <FieldLabel htmlFor="email">Admin Email</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@studywithasma.com"
                  {...register("email")}
                />
              </FieldContent>
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <FieldContent>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a secure password"
                  {...register("password")}
                />
              </FieldContent>
              <FieldError errors={[errors.password]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <FieldContent>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                />
              </FieldContent>
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/80 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Initialize Platform"}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
