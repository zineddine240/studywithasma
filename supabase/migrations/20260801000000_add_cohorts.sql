-- Migration: 20260801000000_add_cohorts.sql
-- Description: Simplified Cohort Management for Group Live Classes

-- 1. Create cohorts table (tied to a course)
CREATE TABLE IF NOT EXISTS public.cohorts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  max_students INTEGER NOT NULL DEFAULT 20,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'full', 'active', 'completed', 'cancelled')),
  whatsapp_group_url TEXT,
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
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, cohort_id)
);

-- 4. Add cohort_id to live_classes table
ALTER TABLE public.live_classes
ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Cohorts
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and teachers can manage cohorts" ON public.cohorts 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

CREATE POLICY "Students can view their assigned cohort" ON public.cohorts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.student_cohort_assignments WHERE student_id = auth.uid() AND cohort_id = public.cohorts.id AND status = 'active'));

-- Cohort Schedules
ALTER TABLE public.cohort_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and teachers can manage schedules" ON public.cohort_schedules 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

CREATE POLICY "Students can view their cohort schedule" ON public.cohort_schedules FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.student_cohort_assignments WHERE student_id = auth.uid() AND cohort_id = public.cohort_schedules.cohort_id AND status = 'active'));

-- Student Cohort Assignments
ALTER TABLE public.student_cohort_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and teachers can manage assignments" ON public.student_cohort_assignments 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

CREATE POLICY "Students can view their assignments" ON public.student_cohort_assignments FOR SELECT 
  USING (auth.uid() = student_id);

-- Live Classes
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and teachers can manage live classes" ON public.live_classes
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

CREATE POLICY "Students view live classes for their assigned cohort" ON public.live_classes FOR SELECT
  USING (
    cohort_id IN (
      SELECT cohort_id FROM public.student_cohort_assignments 
      WHERE student_id = auth.uid() AND status = 'active'
    )
  );
