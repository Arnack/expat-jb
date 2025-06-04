"use client"

import Link from "next/link"
import type { JobPosting } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Globe, MapPin, Building2, Briefcase } from "lucide-react"

interface JobListProps {
  jobs: JobPosting[]
  selectedJobId?: string
}

export function JobList({ jobs, selectedJobId }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-muted rounded-lg p-8 text-center">
        <h3 className="text-xl font-medium mb-2">No jobs found</h3>
        <p className="text-muted-foreground">Try adjusting your search filters to find more opportunities.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs?job=${job.id}`} className="block">
          <Card
            className={`transition-all hover:border-primary ${
              selectedJobId === job.id ? "border-primary ring-1 ring-primary" : ""
            }`}
          >
            <CardContent className="p-3">
              <div className="flex justify-between items-start gap-3">
                {/* Left side - Main content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h3 className="font-medium text-base line-clamp-1 mb-1">{job.title}</h3>
                    {job.employer_profiles?.company_name && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{job.employer_profiles.company_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {job.is_global_remote && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs h-5">
                        <Globe className="h-2.5 w-2.5" />
                        Remote
                      </Badge>
                    )}
                    {job.is_visa_sponsorship && (
                      <Badge variant="outline" className="bg-primary/10 text-xs h-5">
                        Visa
                      </Badge>
                    )}
                    {job.country && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs h-5">
                        <MapPin className="h-2.5 w-2.5" />
                        {job.city ? `${job.city}, ${job.country}` : job.country}
                      </Badge>
                    )}
                    {job.sphere && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs h-5">
                        <Briefcase className="h-2.5 w-2.5" />
                        {job.sphere}
                      </Badge>
                    )}
                    {job.job_type && <Badge variant="outline" className="text-xs h-5">{job.job_type}</Badge>}
                  </div>
                </div>

                {/* Right side - Date and Salary */}
                <div className="flex flex-col items-end text-right flex-shrink-0 space-y-1">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {job.published_at && formatDistanceToNow(new Date(job.published_at), { addSuffix: true })}
                  </span>
                  
                  {(job.salary_from || job.salary_to) && (
                    <div className="text-xs font-medium text-right">
                      {job.salary_from && job.salary_to
                        ? `$${job.salary_from.toLocaleString()} - $${job.salary_to.toLocaleString()}`
                        : job.salary_from
                          ? `From $${job.salary_from.toLocaleString()}`
                          : `Up to $${job.salary_to?.toLocaleString()}`}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
