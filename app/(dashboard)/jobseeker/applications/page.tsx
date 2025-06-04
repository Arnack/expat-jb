"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { ApplicationsList } from "@/components/jobseeker/applications-list"

interface Application {
  id: string
  job_id: string
  applicant_id: string
  cover_letter: string | null
  status: "pending" | "viewed" | "contacted" | "rejected"
  created_at: string
  updated_at: string
  job_postings: {
    id: string
    title: string
    country: string | null
    city: string | null
    is_global_remote: boolean
    is_visa_sponsorship: boolean
    salary_from: number | null
    salary_to: number | null
    sphere: string | null
    published_at: string | null
    employer_profiles: {
      company_name: string
      company_website: string | null
    }
  }
}

export default function JobSeekerApplicationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.replace("/auth/login")
          return
        }

        // Check if user is a job seeker
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (!profile || profile.role !== "job_seeker") {
          router.replace("/employer/dashboard")
          return
        }

        // Get user's applications with job details
        const { data: applicationsData } = await supabase
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

        setSession(session)
        setApplications(applicationsData || [])
      } catch (error) {
        console.error("Error checking auth:", error)
        router.replace("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
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

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track the status of all your job applications</p>
        </div>
        <ApplicationsList applications={applications} />
      </div>
    </div>
  )
}
