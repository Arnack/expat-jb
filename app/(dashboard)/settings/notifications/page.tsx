import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NotificationPreferencesForm } from "@/components/notification-preferences-form"
import type { NotificationPreferences } from "@/types"

export default async function NotificationSettingsPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user's notification preferences
  const { data: preferences } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  // Get user profile to determine role
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

  return (
    <div className="container py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">Manage your email notification preferences</p>
        </div>

        <NotificationPreferencesForm
          preferences={preferences as NotificationPreferences}
          userRole={profile?.role || "job_seeker"}
        />
      </div>
    </div>
  )
}
