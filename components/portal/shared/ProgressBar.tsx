import React from "react";

export function ProgressBar({
  progress,
  className = "",
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div
      className={`w-full bg-[#EDE9FE] rounded-full h-2.5 overflow-hidden ${className}`}
    >
      <div
        className="bg-[#7C3AED] h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
