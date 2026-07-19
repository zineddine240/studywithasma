"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ClipboardList } from "lucide-react";
import RequestAccessForm from "@/components/forms/RequestAccessForm";
import { fadeUp, staggerContainer, viewport } from "@/components/home/motion";

function RequestAccessContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course") ?? "";
  const validCourses = ["academic-ielts", "general-ielts"];
  const defaultCourse = validCourses.includes(courseParam) ? courseParam : "";

  return (
    <main className="grow">
      {/* ── Page Header ── */}
      <section className="bg-muted/30 py-14 sm:py-18 border-b border-border">
        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto"
          >
            <ClipboardList className="w-7 h-7 text-primary" />
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight"
          >
            Request Course Access
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Fill in the form below to request enrollment in an IELTS course. We
            will review your request and contact you with the next steps.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Form Section ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-card rounded-2xl border border-border p-6 sm:p-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <RequestAccessForm defaultCourse={defaultCourse} />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default function RequestAccessPage() {
  return (
    <Suspense>
      <RequestAccessContent />
    </Suspense>
  );
}
