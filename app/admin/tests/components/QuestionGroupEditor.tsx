"use client";

import { useState } from "react";
import { Plus, Trash2, HelpCircle, Layers, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { QuestionGroupItem, QuestionType, QuestionItem } from "@/lib/types/test";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuestionGroupEditorProps {
  group: QuestionGroupItem;
  groupIndex: number;
  partIndex: number;
  onUpdateGroup: (updatedGroup: QuestionGroupItem) => void;
  onDeleteGroup: () => void;
  startQuestionNum: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice (QCM)",
  tf_ng: "True / False / Not Given",
  yn_ng: "Yes / No / Not Given",
  summary_completion: "Summary Completion",
  note_completion: "Note Completion",
  flow_chart_completion: "Flow Chart Completion",
  drag_and_drop: "Drag & Drop Word Bank",
  matching: "Matching Headings / Features",
};

export function QuestionGroupEditor({
  group,
  groupIndex,
  partIndex,
  onUpdateGroup,
  onDeleteGroup,
  startQuestionNum,
  isCollapsed: isCollapsedProp,
  onToggleCollapse,
}: QuestionGroupEditorProps) {
  const [wordBankInput, setWordBankInput] = useState("");
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = isCollapsedProp !== undefined ? isCollapsedProp : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const updateField = <K extends keyof QuestionGroupItem>(field: K, value: QuestionGroupItem[K]) => {
    onUpdateGroup({ ...group, [field]: value });
  };

  const isCompletionType = [
    "summary_completion",
    "note_completion",
    "flow_chart_completion",
    "drag_and_drop",
  ].includes(group.type);

  const isWordBankType = group.type === "drag_and_drop" || group.type === "matching";

  // Question handlers
  const handleAddQuestion = () => {
    if (isCollapsed) {
      handleToggle();
    }
    const nextNum = startQuestionNum + group.questions.length;
    const newQIdx = group.questions.length;
    const newQuestion: QuestionItem = {
      number: nextNum,
      question: group.type === "multiple_choice" ? `Question ${nextNum}` : "",
      options: group.type === "multiple_choice" ? ["Option A", "Option B", "Option C", "Option D"] : undefined,
      correct_answer: group.type === "multiple_choice" ? "Option A" : group.type === "tf_ng" ? "True" : group.type === "yn_ng" ? "Yes" : "",
      explanation: "",
    };
    updateField("questions", [...group.questions, newQuestion]);

    // Auto scroll to newly created question
    setTimeout(() => {
      const qEl = document.getElementById(`q-item-${partIndex}-${groupIndex}-${newQIdx}`);
      if (qEl) {
        qEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 120);
  };

  const handleUpdateQuestion = (qIdx: number, updated: QuestionItem) => {
    const updatedQs = [...group.questions];
    updatedQs[qIdx] = updated;
    updateField("questions", updatedQs);
  };

  const handleDeleteQuestion = (qIdx: number) => {
    const updatedQs = group.questions.filter((_, i) => i !== qIdx);
    updateField("questions", updatedQs);
  };

  // Word Bank handlers for Drag & Drop / Matching
  const handleAddWordBankOption = () => {
    if (!wordBankInput.trim()) return;
    const currentOptions = group.options || [];
    updateField("options", [...currentOptions, wordBankInput.trim()]);
    setWordBankInput("");
  };

  const handleRemoveWordBankOption = (optIdx: number) => {
    const currentOptions = group.options || [];
    updateField(
      "options",
      currentOptions.filter((_, i) => i !== optIdx)
    );
  };

  // Quick Helper to insert [Q1], [Q2] token into group content
  const insertTokenIntoContent = (tokenNumber: number) => {
    const token = `[Q${tokenNumber}]`;
    const currentContent = group.content || "";
    updateField("content", currentContent ? `${currentContent} ${token}` : token);
  };

  return (
    <Card id={`group-card-${partIndex}-${groupIndex}`} className="py-0 border-border shadow-sm transition-all overflow-hidden scroll-mt-24">
      <div
        onClick={handleToggle}
        className={`bg-muted/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none hover:bg-muted/50 transition-colors ${
          !isCollapsed ? "border-b border-border" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-bold text-xs bg-background shrink-0">
            Group {groupIndex + 1}
          </Badge>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            {group.title || `Question Group ${groupIndex + 1}`}
            <span className="text-xs font-normal text-muted-foreground bg-background px-2.5 py-0.5 rounded-full border border-border">
              {group.questions.length} question{group.questions.length !== 1 ? "s" : ""}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border">
            {isCollapsed ? (
              <>
                <span>Expand</span>
                <ChevronDown className="w-4 h-4 text-primary" />
              </>
            ) : (
              <>
                <span>Collapse</span>
                <ChevronUp className="w-4 h-4 text-primary" />
              </>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteGroup();
            }}
            className="text-destructive hover:bg-destructive/10 h-8 px-2 font-semibold"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Group
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <CardContent className="p-6 space-y-6">
        {/* Group Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-xl border border-border/50">
          <Field>
            <FieldLabel>Question Type</FieldLabel>
            <FieldContent>
              <Select
                value={group.type}
                onValueChange={(val) => { if (val) updateField("type", val as QuestionType); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Group Title</FieldLabel>
            <FieldContent>
              <Input
                value={group.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Questions 1-5"
              />
            </FieldContent>
          </Field>

          <div className="md:col-span-2">
            <Field>
              <FieldLabel>Instructions for Students</FieldLabel>
              <FieldContent>
                <Input
                  value={group.instruction}
                  onChange={(e) => updateField("instruction", e.target.value)}
                  placeholder="e.g. Choose the correct letter, A, B, C or D."
                />
              </FieldContent>
            </Field>
          </div>

          {/* Passage / Summary Text with [Q1] Tokens for Completion */}
          {isCompletionType && (
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>
                  Completion Content (Use <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-xs">[Q1]</code>, <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-xs">[Q2]</code> for blanks)
                </FieldLabel>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-semibold">Insert Blank:</span>
                  {group.questions.map((q, idx) => {
                    const qNum = q.number || startQuestionNum + idx;
                    return (
                      <Button
                        key={idx}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertTokenIntoContent(qNum)}
                        className="h-6 px-2 text-[11px] font-bold text-primary border-primary/20 hover:bg-primary/10"
                      >
                        +[Q{qNum}]
                      </Button>
                    );
                  })}
                </div>
              </div>
              <Textarea
                rows={5}
                value={group.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Enter summary or notes here. Insert [Q1], [Q2] where students will type or drag answers..."
              />
            </div>
          )}

          {/* Word Bank Manager for Drag & Drop / Matching */}
          {isWordBankType && (
            <div className="md:col-span-2 space-y-3 bg-card p-4 rounded-xl border border-border">
              <FieldLabel>
                {group.type === "drag_and_drop" ? "Word Bank Options" : "Matching Options (e.g. A. Heading 1)"}
              </FieldLabel>
              <div className="flex gap-2">
                <Input
                  value={wordBankInput}
                  onChange={(e) => setWordBankInput(e.target.value)}
                  placeholder="Type an option (e.g. A. Renewable energy or 'water')"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddWordBankOption();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddWordBankOption} className="shrink-0">
                  <Plus className="w-4 h-4 mr-1" /> Add Option
                </Button>
              </div>

              {group.options && group.options.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {group.options.map((opt, optIdx) => (
                    <Badge key={optIdx} variant="secondary" className="px-3 py-1 text-sm font-medium gap-2">
                      {opt}
                      <button
                        type="button"
                        onClick={() => handleRemoveWordBankOption(optIdx)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Questions List Inside Group */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Questions ({group.questions.length})
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddQuestion}
              className="gap-1 text-xs font-bold text-primary border-primary/20 hover:bg-primary/10"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </Button>
          </div>

          {group.questions.map((q, qIdx) => {
            const qNum = q.number || startQuestionNum + qIdx;

            return (
              <div
                key={qIdx}
                id={`q-item-${partIndex}-${groupIndex}-${qIdx}`}
                className="bg-card border border-border p-5 rounded-xl space-y-4 relative scroll-mt-24 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground font-bold">
                      Q{qNum}
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Type: {QUESTION_TYPE_LABELS[group.type]}
                    </span>
                  </div>
                  {group.questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(qIdx)}
                      className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                {/* Question Prompt */}
                <Field>
                  <FieldLabel>Question Text</FieldLabel>
                  <FieldContent>
                    <Input
                      value={q.question || ""}
                      onChange={(e) =>
                        handleUpdateQuestion(qIdx, { ...q, question: e.target.value })
                      }
                      placeholder={
                        isCompletionType
                          ? `Label for Question ${qNum} (optional if blank is in content text)`
                          : `Enter Question ${qNum} text...`
                      }
                    />
                  </FieldContent>
                </Field>

                {/* Multiple Choice Options */}
                {group.type === "multiple_choice" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    {["A", "B", "C", "D"].map((optKey, optIndex) => {
                      const currentOpts = q.options || ["", "", "", ""];
                      return (
                        <Field key={optKey}>
                          <FieldLabel>Option {optKey}</FieldLabel>
                          <FieldContent>
                            <Input
                              value={currentOpts[optIndex] || ""}
                              onChange={(e) => {
                                const newOpts = [...currentOpts];
                                newOpts[optIndex] = e.target.value;
                                handleUpdateQuestion(qIdx, { ...q, options: newOpts });
                              }}
                              placeholder={`Option ${optKey}`}
                            />
                          </FieldContent>
                        </Field>
                      );
                    })}
                  </div>
                )}

                {/* Correct Answer Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Correct Answer</FieldLabel>
                    <FieldContent>
                      {group.type === "multiple_choice" ? (
                        <Select
                          value={q.correct_answer || (q.options ? q.options[0] : "")}
                          onValueChange={(val) => { if (val) handleUpdateQuestion(qIdx, { ...q, correct_answer: val }); }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct option" />
                          </SelectTrigger>
                          <SelectContent>
                            {(q.options || ["Option A", "Option B", "Option C", "Option D"]).map((opt, i) => (
                              <SelectItem key={i} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : group.type === "tf_ng" ? (
                        <Select
                          value={q.correct_answer || "True"}
                          onValueChange={(val) => { if (val) handleUpdateQuestion(qIdx, { ...q, correct_answer: val }); }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="True">True</SelectItem>
                            <SelectItem value="False">False</SelectItem>
                            <SelectItem value="Not Given">Not Given</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : group.type === "yn_ng" ? (
                        <Select
                          value={q.correct_answer || "Yes"}
                          onValueChange={(val) => { if (val) handleUpdateQuestion(qIdx, { ...q, correct_answer: val }); }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Not Given">Not Given</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={q.correct_answer || ""}
                          onChange={(e) => handleUpdateQuestion(qIdx, { ...q, correct_answer: e.target.value })}
                          placeholder="e.g. time or Option letter A"
                        />
                      )}
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Explanation / Evidence</FieldLabel>
                    <FieldContent>
                      <Input
                        value={q.explanation || ""}
                        onChange={(e) => handleUpdateQuestion(qIdx, { ...q, explanation: e.target.value })}
                        placeholder="Explain why this answer is correct..."
                      />
                    </FieldContent>
                  </Field>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      )}
    </Card>
  );
}
