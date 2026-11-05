import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 transition-colors outline-none placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
