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
      className={`bg-card rounded-2xl border border-border p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
