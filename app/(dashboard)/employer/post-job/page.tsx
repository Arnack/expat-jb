import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobPostingForm } from "@/components/job-posting-form"

export default async function PostJobPage() {
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

  // Get employer profile
  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground">Create a job posting to attract the best candidates</p>
        </div>
        <JobPostingForm employerId={session.user.id} employerProfile={employerProfile} />
      </div>
    </div>
  )
}
