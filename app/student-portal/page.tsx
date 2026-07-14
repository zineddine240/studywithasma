import { WelcomeCard } from "@/components/portal/widgets/WelcomeCard";
import { NextLiveClassCard } from "@/components/portal/widgets/NextLiveClassCard";
import { ContinueLearningCard } from "@/components/portal/widgets/ContinueLearningCard";
import { ProgressSummaryCard } from "@/components/portal/widgets/ProgressSummaryCard";
import { CourseModulesList } from "@/components/portal/widgets/CourseModulesList";
import { RecentLessonsList } from "@/components/portal/widgets/RecentLessonsList";
import { AnnouncementsCard } from "@/components/portal/widgets/AnnouncementsCard";

export default function StudentDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:gap-8">
      
      {/* ── Main Column ── */}
      <div className="flex flex-col gap-6 lg:gap-8">
        <WelcomeCard />
        <CourseModulesList />
        <RecentLessonsList />
      </div>

      {/* ── Side Column ── */}
      <div className="flex flex-col gap-6 lg:gap-8">
        <NextLiveClassCard />
        <ContinueLearningCard />
        <ProgressSummaryCard />
        <AnnouncementsCard />
      </div>

    </div>
  );
}
