import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', data.user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  if (profile.role !== 'admin' && profile.role !== 'teacher') {
    redirect('/student-portal')
  }

  // Fetch unread contact submissions count for sidebar badge
  const { count: unreadContactCount } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread')

  return (
    <AdminLayoutClient
      email={data.user.email}
      fullName={profile?.full_name ?? null}
      unreadContactCount={unreadContactCount ?? 0}
    >
      {children}
    </AdminLayoutClient>
  )
}
