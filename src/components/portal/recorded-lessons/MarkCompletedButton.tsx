"use client";

import { useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { markLessonCompleted } from "@/app/student-portal/actions";
import { toast } from "sonner";
import { PortalCard } from "@/components/portal/shared/PortalCard";

export function MarkCompletedButton({ lessonId, isCompleted }: { lessonId: string, isCompleted: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleMarkCompleted = () => {
    startTransition(async () => {
      const result = await markLessonCompleted(lessonId);
      if (result.error) {
        toast.error("Failed to mark lesson as completed");
      } else {
        toast.success("Lesson marked as completed!");
      }
    });
  };

  if (isCompleted) {
    return (
      <PortalCard className="bg-emerald-50 border-emerald-200 flex flex-col items-center text-center p-6">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
        <h3 className="font-bold text-emerald-900 mb-1">Lesson Completed</h3>
        <p className="text-xs text-emerald-700 mb-4">You have successfully finished this lesson.</p>
      </PortalCard>
    );
  }

  return (
    <PortalCard className="bg-muted/30 border-primary/50 flex flex-col items-center text-center p-6">
      <CheckCircle2 className="w-12 h-12 text-primary mb-3 opacity-80" />
      <h3 className="font-bold text-foreground mb-1">Finished this lesson?</h3>
      <p className="text-xs text-muted-foreground mb-4">Mark it as completed to track your progress.</p>
      <button 
        onClick={handleMarkCompleted}
        disabled={isPending}
        className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary/80 transition-colors shadow-sm disabled:opacity-50"
      >
        {isPending ? "Marking..." : "Mark as Completed"}
      </button>
    </PortalCard>
  );
}
