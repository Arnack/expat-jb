-- Create the documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Simple policy: Allow all authenticated users to upload to documents bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Simple policy: Allow all authenticated users to read from documents bucket
CREATE POLICY "Allow authenticated reads" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Simple policy: Allow all authenticated users to update in documents bucket
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Simple policy: Allow all authenticated users to delete from documents bucket
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 