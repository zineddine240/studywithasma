import { Bell, ArrowRight } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { createClient } from "@/utils/supabase/server";

export async function AnnouncementsCard() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <PortalCard>
      <SectionHeader
        title="Announcements"
        icon={<Bell className="w-5 h-5" />}
      />

      <div className="mt-4 space-y-4">
        {(announcements || []).map((announcement) => {
          const dateObj = new Date(announcement.created_at);
          return (
            <div
              key={announcement.id}
              className="relative pl-4 border-l-2 border-[#E5E7EB] hover:border-primary transition-colors pb-1"
            >
              <div className="absolute w-2 h-2 bg-primary rounded-full -left-1.25 top-1.5 ring-4 ring-white"></div>
              <p className="text-xs font-bold text-muted-foreground mb-1">
                {dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h4 className="text-sm font-bold text-foreground mb-1 leading-tight">
                {announcement.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {announcement.content}
              </p>
            </div>
          );
        })}
        {(!announcements || announcements.length === 0) && (
          <p className="text-sm text-slate-500 py-2">No new announcements.</p>
        )}

        {announcements && announcements.length > 0 && (
          <button className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 w-fit transition-colors pt-2">
            Read all announcements
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </PortalCard>
  );
}
