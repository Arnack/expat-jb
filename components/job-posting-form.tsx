"use client"

import { useState } from "react"
import type { JobPosting } from "@/types"
import { JobDescriptionStep } from "@/components/job-posting/job-description-step"
import { JobPreviewStep } from "@/components/job-posting/job-preview-step"
import { JobPublishStep } from "@/components/job-posting/job-publish-step"
import { Progress } from "@/components/ui/progress"

interface JobPostingFormProps {
  onSubmit: (data: Partial<JobPosting>) => Promise<{ success: boolean; jobId?: string; error?: string }>
  initialData?: Partial<JobPosting>
  isEditing?: boolean
}

export function JobPostingForm({ onSubmit, initialData, isEditing = false }: JobPostingFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<JobPosting>>(initialData || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)

  const totalSteps = isEditing ? 2 : 3
  const progress = (step / totalSteps) * 100

  const handleNext = (data: Partial<JobPosting>) => {
    const updatedData = { ...formData, ...data }
    setFormData(updatedData)
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await onSubmit(formData)

      if (result.success) {
        if (result.jobId) {
          setJobId(result.jobId)
        }

        if (!isEditing) {
          setStep(step + 1)
        }
      } else {
        setError(result.error || "Failed to submit job posting")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Progress value={progress} className="h-2" />

      <div className="flex justify-between text-sm text-muted-foreground">
        <span className={step >= 1 ? "font-medium text-foreground" : ""}>Job Details</span>
        <span className={step >= 2 ? "font-medium text-foreground" : ""}>Preview</span>
        {!isEditing && <span className={step >= 3 ? "font-medium text-foreground" : ""}>Publish</span>}
      </div>

      {step === 1 && <JobDescriptionStep onNext={handleNext} initialData={formData} />}

      {step === 2 && (
        <JobPreviewStep
          data={formData}
          onBack={handleBack}
          onNext={isEditing ? handleSubmit : handleNext}
          isSubmitting={isSubmitting}
          error={error}
          isEditing={isEditing}
        />
      )}

      {step === 3 && !isEditing && (
        <JobPublishStep
          jobId={jobId || formData.id}
          jobTitle={formData.title}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </div>
  )
}
