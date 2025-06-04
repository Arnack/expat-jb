import { createClient } from "@/lib/supabase/server"
import type { JobPosting } from "@/types"
import { JobFilters } from "@/components/job-filters"
import { JobList } from "@/components/job-list"
import { JobDetail } from "@/components/job-detail"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()

  // Parse search parameters
  const query = searchParams.q as string | undefined
  const location = searchParams.location as string | undefined
  const remote = searchParams.remote === "true"
  const visaSponsorship = searchParams.visa === "true"
  const selectedJobId = searchParams.job as string | undefined

  // Parse advanced filters
  const minSalary = searchParams.min_salary ? Number.parseInt(searchParams.min_salary as string) : undefined
  const maxSalary = searchParams.max_salary ? Number.parseInt(searchParams.max_salary as string) : undefined
  const experienceLevels = Array.isArray(searchParams.experience)
    ? searchParams.experience
    : searchParams.experience
      ? [searchParams.experience as string]
      : []
  const jobTypes = Array.isArray(searchParams.job_type)
    ? searchParams.job_type
    : searchParams.job_type
      ? [searchParams.job_type as string]
      : []
  const datePosted = searchParams.date_posted as string | undefined
  const jobCategories = Array.isArray(searchParams.category)
    ? searchParams.category
    : searchParams.category
      ? [searchParams.category as string]
      : []
  const companySizes = Array.isArray(searchParams.company_size)
    ? searchParams.company_size
    : searchParams.company_size
      ? [searchParams.company_size as string]
      : []
  const languages = Array.isArray(searchParams.language)
    ? searchParams.language
    : searchParams.language
      ? [searchParams.language as string]
      : []
  const sortBy = searchParams.sort as string | undefined

  // Build query
  let jobsQuery = supabase
    .from("job_postings")
    .select(`
      *,
      employer_profiles (
        company_name,
        company_size,
        industry
      )
    `)
    .eq("status", "published")

  // Apply basic filters
  if (query) {
    jobsQuery = jobsQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (location) {
    jobsQuery = jobsQuery.or(`country.ilike.%${location}%,city.ilike.%${location}%`)
  }

  if (remote) {
    jobsQuery = jobsQuery.eq("is_global_remote", true)
  }

  if (visaSponsorship) {
    jobsQuery = jobsQuery.eq("is_visa_sponsorship", true)
  }

  // Apply advanced filters
  if (minSalary !== undefined) {
    jobsQuery = jobsQuery.gte("salary_from", minSalary)
  }

  if (maxSalary !== undefined) {
    jobsQuery = jobsQuery.lte("salary_to", maxSalary)
  }

  if (experienceLevels.length > 0) {
    // Note: This assumes you have an experience_level column
    // If not, you might need to adjust your database schema
    jobsQuery = jobsQuery.in("experience_level", experienceLevels)
  }

  if (jobTypes.length > 0) {
    // Note: This assumes you have a job_type column
    // If not, you might need to adjust your database schema
    jobsQuery = jobsQuery.in("job_type", jobTypes)
  }

  if (datePosted) {
    const daysAgo = Number.parseInt(datePosted)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    jobsQuery = jobsQuery.gte("published_at", date.toISOString())
  }

  if (jobCategories.length > 0) {
    // Using the sphere column for job categories
    jobsQuery = jobsQuery.in("sphere", jobCategories)
  }

  // Company size filter would need to join with employer_profiles
  // This is a simplified approach
  if (companySizes.length > 0) {
    // This is a placeholder - actual implementation would depend on your data structure
    // You might need to handle this differently based on your schema
  }

  // Language filter would need a languages column or a join
  // This is a simplified approach
  if (languages.length > 0) {
    // This is a placeholder - actual implementation would depend on your data structure
    // You might need to handle this differently based on your schema
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case "date_desc":
        jobsQuery = jobsQuery.order("published_at", { ascending: false })
        break
      case "date_asc":
        jobsQuery = jobsQuery.order("published_at", { ascending: true })
        break
      case "salary_desc":
        jobsQuery = jobsQuery.order("salary_to", { ascending: false, nullsFirst: false })
        break
      case "salary_asc":
        jobsQuery = jobsQuery.order("salary_from", { ascending: true, nullsFirst: false })
        break
      default:
        // Default to newest first
        jobsQuery = jobsQuery.order("published_at", { ascending: false })
    }
  } else {
    // Default sorting
    jobsQuery = jobsQuery.order("published_at", { ascending: false })
  }

  // Fetch jobs
  const { data: jobs, error } = await jobsQuery

  // Fetch selected job details if needed
  let selectedJob: JobPosting | null = null
  if (selectedJobId) {
    const { data } = await supabase
      .from("job_postings")
      .select(`
        *,
        employer_profiles (
          company_name,
          company_size,
          industry
        )
      `)
      .eq("id", selectedJobId)
      .single()

    selectedJob = data
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Find Your Dream Job</h1>

      <JobFilters
        initialQuery={query}
        initialLocation={location}
        initialRemote={remote}
        initialVisaSponsorship={visaSponsorship}
      />

      {selectedJob ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mt-6">
          <div className="lg:col-span-1">
            <JobList jobs={(jobs as JobPosting[]) || []} selectedJobId={selectedJobId} />
          </div>
          <div className="lg:col-span-2">
            <JobDetail job={selectedJob} />
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <JobList jobs={(jobs as JobPosting[]) || []} selectedJobId={selectedJobId} />
        </div>
      )}
    </div>
  )
}
