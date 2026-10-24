"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Sparkles, ArrowRight } from "lucide-react";
import ResourceCard from "@/components/resources/ResourceCard";
import type { ResourceArticle } from "@/lib/resourceData";
import SectionTag from "@/components/ui/section-tag";

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
    <main className="grow bg-background">
      {/* ── Page Hero ── */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-secondary/40 via-background to-background border-b border-border relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  text-center space-y-6">
          <SectionTag>RESOURCES & ARTICLES</SectionTag>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
            IELTS Preparation Strategies &amp;{" "}
            <br className="hidden sm:inline" />
            <span className="text-primary">Study Abroad Advice</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            In-depth guides crafted by senior trainer Asma to help you master
            test rubrics and plan your international university pathway.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
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
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((article) => (
                <ResourceCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              No articles found matching your criteria. Try choosing "All" or a
              different search keyword.
            </div>
          )}
        </div>
      </section>

      {/* ── Diagnostic Level Test Callout ── */}
      <section className="py-16 bg-muted/40 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Test Your Knowledge
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover your current English proficiency level in 15 minutes with
              our free diagnostic assessment.
            </p>
            <div className="pt-2">
              <Link
                href="/level-test"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
              >
                <span>Take Free Diagnostic Test</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
