"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { Calendar, Clock, AlertTriangle } from "lucide-react"
import type { JobPosting } from "@/types"

interface JobStatusManagerProps {
  job: JobPosting
}

export function JobStatusManager({ job }: JobStatusManagerProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const updateJobStatus = async (newStatus: string) => {
    setIsUpdating(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("job_postings")
        .update({
          status: newStatus,
          ...(newStatus === "published"
            ? {
                published_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              }
            : {}),
        })
        .eq("id", job.id)
        .eq("employer_id", job.employer_id)

      if (error) throw error

      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update job status")
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const isExpired = job.expires_at && new Date(job.expires_at) < new Date()
  const daysRemaining = job.expires_at
    ? Math.max(0, Math.ceil((new Date(job.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Job Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Current Status:</span>
              <Badge className={getStatusColor(job.status)} variant="outline">
                {job.status}
              </Badge>
            </div>
            {job.published_at && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Published on {formatDate(job.published_at)}
              </p>
            )}
            {job.expires_at && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {isExpired ? "Expired on " : "Expires on "} {formatDate(job.expires_at)}
              </p>
            )}
          </div>

          {job.status === "published" && !isExpired && daysRemaining <= 7 && (
            <div className="bg-yellow-50 p-2 rounded-md flex items-center gap-2 text-yellow-800 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{daysRemaining} days remaining</span>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {job.status === "draft" && (
            <Button onClick={() => updateJobStatus("published")} disabled={isUpdating} className="w-full">
              Publish Job
            </Button>
          )}

          {job.status === "published" && (
            <Button variant="outline" onClick={() => updateJobStatus("draft")} disabled={isUpdating} className="w-full">
              Unpublish Job
            </Button>
          )}

          {job.status === "expired" && (
            <Button onClick={() => updateJobStatus("published")} disabled={isUpdating} className="w-full">
              Republish Job
            </Button>
          )}

          {job.status === "published" && isExpired && (
            <Button onClick={() => updateJobStatus("published")} disabled={isUpdating} className="w-full">
              Extend for 30 Days
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            {job.status === "draft"
              ? "Your job is currently in draft mode and not visible to job seekers."
              : job.status === "published" && !isExpired
                ? "Your job is currently published and visible to job seekers."
                : "Your job posting has expired and is no longer visible to job seekers."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
