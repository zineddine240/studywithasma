-- Migration: Module Attachments
-- Description: Adds a table for assigning file attachments/resources to modules

CREATE TABLE public.module_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.module_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Module attachments are viewable by enrolled students and admins" ON public.module_attachments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_enrolled = true OR role IN ('admin', 'teacher'))));

CREATE POLICY "Only admins/teachers can manage module attachments" ON public.module_attachments
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));

-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('course_attachments', 'course_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access course_attachments" ON storage.objects FOR SELECT USING (bucket_id = 'course_attachments');
CREATE POLICY "Admin Upload course_attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course_attachments' AND (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))));
CREATE POLICY "Admin Delete course_attachments" ON storage.objects FOR DELETE USING (bucket_id = 'course_attachments' AND (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))));

