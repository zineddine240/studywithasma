"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  BookText,
  ArrowRight,
} from "lucide-react";
import { fadeUp, staggerContainer, viewport } from "./motion";
import type { CourseWithModules } from "@/lib/courseData";
import Link from "next/link";

interface CoursesPreviewSectionProps {
  courses: CourseWithModules[];
}

const getModuleIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("intro")) return <BookOpen className="w-4 h-4" />;
  if (lower.includes("listening")) return <Headphones className="w-4 h-4" />;
  if (lower.includes("reading")) return <BookText className="w-4 h-4" />;
  if (lower.includes("writing")) return <PenTool className="w-4 h-4" />;
  if (lower.includes("speaking")) return <Mic className="w-4 h-4" />;
  return <BookOpen className="w-4 h-4" />;
};

const getCourseIcon = (slug: string) => {
  if (slug.includes("general"))
    return <BookText className="w-8 h-8 text-white" />;
  return <BookOpen className="w-8 h-8 text-white" />;
};

export default function CoursesPreviewSection({
  courses,
}: CoursesPreviewSectionProps) {
  if (!courses || courses.length === 0) return null;

  return (
    <section
      className="py-24 bg-linear-to-b from-background to-secondary/30 relative"
      id="courses"
    >
      {/* Decorative energetic background shape */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-[-10%] w-125 h-125 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-extrabold text-foreground mb-6">
            Our IELTS Courses
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Choose the right path for your goals. We offer comprehensive
            preparation for both Academic and General IELTS.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={fadeUp}
              className="group bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-lg hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    {getCourseIcon(course.slug)}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    {course.badge}
                  </span>
                </div>

                <h3 className="text-3xl font-serif font-extrabold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed font-medium">
                  {course.shortDescription}
                </p>

                {course.modules && course.modules.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-8 h-px bg-primary/30" />
                      Course Modules
                    </h4>
                    <motion.ul
                      className="space-y-3"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewport}
                    >
                      {course.modules.map((module) => (
                        <motion.li
                          key={module.id}
                          variants={fadeUp}
                          className="flex items-center text-foreground font-medium bg-secondary/30 px-4 py-3 rounded-xl border border-secondary/50 group-hover:bg-secondary/50 transition-colors"
                        >
                          <span className="text-primary mr-3">
                            {getModuleIcon(module.name)}
                          </span>
                          <span className="text-sm font-semibold">
                            Module {module.number}: {module.name}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg transition-all duration-200 text-center text-sm flex items-center justify-center gap-2 group/btn"
                >
                  View Course
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/request-access?course=${course.slug}`}
                  className="flex-1 bg-muted/50 text-foreground border border-border px-6 py-4 rounded-xl font-bold hover:bg-secondary hover:border-border transition-all duration-200 text-center text-sm flex items-center justify-center"
                >
                  Request Access
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
