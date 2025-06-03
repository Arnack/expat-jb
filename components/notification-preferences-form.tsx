"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { NotificationPreferences, UserRole } from "@/types"

interface NotificationPreferencesFormProps {
  preferences: NotificationPreferences
  userRole: UserRole
}

export function NotificationPreferencesForm({ preferences, userRole }: NotificationPreferencesFormProps) {
  const [formData, setFormData] = useState<NotificationPreferences>(preferences)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = (field: keyof NotificationPreferences) => {
    if (typeof formData[field] === "boolean") {
      setFormData({
        ...formData,
        [field]: !formData[field],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    setError(null)

    try {
      const { error } = await supabase
        .from("notification_preferences")
        .update({
          email_new_applications: formData.email_new_applications,
          email_application_status_updates: formData.email_application_status_updates,
          email_job_matches: formData.email_job_matches,
          email_marketing: formData.email_marketing,
        })
        .eq("user_id", formData.user_id)

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to update notification preferences")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose which emails you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>Your notification preferences have been updated successfully.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {userRole === "employer" && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_new_applications" className="font-medium">
                  New Applications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive an email when someone applies to your job posting
                </p>
              </div>
              <Switch
                id="email_new_applications"
                checked={formData.email_new_applications}
                onCheckedChange={() => handleToggle("email_new_applications")}
              />
            </div>
          )}

          {userRole === "job_seeker" && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_application_status_updates" className="font-medium">
                  Application Status Updates
                </Label>
                <p className="text-sm text-muted-foreground">Receive an email when your application status changes</p>
              </div>
              <Switch
                id="email_application_status_updates"
                checked={formData.email_application_status_updates}
                onCheckedChange={() => handleToggle("email_application_status_updates")}
              />
            </div>
          )}

          {userRole === "job_seeker" && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_job_matches" className="font-medium">
                  Job Matches
                </Label>
                <p className="text-sm text-muted-foreground">Receive emails about new jobs that match your profile</p>
              </div>
              <Switch
                id="email_job_matches"
                checked={formData.email_job_matches}
                onCheckedChange={() => handleToggle("email_job_matches")}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_marketing" className="font-medium">
                Marketing Emails
              </Label>
              <p className="text-sm text-muted-foreground">Receive emails about new features, tips, and promotions</p>
            </div>
            <Switch
              id="email_marketing"
              checked={formData.email_marketing}
              onCheckedChange={() => handleToggle("email_marketing")}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
