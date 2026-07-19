import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'
import { LiveClassesTableClient } from './LiveClassesTableClient'

export default async function LiveClassesPage() {
  const supabase = await createClient()

  const { data: classes } = await supabase
    .from('live_classes')
    .select('*')
    .order('scheduled_at', { ascending: true })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Classes"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Live Classes" }
        ]}
        action={
          <Link href="/admin/live-classes/new" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Schedule Class
          </Link>
        }
      />

      {!classes || classes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-xl">📹</span>
          </div>
          <h3 className="text-lg font-semibold mb-1 text-foreground">No live classes scheduled</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create your first live class session to provide the Zoom link to enrolled students.
          </p>
        </Card>
      ) : (
        <LiveClassesTableClient data={classes || []} />
      )}
    </div>
  )
}
