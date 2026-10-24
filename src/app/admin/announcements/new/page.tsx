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
import { createAnnouncementAction } from "../../actions";
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

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export default function NewAnnouncementPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);

    try {
      const result = await createAnnouncementAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success("Announcement published successfully!");
        router.push("/admin/announcements");
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/announcements" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Publish Announcement</h1>
          <p className="text-sm text-muted-foreground">This will be immediately visible to all enrolled students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <FieldContent>
                  <Input
                    id="title"
                    placeholder="e.g., Platform Maintenance Tomorrow"
                    {...register("title")}
                  />
                </FieldContent>
                <FieldError errors={[errors.title]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="content">Message Content</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="content"
                    placeholder="Write your announcement here..."
                    className="min-h-40"
                    {...register("content")}
                  />
                </FieldContent>
                <FieldError errors={[errors.content]} />
              </Field>

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/admin/announcements">
                  <Button type="button" variant="outline" className="cursor-pointer">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                  {isSubmitting ? "Publishing…" : "Publish"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Guidelines Card */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Announcement Tips</CardTitle>
              <CardDescription>Write effective announcements for your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Immediate Visibility</h4>
                <p>Announcements are published instantly and shown to all enrolled students on their dashboard at the top of the page.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Keep Titles Clear</h4>
                <p>Use concise, descriptive titles so students instantly understand the topic (e.g., "New Resource: IELTS Writing Checklist").</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Tone & Language</h4>
                <p>Maintain a professional yet friendly tone. Avoid ambiguous phrasing that could cause confusion.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Include Action Items</h4>
                <p>If students need to do something (e.g., join a new session or complete a test), mention it early in the content.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
