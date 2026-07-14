import { MessageSquare, Award, ArrowRight } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { latestFeedback } from "@/lib/mock/student-dashboard";
import Link from "next/link";

export function TeacherFeedbackCard() {
  return (
    <PortalCard>
      <SectionHeader title="Latest Feedback" icon={<MessageSquare className="w-5 h-5" />} />
      
      <div className="mt-2">
        <h3 className="font-bold text-[#1E1B4B] mb-3">{latestFeedback.assignment}</h3>
        
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF7FF] border border-[#EDE9FE] mb-4">
          <Award className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
          <div>
            <span className="block text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-1">
              Estimated Band
            </span>
            <span className="text-xl font-extrabold text-[#1E1B4B]">
              {latestFeedback.estimatedBand}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-[#64748B] italic">"{latestFeedback.comment}"</p>
        </div>

        <Link
          href="#"
          className="w-full flex items-center justify-center gap-2 bg-white text-[#1E1B4B] border border-[#E5E7EB] py-2.5 rounded-xl text-sm font-bold hover:bg-[#FAF7FF] hover:border-[#EDE9FE] transition-colors"
        >
          View Full Feedback
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-[10px] text-[#94A3B8] text-center mt-3 px-2">
          Practice band estimates are for learning purposes and are not official IELTS results.
        </p>
      </div>
    </PortalCard>
  );
}
