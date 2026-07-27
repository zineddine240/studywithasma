import { createClient } from '@/utils/supabase/server'
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'
import { TestimonialsTableClient } from './TestimonialsTableClient'

export default async function TestimonialsPage() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Testimonials" }
        ]}
        action={
          <Link href="/admin/testimonials/new" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Add Testimonial
          </Link>
        }
      />

      {!testimonials || testimonials.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-xl">🌟</span>
          </div>
          <h3 className="text-lg font-semibold mb-1 text-foreground">No testimonials yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Student testimonials will appear here, or you can add one manually.
          </p>
        </Card>
      ) : (
        <TestimonialsTableClient initialData={testimonials} />
      )}
    </div>
  )
}
