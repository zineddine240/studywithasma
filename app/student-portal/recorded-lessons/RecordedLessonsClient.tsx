"use client";

import { useState } from "react";
import { Search, Filter, PlayCircle } from "lucide-react";
import {
  RecordedLessonCard,
  RecordedLessonData,
} from "@/components/portal/recorded-lessons/RecordedLessonCard";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { ProgressBar } from "@/components/portal/shared/ProgressBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface RecordedLessonsClientProps {
  lessons: RecordedLessonData[];
  continueWatchingLesson: RecordedLessonData | null;
}

export default function RecordedLessonsClient({
  lessons,
  continueWatchingLesson,
}: RecordedLessonsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [statusFilter, setStatusFilter] = useState("All Lessons");

  // Filtering logic
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesModule =
      moduleFilter === "All Modules" || lesson.module === moduleFilter;
    const matchesStatus =
      statusFilter === "All Lessons" || lesson.status === statusFilter;
    return matchesSearch && matchesModule && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      {/* ── Page Header ── */}
      <section className="bg-card text-card-foreground p-6 sm:p-10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            Recorded Lessons
          </h1>
          <p className="text-primary/70 text-lg max-w-2xl leading-relaxed">
            Watch your recorded classes, access lesson materials, and continue
            learning at your own pace.
          </p>
        </div>
      </section>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
        <div className="space-y-8">
          {/* ── Continue Watching (Only show if there's an in-progress lesson) ── */}
          {continueWatchingLesson && (
            <section>
              <SectionHeader
                title="Continue Watching"
                icon={<PlayCircle className="w-5 h-5" />}
              />
              <div className="bg-muted/30 rounded-2xl border border-border p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative aspect-video w-full sm:w-48 bg-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-white/80" />
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${continueWatchingLesson.progress || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grow w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                      {continueWatchingLesson.module}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {continueWatchingLesson.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {continueWatchingLesson.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <ProgressBar
                      progress={continueWatchingLesson.progress || 0}
                      className="max-w-50"
                    />
                    <span className="text-sm font-semibold text-muted-foreground">
                      {continueWatchingLesson.progress}% watched
                    </span>
                  </div>
                  <Link
                    href={`/student-portal/recorded-lessons/${continueWatchingLesson.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/80 transition-colors shadow-sm"
                  >
                    Continue Watching
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ── All Lessons Grid ── */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <SectionHeader title="All Lessons" />
              <p className="text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                {filteredLessons.length}{" "}
                {filteredLessons.length === 1 ? "lesson" : "lessons"} found
              </p>
            </div>

            {filteredLessons.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredLessons.map((lesson) => (
                  <RecordedLessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium">
                  No recorded lessons match your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setModuleFilter("All Modules");
                    setStatusFilter("All Lessons");
                  }}
                  className="mt-4 text-primary font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Side Column: Search and Filters ── */}
        <div className="space-y-6">
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm sticky top-24">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              Search & Filters
            </h3>

            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Module Filter */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  Module
                </label>
                <Select
                  value={moduleFilter}
                  onValueChange={(val) => setModuleFilter(val || "")}
                >
                  <SelectTrigger className="w-full h-11 px-4 rounded-xl border text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Modules">All Modules</SelectItem>
                    <SelectItem value="Introduction">Introduction</SelectItem>
                    <SelectItem value="Listening">Listening</SelectItem>
                    <SelectItem value="Reading">Reading</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Speaking">Speaking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Completion Filter */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  Status
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val || "")}
                >
                  <SelectTrigger className="w-full h-11 px-4 rounded-xl border text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Lessons">All Lessons</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
