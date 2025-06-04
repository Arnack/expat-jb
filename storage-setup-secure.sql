-- Create the documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Allow authenticated users to insert their own documents (must include their user ID in filename)
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'cvs'
  AND (regexp_split_to_array((storage.filename(name)), '-'))[1] = auth.uid()::text
);

-- Allow authenticated users to select/view their own documents
CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'cvs'
  AND (regexp_split_to_array((storage.filename(name)), '-'))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own documents
CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'cvs'
  AND (regexp_split_to_array((storage.filename(name)), '-'))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own documents
CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'cvs'
  AND (regexp_split_to_array((storage.filename(name)), '-'))[1] = auth.uid()::text
);

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 