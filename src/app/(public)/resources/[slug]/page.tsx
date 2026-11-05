import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  User,
  Share2,
} from "lucide-react";
import { getAllArticles, getArticleBySlug } from "@/lib/resourceData";
import ResourceCard from "@/components/resources/ResourceCard";
import SectionTag from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Study With Asma",
    };
  }

  return {
    title: `${article.title} | Study With Asma`,
    description: article.excerpt,
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const related = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  return (
    <main className="grow bg-white">
      {/* ── Breadcrumb Nav ── */}
      <div className="bg-[#FAFAFC] border-b border-slate-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Resources</span>
            </Link>
            <span className="font-bold text-indigo-600">
              {article.category}
            </span>
          </div>
        </div>
      </div>

      {/* ── Article Header ── */}
      <article className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 text-center">
              <div>
                <SectionTag>{article.category}</SectionTag>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1536] tracking-tight leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-500 pt-2">
                <span className="font-bold text-slate-900">
                  By {article.author.name}
                </span>
                <span>•</span>
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
            </div>

            {/* Hero Image */}
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
              <Image
                src={article.heroImage}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>

            {/* Key Takeaways Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="bg-indigo-50/70 rounded-3xl border border-indigo-100 p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-lg">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Key Takeaways at a Glance</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {article.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Sections Content */}
            <div className="space-y-12 pt-6">
              {article.sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                    {section.heading}
                  </h2>

                  <div className="space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                    {section.body.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  {section.tips && section.tips.length > 0 && (
                    <div className="mt-4 p-5 rounded-2xl bg-amber-50/80 border-l-4 border-amber-500 text-xs sm:text-sm text-slate-800 space-y-1.5">
                      <div className="font-bold text-amber-900 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>Examiner Tip:</span>
                      </div>
                      {section.tips.map((tip, tIdx) => (
                        <p key={tIdx} className="text-slate-600">
                          {tip}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Author Box */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center gap-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                A
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">
                  Written by {article.author.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {article.author.role}. Helping students achieve their target
                  band scores and study at top international institutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ── Related Guides ── */}
      {related.length > 0 && (
        <section className="py-16 bg-[#FAFAFC] border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <h3 className="text-2xl font-extrabold text-[#0B1536] text-center">
                Continue Reading
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {related.map((a) => (
                  <ResourceCard key={a.slug} article={a} variant="standard" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <NewCtaSection />
    </main>
  );
}
