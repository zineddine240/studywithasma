'use client'

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"
import { Sparkles, Loader2, Zap, Brain, BarChart3 } from "lucide-react"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { generateTestAction } from "./actions"

const generateSchema = z.object({
  type: z.enum(["reading", "writing", "level_test"]),
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "IELTS Academic", "IELTS General"]),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

export default function GenerateTestForm() {

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      type: "reading",
      topic: "",
      difficulty: "IELTS Academic",
    },
  });

  const onSubmit = async (data: GenerateFormValues) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("topic", data.topic);
    formData.append("difficulty", data.difficulty);

    try {
      const result = await generateTestAction(formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success("Test generated successfully! It has been saved to the database.");
        reset();
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left Column: Form */}
      <div className="lg:col-span-3">
        <div className="bg-card shadow-sm border border-border rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Generate AI Test</h2>
              <p className="text-sm text-muted-foreground">Powered by Google Gemini 2.5 Flash</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FieldLabel htmlFor="difficulty">Difficulty</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="difficulty"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner (A1-A2)</SelectItem>
                          <SelectItem value="Intermediate">Intermediate (B1-B2)</SelectItem>
                          <SelectItem value="Advanced">Advanced (C1-C2)</SelectItem>
                          <SelectItem value="IELTS Academic">IELTS Academic (Band 6.0 - 9.0)</SelectItem>
                          <SelectItem value="IELTS General">IELTS General (Band 5.0 - 8.0)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldContent>
                <FieldError errors={[errors.difficulty]} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="topic">Topic or Subject Matter</FieldLabel>
              <FieldContent>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., Climate change effects on marine biology, Artificial Intelligence in healthcare..."
                  {...register("topic")}
                />
              </FieldContent>
              <FieldError errors={[errors.topic]} />
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Generating Test… (up to 30s)
                </>
              ) : (
                <>
                  Generate with AI
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Column: Info sidebar */}
      <div className="lg:col-span-2">
        <Card className="rounded-xl border border-border bg-card h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">How AI Generation Works</CardTitle>
            <CardDescription>What to expect when you generate a test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span className="mt-0.5 shrink-0 w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </span>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-foreground">Gemini 2.5 Flash</h4>
                <p>Google's fast multimodal model generates a full reading passage with multiple-choice questions tailored to your topic.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 shrink-0 w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </span>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-foreground">Takes ~15–30 Seconds</h4>
                <p>Generation time depends on difficulty and topic complexity. Don't close the page while generating.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 shrink-0 w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </span>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-foreground">Saved Automatically</h4>
                <p>The completed test is immediately saved to the database and made available for students to take.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
