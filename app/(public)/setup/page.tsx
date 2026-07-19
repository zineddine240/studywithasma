import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SetupForm from './SetupForm'

export default async function SetupPage() {
  const supabase = await createClient()

  // Double check if any admin exists
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')

  // If an admin already exists, we should NOT allow anyone on this page.
  if (count && count > 0) {
    redirect('/login')
  }

  return <SetupForm />
}
