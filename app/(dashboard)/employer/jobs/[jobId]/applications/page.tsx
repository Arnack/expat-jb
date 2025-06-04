"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { ApplicationsManager } from "@/components/employer/applications-manager"

export default function JobApplicationsPage({
  params,
}: {
  params: { jobId: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [job, setJob] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    const loadApplicationsData = async () => {
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

        // Get job posting and verify ownership
        const { data: jobData, error: jobError } = await supabase
          .from("job_postings")
          .select("*")
          .eq("id", params.jobId)
          .eq("employer_id", session.user.id)
          .single()

        if (jobError || !jobData) {
          router.replace("/employer/dashboard")
          return
        }

        // Get applications for this job with applicant details
        const { data: applicationsData } = await supabase
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

        setSession(session)
        setJob(jobData)
        setApplications(applicationsData || [])
      } catch (error) {
        console.error('Applications page data loading failed:', error)
        router.replace("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    loadApplicationsData()
  }, [router, params.jobId])

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

  if (!session || !job) {
    return null
  }

  return (
    <div className="container py-6">
      <ApplicationsManager job={job} applications={applications} />
    </div>
  )
}
