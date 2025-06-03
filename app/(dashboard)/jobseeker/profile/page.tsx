import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobSeekerProfileForm } from "@/components/jobseeker/profile-form"

export default async function JobSeekerProfilePage() {
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

  // Get user profile and job seeker profile
  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

  const { data: jobSeekerProfile } = await supabase
    .from("job_seeker_profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile information and upload your CV</p>
        </div>
        <JobSeekerProfileForm
          userId={session.user.id}
          userEmail={session.user.email!}
          userProfile={userProfile}
          jobSeekerProfile={jobSeekerProfile}
        />
      </div>
    </div>
  )
}
