"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import FormField, {
  inputClassName,
  selectClassName,
  textareaClassName,
} from "@/components/forms/FormField";

const COURSE_OPTIONS = [
  { value: "", label: "Select a course" },
  { value: "academic-ielts", label: "Academic IELTS" },
  { value: "general-ielts", label: "General IELTS" },
];

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

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  course?: string;
  englishLevel?: string;
  targetBand?: string;
  reason?: string;
  agreement?: string;
}

interface RequestAccessFormProps {
  defaultCourse?: string;
}

export default function RequestAccessForm({
  defaultCourse = "",
}: RequestAccessFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [course, setCourse] = useState(defaultCourse);
  const [englishLevel, setEnglishLevel] = useState("");
  const [targetBand, setTargetBand] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [agreement, setAgreement] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";

    if (!email.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phone.trim())
      newErrors.phone = "Phone / WhatsApp Number is required.";
    if (!country.trim()) newErrors.country = "Country is required.";
    if (!course) newErrors.course = "Please select a course.";
    if (!englishLevel)
      newErrors.englishLevel = "Please select your English level.";
    if (!targetBand)
      newErrors.targetBand = "Please select your target band.";
    if (!reason) newErrors.reason = "Please select your reason.";
    if (!agreement)
      newErrors.agreement =
        "You must accept the agreement before submitting.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 sm:py-24 px-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] mb-4">
          Request Submitted Successfully
        </h2>
        <p className="text-[#64748B] leading-relaxed mb-10 max-w-md mx-auto">
          Thank you for your interest in Study with Asma. Your enrollment
          request has been received and will be reviewed shortly. You will be
          contacted by email or WhatsApp with the next steps.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#7C3AED] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#4C1D95] transition-colors shadow-sm"
        >
          Return to Home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Row: Name + Email */}
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField
          label="Full Name"
          htmlFor="fullName"
          required
          error={errors.fullName}
        >
          <input
            id="fullName"
            type="text"
            placeholder="Your full name"
            className={inputClassName}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </FormField>

        <FormField
          label="Email Address"
          htmlFor="email"
          required
          error={errors.email}
        >
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={inputClassName}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>
      </div>

      {/* Row: Phone + Country */}
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField
          label="Phone / WhatsApp Number"
          htmlFor="phone"
          required
          error={errors.phone}
        >
          <input
            id="phone"
            type="tel"
            placeholder="+213 000 000 000"
            className={inputClassName}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormField>

        <FormField
          label="Country"
          htmlFor="country"
          required
          error={errors.country}
        >
          <input
            id="country"
            type="text"
            placeholder="Your country"
            className={inputClassName}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </FormField>
      </div>

      {/* Selected Course */}
      <FormField
        label="Selected Course"
        htmlFor="course"
        required
        error={errors.course}
      >
        <div className="relative">
          <select
            id="course"
            className={selectClassName}
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            {COURSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
        </div>
      </FormField>

      {/* Row: English Level + Target Band */}
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField
          label="Current English Level"
          htmlFor="englishLevel"
          required
          error={errors.englishLevel}
        >
          <div className="relative">
            <select
              id="englishLevel"
              className={selectClassName}
              value={englishLevel}
              onChange={(e) => setEnglishLevel(e.target.value)}
            >
              {ENGLISH_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
          </div>
        </FormField>

        <FormField
          label="Target IELTS Band"
          htmlFor="targetBand"
          required
          error={errors.targetBand}
        >
          <div className="relative">
            <select
              id="targetBand"
              className={selectClassName}
              value={targetBand}
              onChange={(e) => setTargetBand(e.target.value)}
            >
              {TARGET_BAND_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
          </div>
        </FormField>
      </div>

      {/* Reason */}
      <FormField
        label="Reason for Taking IELTS"
        htmlFor="reason"
        required
        error={errors.reason}
      >
        <div className="relative">
          <select
            id="reason"
            className={selectClassName}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {REASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
        </div>
      </FormField>

      {/* Message (optional) */}
      <FormField label="Additional Message" htmlFor="message">
        <textarea
          id="message"
          rows={4}
          placeholder="Anything else you'd like us to know..."
          className={textareaClassName}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </FormField>

      {/* Agreement */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreement}
            onChange={(e) => setAgreement(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#7C3AED] focus:ring-[#7C3AED]/40 accent-[#7C3AED]"
          />
          <span className="text-sm text-[#64748B] leading-relaxed group-hover:text-[#1E1B4B] transition-colors">
            I confirm that the information provided is correct and understand
            that submitting this form does not guarantee immediate enrollment or
            access to the course.
          </span>
        </label>
        {errors.agreement && (
          <p className="text-red-500 text-xs mt-1.5 font-medium ml-7">
            {errors.agreement}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full sm:w-auto bg-[#7C3AED] text-white px-10 py-3.5 rounded-full font-semibold hover:bg-[#4C1D95] transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        Submit Request
      </button>
    </form>
  );
}
