"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { GENERAL_FAQS } from "@/lib/studyAbroadData";
import { SectionTag } from "@/components/ui/section-tag";

export default function FaqSection() {
  // Start with all accordions closed so all rows are perfectly aligned
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section
      className="py-20 lg:py-28 bg-[#f4f7fe] dark:bg-slate-950 relative overflow-hidden transition-colors [content-visibility:auto] [contain-intrinsic-size:auto_600px]"
      id="faq"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
        {/* Section Header (Matching Porbe's exact kicker & typography) */}
        <div className="text-center space-y-3 mb-16 sm:mb-20">
          <SectionTag>FAQ</SectionTag>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* 2-Column Clean Accordion Grid with Uniform Closed Height for Perfect Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
          {GENERAL_FAQS.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div
                key={faq.question}
                className={`bg-white dark:bg-slate-900 border rounded-3xl transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  isOpen
                    ? "border-blue-500/50 shadow-md shadow-blue-900/5"
                    : "border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full min-h-[88px] sm:min-h-[96px] px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isOpen
                        ? "bg-blue-600 text-white border-blue-600 rotate-180"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4 animate-in fade-in-0 duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
