import { Megaphone, Info } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { announcements } from "@/lib/mock/student-dashboard";

export function AnnouncementsCard() {
  return (
    <PortalCard>
      <SectionHeader title="Announcements" icon={<Megaphone className="w-5 h-5" />} />
      
      <div className="mt-4 space-y-3">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Info className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-[#1E1B4B] leading-relaxed">
              {announcement.message}
            </p>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-sm text-[#64748B] text-center py-4">No new announcements.</p>
        )}
      </div>
    </PortalCard>
  );
}
