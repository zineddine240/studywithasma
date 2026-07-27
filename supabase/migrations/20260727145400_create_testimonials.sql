CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  band text,
  text text NOT NULL,
  role text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policies

-- Admins can do everything
CREATE POLICY "Admins can manage all testimonials"
ON testimonials
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Students can insert their own
CREATE POLICY "Students can insert their own testimonials"
ON testimonials
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = student_id
);

-- Students can select their own
CREATE POLICY "Students can view their own testimonials"
ON testimonials
FOR SELECT
TO authenticated
USING (
  auth.uid() = student_id
);

-- Public can view published testimonials
CREATE POLICY "Public can view published testimonials"
ON testimonials
FOR SELECT
TO public
USING (
  is_published = true
);

-- Ensure authenticated users can view published testimonials too (sometimes 'public' doesn't cover 'authenticated' depending on configuration, though usually it does if not specified otherwise, but it's safe to be explicit or use 'anon' and 'authenticated')
CREATE POLICY "Authenticated users can view published testimonials"
ON testimonials
FOR SELECT
TO authenticated
USING (
  is_published = true
);
