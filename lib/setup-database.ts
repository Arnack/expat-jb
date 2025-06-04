import { supabase } from "@/lib/supabase/client"

export async function setupCVFilesTable() {
  try {
    console.log("Setting up cv_files table...")

    // Try to create the table using a SQL query
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS cv_files (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        filename TEXT NOT NULL,
        file_data TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create RLS policies
      ALTER TABLE cv_files ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY IF NOT EXISTS "Users can insert their own CV files" ON cv_files
      FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY IF NOT EXISTS "Users can view their own CV files" ON cv_files
      FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY IF NOT EXISTS "Users can update their own CV files" ON cv_files
      FOR UPDATE USING (auth.uid() = user_id);
      
      CREATE POLICY IF NOT EXISTS "Users can delete their own CV files" ON cv_files
      FOR DELETE USING (auth.uid() = user_id);
    `

    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableQuery })

    if (error) {
      console.error("Failed to create table:", error)
      throw error
    }

    console.log("Table setup successful")
    return { success: true }
  } catch (error: any) {
    console.error("Database setup failed:", error)
    return { success: false, error: error.message }
  }
}

export async function testDatabaseConnection() {
  try {
    // Test if we can access existing tables
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id")
      .limit(1)

    if (error) {
      throw error
    }

    return { success: true, message: "Database connection successful" }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
} 