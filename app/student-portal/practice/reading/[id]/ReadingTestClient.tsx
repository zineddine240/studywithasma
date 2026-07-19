"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, BookOpen } from "lucide-react";
import { ProgressBar } from "@/components/portal/shared/ProgressBar";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface TestData {
  passage: string;
  questions: Question[];
}

export default function ReadingTestClient({ testData, title }: { testData: TestData, title: string }) {
  const [answers, setAnswers] = useState<string[]>(new Array(testData.questions.length).fill(""));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const totalQuestions = testData.questions.length;
  const answeredCount = answers.filter(a => a !== "").length;
  const isComplete = answeredCount === totalQuestions;

  const handleSelect = (qIndex: number, option: string) => {
    if (isSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!isComplete) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    let calculatedScore = 0;
    answers.forEach((ans, i) => {
      if (ans === testData.questions[i].correct_answer) {
        calculatedScore++;
      }
    });
    
    setScore(calculatedScore);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setAnswers(new Array(totalQuestions).fill(""));
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      
      {/* ── Top Bar ── */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:px-6 mb-6 flex flex-wrap gap-4 items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/student-portal/practice/reading" className="p-2 bg-muted/50 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-foreground text-lg leading-tight">{title}</h1>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Reading Practice</p>
          </div>
        </div>
        
        {!isSubmitted ? (
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:block text-sm font-medium text-muted-foreground">
              {answeredCount} of {totalQuestions} Answered
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/80 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-sm font-bold text-foreground bg-muted/30 border border-border px-4 py-2 rounded-xl">
              Score: <span className="text-primary text-lg">{score}/{totalQuestions}</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-card border-2 border-border text-foreground px-4 py-2 rounded-xl font-bold hover:bg-muted transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* ── Split Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-0 grow">
        
        {/* Left Side: Reading Passage */}
        <div className="lg:w-1/2 bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="bg-muted/50 border-b border-border p-4 shrink-0">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Reading Passage
            </h2>
          </div>
          <div className="p-6 overflow-y-auto text-[#334155] text-[15px] leading-loose custom-scrollbar">
            {testData.passage.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : <br key={idx} />
            ))}
          </div>
        </div>

        {/* Right Side: Questions */}
        <div className="lg:w-1/2 bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="bg-muted/30 border-b border-border p-4 shrink-0 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Questions</h2>
            {!isSubmitted && (
              <span className="text-xs font-bold text-primary bg-card border border-primary/50 px-2 py-1 rounded">
                {Math.round((answeredCount/totalQuestions)*100)}% Complete
              </span>
            )}
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
             {isSubmitted && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                     <h3 className="font-bold">Test Completed</h3>
                     <p className="text-sm mt-1">Review your answers and explanations below.</p>
                  </div>
                </div>
             )}

            {testData.questions.map((q, qIndex) => {
              const userAnswer = answers[qIndex];
              const isCorrect = userAnswer === q.correct_answer;
              
              return (
                <div key={qIndex} className={`p-5 rounded-xl border-2 transition-all ${
                  isSubmitted 
                    ? (isCorrect ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5") 
                    : "border-border bg-muted/30"
                }`}>
                  <div className="flex gap-3 mb-4">
                    <span className="w-7 h-7 rounded-full bg-card text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h3 className="font-bold text-foreground text-[15px] leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  <div className="space-y-2.5 ml-10">
                    {q.options.map((opt, oIndex) => {
                      const isSelected = userAnswer === opt;
                      const isActualCorrect = opt === q.correct_answer;
                      
                      let optionClasses = "border-border bg-card";
                      if (isSubmitted) {
                        if (isActualCorrect) optionClasses = "border-emerald-500 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400";
                        else if (isSelected && !isCorrect) optionClasses = "border-rose-500 bg-rose-500/10 font-medium text-rose-600 dark:text-rose-400";
                        else optionClasses = "border-border opacity-60";
                      } else {
                        if (isSelected) optionClasses = "border-primary bg-muted/30 text-foreground font-medium shadow-sm";
                        else optionClasses = "border-border hover:border-primary/50 bg-card text-muted-foreground";
                      }

                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleSelect(qIndex, opt)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 text-sm ${optionClasses}`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSubmitted 
                              ? (isActualCorrect ? "border-emerald-500" : (isSelected ? "border-rose-500" : "border-slate-300"))
                              : (isSelected ? "border-primary" : "border-slate-300")
                          }`}>
                            {isSelected && <div className={`w-2 h-2 rounded-full ${
                              isSubmitted ? (isActualCorrect ? "bg-emerald-500" : "bg-rose-500") : "bg-primary"
                            }`}></div>}
                            {!isSelected && isSubmitted && isActualCorrect && (
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            )}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation block (only visible after submission) */}
                  {isSubmitted && (
                    <div className="mt-5 ml-10 bg-card p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide bg-emerald-500/10 px-2 py-0.5 rounded">Correct</span>
                        ) : (
                          <span className="text-xs font-bold text-rose-600 uppercase tracking-wide bg-rose-500/10 px-2 py-0.5 rounded">Incorrect</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">Explanation: </span>
                        {q.explanation}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}
            
            {/* Bottom Padding */}
            <div className="h-4"></div>
          </div>
        </div>
        
      </div>

    </div>
  );
}
