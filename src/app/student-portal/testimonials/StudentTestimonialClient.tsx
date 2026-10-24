"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitTestimonial } from "../actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, MessageSquareQuote } from "lucide-react";

export type Testimonial = {
  id: string;
  name: string;
  band: string | null;
  role: string | null;
  text: string;
  is_published: boolean;
  created_at: string;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  band: z.string().max(50).optional(),
  role: z.string().max(100).optional(),
  text: z.string().min(10, "Your testimonial must be at least 10 characters long"),
});

export function StudentTestimonialClient({
  initialData,
  profile,
}: {
  initialData: Testimonial[];
  profile: { full_name: string; target_band: string };
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.full_name || "",
      band: profile.target_band ? `Band ${profile.target_band}` : "",
      role: "IELTS Student",
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.band) formData.append("band", values.band);
    if (values.role) formData.append("role", values.role);
    formData.append("text", values.text);

    try {
      const result = await submitTestimonial(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Thank you! Your testimonial has been submitted.");
        reset({ ...values, text: "" });
        // Optimistically add to list (revalidatePath will also run on next page load)
        const newTestimonial: Testimonial = {
          id: Date.now().toString(),
          name: values.name,
          band: values.band || null,
          role: values.role || null,
          text: values.text,
          is_published: false,
          created_at: new Date().toISOString(),
        };
        setTestimonials([newTestimonial, ...testimonials]);
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Submit Form */}
      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <MessageSquareQuote className="w-5 h-5 text-primary" />
            Submit a Testimonial
          </CardTitle>
          <CardDescription>
            Share your experience to help others on their IELTS journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="name">Your Name *</FieldLabel>
                <FieldContent>
                  <Input id="name" placeholder="Yacine B" {...register("name")} />
                </FieldContent>
                <FieldError errors={[errors.name]} />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="band">Achieved Score (Optional)</FieldLabel>
                <FieldContent>
                  <Input id="band" placeholder="e.g., Band 8.5" {...register("band")} />
                </FieldContent>
                <FieldError errors={[errors.band]} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="role">Course / Preparation Type (Optional)</FieldLabel>
              <FieldContent>
                <Input id="role" placeholder="e.g., Academic IELTS" {...register("role")} />
              </FieldContent>
              <FieldError errors={[errors.role]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="text">Your Success Story *</FieldLabel>
              <FieldContent>
                <Textarea
                  id="text"
                  placeholder="How did Asma's course help you achieve your goals?"
                  className="min-h-32"
                  {...register("text")}
                />
              </FieldContent>
              <FieldError errors={[errors.text]} />
            </Field>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Previously Submitted */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-foreground px-1">Your Submissions</h3>
        {testimonials.length === 0 ? (
          <div className="text-center p-8 bg-muted/20 border border-border/50 border-dashed rounded-xl text-muted-foreground">
            You haven't submitted any testimonials yet.
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <Card key={t.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <p className="text-sm italic text-foreground mb-4">"{t.text}"</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border/50 pt-4 mt-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role} {t.band ? `• ${t.band}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {t.is_published ? (
                          <span className="flex items-center gap-1 text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published
                          </span>
                        ) : (
                          <span className="text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            Pending Review
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
