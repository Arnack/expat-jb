export type UserRole = "job_seeker" | "employer"

export interface UserProfile {
  id: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface JobSeekerProfile {
  user_id: string
  cv_url: string | null
  headline: string | null
  summary: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface EmployerProfile {
  user_id: string
  company_name: string
  company_website: string | null
  company_description: string | null
  company_size: string | null
  industry: string | null
  created_at: string
  updated_at: string
}

export type JobStatus = "draft" | "published" | "expired"
export type JobPlan = "free" | "standard" | "premium" | "pro"
export type JobType = "full_time" | "part_time" | "contract" | "freelance" | "internship"
export type ExperienceLevel = "entry" | "mid" | "senior" | "executive"

export interface JobPosting {
  id: string
  employer_id: string
  title: string
  country: string | null
  city: string | null
  place_nominatum_id: string | null
  description: string
  salary_from: number | null
  salary_to: number | null
  email_to_apply: string | null
  link_to_apply: string | null
  is_global_remote: boolean
  is_visa_sponsorship: boolean
  sphere: string | null
  status: JobStatus
  plan: JobPlan
  published_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
  job_type?: JobType | null
  experience_level?: ExperienceLevel | null
  languages?: string[] | null
  employer_profiles?: EmployerProfile | null
}

export type ApplicationStatus = "pending" | "viewed" | "contacted" | "rejected"

export interface JobApplication {
  id: string
  job_id: string
  applicant_id: string
  cover_letter: string | null
  status: ApplicationStatus
  created_at: string
  updated_at: string
}

export interface PaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
  metadata: {
    jobId: string
    plan: string
    employerId: string
    jobTitle: string
  }
}

export interface PaymentResult {
  success: boolean
  paymentIntentId?: string
  error?: string
}

export interface NotificationPreferences {
  user_id: string
  email_new_applications: boolean
  email_application_status_updates: boolean
  email_job_matches: boolean
  email_marketing: boolean
  created_at: string
  updated_at: string
}
