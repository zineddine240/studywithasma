import type { ProcessStep } from "./process-data";

export function ProcessStepColumn({ step }: { step: ProcessStep }) {
  if (step.isTopCard) {
    return (
      <div className="flex flex-col justify-between items-center h-full">
        {/* Top Card */}
        <div className="relative w-full h-[150px] flex flex-col justify-center items-center bg-white dark:bg-slate-900 rounded-3xl px-5 py-4 border border-slate-100 dark:border-slate-800 shadow-md shadow-blue-900/5 dark:shadow-black/20 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
            {step.title}
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-snug">
            {step.line1} <br /> {step.line2}
          </p>
          {/* Yellow Connection Dot at Bottom Center */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 shadow-xs z-20" />
        </div>

        {/* Bottom Step Indicator */}
        <div className="h-[150px] flex flex-col justify-center items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-300" />
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
            {step.step}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center h-full">
      {/* Top Step Indicator */}
      <div className="h-[150px] flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
          {step.step}
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-300" />
      </div>

      {/* Bottom Card */}
      <div className="relative w-full h-[150px] flex flex-col justify-center items-center bg-white dark:bg-slate-900 rounded-3xl px-5 py-4 border border-slate-100 dark:border-slate-800 shadow-md shadow-blue-900/5 dark:shadow-black/20 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
        {/* Yellow Connection Dot at Top Center */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 shadow-xs z-20" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
          {step.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-snug">
          {step.line1} <br /> {step.line2}
        </p>
      </div>
    </div>
  );
}

export default ProcessStepColumn;
