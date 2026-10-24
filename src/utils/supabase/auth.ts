import { createClient } from './server'

export async function getUserRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch role from the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role as 'student' | 'admin' | 'teacher' | null
}

export async function requireAdminOrTeacher() {
  const role = await getUserRole()
  if (role !== 'admin' && role !== 'teacher') {
    throw new Error('Unauthorized')
  }
  return true
}
