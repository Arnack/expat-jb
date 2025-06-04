"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { JobPostingForm } from "@/components/job-posting-form"
import { JobStatusManager } from "@/components/employer/job-status-manager"
import { JobDeleteDialog } from "@/components/employer/job-delete-dialog"
import { updateJob } from "@/app/actions/job"
import { ArrowLeft } from "lucide-react"

export default function EditJobPage({
  params,
}: {
  params: { jobId: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [job, setJob] = useState<any>(null)
  const [employerProfile, setEmployerProfile] = useState<any>(null)

  useEffect(() => {
    const loadEditPageData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.replace("/auth/login")
          return
        }

        // Check if user is an employer
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (!profile || profile.role !== "employer") {
          router.replace("/jobs")
          return
        }

        // Get job posting and verify ownership
        const { data: jobData, error: jobError } = await supabase
          .from("job_postings")
          .select("*")
          .eq("id", params.jobId)
          .eq("employer_id", session.user.id)
          .single()

        if (jobError || !jobData) {
          router.replace("/employer/dashboard")
          return
        }

        // Get employer profile
        const { data: empProfile } = await supabase
          .from("employer_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        setSession(session)
        setJob(jobData)
        setEmployerProfile(empProfile)
      } catch (error) {
        console.error('Edit job page data loading failed:', error)
        router.replace("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    loadEditPageData()
  }, [router, params.jobId])

  const handleJobUpdate = async (data: any) => {
    const result = await updateJob(params.jobId, data)
    return result
  }

  if (loading) {
    return (
      <div className="container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || !job) {
    return null
  }

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/employer/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Edit Job Posting</h1>
            <p className="text-muted-foreground">Update your job posting details</p>
          </div>
          <JobDeleteDialog jobId={job.id} jobTitle={job.title} />
        </div>

        {/* Job Status Manager */}
        <div className="mb-6">
          <JobStatusManager job={job} />
        </div>

        <JobPostingForm onSubmit={handleJobUpdate} initialData={job} isEditing={true} />
      </div>
    </div>
  )
}
