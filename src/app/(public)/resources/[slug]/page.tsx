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
    <main className="grow bg-background">
      {/* ── Breadcrumb Nav ── */}
      <div className="bg-muted/40 border-b border-border py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 hover:text-foreground font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Resources</span>
            </Link>
            <span className="font-bold text-primary">{article.category}</span>
          </div>
        </div>
      </div>

      {/* ── Article Header ── */}
      <article className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 text-center">
              <SectionTag>{article.category}</SectionTag>
              <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-foreground tracking-tight leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2">
                <span className="font-bold text-foreground">
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
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border shadow-xl">
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
              <div className="bg-primary/5 rounded-3xl border border-primary/20 p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-primary font-serif font-bold text-lg">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Key Takeaways at a Glance</span>
                </div>
                <ul className="space-y-2 text-sm text-foreground/90">
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
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                    {section.heading}
                  </h2>

                  <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {section.body.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  {section.tips && section.tips.length > 0 && (
                    <div className="mt-4 p-5 rounded-2xl bg-muted/60 border-l-4 border-primary text-xs sm:text-sm text-foreground space-y-1.5">
                      <div className="font-bold text-primary flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Examiner Tip:</span>
                      </div>
                      {section.tips.map((tip, tIdx) => (
                        <p key={tIdx} className="text-muted-foreground">
                          {tip}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Author Box */}
            <div className="mt-16 pt-8 border-t border-border flex items-center gap-5 bg-card p-6 rounded-3xl border shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                A
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-foreground text-base">
                  Written by {article.author.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
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
        <section className="py-16 bg-muted/30 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
            <div className="max-w-4xl mx-auto space-y-8">
              <h3 className="text-2xl font-serif font-bold text-foreground text-center">
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
      <section className="py-20 bg-background relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="relative bg-[#183ce4] rounded-3xl sm:rounded-4xl p-10 sm:p-16 lg:p-20 text-white text-center shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
                Ready to Put These Strategies Into Practice?
              </h3>
              <p className="text-base text-white/90 max-w-lg mx-auto leading-relaxed">
                Join Asma's structured classes or schedule an exploratory study
                abroad consultation.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg shadow-amber-400/20 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                >
                  <span>Book a Consultation</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
                <Link
                  href="/ielts"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3.5 rounded-full font-bold text-sm transition-colors"
                >
                  <span>Explore IELTS Courses</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
