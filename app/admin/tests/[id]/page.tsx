import { createClient } from "@/utils/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Question {
  question: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
}

export default async function TestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: test, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !test) {
    notFound();
  }

  const { content_data, content_type, title, created_at } = test;
  const isWriting = content_type === "writing";

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title={title}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tests", href: "/admin/tests" },
          { label: "Test Details" },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card shadow-sm border border-border rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {isWriting ? "Writing Prompt" : "Reading Passage"}
            </h2>
            <div className="prose dark:prose-invert max-w-noshrink-0-foreground whitespace-pre-wrap leading-relaxed">
              {content_data?.passage || "No content provided."}
            </div>
          </div>

          {!isWriting && content_data?.questions && (
            <div className="bg-card shadow-sm border border-border rounded-xl p-6 sm:p-8 space-y-8">
              <h2 className="text-xl font-bold mb-4">Questions & Answers</h2>

              {content_data.questions.map((q: Question, idx: number) => (
                <div
                  key={idx}
                  className="space-y-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    <span className="font-bold text-primary flex-shrink-0 mt-0.5">
                      Q{idx + 1}.
                    </span>
                    <div>
                      <p className="font-semibold text-foreground mb-4 leading-relaxed">
                        {q.question}
                      </p>
                      <div className="space-y-2 mb-4">
                        {q.options?.map((opt: string, optIdx: number) => (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border text-sm ${opt === q.correct_answer ? "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-100 font-medium" : "bg-muted/30 border-border text-muted-foreground"}`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
                          <p className="text-sm text-foreground/80">
                            <span className="font-bold text-primary">
                              Explanation:
                            </span>{" "}
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card shadow-sm border border-border rounded-xl p-6">
            <h3 className="font-bold text-foreground mb-4">Test Metadata</h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground block mb-1">
                  Type
                </span>
                <Badge variant="secondary" className="capitalize">
                  {content_type.replace("_", " ")}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block mb-1">
                  Created At
                </span>
                <p className="text-sm font-medium text-foreground">
                  {new Date(created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block mb-1">
                  Status
                </span>
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
