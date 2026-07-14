"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, ArrowRight, ShieldCheck } from "lucide-react";
import FormField, { inputClassName } from "@/components/forms/FormField";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate network request
      setTimeout(() => {
        router.push("/student-portal");
      }, 600);
    }
  }

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7FF]">
      <div className="w-full max-w-md">
        {/* Notice */}
        <div className="mb-6 flex items-start gap-3 bg-[#EDE9FE] text-[#4C1D95] p-4 rounded-xl border border-[#C4B5FD] shadow-sm">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-[#7C3AED]" />
          <p className="text-sm leading-relaxed font-medium">
            Student access is available only after your enrollment request has been approved by Asma.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] mb-2 tracking-tight">
              Student Login
            </h1>
            <p className="text-[#64748B] text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <FormField label="Email Address" htmlFor="email" error={errors.email}>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={inputClassName}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password}>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`${inputClassName} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#7C3AED] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </FormField>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#7C3AED] focus:ring-[#7C3AED]/40 accent-[#7C3AED]"
                />
                <span className="text-sm font-medium text-[#64748B] group-hover:text-[#1E1B4B] transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-sm font-bold text-[#7C3AED] hover:text-[#4C1D95] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7C3AED] text-white py-3.5 rounded-xl font-bold hover:bg-[#4C1D95] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Log In"}
              {!isSubmitting && <LogIn className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Not enrolled section */}
        <div className="mt-8 text-center bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
          <h2 className="text-lg font-bold text-[#1E1B4B] mb-2">Not enrolled yet?</h2>
          <p className="text-[#64748B] text-sm mb-4">
            Submit a course access request and Asma will contact you with the next steps.
          </p>
          <Link
            href="/request-access"
            className="inline-flex items-center gap-2 bg-[#FAF7FF] text-[#7C3AED] px-6 py-2.5 rounded-full font-semibold border border-[#EDE9FE] hover:bg-[#EDE9FE] transition-colors text-sm"
          >
            Request Course Access
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
