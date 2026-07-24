-- Migration: Add Bunny Stream columns to recorded_lessons
-- Description: Supports secure direct edge uploads by saving Bunny stream IDs and encoding status.

ALTER TABLE public.recorded_lessons
ADD COLUMN video_provider text DEFAULT 'external',
ADD COLUMN bunny_library_id text,
ADD COLUMN bunny_video_id text,
ADD COLUMN video_status text DEFAULT 'ready';
