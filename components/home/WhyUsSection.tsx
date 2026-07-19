"use client";

import { motion } from "framer-motion";
import { Route, BookOpen, Video, PenTool, MessageCircle, Laptop } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from "./motion";

const reasons = [
  {
    title: "Structured IELTS learning path",
    description: "Follow a clear, step-by-step curriculum designed to take you from basics to advanced test strategies.",
    icon: <Route className="w-5 h-5 text-primary" />
  },
  {
    title: "Academic and General IELTS preparation",
    description: "Tailored content for both Academic and General modules to suit your specific migration or study goals.",
    icon: <BookOpen className="w-5 h-5 text-primary" />
  },
  {
    title: "Live and recorded lessons",
    description: "Attend interactive live classes or watch high-quality recorded sessions anytime, anywhere.",
    icon: <Video className="w-5 h-5 text-primary" />
  },
  {
    title: "Clear explanations and practical exercises",
    description: "Understand complex topics easily and practice with exercises that mirror the real IELTS exam.",
    icon: <PenTool className="w-5 h-5 text-primary" />
  },
  {
    title: "Personal guidance and teacher feedback",
    description: "Receive detailed, constructive feedback on your writing and speaking tasks to continuously improve.",
    icon: <MessageCircle className="w-5 h-5 text-primary" />
  },
  {
    title: "Flexible online learning",
    description: "Learn at your own pace with an intuitive platform accessible from any device.",
    icon: <Laptop className="w-5 h-5 text-primary" />
  }
];

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-background" id="why-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-foreground mb-4">
            Why Study with Asma
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              className="bg-card p-6 sm:p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border mb-6">
                {reason.icon}
              </div>
              <h3 className="text-lg font-serif font-extrabold text-foreground mb-3">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
