import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ApplicationsList } from "@/components/jobseeker/applications-list"

export default async function JobSeekerApplicationsPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Check if user is a job seeker
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

  if (!profile || profile.role !== "job_seeker") {
    redirect("/employer/dashboard")
  }

  // Get user's applications with job details
  const { data: applications } = await supabase
    .from("job_applications")
    .select(
      `
      *,
      job_postings (
        id,
        title,
        country,
        city,
        is_global_remote,
        is_visa_sponsorship,
        salary_from,
        salary_to,
        sphere,
        published_at,
        employer_profiles (
          company_name,
          company_website
        )
      )
    `,
    )
    .eq("applicant_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track the status of all your job applications</p>
        </div>
        <ApplicationsList applications={applications || []} />
      </div>
    </div>
  )
}
