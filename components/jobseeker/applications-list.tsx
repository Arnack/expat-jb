"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"
import { Search, MapPin, Calendar, ExternalLink, Building2, Globe, FileText, DollarSign } from "lucide-react"

interface Application {
  id: string
  status: string
  cover_letter: string | null
  created_at: string
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
    } | null
  }
}

interface ApplicationsListProps {
  applications: Application[]
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job_postings.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job_postings.employer_profiles?.company_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "viewed":
        return "outline"
      case "contacted":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatSalary = (salaryFrom: number | null, salaryTo: number | null) => {
    if (salaryFrom && salaryTo) {
      return `$${salaryFrom.toLocaleString()} - $${salaryTo.toLocaleString()}`
    } else if (salaryFrom) {
      return `From $${salaryFrom.toLocaleString()}`
    } else if (salaryTo) {
      return `Up to $${salaryTo.toLocaleString()}`
    }
    return null
  }

  const getLocation = (job: Application["job_postings"]) => {
    if (job.is_global_remote) {
      return "Remote (Worldwide)"
    } else if (job.city && job.country) {
      return `${job.city}, ${job.country}`
    } else if (job.country) {
      return job.country
    }
    return "Location not specified"
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title or company..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{application.job_postings.title}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{application.job_postings.employer_profiles?.company_name}</span>
                        {application.job_postings.employer_profiles?.company_website && (
                          <a
                            href={application.job_postings.employer_profiles.company_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(application.status) as any} className="capitalize">
                      {application.status}
                    </Badge>
                  </div>

                  {/* Job Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{getLocation(application.job_postings)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}</span>
                    </div>
                    {application.job_postings.sphere && (
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{application.job_postings.sphere}</span>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {application.job_postings.is_global_remote && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Remote
                      </Badge>
                    )}
                    {application.job_postings.is_visa_sponsorship && (
                      <Badge variant="outline" className="bg-primary/10">
                        Visa Sponsorship
                      </Badge>
                    )}
                    {application.cover_letter && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Cover Letter
                      </Badge>
                    )}
                  </div>

                  {/* Salary */}
                  {formatSalary(application.job_postings.salary_from, application.job_postings.salary_to) && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatSalary(application.job_postings.salary_from, application.job_postings.salary_to)}
                      </span>
                    </div>
                  )}

                  {/* Cover Letter Preview */}
                  {application.cover_letter && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Your Cover Letter:</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{application.cover_letter}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs?job=${application.job_postings.id}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Job Posting
                      </Link>
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Job posted{" "}
                      {application.job_postings.published_at &&
                        formatDistanceToNow(new Date(application.job_postings.published_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {applications.length === 0 ? "No applications yet" : "No applications match your filters"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {applications.length === 0
                ? "Start applying to jobs to see your applications here."
                : "Try adjusting your search or filter criteria."}
            </p>
            {applications.length === 0 && (
              <Button asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {applications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{applications.filter((app) => app.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{applications.filter((app) => app.status === "viewed").length}</p>
                <p className="text-sm text-muted-foreground">Viewed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{applications.filter((app) => app.status === "contacted").length}</p>
                <p className="text-sm text-muted-foreground">Contacted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
