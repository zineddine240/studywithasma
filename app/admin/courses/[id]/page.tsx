"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateCourseAction, deleteCourseAction, createModuleAction, deleteModuleAction } from "@/app/admin/actions"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Layers, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { use, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

interface Module {
  id: string
  number: number
  name: string
  description: string
  slug: string
}

interface Course {
  id: string
  title: string
  slug: string
  badge: string
  short_description: string
  who_is_it_for: string
  what_students_receive: string[]
  learning_format: string[]
  modules: Module[]
}

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  badge: z.string().min(1, "Badge is required"),
  short_description: z.string().min(10, "Short description is required"),
  who_is_it_for: z.string().min(10, "Please describe who this course is for"),
  what_students_receive: z.array(z.object({ value: z.string().min(1) })).min(1),
  learning_format: z.array(z.object({ value: z.string().min(1) })).min(1),
})
type FormValues = z.infer<typeof schema>

const modSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
})
type ModFormValues = z.infer<typeof modSchema>

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [deletingModule, setDeletingModule] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single()

      if (!courseData) { router.push("/admin/courses"); return }

      const { data: modules } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", id)
        .order("number", { ascending: true })

      setCourse({ ...courseData, modules: modules || [] })
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleDelete() {
    if (!confirm("Delete this course and all its modules? This cannot be undone.")) return
    setDeletingCourse(true)
    const result = await deleteCourseAction(id)
    if (result.error) { toast.error(result.error); setDeletingCourse(false) }
    else { toast.success("Course deleted."); router.push("/admin/courses") }
  }

  async function handleModuleDelete(moduleId: string) {
    setDeletingModule(moduleId)
    const result = await deleteModuleAction(moduleId, id)
    if (result.error) { toast.error(result.error) }
    else {
      toast.success("Module deleted.")
      setCourse(prev => prev ? { ...prev, modules: prev.modules.filter(m => m.id !== moduleId) } : prev)
    }
    setDeletingModule(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!course) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Course</h1>
            <p className="text-sm text-muted-foreground font-mono">/courses/{course.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/courses/${course.slug}`} target="_blank" className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 transition-colors">
            Preview ↗
          </Link>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={deletingCourse}
            onClick={handleDelete}
            className="cursor-pointer"
          >
            {deletingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Course"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <CourseDetailsForm course={course} />

          <ModuleManager
            courseId={course.id}
            modules={course.modules}
            onDelete={handleModuleDelete}
            onCreated={(newModule) => {
              setCourse(prev => prev ? {
                ...prev,
                modules: [...prev.modules, newModule].sort((a, b) => a.number - b.number),
              } : prev)
            }}
            deletingModule={deletingModule}
          />
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-2 lg:sticky lg:top-6 h-fit">
          <Card className="rounded-xl border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Course Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules</span>
                <span className="font-medium text-foreground">{course.modules.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Public URL</span>
                <Link href={`/courses/${course.slug}`} target="_blank" className="text-primary hover:underline text-xs">
                  /courses/{course.slug}
                </Link>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Changes are reflected on the public website immediately after saving.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CourseDetailsForm({ course }: { course: Course }) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: course.title,
      slug: course.slug,
      badge: course.badge,
      short_description: course.short_description,
      who_is_it_for: course.who_is_it_for,
      what_students_receive: (course.what_students_receive || []).map(v => ({ value: v })),
      learning_format: (course.learning_format || []).map(v => ({ value: v })),
    },
  })

  const { fields: receiveFields, append: appendReceive, remove: removeReceive } = useFieldArray({ control, name: "what_students_receive" })
  const { fields: formatFields, append: appendFormat, remove: removeFormat } = useFieldArray({ control, name: "learning_format" })

  async function onSubmit(values: FormValues) {
    const result = await updateCourseAction(course.id, {
      title: values.title,
      slug: values.slug,
      badge: values.badge,
      short_description: values.short_description,
      who_is_it_for: values.who_is_it_for,
      what_students_receive: values.what_students_receive.map(i => i.value),
      learning_format: values.learning_format.map(i => i.value),
    })
    if (result.error) toast.error(result.error)
    else toast.success("Course updated successfully!")
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground mb-6">Course Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <Field>
          <FieldLabel htmlFor="title">Course Title</FieldLabel>
          <FieldContent><Input id="title" {...register("title")} /></FieldContent>
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">URL Slug</FieldLabel>
          <FieldContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/courses/</span>
              <Input id="slug" className="pl-20" {...register("slug")} />
            </div>
          </FieldContent>
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="badge">Badge Label</FieldLabel>
          <FieldContent><Input id="badge" {...register("badge")} /></FieldContent>
          <FieldError errors={[errors.badge]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="short_description">Short Description</FieldLabel>
          <FieldContent><Textarea id="short_description" className="min-h-24" {...register("short_description")} /></FieldContent>
          <FieldError errors={[errors.short_description]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="who_is_it_for">Who Is It For?</FieldLabel>
          <FieldContent><Textarea id="who_is_it_for" className="min-h-24" {...register("who_is_it_for")} /></FieldContent>
          <FieldError errors={[errors.who_is_it_for]} />
        </Field>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>What Students Receive</FieldLabel>
            <Button type="button" variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => appendReceive({ value: "" })}>
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
          {receiveFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`what_students_receive.${index}.value`)} />
              {receiveFields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeReceive(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>Learning Format</FieldLabel>
            <Button type="button" variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => appendFormat({ value: "" })}>
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
          {formatFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`learning_format.${index}.value`)} />
              {formatFields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFormat(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
            {isSubmitting ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

function ModuleManager({ courseId, modules, onDelete, onCreated, deletingModule }: {
  courseId: string
  modules: Module[]
  onDelete: (id: string) => void
  onCreated: (m: Module) => void
  deletingModule: string | null
}) {
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ModFormValues>({
    resolver: zodResolver(modSchema),
  })

  async function onSubmit(values: ModFormValues) {
    const nextNumber = modules.length > 0 ? Math.max(...modules.map(m => m.number)) + 1 : 1
    const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const result = await createModuleAction({
      course_id: courseId,
      number: nextNumber,
      name: values.name,
      description: values.description,
      slug,
    })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Module added!")
      onCreated({ id: crypto.randomUUID(), number: nextNumber, name: values.name, description: values.description, slug })
      reset()
      setShowForm(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Modules</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{modules.length}</span>
        </div>
        {!showForm && (
          <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setShowForm(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Module
          </Button>
        )}
      </div>

      {modules.length === 0 && !showForm && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No modules yet. Add the first one above.
        </div>
      )}

      <div className="space-y-3">
        {modules.map((mod) => (
          <div key={mod.id} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
              {mod.number}
            </div>
            <div className="grow min-w-0">
              <p className="font-medium text-foreground text-sm">{mod.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{mod.description}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={deletingModule === mod.id}
              onClick={() => onDelete(mod.id)}
            >
              {deletingModule === mod.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 p-4 rounded-xl border border-primary/30 bg-primary/5" noValidate>
          <h3 className="text-sm font-semibold text-foreground">New Module #{modules.length + 1}</h3>
          <Field>
            <FieldLabel htmlFor="mod-name">Module Name</FieldLabel>
            <FieldContent>
              <Input id="mod-name" placeholder="e.g. Listening" {...register("name")} />
            </FieldContent>
            <FieldError errors={[errors.name]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="mod-desc">Description</FieldLabel>
            <FieldContent>
              <Textarea id="mod-desc" placeholder="Brief description of what this module covers." className="min-h-20" {...register("description")} />
            </FieldContent>
            <FieldError errors={[errors.description]} />
          </Field>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowForm(false); reset() }} className="cursor-pointer">Cancel</Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Adding…" : "Add Module"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
