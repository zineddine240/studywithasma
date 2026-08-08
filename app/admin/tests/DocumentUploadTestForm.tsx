"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Upload, FileText, File, Sparkles, Loader2, CheckCircle2, ArrowRight, Save, Edit3 } from "lucide-react";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { generateTestFromDocumentAction, createManualTestAction } from "./actions";
import ManualTestForm from "./ManualTestForm";

const uploadSchema = z.object({
  type: z.enum(["reading", "writing", "level_test"]),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

interface DocumentUploadTestFormProps {
  onPayloadGenerated?: (payload: any, type: string) => void;
}

export default function DocumentUploadTestForm({ onPayloadGenerated }: DocumentUploadTestFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<any | null>(null);
  const [detectedType, setDetectedType] = useState<string>("reading");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      type: "reading",
    },
  });

  const selectedType = watch("type");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setGeneratedPayload(null);
    }
  };

  const processDocument = async (autoSave: boolean) => {
    if (!selectedFile) {
      toast.error("Please select a PDF, image, or document file to upload.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Analyzing document with Gemini AI...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", selectedType);

      const res = await generateTestFromDocumentAction(formData);

      if (res.error || !res.payload) {
        toast.error(res.error || "Failed to parse document.", { id: toastId });
        setIsProcessing(false);
        return;
      }

      toast.success("Document analyzed successfully!", { id: toastId });
      setDetectedType(selectedType);

      if (autoSave) {
        // Direct save to Supabase
        toast.loading("Saving test to database...", { id: toastId });
        const saveRes = await createManualTestAction({
          title: res.payload.title || selectedFile.name.replace(/\.[^/.]+$/, ""),
          type: selectedType,
          content_data: res.payload,
        });

        if (saveRes.error) {
          toast.error(saveRes.error, { id: toastId });
        } else {
          toast.success("Test created and saved to database!", { id: toastId });
          setGeneratedPayload(null);
          setSelectedFile(null);
        }
      } else {
        // Load into manual editor
        setGeneratedPayload(res.payload);
        if (onPayloadGenerated) {
          onPayloadGenerated(res.payload, selectedType);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  // If payload is generated and no parent handler was provided
  if (generatedPayload && !onPayloadGenerated) {
    const manualInitialData = {
      title: generatedPayload.title || selectedFile?.name.replace(/\.[^/.]+$/, "") || "Uploaded Document Test",
      content_type: detectedType,
      content_data: generatedPayload,
    };

    return (
      <div className="space-y-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">AI Payload Generated</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                You can now review, edit question groups, or add/remove parts before saving.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGeneratedPayload(null)}
            className="text-xs font-bold gap-1.5"
          >
            Upload Another Document
          </Button>
        </div>

        <ManualTestForm initialData={manualInitialData} />
      </div>
    );
  }

  return (
    <div className="bg-card shadow-sm border border-border rounded-xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Upload Document or PDF</h2>
          <p className="text-sm text-muted-foreground">
            Upload exam papers, PDF passages, or images. AI will analyze the layout and structure a complete test payload.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="type">Target Test Type</FieldLabel>
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

        <div className="flex flex-col justify-end">
          <p className="text-xs text-muted-foreground mb-2">Supported formats:</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-bold px-2 py-1 bg-muted rounded-md text-foreground">PDF (.pdf)</span>
            <span className="text-[11px] font-bold px-2 py-1 bg-muted rounded-md text-foreground">Images (.png, .jpg, .webp)</span>
            <span className="text-[11px] font-bold px-2 py-1 bg-muted rounded-md text-foreground">Word (.docx)</span>
            <span className="text-[11px] font-bold px-2 py-1 bg-muted rounded-md text-foreground">Text (.txt)</span>
          </div>
        </div>
      </div>

      {/* Dropzone Container */}
      <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-8 text-center bg-muted/10">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <span className="text-xs text-primary font-semibold hover:underline">
              Click or drag to change file
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-muted/60 text-muted-foreground rounded-2xl flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">
                Click to upload or drag & drop exam document
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDFs, Scanned Test Sheets, Word files up to 20MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          disabled={!selectedFile || isProcessing}
          onClick={() => processDocument(false)}
          variant="outline"
          className="h-11 px-6 font-bold text-sm gap-2"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Edit3 className="w-4 h-4 text-primary" />
          )}
          Analyze & Edit in Form
        </Button>

        <Button
          type="button"
          disabled={!selectedFile || isProcessing}
          onClick={() => processDocument(true)}
          className="h-11 px-6 font-bold text-sm gap-2"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Analyze & Save Directly
        </Button>
      </div>
    </div>
  );
}
