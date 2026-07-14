import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, CheckCircle2, ChevronLeft, ChevronRight, FileText, Download, UploadCloud } from "lucide-react";
import { recordedLessonsData } from "@/lib/mock/recorded-lessons";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { StatusBadge } from "@/components/portal/shared/StatusBadge";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { VideoPlayerPlaceholder } from "@/components/portal/recorded-lessons/VideoPlayerPlaceholder";

export default async function RecordedLessonDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lessonIndex = recordedLessonsData.findIndex((l) => l.id === resolvedParams.id);
  
  if (lessonIndex === -1) {
    notFound();
  }

  const lesson = recordedLessonsData[lessonIndex];
  const prevLesson = lessonIndex > 0 ? recordedLessonsData[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < recordedLessonsData.length - 1 ? recordedLessonsData[lessonIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      
      {/* ── Back Navigation ── */}
      <Link 
        href="/student-portal/recorded-lessons" 
        className="inline-flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#7C3AED] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Recorded Lessons
      </Link>

      {/* ── Video Player Area ── */}
      <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-[#EDE9FE] bg-white">
        <VideoPlayerPlaceholder />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-6 lg:gap-8 pt-4">
        
        {/* ── Main Content ── */}
        <div className="space-y-8">
          
          {/* Lesson Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-bold text-[#7C3AED] bg-[#FAF7FF] px-2.5 py-1 rounded-md border border-[#EDE9FE] uppercase tracking-wide">
                {lesson.module}
              </span>
              <StatusBadge status={lesson.status} />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] mb-4">
              {lesson.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-[#64748B] pb-6 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                {lesson.duration}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#7C3AED]" />
                Published: {lesson.publishedDate}
              </div>
            </div>
          </div>

          {/* Description & Objectives */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1E1B4B] mb-2">Lesson Description</h2>
              <p className="text-[#64748B] leading-relaxed">{lesson.description}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-[#1E1B4B] mb-3">Objectives</h2>
              <ul className="space-y-2">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#64748B]">
                    <span className="text-[#7C3AED] mt-0.5">•</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#EDE9FE]">
            {prevLesson ? (
              <Link 
                href={`/student-portal/recorded-lessons/${prevLesson.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1E1B4B] px-5 py-2.5 rounded-xl text-sm font-bold border border-[#E5E7EB] hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                <div className="text-left">
                  <span className="block text-[10px] text-[#64748B] uppercase tracking-wider">Previous</span>
                  <span className="block truncate max-w-[150px]">{prevLesson.title}</span>
                </div>
              </Link>
            ) : <div className="w-full sm:w-auto"></div>}

            {nextLesson ? (
              <Link 
                href={`/student-portal/recorded-lessons/${nextLesson.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1E1B4B] px-5 py-2.5 rounded-xl text-sm font-bold border border-[#E5E7EB] hover:bg-slate-50 transition-colors text-right"
              >
                <div className="text-right">
                  <span className="block text-[10px] text-[#64748B] uppercase tracking-wider">Next Lesson</span>
                  <span className="block truncate max-w-[150px]">{nextLesson.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </Link>
            ) : <div className="w-full sm:w-auto"></div>}
          </div>
        </div>

        {/* ── Side Column ── */}
        <div className="space-y-6">
          
          {/* Mark as completed CTA */}
          <PortalCard className="bg-[#FAF7FF] border-[#C4B5FD] flex flex-col items-center text-center p-6">
            <CheckCircle2 className="w-12 h-12 text-[#7C3AED] mb-3 opacity-80" />
            <h3 className="font-bold text-[#1E1B4B] mb-1">Finished this lesson?</h3>
            <p className="text-xs text-[#64748B] mb-4">Mark it as completed to track your progress.</p>
            <button className="w-full bg-[#7C3AED] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#4C1D95] transition-colors shadow-sm">
              Mark as Completed
            </button>
          </PortalCard>

          {/* Resources */}
          {lesson.resources.length > 0 && (
            <PortalCard>
              <SectionHeader title="Resources" icon={<FileText className="w-5 h-5" />} />
              <div className="mt-4 space-y-3">
                {lesson.resources.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] hover:border-[#C4B5FD] transition-colors group bg-white">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-red-50 p-1.5 rounded-lg shrink-0">
                        <FileText className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-sm font-semibold text-[#1E1B4B] truncate">
                        {res.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-1.5 text-[#64748B] hover:text-[#7C3AED] hover:bg-[#FAF7FF] rounded-md transition-colors" title="View">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-[#64748B] hover:text-[#7C3AED] hover:bg-[#FAF7FF] rounded-md transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </PortalCard>
          )}

          {/* Homework */}
          {lesson.homework && (
            <PortalCard>
              <SectionHeader title="Homework" icon={<UploadCloud className="w-5 h-5" />} />
              <div className="mt-2">
                <h4 className="font-bold text-[#1E1B4B] mb-2">{lesson.homework.title}</h4>
                <p className="text-sm text-[#64748B] mb-4 leading-relaxed">
                  {lesson.homework.instructions}
                </p>
                <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 mb-4 text-xs font-bold text-red-700 flex justify-center">
                  Due: {lesson.homework.dueDate}
                </div>
                <Link
                  href="/student-portal/homework"
                  className="w-full flex items-center justify-center gap-2 bg-white text-[#1E1B4B] py-2.5 rounded-xl text-sm font-bold border border-[#E5E7EB] hover:bg-slate-50 transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  Submit Homework
                </Link>
              </div>
            </PortalCard>
          )}
        </div>
      </div>
    </div>
  );
}
