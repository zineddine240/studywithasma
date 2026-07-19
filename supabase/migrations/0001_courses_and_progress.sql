-- Migration: 0001_courses_and_progress.sql
-- Description: Adds tables for Courses, Modules, and Lesson Progress. Updates existing tables to link to modules.

-- 1. Courses Table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  badge TEXT NOT NULL,
  short_description TEXT NOT NULL,
  who_is_it_for TEXT NOT NULL,
  what_students_receive JSONB NOT NULL DEFAULT '[]'::jsonb,
  learning_format JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are viewable by everyone." ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins/teachers can manage courses." ON public.courses
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

-- 2. Modules Table
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  number INT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (course_id, number)
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules are viewable by everyone." ON public.modules FOR SELECT USING (true);
CREATE POLICY "Admins/teachers can manage modules." ON public.modules
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

-- 3. Add module_id to live_classes
ALTER TABLE public.live_classes
ADD COLUMN module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL;

-- 4. Add module_id and duration to recorded_lessons
ALTER TABLE public.recorded_lessons
ADD COLUMN module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
ADD COLUMN duration TEXT;

-- 5. Add course fields to profiles
ALTER TABLE public.profiles
ADD COLUMN enrolled_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
ADD COLUMN target_band TEXT,
ADD COLUMN group_name TEXT;

-- 6. Lesson Progress Table
CREATE TABLE public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.recorded_lessons(id) ON DELETE CASCADE,
  progress_percent INT DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  is_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (student_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admins/teachers can view all progress" ON public.lesson_progress FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));
CREATE POLICY "Students can update own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = student_id);
