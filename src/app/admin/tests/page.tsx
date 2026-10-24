import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'
import { TestsTableClient } from './TestsTableClient'

export default async function TestsAdminPage(
  props: {
    searchParams?: Promise<{
      page?: string;
      type?: string;
    }>
  }
) {
  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const typeFilter = searchParams?.type || 'all';
  const limit = 10;
  const offset = (page - 1) * limit;

  const supabase = await createClient()

  // Fetch tests with pagination and optional type filtering
  let query = supabase
    .from('tests')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (typeFilter !== 'all') {
    query = query.eq('content_type', typeFilter);
  }

  const { data: tests, count } = await query;
  const totalPages = count ? Math.ceil(count / limit) : 1;

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

      <TestsTableClient 
        data={tests || []} 
        currentPage={page}
        totalPages={totalPages}
        currentType={typeFilter}
      />
    </div>
  )
}
