import { FileText, Calendar, UploadCloud } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { StatusBadge } from "../shared/StatusBadge";
import { pendingHomework } from "@/lib/mock/student-dashboard";
import Link from "next/link";

export function HomeworkCard() {
  return (
    <PortalCard>
      <SectionHeader title="Homework" icon={<FileText className="w-5 h-5" />} />
      
      <div className="mt-2">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="font-bold text-[#1E1B4B]">{pendingHomework.title}</h3>
          <StatusBadge status={pendingHomework.status} />
        </div>

        <div className="flex items-center gap-2 text-sm text-[#B91C1C] bg-red-50 p-3 rounded-xl border border-red-100 mb-4">
          <Calendar className="w-4 h-4" />
          <span className="font-semibold">Due: {pendingHomework.dueDate}</span>
        </div>

        <Link
          href="#"
          className="w-full flex items-center justify-center gap-2 bg-white text-[#1E1B4B] border border-[#E5E7EB] py-2.5 rounded-xl text-sm font-bold hover:bg-[#FAF7FF] hover:border-[#EDE9FE] transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          Submit Homework
        </Link>
      </div>
    </PortalCard>
  );
}
