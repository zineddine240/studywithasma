import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  action?: React.ReactNode;
}

export function PageHeader({ title, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <nav className="flex items-center text-sm text-muted-foreground">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={item.label}>
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-foreground font-medium" : ""}>
                    {item.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 mx-2 text-muted-foreground/50" />}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
