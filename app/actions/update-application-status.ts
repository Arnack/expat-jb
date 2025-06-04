"use server"

import { createClient } from "@/lib/supabase/server"
import { sendApplicationStatusUpdateEmail } from "@/lib/email/service"

export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  const supabase = await createClient()

  try {
    // Verify user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Get application with job and applicant details
    const { data: application } = await supabase
      .from("job_applications")
      .select(`
        *,
        job_postings (
          id,
          title,
          employer_id,
          employer_profiles (
            company_name
          )
        ),
        job_seeker_profiles (
          user_id,
          user_profiles (
            full_name
          )
        )
      `)
      .eq("id", applicationId)
      .single()

    if (!application) {
      throw new Error("Application not found")
    }

    // Verify that the current user is the employer who posted the job
    if (application.job_postings.employer_id !== session.user.id) {
      throw new Error("You don't have permission to update this application")
    }

    const oldStatus = application.status

    // Update application status
    const { error } = await supabase.from("job_applications").update({ status: newStatus }).eq("id", applicationId)

    if (error) {
      throw error
    }

    // Get applicant email
    const { data: applicantUser } = await supabase.auth.admin.getUserById(application.applicant_id)

    if (!applicantUser?.user) {
      console.error("Could not find applicant user")
      return { success: true }
    }

    // Check applicant notification preferences
    const { data: applicantPreferences } = await supabase
      .from("notification_preferences")
      .select("email_application_status_updates")
      .eq("user_id", application.applicant_id)
      .single()

    // Send email to applicant if they have notifications enabled
    if (applicantPreferences?.email_application_status_updates !== false) {
      await sendApplicationStatusUpdateEmail({
        to: applicantUser.user.email,
        applicantName: application.job_seeker_profiles.user_profiles.full_name || "Applicant",
        jobTitle: application.job_postings.title,
        companyName: application.job_postings.employer_profiles.company_name,
        oldStatus,
        newStatus,
        applicationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/jobseeker/applications`,
        jobUrl: `${process.env.NEXT_PUBLIC_APP_URL}/jobs?job=${application.job_postings.id}`,
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error("Application status update failed:", error)
    return { success: false, error: error.message }
  }
}
