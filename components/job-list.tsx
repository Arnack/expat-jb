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
    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs?job=${job.id}`} className="block">
          <Card
            className={`transition-all hover:border-primary ${
              selectedJobId === job.id ? "border-primary ring-1 ring-primary" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg line-clamp-2">{job.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {job.published_at && formatDistanceToNow(new Date(job.published_at), { addSuffix: true })}
                  </span>
                </div>

                {job.employer_profiles?.company_name && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{job.employer_profiles.company_name}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {job.is_global_remote && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Remote
                    </Badge>
                  )}
                  {job.is_visa_sponsorship && (
                    <Badge variant="outline" className="bg-primary/10">
                      Visa Sponsorship
                    </Badge>
                  )}
                  {job.country && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.city ? `${job.city}, ${job.country}` : job.country}
                    </Badge>
                  )}
                  {job.sphere && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.sphere}
                    </Badge>
                  )}
                  {job.job_type && <Badge variant="outline">{job.job_type}</Badge>}
                </div>

                {(job.salary_from || job.salary_to) && (
                  <p className="text-sm">
                    {job.salary_from && job.salary_to
                      ? `$${job.salary_from.toLocaleString()} - $${job.salary_to.toLocaleString()}`
                      : job.salary_from
                        ? `From $${job.salary_from.toLocaleString()}`
                        : `Up to $${job.salary_to?.toLocaleString()}`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
