import SectionTag from "@/components/ui/section-tag";
import LevelTestClient from "./LevelTestClient";
import { efSetLevelTest } from "@/lib/levelTestData";

export const metadata = {
  title: "Free English Level Assessment | Study with Asma",
  description:
    "Take our free 15-minute English level assessment to find out your current proficiency and get course recommendations.",
};

export default function LevelTestPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <SectionTag>PROFICIENCY ASSESSMENT</SectionTag>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Free English Level Assessment
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find out your current English proficiency level (A1 to C2) in just
              15 minutes. This helps us recommend the perfect course for your
              IELTS goals.
            </p>
          </div>

          <LevelTestClient testData={efSetLevelTest} />
        </div>
      </div>
    </div>
  );
}
