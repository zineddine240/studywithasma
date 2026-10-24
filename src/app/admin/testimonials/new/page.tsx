"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addTestimonialAction } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  band: z.string().max(50).optional(),
  role: z.string().max(100).optional(),
  text: z.string().min(10, "Text must be at least 10 characters"),
  is_published: z.boolean(),
});

export default function NewTestimonialPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      band: "",
      role: "",
      text: "",
      is_published: true, // Default true when admin adds
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await addTestimonialAction({
        name: values.name,
        band: values.band || null,
        role: values.role || null,
        text: values.text,
        is_published: values.is_published,
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success("Testimonial added successfully!");
        router.push("/admin/testimonials");
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  }

  const isPublished = watch("is_published");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Testimonial</h1>
          <p className="text-sm text-muted-foreground">Add a success story manually.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="name">Student Name *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      placeholder="e.g., Yacine B"
                      {...register("name")}
                    />
                  </FieldContent>
                  <FieldError errors={[errors.name]} />
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="band">Band Score</FieldLabel>
                  <FieldContent>
                    <Input
                      id="band"
                      placeholder="e.g., Band 8.5"
                      {...register("band")}
                    />
                  </FieldContent>
                  <FieldError errors={[errors.band]} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="role">Course / Role</FieldLabel>
                <FieldContent>
                  <Input
                    id="role"
                    placeholder="e.g., Academic IELTS"
                    {...register("role")}
                  />
                </FieldContent>
                <FieldError errors={[errors.role]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="text">Testimonial *</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="text"
                    placeholder="The best IELTS preparation course available online..."
                    className="min-h-32"
                    {...register("text")}
                  />
                </FieldContent>
                <FieldError errors={[errors.text]} />
              </Field>

              <div className="flex items-center space-x-2 bg-muted/30 p-4 rounded-lg border border-border">
                <Switch
                  id="is_published"
                  checked={isPublished}
                  onCheckedChange={(checked: boolean) => setValue("is_published", checked)}
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                  Publish immediately (Show on public website)
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/admin/testimonials">
                  <Button type="button" variant="outline" className="cursor-pointer">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                  {isSubmitting ? "Adding…" : "Add Testimonial"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Info Card */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Testimonial Tips</CardTitle>
              <CardDescription>Adding impactful success stories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Band Score</h4>
                <p>Include the band score if known to build credibility (e.g., "Band 8.0").</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Authenticity</h4>
                <p>Keep the wording close to what the student actually said. Authentic reviews resonate more with prospective students.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Publishing</h4>
                <p>If "Publish immediately" is checked, this testimonial will instantly appear on the public landing page in the "Student Success Stories" section.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
