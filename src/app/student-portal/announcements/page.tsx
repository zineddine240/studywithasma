import { createClient } from "@/utils/supabase/server";
import { Bell, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { PortalCard } from "@/components/portal/shared/PortalCard";

export default async function StudentAnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* ── Header ── */}
      <section className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl border border-border">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight flex items-center gap-3 text-foreground">
          <Bell className="w-8 h-8 text-primary" />
          Announcements
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Stay up to date with the latest news, class updates, and platform updates from Asma.
        </p>
      </section>

      {/* ── List of Announcements ── */}
      <section className="space-y-4">
        {announcements && announcements.length > 0 ? (
          announcements.map((announcement) => {
            const dateObj = new Date(announcement.created_at);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <PortalCard key={announcement.id} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {announcement.title}
                </h2>
                <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {announcement.content}
                </div>
              </PortalCard>
            );
          })
        ) : (
          <PortalCard>
            <p className="text-muted-foreground text-sm py-4 text-center">
              No announcements available at this time.
            </p>
          </PortalCard>
        )}
      </section>
    </div>
  );
}
