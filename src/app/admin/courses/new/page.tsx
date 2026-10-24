"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createCourseAction } from "@/app/admin/actions"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  badge: z.string().min(1, "Badge is required"),
  short_description: z.string().min(10, "Short description is required"),
  who_is_it_for: z.string().min(10, "Please describe who this course is for"),
  what_students_receive: z.array(z.object({ value: z.string().min(1, "Cannot be empty") })).min(1, "Add at least one item"),
  learning_format: z.array(z.object({ value: z.string().min(1, "Cannot be empty") })).min(1, "Add at least one item"),
})

type FormValues = z.infer<typeof schema>

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export default function NewCoursePage() {
  const router = useRouter()

  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      badge: "",
      short_description: "",
      who_is_it_for: "",
      what_students_receive: [{ value: "" }],
      learning_format: [{ value: "" }],
    },
  })

  const { fields: receiveFields, append: appendReceive, remove: removeReceive } = useFieldArray({ control, name: "what_students_receive" })
  const { fields: formatFields, append: appendFormat, remove: removeFormat } = useFieldArray({ control, name: "learning_format" })

  // Auto-derive slug from title
  const title = watch("title")
  function handleTitleBlur() {
    const current = watch("slug")
    if (!current) {
      setValue("slug", toSlug(title))
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      const result = await createCourseAction({
        title: values.title,
        slug: values.slug,
        badge: values.badge,
        short_description: values.short_description,
        who_is_it_for: values.who_is_it_for,
        what_students_receive: values.what_students_receive.map((i) => i.value),
        learning_format: values.learning_format.map((i) => i.value),
      })
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Course created successfully!")
        router.push(`/admin/courses/${result.id}`)
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Course</h1>
          <p className="text-sm text-muted-foreground">Fill in the details to create a new course on the website.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

              <Field>
                <FieldLabel htmlFor="title">Course Title</FieldLabel>
                <FieldContent>
                  <Input id="title" placeholder="e.g. Academic IELTS" {...register("title")} onBlur={handleTitleBlur} />
                </FieldContent>
                <FieldError errors={[errors.title]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="slug">URL Slug</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/courses/</span>
                    <Input id="slug" placeholder="academic-ielts" className="pl-20" {...register("slug")} />
                  </div>
                </FieldContent>
                <FieldError errors={[errors.slug]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="badge">Badge Label</FieldLabel>
                <FieldContent>
                  <Input id="badge" placeholder="e.g. Academic · General" {...register("badge")} />
                </FieldContent>
                <FieldError errors={[errors.badge]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="short_description">Short Description</FieldLabel>
                <FieldContent>
                  <Textarea id="short_description" placeholder="A brief overview of the course shown on the public listing." className="min-h-24" {...register("short_description")} />
                </FieldContent>
                <FieldError errors={[errors.short_description]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="who_is_it_for">Who Is It For?</FieldLabel>
                <FieldContent>
                  <Textarea id="who_is_it_for" placeholder="Describe the target student for this course." className="min-h-24" {...register("who_is_it_for")} />
                </FieldContent>
                <FieldError errors={[errors.who_is_it_for]} />
              </Field>

              {/* What Students Receive */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel>What Students Receive</FieldLabel>
                  <Button type="button" variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => appendReceive({ value: "" })}>
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </Button>
                </div>
                {receiveFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input placeholder={`e.g. Recorded lessons`} {...register(`what_students_receive.${index}.value`)} />
                    {receiveFields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeReceive(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Learning Format */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel>Learning Format</FieldLabel>
                  <Button type="button" variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => appendFormat({ value: "" })}>
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </Button>
                </div>
                {formatFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input placeholder={`e.g. Live Zoom classes`} {...register(`learning_format.${index}.value`)} />
                    {formatFields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFormat(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/admin/courses">
                  <Button type="button" variant="outline" className="cursor-pointer">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                  {isSubmitting ? "Creating…" : "Create Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar tips */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Course Guidelines</CardTitle>
              <CardDescription>Tips to create an effective course listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Slug</h4>
                <p>Must be unique and URL-friendly. It forms the public URL: <code className="bg-muted px-1 rounded">/courses/your-slug</code>.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Badge</h4>
                <p>A short label shown on the course card. Examples: <em>Academic</em>, <em>General Training</em>.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Modules</h4>
                <p>After creating the course, you can add modules (Listening, Reading, Writing, Speaking, etc.) from the edit page.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Visibility</h4>
                <p>The course becomes visible on the public website as soon as it is created.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
