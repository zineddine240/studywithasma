"use client";

import { motion } from "framer-motion";
import { fadeUp, viewport } from "./motion";
import { Download, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LeadMagnetSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="free-resources">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="bg-gradient-to-br from-primary to-purple-800 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Decorative shapes inside the card */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div variants={fadeUp} className="space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
                Not ready for a full course yet? <br />
                <span className="text-amber-400">Take our Free Level Test</span>
              </h2>
              <p className="text-lg text-white/80 font-medium max-w-lg leading-relaxed">
                Discover your current IELTS band score estimate in just 15 minutes. Get personalized recommendations on what you need to focus on.
              </p>

              <div className="space-y-4">
                {[
                  "Accurate band score estimate",
                  "Identify your weak areas",
                  "Personalized study roadmap"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-amber-400 shrink-0" />
                    <span className="text-white font-semibold">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-card p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Start Your Free Test</h3>
              
              <div className="space-y-6">
                <p className="text-muted-foreground text-center font-medium mb-8">
                  Join hundreds of students who discovered their baseline score for free.
                </p>
                <Link
                  href="/level-test"
                  className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <Download className="w-5 h-5" />
                  Take Free Level Test
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  No credit card required. Takes approximately 15 minutes.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
