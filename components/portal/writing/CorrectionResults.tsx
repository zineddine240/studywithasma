"use client";

import { CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { WritingCorrectionResponse } from "@/lib/ai/schemas";

interface CorrectionResultsProps {
  result: WritingCorrectionResponse;
}

export function CorrectionResults({ result }: CorrectionResultsProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(result.correctedText);
    alert("Corrected text copied to clipboard!");
  };

  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Corrected Text */}
      <PortalCard>
        <div className="flex justify-between items-center mb-4">
          <SectionHeader
            title="Corrected Version"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          />
          <p className="text-muted-foreground text-sm -mt-2 mb-4">Your text with all errors fixed.</p>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            title="Copy to clipboard"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
          {result.correctedText}
        </div>
      </PortalCard>

      {/* 2. Specific Corrections List */}
      {result.corrections.length > 0 && (
        <PortalCard>
          <SectionHeader
            title="Corrections & Explanations"
            icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
          />
          <p className="text-muted-foreground text-sm -mt-2 mb-4">Detailed breakdown of your mistakes.</p>
          <div className="space-y-3 mt-4">
            {result.corrections.map((correction, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {correction.category}
                    </span>
                  </div>
                  <p className="text-sm">
                    <span className="line-through text-rose-500 font-medium mr-2">
                      {correction.originalText}
                    </span>
                    <span className="text-emerald-600 font-bold">
                      → {correction.correctedText}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {correction.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PortalCard>
      )}

      {/* 3. Vocabulary Suggestions */}
      {result.vocabularySuggestions && result.vocabularySuggestions.length > 0 && (
        <PortalCard>
          <SectionHeader
            title="Vocabulary Upgrades"
            icon={<span className="text-xl">✨</span>}
          />
          <p className="text-muted-foreground text-sm -mt-2 mb-4">Better word choices for a higher band score.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {result.vocabularySuggestions.map((vocab, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-amber-100 bg-amber-50/30"
              >
                <p className="text-sm font-medium mb-1">
                  <span className="text-slate-500">{vocab.originalText}</span>
                  <span className="mx-2 text-slate-300">→</span>
                  <span className="text-amber-700 font-bold">
                    {vocab.suggestedText}
                  </span>
                </p>
                <p className="text-xs text-slate-600">
                  {vocab.explanation}
                </p>
              </div>
            ))}
          </div>
        </PortalCard>
      )}

      {/* 4. Clarity Suggestions */}
      {result.claritySuggestions && result.claritySuggestions.length > 0 && (
        <PortalCard>
          <SectionHeader
            title="Clarity & Flow"
            icon={<span className="text-xl">🌊</span>}
          />
          <p className="text-muted-foreground text-sm -mt-2 mb-4">Suggestions to make your writing sound more natural.</p>
          <ul className="list-disc list-inside space-y-2 mt-4 text-sm text-slate-700">
            {result.claritySuggestions.map((suggestion, idx) => (
              <li key={idx} className="leading-relaxed">
                {suggestion}
              </li>
            ))}
          </ul>
        </PortalCard>
      )}

      {/* 5. General Notes */}
      {result.generalNotes && result.generalNotes.length > 0 && (
        <PortalCard className="bg-primary/5 border-primary/20">
          <SectionHeader
            title="General Feedback"
            icon={<span className="text-xl">📝</span>}
          />
          <p className="text-muted-foreground text-sm -mt-2 mb-4">Overall teacher comments.</p>
          <ul className="space-y-3 mt-4 text-sm text-slate-800">
            {result.generalNotes.map((note, idx) => (
              <li key={idx} className="flex gap-2 font-medium">
                <span className="text-primary shrink-0">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </PortalCard>
      )}
    </div>
  );
}
