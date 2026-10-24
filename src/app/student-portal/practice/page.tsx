import Link from "next/link";
import { BookOpen, PenTool, Mic, ArrowRight } from "lucide-react";
import { PortalCard } from "@/components/portal/shared/PortalCard";

export const metadata = {
  title: "Practice Area | Study with Asma",
  description: "IELTS Practice Area for Reading, Writing, and Speaking",
};

export default function PracticeHubPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* ── Page Header ── */}
      <section className="bg-card text-white p-6 sm:p-10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            IELTS Practice Area
          </h1>
          <p className="text-primary/70 text-lg max-w-2xl leading-relaxed">
            Hone your skills with our interactive IELTS modules. Receive instant
            AI feedback on your writing and speaking, or test your reading
            comprehension.
          </p>
        </div>
      </section>

      {/* ── Practice Modules Grid ── */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Reading */}
        <Link href="/student-portal/practice/reading" className="group">
          <PortalCard className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col">
            <div className="w-12 h-12 bg-muted/30 border border-border rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-colors">
              <BookOpen className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              Reading Practice
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 grow">
              Practice answering multiple-choice, matching, and True/False/Not
              Given questions based on academic passages.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-primary/80">
              Start Reading{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </PortalCard>
        </Link>

        {/* Writing */}
        <Link href="/student-portal/writing-practice" className="group">
          <PortalCard className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col">
            <div className="w-12 h-12 bg-muted/30 border border-border rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-colors">
              <PenTool className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              Writing Practice
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 grow">
              Submit your Task 1 and Task 2 essays to receive detailed AI
              feedback on grammar, vocabulary, and structure.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-primary/80">
              Start Writing{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </PortalCard>
        </Link>

        {/* Speaking */}
        <Link href="/student-portal/speaking-practice" className="group">
          <PortalCard className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col">
            <div className="w-12 h-12 bg-muted/30 border border-border rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-colors">
              <Mic className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              Speaking Practice
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 grow">
              Record your voice and get instant corrections on your
              pronunciation, fluency, and spoken grammar.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-primary/80">
              Start Speaking{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </PortalCard>
        </Link>
      </div>
    </div>
  );
}
