"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import AboutIllustration from "./AboutIllustration";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  staggerContainer,
  viewport,
} from "./motion";

export default function AboutSection() {
  return (
    <section className="py-24 bg-card border-b border-border" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Video / Illustration - slides in from left */}
          <motion.div
            className="relative w-full"
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <AboutIllustration />
          </motion.div>

          {/* Text - slides in from right, staggered children */}
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-secondary/80 text-primary uppercase tracking-wide border border-primary/10"
            >
              About Study with Asma
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-serif font-extrabold text-foreground leading-tight"
            >
              Achieve Your Dream Score <br />
              <span className="bg-linear-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                with Confidence
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Study with Asma is a premier online IELTS preparation platform
              designed to help students prepare for both Academic and General
              IELTS. Through structured lessons, recorded sessions, practical
              exercises, and personal guidance, students can improve their
              Listening, Reading, Writing, and Speaking skills with confidence.
            </motion.p>

            <motion.div variants={staggerContainer} className="space-y-4">
              {[
                "Expert guidance tailored to your current level",
                "Interactive learning environment",
                "Focus on real exam strategies and techniques",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start"
                >
                  <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 shrink-0" />
                  <p className="text-foreground font-semibold text-sm">
                    {text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
