-- Create the documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to insert their own documents
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'cvs'
);

-- Allow authenticated users to select/view their own documents
CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'cvs'
);

-- Allow authenticated users to update their own documents
CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'cvs'
);

-- Allow authenticated users to delete their own documents
CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'cvs'
);

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 