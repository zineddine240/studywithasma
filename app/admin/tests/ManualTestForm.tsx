"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { PenTool, Plus, Trash2, Loader2, Edit3 } from "lucide-react";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createManualTestAction, updateTestAction } from "./actions";

// Schema for a single question
const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  optionD: z.string().min(1, "Option D is required"),
  correctOption: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(1, "Explanation is required"),
});

// Schema for the manual test form
const manualTestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["reading", "writing", "level_test"]),
  passage: z.string().min(10, "Passage must be at least 10 characters"),
  questions: z.array(questionSchema).optional(),
});

type ManualTestFormValues = z.infer<typeof manualTestSchema>;

interface ManualTestFormProps {
  initialData?: {
    id: string;
    title: string;
    content_type: string;
    content_data: any;
  };
}

function getInitialFormValues(initialData?: any): ManualTestFormValues {
  if (!initialData) {
    return {
      type: "reading",
      title: "",
      passage: "",
      questions: [
        { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A", explanation: "" },
      ],
    };
  }

  const content = initialData.content_data || {};
  const type = (initialData.content_type || "reading") as "reading" | "writing" | "level_test";
  const passage = content.passage || "";
  const rawQuestions = content.questions || [];

  const questions = rawQuestions.map((q: any) => {
    const opts = q.options || ["", "", "", ""];
    const optA = opts[0] || "";
    const optB = opts[1] || "";
    const optC = opts[2] || "";
    const optD = opts[3] || "";

    let correctOption: "A" | "B" | "C" | "D" = "A";
    if (q.correct_answer) {
      if (q.correct_answer === optB || q.correct_answer === "B") correctOption = "B";
      else if (q.correct_answer === optC || q.correct_answer === "C") correctOption = "C";
      else if (q.correct_answer === optD || q.correct_answer === "D") correctOption = "D";
    }

    return {
      question: q.question || "",
      optionA: optA,
      optionB: optB,
      optionC: optC,
      optionD: optD,
      correctOption,
      explanation: q.explanation || "",
    };
  });

  return {
    title: initialData.title || "",
    type,
    passage,
    questions:
      questions.length > 0
        ? questions
        : [{ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A" as const, explanation: "" }],
  };
}

export default function ManualTestForm({ initialData }: ManualTestFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManualTestFormValues>({
    resolver: zodResolver(manualTestSchema),
    defaultValues: getInitialFormValues(initialData),
  });

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  });

  const testType = watch("type");
  const showQuestions = testType === "reading" || testType === "level_test";

  const onSubmit = async (data: ManualTestFormValues) => {
    const content_data: any = {
      title: data.title,
      passage: data.passage,
    };

    if (showQuestions && data.questions) {
      content_data.questions = data.questions.map((q) => {
        const options = [q.optionA, q.optionB, q.optionC, q.optionD];
        let correct_answer = q.optionA;
        if (q.correctOption === "B") correct_answer = q.optionB;
        if (q.correctOption === "C") correct_answer = q.optionC;
        if (q.correctOption === "D") correct_answer = q.optionD;

        return {
          question: q.question,
          options,
          correct_answer,
          explanation: q.explanation,
        };
      });
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
          toast.success("Manual test created successfully!");
          reset();
          router.push("/admin/tests");
        }
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="mt-6 bg-card shadow-sm border border-border rounded-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-muted/30 text-primary rounded-lg">
          {isEditing ? <Edit3 className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isEditing ? "Edit Test Details" : "Create Manual Test"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Modify test title, passage/prompt, and practice questions."
              : "Draft tests and questions manually."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/40 p-6 rounded-xl border border-border/50">
          <Field>
            <FieldLabel htmlFor="type">Test Type</FieldLabel>
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
                      <SelectItem value="reading">IELTS Reading</SelectItem>
                      <SelectItem value="writing">IELTS Writing</SelectItem>
                      <SelectItem value="level_test">General English Level Test</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
            <FieldError errors={[errors.type]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Reading Practice: Science & Tech"
                {...register("title")}
              />
            </FieldContent>
            <FieldError errors={[errors.title]} />
          </Field>

          <div className="md:col-span-2">
            <Field>
              <FieldLabel htmlFor="passage">
                {testType === "writing" ? "Writing Prompt" : "Reading Passage"}
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="passage"
                  rows={6}
                  placeholder={`Enter the full ${testType === "writing" ? "prompt" : "passage text"} here...`}
                  {...register("passage")}
                />
              </FieldContent>
              <FieldError errors={[errors.passage]} />
            </Field>
          </div>
        </div>

        {/* Dynamic Questions (Only for Reading & Level Test) */}
        {showQuestions && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-lg font-bold text-foreground">Questions</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  append({
                    question: "",
                    optionA: "",
                    optionB: "",
                    optionC: "",
                    optionD: "",
                    correctOption: "A",
                    explanation: "",
                  })
                }
                className="gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 hover:bg-primary/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="relative bg-card border border-border p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-foreground bg-muted/30 px-3 py-1 rounded-md text-sm">
                    Question {index + 1}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:bg-destructive/10 p-1.5 h-8 w-8 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Field>
                  <FieldLabel>Question Text</FieldLabel>
                  <FieldContent>
                    <Input {...register(`questions.${index}.question` as const)} placeholder="Enter the question..." />
                  </FieldContent>
                  <FieldError errors={[errors.questions?.[index]?.question]} />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg">
                  <Field>
                    <FieldLabel>Option A</FieldLabel>
                    <FieldContent>
                      <Input {...register(`questions.${index}.optionA` as const)} placeholder="First option" />
                    </FieldContent>
                    <FieldError errors={[errors.questions?.[index]?.optionA]} />
                  </Field>
                  <Field>
                    <FieldLabel>Option B</FieldLabel>
                    <FieldContent>
                      <Input {...register(`questions.${index}.optionB` as const)} placeholder="Second option" />
                    </FieldContent>
                    <FieldError errors={[errors.questions?.[index]?.optionB]} />
                  </Field>
                  <Field>
                    <FieldLabel>Option C</FieldLabel>
                    <FieldContent>
                      <Input {...register(`questions.${index}.optionC` as const)} placeholder="Third option" />
                    </FieldContent>
                    <FieldError errors={[errors.questions?.[index]?.optionC]} />
                  </Field>
                  <Field>
                    <FieldLabel>Option D</FieldLabel>
                    <FieldContent>
                      <Input {...register(`questions.${index}.optionD` as const)} placeholder="Fourth option" />
                    </FieldContent>
                    <FieldError errors={[errors.questions?.[index]?.optionD]} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Correct Answer</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={control}
                        name={`questions.${index}.correctOption` as const}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select correct option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Option A</SelectItem>
                              <SelectItem value="B">Option B</SelectItem>
                              <SelectItem value="C">Option C</SelectItem>
                              <SelectItem value="D">Option D</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Explanation</FieldLabel>
                    <FieldContent>
                      <Input {...register(`questions.${index}.explanation` as const)} placeholder="Why is this answer correct?" />
                    </FieldContent>
                    <FieldError errors={[errors.questions?.[index]?.explanation]} />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              {isEditing ? "Saving Changes..." : "Saving..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Save Manual Test"
          )}
        </Button>
      </form>
    </div>
  );
}
