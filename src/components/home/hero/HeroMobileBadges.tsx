import { Target, Euro } from "lucide-react";
import { FranceFlag, ItalyFlag } from "./CountryFlags";

export function HeroMobileBadges() {
  return (
    <div className="md:hidden flex flex-wrap justify-center gap-2 mb-2 z-20">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-xs">
        <FranceFlag className="w-4 h-4" /> France
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-xs">
        <ItalyFlag className="w-4 h-4" /> Italy
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-xs">
        <Target className="w-3.5 h-3.5 text-amber-500" /> Band 7.5+
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-xs">
        <Euro className="w-3.5 h-3.5 text-blue-600" /> €0 Tuition
      </span>
    </div>
  );
}

export default HeroMobileBadges;
