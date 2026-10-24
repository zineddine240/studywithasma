"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Plus, Trash2, Loader2, Edit3, Upload, File as FileIcon, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateTestAction } from "./actions";

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  optionD: z.string().min(1, "Option D is required"),
  correctOption: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(1, "Explanation is required"),
});

const editTestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["reading", "writing", "level_test"]),
  passage: z.string().min(10, "Passage must be at least 10 characters"),
  questions: z.array(questionSchema).optional(),
});

type EditTestFormValues = z.infer<typeof editTestSchema>;

interface EditTestModalProps {
  test: {
    id: string;
    title: string;
    content_type: string;
    content_data?: any;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTestModal({ test, open, onOpenChange }: EditTestModalProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTestFormValues>({
    resolver: zodResolver(editTestSchema),
    defaultValues: {
      title: "",
      type: "reading",
      passage: "",
      questions: [],
    },
  });

  const [writingInstructions, setWritingInstructions] = useState("");
  const [writingMinWords, setWritingMinWords] = useState(150);
  const [writingImageUrl, setWritingImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
      } else {
        toast.error("Please drop an image file.");
      }
    }
  };

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  });

  const testType = watch("type");
  const showQuestions = testType === "reading" || testType === "level_test";

  useEffect(() => {
    if (test && open) {
      const content = test.content_data || {};
      const type = (test.content_type || "reading") as "reading" | "writing" | "level_test";
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

      reset({
        title: test.title || "",
        type,
        passage,
        questions: questions.length > 0 ? questions : [
          { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A" as const, explanation: "" }
        ],
      });
      setWritingInstructions(content.instructions || "");
      setWritingImageUrl(content.imageUrl || "");
      setWritingMinWords(content.minWords || 150);
      setImageFile(null);
    }
  }, [test, open, reset]);

  const onSubmit = async (data: EditTestFormValues) => {
    if (!test) return;

    const content_data: any = {
      title: data.title,
      passage: data.passage,
    };

    if (data.type === "writing") {
      content_data.instructions = writingInstructions;
      content_data.minWords = writingMinWords;
      let finalImageUrl = writingImageUrl;

      if (imageFile) {
        setUploadingImage(true);
        const supabase = createClient();
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('test_attachments')
          .upload(filePath, imageFile);

        if (uploadError) {
          setUploadingImage(false);
          toast.error(uploadError.message || "Failed to upload image.");
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('test_attachments')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
        setUploadingImage(false);
      }
      content_data.imageUrl = finalImageUrl;
    }

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
      const result = await updateTestAction(test.id, payload);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success("Test updated successfully!");
        onOpenChange(false);
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            Edit Test Details
          </DialogTitle>
          <DialogDescription>
            Modify test title, passage/prompt, and practice questions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4" noValidate>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-xl border border-border/50">
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

            {testType === "writing" && (
              <div className="md:col-span-2 space-y-6">
                <Field>
                  <FieldLabel htmlFor="writingInstructions">Instructions (Optional)</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="writingInstructions"
                      rows={2}
                      value={writingInstructions}
                      onChange={(e) => setWritingInstructions(e.target.value)}
                      placeholder="e.g. You should spend about 20 minutes on this task. Write at least 150 words."
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="writingMinWords">Minimum Word Count</FieldLabel>
                  <FieldContent>
                    <Input
                      id="writingMinWords"
                      type="number"
                      value={writingMinWords}
                      onChange={(e) => setWritingMinWords(parseInt(e.target.value) || 0)}
                      placeholder="e.g. 150"
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Task Image (Optional)</FieldLabel>
                  <FieldContent>
                    {!writingImageUrl && !imageFile ? (
                      <div 
                        className={`mt-2 flex justify-center rounded-lg border-2 border-dashed px-6 py-6 transition-colors ${
                          dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="text-center pointer-events-none">
                          <Upload className={`mx-auto h-6 w-6 ${dragActive ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                          <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                            <label
                              htmlFor="edit-image-upload"
                              className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:ring-2 focus-within:ring-primary hover:text-primary/80 pointer-events-auto"
                            >
                              <span>Upload an image</span>
                              <input 
                                id="edit-image-upload" 
                                name="edit-image-upload" 
                                type="file" 
                                accept="image/*"
                                className="sr-only" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setImageFile(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                        <FileIcon className="w-5 h-5 text-primary shrink-0" />
                        <div className="truncate text-sm font-medium text-foreground flex-1">
                          {imageFile ? imageFile.name : (writingImageUrl ? "Uploaded Image" : "")}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setWritingImageUrl("");
                          }}
                          className="ml-2 text-destructive hover:underline text-xs flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    )}
                  </FieldContent>
                </Field>
              </div>
            )}
          </div>

          {/* Questions */}
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
                <div key={field.id} className="relative bg-card border border-border p-5 rounded-xl space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-foreground bg-muted/50 px-3 py-1 rounded-md text-xs">
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
                      <Input
                        {...register(`questions.${index}.question` as const)}
                        placeholder="Enter question text..."
                      />
                    </FieldContent>
                    <FieldError errors={[errors.questions?.[index]?.question]} />
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg">
                    <Field>
                      <FieldLabel>Option A</FieldLabel>
                      <FieldContent>
                        <Input {...register(`questions.${index}.optionA` as const)} placeholder="Option A" />
                      </FieldContent>
                      <FieldError errors={[errors.questions?.[index]?.optionA]} />
                    </Field>
                    <Field>
                      <FieldLabel>Option B</FieldLabel>
                      <FieldContent>
                        <Input {...register(`questions.${index}.optionB` as const)} placeholder="Option B" />
                      </FieldContent>
                      <FieldError errors={[errors.questions?.[index]?.optionB]} />
                    </Field>
                    <Field>
                      <FieldLabel>Option C</FieldLabel>
                      <FieldContent>
                        <Input {...register(`questions.${index}.optionC` as const)} placeholder="Option C" />
                      </FieldContent>
                      <FieldError errors={[errors.questions?.[index]?.optionC]} />
                    </Field>
                    <Field>
                      <FieldLabel>Option D</FieldLabel>
                      <FieldContent>
                        <Input {...register(`questions.${index}.optionD` as const)} placeholder="Option D" />
                      </FieldContent>
                      <FieldError errors={[errors.questions?.[index]?.optionD]} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Correct Option</FieldLabel>
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
                        <Input
                          {...register(`questions.${index}.explanation` as const)}
                          placeholder="Why is this answer correct?"
                        />
                      </FieldContent>
                      <FieldError errors={[errors.questions?.[index]?.explanation]} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="font-bold flex items-center gap-2"
            >
              {isSubmitting || uploadingImage ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  {uploadingImage ? "Uploading Image..." : "Saving Changes..."}
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
