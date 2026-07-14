import { Target, BookOpen, ClipboardCheck, MessageSquare } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { ProgressBar } from "../shared/ProgressBar";
import { studentData } from "@/lib/mock/student-dashboard";

export function ProgressSummaryCard() {
  return (
    <PortalCard>
      <SectionHeader title="Course Progress" icon={<Target className="w-5 h-5" />} />
      
      <div className="mt-4">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-semibold text-[#64748B]">Overall Progress</span>
          <span className="text-2xl font-extrabold text-[#1E1B4B]">{studentData.courseProgress}%</span>
        </div>
        <ProgressBar progress={studentData.courseProgress} className="h-3 mb-6" />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7FF] border border-[#EDE9FE]">
            <div className="flex items-center gap-2 text-sm font-medium text-[#1E1B4B]">
              <BookOpen className="w-4 h-4 text-[#7C3AED]" />
              Lessons Completed
            </div>
            <span className="text-sm font-bold text-[#7C3AED]">
              {studentData.lessonsCompleted} / {studentData.totalLessons}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7FF] border border-[#EDE9FE]">
            <div className="flex items-center gap-2 text-sm font-medium text-[#1E1B4B]">
              <ClipboardCheck className="w-4 h-4 text-[#7C3AED]" />
              Assignments Submitted
            </div>
            <span className="text-sm font-bold text-[#7C3AED]">{studentData.assignmentsSubmitted}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7FF] border border-[#EDE9FE]">
            <div className="flex items-center gap-2 text-sm font-medium text-[#1E1B4B]">
              <MessageSquare className="w-4 h-4 text-[#7C3AED]" />
              Feedback Received
            </div>
            <span className="text-sm font-bold text-[#7C3AED]">{studentData.feedbackReceived}</span>
          </div>
        </div>
      </div>
    </PortalCard>
  );
}
