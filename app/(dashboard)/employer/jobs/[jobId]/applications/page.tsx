import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ApplicationsManager } from "@/components/employer/applications-manager"

export default async function JobApplicationsPage({
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

  // Get applications for this job with applicant details
  const { data: applications } = await supabase
    .from("job_applications")
    .select(
      `
      *,
      job_seeker_profiles (
        user_id,
        cv_url,
        headline,
        summary,
        location,
        user_profiles (
          full_name
        )
      )
    `,
    )
    .eq("job_id", params.jobId)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-6">
      <ApplicationsManager job={job} applications={applications || []} />
    </div>
  )
}
