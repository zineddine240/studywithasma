-- Migration: 20260719132500_enrollment_requests.sql
-- Description: Add fields to profiles and create enrollment_requests table

-- 1. Add fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS enrollment_expiry TIMESTAMP WITH TIME ZONE;

-- 2. Create enrollment_requests table
CREATE TABLE public.enrollment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  current_english_level TEXT,
  target_band TEXT,
  reason TEXT,
  additional_message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.enrollment_requests ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Students can view their own requests
CREATE POLICY "Students can view own requests" 
ON public.enrollment_requests FOR SELECT 
USING (auth.uid() = student_id);

-- Students can insert their own requests
CREATE POLICY "Students can insert own requests" 
ON public.enrollment_requests FOR INSERT 
WITH CHECK (auth.uid() = student_id);

-- Admins/teachers can view all requests
CREATE POLICY "Admins/teachers can view all requests" 
ON public.enrollment_requests FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

-- Admins/teachers can update all requests
CREATE POLICY "Admins/teachers can update all requests" 
ON public.enrollment_requests FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

-- 5. Trigger for updated_at
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

DROP TRIGGER IF EXISTS handle_updated_at ON public.enrollment_requests;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.enrollment_requests
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
