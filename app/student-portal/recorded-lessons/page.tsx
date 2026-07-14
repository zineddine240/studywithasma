"use client";

import { useState } from "react";
import { Search, Filter, PlayCircle } from "lucide-react";
import { recordedLessonsData, continueWatchingLesson } from "@/lib/mock/recorded-lessons";
import { RecordedLessonCard } from "@/components/portal/recorded-lessons/RecordedLessonCard";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { ProgressBar } from "@/components/portal/shared/ProgressBar";
import Link from "next/link";

export default function RecordedLessonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [statusFilter, setStatusFilter] = useState("All Lessons");

  // Filtering logic
  const filteredLessons = recordedLessonsData.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === "All Modules" || lesson.module === moduleFilter;
    const matchesStatus = statusFilter === "All Lessons" || lesson.status === statusFilter;
    return matchesSearch && matchesModule && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      
      {/* ── Page Header ── */}
      <section className="bg-[#1E1B4B] text-white p-6 sm:p-10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED] rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            Recorded Lessons
          </h1>
          <p className="text-[#C4B5FD] text-lg max-w-2xl leading-relaxed">
            Watch your recorded classes, access lesson materials, and continue learning at your own pace.
          </p>
        </div>
      </section>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
        <div className="space-y-8">
          
          {/* ── Continue Watching (Only show if there's an in-progress lesson) ── */}
          {continueWatchingLesson && (
            <section>
              <SectionHeader title="Continue Watching" icon={<PlayCircle className="w-5 h-5" />} />
              <div className="bg-[#FAF7FF] rounded-2xl border border-[#EDE9FE] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative aspect-video w-full sm:w-48 bg-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-white/80" />
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
                    <div className="h-full bg-[#7C3AED]" style={{ width: `${continueWatchingLesson.progress}%` }}></div>
                  </div>
                </div>
                <div className="flex-grow w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wide">
                      {continueWatchingLesson.module}
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">
                      {continueWatchingLesson.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1E1B4B] mb-3">{continueWatchingLesson.title}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <ProgressBar progress={continueWatchingLesson.progress || 0} className="max-w-[200px]" />
                    <span className="text-sm font-semibold text-[#64748B]">{continueWatchingLesson.progress}% watched</span>
                  </div>
                  <Link
                    href={`/student-portal/recorded-lessons/${continueWatchingLesson.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#4C1D95] transition-colors shadow-sm"
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
              <p className="text-sm font-semibold text-[#64748B] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'} found
              </p>
            </div>
            
            {filteredLessons.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredLessons.map((lesson) => (
                  <RecordedLessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[#64748B] font-medium">No recorded lessons match your search criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setModuleFilter("All Modules"); setStatusFilter("All Lessons"); }}
                  className="mt-4 text-[#7C3AED] font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Side Column: Search and Filters ── */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#EDE9FE] shadow-sm sticky top-24">
            <h3 className="font-bold text-[#1E1B4B] flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#7C3AED]" />
              Search & Filters
            </h3>
            
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 focus:border-[#7C3AED] transition-all"
                  />
                </div>
              </div>

              {/* Module Filter */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">Module</label>
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 focus:border-[#7C3AED] transition-all"
                >
                  <option>All Modules</option>
                  <option>Introduction</option>
                  <option>Listening</option>
                  <option>Reading</option>
                  <option>Writing</option>
                  <option>Speaking</option>
                </select>
              </div>

              {/* Completion Filter */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 focus:border-[#7C3AED] transition-all"
                >
                  <option>All Lessons</option>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
