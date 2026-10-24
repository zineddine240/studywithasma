// High-definition circular flag SVGs (Crisp vector rendering across all OS viewports)

export function FranceFlag({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      className={`${className} rounded-full overflow-hidden shadow-xs shrink-0 border border-slate-200/60 dark:border-slate-700`}
      viewBox="0 0 512 512"
      aria-label="France flag"
    >
      <rect width="170.7" height="512" fill="#002654" />
      <rect x="170.7" width="170.7" height="512" fill="#FFFFFF" />
      <rect x="341.3" width="170.7" height="512" fill="#ED2939" />
    </svg>
  );
}

export function ItalyFlag({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      className={`${className} rounded-full overflow-hidden shadow-xs shrink-0 border border-slate-200/60 dark:border-slate-700`}
      viewBox="0 0 512 512"
      aria-label="Italy flag"
    >
      <rect width="170.7" height="512" fill="#009246" />
      <rect x="170.7" width="170.7" height="512" fill="#FFFFFF" />
      <rect x="341.3" width="170.7" height="512" fill="#CE2B37" />
    </svg>
  );
}
