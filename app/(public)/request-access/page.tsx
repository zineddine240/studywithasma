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
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            
            {/* ── Trust Reassurance Panel (Left) ── */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.div variants={fadeUp}>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                  <ClipboardList className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-foreground tracking-tight mb-4">
                  Request Course Access
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Fill in the form to request enrollment. We will review your request and get back to you with the next steps within 24 hours.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl p-6 shadow-sm relative">
                <div className="absolute -top-3 -right-3 text-6xl text-primary/10 font-serif leading-none">"</div>
                <p className="text-sm font-medium text-foreground italic mb-4 leading-relaxed">
                  "I was hesitant to join another online course, but Asma's personal feedback was exactly what I needed. Best decision I made for my IELTS prep!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                    <span className="text-amber-600 font-bold text-sm">A.H.</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Ahmed H.</p>
                    <p className="text-xs text-muted-foreground">Band 8.0 Achiever</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted/40 p-4 rounded-xl">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your information is 100% secure and will never be shared.
              </motion.div>
            </motion.div>

            {/* ── Form Section (Right) ── */}
            <motion.div
              className="lg:col-span-3 bg-card rounded-[2rem] border border-border p-6 sm:p-10 shadow-xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <RequestAccessForm defaultCourse={defaultCourse} />
            </motion.div>

          </div>
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
