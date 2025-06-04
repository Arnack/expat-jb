"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, ArrowLeft, Loader2 } from "lucide-react"

interface JobPublishStepProps {
  jobId?: string | null
  jobTitle?: string
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
  error: string | null
}

export function JobPublishStep({ jobId, jobTitle, onBack, onSubmit, isSubmitting, error }: JobPublishStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Publish Your Job</h2>
        <p className="text-muted-foreground">Your job posting is ready to be published</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Free Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">What you get:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Job posted for 30 days</li>
                <li>• Basic listing visibility</li>
                <li>• Applicant tracking</li>
                <li>• Email notifications</li>
              </ul>
            </div>
            
            {jobTitle && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Job Title:</strong> {jobTitle}
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Preview
              </Button>
              <Button onClick={onSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Job for Free"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
