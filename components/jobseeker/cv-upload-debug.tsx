"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase/client"
import { setupStorageBucket } from "@/lib/setup-storage"
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react"

interface CVUploadProps {
  userId: string
  onUpload: (url: string) => void
}

export function CVUploadDebug({ userId, onUpload }: CVUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed"
    }

    // Check file size (500KB = 500 * 1024 bytes)
    const maxSize = 500 * 1024
    if (file.size > maxSize) {
      return "File size must be less than 500KB"
    }

    return null
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)
    setDebugInfo("")

    try {
      // Debug: Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      let debugLog = `=== DEBUG INFO ===\n`
      debugLog += `File: ${file.name} (${file.size} bytes)\n`
      debugLog += `User ID: ${userId}\n`
      debugLog += `Session exists: ${session ? 'YES' : 'NO'}\n`
      
      if (sessionError) {
        debugLog += `Session error: ${sessionError.message}\n`
      }
      
      if (session) {
        debugLog += `Auth user ID: ${session.user.id}\n`
        debugLog += `User IDs match: ${session.user.id === userId ? 'YES' : 'NO'}\n`
      }
      
      setDebugInfo(debugLog)

      if (!session) {
        throw new Error("Not authenticated - please log in again")
      }

      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `cvs/${fileName}`

      debugLog += `File path: ${filePath}\n`
      setDebugInfo(debugLog)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Setup storage bucket first
      debugLog += `Setting up storage bucket...\n`
      setDebugInfo(debugLog)
      
      const setupResult = await setupStorageBucket()
      if (!setupResult.success) {
        debugLog += `Bucket setup failed: ${setupResult.error}\n`
        setDebugInfo(debugLog)
      } else {
        debugLog += `Bucket setup successful\n`
        setDebugInfo(debugLog)
      }

      // Upload file to Supabase Storage
      console.log("Attempting upload to:", filePath)
      console.log("Session user:", session.user.id)
      console.log("Provided userId:", userId)
      
      debugLog += `Attempting upload...\n`
      setDebugInfo(debugLog)
      
      const { data, error: uploadError } = await supabase.storage.from("cv-uploads").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      clearInterval(progressInterval)

      if (uploadError) {
        debugLog += `Upload error: ${uploadError.message}\n`
        setDebugInfo(debugLog)
        console.error("Upload error details:", uploadError)
        throw uploadError
      }

      debugLog += `Upload successful!\n`
      debugLog += `Storage path: ${data.path}\n`
      setDebugInfo(debugLog)

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("cv-uploads").getPublicUrl(filePath)

      debugLog += `Public URL: ${publicUrl}\n`
      setDebugInfo(debugLog)

      setUploadProgress(100)
      onUpload(publicUrl)
    } catch (err: any) {
      console.error("Upload failed:", err)
      setError(err.message || "Failed to upload CV")
      
      let errorDebug = debugInfo
      errorDebug += `\nERROR: ${err.message}\n`
      if (err.statusCode) {
        errorDebug += `Status Code: ${err.statusCode}\n`
      }
      setDebugInfo(errorDebug)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        } ${isUploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          {isUploading ? (
            <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
          ) : (
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-medium">{isUploading ? "Uploading your CV..." : "Upload your CV (Debug Mode)"}</h3>
            <p className="text-sm text-muted-foreground">
              {isUploading
                ? "Please wait while we upload your file"
                : "Drag and drop your PDF file here, or click to browse"}
            </p>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              <p className="text-xs text-muted-foreground">{uploadProgress}% uploaded</p>
            </div>
          )}

          {!isUploading && (
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>PDF only</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Max 500KB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isUploading && (
        <div className="text-center">
          <Button type="button" variant="outline" onClick={handleClick}>
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      )}

      {debugInfo && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
} 