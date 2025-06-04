"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import type { JobPosting } from "@/types"

const jobDescriptionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  salary_from: z.number().optional().nullable(),
  salary_to: z.number().optional().nullable(),
  email_to_apply: z.string().optional().nullable(),
  link_to_apply: z.string().optional().nullable(),
  is_global_remote: z.boolean().default(false),
  is_visa_sponsorship: z.boolean().default(false),
  sphere: z.string().optional().nullable(),
  job_type: z.string().optional().nullable(),
  experience_level: z.string().optional().nullable(),
  languages: z.array(z.string()).optional().nullable(),
})

type JobDescriptionFormValues = z.infer<typeof jobDescriptionSchema>

// Constants for dropdown options
const JOB_CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "design", label: "Design" },
  { value: "customer_support", label: "Customer Support" },
  { value: "finance", label: "Finance" },
  { value: "human_resources", label: "Human Resources" },
  { value: "operations", label: "Operations" },
  { value: "product", label: "Product Management" },
  { value: "engineering", label: "Engineering" },
  { value: "data", label: "Data Science" },
  { value: "content", label: "Content Writing" },
  { value: "legal", label: "Legal" },
  { value: "consulting", label: "Consulting" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
]

const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
]

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "executive", label: "Executive" },
]

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "russian", label: "Russian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "arabic", label: "Arabic" },
  { value: "hindi", label: "Hindi" },
  { value: "dutch", label: "Dutch" },
  { value: "italian", label: "Italian" },
  { value: "korean", label: "Korean" },
  { value: "swedish", label: "Swedish" },
  { value: "turkish", label: "Turkish" },
]

interface JobDescriptionStepProps {
  onNext: (data: Partial<JobPosting>) => void
  initialData?: Partial<JobPosting>
}

export function JobDescriptionStep({ onNext, initialData }: JobDescriptionStepProps) {
  const [applicationMethod, setApplicationMethod] = useState<"email" | "link">(
    initialData?.email_to_apply ? "email" : "link",
  )

  const form = useForm<JobDescriptionFormValues>({
    resolver: zodResolver(jobDescriptionSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      country: initialData?.country || "",
      city: initialData?.city || "",
      salary_from: initialData?.salary_from || null,
      salary_to: initialData?.salary_to || null,
      email_to_apply: initialData?.email_to_apply || "",
      link_to_apply: initialData?.link_to_apply || "",
      is_global_remote: initialData?.is_global_remote || false,
      is_visa_sponsorship: initialData?.is_visa_sponsorship || false,
      sphere: initialData?.sphere || "",
      job_type: initialData?.job_type || "",
      experience_level: initialData?.experience_level || "",
      languages: initialData?.languages || [],
    },
  })

  const { register, handleSubmit, formState, setValue, watch } = form
  const { errors } = formState

  const handleFormSubmit = (data: JobDescriptionFormValues) => {
    console.log("Form submitted with data:", data)
    console.log("Application method:", applicationMethod)
    console.log("Form errors:", errors)
    
    // Validate application method
    if (applicationMethod === "email") {
      if (!data.email_to_apply || data.email_to_apply.trim() === "") {
        console.log("Email validation failed: empty")
        form.setError("email_to_apply", { message: "Email is required" })
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email_to_apply)) {
        console.log("Email validation failed: invalid format")
        form.setError("email_to_apply", { message: "Invalid email format" })
        return
      }
      data.link_to_apply = null
    } else {
      if (!data.link_to_apply || data.link_to_apply.trim() === "") {
        console.log("Link validation failed: empty")
        form.setError("link_to_apply", { message: "Application URL is required" })
        return
      }
      try {
        new URL(data.link_to_apply)
      } catch {
        console.log("Link validation failed: invalid URL")
        form.setError("link_to_apply", { message: "Invalid URL format" })
        return
      }
      data.email_to_apply = null
    }

    console.log("Validation passed, calling onNext")
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" {...register("title")} placeholder="e.g. Senior Frontend Developer" />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="sphere">Job Category</Label>
              <Select value={watch("sphere") || ""} onValueChange={(value) => setValue("sphere", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="job_type">Job Type</Label>
              <Select value={watch("job_type") || ""} onValueChange={(value) => setValue("job_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select
                value={watch("experience_level") || ""}
                onValueChange={(value) => setValue("experience_level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="languages">Required Languages</Label>
              <MultiSelect
                options={LANGUAGES}
                selected={watch("languages") || []}
                onChange={(selected) => setValue("languages", selected)}
                placeholder="Select languages"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} placeholder="e.g. United States" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} placeholder="e.g. San Francisco" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary_from">Salary From (USD)</Label>
                <Input
                  id="salary_from"
                  type="number"
                  {...register("salary_from", { valueAsNumber: true })}
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <Label htmlFor="salary_to">Salary To (USD)</Label>
                <Input
                  id="salary_to"
                  type="number"
                  {...register("salary_to", { valueAsNumber: true })}
                  placeholder="e.g. 80000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_global_remote"
                  checked={watch("is_global_remote")}
                  onCheckedChange={(checked) => setValue("is_global_remote", checked === true)}
                />
                <Label htmlFor="is_global_remote">This job is remote</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_visa_sponsorship"
                  checked={watch("is_visa_sponsorship")}
                  onCheckedChange={(checked) => setValue("is_visa_sponsorship", checked === true)}
                />
                <Label htmlFor="is_visa_sponsorship">This job offers visa sponsorship</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={10}
                placeholder="Describe the job responsibilities, requirements, benefits, etc."
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label>Application Method</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="email"
                    name="applicationMethod"
                    checked={applicationMethod === "email"}
                    onChange={() => setApplicationMethod("email")}
                  />
                  <Label htmlFor="email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="link"
                    name="applicationMethod"
                    checked={applicationMethod === "link"}
                    onChange={() => setApplicationMethod("link")}
                  />
                  <Label htmlFor="link">External Link</Label>
                </div>
              </div>

              {applicationMethod === "email" ? (
                <div>
                  <Label htmlFor="email_to_apply">Email to Receive Applications *</Label>
                  <Input
                    id="email_to_apply"
                    type="email"
                    {...register("email_to_apply")}
                    placeholder="e.g. careers@company.com"
                    required
                  />
                  {errors.email_to_apply && (
                    <p className="text-sm text-destructive mt-1">{errors.email_to_apply.message}</p>
                  )}
                </div>
              ) : (
                <div>
                  <Label htmlFor="link_to_apply">Application URL *</Label>
                  <Input
                    id="link_to_apply"
                    {...register("link_to_apply")}
                    placeholder="e.g. https://company.com/careers/job-123"
                    required
                  />
                  {errors.link_to_apply && (
                    <p className="text-sm text-destructive mt-1">{errors.link_to_apply.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Continue to Preview</Button>
      </div>
    </form>
  )
}
