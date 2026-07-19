"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, CheckCircle } from "lucide-react";
import Link from "next/link";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, viewport } from "@/components/home/motion";

const philosophyCards = [
  {
    icon: Award,
    title: "Descriptive Precision",
    description:
      "We focus on vocabulary diversity, grammar complexity, task achievement, and coherence to hit band scores 7.5 and above.",
  },
  {
    icon: BookOpen,
    title: "Structured Learning",
    description:
      "Step-by-step learning modules with both live interactive classrooms and high-definition video recordings.",
  },
  {
    icon: CheckCircle,
    title: "Personalized Feedback",
    description:
      "Admins and trainers evaluate homework tasks manually and provide detailed correction breakdowns.",
  },
];

export default function AboutPageClient() {
  return (
    <main className="grow py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-5%] left-[-10%] w-[35rem] h-[35rem] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30rem] h-[30rem] bg-amber-500/5 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* ── Intro ── */}
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
            About Our Academy
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-serif font-extrabold text-foreground leading-tight"
          >
            Meet Asma &amp; <br />
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Study with Asma
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            We are dedicated to helping students and working professionals master
            the English language and ace their IELTS exam with top band scores.
          </motion.p>
        </motion.div>

        {/* ── Story Grid ── */}
        <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <motion.div
            className="space-y-6"
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              A Decade of IELTS Excellence
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Founded by Asma, a certified senior IELTS trainer and ex-British
              Council program lead, our academy was built on a single, powerful
              mission: to make high-scoring IELTS strategies accessible,
              structured, and easy to master online.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Unlike generic English courses, our program specifically targets
              the exact descriptors examiners use to score the Writing and
              Speaking sections, while equipping you with rapid comprehension
              strategies for Reading and Listening.
            </p>
          </motion.div>

          <motion.div
            className="relative"
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="aspect-[4/3] bg-muted/40 rounded-3xl p-6 sm:p-8 border border-border flex items-center justify-center">
              <div className="w-full h-full bg-card rounded-2xl p-6 flex flex-col justify-center border border-border text-center">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-foreground mb-1">
                  Senior IELTS Specialist
                </h3>
                <p className="text-xs text-muted-foreground">
                  Certified teacher with 10+ years of active IELTS curriculum
                  design and training experience.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Philosophy Cards ── */}
        <div className="space-y-12">
          <motion.h2
            className="text-2xl sm:text-3xl font-serif font-bold text-center text-foreground"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            Our Teaching Philosophy
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {philosophyCards.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-card p-6 sm:p-8 rounded-2xl border border-border space-y-4"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── CTA ── */}
        <motion.div
          className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center space-y-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Get Ready to Score Higher
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Enroll today to secure access to live training, our complete
            recorded lessons library, and advanced level test evaluations.
          </p>
          <div className="pt-2">
            <Link
              href="/request-access"
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold hover:bg-primary/90 transition-colors inline-block"
            >
              Get Access Now
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
