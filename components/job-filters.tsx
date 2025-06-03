"use client"

import type React from "react"

import { useState, useTransition, useEffect, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  Briefcase,
  Building2,
  Languages,
  Clock,
  DollarSign,
  GraduationCap,
  Filter,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Constants for filter options
const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "executive", label: "Executive" },
]

const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
]

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001+", label: "1001+ employees" },
]

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "russian", label: "Russian" },
  { value: "portuguese", label: "Portuguese" },
]

const JOB_CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "design", label: "Design" },
  { value: "customer_support", label: "Customer Support" },
  { value: "finance", label: "Finance" },
  { value: "human_resources", label: "Human Resources" },
  { value: "operations", label: "Operations" },
  { value: "product", label: "Product Management" },
  { value: "engineering", label: "Engineering" },
  { value: "data", label: "Data Science" },
  { value: "content", label: "Content Writing" },
  { value: "legal", label: "Legal" },
  { value: "consulting", label: "Consulting" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
]

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "salary_desc", label: "Highest salary" },
  { value: "salary_asc", label: "Lowest salary" },
]

const DATE_POSTED_OPTIONS = [
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 3 months" },
]

interface JobFiltersProps {
  initialQuery?: string
  initialLocation?: string
  initialRemote?: boolean
  initialVisaSponsorship?: boolean
}

