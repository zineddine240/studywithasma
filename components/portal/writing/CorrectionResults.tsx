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
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
            title="Copy to clipboard"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
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
                className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                      {correction.category}
                    </span>
                  </div>
                  <p className="text-sm">
                    <span className="line-through text-rose-500 font-medium mr-2">
                      {correction.originalText}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      → {correction.correctedText}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
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
                className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10"
              >
                <p className="text-sm font-medium mb-1">
                  <span className="text-muted-foreground">{vocab.originalText}</span>
                  <span className="mx-2 text-muted-foreground/30">→</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {vocab.suggestedText}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
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
          <ul className="list-disc list-inside space-y-2 mt-4 text-sm text-foreground">
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
          <ul className="space-y-3 mt-4 text-sm text-foreground">
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
