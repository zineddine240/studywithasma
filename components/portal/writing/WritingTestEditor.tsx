"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Send, AlertCircle, Clock, Maximize, Minimize, BookOpen } from "lucide-react";
import { getWritingDraft, saveWritingDraft, saveWritingStatus } from "@/lib/storage/writing-storage";
import { AcademicTaskVisual } from "./AcademicTaskVisual";
import { CorrectionResults } from "./CorrectionResults";
import { WritingCorrectionResponse } from "@/lib/ai/schemas";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export interface WritingPart {
  title: string;
  prompt: string;
  instructions?: string;
  imageUrl?: string;
  minWords: number;
}

export interface WritingTestEditorItem {
  id: string;
  taskType?: string;
  title: string;
  topicSummary?: string;
  recommendedTime: number;
  parts: WritingPart[];
  visualData?: any;
  tone?: string;
  essayType?: string;
}

interface WritingTestEditorProps {
  test: WritingTestEditorItem;
  userId: string;
}

export function WritingTestEditor({ test, userId }: WritingTestEditorProps) {
  const [activePartIdx, setActivePartIdx] = useState(0);
  const activePart = test.parts && test.parts.length > 0 ? test.parts[activePartIdx] : null;
  const [texts, setTexts] = useState<string[]>(Array(test.parts?.length || 1).fill(""));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean[]>(Array(test.parts?.length || 1).fill(false));
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<(WritingCorrectionResponse | null)[]>(Array(test.parts?.length || 1).fill(null));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(test.recommendedTime * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = getWritingDraft(test.id, userId);
    if (draft) {
      if (draft.texts && draft.texts.length > 0) {
        const paddedDrafts = Array(test.parts?.length || 1).fill("");
        draft.texts.forEach((d, i) => { if (i < paddedDrafts.length) paddedDrafts[i] = d; });
        setTexts(paddedDrafts);
        if (draft.texts.some(d => d.trim() !== "")) {
          setHasDraft(true);
        }
      }
      if (draft.hasStarted) {
        setHasDraft(true);
      }
      if (draft.timeLeft !== undefined) {
        setTimeLeft(draft.timeLeft);
        if (draft.timeLeft < test.recommendedTime * 60) {
          setHasDraft(true);
        }
      }
    }
    setIsLoaded(true);
  }, [test.id, test.parts?.length]);

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

  // Save Draft
  useEffect(() => {
    if (!isLoaded || isSubmitting) return;
    saveWritingDraft(test.id, userId, { texts, timeLeft, hasStarted });
  }, [texts, timeLeft, hasStarted, isLoaded, isSubmitting, test.id, userId]);

  // Word count logic
  const wordCounts = texts.map(t => t.trim().split(/\s+/).filter((word) => word.length > 0).length);
  const currentWordCount = wordCounts[activePartIdx] || 0;
  const isWordCountValid = currentWordCount >= (activePart?.minWords || 150);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const newTexts = [...texts];
    newTexts[activePartIdx] = val;
    setTexts(newTexts);
    // Draft is saved automatically via useEffect
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your answer for this part? This cannot be undone.")) {
      const newTexts = [...texts];
      newTexts[activePartIdx] = "";
      setTexts(newTexts);
      
      const newResult = [...result];
      newResult[activePartIdx] = null;
      setResult(newResult);
      // Draft is saved automatically via useEffect
    }
  };

  const handleSubmit = async () => {
    if (!isWordCountValid) {
      setError("Please meet the minimum word count for this part before submitting.");
      return;
    }
    
    setError(null);
    const newIsSubmitting = [...isSubmitting];
    newIsSubmitting[activePartIdx] = true;
    setIsSubmitting(newIsSubmitting);

    try {
      // Map frontend task types to the exact schema types expected by the backend
      const mapTaskType = (type: string) => {
        if (type === "Academic Task 1") return "Academic Writing Task 1";
        if (type === "General Task 1") return "General Writing Task 1";
        if (type === "Task 2") return "Writing Task 2";
        return "General English Writing";
      };

      const part = test.parts[activePartIdx];
      const payload = {
        practiceType: mapTaskType(test.taskType || ""),
        topic: `${part.title}:\n${part.prompt}`,
        studentAnswer: texts[activePartIdx],
        imageUrls: part.imageUrl ? [part.imageUrl] : undefined,
        consent: true,
      };

      const res = await fetch("/api/ai/writing-correction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to process ${part.title}.`);
      }

      const rawData = await res.json();
      
      const newResult = [...result];
      newResult[activePartIdx] = rawData;
      setResult(newResult);
      
      // If all parts are now complete, update status to Completed and stop timer
      if (newResult.every(r => r !== null)) {
        saveWritingStatus(test.id, userId, "Completed");
        setTimerActive(false);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      const resetSubmitting = [...isSubmitting];
      resetSubmitting[activePartIdx] = false;
      setIsSubmitting(resetSubmitting);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  if (!isLoaded) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading test environment...</div>;

  const handleStartTest = () => {
    setHasStarted(true);
    setTimerActive(true);
  };

  return (
    <>
      {!hasStarted && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {hasDraft ? "Ready to continue?" : "Ready to start?"}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {hasDraft 
                  ? "Your previous draft has been restored. The timer will resume as soon as you click continue." 
                  : "The timer will begin as soon as you click start. Make sure you are in a quiet environment and have enough time to complete the test."}
              </p>
            </div>
            <div className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col gap-3 text-sm text-left">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">Test</span>
                <span className="font-bold text-foreground line-clamp-1 ml-4">{test.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">Type</span>
                <span className="font-bold text-foreground">{test.taskType || "Writing Practice"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">Time Limit</span>
                <span className="font-bold text-primary">{formatTime(test.recommendedTime * 60)}</span>
              </div>
            </div>
            <button
              onClick={handleStartTest}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm"
            >
              {hasDraft ? "Continue Test" : "Start Test"}
            </button>
          </div>
        </div>
      )}

      <div className={isFullscreen 
        ? "fixed inset-0 z-[100] flex flex-col bg-background" 
        : "flex flex-col h-[calc(100vh-65px)] border-0 bg-background"
      }>
      
      {/* Header / Back navigation */}
      <header className="h-16 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href="/student-portal/writing-practice"
            className="p-2 bg-muted hover:bg-muted/80 rounded-lg text-muted-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:block">
            <h1 className="font-bold text-foreground text-base leading-tight">{test.title}</h1>
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{test.taskType || "Writing Practice"}</p>
          </div>
        </div>

        {!result && (
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-hidden bg-background">
        <ResizablePanelGroup direction="horizontal">
          
          {/* LEFT COLUMN: Prompt & Visuals */}
          <ResizablePanel defaultSize={40} minSize={25} className="bg-background flex flex-col h-full relative">
            {test.parts && test.parts.length > 1 && (
              <div className="flex border-b border-border bg-muted/20 shrink-0">
                {test.parts.map((part, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePartIdx(idx)}
                    className={`relative z-10 px-8 py-3.5 text-sm font-extrabold transition-all duration-300 ${
                      activePartIdx === idx
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {part.title}
                      {result[idx] && <div className="w-2 h-2 rounded-full bg-emerald-500" title="Submitted"></div>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              {/* Header Box: Part Title & Instructions */}
              <div className="border-b border-border bg-muted/20 px-6 py-4 shrink-0">
                <h3 className="font-bold text-foreground text-base mb-1">{activePart?.title || "Part 1"}</h3>
                {activePart?.instructions && (
                  <div className="text-sm text-foreground whitespace-pre-wrap">
                    {activePart.instructions}
                  </div>
                )}
              </div>

              {/* Main Content: Prompt & Image */}
              <div className="p-6 space-y-8 flex-1">
                <div className="prose prose-sm sm:prose-base dark:prose-invert text-foreground whitespace-pre-wrap leading-relaxed max-w-none font-medium">
                  {activePart?.prompt}
                </div>
                
                {activePart?.imageUrl && (
                  <div className="flex justify-center mt-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={activePart.imageUrl} alt="Test Diagram" className="max-w-full h-auto object-contain bg-white rounded-lg" style={{ maxHeight: '600px' }} />
                  </div>
                )}
                
                {test.taskType === "General Task 1" && test.tone && (
                  <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-300">Required Tone: {test.tone}</span>
                  </div>
                )}
                
                {test.taskType === "Task 2" && test.essayType && (
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Essay Type: {test.essayType}</span>
                  </div>
                )}
              </div>

              {test.taskType === "Academic Task 1" && test.visualData && !activePart?.imageUrl && (
                <AcademicTaskVisual visualData={test.visualData} />
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border hover:bg-primary/50 transition-colors" />

          {/* RIGHT COLUMN: Editor & Results */}
          <ResizablePanel defaultSize={60} minSize={30} className="flex flex-col h-full bg-card relative">
          
          <div className="bg-card flex flex-col overflow-hidden flex-grow relative">
            
            {/* Editor Toolbar */}
            <div className="bg-muted/50 border-b border-border p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={`text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                  timeLeft < 300 ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-card border border-border text-foreground"
                }`}>
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
                
                <div className={`text-sm font-bold flex items-center gap-2 ${
                  isWordCountValid ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {currentWordCount} / {activePart?.minWords || 150} words
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  disabled={isSubmitting[activePartIdx] || texts[activePartIdx]?.length === 0}
                  className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-rose-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
                <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground/60 flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Saved
                </div>
              </div>
            </div>

            {/* Editor Textarea or Results */}
            {result[activePartIdx] ? (
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-background">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    <div className="bg-muted border-b border-border p-6 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-foreground">
                        {activePart?.title} Correction
                      </h3>
                    </div>
                    <div className="p-6">
                      <CorrectionResults result={result[activePartIdx]!} />
                    </div>
                  </div>
                  
                  {result.every(r => r !== null) && (
                    <div className="text-center pt-4 pb-8">
                      <Link
                        href="/student-portal/writing-practice"
                        className="inline-flex items-center justify-center bg-card border-2 border-border text-foreground hover:border-primary/50 hover:bg-muted px-8 py-3 rounded-xl font-bold transition-colors shadow-sm"
                      >
                        Finish & Back to Test Library
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 relative">
                  <textarea
                    value={texts[activePartIdx] || ""}
                    onChange={handleTextChange}
                    disabled={isSubmitting[activePartIdx]}
                    placeholder="Start writing here..."
                    className="absolute inset-0 w-full h-full p-6 resize-none outline-none text-base leading-relaxed bg-transparent text-foreground disabled:bg-muted/30 disabled:text-muted-foreground custom-scrollbar"
                    spellCheck={false}
                  />
                </div>

                {/* Submit Bar */}
                <div className="bg-card border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {error ? (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg w-full sm:w-auto">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground font-medium">
                      {isWordCountValid 
                        ? <span className="text-emerald-600">✓ Minimum word counts reached.</span>
                        : "Write more words to reach minimum requirements."
                      }
                    </div>
                  )}
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting[activePartIdx] || texts[activePartIdx].length === 0}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
                  >
                    {isSubmitting[activePartIdx] ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Submit {activePart?.title}
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
    </>
  );
}
