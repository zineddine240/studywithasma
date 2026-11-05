import SectionTag from "@/components/ui/section-tag";
import LevelTestClient from "./LevelTestClient";
import { efSetLevelTest } from "@/lib/levelTestData";
import NewCtaSection from "@/components/home/NewCtaSection";

export const metadata = {
  title: "Free English Level Assessment | Study with Asma",
  description:
    "Take our free 15-minute English level assessment to find out your current proficiency and get course recommendations.",
};

export default function LevelTestPage() {
  return (
    <main className="grow bg-white">
      <section className="pt-10 sm:pt-14 pb-14 sm:pb-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
            <SectionTag>PROFICIENCY ASSESSMENT</SectionTag>
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0B1536] tracking-tight leading-[1.12]">
              Free English Level Assessment
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Find out your current English proficiency level (A1 to C2) in just
              15 minutes. This helps us recommend the perfect track for your
              IELTS and university admissions goals.
            </p>
            <div className="pt-2 select-none -rotate-1">
              <span className="font-handwriting text-2xl sm:text-3xl font-bold text-indigo-700">
                15 minutes to discover your baseline ♡
              </span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <LevelTestClient testData={efSetLevelTest} />
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <NewCtaSection />
    </main>
  );
}
