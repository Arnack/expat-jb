"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"
import { Search, Users, Eye, FileText, ArrowLeft, MoreHorizontal } from "lucide-react"
import type { JobPosting } from "@/types"
import { ApplicationCard } from "@/components/employer/application-card"
import { ApplicationDetail } from "@/components/employer/application-detail"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Application {
  id: string
  status: string
  cover_letter: string | null
  created_at: string
  job_seeker_profiles: {
    user_id: string
    cv_url: string | null
    headline: string | null
    summary: string | null
    location: string | null
    user_profiles: {
      full_name: string | null
    } | null
  } | null
}

interface ApplicationsManagerProps {
  job: JobPosting
  applications: Application[]
}

export function ApplicationsManager({ job, applications }: ApplicationsManagerProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filteredApplications = applications.filter((app) => {
    const applicantName = app.job_seeker_profiles?.user_profiles?.full_name || ""
    const headline = app.job_seeker_profiles?.headline || ""
    const location = app.job_seeker_profiles?.location || ""

    const matchesSearch =
      applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    return {
      all: applications.length,
      pending: applications.filter((app) => app.status === "pending").length,
      viewed: applications.filter((app) => app.status === "viewed").length,
      contacted: applications.filter((app) => app.status === "contacted").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    }
  }

  const statusCounts = getStatusCounts()

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    setIsUpdating(true)
    setError(null)

    try {
      const { error } = await supabase.from("job_applications").update({ status: newStatus }).eq("id", applicationId)

      if (error) throw error

      // Update local state
      const updatedApplications = applications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app,
      )

      // If the selected application was updated, update it too
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus })
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update application status")
    } finally {
      setIsUpdating(false)
    }
  }

  const markAsViewed = async (application: Application) => {
    if (application.status === "pending") {
      await updateApplicationStatus(application.id, "viewed")
    }
    setSelectedApplication(application)
  }

  const bulkUpdateStatus = async (status: string) => {
    const selectedIds = filteredApplications.map((app) => app.id)
    if (selectedIds.length === 0) return

    setIsUpdating(true)
    setError(null)

    try {
      const { error } = await supabase.from("job_applications").update({ status }).in("id", selectedIds)

      if (error) throw error

      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update applications")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employer/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="text-muted-foreground">
            {applications.length} application{applications.length !== 1 ? "s" : ""} received
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/jobs?job=${job.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View Job Posting
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => bulkUpdateStatus("contacted")} disabled={isUpdating}>
                Mark All as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => bulkUpdateStatus("rejected")} disabled={isUpdating}>
                Mark All as Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{statusCounts.all}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.viewed}</div>
            <div className="text-sm text-muted-foreground">Viewed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.contacted}</div>
            <div className="text-sm text-muted-foreground">Contacted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applicants..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications ({statusCounts.all})</SelectItem>
                  <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                  <SelectItem value="viewed">Viewed ({statusCounts.viewed})</SelectItem>
                  <SelectItem value="contacted">Contacted ({statusCounts.contacted})</SelectItem>
                  <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Applications */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  isSelected={selectedApplication?.id === application.id}
                  onClick={() => markAsViewed(application)}
                  onStatusUpdate={updateApplicationStatus}
                  isUpdating={isUpdating}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {applications.length === 0 ? "No applications yet" : "No applications match your filters"}
                  </h3>
                  <p className="text-muted-foreground">
                    {applications.length === 0
                      ? "Applications will appear here when candidates apply to your job."
                      : "Try adjusting your search or filter criteria."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Application Detail */}
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <ApplicationDetail
              application={selectedApplication}
              onStatusUpdate={updateApplicationStatus}
              isUpdating={isUpdating}
            />
          ) : (
            <Card className="h-full">
              <CardContent className="p-8 text-center flex flex-col justify-center h-full">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select an application to view details</h3>
                <p className="text-muted-foreground">
                  Click on any application from the list to view the candidate's profile and cover letter.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
