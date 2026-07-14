import { Calendar, Clock, Video, User, FileText, ExternalLink } from "lucide-react";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { StatusBadge } from "@/components/portal/shared/StatusBadge";
import { nextLiveClassDetails } from "@/lib/mock/live-classes";

export function ClassDetailsCard() {
  const c = nextLiveClassDetails;

  return (
    <PortalCard className="bg-white border-[#EDE9FE]">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-[#7C3AED] bg-[#FAF7FF] px-2.5 py-1 rounded-md border border-[#EDE9FE] uppercase tracking-wide">
              {c.module}
            </span>
            <StatusBadge status={c.status} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1E1B4B] mb-2">{c.title}</h2>
          <p className="text-[#64748B] font-medium text-sm">Course: {c.course}</p>
        </div>

        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#4C1D95] transition-colors shadow-sm shrink-0"
        >
          Join Class
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <Calendar className="w-5 h-5 text-[#7C3AED]" />
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Date</p>
            <p className="text-sm font-bold text-[#1E1B4B]">{c.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <Clock className="w-5 h-5 text-[#7C3AED]" />
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Time</p>
            <p className="text-sm font-bold text-[#1E1B4B]">{c.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <Video className="w-5 h-5 text-[#7C3AED]" />
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Platform</p>
            <p className="text-sm font-bold text-[#1E1B4B]">{c.platform}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <User className="w-5 h-5 text-[#7C3AED]" />
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Teacher</p>
            <p className="text-sm font-bold text-[#1E1B4B]">{c.teacher}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-[#1E1B4B] mb-2">Class Description</h3>
          <p className="text-sm text-[#64748B] leading-relaxed">{c.description}</p>
        </div>

        <div>
          <h3 className="font-bold text-[#1E1B4B] mb-2">Objectives</h3>
          <ul className="list-disc list-inside text-sm text-[#64748B] space-y-1">
            {c.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-[#1E1B4B] mb-2">Preparation</h3>
          <p className="text-sm text-[#64748B] leading-relaxed mb-3">{c.preparation}</p>
          <a
            href={c.materialsUrl}
            className="inline-flex items-center gap-2 bg-[#FAF7FF] text-[#7C3AED] px-4 py-2 rounded-lg text-sm font-semibold border border-[#EDE9FE] hover:bg-[#EDE9FE] transition-colors"
          >
            <FileText className="w-4 h-4" />
            Download Preparation Materials (PDF)
          </a>
        </div>
      </div>
    </PortalCard>
  );
}
