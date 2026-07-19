-- Migration: 0002_seed_courses.sql
-- Description: Seeds the database with the initial Academic and General IELTS courses and their modules.

-- Insert Academic IELTS Course
INSERT INTO public.courses (id, slug, title, badge, short_description, who_is_it_for, what_students_receive, learning_format)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'academic-ielts',
  'Academic IELTS',
  'Academic',
  'Prepare for university and academic purposes through structured lessons in Listening, Reading, Writing, and Speaking.',
  'For students preparing for university admission, higher education, or academic purposes.',
  '["Live online classes", "Recorded lessons", "PDF materials", "Homework", "Teacher feedback", "Progress tracking"]'::jsonb,
  '["Zoom or Google Meet classes", "Recorded sessions", "Structured modules", "Personal guidance from Asma"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Insert General IELTS Course
INSERT INTO public.courses (id, slug, title, badge, short_description, who_is_it_for, what_students_receive, learning_format)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'general-ielts',
  'General IELTS',
  'General',
  'Prepare for work, migration, and everyday English communication through practical IELTS training.',
  'For learners preparing for work, migration, or everyday communication purposes.',
  '["Live online classes", "Recorded lessons", "PDF materials", "Homework", "Teacher feedback", "Progress tracking"]'::jsonb,
  '["Zoom or Google Meet classes", "Recorded sessions", "Structured modules", "Personal guidance from Asma"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Insert Academic Modules
INSERT INTO public.modules (course_id, number, name, description, slug) VALUES 
('11111111-1111-1111-1111-111111111111', 1, 'Introduction', 'Understand the IELTS Academic exam format, scoring system, and effective study strategies to build a strong foundation.', 'introduction'),
('11111111-1111-1111-1111-111111111111', 2, 'Listening', 'Develop listening skills through academic lectures, conversations, and practice tests with timed exercises.', 'listening'),
('11111111-1111-1111-1111-111111111111', 3, 'Reading', 'Master academic reading passages, learn skimming and scanning techniques, and practice answering all question types.', 'reading'),
('11111111-1111-1111-1111-111111111111', 4, 'Writing', 'Learn how to write Task 1 reports and Task 2 essays with clear structure, academic vocabulary, and coherence.', 'writing'),
('11111111-1111-1111-1111-111111111111', 5, 'Speaking', 'Practice all three parts of the speaking test with guided exercises, sample answers, and fluency strategies.', 'speaking')
ON CONFLICT (course_id, number) DO NOTHING;

-- Insert General Modules
INSERT INTO public.modules (course_id, number, name, description, slug) VALUES 
('22222222-2222-2222-2222-222222222222', 1, 'Introduction', 'Learn about the General IELTS exam structure, assessment criteria, and how to plan your preparation effectively.', 'introduction'),
('22222222-2222-2222-2222-222222222222', 2, 'Listening', 'Practice with everyday conversations, workplace scenarios, and social context audio to sharpen your listening accuracy.', 'listening'),
('22222222-2222-2222-2222-222222222222', 3, 'Reading', 'Work through practical reading passages from advertisements, manuals, and workplace documents with targeted strategies.', 'reading'),
('22222222-2222-2222-2222-222222222222', 4, 'Writing', 'Learn to write Task 1 letters and Task 2 essays with appropriate tone, structure, and everyday vocabulary.', 'writing'),
('22222222-2222-2222-2222-222222222222', 5, 'Speaking', 'Build confidence for all three speaking parts through real-life topics, pronunciation practice, and mock interviews.', 'speaking')
ON CONFLICT (course_id, number) DO NOTHING;
