-- Migration: 20260801000000_add_cohorts.sql
-- Description: Create cohort management tables, update existing tables, and add RLS policies.

-- 1. Create cohorts table
CREATE TABLE IF NOT EXISTS public.cohorts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  course_type TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_students INTEGER NOT NULL DEFAULT 20,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'full', 'closed', 'active', 'completed', 'cancelled')),
  is_visible_for_registration BOOLEAN NOT NULL DEFAULT false,
  google_meet_url TEXT,
  zoom_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for cohorts updated_at
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;
CREATE TRIGGER handle_cohorts_updated_at BEFORE UPDATE ON public.cohorts
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- 2. Create cohort_schedules table
CREATE TABLE IF NOT EXISTS public.cohort_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create student_cohort_assignments table
CREATE TABLE IF NOT EXISTS public.student_cohort_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.enrollment_requests(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'suspended')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, cohort_id)
);

-- 4. Update enrollment_requests table
ALTER TABLE public.enrollment_requests
ADD COLUMN IF NOT EXISTS requested_cohort_id UUID REFERENCES public.cohorts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_cohort_id UUID REFERENCES public.cohorts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS cohort_assignment_status TEXT CHECK (cohort_assignment_status IN ('requested', 'approved', 'waiting_list', 'rejected', 'reassigned'));

-- 5. Update live_classes table
ALTER TABLE public.live_classes
ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE;

-- 6. Update recorded_lessons and create join table
ALTER TABLE public.recorded_lessons
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS access_scope TEXT DEFAULT 'all-course-students' CHECK (access_scope IN ('all-course-students', 'specific-cohorts')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));

CREATE TABLE IF NOT EXISTS public.recorded_lesson_cohorts (
  lesson_id UUID NOT NULL REFERENCES public.recorded_lessons(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  PRIMARY KEY (lesson_id, cohort_id)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Cohorts
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
-- Anyone can see visible cohorts
CREATE POLICY "Public can view visible cohorts" ON public.cohorts FOR SELECT USING (is_visible_for_registration = true);
-- Admins/teachers can manage cohorts
CREATE POLICY "Admins/teachers can manage cohorts" ON public.cohorts 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));
-- Students can see their assigned cohorts
CREATE POLICY "Students can view assigned cohorts" ON public.cohorts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.student_cohort_assignments WHERE student_id = auth.uid() AND cohort_id = public.cohorts.id AND status = 'active'));

-- Cohort Schedules
ALTER TABLE public.cohort_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view schedules of visible cohorts" ON public.cohort_schedules FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.cohorts WHERE id = cohort_id AND is_visible_for_registration = true));
CREATE POLICY "Admins/teachers can manage cohort schedules" ON public.cohort_schedules 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));
CREATE POLICY "Students can view assigned cohort schedules" ON public.cohort_schedules FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.student_cohort_assignments WHERE student_id = auth.uid() AND cohort_id = public.cohort_schedules.cohort_id AND status = 'active'));

-- Student Cohort Assignments
ALTER TABLE public.student_cohort_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own assignments" ON public.student_cohort_assignments FOR SELECT 
  USING (auth.uid() = student_id);
CREATE POLICY "Admins/teachers can manage assignments" ON public.student_cohort_assignments 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

-- Recorded Lesson Cohorts
ALTER TABLE public.recorded_lesson_cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view lesson cohorts if assigned" ON public.recorded_lesson_cohorts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.student_cohort_assignments WHERE student_id = auth.uid() AND cohort_id = public.recorded_lesson_cohorts.cohort_id AND status = 'active'));
CREATE POLICY "Admins/teachers can manage lesson cohorts" ON public.recorded_lesson_cohorts
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));
