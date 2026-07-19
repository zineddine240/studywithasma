'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdminOrTeacher() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'teacher') {
    throw new Error('Forbidden')
  }

  return { supabase, user }
}

export async function createAnnouncementAction(formData: FormData) {
  try {
    const { supabase, user } = await verifyAdminOrTeacher()
    
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (!title || !content) {
      return { error: 'Title and content are required' }
    }

    const { error } = await supabase.from('announcements').insert({
      title,
      content,
      created_by: user.id
    })

    if (error) throw error

    revalidatePath('/admin/announcements')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create announcement' }
  }
}

export async function deleteAnnouncementAction(id: string) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/announcements')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete announcement' }
  }
}

export async function createLiveClassAction(formData: FormData) {
  try {
    const { supabase, user } = await verifyAdminOrTeacher()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const meeting_link = formData.get('meeting_link') as string
    const scheduled_at = formData.get('scheduled_at') as string
    const module_id = formData.get('module_id') as string || null
    const course_id_form = formData.get('course_id') as string || null
    const recording_url = formData.get('recording_url') as string || null

    if (!title || !meeting_link || !scheduled_at) {
      return { error: 'Title, Meeting link, and date are required' }
    }

    const final_module_id = module_id;
    const final_course_id = module_id ? null : course_id_form;

    const { error } = await supabase.from('live_classes').insert({
      title,
      description,
      meeting_link,
      scheduled_at,
      module_id: final_module_id,
      course_id: final_course_id,
      recording_url,
      created_by: user.id
    })

    if (error) throw error

    revalidatePath('/admin/live-classes')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create live class' }
  }
}

export async function updateLiveClassAction(id: string, formData: FormData) {
  try {
    const { supabase } = await verifyAdminOrTeacher()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const meeting_link = formData.get('meeting_link') as string
    const scheduled_at = formData.get('scheduled_at') as string
    const module_id = formData.get('module_id') as string || null
    const course_id_form = formData.get('course_id') as string || null
    const recording_url = formData.get('recording_url') as string || null

    if (!title || !meeting_link || !scheduled_at) {
      return { error: 'Title, Meeting link, and date are required' }
    }

    const final_module_id = module_id;
    const final_course_id = module_id ? null : course_id_form;

    const { error } = await supabase
      .from('live_classes')
      .update({
        title,
        description,
        meeting_link,
        scheduled_at,
        module_id: final_module_id,
        course_id: final_course_id,
        recording_url,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/live-classes')
    revalidatePath('/student-portal/live-classes')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update live class' }
  }
}

export async function deleteLiveClassAction(id: string) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    const { error } = await supabase
      .from('live_classes')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/live-classes')
    revalidatePath('/student-portal/live-classes')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete live class' }
  }
}

export async function createLessonAction(formData: FormData) {
  try {
    const { supabase, user } = await verifyAdminOrTeacher()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const video_url = formData.get('video_url') as string
    const module_id = formData.get('module_id') as string || null
    const course_id_form = formData.get('course_id') as string || null

    if (!title || !video_url) {
      return { error: 'Title and Video URL are required' }
    }

    const final_module_id = module_id;
    const final_course_id = module_id ? null : course_id_form;

    const { error } = await supabase.from('recorded_lessons').insert({
      title,
      description,
      video_url,
      module_id: final_module_id,
      course_id: final_course_id,
      created_by: user.id
    })

    if (error) throw error

    revalidatePath('/admin/lessons')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to publish lesson' }
  }
}

export async function updateLessonAction(id: string, formData: FormData) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const video_url = formData.get('video_url') as string
    const module_id = formData.get('module_id') as string || null
    const course_id_form = formData.get('course_id') as string || null

    if (!title || !video_url) {
      return { error: 'Title and Video URL are required' }
    }

    const final_module_id = module_id;
    const final_course_id = module_id ? null : course_id_form;

    const { error } = await supabase
      .from('recorded_lessons')
      .update({
        title,
        description,
        video_url,
        module_id: final_module_id,
        course_id: final_course_id,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/lessons')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update lesson' }
  }
}

export async function deleteLessonAction(id: string) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    const { error } = await supabase
      .from('recorded_lessons')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/lessons')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete lesson' }
  }
}


export async function updateProfileAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const full_name = formData.get('full_name') as string
    const bio = formData.get('bio') as string

    if (!full_name) {
      return { error: 'Full name is required' }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name,
        bio,
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/admin/profile')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update profile' }
  }
}

// ─── Course Actions ─────────────────────────────────────────────────────────

export interface CourseFormData {
  title: string
  slug: string
  badge: string
  short_description: string
  who_is_it_for: string
  what_students_receive: string[]
  learning_format: string[]
}

export async function createCourseAction(data: CourseFormData) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    if (!data.title || !data.slug) {
      return { error: 'Title and slug are required' }
    }

    const { data: course, error } = await supabase.from('courses').insert({
      title: data.title,
      slug: data.slug,
      badge: data.badge,
      short_description: data.short_description,
      who_is_it_for: data.who_is_it_for,
      what_students_receive: data.what_students_receive,
      learning_format: data.learning_format,
    }).select('id').single()

    if (error) throw error

    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    return { success: true, id: course.id }
  } catch (error: any) {
    return { error: error.message || 'Failed to create course' }
  }
}

export async function updateCourseAction(id: string, data: CourseFormData) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    const { error } = await supabase.from('courses').update({
      title: data.title,
      slug: data.slug,
      badge: data.badge,
      short_description: data.short_description,
      who_is_it_for: data.who_is_it_for,
      what_students_receive: data.what_students_receive,
      learning_format: data.learning_format,
    }).eq('id', id)

    if (error) throw error

    revalidatePath('/admin/courses')
    revalidatePath(`/admin/courses/${id}`)
    revalidatePath('/courses')
    revalidatePath(`/courses/${data.slug}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update course' }
  }
}

export async function deleteCourseAction(id: string) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    const { error } = await supabase.from('courses').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete course' }
  }
}

// ─── Module Actions ──────────────────────────────────────────────────────────

export interface ModuleFormData {
  course_id: string
  number: number
  name: string
  description: string
  slug: string
}

export async function createModuleAction(data: ModuleFormData) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    if (!data.name || !data.course_id) {
      return { error: 'Name and course are required' }
    }

    const { error } = await supabase.from('modules').insert({
      course_id: data.course_id,
      number: data.number,
      name: data.name,
      description: data.description,
      slug: data.slug,
    })

    if (error) throw error

    revalidatePath(`/admin/courses/${data.course_id}`)
    revalidatePath('/courses')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create module' }
  }
}

export async function updateModuleAction(id: string, data: Partial<ModuleFormData>) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    const { error } = await supabase.from('modules').update({
      name: data.name,
      description: data.description,
      slug: data.slug,
      number: data.number,
    }).eq('id', id)

    if (error) throw error

    revalidatePath(`/admin/courses/${data.course_id}`)
    revalidatePath('/courses')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update module' }
  }
}

export async function deleteModuleAction(id: string, courseId: string) {
  try {
    const { supabase } = await verifyAdminOrTeacher()

    const { error } = await supabase.from('modules').delete().eq('id', id)

    if (error) throw error

    revalidatePath(`/admin/courses/${courseId}`)
    revalidatePath('/courses')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete module' }
  }
}


