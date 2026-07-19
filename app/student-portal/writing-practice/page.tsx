"use client";

import { useState } from "react";
import {
  PenTool,
  Send,
  Copy,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  MessageSquareQuote,
} from "lucide-react";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  WritingPracticeRequest,
  WritingCorrectionResponse,
  WritingCorrectionSchema,
} from "@/lib/ai/schemas";

export default function WritingPracticePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WritingCorrectionResponse | null>(null);

  // Form State
  const [practiceType, setPracticeType] = useState<
    WritingPracticeRequest["practiceType"] | ""
  >("");
  const [topic, setTopic] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [consent, setConsent] = useState(false);

  const wordCount = studentAnswer
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const isWordCountValid = wordCount >= 20;
  const charCount = studentAnswer.length;
  const isCharCountValid = charCount <= 5000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!practiceType) return setError("Please select a practice type.");
    if (!isWordCountValid)
      return setError("Your answer must be at least 20 words.");
    if (!isCharCountValid)
      return setError("Your answer is too long (maximum 5000 characters).");
    if (!consent) return setError("You must consent to submit your writing.");

    setError(null);
    setIsSubmitting(true);

    try {
      const payload: WritingPracticeRequest = {
        practiceType: practiceType as any,
        topic,
        studentAnswer,
        consent: true,
      };

      const res = await fetch("/api/ai/writing-correction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process writing.");
      }

      const rawData = await res.json();

      // Strict client-side validation using Zod
      const parsedData = WritingCorrectionSchema.parse(rawData);
      setResult(parsedData);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.correctedText);
      alert("Corrected text copied to clipboard!");
    }
  };

  const resetPractice = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* ── Page Header ── */}
      <section className="bg-card text-card-foreground p-6 sm:p-10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            Writing Practice
          </h1>
          <p className="text-primary/70 text-lg max-w-2xl leading-relaxed">
            Submit your essays or paragraphs to receive detailed grammar,
            vocabulary, and structural corrections from our AI assistant.
          </p>
        </div>
      </section>

      {/* ── Input Form (Hidden when result is showing) ── */}
      {!result && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <PortalCard className="space-y-6">
            <SectionHeader
              title="New Practice Submission"
              icon={<PenTool className="w-5 h-5" />}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Practice Type *
                </label>
                <Select
                  value={practiceType}
                  onValueChange={(val) => setPracticeType((val || "") as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full h-12.5 px-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all bg-card">
                    <SelectValue placeholder="Select task type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic Writing Task 1">
                      Academic Writing Task 1
                    </SelectItem>
                    <SelectItem value="General Writing Task 1">
                      General Writing Task 1
                    </SelectItem>
                    <SelectItem value="Writing Task 2">
                      Writing Task 2
                    </SelectItem>
                    <SelectItem value="General English Writing">
                      General English Writing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Question / Topic (Optional)
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. Discuss the advantages of studying abroad..."
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-foreground">
                  Your Answer *
                </label>
                <div
                  className={`text-xs font-semibold ${!isWordCountValid ? "text-red-500" : "text-emerald-600"}`}
                >
                  {wordCount} words (Min 20)
                </div>
              </div>
              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                disabled={isSubmitting}
                rows={12}
                placeholder="Type your essay or paragraph here..."
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-y"
              ></textarea>
              <div
                className={`text-right text-xs font-medium mt-1 ${!isCharCountValid ? "text-red-500" : "text-muted-foreground"}`}
              >
                {charCount} / 5000 characters
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                disabled={isSubmitting}
                className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label
                htmlFor="consent"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none"
              >
                I understand that this text will be processed by an AI service
                for educational correction. No personal information is included.
              </label>
            </div>
          </PortalCard>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !practiceType ||
                !isWordCountValid ||
                !isCharCountValid ||
                !consent
              }
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Writing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit for Correction
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ── Results View ── */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <p className="text-sm font-medium leading-relaxed">
              <strong>Notice:</strong> AI correction is provided for learning
              and practice only. Review the suggestions carefully and contact
              your teacher if you need clarification. This is not an official
              IELTS assessment.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Original Text */}
            <PortalCard className="bg-slate-50 border-slate-200">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-muted-foreground" />
                Original Writing
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {studentAnswer}
              </div>
            </PortalCard>

            {/* Corrected Text */}
            <PortalCard className="bg-emerald-50/50 border-emerald-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Corrected Writing
                </h3>
                <button
                  onClick={handleCopy}
                  className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                  title="Copy Corrected Text"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {result.correctedText}
              </div>
            </PortalCard>
          </div>

          {/* Detailed Feedback Sections */}
          <PortalCard>
            <SectionHeader
              title="Detailed Feedback"
              icon={<PenTool className="w-5 h-5" />}
            />

            <div className="mt-6 space-y-8">
              {/* Corrections List */}
              {result.corrections.length > 0 && (
                <div>
                  <h4 className="font-bold text-foreground mb-4 border-b border-[#E5E7EB] pb-2">
                    Language Corrections
                  </h4>
                  <div className="space-y-4">
                    {result.corrections.map((corr, idx) => (
                      <div
                        key={idx}
                        className="bg-card border border-border rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="line-through text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded">
                              {corr.originalText}
                            </span>
                            <span className="text-muted-foreground font-bold">
                              →
                            </span>
                            <span className="text-emerald-600 font-bold bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded">
                              {corr.correctedText}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-muted/30 border border-border px-2 py-1 rounded shrink-0">
                            {corr.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {corr.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Suggestions */}
              {result.vocabularySuggestions &&
                result.vocabularySuggestions.length > 0 && (
                  <div>
                    <h4 className="font-bold text-foreground mb-4 border-b border-[#E5E7EB] pb-2">
                      Vocabulary Suggestions
                    </h4>
                    <div className="space-y-4">
                      {result.vocabularySuggestions.map((vocab, idx) => (
                        <div
                          key={idx}
                          className="bg-muted/30 border border-border rounded-xl p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                            <span className="text-muted-foreground font-medium px-2 py-0.5 bg-card rounded border border-border">
                              {vocab.originalText}
                            </span>
                            <span className="text-muted-foreground font-bold">
                              →
                            </span>
                            <span className="text-primary font-bold px-2 py-0.5 bg-card rounded border border-border">
                              {vocab.suggestedText}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {vocab.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Clarity & General Notes */}
              <div className="grid sm:grid-cols-2 gap-6">
                {result.claritySuggestions &&
                  result.claritySuggestions.length > 0 && (
                    <div>
                      <h4 className="font-bold text-foreground mb-3">
                        Clarity Suggestions
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {result.claritySuggestions.map((note, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                {result.generalNotes && result.generalNotes.length > 0 && (
                  <div>
                    <h4 className="font-bold text-foreground mb-3">
                      General Notes
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      {result.generalNotes.map((note, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </PortalCard>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={resetPractice}
              className="bg-card text-foreground px-6 py-2.5 rounded-xl font-bold border border-border hover:bg-muted transition-colors"
            >
              Edit and Resubmit
            </button>
            <button
              disabled
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Coming Soon"
            >
              Send to Teacher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
