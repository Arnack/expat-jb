-- Create a new bucket with a different name
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-uploads', 'cv-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Simple policy for the new bucket: Allow all authenticated users
CREATE POLICY "Allow authenticated uploads to cv-uploads" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'cv-uploads' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated reads from cv-uploads" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'cv-uploads' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated updates to cv-uploads" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'cv-uploads' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated deletes from cv-uploads" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'cv-uploads' 
  AND auth.role() = 'authenticated'
);

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 