"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Upload, FileText, Sparkles, Loader2, Save } from "lucide-react";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { enqueueTestGeneration } from "./queue-actions";

const uploadSchema = z.object({
  type: z.enum(["reading", "writing", "level_test"]),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function DocumentUploadTestForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const processDocument = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select a PDF, image, or document file to upload.");
      return;
    }

    setIsProcessing(true);

    let successCount = 0;
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const toastId = toast.loading(`Adding ${file.name} to generation queue...`);
      
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", selectedType);
        
        const res = await enqueueTestGeneration(formData);
        
        if (res.error) {
          toast.error(res.error, { id: toastId });
        } else {
          toast.success(`${file.name} added to queue!`, { id: toastId });
          successCount++;
        }
      } catch (err: any) {
        toast.error(err.message || `An unexpected error occurred queueing ${file.name}.`, { id: toastId });
      }
    }
    
    if (successCount > 0) {
      toast.success(`Successfully queued ${successCount} document(s) for background AI generation.`);
    }
    
    if (successCount === selectedFiles.length) {
      setSelectedFiles([]);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="bg-card shadow-sm border border-border rounded-xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Bulk Upload Documents</h2>
          <p className="text-sm text-muted-foreground">
            Upload exam papers, PDF passages, or images. AI will generate tests in the background.
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
                    <SelectItem value="speaking">IELTS Speaking</SelectItem>
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
            <span className="text-[11px] font-bold px-2 py-1 bg-muted rounded-md text-foreground">Images (.png, .jpg)</span>
            <span className="text-[11px] font-bold px-2 py-1 bg-muted rounded-md text-foreground">Word (.docx)</span>
            <span className="text-[11px] font-bold px-2 py-1 bg-muted rounded-md text-foreground">Text (.txt)</span>
          </div>
        </div>
      </div>

      {/* Dropzone Container */}
      <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-8 text-center bg-muted/10">
        <input
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {selectedFiles.length > 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">
                {selectedFiles.length === 1 
                  ? selectedFiles[0].name 
                  : `${selectedFiles.length} files selected`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(selectedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB total
              </p>
            </div>
            <span className="text-xs text-primary font-semibold hover:underline">
              Click or drag to change files
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-muted/60 text-muted-foreground rounded-2xl flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">
                Click to upload or drag & drop exam documents
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Select multiple files to generate tests in bulk
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          disabled={selectedFiles.length === 0 || isProcessing}
          onClick={() => processDocument()}
          className="h-11 px-6 font-bold text-sm gap-2"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Start Bulk Generation {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
        </Button>
      </div>
    </div>
  );
}
