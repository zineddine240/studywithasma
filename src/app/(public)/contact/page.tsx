"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Minus, ArrowRight, Sparkles } from "lucide-react";
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
    <main className="grow bg-background">
      {/* ── 1. Page Header & Centered Form Card (Porbe Contact Layout) ── */}
      <section className="pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="max-w-3xl mx-auto">
            {/* Centered Heading */}
            <div className="text-center mb-10 sm:mb-14 space-y-3">
              <SectionTag>CONTACT US</SectionTag>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-foreground tracking-tight">
                Get In Touch
              </h1>
            </div>

            {/* Form Card (Matching Porbe's clean soft card) */}
            <div className="bg-card rounded-3xl sm:rounded-4xl p-6 sm:p-10 lg:p-12 border border-border/80 shadow-xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Field>
                    <FieldLabel
                      htmlFor="firstName"
                      className="text-xs font-semibold text-foreground"
                    >
                      First Name *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="firstName"
                        placeholder="John"
                        {...register("firstName")}
                        className="rounded-xl bg-background border-border"
                      />
                    </FieldContent>
                    <FieldError errors={[errors.firstName]} />
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="lastName"
                      className="text-xs font-semibold text-foreground"
                    >
                      Last Name *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        {...register("lastName")}
                        className="rounded-xl bg-background border-border"
                      />
                    </FieldContent>
                    <FieldError errors={[errors.lastName]} />
                  </Field>
                </div>

                {/* Row 2: Email & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Field>
                    <FieldLabel
                      htmlFor="email"
                      className="text-xs font-semibold text-foreground"
                    >
                      Email *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        className="rounded-xl bg-background border-border"
                      />
                    </FieldContent>
                    <FieldError errors={[errors.email]} />
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="phone"
                      className="text-xs font-semibold text-foreground"
                    >
                      Phone Number
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+213 555 123 456"
                        {...register("phone")}
                        className="rounded-xl bg-background border-border"
                      />
                    </FieldContent>
                    <FieldError errors={[errors.phone]} />
                  </Field>
                </div>

                {/* Row 3: Message */}
                <Field>
                  <FieldLabel
                    htmlFor="message"
                    className="text-xs font-semibold text-foreground"
                  >
                    Message
                  </FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Leave your message"
                      {...register("message")}
                      className="rounded-xl bg-background border-border resize-none"
                    />
                  </FieldContent>
                  <FieldError errors={[errors.message]} />
                </Field>

                {/* Submit Button (Porbe-Style Dark Pill Button) */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-slate-950 dark:bg-primary text-white font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Sending..." : "Submit Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Frequently Asked Questions (Porbe Contact Layout) ── */}
      <section className="py-20 lg:py-28 bg-muted/20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-3 mb-16 sm:mb-20">
              <SectionTag>FAQ</SectionTag>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {CONTACT_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={`border rounded-2xl sm:rounded-3xl transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-primary/40 bg-card shadow-sm"
                        : "border-border/80 bg-card/60 hover:border-primary/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif font-bold text-sm sm:text-base text-foreground leading-snug">
                        {index + 1}. {faq.question}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3 animate-in fade-in-0 duration-150">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Closing Banner (Porbe Design) ── */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="relative bg-[#183ce4] rounded-3xl sm:rounded-4xl p-10 sm:p-16 lg:p-20 text-white text-center shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            {/* Floating Circular Student Avatars */}
            <div className="hidden md:block absolute top-8 left-12 w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                alt="Student"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="hidden md:block absolute bottom-8 left-20 w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                alt="Student"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="hidden md:block absolute top-10 right-14 w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                alt="Student"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="hidden md:block absolute bottom-10 right-16 w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                alt="Student"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
                Are you prepared to soar and chase your dreams?
              </h2>

              <div className="pt-2 flex justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-4 rounded-full text-sm sm:text-base shadow-xl shadow-slate-950/20 hover:-translate-y-0.5 transition-all group"
                >
                  <span>Book a Consultation</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
