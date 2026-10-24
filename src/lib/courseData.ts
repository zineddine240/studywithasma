import { createClient } from '@/utils/supabase/server';

export interface CourseModule {
  number: number;
  name: string;
  description: string;
  lessonCount: number;
}

export interface CourseDetail {
  slug: string;
  title: string;
  badge: string;
  shortDescription: string;
  whoIsItFor: string;
  modules: CourseModule[];
  whatStudentsReceive: string[];
  learningFormat: string[];
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  badge: string;
  shortDescription: string;
  moduleCount: number;
}

export async function getAllCourses(): Promise<CourseSummary[]> {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, slug, title, badge, short_description')
    .order('created_at', { ascending: true });

  if (error || !courses) return [];

  // Fetch all module course_ids in one query
  const { data: modules } = await supabase
    .from('modules')
    .select('course_id');

  const countMap: Record<string, number> = {};
  modules?.forEach((m) => {
    if (m.course_id) countMap[m.course_id] = (countMap[m.course_id] || 0) + 1;
  });

  return courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    badge: c.badge,
    shortDescription: c.short_description,
    moduleCount: countMap[c.id] || 0,
  }));
}

export interface CourseWithModules {
  id: string;
  slug: string;
  title: string;
  badge: string;
  shortDescription: string;
  modules: {
    id: string;
    number: number;
    name: string;
    description: string;
    slug: string;
  }[];
}

export async function getCoursesWithModules(): Promise<CourseWithModules[]> {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, slug, title, badge, short_description')
    .order('created_at', { ascending: true });

  if (error || !courses) return [];

  // Fetch all modules
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, course_id, number, name, description, slug')
    .order('number', { ascending: true });

  const modulesByCourse: Record<string, any[]> = {};
  if (!modulesError && modules) {
    modules.forEach((m) => {
      if (m.course_id) {
        if (!modulesByCourse[m.course_id]) {
          modulesByCourse[m.course_id] = [];
        }
        modulesByCourse[m.course_id].push({
          id: m.id,
          number: m.number,
          name: m.name,
          description: m.description,
          slug: m.slug,
        });
      }
    });
  }

  return courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    badge: c.badge,
    shortDescription: c.short_description,
    modules: modulesByCourse[c.id] || [],
  }));
}


export async function getCourseBySlug(slug: string): Promise<CourseDetail | undefined> {
  const supabase = await createClient();

  // 1. Fetch course details
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (courseError || !course) {
    return undefined;
  }

  // 2. Fetch modules for this course
  const { data: modulesData, error: modulesError } = await supabase
    .from('modules')
    .select('id, number, name, description')
    .eq('course_id', course.id)
    .order('number', { ascending: true });

  let formattedModules: CourseModule[] = [];

  if (!modulesError && modulesData) {
    // 3. For each module, we might want to count the lessons. 
    // Since we don't have a direct count in the module row, we can fetch count from recorded_lessons.
    const moduleIds = modulesData.map((m) => m.id);
    
    let lessonCounts: Record<string, number> = {};
    if (moduleIds.length > 0) {
        const { data: lessons } = await supabase
        .from('recorded_lessons')
        .select('module_id')
        .in('module_id', moduleIds);

        if (lessons) {
            lessons.forEach((l) => {
                if (l.module_id) {
                    lessonCounts[l.module_id] = (lessonCounts[l.module_id] || 0) + 1;
                }
            });
        }
    }

    formattedModules = modulesData.map((m) => ({
      number: m.number,
      name: m.name,
      description: m.description,
      lessonCount: lessonCounts[m.id] || 0,
    }));
  }

  return {
    slug: course.slug,
    title: course.title,
    badge: course.badge,
    shortDescription: course.short_description,
    whoIsItFor: course.who_is_it_for,
    modules: formattedModules,
    whatStudentsReceive: course.what_students_receive || [],
    learningFormat: course.learning_format || [],
  };
}

