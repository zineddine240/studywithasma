"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  Mail,
  MapPin,
} from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "./actions";
import SectionTag from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const CONTACT_FAQS = [
  {
    question: "What services does Study with Asma offer?",
    answer:
      "We offer comprehensive IELTS Academic and General Training preparation alongside tailored study abroad advisory for France and Italy.",
  },
  {
    question: "Is there a fee for your consultation services?",
    answer:
      "We provide an initial diagnostic session to evaluate your degree and English baseline, followed by structured packages for IELTS courses and full admission guidance.",
  },
  {
    question: "Which countries can I study in with your help?",
    answer:
      "We specialize strictly in France and Italy to ensure maximum expertise, personalized dossier preparation, and scholarship success.",
  },
  {
    question: "Do you assist with visa processing?",
    answer:
      "Yes. We guide you through Campus France, Universitaly, TLScontact, and VFS appointments, including complete financial dossier reviews and mock interviews.",
  },
  {
    question: "Do I need to take an English language test like IELTS?",
    answer:
      "Most English-taught Bachelor's and Master's programs in France and Italy require an IELTS score of 6.0 to 7.0. We prepare you directly to achieve this score.",
  },
];

export default function ContactPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const subject = data.phone
      ? `Inquiry from ${fullName} (${data.phone})`
      : `Inquiry from ${fullName}`;

    const result = await submitContactForm({
      name: fullName,
      email: data.email,
      subject,
      message: data.message,
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Thank you! Your message has been sent successfully.");
    reset();
  };

  return (
    <main className="grow bg-white">
      {/* ── 1. Page Header & Contact Section ── */}
      <section className="pt-10 sm:pt-14 pb-14 sm:pb-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 sm:mb-12">
            <SectionTag>CONTACT US</SectionTag>
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0B1536] tracking-tight leading-[1.12]">
              Get In Touch
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Have a question about IELTS preparation or studying in France or
              Italy? Reach out today for personalized advice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Left Column: Quick Contact Info & Direct WhatsApp */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
                <h2 className="text-base font-bold text-slate-900">
                  Direct Inquiries
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <a
                    href="https://wa.me/213797328745"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">
                        WhatsApp Hotline
                      </span>
                      <span className="text-slate-500 font-mono">
                        +213 797 32 87 45
                      </span>
                    </div>
                  </a>

                  <a
                    href="mailto:contact@studywithasma.com"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">
                        Email Advisory
                      </span>
                      <span className="text-slate-500">
                        contact@studywithasma.com
                      </span>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 p-3">
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                      <MapPin className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">
                        Locations Covered
                      </span>
                      <span className="text-slate-500">
                        Algeria • France • Italy
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Handwritten Note Callout */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 select-none text-center -rotate-1">
                <p className="font-handwriting text-2xl font-bold text-amber-900 leading-tight">
                  We reply within 24 hours ♡
                </p>
              </div>
            </div>

            {/* Right Column: Clean Form Card */}
            <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="firstName"
                      className="text-xs font-bold text-slate-900"
                    >
                      First Name *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="firstName"
                        placeholder="John"
                        {...register("firstName")}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </FieldContent>
                    <FieldError errors={[errors.firstName]} />
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="lastName"
                      className="text-xs font-bold text-slate-900"
                    >
                      Last Name *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        {...register("lastName")}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </FieldContent>
                    <FieldError errors={[errors.lastName]} />
                  </Field>
                </div>

                {/* Row 2: Email & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="email"
                      className="text-xs font-bold text-slate-900"
                    >
                      Email *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </FieldContent>
                    <FieldError errors={[errors.email]} />
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="phone"
                      className="text-xs font-bold text-slate-900"
                    >
                      Phone Number
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+213 555 123 456"
                        {...register("phone")}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </FieldContent>
                    <FieldError errors={[errors.phone]} />
                  </Field>
                </div>

                {/* Row 3: Message */}
                <Field>
                  <FieldLabel
                    htmlFor="message"
                    className="text-xs font-bold text-slate-900"
                  >
                    Your Message *
                  </FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us about your target university intake, degree, or current IELTS score..."
                      {...register("message")}
                      className="min-h-32 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                    />
                  </FieldContent>
                  <FieldError errors={[errors.message]} />
                </Field>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-8 py-3.5 rounded-full text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <span>
                      {isSubmitting ? "Sending..." : "Submit Inquiry"}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Frequently Asked Questions ── */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-2 mb-10 sm:mb-12">
              <SectionTag>FAQ</SectionTag>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {CONTACT_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-indigo-200 shadow-sm ring-1 ring-indigo-50"
                        : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-hidden"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                      <span
                        className={`p-1.5 rounded-full shrink-0 transition-colors ${
                          isOpen
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Closing CTA Banner ── */}
      <NewCtaSection />
    </main>
  );
}
