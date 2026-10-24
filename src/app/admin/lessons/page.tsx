import { createClient } from '@/utils/supabase/server'
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'
import { LessonsTableClient } from './LessonsTableClient'

export default async function RecordedLessonsPage() {
  const supabase = await createClient()

  const { data: lessons } = await supabase
    .from('recorded_lessons')
    .select('*, module:modules(name, course:courses(title))')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recorded Lessons"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Recorded Lessons" }
        ]}
        action={
          <Link href="/admin/lessons/new" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Add Lesson
          </Link>
        }
      />

      {!lessons || lessons.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-xl">▶️</span>
          </div>
          <h3 className="text-lg font-semibold mb-1 text-foreground">No lessons available</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Add your first recorded lesson to the library so students can watch it anytime.
          </p>
        </Card>
      ) : (
        <LessonsTableClient initialData={lessons as any} />
      )}
    </div>
  )
}

