import { PlayCircle, ArrowRight } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { ProgressBar } from "../shared/ProgressBar";
import { continueLearning } from "@/lib/mock/student-dashboard";
import Link from "next/link";

export function ContinueLearningCard() {
  return (
    <PortalCard>
      <SectionHeader title="Continue Learning" icon={<PlayCircle className="w-5 h-5" />} />
      
      <div className="mt-2">
        <p className="text-sm font-semibold text-[#7C3AED] mb-1">
          {continueLearning.module}
        </p>
        <h3 className="font-bold text-[#1E1B4B] mb-4">
          {continueLearning.lesson}
        </h3>

        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold text-[#64748B] mb-2">
            <span>Course Progress</span>
            <span className="text-[#7C3AED]">{continueLearning.progress}%</span>
          </div>
          <ProgressBar progress={continueLearning.progress} />
        </div>

        <Link
          href="#"
          className="w-full flex items-center justify-center gap-2 bg-white text-[#1E1B4B] border border-[#E5E7EB] py-2.5 rounded-xl text-sm font-bold hover:bg-[#FAF7FF] hover:border-[#EDE9FE] transition-colors"
        >
          Continue Lesson
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </PortalCard>
  );
}
