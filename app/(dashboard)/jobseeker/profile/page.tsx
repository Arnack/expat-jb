"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { JobSeekerProfileForm } from "@/components/jobseeker/profile-form"
import { UserProfile, JobSeekerProfile } from "@/types"

export default function JobSeekerProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [jobSeekerProfile, setJobSeekerProfile] = useState<JobSeekerProfile | null>(null)

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

        // Get user profile and job seeker profile
        const { data: userProfileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        const { data: jobSeekerProfileData } = await supabase
          .from("job_seeker_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        setSession(session)
        setUserProfile(userProfileData)
        setJobSeekerProfile(jobSeekerProfileData)
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

  if (!session || !userProfile) {
    return null
  }

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
