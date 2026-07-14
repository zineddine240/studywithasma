import { Video, CalendarCheck, History, AlertCircle } from "lucide-react";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { ClassDetailsCard } from "@/components/portal/live-classes/ClassDetailsCard";
import { LiveClassCard } from "@/components/portal/live-classes/LiveClassCard";
import { upcomingClasses, pastClasses, cancelledRescheduledClasses } from "@/lib/mock/live-classes";

export default function LiveClassesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-8">
      
      {/* ── Page Header ── */}
      <section className="text-center sm:text-left bg-[#FAF7FF] p-6 sm:p-8 rounded-2xl border border-[#EDE9FE]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] mb-3 tracking-tight">
          Live Classes
        </h1>
        <p className="text-lg text-[#64748B] max-w-2xl leading-relaxed">
          View your upcoming online classes and join your Google Meet or Zoom sessions.
        </p>
      </section>

      {/* ── Next Live Class ── */}
      <section>
        <SectionHeader title="Your Next Class" icon={<Video className="w-5 h-5" />} />
        <ClassDetailsCard />
      </section>

      {/* ── Upcoming Classes ── */}
      <section>
        <SectionHeader title="Upcoming Classes" icon={<CalendarCheck className="w-5 h-5" />} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingClasses.map((c) => (
            <LiveClassCard key={c.id} {...c} />
          ))}
        </div>
      </section>
      
      {/* ── Cancelled / Rescheduled (Alerts) ── */}
      {cancelledRescheduledClasses.length > 0 && (
        <section>
          <SectionHeader title="Schedule Updates" icon={<AlertCircle className="w-5 h-5" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cancelledRescheduledClasses.map((c) => (
              <LiveClassCard key={c.id} {...c} />
            ))}
          </div>
        </section>
      )}

      {/* ── Past Classes ── */}
      <section>
        <SectionHeader title="Past Classes" icon={<History className="w-5 h-5" />} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastClasses.map((c) => (
            <LiveClassCard key={c.id} {...c} />
          ))}
        </div>
      </section>

    </div>
  );
}
