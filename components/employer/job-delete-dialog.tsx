"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"

interface JobDeleteDialogProps {
  jobId: string
  jobTitle: string
}

export function JobDeleteDialog({ jobId, jobTitle }: JobDeleteDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      // Check for applications first
      const { data: applications, error: appError } = await supabase
        .from("job_applications")
        .select("id")
        .eq("job_id", jobId)
        .limit(1)

      if (appError) throw appError

      // If there are applications, we need to delete them first
      if (applications && applications.length > 0) {
        const { error: deleteAppError } = await supabase.from("job_applications").delete().eq("job_id", jobId)

        if (deleteAppError) throw deleteAppError
      }

      // Now delete the job
      const { error: deleteJobError } = await supabase.from("job_postings").delete().eq("id", jobId)

      if (deleteJobError) throw deleteJobError

      setIsOpen(false)
      router.push("/employer/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete job")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex items-center gap-1">
          <Trash2 className="h-4 w-4" />
          Delete Job
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Job Posting</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this job posting? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="font-medium">{jobTitle}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Deleting this job will remove it permanently and delete all associated applications.
          </p>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
