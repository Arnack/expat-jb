import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JobPostingForm } from "@/components/job-posting-form"
import { JobStatusManager } from "@/components/employer/job-status-manager"
import { JobDeleteDialog } from "@/components/employer/job-delete-dialog"
import { ArrowLeft } from "lucide-react"

export default async function EditJobPage({
  params,
}: {
  params: { jobId: string }
}) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Check if user is an employer
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

  if (!profile || profile.role !== "employer") {
    redirect("/jobs")
  }

  // Get job posting and verify ownership
  const { data: job, error: jobError } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", params.jobId)
    .eq("employer_id", session.user.id)
    .single()

  if (jobError || !job) {
    notFound()
  }

  // Get employer profile
  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

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

        <JobPostingForm employerId={session.user.id} employerProfile={employerProfile} existingJob={job} mode="edit" />
      </div>
    </div>
  )
}
