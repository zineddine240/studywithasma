"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles } from "lucide-react";
import { getAllArticles } from "@/lib/resourceData";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { SectionTag } from "@/components/ui/section-tag";

export default function FeaturedResourcesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const articles = getAllArticles();
  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const sideArticles = articles
    .filter((a) => a.slug !== featuredArticle.slug)
    .slice(0, 2);

  useGSAP(
    () => {
      if (isReducedMotion()) return;
      if (!contentRef.current) return;

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#183ce4] text-white relative overflow-hidden"
      id="resources"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  relative z-10">
        {/* Section Header (Matching Porbe's typography) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl text-left">
            <SectionTag variant="white">BLOG</SectionTag>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight">
              Insights, Inspiration, and Innovation.
            </h2>
          </div>

          <Link
            href="/resources"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shrink-0 self-start sm:self-end shadow-lg hover:-translate-y-0.5"
          >
            <span>More Articles</span>
            <span className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center">
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* Porbe-Inspired Featured Grid (Large Left + Stacked Right) */}
        <div
          ref={contentRef}
          className="grid lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Main Featured Article (7 cols) */}
          <div className="lg:col-span-7">
            <Link
              href={`/resources/${featuredArticle.slug}`}
              className="group bg-blue-950/60 rounded-3xl border border-white/20 hover:border-amber-400/80 shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <Image
                  src={featuredArticle.heroImage}
                  alt={featuredArticle.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-blue-950 via-blue-950/40 to-transparent" />

                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                    Featured • {featuredArticle.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 text-left">
                <div className="flex items-center gap-4 text-xs text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    {featuredArticle.publishDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {featuredArticle.title}
                </h3>

                <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 group-hover:text-amber-200">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Stacked Side Articles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {sideArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="group bg-blue-950/60 rounded-3xl border border-white/20 hover:border-amber-400/80 p-5 shadow-xl transition-all duration-300 flex gap-5 items-center flex-1 text-left"
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    sizes="128px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-white/70">
                    <span className="text-amber-300 font-bold">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:text-amber-200">
                    <span>Read More</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
