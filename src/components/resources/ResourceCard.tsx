import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { ResourceArticle } from "@/lib/resourceData";

interface ResourceCardProps {
  article: ResourceArticle;
  variant?: "standard" | "compact" | "featured";
}

export default function ResourceCard({
  article,
  variant = "standard",
}: ResourceCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/resources/${article.slug}`}
        className="group bg-card p-4 sm:p-5 rounded-2xl border border-border hover:border-primary/40 shadow-xs hover:shadow-md transition-all flex items-center gap-4"
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-border">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-semibold">
            <span className="text-primary">{article.category}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <h4 className="font-serif font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h4>

          <div className="flex items-center gap-1 text-xs font-bold text-primary pt-1">
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group bg-card rounded-3xl border border-border/80 hover:border-primary/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-16/10 overflow-hidden border-b border-border">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground text-xs font-bold border border-border shadow-xs">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-7 pt-0 border-t border-border/60 mt-auto flex items-center justify-between text-xs font-bold text-primary">
        <span>Read Full Guide</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </div>
    </Link>
  );
}
