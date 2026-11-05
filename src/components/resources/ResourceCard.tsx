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
        className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-md transition-all flex items-center gap-4"
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
            <span className="text-indigo-600 font-bold">
              {article.category}
            </span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {article.title}
          </h4>

          <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 pt-1">
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
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-16/10 overflow-hidden border-b border-slate-100 bg-slate-100">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold border border-slate-200/80 shadow-2xs">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-500">
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

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-7 pt-4 border-t border-slate-100 mt-auto flex items-center justify-between text-xs font-bold text-indigo-600">
        <span>Read Full Guide</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </div>
    </Link>
  );
}
