import Link from "next/link"

export function MainNav() {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">NomadJobs</span>
      </Link>
      <nav className="hidden md:flex gap-6">
        <Link href="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
          Find Jobs
        </Link>
        <Link href="/employers" className="text-sm font-medium transition-colors hover:text-primary">
          For Employers
        </Link>
        <Link href="/resources" className="text-sm font-medium transition-colors hover:text-primary">
          Resources
        </Link>
      </nav>
    </div>
  )
}
