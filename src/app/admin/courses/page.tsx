import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'
import { BookOpen, Layers, PenLine } from 'lucide-react'

export default async function CoursesAdminPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, badge, created_at')
    .order('created_at', { ascending: false })

  // Fetch module counts for all courses in one query
  const { data: moduleCounts } = await supabase
    .from('modules')
    .select('course_id')

  const countMap: Record<string, number> = {}
  moduleCounts?.forEach((m) => {
    if (m.course_id) countMap[m.course_id] = (countMap[m.course_id] || 0) + 1
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Courses' },
        ]}
        action={
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2"
          >
            <BookOpen className="w-4 h-4" />
            New Course
          </Link>
        }
      />

      {!courses || courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-1 text-foreground">No courses yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Create your first course to make it visible on the public website.
          </p>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => {
            const modCount = countMap[course.id] || 0
            return (
              <div
                key={course.id}
                className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-primary">
                    {course.badge}
                  </span>
                </div>

                <div className="grow">
                  <h3 className="text-base font-bold text-foreground mb-1">{course.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono">/{course.slug}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{modCount} {modCount === 1 ? 'module' : 'modules'}</span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 text-primary px-3 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center rounded-lg border border-border text-muted-foreground px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
