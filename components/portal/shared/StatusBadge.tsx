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
  Completed: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Not Started": "bg-slate-100 text-slate-600",
  Upcoming: "bg-[#EDE9FE] text-[#7C3AED]",
  "Not Submitted": "bg-red-100 text-red-600",
  "Live Now": "bg-red-100 text-red-600",
  Cancelled: "bg-red-100 text-red-600",
  Rescheduled: "bg-orange-100 text-orange-700",
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
