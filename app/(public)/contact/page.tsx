"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "./actions";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, viewport } from "@/components/home/motion";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const infoItems = [
  {
    icon: Mail,
    label: "Email",
    value: "asma@studywithasma.com",
    href: "mailto:asma@studywithasma.com",
  },
  {
    icon: MessageCircle,
    label: "Telegram",
    value: "@studywithasma",
    href: "https://t.me/studywithasma",
    external: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Algiers, Algeria",
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const result = await submitContactForm(data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Thank you! Your message has been sent successfully.");
    reset();
  };

  return (
    <main className="grow py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-5%] right-[-10%] w-140 h-140 bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-15%] w-120 h-120 bg-amber-500/5 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ── Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-secondary/80 text-primary uppercase tracking-wide border border-primary/10"
          >
            Get In Touch
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-serif font-extrabold text-foreground leading-tight"
          >
            Contact{" "}
            <span className="bg-linear-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Asma
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed">
            Have questions about live classes, enrollment packages, or level
            tests? Send a message and Asma will reply as soon as possible.
          </motion.p>
        </motion.div>

        {/* ── Content Grid ── */}
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Side Info Cards */}
          <motion.div
            className="space-y-6 lg:col-span-1"
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="bg-card p-6 rounded-2xl border border-border space-y-6">
              <h2 className="text-xl font-serif font-bold text-foreground">
                Contact Information
              </h2>
              <div className="space-y-4">
                {infoItems.map(({ icon: Icon, label, value, href, external }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">{label}</span>
                      {href ? (
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noreferrer" : undefined}
                          className="text-sm font-semibold text-foreground hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-sm font-semibold text-foreground">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="bg-card p-8 rounded-3xl border border-border lg:col-span-2"
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <FieldContent>
                    <Input id="name" type="text" placeholder="Your name" {...register("name")} />
                  </FieldContent>
                  <FieldError errors={[errors.name]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <FieldContent>
                    <Input id="email" type="email" placeholder="your.email@example.com" {...register("email")} />
                  </FieldContent>
                  <FieldError errors={[errors.email]} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <FieldContent>
                  <Input id="subject" type="text" placeholder="What are you writing about?" {...register("subject")} />
                </FieldContent>
                <FieldError errors={[errors.subject]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <FieldContent>
                  <Textarea id="message" rows={6} placeholder="Type your message here..." {...register("message")} />
                </FieldContent>
                <FieldError errors={[errors.message]} />
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
