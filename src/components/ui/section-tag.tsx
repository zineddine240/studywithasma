import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sectionTagVariants = cva(
  "inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest",
  {
    variants: {
      variant: {
        blue: "text-blue-600 dark:text-blue-400",
        amber: "text-white",
        white: "text-white",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  },
);

const pipVariants = cva("w-2.5 h-2.5 rounded-xs inline-block shrink-0", {
  variants: {
    variant: {
      blue: "bg-blue-600 dark:bg-blue-500",
      amber: "bg-amber-400",
      white: "bg-white",
    },
  },
  defaultVariants: {
    variant: "blue",
  },
});

export interface SectionTagProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionTagVariants> {
  pipClassName?: string;
  animate?: boolean;
}

export function SectionTag({
  children,
  variant = "blue",
  className,
  pipClassName,
  animate = true,
  ...props
}: SectionTagProps) {
  return (
    <div className={cn(sectionTagVariants({ variant }), className)} {...props}>
      <span
        aria-hidden="true"
        className={cn(
          pipVariants({ variant }),
          animate && "animate-pip-rotate",
          pipClassName,
        )}
      />
      {children}
    </div>
  );
}

export { sectionTagVariants, pipVariants };
export default SectionTag;
