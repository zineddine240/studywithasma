import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, FileText, Video, GraduationCap, ArrowRight } from "lucide-react"
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function AdminDashboardOverview() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin'

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${displayName} 👋`}
        breadcrumbs={[
          { label: "Dashboard" }
        ]}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Quick Stats Cards */}
        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-muted-foreground truncate">Total Enrolled Students</dt>
            <dd className="mt-1 text-3xl font-semibold text-foreground">0</dd>
          </div>
        </div>

        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-muted-foreground truncate">AI Generated Tests</dt>
            <dd className="mt-1 text-3xl font-semibold text-foreground">0</dd>
          </div>
        </div>

        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-muted-foreground truncate">Upcoming Classes</dt>
            <dd className="mt-1 text-3xl font-semibold text-foreground">0</dd>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-foreground">Welcome to the Admin Portal</h3>
          <div className="mt-2 max-w-xl text-sm text-muted-foreground">
            <p>
              Use the sidebar to navigate through your management tools. You can generate new AI IELTS tests, schedule live classes, upload recorded lessons, and post announcements for your students.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
