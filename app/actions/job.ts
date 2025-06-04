"use server"

import { createClient } from "@/lib/supabase/server"
import type { JobFormData } from "@/components/job-posting-form"

export async function updateJob(jobId: string, formData: JobFormData) {
  const supabase = await createClient()

  try {
    // Verify user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Get job posting and verify ownership
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", jobId)
      .eq("employer_id", session.user.id)
      .single()

    if (jobError || !job) {
      throw new Error("Job not found or you don't have permission to edit it")
    }

    // Update job posting
    const { error } = await supabase
      .from("job_postings")
      .update({
        title: formData.title,
        country: formData.country || null,
        city: formData.city || null,
        place_nominatum_id: formData.placeNominatumId || null,
        description: formData.description,
        salary_from: formData.salaryFrom,
        salary_to: formData.salaryTo,
        email_to_apply: formData.emailToApply || null,
        link_to_apply: formData.linkToApply || null,
        is_global_remote: formData.isGlobalRemote,
        is_visa_sponsorship: formData.isVisaSponsorship,
        sphere: formData.sphere || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("employer_id", session.user.id)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Job update failed:", error)
    return { success: false, error: error.message }
  }
}
