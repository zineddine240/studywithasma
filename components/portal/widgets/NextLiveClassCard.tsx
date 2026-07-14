import { Video, Calendar, ExternalLink } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { StatusBadge } from "../shared/StatusBadge";
import { SectionHeader } from "../shared/SectionHeader";
import { nextLiveClass } from "@/lib/mock/student-dashboard";

export function NextLiveClassCard() {
  return (
    <PortalCard>
      <SectionHeader title="Next Live Class" icon={<Video className="w-5 h-5" />} />
      
      <div className="mt-2 space-y-4">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-bold text-[#1E1B4B]">{nextLiveClass.title}</h3>
            <StatusBadge status={nextLiveClass.status} />
          </div>
          <p className="text-sm text-[#64748B]">Module: {nextLiveClass.module}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#1E1B4B] bg-[#FAF7FF] p-3 rounded-xl border border-[#EDE9FE]">
          <Calendar className="w-4 h-4 text-[#7C3AED]" />
          <span className="font-semibold">{nextLiveClass.date}</span>
        </div>

        <a
          href={nextLiveClass.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#4C1D95] transition-colors"
        >
          Join Class on {nextLiveClass.platform}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </PortalCard>
  );
}
