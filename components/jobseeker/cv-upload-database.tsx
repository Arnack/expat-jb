"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase/client"
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react"

interface CVUploadProps {
  userId: string
  onUpload: (url: string) => void
}

export function CVUploadDatabase({ userId, onUpload }: CVUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
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

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Convert file to base64
      setUploadProgress(25)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setUploadProgress(50)

      // Store the base64 data URL in the existing cv_url field
      const dataUrl = base64 // This is already a complete data URL from FileReader
      
      const { data, error: dbError } = await supabase
        .from("job_seeker_profiles")
        .update({
          cv_url: dataUrl
        })
        .eq("user_id", userId)

      if (dbError) {
        throw dbError
      }

      setUploadProgress(100)
      
      // Return the data URL so it can be used immediately
      onUpload(dataUrl)

    } catch (err: any) {
      console.error("Upload failed:", err)
      setError(err.message || "Failed to upload CV")
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
            <h3 className="text-lg font-medium">{isUploading ? "Uploading your CV..." : "Upload your CV"}</h3>
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Info:</strong> Your CV is stored securely in the database and can be downloaded by employers when you apply for jobs.
        </AlertDescription>
      </Alert>
    </div>
  )
} 