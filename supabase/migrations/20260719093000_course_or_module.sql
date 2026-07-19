-- Migration: 20260719093000_course_or_module.sql
-- Description: Adds course_id to recorded_lessons and live_classes, and enforces either/or constraint

-- 1. Add course_id to recorded_lessons
ALTER TABLE public.recorded_lessons
ADD COLUMN course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;

-- Add CHECK constraint
ALTER TABLE public.recorded_lessons
ADD CONSTRAINT check_course_or_module_recorded_lessons CHECK (
  (module_id IS NOT NULL AND course_id IS NULL) OR 
  (module_id IS NULL AND course_id IS NOT NULL) OR 
  (module_id IS NULL AND course_id IS NULL)
);

-- 2. Add course_id to live_classes
ALTER TABLE public.live_classes
ADD COLUMN course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;

-- Add CHECK constraint
ALTER TABLE public.live_classes
ADD CONSTRAINT check_course_or_module_live_classes CHECK (
  (module_id IS NOT NULL AND course_id IS NULL) OR 
  (module_id IS NULL AND course_id IS NOT NULL) OR 
  (module_id IS NULL AND course_id IS NULL)
);
