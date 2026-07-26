"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { fadeUp, staggerContainer } from "./motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 text-center">
        <motion.div
          className="max-w-4xl mx-auto space-y-8 flex flex-col items-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-bold tracking-widest uppercase border border-white/20 shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Premium Online IELTS Preparation
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-white leading-[1.05] tracking-tight"
          >
            Master IELTS with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 drop-shadow-sm">
              Absolute Confidence
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl font-medium"
          >
            Join Asma's intensive live classes and recorded sessions. 
            Get the personal guidance you need to achieve your dream band score.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 pt-8 w-full sm:w-auto"
          >
            <a
              href="#contact"
              className="group relative bg-amber-500 text-amber-950 px-10 py-5 rounded-full font-bold text-lg hover:bg-amber-400 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] hover:-translate-y-1"
            >
              Start Learning Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/courses"
              className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer gap-3"
            >
              <Play className="w-5 h-5 fill-white/80" />
              Explore Courses
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
