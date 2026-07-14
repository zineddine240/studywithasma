import React from "react";

export function PortalCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#EDE9FE] shadow-sm p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
