"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer, viewport } from "./motion";

export default function CtaSection() {
  return (
    <section
      className="py-24 bg-card border-t border-border relative overflow-hidden"
      id="contact"
    >
      {/* Liquid glass light blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-140 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-foreground leading-tight"
        >
          Ready to Achieve Your <br />
          <span className="bg-linear-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
            Target Band Score?
          </span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Join thousands of students who have prepared with Asma through
          structured live classes, personal grading, and advanced interactive
          tests.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link
            href="/request-access"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Get Admission
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="bg-muted/50 text-foreground border border-border px-8 py-4 rounded-full font-bold hover:bg-secondary hover:border-border transition-colors flex items-center justify-center cursor-pointer"
          >
            Contact Instructor
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
