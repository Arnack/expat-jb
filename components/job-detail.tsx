import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { JobPosting } from "@/types"
import { ApplicationModal } from "@/components/application-modal"
import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  GraduationCap,
  Globe,
  Languages,
  Mail,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface JobDetailProps {
  job: JobPosting
}

export async function JobDetail({ job }: JobDetailProps) {
  // Get the current user to check if they're the job owner
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = user?.id === job.employer_id

  // Format the job description with proper line breaks
  const formattedDescription = job.description.split("\n").map((line, i) => (
    <p key={i} className={line === "" ? "my-4" : "my-2"}>
      {line}
    </p>
  ))

  // Get the company name if available
  const companyName = job.employer_profiles?.company_name || "Company"

  return (
    <Card className="h-full">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{job.title}</h2>
            {isOwner && (
              <Link href={`/employer/jobs/${job.id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit Job
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center text-muted-foreground">
            <Building2 className="mr-2 h-4 w-4" />
            <span>{companyName}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
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
            {job.job_type && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.job_type.replace("_", " ")}
              </Badge>
            )}
            {job.experience_level && (
              <Badge variant="outline" className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {job.experience_level.replace("_", " ")} level
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(job.salary_from || job.salary_to) && (
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Salary Range</p>
                <p>
                  {job.salary_from && job.salary_to
                    ? `$${job.salary_from.toLocaleString()} - $${job.salary_to.toLocaleString()}`
                    : job.salary_from
                      ? `From $${job.salary_from.toLocaleString()}`
                      : `Up to $${job.salary_to?.toLocaleString()}`}
                </p>
              </div>
            </div>
          )}

          {job.published_at && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Posted</p>
                <p>{formatDistanceToNow(new Date(job.published_at), { addSuffix: true })}</p>
              </div>
            </div>
          )}
        </div>

        {job.languages && job.languages.length > 0 && (
          <div className="flex items-start">
            <Languages className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Required Languages</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {job.languages.map((language) => (
                  <Badge key={language} variant="secondary">
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Job Description</h3>
          <div className="prose max-w-none dark:prose-invert">{formattedDescription}</div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 p-6 flex flex-col sm:flex-row gap-4">
        {job.email_to_apply ? (
          <ApplicationModal job={job}>
            <Button className="w-full sm:w-auto">
              <Mail className="mr-2 h-4 w-4" />
              Easy Apply
            </Button>
          </ApplicationModal>
        ) : job.link_to_apply ? (
          <Button className="w-full sm:w-auto" asChild>
            <a href={job.link_to_apply} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Apply on Company Website
            </a>
          </Button>
        ) : (
          <Button className="w-full sm:w-auto" disabled>
            No application method provided
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
