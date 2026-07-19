'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function setupAdminAction(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const supabase = await createClient()

    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (countError) {
      return { error: `Database error checking admins: ${countError.message || JSON.stringify(countError)}` }
    }
    if (count !== 0) {
      return { error: 'Admin account already exists. Setup aborted.' }
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      const errorDump = signUpError.message || signUpError.name || "Failed to create account";
      return { error: `Sign up failed: ${errorDump}` }
    }

  } catch (e: any) {
    return { error: `Unexpected server error: ${e.message || 'Unknown error'}` }
  }

  redirect('/admin')
}
