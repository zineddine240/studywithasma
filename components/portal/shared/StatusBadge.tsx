import React from "react";

export type StatusType = 
  | "Completed" 
  | "In Progress" 
  | "Not Started" 
  | "Upcoming" 
  | "Not Submitted"
  | "Live Now"
  | "Cancelled"
  | "Rescheduled";

const statusStyles: Record<StatusType, string> = {
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "Not Started": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Upcoming: "bg-secondary text-primary dark:bg-primary/20 dark:text-primary",
  "Not Submitted": "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  "Live Now": "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Cancelled: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Rescheduled: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
};

export function StatusBadge({ status }: { status: StatusType }) {
  const style = statusStyles[status] || statusStyles["Not Started"];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}
