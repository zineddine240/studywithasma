import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()

  // If user is already authenticated, redirect to their dashboard
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role
    if (role === 'admin' || role === 'teacher') {
      redirect('/admin')
    } else {
      redirect('/student-portal')
    }
  }

  // Check if any admin exists in the system
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')

  // If there is no admin, automatically redirect to the setup page
  if (count === 0 && !error) {
    redirect('/setup')
  }

  // Otherwise, render the normal login form
  return <LoginForm />
}
