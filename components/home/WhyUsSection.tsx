"use client";

import { motion } from "framer-motion";
import { Route, BookOpen, Video, PenTool, MessageCircle, Laptop } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from "./motion";

const reasons = [
  {
    title: "Structured IELTS learning path",
    description: "Follow a clear, step-by-step curriculum designed to take you from basics to advanced test strategies.",
    icon: <Route className="w-6 h-6 text-white" />
  },
  {
    title: "Academic & General preparation",
    description: "Tailored content for both Academic and General modules to suit your specific migration or study goals.",
    icon: <BookOpen className="w-6 h-6 text-white" />
  },
  {
    title: "Live and recorded lessons",
    description: "Attend interactive live classes or watch high-quality recorded sessions anytime, anywhere.",
    icon: <Video className="w-6 h-6 text-white" />
  },
  {
    title: "Clear explanations & exercises",
    description: "Understand complex topics easily and practice with exercises that mirror the real IELTS exam.",
    icon: <PenTool className="w-6 h-6 text-white" />
  },
  {
    title: "Personal guidance & feedback",
    description: "Receive detailed, constructive feedback on your writing and speaking tasks to continuously improve.",
    icon: <MessageCircle className="w-6 h-6 text-white" />
  },
  {
    title: "Flexible online learning",
    description: "Learn at your own pace with an intuitive platform accessible from any device.",
    icon: <Laptop className="w-6 h-6 text-white" />
  }
];

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="why-us">
      {/* Background accents */}
      <div className="absolute left-[-10%] top-[20%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute right-[-10%] bottom-[10%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-extrabold text-foreground mb-6">
            Why Study with Asma
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Everything you need to succeed in your IELTS journey, brought together in one comprehensive learning experience.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="group bg-card p-8 sm:p-10 rounded-[2rem] border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-serif font-extrabold text-foreground mb-4 group-hover:text-primary transition-colors">{reason.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
