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
      className={`w-full bg-secondary rounded-full h-2.5 overflow-hidden ${className}`}
    >
      <div
        className="bg-primary h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