export function JobFilters({
  initialQuery = "",
  initialLocation = "",
  initialRemote = false,
  initialVisaSponsorship = false,
}: JobFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Basic filters
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [remote, setRemote] = useState(initialRemote)
  const [visaSponsorship, setVisaSponsorship] = useState(initialVisaSponsorship)

  // Advanced filters
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000])
  const [experienceLevels, setExperienceLevels] = useState<string[]>([])
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [datePosted, setDatePosted] = useState<string>("")
  const [jobCategories, setJobCategories] = useState<string[]>([])
  const [companySizes, setCompanySizes] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("relevance")

  // Mobile filter state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Load filters from URL on mount and when searchParams change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Basic filters
    setQuery(params.get("q") || "")
    setLocation(params.get("location") || "")
    setRemote(params.get("remote") === "true")
    setVisaSponsorship(params.get("visa") === "true")

    // Advanced filters
    const minSalary = params.get("min_salary") ? Number.parseInt(params.get("min_salary")!) : 0
    const maxSalary = params.get("max_salary") ? Number.parseInt(params.get("max_salary")!) : 200000
    setSalaryRange([minSalary, maxSalary])

    setExperienceLevels(params.getAll("experience"))
    setJobTypes(params.getAll("job_type"))
    setDatePosted(params.get("date_posted") || "")
    setJobCategories(params.getAll("category"))
    setCompanySizes(params.getAll("company_size"))
    setLanguages(params.getAll("language"))
    setSortBy(params.get("sort") || "relevance")
  }, [searchParams])

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0

    if (query) count++
    if (location) count++
    if (remote) count++
    if (visaSponsorship) count++
    if (salaryRange[0] > 0 || salaryRange[1] < 200000) count++
    if (datePosted) count++
    count += experienceLevels.length
    count += jobTypes.length
    count += jobCategories.length
    count += companySizes.length
    count += languages.length
    if (sortBy && sortBy !== "relevance") count++

    return count
  }, [
    query,
    location,
    remote,
    visaSponsorship,
    salaryRange,
    datePosted,
    experienceLevels,
    jobTypes,
    jobCategories,
    companySizes,
    languages,
    sortBy,
  ])

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault()

      startTransition(() => {
        const searchParams = new URLSearchParams()

        // Basic filters
        if (query) searchParams.set("q", query)
        if (location) searchParams.set("location", location)
        if (remote) searchParams.set("remote", "true")
        if (visaSponsorship) searchParams.set("visa", "true")

        // Advanced filters
        if (salaryRange[0] > 0) searchParams.set("min_salary", salaryRange[0].toString())
        if (salaryRange[1] < 200000) searchParams.set("max_salary", salaryRange[1].toString())

        experienceLevels.forEach((level) => searchParams.append("experience", level))
        jobTypes.forEach((type) => searchParams.append("job_type", type))

        if (datePosted) searchParams.set("date_posted", datePosted)

        jobCategories.forEach((category) => searchParams.append("category", category))
        companySizes.forEach((size) => searchParams.append("company_size", size))
        languages.forEach((language) => searchParams.append("language", language))

        if (sortBy !== "relevance") searchParams.set("sort", sortBy)

        // Keep the job ID if it exists
        const currentParams = new URLSearchParams(window.location.search)
        const jobId = currentParams.get("job")
        if (jobId) searchParams.set("job", jobId)

        router.push(`/jobs?${searchParams.toString()}`)
        setMobileFiltersOpen(false)
      })
    },
    [
      query,
      location,
      remote,
      visaSponsorship,
      salaryRange,
      experienceLevels,
      jobTypes,
      datePosted,
      jobCategories,
      companySizes,
      languages,
      sortBy,
      router,
    ],
  )

  const handleReset = useCallback(() => {
    setQuery("")
    setLocation("")
    setRemote(false)
    setVisaSponsorship(false)
    setSalaryRange([0, 200000])
    setExperienceLevels([])
    setJobTypes([])
    setDatePosted("")
    setJobCategories([])
    setCompanySizes([])
    setLanguages([])
    setSortBy("relevance")

    startTransition(() => {
      // Keep the job ID if it exists
      const currentParams = new URLSearchParams(window.location.search)
      const jobId = currentParams.get("job")
      if (jobId) {
        router.push(`/jobs?job=${jobId}`)
      } else {
        router.push("/jobs")
      }
      setMobileFiltersOpen(false)
    })
  }, [router])

  const toggleArrayValue = useCallback((array: string[], value: string): string[] => {
    return array.includes(value) ? array.filter((item) => item !== value) : [...array, value]
  }, [])

  // Handle checkbox changes for array-based filters
  const handleExperienceChange = useCallback(
    (value: string) => {
      setExperienceLevels((prev) => toggleArrayValue(prev, value))
    },
    [toggleArrayValue],
  )

  const handleJobTypeChange = useCallback(
    (value: string) => {
      setJobTypes((prev) => toggleArrayValue(prev, value))
    },
    [toggleArrayValue],
  )

  const handleCategoryChange = useCallback(
    (value: string) => {
      setJobCategories((prev) => toggleArrayValue(prev, value))
    },
    [toggleArrayValue],
  )

  const handleCompanySizeChange = useCallback(
    (value: string) => {
      setCompanySizes((prev) => toggleArrayValue(prev, value))
    },
    [toggleArrayValue],
  )

  const handleLanguageChange = useCallback(
    (value: string) => {
      setLanguages((prev) => toggleArrayValue(prev, value))
    },
    [toggleArrayValue],
  )

  // Generate filter tags for active filters
  const filterTags = useMemo(() => {
    const tags = []

    if (query) tags.push({ label: `Search: ${query}`, clear: () => setQuery("") })
    if (location) tags.push({ label: `Location: ${location}`, clear: () => setLocation("") })
    if (remote) tags.push({ label: "Remote Only", clear: () => setRemote(false) })
    if (visaSponsorship) tags.push({ label: "Visa Sponsorship", clear: () => setVisaSponsorship(false) })

    if (salaryRange[0] > 0 || salaryRange[1] < 200000) {
      tags.push({
        label: `Salary: $${salaryRange[0].toLocaleString()} - $${salaryRange[1].toLocaleString()}`,
        clear: () => setSalaryRange([0, 200000]),
      })
    }

    experienceLevels.forEach((level) => {
      const option = EXPERIENCE_LEVELS.find((opt) => opt.value === level)
      if (option) {
        tags.push({
          label: option.label,
          clear: () => setExperienceLevels((prev) => prev.filter((l) => l !== level)),
        })
      }
    })

    jobTypes.forEach((type) => {
      const option = JOB_TYPES.find((opt) => opt.value === type)
      if (option) {
        tags.push({
          label: option.label,
          clear: () => setJobTypes((prev) => prev.filter((t) => t !== type)),
        })
      }
    })

    if (datePosted) {
      const option = DATE_POSTED_OPTIONS.find((opt) => opt.value === datePosted)
      if (option) {
        tags.push({
          label: `Posted: ${option.label}`,
          clear: () => setDatePosted(""),
        })
      }
    }

    jobCategories.forEach((category) => {
      const option = JOB_CATEGORIES.find((opt) => opt.value === category)
      if (option) {
        tags.push({
          label: option.label,
          clear: () => setJobCategories((prev) => prev.filter((c) => c !== category)),
        })
      }
    })

    companySizes.forEach((size) => {
      const option = COMPANY_SIZES.find((opt) => opt.value === size)
      if (option) {
        tags.push({
          label: option.label,
          clear: () => setCompanySizes((prev) => prev.filter((s) => s !== size)),
        })
      }
    })

    languages.forEach((language) => {
      const option = LANGUAGES.find((opt) => opt.value === language)
      if (option) {
        tags.push({
          label: `${option.label}`,
          clear: () => setLanguages((prev) => prev.filter((l) => l !== language)),
        })
      }
    })

    if (sortBy && sortBy !== "relevance") {
      const option = SORT_OPTIONS.find((opt) => opt.value === sortBy)
      if (option) {
        tags.push({
          label: `Sort: ${option.label}`,
          clear: () => setSortBy("relevance"),
        })
      }
    }

    return tags
  }, [
    query,
    location,
    remote,
    visaSponsorship,
    salaryRange,
    experienceLevels,
    jobTypes,
    datePosted,
    jobCategories,
    companySizes,
    languages,
    sortBy,
  ])

  const handleTagClear = useCallback(
    (clearFn: () => void) => {
      clearFn()
      // Trigger search after clearing
      setTimeout(() => handleSearch(), 0)
    },
    [handleSearch],
  )

  // Desktop filters
  const DesktopFilters = () => (
    <div className="hidden md:block">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="salary" className="border-b">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Salary Range</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">${salaryRange[0].toLocaleString()}</span>
                <span className="text-sm font-medium">${salaryRange[1].toLocaleString()}</span>
              </div>
              <Slider
                value={salaryRange}
                min={0}
                max={200000}
                step={5000}
                onValueChange={(value) => setSalaryRange(value as [number, number])}
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience" className="border-b">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Experience Level</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`experience-${level.value}`}
                    checked={experienceLevels.includes(level.value)}
                    onCheckedChange={() => handleExperienceChange(level.value)}
                  />
                  <Label htmlFor={`experience-${level.value}`} className="text-sm cursor-pointer">
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="job-type" className="border-b">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Job Type</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              {JOB_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`job-type-${type.value}`}
                    checked={jobTypes.includes(type.value)}
                    onCheckedChange={() => handleJobTypeChange(type.value)}
                  />
                  <Label htmlFor={`job-type-${type.value}`} className="text-sm cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date-posted" className="border-b">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date Posted</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              <Select value={datePosted} onValueChange={setDatePosted}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any time</SelectItem>
                  {DATE_POSTED_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border-b">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Job Category</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 py-2">
              {JOB_CATEGORIES.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={jobCategories.includes(category.value)}
                    onCheckedChange={() => handleCategoryChange(category.value)}
                  />
                  <Label htmlFor={`category-${category.value}`} className="text-sm cursor-pointer">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="company-size" className="border-b">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Company Size</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              {COMPANY_SIZES.map((size) => (
                <div key={size.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`company-size-${size.value}`}
                    checked={companySizes.includes(size.value)}
                    onCheckedChange={() => handleCompanySizeChange(size.value)}
                  />
                  <Label htmlFor={`company-size-${size.value}`} className="text-sm cursor-pointer">
                    {size.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages" className="border-b">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>Languages</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 py-2">
              {LANGUAGES.map((language) => (
                <div key={language.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language.value}`}
                    checked={languages.includes(language.value)}
                    onCheckedChange={() => handleLanguageChange(language.value)}
                  />
                  <Label htmlFor={`language-${language.value}`} className="text-sm cursor-pointer">
                    {language.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4 flex justify-end">
        <Button onClick={() => handleSearch()} disabled={isPending}>
          Apply Filters
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Main search form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 space-y-2">
            <Label htmlFor="query">Job Title or Keywords</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="query"
                placeholder="Search jobs..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-4 space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City or Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="md:col-span-3 flex items-end">
            <div className="w-full">
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by" className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="remote" checked={remote} onCheckedChange={(checked) => setRemote(checked === true)} />
            <Label htmlFor="remote">Remote Only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="visa"
              checked={visaSponsorship}
              onCheckedChange={(checked) => setVisaSponsorship(checked === true)}
            />
            <Label htmlFor="visa">Visa Sponsorship</Label>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center gap-2">
            {/* Mobile filters button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="md:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your job search with filters</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile-salary">Salary Range</Label>
                      <div className="flex justify-between text-sm">
                        <span>${salaryRange[0].toLocaleString()}</span>
                        <span>${salaryRange[1].toLocaleString()}</span>
                      </div>
                      <Slider
                        id="mobile-salary"
                        value={salaryRange}
                        min={0}
                        max={200000}
                        step={5000}
                        onValueChange={(value) => setSalaryRange(value as [number, number])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <div className="space-y-2">
                        {EXPERIENCE_LEVELS.map((level) => (
                          <div key={level.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-experience-${level.value}`}
                              checked={experienceLevels.includes(level.value)}
                              onCheckedChange={() => handleExperienceChange(level.value)}
                            />
                            <Label htmlFor={`mobile-experience-${level.value}`} className="text-sm cursor-pointer">
                              {level.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Job Type</Label>
                      <div className="space-y-2">
                        {JOB_TYPES.map((type) => (
                          <div key={type.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-job-type-${type.value}`}
                              checked={jobTypes.includes(type.value)}
                              onCheckedChange={() => handleJobTypeChange(type.value)}
                            />
                            <Label htmlFor={`mobile-job-type-${type.value}`} className="text-sm cursor-pointer">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile-date-posted">Date Posted</Label>
                      <Select value={datePosted} onValueChange={setDatePosted}>
                        <SelectTrigger id="mobile-date-posted" className="w-full">
                          <SelectValue placeholder="Any time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any time</SelectItem>
                          {DATE_POSTED_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Job Category</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {JOB_CATEGORIES.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-category-${category.value}`}
                              checked={jobCategories.includes(category.value)}
                              onCheckedChange={() => handleCategoryChange(category.value)}
                            />
                            <Label htmlFor={`mobile-category-${category.value}`} className="text-sm cursor-pointer">
                              {category.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Company Size</Label>
                      <div className="space-y-2">
                        {COMPANY_SIZES.map((size) => (
                          <div key={size.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-company-size-${size.value}`}
                              checked={companySizes.includes(size.value)}
                              onCheckedChange={() => handleCompanySizeChange(size.value)}
                            />
                            <Label htmlFor={`mobile-company-size-${size.value}`} className="text-sm cursor-pointer">
                              {size.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Languages</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {LANGUAGES.map((language) => (
                          <div key={language.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-language-${language.value}`}
                              checked={languages.includes(language.value)}
                              onCheckedChange={() => handleLanguageChange(language.value)}
                            />
                            <Label htmlFor={`mobile-language-${language.value}`} className="text-sm cursor-pointer">
                              {language.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleSearch()} className="flex-1" disabled={isPending}>
                      Apply Filters
                    </Button>
                    <Button variant="outline" onClick={handleReset} disabled={isPending}>
                      Reset
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop filters button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="hidden md:flex">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Advanced Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-4" align="end">
                <DesktopFilters />
              </PopoverContent>
            </Popover>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Searching..." : "Search Jobs"}
            </Button>
          </div>
        </div>
      </form>

      {/* Filter tags */}
      {filterTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filterTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              {tag.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagClear(tag.clear)} />
            </Badge>
          ))}
          {filterTags.length > 1 && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleReset}>
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
