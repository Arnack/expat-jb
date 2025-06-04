"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import type { UserProfile } from "@/types"

export function MainNav() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        setProfile(data as UserProfile)
      }
      setLoading(false)
    }

    fetchProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        setProfile(data as UserProfile)
      } else {
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">NomadJobs</span>
      </Link>
      <nav className="hidden md:flex gap-6">
        <Link href="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
          Find Jobs
        </Link>
        {profile?.role === "employer" ? (
          <Link href="/employer/post-job" className="text-sm font-medium transition-colors hover:text-primary">
            Post a Job
          </Link>
        ) : (
          <Link href="/employers" className="text-sm font-medium transition-colors hover:text-primary">
            For Employers
          </Link>
        )}
        {/* <Link href="/resources" className="text-sm font-medium transition-colors hover:text-primary">
          Resources
        </Link> */}
      </nav>
    </div>
  )
}
