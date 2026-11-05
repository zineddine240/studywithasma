"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, BookOpen } from "lucide-react";
import ResourceCard from "@/components/resources/ResourceCard";
import type { ResourceArticle } from "@/lib/resourceData";
import SectionTag from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

interface ResourcesPageClientProps {
  articles: ResourceArticle[];
}

const CATEGORIES = ["All", "IELTS Preparation", "Study Abroad", "Scholarships"];

export default function ResourcesPageClient({
  articles,
}: ResourcesPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = articles.filter((a) => {
    const matchesCategory =
      selectedCategory === "All" || a.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="grow bg-white">
      {/* ── Page Hero ── */}
      <section className="pt-10 sm:pt-14 pb-14 sm:pb-20 bg-[#FAFAFC] border-b border-slate-100 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <SectionTag>RESOURCES &amp; ARTICLES</SectionTag>

          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0B1536] tracking-tight max-w-4xl mx-auto leading-[1.12]">
            IELTS Preparation Strategies &amp; Study Abroad Advice
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            In-depth guides crafted by senior trainer Asma to help you master
            test rubrics and navigate European university applications.
          </p>

          <div className="pt-2 select-none -rotate-1">
            <span className="font-handwriting text-2xl sm:text-3xl font-bold text-indigo-700">
              Knowledge is your passport ♡
            </span>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#F59E0B] text-slate-950 shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map((article) => (
                <ResourceCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-sm">
              No articles found matching &ldquo;{searchQuery}&rdquo;. Try
              choosing &ldquo;All&rdquo; or a different search keyword.
            </div>
          )}
        </div>
      </section>

      {/* ── Diagnostic Level Test Callout ── */}
      <section className="py-14 sm:py-16 bg-[#FAFAFC] border-b border-slate-100 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1536]">
              Test Your English Baseline
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Discover your current English proficiency level in 15 minutes with
              our free diagnostic assessment.
            </p>
            <div className="pt-2">
              <Link
                href="/level-test"
                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-7 py-3 rounded-full text-sm shadow-xs transition-colors"
              >
                <span>Take Free Diagnostic Test</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA Banner ── */}
      <NewCtaSection />
    </main>
  );
}
