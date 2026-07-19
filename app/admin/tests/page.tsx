import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'
import { TestsTableClient } from './TestsTableClient'

export default async function TestsAdminPage() {
  const supabase = await createClient()

  // Fetch the 10 most recent tests
  const { data: tests } = await supabase
    .from('tests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tests & AI Generation"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tests" }
        ]}
        action={
          <Link href="/admin/tests/new" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Add Test
          </Link>
        }
      />

      <TestsTableClient data={tests || []} />
    </div>
  )
}
