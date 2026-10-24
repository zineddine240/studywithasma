"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PenTool, Plus, Trash2, Loader2, Edit3, BookOpen, Clock, Layers, ChevronsUpDown, ExternalLink, Upload, File as FileIcon, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { TestPartItem, QuestionGroupItem, StructuredTestData } from "@/lib/types/test";
import { QuestionGroupEditor } from "./components/QuestionGroupEditor";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createManualTestAction, updateTestAction } from "./actions";

const testBasicSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["reading", "writing", "level_test", "speaking"]),
  duration_minutes: z.number().min(5, "Time limit must be at least 5 minutes"),
});

type TestBasicFormValues = z.infer<typeof testBasicSchema>;

interface ManualTestFormProps {
  initialData?: {
    id?: string;
    title: string;
    content_type: string;
    content_data: any;
  };
}

export default function ManualTestForm({ initialData }: ManualTestFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  // Extract content_data structure or initialize defaults
  const rawContent: StructuredTestData = initialData?.content_data || {};

  // Form State for Basic Info
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestBasicFormValues>({
    resolver: zodResolver(testBasicSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: (initialData?.content_type || "reading") as "reading" | "writing" | "level_test",
      duration_minutes: rawContent.duration_minutes || 60,
    },
  });

  const testType = watch("type");

  // Parts State
  const initialType = (initialData?.content_type || "reading");
  let defaultInitialParts: any[] = rawContent.parts || [];
  
  if (!defaultInitialParts) {
    if (initialType === "writing") {
      defaultInitialParts = [{
        title: "Task 1",
        prompt: rawContent.passage || "",
        instructions: rawContent.instructions || "",
        imageUrl: rawContent.imageUrl || "",
        minWords: 150,
      }];
    } else if (initialType === "speaking") {
      defaultInitialParts = [{
        title: "Speaking Part 1",
        questions: [""]
      }];
    } else {
      defaultInitialParts = [{
        title: "Part 1",
        passage: rawContent.passage || "",
        questionGroups: [
          {
            type: "multiple_choice",
            title: "Questions 1-4",
            instruction: "Choose the correct letter, A, B, C or D.",
            questions: [
              {
                number: 1,
                question: "Question 1",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct_answer: "Option A",
                explanation: "",
              },
            ],
          },
        ],
      }];
    }
  }

  const [parts, setParts] = useState<any[]>(defaultInitialParts);
  const [activePartTab, setActivePartTab] = useState<string>("part-0");
  const [groupCollapsedMap, setGroupCollapsedMap] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (partIdx: number, groupIdx: number) => {
    const key = `part-${partIdx}-group-${groupIdx}`;
    setGroupCollapsedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllGroupsInPart = (partIdx: number) => {
    const currentGroups = parts[partIdx]?.questionGroups || [];
    const keys = currentGroups.map((_: any, gIdx: number) => `part-${partIdx}-group-${gIdx}`);
    const areAllCollapsed = keys.every((k: string) => groupCollapsedMap[k]);
    const newMap = { ...groupCollapsedMap };
    keys.forEach((k: string) => {
      newMap[k] = !areAllCollapsed;
    });
    setGroupCollapsedMap(newMap);
  };

  const [imageFiles, setImageFiles] = useState<Record<number, File>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  // Part Management Handlers
  const handleAddPart = () => {
    const nextPartNum = parts.length + 1;
    const newPartIdx = parts.length;
    let newPart: any;
    
    if (testType === "writing") {
      newPart = {
        title: `Task ${nextPartNum}`,
        prompt: "",
        instructions: "",
        imageUrl: "",
        minWords: 150,
      };
    } else if (testType === "speaking") {
      newPart = {
        title: `Speaking Part ${nextPartNum}`,
        questions: [""]
      };
    } else {
      newPart = {
        title: `Part ${nextPartNum}`,
        passage: "",
        questionGroups: [
          {
            type: "multiple_choice",
            title: `Questions`,
            instruction: "Choose the correct answer.",
            questions: [
              {
                number: 1,
                question: "Sample Question",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct_answer: "Option A",
                explanation: "",
              },
            ],
          },
        ],
      };
    }
    const newParts = [...parts, newPart];
    setParts(newParts);
    setActivePartTab(`part-${newPartIdx}`);

    setTimeout(() => {
      const el = document.getElementById(`part-card-${newPartIdx}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  const handleDeletePart = (partIdx: number) => {
    if (parts.length <= 1) {
      toast.error("A test must have at least 1 part.");
      return;
    }
    const updated = parts.filter((_, i) => i !== partIdx);
    setParts(updated);
    setActivePartTab(`part-${Math.max(0, partIdx - 1)}`);
  };

  const handleUpdatePart = (partIdx: number, updatedPart: any) => {
    const newParts = [...parts];
    newParts[partIdx] = updatedPart;
    setParts(newParts);
  };

  // Group Handlers for a given part
  const handleAddGroupToPart = (partIdx: number) => {
    const currentPart = parts[partIdx];
    const newGroupIdx = currentPart.questionGroups.length;
    const newGroup: QuestionGroupItem = {
      type: "multiple_choice",
      title: `Questions`,
      instruction: "Select the best answer.",
      questions: [
        {
          number: 1,
          question: "New Question",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct_answer: "Option A",
          explanation: "",
        },
      ],
    };

    handleUpdatePart(partIdx, {
      ...currentPart,
      questionGroups: [...currentPart.questionGroups, newGroup],
    });

    const key = `part-${partIdx}-group-${newGroupIdx}`;
    setGroupCollapsedMap((prev) => ({ ...prev, [key]: false }));

    setTimeout(() => {
      const el = document.getElementById(`group-card-${partIdx}-${newGroupIdx}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  const handleUpdateGroupInPart = (partIdx: number, groupIdx: number, updatedGroup: QuestionGroupItem) => {
    const currentPart = parts[partIdx];
    const newGroups = [...currentPart.questionGroups];
    newGroups[groupIdx] = updatedGroup;
    handleUpdatePart(partIdx, { ...currentPart, questionGroups: newGroups });
  };

  const handleDeleteGroupInPart = (partIdx: number, groupIdx: number) => {
    const currentPart = parts[partIdx];
    if (currentPart.questionGroups.length <= 1) {
      toast.error("Each part must have at least 1 question group.");
      return;
    }
    const newGroups = currentPart.questionGroups.filter((_: any, i: number) => i !== groupIdx);
    handleUpdatePart(partIdx, { ...currentPart, questionGroups: newGroups });
  };

  // Submit Handler
  const onSubmit = async (data: TestBasicFormValues) => {
    let content_data: any = {};

    if (data.type === "writing") {
      setUploadingImage(true);
      const supabase = createClient();
      
      const finalParts = await Promise.all(parts.map(async (part, idx) => {
        let finalImageUrl = part.imageUrl;
        const file = imageFiles[idx];
        
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('test_attachments')
            .upload(filePath, file);

          if (uploadError) {
            toast.error(`Failed to upload image for ${part.title}`);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('test_attachments')
              .getPublicUrl(filePath);
            finalImageUrl = publicUrl;
          }
        }
        
        return {
          title: part.title || `Task ${idx + 1}`,
          prompt: part.prompt || "",
          instructions: part.instructions || "",
          imageUrl: finalImageUrl || "",
          minWords: part.minWords || 150,
        };
      }));
      setUploadingImage(false);

      content_data = {
        duration_minutes: data.duration_minutes,
        parts: finalParts,
        passage: finalParts[0]?.prompt || "",
        imageUrl: finalParts[0]?.imageUrl || "",
        instructions: finalParts[0]?.instructions || "",
      };
    } else if (data.type === "speaking") {
      content_data = {
        duration_minutes: data.duration_minutes,
        parts: parts.map(part => ({
          title: part.title,
          questions: part.questions || []
        }))
      };
    } else {
      // Re-number questions sequentially across parts for clean student numbering
      let globalQNum = 1;
      const renumberedParts = parts.map((part) => ({
        ...part,
        questionGroups: part.questionGroups?.map((group: any) => ({
          ...group,
          questions: group.questions?.map((q: any) => {
            const num = globalQNum++;
            return {
              ...q,
              number: num,
              id: q.id || `q-${num}`,
            };
          }),
        })),
      }));

      content_data = {
        duration_minutes: data.duration_minutes,
        parts: renumberedParts,
      };
    }

    const payload = {
      title: data.title,
      type: data.type,
      content_data,
    };

    try {
      if (initialData?.id) {
        const result = await updateTestAction(initialData.id, payload);
        if (result?.error) {
          toast.error(result.error);
        } else if (result?.success) {
          toast.success("Test updated successfully!");
          router.push(`/admin/tests/${initialData.id}`);
        }
      } else {
        const result = await createManualTestAction(payload);
        if (result?.error) {
          toast.error(result.error);
        } else if (result?.success) {
          toast.success("Test created successfully!");
          router.push("/admin/tests");
        }
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="mt-6 space-y-8">
      {/* Header Banner */}
      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            {isEditing ? <Edit3 className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
          </div>
          <div>
            <CardTitle className="text-xl font-extrabold text-foreground">
              {isEditing ? "Edit Test Configuration" : "Create Test Configuration"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure multi-part test sections, passages, and rich question types (QCM, Fill Blanks, Drag & Drop, Matching).
            </p>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {/* Basic Configuration */}
        <Card className="border-border shadow-sm">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              General Settings & Duration
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field>
              <FieldLabel htmlFor="type">Test Module</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reading">IELTS Reading (Multi-Part)</SelectItem>
                        <SelectItem value="writing">IELTS Writing Practice</SelectItem>
                        <SelectItem value="level_test">General English Level Test</SelectItem>
                        <SelectItem value="speaking">IELTS Speaking</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FieldContent>
              <FieldError errors={[errors.type]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="title">Test Title</FieldLabel>
              <FieldContent>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g. Cambridge IELTS Reading Test 1"
                  {...register("title")}
                />
              </FieldContent>
              <FieldError errors={[errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="duration_minutes">Duration (Minutes)</FieldLabel>
              <FieldContent>
                <Input
                  id="duration_minutes"
                  type="number"
                  placeholder="e.g. 60"
                  {...register("duration_minutes", { valueAsNumber: true })}
                />
              </FieldContent>
              <FieldError errors={[errors.duration_minutes]} />
            </Field>
          </CardContent>
        </Card>

        {/* Writing Test Prompt View */}
               <div className="space-y-6">
            <Tabs value={activePartTab} onValueChange={setActivePartTab} className="w-full">
              {/* Sticky Part Tabs Bar & Action Button */}
              <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md pt-2 pb-4 px-4 -mx-4 border-b border-border mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Parts:</span>
                    <TabsList className="h-11 flex overflow-x-auto justify-start border border-border bg-muted/40 p-1 rounded-xl">
                      {parts.map((part, pIdx) => {
                        const displayTitle = part.title
                          ? part.title.replace(/^Passage\s+/i, "Part ")
                          : `Part ${pIdx + 1}`;
                        return (
                          <TabsTrigger
                            key={pIdx}
                            value={`part-${pIdx}`}
                            className="px-5 py-2 font-bold text-sm flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg cursor-pointer"
                          >
                            <Layers className="w-4 h-4 text-primary" />
                            {displayTitle}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddPart}
                    className="font-bold flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add Part ({parts.length})
                  </Button>
                </div>
              </div>

              {parts.map((part, pIdx) => {
                const displayTitle = part.title
                  ? part.title.replace(/^Passage\s+/i, "Part ")
                  : `Part ${pIdx + 1}`;

                let startQNumForPart = 1;
                for (let i = 0; i < pIdx; i++) {
                  parts[i].questionGroups?.forEach((g: any) => {
                    startQNumForPart += (g.questions?.length || 0);
                  });
                }

                let cumulativeQNum = startQNumForPart;

                return (
                  <TabsContent key={pIdx} value={`part-${pIdx}`} id={`part-card-${pIdx}`} className="space-y-6 scroll-mt-24">
                    <Card className="border-border shadow-sm">
                      <CardHeader className="bg-muted/30 pb-4 border-b border-border flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-bold text-foreground">
                          {displayTitle} Settings
                        </CardTitle>
                        {parts.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePart(pIdx)}
                            className="text-destructive hover:bg-destructive/10 h-8 px-2"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete {testType === "writing" ? "Task" : "Part"}
                          </Button>
                        )}
                      </CardHeader>

                      <CardContent className="p-6 space-y-6">
                        <Field>
                          <FieldLabel>{testType === "writing" ? "Task Title" : "Part Title"}</FieldLabel>
                          <FieldContent>
                            <Input
                              value={part.title || ""}
                              onChange={(e) =>
                                handleUpdatePart(pIdx, { ...part, title: e.target.value })
                              }
                              placeholder={testType === "writing" ? "e.g. Task 1" : "e.g. Part 1: Environmental Science"}
                            />
                          </FieldContent>
                        </Field>

                        {testType === "writing" ? (
                          <>
                            <Field>
                              <FieldLabel>Instructions (Optional)</FieldLabel>
                              <FieldContent>
                                <Textarea
                                  rows={2}
                                  value={part.instructions || ""}
                                  onChange={(e) =>
                                    handleUpdatePart(pIdx, { ...part, instructions: e.target.value })
                                  }
                                  placeholder="e.g. You should spend about 20 minutes on this task. Write at least 150 words."
                                />
                              </FieldContent>
                            </Field>

                            <Field>
                              <FieldLabel>Task Image (Optional)</FieldLabel>
                              <FieldContent>
                                {!(part.imageUrl) && !imageFiles[pIdx] ? (
                                  <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed px-6 py-8 border-border hover:bg-muted/30">
                                    <div className="text-center">
                                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                      <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                                        <label className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80">
                                          <span>Upload an image</span>
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            className="sr-only" 
                                            onChange={(e) => {
                                              if (e.target.files && e.target.files.length > 0) {
                                                setImageFiles(prev => ({...prev, [pIdx]: e.target.files![0]}));
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-2 flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                                    <FileIcon className="w-5 h-5 text-primary shrink-0" />
                                    <div className="truncate text-sm font-medium text-foreground flex-1">
                                      {imageFiles[pIdx] ? imageFiles[pIdx].name : (part.imageUrl ? "Uploaded Image" : "")}
                                    </div>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const newFiles = {...imageFiles};
                                        delete newFiles[pIdx];
                                        setImageFiles(newFiles);
                                        handleUpdatePart(pIdx, { ...part, imageUrl: "" });
                                      }}
                                      className="ml-2 text-destructive hover:underline text-xs flex items-center gap-1"
                                    >
                                      <X className="w-3 h-3" /> Remove
                                    </button>
                                  </div>
                                )}
                              </FieldContent>
                            </Field>

                            <Field>
                              <FieldLabel>Essay Topic or Task Prompt</FieldLabel>
                              <FieldContent>
                                <Textarea
                                  rows={8}
                                  value={part.prompt || ""}
                                  onChange={(e) =>
                                    handleUpdatePart(pIdx, { ...part, prompt: e.target.value })
                                  }
                                  placeholder="Enter the full essay prompt or task instructions here..."
                                />
                              </FieldContent>
                            </Field>

                            <Field>
                              <FieldLabel>Minimum Word Count</FieldLabel>
                              <FieldContent>
                                <Input
                                  type="number"
                                  value={part.minWords || 150}
                                  onChange={(e) =>
                                    handleUpdatePart(pIdx, { ...part, minWords: parseInt(e.target.value) || 0 })
                                  }
                                  placeholder="e.g. 150"
                                />
                              </FieldContent>
                            </Field>
                          </>
                        ) : testType === "speaking" ? (
                          <div className="space-y-4 mt-2">
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <h3 className="font-bold text-foreground">Questions</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newParts = [...parts];
                                  newParts[pIdx].questions = [...(newParts[pIdx].questions || []), ""];
                                  setParts(newParts);
                                }}
                                className="h-8 text-xs font-bold gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Question
                              </Button>
                            </div>
                            {(part.questions || []).map((q: string, qIdx: number) => (
                              <div key={qIdx} className="flex gap-3 items-start">
                                <span className="font-bold text-muted-foreground w-6 pt-2">{qIdx + 1}.</span>
                                <Textarea 
                                  value={q}
                                  onChange={(e) => {
                                    const newParts = [...parts];
                                    newParts[pIdx].questions[qIdx] = e.target.value;
                                    setParts(newParts);
                                  }}
                                  placeholder="Enter question text (support multiline for cue cards)..."
                                  className="flex-1 min-h-[120px] resize-y"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newParts = [...parts];
                                    newParts[pIdx].questions.splice(qIdx, 1);
                                    setParts(newParts);
                                  }}
                                  className="text-destructive hover:bg-destructive/10 px-2 h-10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Field>
                            <FieldLabel>Part Content / Passage</FieldLabel>
                            <FieldContent>
                              <Textarea
                                rows={10}
                                value={part.passage || ""}
                                onChange={(e) =>
                                  handleUpdatePart(pIdx, { ...part, passage: e.target.value })
                                }
                                placeholder="Enter part text or passage content here..."
                              />
                            </FieldContent>
                          </Field>
                        )}
                      </CardContent>
                    </Card>

                    {/* Question Groups inside Part (Only for Reading/Level Test) */}
                    {testType !== "writing" && testType !== "speaking" && (
                      <div className="space-y-6">
                        <div className="sticky top-[56px] z-30 bg-background/95 backdrop-blur-md border-b border-border py-3 px-4 -mx-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                              <Layers className="w-4 h-4 text-primary" />
                              Question Groups in {part.title || `Part ${pIdx + 1}`} ({(part.questionGroups || []).length})
                            </h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAllGroupsInPart(pIdx)}
                              className="h-8 text-xs font-bold gap-1.5"
                            >
                              <ChevronsUpDown className="w-3.5 h-3.5" />
                              {(part.questionGroups || []).every((_: any, gIdx: number) => groupCollapsedMap[`part-${pIdx}-group-${gIdx}`])
                                ? "Expand All"
                                : "Collapse All"}
                            </Button>
                          </div>

                          <Button
                            type="button"
                            onClick={() => handleAddGroupToPart(pIdx)}
                            className="h-9 px-4 font-bold text-xs gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Question Group
                          </Button>
                        </div>

                        {(part.questionGroups || []).map((group: any, gIdx: number) => {
                          const groupStartNum = cumulativeQNum;
                          cumulativeQNum += group.questions.length;
                          const groupKey = `part-${pIdx}-group-${gIdx}`;

                          return (
                            <QuestionGroupEditor
                              key={gIdx}
                              group={group}
                              groupIndex={gIdx}
                              partIndex={pIdx}
                              startQuestionNum={groupStartNum}
                              isCollapsed={Boolean(groupCollapsedMap[groupKey])}
                              onToggleCollapse={() => toggleGroupCollapse(pIdx, gIdx)}
                              onUpdateGroup={(updatedGroup) =>
                                handleUpdateGroupInPart(pIdx, gIdx, updatedGroup)
                              }
                              onDeleteGroup={() => handleDeleteGroupInPart(pIdx, gIdx)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>

        {/* Submit Action */}
        <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-md py-4 border-t border-border -mx-4 px-4 mt-8 flex justify-end gap-3">
          {isEditing && initialData?.id && (
            <Link
              href={`/admin/tests/${initialData.id}/preview`}
              className="h-10 px-6 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted transition-colors shadow-sm text-foreground"
            >
              <ExternalLink className="w-4 h-4" />
              Preview as Student
            </Link>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImage}
            className="h-10 px-8 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            {isSubmitting || uploadingImage ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                {uploadingImage ? "Uploading Image..." : "Saving Test Configuration..."}
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Save Test Configuration"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
