"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn, ArrowRight, ShieldCheck } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { loginAction } from "./actions";

// 1. Zod Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 2. React Hook Form Setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 3. Submit Handler
  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    // Call the server action
    const result = await loginAction(formData);

    // The server action will automatically redirect on success.
    // If it returns a result, it means there was an error.
    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <main className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md">
        {/* Notice */}
        <div className="mb-6 flex items-start gap-3 bg-secondary text-primary/80 p-4 rounded-xl border border-primary/50 shadow-sm">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
          <p className="text-sm leading-relaxed font-medium">
            Student access is available only after your enrollment request has
            been approved by Asma.
          </p>
        </div>

        {/* Login Card */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Login
            </CardTitle>
            <CardDescription>
              Welcome back! Please enter your details.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* Server Error Alert */}
              {serverError && (
                <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium">
                  {serverError}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                </FieldContent>
                <FieldError errors={[errors.email]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-12"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FieldContent>
                <FieldError errors={[errors.password]} />
              </Field>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  href="#"
                  className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl font-bold text-sm cursor-pointer"
              >
                {isSubmitting ? "Signing in..." : "Log In"}
                {!isSubmitting && <LogIn className="w-4 h-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Not enrolled section */}
        <Card className="mt-6 rounded-2xl shadow-sm">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-bold text-foreground mb-2">
              Not enrolled yet?
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Submit a course access request and Asma will contact you with the
              next steps.
            </p>
            <Link
              href="/request-access"
              className="inline-flex items-center gap-2 bg-muted/30 text-primary px-6 py-2.5 rounded-full font-semibold border border-border hover:bg-secondary transition-colors text-sm"
            >
              Request Course Access
              <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
