import React from "react";

export function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon && <span className="text-[#7C3AED]">{icon}</span>}
      <h2 className="text-xl font-bold text-[#1E1B4B] tracking-tight">
        {title}
      </h2>
    </div>
  );
}
