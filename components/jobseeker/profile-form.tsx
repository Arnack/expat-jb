"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { Loader2, FileText, Download, Trash2, User, MapPin, Briefcase } from "lucide-react"
import type { UserProfile, JobSeekerProfile } from "@/types"
import { CVUpload } from "@/components/jobseeker/cv-upload"

interface JobSeekerProfileFormProps {
  userId: string
  userEmail: string
  userProfile: UserProfile | null
  jobSeekerProfile: JobSeekerProfile | null
}

export function JobSeekerProfileForm({ userId, userEmail, userProfile, jobSeekerProfile }: JobSeekerProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [fullName, setFullName] = useState(userProfile?.full_name || "")
  const [headline, setHeadline] = useState(jobSeekerProfile?.headline || "")
  const [summary, setSummary] = useState(jobSeekerProfile?.summary || "")
  const [location, setLocation] = useState(jobSeekerProfile?.location || "")
  const [cvUrl, setCvUrl] = useState(jobSeekerProfile?.cv_url || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Update user profile
      const { error: userProfileError } = await supabase
        .from("user_profiles")
        .update({
          full_name: fullName,
        })
        .eq("id", userId)

      if (userProfileError) throw userProfileError

      // Update job seeker profile
      const { error: jobSeekerError } = await supabase.from("job_seeker_profiles").upsert({
        user_id: userId,
        headline,
        summary,
        location,
        cv_url: cvUrl,
      })

      if (jobSeekerError) throw jobSeekerError

      setSuccess("Profile updated successfully!")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCVUpload = (url: string) => {
    setCvUrl(url)
  }

  const handleCVRemove = () => {
    setCvUrl("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name *</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={userEmail} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Berlin, Germany"
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">Your current location or preferred work location</p>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Professional Headline</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Frontend Developer | React & TypeScript Expert"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              A brief, compelling headline that summarizes your expertise ({headline.length}/100)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a brief summary of your experience, skills, and what you're looking for in your next role..."
              className="min-h-[120px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              Describe your background and career goals ({summary.length}/1000)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CV Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV/Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cvUrl ? (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">CV Uploaded</p>
                  <p className="text-sm text-muted-foreground">Your CV is ready for applications</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => window.open(cvUrl, "_blank")}>
                  <Download className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleCVRemove}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <CVUpload userId={userId} onUpload={handleCVUpload} />
          )}

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">CV Guidelines</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Upload a PDF file (max 500KB)</li>
              <li>• Include your contact information</li>
              <li>• Highlight relevant experience and skills</li>
              <li>• Keep it concise and well-formatted</li>
              <li>• Update regularly to reflect your latest experience</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completeness */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Basic Information</span>
              <Badge variant={fullName ? "default" : "secondary"}>{fullName ? "Complete" : "Incomplete"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Professional Headline</span>
              <Badge variant={headline ? "default" : "secondary"}>{headline ? "Complete" : "Incomplete"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Professional Summary</span>
              <Badge variant={summary ? "default" : "secondary"}>{summary ? "Complete" : "Incomplete"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">CV/Resume</span>
              <Badge variant={cvUrl ? "default" : "secondary"}>{cvUrl ? "Complete" : "Incomplete"}</Badge>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Tip:</strong> Complete profiles get 3x more views from employers. Make sure to fill out all
              sections and upload your CV.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/jobs")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </form>
  )
}
