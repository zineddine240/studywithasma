import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { BookOpen, FileText, ArrowRight, Clock } from "lucide-react";
import { PortalCard } from "@/components/portal/shared/PortalCard";

export const metadata = {
  title: "Reading Practice | Study with Asma",
};

export default async function ReadingPracticeListPage() {
  const supabase = await createClient();

  const { data: tests, error } = await supabase
    .from("tests")
    .select("id, title, content_data, created_at")
    .eq("content_type", "reading")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reading tests:", error);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* ── Page Header ── */}
      <section className="bg-card text-white p-6 sm:p-10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
              Reading Practice
            </h1>
            <p className="text-primary/70 text-lg max-w-2xl leading-relaxed">
              Read passages and answer multiple-choice questions to improve your comprehension speed and accuracy.
            </p>
          </div>
          <Link href="/student-portal/practice" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors backdrop-blur-sm border border-white/10 self-start md:self-auto shrink-0">
            Back to Hub
          </Link>
        </div>
      </section>

      {/* ── Test List ── */}
      <div className="grid sm:grid-cols-2 gap-6">
        {tests && tests.length > 0 ? (
          tests.map((test) => {
            const data = test.content_data as any;
            const qCount = data?.questions?.length || 0;
            return (
              <PortalCard key={test.id} className="flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-muted/30 border border-border rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                    {new Date(test.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {test.title}
                </h3>
                
                <div className="flex items-center gap-4 mt-auto pt-6 mb-6">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    {qCount} Questions
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    ~15 mins
                  </div>
                </div>

                <Link
                  href={`/student-portal/practice/reading/${test.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-muted/30 hover:bg-primary text-primary hover:text-white border border-border hover:border-primary py-2.5 rounded-xl text-sm font-bold transition-all group"
                >
                  Start Practice
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </PortalCard>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No Reading Practices Yet</h3>
            <p className="text-muted-foreground">Check back later for new reading materials.</p>
          </div>
        )}
      </div>
    </div>
  );
}
