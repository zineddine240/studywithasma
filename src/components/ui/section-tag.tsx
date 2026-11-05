import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionTagVariants = cva(
  "inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        blue: "text-indigo-600",
        amber: "text-amber-500",
        white: "text-white",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  },
);

export interface SectionTagProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionTagVariants> {
  pipClassName?: string;
  animate?: boolean;
  [key: `data-${string}`]: unknown;
}

export function SectionTag({
  children,
  variant = "blue",
  className,
  pipClassName,
  animate = true,
  ...props
}: SectionTagProps) {
  const pipColor =
    variant === "white"
      ? "bg-white"
      : variant === "amber"
      ? "bg-amber-400"
      : "bg-indigo-600";

  return (
    <div className={cn(sectionTagVariants({ variant }), className)} {...props}>
      <span
        aria-hidden="true"
        className={cn(
          "inline-block w-2 h-2 rounded-[2px] shrink-0",
          pipColor,
          animate && "animate-pip-rotate",
          pipClassName,
        )}
      />
      <span>{children}</span>
    </div>
  );
}

export { sectionTagVariants };
export default SectionTag;
