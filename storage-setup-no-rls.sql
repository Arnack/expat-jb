-- Create the documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- TEMPORARILY DISABLE RLS (for testing only!)
-- This removes all security - DO NOT use in production
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean slate
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects; 