"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FranceFlag, ItalyFlag } from "./CountryFlags";

export function HeroPathwaySelector() {
  const [activeTab, setActiveTab] = useState<
    "france" | "italy" | "ielts" | "test"
  >("france");

  return (
    <div className="hero-search-bar mt-8 sm:mt-12 max-w-4xl mx-auto relative z-30">
      <div className="bg-slate-950 dark:bg-card text-white p-2.5 sm:p-3 sm:px-4 rounded-3xl md:rounded-full shadow-sm border border-slate-800 text-left flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("france")}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === "france"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <FranceFlag className="w-3.5 h-3.5" />
            <span>Study in France</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("italy")}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === "italy"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <ItalyFlag className="w-3.5 h-3.5" />
            <span>Study in Italy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ielts")}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ielts"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            IELTS Prep
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("test")}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === "test"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            Free Level Test
          </button>
        </div>

        {/* Check Pathway Button */}
        <div className="w-full md:w-auto shrink-0">
          <Link
            href={
              activeTab === "test"
                ? "/level-test"
                : activeTab === "ielts"
                  ? "/courses"
                  : activeTab === "italy"
                    ? "/destinations/italy"
                    : "/destinations/france"
            }
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-xs group"
          >
            <span>Check Pathway</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroPathwaySelector;
