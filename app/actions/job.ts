"use server"

import { createClient } from "@/lib/supabase/server"
import type { JobPosting } from "@/types"

export async function createJob(formData: Partial<JobPosting>) {
  const supabase = await createClient()

  try {
    // Verify user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Check if user is an employer
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (!profile || profile.role !== "employer") {
      throw new Error("Only employers can create job postings")
    }

    // Create job posting
    const { data: job, error } = await supabase
      .from("job_postings")
      .insert({
        employer_id: session.user.id,
        title: formData.title,
        country: formData.country || null,
        city: formData.city || null,
        place_nominatum_id: formData.place_nominatum_id || null,
        description: formData.description,
        salary_from: formData.salary_from,
        salary_to: formData.salary_to,
        email_to_apply: formData.email_to_apply || null,
        link_to_apply: formData.link_to_apply || null,
        is_global_remote: formData.is_global_remote,
        is_visa_sponsorship: formData.is_visa_sponsorship,
        sphere: formData.sphere || null,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true, jobId: job.id }
  } catch (error: any) {
    console.error("Job creation failed:", error)
    return { success: false, error: error.message }
  }
}

export async function updateJob(jobId: string, formData: Partial<JobPosting>) {
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
        place_nominatum_id: formData.place_nominatum_id || null,
        description: formData.description,
        salary_from: formData.salary_from,
        salary_to: formData.salary_to,
        email_to_apply: formData.email_to_apply || null,
        link_to_apply: formData.link_to_apply || null,
        is_global_remote: formData.is_global_remote,
        is_visa_sponsorship: formData.is_visa_sponsorship,
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
