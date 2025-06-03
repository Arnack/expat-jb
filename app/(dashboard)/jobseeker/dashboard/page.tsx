import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatDistanceToNow } from "date-fns"
import { User, Briefcase, FileText, MapPin, Calendar, ExternalLink } from "lucide-react"

export default async function JobSeekerDashboard() {
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

  // Get user profile and job seeker profile
  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

  const { data: jobSeekerProfile } = await supabase
    .from("job_seeker_profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  // Get user's applications
  const { data: applications } = await supabase
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
        salary_from,
        salary_to,
        employer_profiles (
          company_name
        )
      )
    `,
    )
    .eq("applicant_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    let completed = 0
    const total = 4

    if (userProfile?.full_name) completed++
    if (jobSeekerProfile?.headline) completed++
    if (jobSeekerProfile?.summary) completed++
    if (jobSeekerProfile?.cv_url) completed++

    return Math.round((completed / total) * 100)
  }

  const profileCompleteness = calculateProfileCompleteness()

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userProfile?.full_name || "Job Seeker"}!</h1>
          <p className="text-muted-foreground">Track your applications and manage your profile</p>
        </div>
        <Button asChild>
          <Link href="/jobs">
            <Briefcase className="mr-2 h-4 w-4" />
            Browse Jobs
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Completeness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Completeness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Complete</span>
                  <span className="font-medium">{profileCompleteness}%</span>
                </div>
                <Progress value={profileCompleteness} className="w-full" />
              </div>

              {profileCompleteness < 100 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Complete your profile to get more visibility:</p>
                  <ul className="text-xs space-y-1">
                    {!userProfile?.full_name && <li>• Add your full name</li>}
                    {!jobSeekerProfile?.headline && <li>• Add professional headline</li>}
                    {!jobSeekerProfile?.summary && <li>• Write professional summary</li>}
                    {!jobSeekerProfile?.cv_url && <li>• Upload your CV</li>}
                  </ul>
                </div>
              )}

              <Button asChild variant="outline" className="w-full">
                <Link href="/jobseeker/profile">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Applications</span>
                <Badge variant="secondary">{applications?.length || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Applications</span>
                <Badge variant="outline">{applications?.filter((app) => app.status === "pending").length || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Profile Views</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application: any) => (
                    <div key={application.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium">{application.job_postings.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {application.job_postings.employer_profiles?.company_name}
                          </p>
                        </div>
                        <Badge
                          variant={
                            application.status === "pending"
                              ? "secondary"
                              : application.status === "viewed"
                                ? "outline"
                                : application.status === "contacted"
                                  ? "default"
                                  : "destructive"
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {application.job_postings.is_global_remote
                              ? "Remote"
                              : application.job_postings.city && application.job_postings.country
                                ? `${application.job_postings.city}, ${application.job_postings.country}`
                                : application.job_postings.country || "Location not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {(application.job_postings.salary_from || application.job_postings.salary_to) && (
                        <p className="text-sm">
                          {application.job_postings.salary_from && application.job_postings.salary_to
                            ? `$${application.job_postings.salary_from.toLocaleString()} - $${application.job_postings.salary_to.toLocaleString()}`
                            : application.job_postings.salary_from
                              ? `From $${application.job_postings.salary_from.toLocaleString()}`
                              : `Up to $${application.job_postings.salary_to?.toLocaleString()}`}
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/jobs?job=${application.job_postings.id}`}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Job
                          </Link>
                        </Button>
                        {application.cover_letter && (
                          <p className="text-xs text-muted-foreground">Cover letter included</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {applications.length >= 10 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" asChild>
                        <Link href="/jobseeker/applications">View All Applications</Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">Start applying to jobs to see your applications here.</p>
                  <Button asChild>
                    <Link href="/jobs">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Browse Jobs
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
