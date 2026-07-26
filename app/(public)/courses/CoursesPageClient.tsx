"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, Sparkles, Video, Users, FileText, Target, ShieldCheck } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import type { CourseSummary } from "@/lib/courseData";
import { fadeUp, fadeLeft, staggerContainer, viewport } from "@/components/home/motion";

const features = [
  { 
    title: "Live Masterclasses", 
    desc: "Interactive weekly sessions covering advanced strategies for all 4 modules.",
    icon: Video,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  { 
    title: "Personalized Grading", 
    desc: "Detailed, line-by-line feedback on your writing tasks and speaking recordings.",
    icon: Target,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  { 
    title: "Video Library", 
    desc: "On-demand access to a growing library of high-definition lesson recordings.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  { 
    title: "Mock Exams", 
    desc: "Full-length practice tests designed to simulate real exam conditions.",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  { 
    title: "Study Resources", 
    desc: "Exclusive PDF workbooks, vocabulary lists, and grammar guides.",
    icon: ShieldCheck,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  { 
    title: "Private Community", 
    desc: "Direct access to Asma and fellow students for daily Q&A and support.",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export default function CoursesPageClient({ courses }: { courses: CourseSummary[] }) {
  return (
    <main className="grow bg-background">
      {/* ── Dynamic Hero Section ── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-muted/30 border-b border-border">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6 flex flex-col items-center"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-border shadow-sm text-sm font-bold tracking-wide uppercase text-foreground mb-4"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              World-Class Curriculum
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-serif font-extrabold text-foreground tracking-tight max-w-4xl leading-tight"
            >
              Choose Your Path to <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                IELTS Success
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Prepare with structured lessons, live interactive masterclasses, recorded
              sessions, and personal feedback directly from a certified senior trainer.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Interactive Feature Grid (Bento) ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Everything Included in Your Enrollment
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl font-medium">
              We provide a comprehensive, 360-degree learning ecosystem designed specifically for IELTS band score improvement.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Course Cards ── */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">Select Your Course</h2>
            <p className="text-muted-foreground text-lg font-medium">
              Find the perfect track for your immigration or academic goals.
            </p>
          </motion.div>
          
          {courses.length === 0 ? (
            <motion.div 
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Courses Coming Soon
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Our curriculum is being finalized. Check back soon or
                request access to get notified the moment we launch.
              </p>
              <Link
                href="/request-access"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                Request Access
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {courses.map((course) => (
                <motion.div key={course.id} variants={fadeUp}>
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      {courses.length > 0 && (
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-10">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight mb-8">
                Ready to Start Your IELTS Journey?
              </h2>
              <Link
                href="/request-access"
                className="inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-full text-lg font-bold hover:bg-muted/10 hover:text-white transition-all shadow-xl hover:-translate-y-1"
              >
                Create Your Student Account
                <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
