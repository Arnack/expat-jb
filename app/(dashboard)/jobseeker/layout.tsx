"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('JobSeeker Layout - Session:', session ? 'exists' : 'null')
        console.log('JobSeeker Layout - Error:', error ? error.message : 'none')

        if (error || !session) {
          console.log('JobSeeker Layout - Redirecting to login')
          router.push("/auth/login")
          return
        }

                 // Check if user is a job seeker
         const { data: profile, error: profileError } = await supabase
           .from("user_profiles")
           .select("role")
           .eq("id", session.user.id)
           .single()

         console.log('JobSeeker Layout - Profile:', profile)
         console.log('JobSeeker Layout - Profile Error:', profileError ? profileError.message : 'none')
         console.log('JobSeeker Layout - User ID:', session.user.id)

         if (profileError) {
           console.log('JobSeeker Layout - Profile query failed, redirecting to login')
           router.push("/auth/login")
           return
         }

         if (!profile || profile.role !== "job_seeker") {
           console.log('JobSeeker Layout - Not a job seeker, role:', profile?.role)
           router.push("/employer/dashboard")
           return
         }

         console.log('JobSeeker Layout - Authentication successful!')
         setAuthenticated(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push("/auth/login")
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
