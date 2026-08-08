"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, RefreshCw, BookOpen, Flag, Clock, Menu, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ChevronsUpDown, AlertCircle, FileText, Maximize, Minimize } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

// --- Enhanced Data Types ---
interface Question {
  id?: string;
  number?: number;
  question?: string;
  options?: string[]; // For multiple choice
  correct_answer: string;
  alternative_answers?: string[]; // For text input variations
  explanation: string;
}

interface QuestionGroup {
  type: 'multiple_choice' | 'tf_ng' | 'yn_ng' | 'summary_completion' | 'note_completion' | 'flow_chart_completion' | 'drag_and_drop' | 'matching';
  title: string;
  instruction: string;
  content?: string; // The text with blanks like [Q27]
  options?: string[]; // Words/letters available to choose from for completion
  questions: Question[];
}

interface Part {
  title: string;
  passage: string;
  questionGroups: QuestionGroup[];
}

// Backward compatible with old TestData
interface TestData {
  id?: string;
  duration_minutes?: number;
  // Old format
  passage?: string;
  questions?: Question[];
  // New format
  parts?: Part[];
}

export default function ReadingTestClient({ testData, title }: { testData: TestData, title: string }) {
  // Normalize data structure
  const parts: Part[] = testData.parts || [{
    title: 'Part 1',
    passage: testData.passage || '',
    questionGroups: [{
      type: 'multiple_choice',
      title: 'Questions',
      instruction: 'Choose the correct letter, A, B, C or D.',
      questions: testData.questions || []
    }]
  }];

  // Flatten questions for easy indexing
  const flatQuestions: { partIndex: number; groupIndex: number; questionIndex: number; q: Question; type: string }[] = [];
  parts.forEach((part, pIdx) => {
    part.questionGroups.forEach((group, gIdx) => {
      group.questions.forEach((q, qIdx) => {
        flatQuestions.push({ partIndex: pIdx, groupIndex: gIdx, questionIndex: qIdx, q, type: group.type });
      });
    });
  });

  const totalQuestions = flatQuestions.length;
  const testId = testData.id || "default_test_id";
  const defaultDuration = testData.duration_minutes ? testData.duration_minutes * 60 : 60 * 60;

  // --- State ---
  const [answers, setAnswers] = useState<string[]>(new Array(totalQuestions).fill(""));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(totalQuestions).fill(false));
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [activePart, setActivePart] = useState(0);
  const [panelSizes, setPanelSizes] = useState<number[]>([50, 50]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [selectedOptionChip, setSelectedOptionChip] = useState<string | null>(null);

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const toggleAllGroupsInActivePart = () => {
    const currentGroups = parts[activePart]?.questionGroups || [];
    const keys = currentGroups.map((_, gIdx) => `part-${activePart}-group-${gIdx}`);
    const areAllCollapsed = keys.every((k) => collapsedGroups[k]);
    const newMap = { ...collapsedGroups };
    keys.forEach((k) => {
      newMap[k] = !areAllCollapsed;
    });
    setCollapsedGroups(newMap);
  };

  // --- Refs ---
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // --- Mobile Check ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Load Draft ---
  useEffect(() => {
    const draft = localStorage.getItem(`ielts_reading_draft_${testId}`);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (!parsed.isSubmitted) {
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.flagged) setFlagged(parsed.flagged);
          if (parsed.timeLeft !== undefined) setTimeLeft(parsed.timeLeft);
          if (parsed.panelSizes) setPanelSizes(parsed.panelSizes);
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    setIsLoaded(true);
  }, [testId]);

  // --- Save Draft ---
  useEffect(() => {
    if (!isLoaded || isSubmitted) return;
    const draft = { answers, flagged, timeLeft, panelSizes, isSubmitted };
    localStorage.setItem(`ielts_reading_draft_${testId}`, JSON.stringify(draft));
  }, [answers, flagged, timeLeft, panelSizes, isSubmitted, isLoaded, testId]);

  // --- Timer ---
  useEffect(() => {
    if (!isLoaded || isSubmitted || timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [isLoaded, isSubmitted, timeLeft]);

  // --- Intersection Observer for Active Question ---
  useEffect(() => {
    if (isSubmitted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const index = Number(visibleEntries[0].target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setActiveQuestion(index);
            // Automatically switch to the correct part when scrolling questions
            const partIdx = flatQuestions[index]?.partIndex;
            if (partIdx !== undefined && partIdx !== activePart) {
              setActivePart(partIdx);
            }
          }
        }
      },
      { root: rightPanelRef.current, threshold: 0.3, rootMargin: "-10% 0px -40% 0px" }
    );

    setTimeout(() => {
      questionRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => observer.disconnect();
  }, [isLoaded, isSubmitted, activePart, flatQuestions]);

  // --- Auto-scroll right panel container during Drag & Drop ---
  useEffect(() => {
    let animationFrameId: number | null = null;
    let currentY: number | null = null;

    const autoScroll = () => {
      if (currentY !== null && rightPanelRef.current) {
        const container = rightPanelRef.current;
        const rect = container.getBoundingClientRect();
        const topEdge = rect.top;
        const bottomEdge = rect.bottom;
        const threshold = 120; // Proximity zone in px

        if (currentY < topEdge + threshold && currentY > topEdge - 50) {
          const intensity = Math.max(0.2, (topEdge + threshold - currentY) / threshold);
          container.scrollTop -= Math.round(18 * intensity);
        } else if (currentY > bottomEdge - threshold && currentY < bottomEdge + 50) {
          const intensity = Math.max(0.2, (currentY - (bottomEdge - threshold)) / threshold);
          container.scrollTop += Math.round(18 * intensity);
        }
      }

      if (currentY !== null) {
        animationFrameId = requestAnimationFrame(autoScroll);
      } else {
        animationFrameId = null;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      currentY = e.clientY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(autoScroll);
      }
    };

    const handleDragEnd = () => {
      currentY = null;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragend", handleDragEnd);
    window.addEventListener("drop", handleDragEnd);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragend", handleDragEnd);
      window.removeEventListener("drop", handleDragEnd);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // --- Handlers ---
  const handleAnswerChange = (qIndex: number, value: string) => {
    if (isSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = value;
    setAnswers(newAnswers);
  };

  const toggleFlag = (qIndex: number) => {
    if (isSubmitted) return;
    const newFlagged = [...flagged];
    newFlagged[qIndex] = !newFlagged[qIndex];
    setFlagged(newFlagged);
  };

  const scrollToQuestion = (index: number) => {
    const partIdx = flatQuestions[index]?.partIndex;
    if (partIdx !== undefined) {
      setActivePart(partIdx);
    }

    // Need a tiny timeout to let the part render if we just switched
    setTimeout(() => {
      if (questionRefs.current[index] && rightPanelRef.current) {
        const container = rightPanelRef.current;
        const element = questionRefs.current[index]!;
        container.scrollTo({ top: element.offsetTop - 20, behavior: "smooth" });
        setActiveQuestion(index);
      }
    }, 50);
  };

  const handleTimeUp = () => {
    alert("Time is up! Your test will be submitted automatically.");
    handleSubmitTest();
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

  const cleanText = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  };

  const checkAnswer = (userAns: string, correctAns: string, altAnswers?: string[]) => {
    if (!userAns) return false;
    const u = cleanText(userAns);
    const c = cleanText(correctAns);
    if (u === c) return true;

    // Support matching letter prefixes (e.g. "D" matching "D. experts...")
    const userPrefix = cleanText(userAns.split('.')[0] || "");
    if (userPrefix && userPrefix === c) return true;

    const correctPrefix = cleanText(correctAns.split('.')[0] || "");
    if (correctPrefix && u === correctPrefix) return true;

    if (altAnswers) {
      for (const alt of altAnswers) {
        if (u === cleanText(alt)) return true;
      }
    }
    return false;
  };

  const handleSubmitTest = () => {
    let calculatedScore = 0;
    answers.forEach((ans, i) => {
      const q = flatQuestions[i]?.q;
      if (q && checkAnswer(ans, q.correct_answer, q.alternative_answers)) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
    setShowConfirm(false);
    localStorage.removeItem(`ielts_reading_draft_${testId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.filter(a => a.trim() !== "").length;
  const flaggedCount = flagged.filter(Boolean).length;
  const isComplete = answeredCount === totalQuestions;

  if (!isLoaded) return null;

  // Render question content with inline inputs, drag-and-drop targets, and flag toggles
  const renderCompletionContent = (content: string, groupFlatQs: { index: number, q: Question }[], options?: string[]) => {
    // Replace arrows (↓, ⬇, ->, etc.) with clean bullet points
    const cleanedContent = content
      .replace(/\n\s*[↓⬇↘➔➜➡️]\s*\n/g, "\n• ")
      .replace(/^[↓⬇↘➔➜➡️]\s*\n/g, "• ")
      .replace(/\n\s*[↓⬇↘➔➜➡️]\s*/g, "\n• ")
      .replace(/[↓⬇↘➔➜➡️]/g, "• ");

    const parts = cleanedContent.split(/(\[Q\d+\])/g);

    return (
      <div className="text-[15px] leading-loose whitespace-pre-wrap font-medium">
        {parts.map((part, i) => {
          const match = part.match(/\[Q(\d+)\]/);
          if (match) {
            const qNum = parseInt(match[1]);
            const flatQ = groupFlatQs.find(fq => flatQuestions[fq.index].q.number === qNum);

            if (flatQ) {
              const qIndex = flatQ.index;
              const userAnswer = answers[qIndex];
              const isCorrect = isSubmitted ? checkAnswer(userAnswer, flatQ.q.correct_answer, flatQ.q.alternative_answers) : false;
              const isFlagged = flagged[qIndex];

              const inputClasses = isSubmitted
                ? (isCorrect ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 font-bold" : "border-rose-500 bg-rose-500/10 text-rose-800 font-bold")
                : (userAnswer ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs" : "border-dashed border-border/80 bg-background hover:border-primary/60");

              return (
                <span
                  key={i}
                  onDragOver={(e) => !isSubmitted && e.preventDefault()}
                  onDrop={(e) => {
                    if (isSubmitted) return;
                    e.preventDefault();
                    const val = e.dataTransfer.getData("text/plain");
                    if (val) handleAnswerChange(qIndex, val);
                  }}
                  className="inline-flex items-center gap-1.5 my-1 mx-1.5 align-baseline relative group"
                >
                  {options ? (
                    <div
                      onClick={() => {
                        if (isSubmitted) return;
                        if (selectedOptionChip) {
                          handleAnswerChange(qIndex, selectedOptionChip);
                          setSelectedOptionChip(null);
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-sm transition-all shadow-xs cursor-pointer select-none ${inputClasses}`}
                    >
                      <span className="font-bold">
                        {userAnswer || <span className="text-muted-foreground/70 font-normal italic">Drag or click option...</span>}
                      </span>

                      {userAnswer && !isSubmitted && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnswerChange(qIndex, "");
                          }}
                          className="text-muted-foreground hover:text-destructive font-bold text-xs p-0.5"
                          title="Clear answer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={answers[qIndex]}
                      onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                      disabled={isSubmitted}
                      className={`px-3 py-1 rounded-xl border text-sm w-36 text-center font-semibold shadow-xs ${inputClasses}`}
                      placeholder={`Q${qNum}`}
                    />
                  )}

                  {/* Inline Question Number & Flag Toggle Button */}
                  <span className="inline-flex items-center gap-1 bg-muted border border-border px-1.5 py-0.5 rounded-md text-[11px] font-extrabold shadow-2xs">
                    <span>{qNum}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlag(qIndex);
                      }}
                      className={`p-0.5 rounded hover:bg-background transition-colors ${
                        isFlagged ? "text-amber-500 fill-amber-500" : "text-muted-foreground/60 hover:text-foreground"
                      }`}
                      title="Flag/highlight question"
                    >
                      <Flag className={`w-3 h-3 ${isFlagged ? "fill-current" : ""}`} />
                    </button>
                  </span>
                </span>
              );
            }
          }

          // Format bullet points elegantly in text segments
          const textSegments = part.split(/(•)/g);
          return (
            <span key={i}>
              {textSegments.map((seg, sIdx) => {
                if (seg === "•") {
                  return (
                    <span key={sIdx} className="inline-flex items-center justify-center text-primary font-extrabold text-lg mx-1.5">
                      •
                    </span>
                  );
                }
                return seg;
              })}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={isFullscreen 
      ? "fixed inset-0 z-[100] flex flex-col bg-background" 
      : "flex flex-col h-[calc(100vh-65px)] border-0 bg-background"
    }>
      {/* ── Top Bar ── */}
      <header className="h-16 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/student-portal/practice/reading" className="p-2 bg-muted hover:bg-muted/80 rounded-lg text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:block">
            <h1 className="font-bold text-foreground text-base leading-tight">{title}</h1>
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Reading Practice</p>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-foreground font-mono text-lg font-bold bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className={timeLeft < 300 ? "text-rose-500 animate-pulse" : ""}>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-primary text-primary-foreground px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl text-sm sm:text-base font-bold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Finish Test
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-foreground bg-muted border border-border px-4 py-2 rounded-xl">
              Score: <span className="text-primary text-lg">{score}/{totalQuestions}</span>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content Split ── */}
      <main className="flex-1 min-h-0 flex flex-col relative">
        <PanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          onLayout={(sizes: number[]) => setPanelSizes(sizes)}
          className="h-full w-full"
        >
          {/* Left Side: Reading Passage */}
          <Panel defaultSize={panelSizes[0] || 50} minSize={20} className="bg-card flex flex-col relative">
            {parts.length > 1 ? (
              <div className="flex bg-muted/30 border-b border-border shrink-0 overflow-x-auto custom-scrollbar">
                {parts.map((p, i) => {
                  const displayTitle = p.title ? p.title.replace(/^Passage\s+/i, "Part ") : `Part ${i + 1}`;
                  return (
                    <button
                      key={i}
                      onClick={() => setActivePart(i)}
                      className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activePart === i ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                    >
                      <FileText className="w-4 h-4" />
                      {displayTitle}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-muted/30 border-b border-border p-3 shrink-0 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-sm text-foreground">Part Content</h2>
              </div>
            )}

            <div className="p-6 md:p-8 overflow-y-auto text-foreground/90 text-[15px] leading-loose custom-scrollbar flex-1 pb-24">
              {parts[activePart].passage.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="mb-5">{paragraph}</p> : <br key={idx} />
              ))}
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 h-2 md:w-2 md:h-auto bg-muted hover:bg-primary/50 transition-colors cursor-row-resize md:cursor-col-resize flex items-center justify-center md:border-x border-y md:border-y-0 border-border z-10">
            <div className="hidden md:block w-1 h-8 bg-border rounded-full" />
            <div className="md:hidden w-8 h-1 bg-border rounded-full" />
          </PanelResizeHandle>

          {/* Right Side: Questions */}
          <Panel defaultSize={panelSizes[1] || 50} minSize={20} className="bg-[#f8fafc] dark:bg-background flex flex-col relative">
            <div className="bg-card border-b border-border p-3 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-sm text-foreground">Questions</h2>
                <button
                  type="button"
                  onClick={toggleAllGroupsInActivePart}
                  className="px-2.5 py-1 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md border border-border transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronsUpDown className="w-3.5 h-3.5 text-primary" />
                  {(parts[activePart]?.questionGroups || []).every((_, gIdx) => collapsedGroups[`part-${activePart}-group-${gIdx}`])
                    ? "Expand All"
                    : "Collapse All"}
                </button>
              </div>
              {!isSubmitted && (
                <span className="text-xs font-semibold text-muted-foreground">
                  {Math.round((answeredCount / totalQuestions) * 100)}% Answered
                </span>
              )}
            </div>

            <div ref={rightPanelRef} className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1 pb-24 space-y-8">
              {isSubmitted && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-bold">Test Completed</h3>
                    <p className="text-sm mt-1">Review your answers and explanations below.</p>
                  </div>
                </div>
              )}

              {parts[activePart].questionGroups.map((group, gIndex) => {
                // Find indices for these questions matching activePart, gIndex, and qIdx
                const groupFlatQs = group.questions.map((q, qIdx) => {
                  const flatIndex = flatQuestions.findIndex(
                    fq => fq.partIndex === activePart && fq.groupIndex === gIndex && fq.questionIndex === qIdx
                  );
                  return { index: flatIndex !== -1 ? flatIndex : qIdx, q };
                });

                const isCompletionType = ['summary_completion', 'note_completion', 'flow_chart_completion', 'drag_and_drop'].includes(group.type);
                const groupKey = `part-${activePart}-group-${gIndex}`;
                const isCollapsed = Boolean(collapsedGroups[groupKey]);

                return (
                  <div key={`group-${gIndex}`} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => toggleGroupCollapse(groupKey)}
                      className="w-full text-left bg-muted/30 p-4 border-b border-border flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer select-none"
                    >
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
                          {group.title}
                          <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                            {group.questions.length} question{group.questions.length > 1 ? 's' : ''}
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium italic">{group.instruction}</p>
                      </div>
                      <div className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground shrink-0 ml-3">
                        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="p-5 space-y-6">
                        {group.options && (isCompletionType || group.type === 'matching') && (
                          <div className="mb-6 p-4 bg-muted/20 rounded-2xl border border-border/60 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                                {group.type === 'drag_and_drop' ? 'Word Bank Options:' : 'Options List (Drag or click to insert into blank):'}
                              </p>
                              {selectedOptionChip && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedOptionChip(null)}
                                  className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                                >
                                  Clear selection
                                </button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                              {group.options.map((opt, optIdx) => {
                                const isSelectedChip = selectedOptionChip === opt;
                                return (
                                  <div
                                    key={`opt-${optIdx}`}
                                    draggable={!isSubmitted}
                                    onDragStart={(e) => {
                                      e.dataTransfer.setData("text/plain", opt);
                                    }}
                                    onClick={() => {
                                      if (isSubmitted) return;
                                      setSelectedOptionChip(isSelectedChip ? null : opt);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-xl border text-sm font-bold cursor-grab active:cursor-grabbing transition-all select-none flex items-center gap-1.5 shadow-2xs ${
                                      isSelectedChip
                                        ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30 scale-105"
                                        : "bg-background border-border text-foreground hover:border-primary/50 hover:bg-muted/50"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {isCompletionType && group.content && (
                          <div className="bg-muted/10 p-5 rounded-2xl border border-border/50 mb-6">
                            {renderCompletionContent(group.content, groupFlatQs, group.options)}
                          </div>
                        )}

                        {/* Completion Test Review Feedback Box when Submitted */}
                        {isCompletionType && group.content && isSubmitted && (
                          <div className="mt-6 p-4 bg-muted/20 rounded-2xl border border-border space-y-3">
                            <h4 className="font-bold text-sm text-foreground">Question Feedback & Explanations:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {groupFlatQs.map(({ index: qIndex, q }) => {
                                const userAnswer = answers[qIndex];
                                const isCorrect = checkAnswer(userAnswer, q.correct_answer, q.alternative_answers);
                                const qNumDisplay = q.number || (qIndex + 1);
                                return (
                                  <div key={`exp-${qIndex}`} className="p-3.5 bg-background rounded-xl border border-border space-y-1.5 text-sm shadow-xs">
                                    <div className="flex items-center justify-between font-bold">
                                      <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-md bg-muted text-foreground text-xs flex items-center justify-center border border-border">
                                          {qNumDisplay}
                                        </span>
                                        <span>Question {qNumDisplay}</span>
                                      </span>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isCorrect ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700'}`}>
                                        {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Your answer: <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{userAnswer || '[Blank]'}</span>
                                      {!isCorrect && <> | Correct: <span className="font-bold text-emerald-700">{q.correct_answer}</span></>}
                                    </p>
                                    {q.explanation && (
                                      <p className="text-xs text-foreground/80 pt-1 border-t border-border/50 italic leading-relaxed">
                                        {q.explanation}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Standard Question Cards (Only rendered for non-completion types like multiple choice, true/false, etc.) */}
                        {(!isCompletionType || !group.content) && groupFlatQs.map(({ index: qIndex, q }) => {
                          if (qIndex === -1) return null;
                          const userAnswer = answers[qIndex];
                          const isCorrect = isSubmitted ? checkAnswer(userAnswer, q.correct_answer, q.alternative_answers) : false;
                          const isFlagged = flagged[qIndex];
                          const qNumDisplay = q.number || (qIndex + 1);

                          return (
                            <div
                              key={`q-${qIndex}`}
                              data-index={qIndex}
                              ref={(el) => { if (el) questionRefs.current[qIndex] = el; }}
                              className={`p-5 rounded-xl border-2 transition-all duration-300 ${isSubmitted
                                  ? (isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5")
                                  : (activeQuestion === qIndex ? "border-primary shadow-md bg-background" : "border-border/50 bg-background/50")
                                }`}
                            >
                            <div className="flex gap-3 mb-5 justify-between items-start">
                              <div className="flex gap-3">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${isSubmitted
                                    ? (isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white")
                                    : "bg-muted text-foreground border border-border"
                                  }`}>
                                  {qNumDisplay}
                                </span>
                                {q.question && (
                                  <h4 className="font-semibold text-foreground text-[15px] leading-relaxed pt-1">
                                    {q.question}
                                  </h4>
                                )}
                              </div>
                              {!isSubmitted && (
                                <button
                                  onClick={() => toggleFlag(qIndex)}
                                  className={`p-2 rounded-lg transition-colors shrink-0 border ${isFlagged ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'text-muted-foreground hover:bg-muted border-transparent hover:border-border'}`}
                                >
                                  <Flag className={`w-4 h-4 ${isFlagged ? 'fill-current' : ''}`} />
                                </button>
                              )}
                            </div>

                            <div className="ml-11 space-y-3">
                              {group.type === 'multiple_choice' && q.options?.map((opt, oIndex) => {
                                const isSelected = userAnswer === opt;
                                const isActualCorrect = opt === q.correct_answer;
                                let optionClasses = "border-border bg-card hover:border-primary/40";
                                if (isSubmitted) {
                                  if (isActualCorrect) optionClasses = "border-emerald-500 bg-emerald-500/10 text-emerald-800 font-medium";
                                  else if (isSelected && !isCorrect) optionClasses = "border-rose-500 bg-rose-500/10 text-rose-800 font-medium";
                                  else optionClasses = "border-border opacity-50";
                                } else if (isSelected) {
                                  optionClasses = "border-primary bg-primary/5 text-foreground font-semibold shadow-sm";
                                }
                                return (
                                  <button
                                    key={oIndex}
                                    onClick={() => handleAnswerChange(qIndex, opt)}
                                    disabled={isSubmitted}
                                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 text-sm group ${optionClasses}`}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSubmitted ? (isActualCorrect ? "border-emerald-500" : (isSelected ? "border-rose-500" : "border-muted-foreground/30")) : (isSelected ? "border-primary" : "border-muted-foreground/30 group-hover:border-primary/50")}`}>
                                      {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${isSubmitted ? (isActualCorrect ? "bg-emerald-500" : "bg-rose-500") : "bg-primary"}`}></div>}
                                      {!isSelected && isSubmitted && isActualCorrect && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>}
                                    </div>
                                    <span className="pt-0.5 leading-relaxed">{opt}</span>
                                  </button>
                                );
                              })}

                              {(group.type === 'tf_ng' || group.type === 'yn_ng') && (
                                <div className="flex flex-wrap gap-3">
                                  {(group.type === 'tf_ng' ? ['True', 'False', 'Not Given'] : ['Yes', 'No', 'Not Given']).map(opt => {
                                    const isSelected = (userAnswer || '').toLowerCase() === opt.toLowerCase();
                                    const isActualCorrect = (q.correct_answer || '').toLowerCase() === opt.toLowerCase();
                                    let optionClasses = "border-border bg-card hover:border-primary/40 text-foreground";
                                    if (isSubmitted) {
                                      if (isActualCorrect) optionClasses = "border-emerald-500 bg-emerald-500/10 text-emerald-800 font-bold";
                                      else if (isSelected && !isCorrect) optionClasses = "border-rose-500 bg-rose-500/10 text-rose-800 font-bold";
                                      else optionClasses = "border-border opacity-50";
                                    } else if (isSelected) {
                                      optionClasses = "border-primary bg-primary text-primary-foreground font-bold shadow-sm";
                                    }
                                    return (
                                      <button
                                        key={opt}
                                        onClick={() => handleAnswerChange(qIndex, opt)}
                                        disabled={isSubmitted}
                                        className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${optionClasses}`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {group.type === 'matching' && (
                                <div className="mt-3 w-full max-w-full">
                                  <div
                                    onDragOver={(e) => !isSubmitted && e.preventDefault()}
                                    onDrop={(e) => {
                                      if (isSubmitted) return;
                                      e.preventDefault();
                                      const data = e.dataTransfer.getData("text/plain");
                                      if (data) handleAnswerChange(qIndex, data);
                                    }}
                                    onClick={() => {
                                      if (isSubmitted) return;
                                      if (selectedOptionChip) {
                                        handleAnswerChange(qIndex, selectedOptionChip);
                                        setSelectedOptionChip(null);
                                      }
                                    }}
                                    className={`min-h-[44px] w-full max-w-full rounded-xl border-2 border-dashed p-3 text-sm transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                                      userAnswer
                                        ? isSubmitted
                                          ? isCorrect
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-semibold"
                                            : "border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-100 font-semibold"
                                          : "border-primary/40 bg-primary/5 text-foreground font-semibold"
                                        : selectedOptionChip
                                        ? "border-primary bg-primary/10 ring-2 ring-primary/20 animate-pulse text-primary"
                                        : "border-border/80 bg-muted/20 text-muted-foreground hover:border-primary/50"
                                    }`}
                                  >
                                    {userAnswer ? (
                                      <div className="flex items-center justify-between gap-2.5 w-full min-w-0">
                                        <span className="text-sm font-semibold leading-relaxed break-words whitespace-normal flex-1 min-w-0">
                                          {userAnswer}
                                        </span>
                                        {!isSubmitted && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAnswerChange(qIndex, "");
                                            }}
                                            className="text-xs text-muted-foreground hover:text-rose-500 p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 font-bold"
                                            title="Clear answer"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground italic">
                                        {selectedOptionChip
                                          ? "Click to insert selected option here"
                                          : "Drag & drop an option here or click an option above to insert"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {isCompletionType && isSubmitted && (
                                <div className="text-sm font-medium p-3 bg-card border border-border rounded-lg inline-block">
                                  Your answer: <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>{userAnswer || "[Blank]"}</span>
                                  {!isCorrect && <><br />Correct answer: <span className="font-bold text-emerald-600">{q.correct_answer}</span></>}
                                </div>
                              )}
                            </div>

                            {isSubmitted && (
                              <div className="mt-5 ml-11 bg-card/80 p-4 rounded-xl border border-border shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  {isCorrect ? (
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-wide">✓ Correct</span>
                                  ) : (
                                    <span className="text-xs font-bold text-rose-700 bg-rose-500/10 px-2 py-1 rounded-md uppercase tracking-wide">✗ Incorrect</span>
                                  )}
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed mt-2">
                                  <span className="font-semibold text-foreground block mb-1">Explanation: </span>
                                  {q.explanation}
                                </p>
                              </div>
                            )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </Panel>
        </PanelGroup>
      </main>

      {/* ── Bottom Navigator ── */}
      <footer className="h-16 md:h-20 bg-card border-t border-border px-2 md:px-6 shrink-0 flex items-center justify-between z-20 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto custom-scrollbar py-2 px-2 mask-edges flex-1">
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const flatQ = flatQuestions[i];
            const qNumDisplay = flatQ?.q?.number || (i + 1);
            let stateClass = "border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/50";

            if (isSubmitted) {
              const isCorrect = checkAnswer(answers[i], flatQ.q.correct_answer, flatQ.q.alternative_answers);
              stateClass = isCorrect ? "border-emerald-500 bg-emerald-500/10 text-emerald-700" : "border-rose-500 bg-rose-500/10 text-rose-700";
            } else {
              if (activeQuestion === i) stateClass = "border-primary bg-primary text-primary-foreground shadow-md scale-110 z-10";
              else if (answers[i] && answers[i].trim() !== "") stateClass = "border-primary/50 bg-primary/10 text-primary";
            }

            return (
              <button
                key={i}
                onClick={() => scrollToQuestion(i)}
                className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg border-2 font-bold text-xs md:text-sm flex items-center justify-center relative transition-all duration-200 ${stateClass}`}
              >
                {qNumDisplay}
                {flagged[i] && !isSubmitted && (
                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-amber-500 rounded-full border-2 border-card flex items-center justify-center shadow-sm">
                    <Flag className="w-2 h-2 text-white fill-current" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 md:gap-3 shrink-0 ml-2 border-l border-border pl-2 md:pl-4">
          <button
            onClick={() => scrollToQuestion(Math.max(0, activeQuestion - 1))}
            disabled={activeQuestion === 0}
            className="p-2 md:px-4 md:py-2 border border-border rounded-xl hover:bg-muted disabled:opacity-50 transition-colors flex items-center gap-1.5 text-sm font-semibold text-foreground shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <button
            onClick={() => scrollToQuestion(Math.min(totalQuestions - 1, activeQuestion + 1))}
            disabled={activeQuestion === totalQuestions - 1}
            className="p-2 md:px-4 md:py-2 border border-border rounded-xl hover:bg-muted disabled:opacity-50 transition-colors flex items-center gap-1.5 text-sm font-semibold text-foreground shadow-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </footer>

      {/* ── Confirm Submit Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-extrabold text-foreground mb-1">Submit Test?</h2>
            <p className="text-muted-foreground text-sm mb-6">Are you sure you want to finish your attempt?</p>

            <div className="space-y-3 mb-6 bg-muted/40 p-5 rounded-2xl border border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Answered</span>
                <span className="font-bold text-foreground text-base">{answeredCount} of {totalQuestions}</span>
              </div>
              <div className="h-px w-full bg-border/50 my-1"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Unanswered</span>
                <span className="font-bold text-amber-500 text-base">{totalQuestions - answeredCount}</span>
              </div>
              <div className="h-px w-full bg-border/50 my-1"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Flagged</span>
                <span className="font-bold text-amber-500 text-base">{flaggedCount}</span>
              </div>
              <div className="h-px w-full bg-border/50 my-1"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Time Remaining</span>
                <span className="font-bold text-primary text-base">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {answeredCount < totalQuestions && (
              <div className="flex gap-3 text-amber-600 bg-amber-500/10 p-4 rounded-xl text-sm mb-6 border border-amber-500/20">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">You have <span className="font-bold">{totalQuestions - answeredCount} unanswered</span> questions. Are you sure you want to submit?</p>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-foreground hover:bg-muted border border-transparent hover:border-border transition-all w-full sm:w-auto"
              >
                Return to Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-5 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
