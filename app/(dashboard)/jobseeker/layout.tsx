import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Check if user is a job seeker
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

  if (!profile || profile.role !== "job_seeker") {
    redirect("/employer/dashboard")
  }

  return <>{children}</>
}
