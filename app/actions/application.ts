"use server"

import { createClient } from "@/lib/supabase/server"
import { sendApplicationReceivedEmail, sendApplicationConfirmationEmail } from "@/lib/email/service"
import { formatDate } from "@/lib/utils"

export async function applyToJob(jobId: string, coverLetter: string) {
  const supabase = await createClient()

  try {
    // Verify user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error("You must be logged in to apply for jobs")
    }

    // Check if user is a job seeker
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("role, full_name")
      .eq("id", session.user.id)
      .single()

    if (!userProfile || userProfile.role !== "job_seeker") {
      throw new Error("Only job seekers can apply for jobs")
    }

    // Get job seeker profile
    const { data: jobSeekerProfile } = await supabase
      .from("job_seeker_profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    if (!jobSeekerProfile) {
      throw new Error("Please complete your job seeker profile before applying")
    }

    if (!jobSeekerProfile.cv_url) {
      throw new Error("Please upload your CV before applying")
    }

    // Check if user has already applied to this job
    const { data: existingApplication } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("applicant_id", session.user.id)
      .single()

    if (existingApplication) {
      throw new Error("You have already applied to this job")
    }

    // Get job details
    const { data: job } = await supabase
      .from("job_postings")
      .select(`
        *,
        employer_profiles (
          user_id,
          company_name
        )
      `)
      .eq("id", jobId)
      .single()

    if (!job) {
      throw new Error("Job not found")
    }

    if (job.status !== "published") {
      throw new Error("This job is no longer accepting applications")
    }

    // Create application
    const { data: application, error } = await supabase
      .from("job_applications")
      .insert({
        job_id: jobId,
        applicant_id: session.user.id,
        cover_letter: coverLetter,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Get employer email
    const { data: employerUser } = await supabase.auth.admin.getUserById(job.employer_profiles.user_id)

    if (!employerUser?.user) {
      console.error("Could not find employer user")
    } else {
      // Check employer notification preferences
      const { data: employerPreferences } = await supabase
        .from("notification_preferences")
        .select("email_new_applications")
        .eq("user_id", job.employer_profiles.user_id)
        .single()

      // Send email to employer if they have notifications enabled
      if (employerPreferences?.email_new_applications !== false) {
        const { data: employer } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("id", job.employer_profiles.user_id)
          .single()

        await sendApplicationReceivedEmail({
          to: employerUser.user.email,
          employerName: employer?.full_name || "Employer",
          jobTitle: job.title,
          applicantName: userProfile.full_name || "Applicant",
          applicantEmail: session.user.email,
          coverLetter,
          applicationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/employer/jobs/${jobId}/applications`,
          jobUrl: `${process.env.NEXT_PUBLIC_APP_URL}/jobs?job=${jobId}`,
        })
      }
    }

    // Send confirmation email to applicant
    const { data: applicantPreferences } = await supabase
      .from("notification_preferences")
      .select("email_application_status_updates")
      .eq("user_id", session.user.id)
      .single()

    if (applicantPreferences?.email_application_status_updates !== false) {
      await sendApplicationConfirmationEmail({
        to: session.user.email,
        applicantName: userProfile.full_name || "Applicant",
        jobTitle: job.title,
        companyName: job.employer_profiles.company_name,
        applicationDate: formatDate(new Date()),
        jobUrl: `${process.env.NEXT_PUBLIC_APP_URL}/jobs?job=${jobId}`,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/jobseeker/applications`,
      })
    }

    return { success: true, applicationId: application.id }
  } catch (error: any) {
    console.error("Application submission failed:", error)
    return { success: false, error: error.message }
  }
}
