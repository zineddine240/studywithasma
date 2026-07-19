import { createClient } from '@/utils/supabase/server'
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'
import { AnnouncementsTableClient } from './AnnouncementsTableClient'

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Announcements" }
        ]}
        action={
          <Link href="/admin/announcements/new" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Add Announcement
          </Link>
        }
      />

      {!announcements || announcements.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-xl">📣</span>
          </div>
          <h3 className="text-lg font-semibold mb-1 text-foreground">No announcements yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Publish your first announcement to notify enrolled students about upcoming changes or events.
          </p>
        </Card>
      ) : (
        <AnnouncementsTableClient initialData={announcements} />
      )}
    </div>
  )
}
