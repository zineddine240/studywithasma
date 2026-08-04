"use client";

import { motion } from "framer-motion";
import { Users, BookOpenCheck, Award, Globe } from "lucide-react";
import { fadeUp, staggerContainer, viewport } from "./motion";

const stats = [
  {
    icon: <Users className="w-8 h-8 text-amber-500" />,
    value: "370+",
    label: "Students"
  },
  {
    icon: <Award className="w-8 h-8 text-amber-500" />,
    value: "45",
    label: "Students Passed Exams"
  },
  {
    icon: <BookOpenCheck className="w-8 h-8 text-amber-500" />,
    value: "35",
    label: "Successful students"
  },
  {
    icon: <Globe className="w-8 h-8 text-amber-500" />,
    value: "5",
    label: "Countries Reached"
  }
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="text-center flex flex-col items-center group"
            >
              <div className="mb-4 p-4 bg-white/10 rounded-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                {stat.icon}
              </div>
              <h3 className="text-4xl sm:text-5xl font-serif font-extrabold text-white mb-2 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-primary-foreground/80 font-medium text-sm sm:text-base uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
