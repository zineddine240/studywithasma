"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/portal/shared/ProgressBar";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface TestData {
  title: string;
  passage?: string;
  questions: Question[];
}

export default function LevelTestClient({ testData }: { testData: TestData }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1...N = Questions, N+1 = Results
  const [answers, setAnswers] = useState<string[]>(new Array(testData.questions.length).fill(""));
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = testData.questions.length;
  const isLastQuestion = currentStep === totalQuestions;

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSelectOption = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = option;
    setAnswers(newAnswers);
  };

  // INTRO SCREEN
  if (currentStep === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">{testData.title || "General English Assessment"}</h2>
        {testData.passage && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-left mb-8 max-h-64 overflow-y-auto">
            <h3 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">Reading Passage</h3>
            <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{testData.passage}</p>
          </div>
        )}
        <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
          <div className="bg-muted/30 p-4 rounded-xl border border-border">
            <p className="text-xs font-bold text-primary uppercase mb-1">Duration</p>
            <p className="font-bold text-foreground">~15 mins</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border">
            <p className="text-xs font-bold text-primary uppercase mb-1">Questions</p>
            <p className="font-bold text-foreground">{totalQuestions} multiple choice</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border">
            <p className="text-xs font-bold text-primary uppercase mb-1">Feedback</p>
            <p className="font-bold text-foreground">Instant results</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentStep(1)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/80 transition-colors shadow-sm"
        >
          Start Assessment
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // RESULTS SCREEN
  if (showResults) {
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === testData.questions[i].correct_answer) score++;
    });
    const percentage = Math.round((score / totalQuestions) * 100);

    let recommendation = "";
    if (percentage >= 80) recommendation = "Advanced level. You are ready for intensive IELTS preparation.";
    else if (percentage >= 50) recommendation = "Intermediate level. A standard IELTS course is perfect for you.";
    else recommendation = "Beginner level. We recommend starting with General English before IELTS.";

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-2">Assessment Complete!</h2>
        <p className="text-muted-foreground mb-8">Thank you for taking the time to complete the test.</p>
        
        <div className="bg-muted/30 border border-primary/50 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto mb-8">
          <p className="text-sm font-bold text-primary uppercase tracking-wide mb-2">Your Score</p>
          <div className="text-5xl font-black text-foreground mb-4">
            {score} <span className="text-2xl text-[#94A3B8] font-bold">/ {totalQuestions}</span>
          </div>
          <ProgressBar progress={percentage} className="h-3 mb-4" />
          <p className="text-foreground font-semibold">{recommendation}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/80 transition-colors shadow-sm"
          >
            Explore Courses
          </Link>
          <Link
            href="/request-access"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-foreground px-8 py-3.5 rounded-xl font-bold border-2 border-[#E5E7EB] hover:border-primary/50 hover:bg-slate-50 transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    );
  }

  // QUESTION SCREEN
  const qIndex = currentStep - 1;
  const question = testData.questions[qIndex];
  const progressPercent = Math.round(((currentStep - 1) / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
      {/* Progress Header */}
      <div className="bg-muted/30 p-6 border-b border-border">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-primary">Question {currentStep} of {totalQuestions}</span>
          <span className="text-sm font-semibold text-muted-foreground">{progressPercent}%</span>
        </div>
        <ProgressBar progress={progressPercent} className="h-2" />
      </div>

      <div className="p-6 sm:p-10 grow flex flex-col">
        {testData.passage && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8 max-h-48 overflow-y-auto">
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{testData.passage}</p>
          </div>
        )}

        <h3 className="text-xl font-bold text-foreground mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 mb-8">
          {question.options.map((opt, i) => {
            const isSelected = answers[qIndex] === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  isSelected 
                    ? "border-primary bg-muted/30 shadow-sm" 
                    : "border-[#E5E7EB] hover:border-primary/50 bg-white"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? "border-primary" : "border-[#CBD5E1]"
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                </div>
                <span className={`font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 text-muted-foreground font-bold py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[qIndex]}
            className="inline-flex items-center gap-2 bg-primary text-white py-2.5 px-6 rounded-xl font-bold hover:bg-primary/80 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? "Submit Test" : "Next Question"}
            {!isLastQuestion && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
