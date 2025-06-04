"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { JobPostingForm } from "@/components/job-posting-form"

export default function PostJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [employerProfile, setEmployerProfile] = useState<any>(null)

  useEffect(() => {
    const loadPageData = async () => {
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

        // Get employer profile
        const { data: empProfile } = await supabase
          .from("employer_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        setSession(session)
        setEmployerProfile(empProfile)
      } catch (error) {
        console.error('Post job page data loading failed:', error)
        router.replace("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    loadPageData()
  }, [router])

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

  if (!session) {
    return null
  }

  const handleJobSubmit = async (data: any) => {
    try {
      // Get current session for user ID
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { success: false, error: "You must be logged in to create a job posting" }
      }

      // Create job posting directly using client
      const { data: job, error } = await supabase
        .from("job_postings")
        .insert({
          employer_id: session.user.id,
          title: data.title,
          country: data.country || null,
          city: data.city || null,
          place_nominatum_id: data.place_nominatum_id || null,
          description: data.description,
          salary_from: data.salary_from,
          salary_to: data.salary_to,
          email_to_apply: data.email_to_apply || null,
          link_to_apply: data.link_to_apply || null,
          is_global_remote: data.is_global_remote || false,
          is_visa_sponsorship: data.is_visa_sponsorship || false,
          sphere: data.sphere || null,
          status: 'published',
          plan: 'free',
          published_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Job creation error:", error)
        return { success: false, error: error.message }
      }

      // Redirect to dashboard after successful job creation
      router.push("/employer/dashboard")
      return { success: true, jobId: job.id }
    } catch (error: any) {
      console.error("Job creation failed:", error)
      return { success: false, error: error.message }
    }
  }

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground">Create a job posting to attract the best candidates</p>
        </div>
        <JobPostingForm onSubmit={handleJobSubmit} />
      </div>
    </div>
  )
}
