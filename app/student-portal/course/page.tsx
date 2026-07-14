import { BookOpen, Target, CheckCircle2, FileText, ArrowRight, BookMarked, PlayCircle } from "lucide-react";
import Link from "next/link";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { StatusBadge } from "@/components/portal/shared/StatusBadge";
import { ProgressBar } from "@/components/portal/shared/ProgressBar";
import { studentData, courseModules, continueLearning } from "@/lib/mock/student-dashboard";

export default function MyCoursePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
      
      {/* ── Course Header ── */}
      <PortalCard className="bg-[#1E1B4B] text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED] rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10">
          <div className="inline-block bg-[#7C3AED] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            {studentData.course}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Academic IELTS Preparation
          </h1>
          <p className="text-[#C4B5FD] text-sm sm:text-base mb-6 max-w-2xl">
            Prepare for academic IELTS through structured lessons in Listening, Reading, Writing, and Speaking.
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
            <div>
              <p className="text-xs text-[#C4B5FD] mb-0.5 uppercase tracking-wider font-semibold">Group</p>
              <p className="font-bold text-sm">{studentData.group}</p>
            </div>
            <div>
              <p className="text-xs text-[#C4B5FD] mb-0.5 uppercase tracking-wider font-semibold">Target Band</p>
              <p className="font-bold text-sm">{studentData.targetBand}</p>
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Overall Progress</span>
              <span className="font-bold">{studentData.courseProgress}%</span>
            </div>
            <ProgressBar progress={studentData.courseProgress} className="bg-white/20 h-2" />
          </div>
        </div>
      </PortalCard>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-6 lg:gap-8">
        
        {/* ── Main Column ── */}
        <div className="space-y-6 lg:space-y-8">
          
          {/* Modules List */}
          <PortalCard>
            <SectionHeader title="Course Modules" icon={<BookOpen className="w-5 h-5" />} />
            
            <div className="mt-4 space-y-4">
              {courseModules.map((module) => (
                <div key={module.slug} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#C4B5FD] hover:shadow-sm transition-all group bg-white">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#1E1B4B]">{module.title}</h3>
                      <StatusBadge status={module.status} />
                    </div>
                    
                    <p className="text-sm text-[#64748B] mb-4 leading-relaxed">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
                        <BookMarked className="w-4 h-4 text-[#7C3AED]" />
                        {module.lessons} Lessons
                      </div>
                      <div className="flex items-center gap-2 flex-grow max-w-[150px]">
                        <ProgressBar progress={module.progress} className="h-1.5" />
                        <span className="text-xs font-semibold text-[#64748B] w-8 text-right">{module.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:self-center mt-4 sm:mt-0 shrink-0">
                    <Link
                      href={`/student-portal/course/${module.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF7FF] text-[#7C3AED] px-5 py-2.5 rounded-xl text-sm font-bold border border-[#EDE9FE] hover:bg-[#EDE9FE] transition-colors"
                    >
                      Open Module
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </PortalCard>
        </div>

        {/* ── Side Column ── */}
        <div className="space-y-6 lg:space-y-8">
          
          {/* Course Statistics */}
          <PortalCard>
            <SectionHeader title="Course Statistics" icon={<Target className="w-5 h-5" />} />
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1B4B]">
                  <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                  Modules
                </div>
                <span className="text-sm font-bold text-[#1E1B4B]">{courseModules.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1B4B]">
                  <BookMarked className="w-4 h-4 text-[#7C3AED]" />
                  Total Lessons
                </div>
                <span className="text-sm font-bold text-[#1E1B4B]">{studentData.totalLessons}</span>
              </div>
              
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Lessons Completed
                </div>
                <span className="text-sm font-bold text-emerald-700">{studentData.lessonsCompleted}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1B4B]">
                  <FileText className="w-4 h-4 text-[#7C3AED]" />
                  Assignments
                </div>
                <span className="text-sm font-bold text-[#1E1B4B]">{studentData.assignmentsSubmitted}</span>
              </div>
            </div>
          </PortalCard>

          {/* Continue Learning */}
          <PortalCard>
            <SectionHeader title="Continue Learning" icon={<PlayCircle className="w-5 h-5" />} />
            
            <div className="mt-4 p-4 rounded-xl bg-[#FAF7FF] border border-[#EDE9FE]">
              <p className="text-xs font-bold text-[#7C3AED] mb-1 uppercase tracking-wide">
                {continueLearning.module}
              </p>
              <h3 className="font-bold text-[#1E1B4B] mb-4">
                {continueLearning.lesson}
              </h3>
              
              <Link
                href={`/student-portal/course/${courseModules.find(m => m.title === continueLearning.module)?.slug || 'reading'}`}
                className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#4C1D95] transition-colors shadow-sm"
              >
                Continue Lesson
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </PortalCard>

        </div>
      </div>
    </div>
  );
}
