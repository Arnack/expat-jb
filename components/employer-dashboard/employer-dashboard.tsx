"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Briefcase, Users, Eye, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function EmployerDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
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

        // Fetch employer's job postings with application counts
        const { data: jobsData } = await supabase
          .from("job_postings")
          .select(`
            *,
            job_applications (
              id,
              status,
              created_at
            )
          `)
          .eq("employer_id", session.user.id)
          .order("created_at", { ascending: false })

        setSession(session)
        setJobs(jobsData || [])
      } catch (error) {
        console.error('Dashboard data loading failed:', error)
        router.replace("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
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

  // Calculate stats
  const totalApplications = jobs?.reduce((acc, job) => acc + (job.job_applications?.length || 0), 0) || 0
  const activeJobs = jobs?.filter((job) => job.status === "published").length || 0
  const pendingApplications =
    jobs?.reduce(
      (acc, job) => acc + (job.job_applications?.filter((app: any) => app.status === "pending").length || 0),
      0,
    ) || 0

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <Button asChild>
          <Link href="/employer/post-job">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs && jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job: any) => {
                const applicationCount = job.job_applications?.length || 0
                const pendingCount = job.job_applications?.filter((app: any) => app.status === "pending").length || 0
                const recentApplications = job.job_applications
                  ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 3)

                return (
                  <div key={job.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.city && job.country ? `${job.city}, ${job.country}` : job.country || "Remote"}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={job.status === "published" ? "default" : "secondary"}>{job.status}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {applicationCount} application{applicationCount !== 1 ? "s" : ""}
                          </span>
                          {pendingCount > 0 && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              {pendingCount} pending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/employer/jobs/${job.id}/applications`}>
                            <Users className="h-4 w-4 mr-1" />
                            Applications ({applicationCount})
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/employer/jobs/${job.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Recent Applications Preview */}
                    {recentApplications && recentApplications.length > 0 && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Recent Applications:</p>
                        <div className="space-y-1">
                          {recentApplications.map((app: any) => (
                            <div key={app.id} className="flex justify-between items-center text-xs">
                              <span>New application</span>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    app.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""
                                  }
                                >
                                  {app.status}
                                </Badge>
                                <span className="text-muted-foreground">
                                  {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by posting your first job to attract talented candidates.
              </p>
              <Button asChild>
                <Link href="/employer/post-job">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Job
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
