-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Anyone can insert contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Only admins/teachers can view contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  ));

CREATE POLICY "Only admins/teachers can update contact submissions" 
  ON public.contact_submissions 
  FOR UPDATE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  ));
