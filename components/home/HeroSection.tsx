"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroIllustration from "./HeroIllustration";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, viewport } from "./motion";

export default function HeroSection() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden bg-background">
      {/* Decorative gradient blurs for Liquid Glass style */}
      <div className="absolute top-[-10%] left-[-15%] w-160 h-160 bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-140 h-140 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: Text content ── */}
          <motion.div
            className="relative z-10 space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 text-primary text-xs font-bold tracking-wide uppercase border border-primary/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Online IELTS Preparation
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-foreground leading-[1.1] tracking-tight"
            >
              Master IELTS with <br />
              <span className="bg-linear-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                Confidence
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg"
            >
              Learn IELTS Academic and General with Asma through structured
              lessons, recorded sessions, and personal guidance.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <a
                href="#contact"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/courses"
                className="bg-muted/50 text-foreground border border-border px-8 py-4 rounded-full font-bold hover:bg-secondary hover:border-border transition-colors flex items-center justify-center cursor-pointer"
              >
                Explore Courses
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: Illustration (Video Player) ── */}
          <motion.div
            className="relative lg:ml-4 w-full"
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
