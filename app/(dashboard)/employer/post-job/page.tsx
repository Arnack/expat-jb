"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { JobPostingForm } from "@/components/job-posting-form"
import { createJob } from "@/app/actions/job"

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
    const result = await createJob(data)
    return result
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
