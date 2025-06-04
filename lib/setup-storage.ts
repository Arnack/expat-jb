import { supabase } from "@/lib/supabase/client"

export async function setupStorageBucket() {
  try {
    console.log("Setting up storage bucket...")

    // Try to create the bucket
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('cv-uploads', {
      public: true,
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 1024 * 1024 // 1MB limit
    })

    if (bucketError) {
      // If bucket already exists, that's okay
      if (bucketError.message?.includes('already exists')) {
        console.log("Bucket already exists, continuing...")
      } else {
        console.error("Failed to create bucket:", bucketError)
        throw bucketError
      }
    } else {
      console.log("Bucket created successfully:", bucketData)
    }

    return { success: true }
  } catch (error: any) {
    console.error("Storage setup failed:", error)
    return { success: false, error: error.message }
  }
}

export async function testStorageUpload(file: File, userId: string) {
  try {
    // First try to setup the bucket
    await setupStorageBucket()

    // Create unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `cvs/${fileName}`

    console.log("Testing upload to:", filePath)

    // Upload file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("cv-uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("cv-uploads")
      .getPublicUrl(filePath)

    return { success: true, publicUrl, path: data.path }
  } catch (error: any) {
    console.error("Test upload failed:", error)
    return { success: false, error: error.message }
  }
} 