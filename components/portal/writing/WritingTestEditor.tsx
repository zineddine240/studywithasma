"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Send, AlertCircle, Clock } from "lucide-react";
import { WritingTest } from "@/lib/mock/writing-tests";
import { getWritingDraft, saveWritingDraft, saveWritingStatus } from "@/lib/storage/writing-storage";
import { AcademicTaskVisual } from "./AcademicTaskVisual";
import { CorrectionResults } from "./CorrectionResults";
import { WritingCorrectionResponse } from "@/lib/ai/schemas";

interface WritingTestEditorProps {
  test: WritingTest;
}

export function WritingTestEditor({ test }: WritingTestEditorProps) {
  const [text, setText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WritingCorrectionResponse | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(test.recommendedTime * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = getWritingDraft(test.id);
    if (draft) setText(draft);
    setIsLoaded(true);
  }, [test.id]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Word count logic
  const wordCount = text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  const isWordCountValid = wordCount >= test.minWords;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    saveWritingDraft(test.id, val);
    
    // Start timer on first type if not active
    if (!timerActive && timeLeft === test.recommendedTime * 60 && val.length > 0) {
      setTimerActive(true);
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your answer? This cannot be undone.")) {
      setText("");
      saveWritingDraft(test.id, "");
      setTimeLeft(test.recommendedTime * 60);
      setTimerActive(false);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!isWordCountValid) {
      setError(`Your answer must be at least ${test.minWords} words.`);
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    setTimerActive(false);

    try {
      const payload = {
        practiceType: test.taskType,
        topic: `${test.title}\n\n${test.prompt}`,
        studentAnswer: text,
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
      setResult(rawData);
      
      // Update status to Completed upon success
      saveWritingStatus(test.id, "Completed");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setTimerActive(true); // Resume timer on fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isLoaded) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading test environment...</div>;

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6">
      
      {/* Header / Back navigation */}
      <div className="flex items-center gap-4">
        <Link 
          href="/student-portal/writing-practice"
          className="p-2 bg-white rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-foreground">{test.title}</h1>
            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
              {test.taskType}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Prompt & Visuals */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Writing Prompt</h2>
            <div className="prose prose-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {test.prompt}
            </div>
            
            {test.taskType === "General Task 1" && test.tone && (
              <div className="mt-6 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-800">Required Tone: {test.tone}</span>
              </div>
            )}
            
            {test.taskType === "Task 2" && test.essayType && (
              <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">Essay Type: {test.essayType}</span>
              </div>
            )}
          </div>

          {test.taskType === "Academic Task 1" && test.visualData && (
            <AcademicTaskVisual visualData={test.visualData} />
          )}
        </div>

        {/* RIGHT COLUMN: Editor & Results */}
        <div className="lg:col-span-7 space-y-6 flex flex-col h-full">
          
          <div className="bg-white rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden flex-grow relative">
            
            {/* Editor Toolbar */}
            <div className="bg-slate-50 border-b border-border p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={`text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                  timeLeft < 300 ? "bg-rose-100 text-rose-700" : "bg-white border border-border text-slate-700"
                }`}>
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
                
                <div className={`text-sm font-bold flex items-center gap-2 ${
                  isWordCountValid ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {wordCount} / {test.minWords} words
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  disabled={isSubmitting || text.length === 0}
                  className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-rose-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Saved
                </div>
              </div>
            </div>

            {/* Editor Textarea */}
            <textarea
              value={text}
              onChange={handleTextChange}
              disabled={isSubmitting || !!result}
              placeholder="Start writing here..."
              className="w-full h-full min-h-[400px] p-6 resize-none outline-none text-base leading-relaxed text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 custom-scrollbar"
              spellCheck={false}
            />

            {/* Submit Bar */}
            {!result && (
              <div className="bg-white border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                {error ? (
                  <div className="flex items-center gap-2 text-rose-600 text-sm font-bold bg-rose-50 px-3 py-2 rounded-lg w-full sm:w-auto">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground font-medium">
                    {isWordCountValid 
                      ? <span className="text-emerald-600">✓ Minimum word count reached.</span>
                      : `Write at least ${test.minWords - wordCount} more words to submit.`
                    }
                  </div>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || text.length === 0}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Submit for AI Correction
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results Area */}
          {result && (
            <div className="mt-8">
              <CorrectionResults result={result} />
              
              <div className="mt-8 text-center border-t border-border pt-8">
                <Link
                  href="/student-portal/writing-practice"
                  className="inline-flex items-center justify-center bg-white border-2 border-slate-200 text-slate-700 hover:border-primary/50 hover:bg-slate-50 px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  Back to Test Library
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
