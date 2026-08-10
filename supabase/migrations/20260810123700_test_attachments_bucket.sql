-- Create storage bucket for test attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('test_attachments', 'test_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for test_attachments
CREATE POLICY "Public Access test_attachments" ON storage.objects FOR SELECT USING (bucket_id = 'test_attachments');

CREATE POLICY "Admin Upload test_attachments" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'test_attachments' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')))
);

CREATE POLICY "Admin Delete test_attachments" ON storage.objects FOR DELETE 
USING (
  bucket_id = 'test_attachments' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')))
);

CREATE POLICY "Admin Update test_attachments" ON storage.objects FOR UPDATE
USING (
  bucket_id = 'test_attachments' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')))
);
