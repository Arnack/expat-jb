"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { JobPosting } from "@/types"

interface JobPreviewStepProps {
  data: Partial<JobPosting>
  onBack: () => void
  onNext: () => void
  isSubmitting?: boolean
  error?: string | null
  isEditing?: boolean
}

export function JobPreviewStep({
  data,
  onBack,
  onNext,
  isSubmitting = false,
  error = null,
  isEditing = false,
}: JobPreviewStepProps) {
  // Format the job description with proper line breaks
  const formattedDescription = data.description?.split("\n").map((line, i) => (
    <p key={i} className={line === "" ? "my-4" : "my-2"}>
      {line}
    </p>
  ))

  // Map job type to display format
  const getJobTypeDisplay = (jobType: string | null | undefined) => {
    if (!jobType) return null

    const typeMap: Record<string, string> = {
      full_time: "Full-time",
      part_time: "Part-time",
      contract: "Contract",
      freelance: "Freelance",
      internship: "Internship",
    }

    return typeMap[jobType] || jobType
  }

  // Map experience level to display format
  const getExperienceLevelDisplay = (level: string | null | undefined) => {
    if (!level) return null

    const levelMap: Record<string, string> = {
      entry: "Entry Level",
      mid: "Mid Level",
      senior: "Senior Level",
      executive: "Executive",
    }

    return levelMap[level] || level
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{data.title}</h2>

            <div className="flex flex-wrap gap-2 mt-2">
              {data.is_global_remote && <Badge variant="outline">Remote</Badge>}
              {data.is_visa_sponsorship && (
                <Badge variant="outline" className="bg-primary/10">
                  Visa Sponsorship
                </Badge>
              )}
              {data.country && (
                <Badge variant="outline">{data.city ? `${data.city}, ${data.country}` : data.country}</Badge>
              )}
              {data.job_type && <Badge variant="outline">{getJobTypeDisplay(data.job_type)}</Badge>}
              {data.experience_level && (
                <Badge variant="outline">{getExperienceLevelDisplay(data.experience_level)}</Badge>
              )}
              {data.sphere && <Badge variant="outline">{data.sphere}</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.salary_from || data.salary_to) && (
              <div>
                <p className="text-sm font-medium">Salary Range</p>
                <p>
                  {data.salary_from && data.salary_to
                    ? `$${data.salary_from.toLocaleString()} - $${data.salary_to.toLocaleString()}`
                    : data.salary_from
                      ? `From $${data.salary_from.toLocaleString()}`
                      : `Up to $${data.salary_to?.toLocaleString()}`}
                </p>
              </div>
            )}
          </div>

          {data.languages && data.languages.length > 0 && (
            <div>
              <p className="text-sm font-medium">Required Languages</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.languages.map((language) => (
                  <Badge key={language} variant="secondary">
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">Job Description</h3>
            <div className="prose max-w-none dark:prose-invert">{formattedDescription}</div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 p-6">
          <div className="w-full">
            <p className="font-medium mb-2">Application Method</p>
            {data.email_to_apply ? (
              <p>
                Candidates will apply via email to: <span className="font-medium">{data.email_to_apply}</span>
              </p>
            ) : data.link_to_apply ? (
              <p>
                Candidates will apply via external link: <span className="font-medium">{data.link_to_apply}</span>
              </p>
            ) : (
              <p className="text-destructive">No application method provided</p>
            )}
          </div>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Edit
        </Button>
        <Button onClick={onNext} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Continue to Publish"}
        </Button>
      </div>
    </div>
  )
}
