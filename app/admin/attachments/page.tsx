import { createClient } from '@/utils/supabase/server'
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'
import { AttachmentsTableClient } from './AttachmentsTableClient'

export default async function ModuleAttachmentsPage() {
  const supabase = await createClient()

  const { data: attachments } = await supabase
    .from('module_attachments')
    .select('*, module:modules(name, course:courses(title))')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Module Attachments"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Attachments" }
        ]}
        action={
          <Link href="/admin/attachments/new" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Add Attachment
          </Link>
        }
      />

      {!attachments || attachments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-xl">📎</span>
          </div>
          <h3 className="text-lg font-semibold mb-1 text-foreground">No attachments found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Upload files or add links to provide extra resources to your students.
          </p>
        </Card>
      ) : (
        <AttachmentsTableClient initialData={attachments as any} />
      )}
    </div>
  )
}
