"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { applyToJob } from "@/app/actions/application"
import { Mail, FileText, Upload, MapPin, Building2, Globe, DollarSign, Clock, X, Check } from "lucide-react"
import type { JobPosting } from "@/types"

interface ApplicationModalProps {
  job: JobPosting
  children: React.ReactNode
}

export function ApplicationModal({ job, children }: ApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a PDF or Word document")
        return
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }
      
      setSelectedFile(file)
      setError(null)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Note: For now, we're using the existing applyToJob function
      // In a full implementation, you'd want to handle file upload here
      const result = await applyToJob(job.id, coverLetter)
      
      if (result.success) {
        setSuccess(true)
        // Close modal after a short delay
        setTimeout(() => {
          setIsOpen(false)
          setSuccess(false)
          setCoverLetter("")
          setSelectedFile(null)
        }, 2000)
      } else {
        setError(result.error || "Failed to submit application")
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatSalary = (salaryFrom: number | null, salaryTo: number | null) => {
    if (salaryFrom && salaryTo) {
      return `$${salaryFrom.toLocaleString()} - $${salaryTo.toLocaleString()}`
    } else if (salaryFrom) {
      return `From $${salaryFrom.toLocaleString()}`
    } else if (salaryTo) {
      return `Up to $${salaryTo.toLocaleString()}`
    }
    return null
  }

  const getLocation = () => {
    if (job.is_global_remote) {
      return "Remote (Worldwide)"
    } else if (job.city && job.country) {
      return `${job.city}, ${job.country}`
    } else if (job.country) {
      return job.country
    }
    return "Location not specified"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for Position</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground">
                Your application has been sent to the employer. They will review it and get back to you soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Job Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{job.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{job.employer_profiles?.company_name || "Company"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{getLocation()}</span>
                </div>

                {formatSalary(job.salary_from, job.salary_to) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatSalary(job.salary_from, job.salary_to)}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {job.is_global_remote && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Remote
                    </Badge>
                  )}
                  {job.is_visa_sponsorship && (
                    <Badge variant="outline" className="bg-primary/10">
                      Visa Sponsorship
                    </Badge>
                  )}
                  {job.job_type && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.job_type.replace("_", " ")}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* CV Upload */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Attach Your CV</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Upload your latest CV (PDF or Word document, max 5MB)
                        </p>
                        
                        {selectedFile ? (
                          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <Check className="h-4 w-4 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                              <p className="text-xs text-green-600">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="text-green-600 hover:text-green-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Click to upload your CV
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isSubmitting}
                            >
                              Choose File
                            </Button>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Message</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Write a brief message to introduce yourself and explain why you're interested in this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Optional but recommended. A good cover message can help you stand out.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 