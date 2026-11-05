"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
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
  duration_minutes?: number;
}

export default function LevelTestClient({ testData }: { testData: TestData }) {
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1...N = Questions, N+1 = Results
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    (testData.duration_minutes || 15) * 60,
  ); // minutes in seconds

  useEffect(() => {
    // Fisher-Yates Shuffle
    const shuffleArray = <T,>(array: T[]): T[] => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    // Shuffle all questions, pick up to 20
    const shuffledQuestions = shuffleArray(testData.questions);
    const selectedQuestions = shuffledQuestions.slice(0, 20).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setActiveQuestions(selectedQuestions);
    setAnswers(new Array(selectedQuestions.length).fill(""));
    setIsReady(true);
  }, [testData.questions]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep > 0 && !showResults && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResults) {
      setShowResults(true);
    }
    return () => clearInterval(timer);
  }, [currentStep, showResults, timeLeft]);

  if (!isReady) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-pulse">
        Loading assessment...
      </div>
    );
  }

  const totalQuestions = activeQuestions.length;
  const isLastQuestion = currentStep === totalQuestions;

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
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
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 p-8 md:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536] mb-4">
          {testData.title || "General English Assessment"}
        </h2>
        {testData.passage && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 text-left mb-8 max-h-64 overflow-y-auto">
            <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">
              Reading Passage
            </h3>
            <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
              {testData.passage}
            </p>
          </div>
        )}
        <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">
              Duration
            </p>
            <p className="font-bold text-slate-900">
              ~{testData.duration_minutes || 15} mins
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">
              Questions
            </p>
            <p className="font-bold text-slate-900">
              {totalQuestions} multiple choice
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">
              Feedback
            </p>
            <p className="font-bold text-slate-900">Instant results</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentStep(1)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 px-8 py-3.5 rounded-full font-bold transition-colors shadow-sm cursor-pointer"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // RESULTS SCREEN
  if (showResults) {
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === activeQuestions[i].correct_answer) score++;
    });

    let cefrLevel = "";
    let cefrColor = "";
    let recommendation = "";
    if (score <= 3) {
      cefrLevel = "A1 Beginner";
      cefrColor = "text-red-600";
      recommendation = "Start with foundational General English courses.";
    } else if (score <= 7) {
      cefrLevel = "A2 Elementary";
      cefrColor = "text-amber-600";
      recommendation = "Pre-intermediate English courses are perfect for you.";
    } else if (score <= 11) {
      cefrLevel = "B1 Intermediate";
      cefrColor = "text-indigo-600";
      recommendation =
        "You have a solid foundation. You can start IELTS foundation courses.";
    } else if (score <= 15) {
      cefrLevel = "B2 Upper Intermediate";
      cefrColor = "text-emerald-600";
      recommendation = "You are ready for intensive IELTS preparation.";
    } else if (score <= 18) {
      cefrLevel = "C1 Advanced";
      cefrColor = "text-blue-600";
      recommendation =
        "Excellent! You can aim for a high IELTS band score (7.0+).";
    } else {
      cefrLevel = "C2 Proficient";
      cefrColor = "text-purple-600";
      recommendation =
        "Outstanding proficiency! You are capable of achieving top IELTS bands.";
    }

    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#0B1536] mb-2">
          Assessment Complete!
        </h2>
        <p className="text-slate-600 mb-8">
          Thank you for taking the time to complete the test.
        </p>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto mb-8">
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">
            Your Score
          </p>
          <div className="text-5xl font-black text-slate-900 mb-2">
            {score}{" "}
            <span className="text-2xl text-slate-400 font-bold">
              / {totalQuestions}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-4">
            Questions Answered Correctly
          </p>

          <div className="border-t border-slate-200 pt-4 mt-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">
              Your Estimated Level
            </p>
            <h3 className={`text-2xl font-black ${cefrColor} mb-2`}>
              {cefrLevel}
            </h3>
            <p className="text-slate-800 font-semibold">{recommendation}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Explore Courses
          </Link>
          <Link
            href="/request-access"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold border-2 border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    );
  }

  // QUESTION SCREEN
  const qIndex = currentStep - 1;
  const question = activeQuestions[qIndex];
  const progressPercent = Math.round(
    ((currentStep - 1) / totalQuestions) * 100,
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
      {/* Progress Header */}
      <div className="bg-slate-50 p-6 border-b border-slate-200/80">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-indigo-600">
            Question {currentStep} of {totalQuestions}
          </span>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-1.5 text-sm font-bold ${
                timeLeft < 60 ? "text-red-500 animate-pulse" : "text-slate-500"
              }`}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {progressPercent}%
            </span>
          </div>
        </div>
        <ProgressBar progress={progressPercent} className="h-2" />
      </div>

      <div className="p-6 sm:p-10 grow flex flex-col">
        {testData.passage && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 mb-8 max-h-48 overflow-y-auto">
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {testData.passage}
            </p>
          </div>
        )}

        <h3 className="text-xl font-bold text-[#0B1536] mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 mb-8">
          {question.options.map((opt, i) => {
            const selectedOption = answers[qIndex];
            const isAnswered = !!selectedOption;
            const isCorrectOption = opt === question.correct_answer;
            const isSelected = selectedOption === opt;

            let btnClass = "border-slate-200 hover:border-indigo-400 bg-white";
            let indicatorClass = "border-slate-300";
            let dotClass = "";

            if (isAnswered) {
              if (isCorrectOption) {
                btnClass = "border-emerald-500 bg-emerald-50/80 shadow-2xs";
                indicatorClass = "border-emerald-500";
                dotClass = "bg-emerald-500";
              } else if (isSelected && !isCorrectOption) {
                btnClass = "border-red-400 bg-red-50/80 shadow-2xs";
                indicatorClass = "border-red-400";
                dotClass = "bg-red-400";
              } else {
                btnClass = "border-slate-100 bg-slate-50/50 opacity-50";
                indicatorClass = "border-slate-200";
              }
            } else {
              if (isSelected) {
                btnClass = "border-indigo-600 bg-indigo-50/50 shadow-2xs";
                indicatorClass = "border-indigo-600";
                dotClass = "bg-indigo-600";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer ${btnClass}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${indicatorClass}`}
                >
                  {(isSelected || (isAnswered && isCorrectOption)) && (
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${dotClass}`}
                    ></div>
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isAnswered
                      ? isCorrectOption
                        ? "text-emerald-800"
                        : isSelected
                          ? "text-red-700"
                          : "text-slate-400"
                      : isSelected
                        ? "text-slate-900"
                        : "text-slate-700"
                  }`}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {answers[qIndex] && (
          <div
            className={`mb-8 p-4 rounded-xl text-sm font-medium border ${
              answers[qIndex] === question.correct_answer
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <span className="font-bold block mb-1">
              {answers[qIndex] === question.correct_answer
                ? "✓ Correct!"
                : "✗ Incorrect"}
            </span>
            {question.explanation}
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-slate-200/80 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 text-slate-600 font-bold py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[qIndex]}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white py-2.5 px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{isLastQuestion ? "Submit Test" : "Next Question"}</span>
            {!isLastQuestion && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
