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
    // Prevent changing the answer after it has been selected
    if (answers[currentStep - 1]) return;
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

    let cefrLevel = "";
    let cefrColor = "";
    let recommendation = "";
    if (score <= 3) { cefrLevel = "A1 Beginner"; cefrColor = "text-red-500"; recommendation = "Start with foundational General English courses."; }
    else if (score <= 7) { cefrLevel = "A2 Elementary"; cefrColor = "text-orange-500"; recommendation = "Pre-intermediate English courses are perfect for you."; }
    else if (score <= 11) { cefrLevel = "B1 Intermediate"; cefrColor = "text-amber-500"; recommendation = "You have a solid foundation. You can start IELTS foundation courses."; }
    else if (score <= 15) { cefrLevel = "B2 Upper Intermediate"; cefrColor = "text-emerald-500"; recommendation = "You are ready for intensive IELTS preparation."; }
    else if (score <= 18) { cefrLevel = "C1 Advanced"; cefrColor = "text-blue-500"; recommendation = "Excellent! You can aim for a high IELTS band score (7.0+)."; }
    else { cefrLevel = "C2 Proficient"; cefrColor = "text-purple-500"; recommendation = "Outstanding proficiency! You are capable of achieving top IELTS bands."; }

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-2">Assessment Complete!</h2>
        <p className="text-muted-foreground mb-8">Thank you for taking the time to complete the test.</p>
        
        <div className="bg-muted/30 border border-primary/50 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto mb-8">
          <p className="text-sm font-bold text-primary uppercase tracking-wide mb-2">Your Score</p>
          <div className="text-5xl font-black text-foreground mb-2">
            {score} <span className="text-2xl text-[#94A3B8] font-bold">/ {totalQuestions}</span>
          </div>
          <p className="text-sm font-semibold text-muted-foreground mb-4">Questions Answered Correctly</p>
          
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1">Your Estimated Level</p>
            <h3 className={`text-2xl font-black ${cefrColor} mb-2`}>{cefrLevel}</h3>
            <p className="text-foreground font-semibold">{recommendation}</p>
          </div>
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
            const selectedOption = answers[qIndex];
            const isAnswered = !!selectedOption;
            const isCorrectOption = opt === question.correct_answer;
            const isSelected = selectedOption === opt;

            let btnClass = "border-[#E5E7EB] hover:border-primary/50 bg-white";
            let indicatorClass = "border-[#CBD5E1]";
            let dotClass = "";

            if (isAnswered) {
              if (isCorrectOption) {
                btnClass = "border-emerald-500 bg-emerald-50 shadow-sm";
                indicatorClass = "border-emerald-500";
                dotClass = "bg-emerald-500";
              } else if (isSelected && !isCorrectOption) {
                btnClass = "border-red-500 bg-red-50 shadow-sm";
                indicatorClass = "border-red-500";
                dotClass = "bg-red-500";
              } else {
                btnClass = "border-[#E5E7EB] bg-slate-50 opacity-50";
                indicatorClass = "border-[#CBD5E1]";
              }
            } else {
              if (isSelected) {
                 btnClass = "border-primary bg-muted/30 shadow-sm";
                 indicatorClass = "border-primary";
                 dotClass = "bg-primary";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${btnClass}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${indicatorClass}`}>
                  {(isSelected || (isAnswered && isCorrectOption)) && <div className={`w-2.5 h-2.5 rounded-full ${dotClass}`}></div>}
                </div>
                <span className={`font-medium ${isAnswered ? (isCorrectOption ? "text-emerald-900" : (isSelected ? "text-red-900" : "text-muted-foreground")) : (isSelected ? "text-foreground" : "text-muted-foreground")}`}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {answers[qIndex] && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-medium border ${answers[qIndex] === question.correct_answer ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
             <span className="font-bold block mb-1">
               {answers[qIndex] === question.correct_answer ? "✓ Correct!" : "✗ Incorrect"}
             </span>
             {question.explanation}
          </div>
        )}

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
