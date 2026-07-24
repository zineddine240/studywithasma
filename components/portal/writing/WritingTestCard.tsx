"use client";

import Link from "next/link";
import { Clock, FileText, CheckCircle2, FileEdit, ArrowRight } from "lucide-react";
import { WritingTest, WritingTestStatus } from "@/lib/mock/writing-tests";

interface WritingTestCardProps {
  test: WritingTest;
  status: WritingTestStatus;
}

export function WritingTestCard({ test, status }: WritingTestCardProps) {
  const isCompleted = status === "Completed";
  const isDraft = status === "Draft";

  // Determine badge color based on task type
  let badgeColor = "bg-primary/10 text-primary border-primary/20";
  if (test.taskType === "General Task 1") {
    badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  } else if (test.taskType === "Task 2") {
    badgeColor = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden group">
      
      {/* Status indicator line at the top */}
      {isCompleted && <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>}
      {isDraft && <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>}
      
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${badgeColor}`}>
          {test.taskType}
        </span>
        
        {isCompleted && (
          <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Completed
          </span>
        )}
        {isDraft && (
          <span className="flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 px-2 py-1 rounded-md">
            <FileEdit className="w-3.5 h-3.5 mr-1" />
            Draft
          </span>
        )}
      </div>

      <h3 className="text-lg font-extrabold text-foreground mb-2 line-clamp-2">
        {test.title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">
        {test.topicSummary}
      </p>

      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1.5" />
          {test.recommendedTime} mins
        </div>
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-1.5" />
          {test.minWords}+ words
        </div>
      </div>

      <Link
        href={`/student-portal/writing-practice/${test.id}`}
        className={`mt-auto w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors ${
          isCompleted 
            ? "bg-muted text-muted-foreground hover:bg-muted/80" 
            : "bg-primary text-white hover:bg-primary/90 shadow-sm"
        }`}
      >
        {isCompleted ? "Review Correction" : (isDraft ? "Continue Writing" : "Start Practice")}
        {!isCompleted && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </Link>
    </div>
  );
}
