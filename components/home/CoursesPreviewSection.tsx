"use client";

import { motion } from "framer-motion";
import { BookOpen, Headphones, PenTool, Mic, BookText, ArrowRight } from 'lucide-react';
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
  if (slug.includes("general")) return <BookText className="w-8 h-8 text-primary" />;
  return <BookOpen className="w-8 h-8 text-primary" />;
};

export default function CoursesPreviewSection({ courses }: CoursesPreviewSectionProps) {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="py-24 bg-card border-t border-b border-border" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-foreground mb-4">
            Our IELTS Courses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the right path for your goals. We offer comprehensive preparation for both Academic and General IELTS.
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
              className="bg-background rounded-3xl p-8 sm:p-10 border border-border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border border-border">
                    {getCourseIcon(course.slug)}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-primary">
                    {course.badge}
                  </span>
                </div>
                
                <h3 className="text-2xl font-serif font-extrabold text-foreground mb-3">{course.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {course.shortDescription}
                </p>
                
                {course.modules && course.modules.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Course Modules</h4>
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
                          className="flex items-center text-foreground font-medium bg-muted/40 px-4 py-3 rounded-xl border border-border"
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

              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/courses/${course.slug}`}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-200 text-center text-sm flex items-center justify-center gap-2"
                >
                  View Course
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/request-access?course=${course.slug}`}
                  className="flex-1 bg-muted/50 text-foreground border border-border px-6 py-3 rounded-full font-semibold hover:bg-secondary hover:border-border transition-all duration-200 text-center text-sm flex items-center justify-center"
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

