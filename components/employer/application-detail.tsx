"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { MapPin, Calendar, FileText, Download, Mail, User, Briefcase, MessageSquare, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface ApplicationDetailProps {
  application: Application
  onStatusUpdate: (applicationId: string, status: string) => void
  isUpdating: boolean
}

export function ApplicationDetail({ application, onStatusUpdate, isUpdating }: ApplicationDetailProps) {
  const applicantName = application.job_seeker_profiles?.user_profiles?.full_name || "Anonymous"
  const headline = application.job_seeker_profiles?.headline
  const summary = application.job_seeker_profiles?.summary
  const location = application.job_seeker_profiles?.location
  const cvUrl = application.job_seeker_profiles?.cv_url

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "viewed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "contacted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getInitials = () => {
    return applicantName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(application.id, newStatus)
  }

  const handleDownloadCV = () => {
    if (cvUrl) {
      window.open(cvUrl, "_blank")
    }
  }

  return (
    <div className="space-y-6">
      {/* Candidate Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{applicantName}</h2>
                {headline && <p className="text-lg text-muted-foreground">{headline}</p>}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(application.status)} variant="outline">
                {application.status}
              </Badge>
              <Select value={application.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {cvUrl && (
          <Button onClick={handleDownloadCV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download CV
          </Button>
        )}
        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Contact Candidate
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          View Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No professional summary provided.</p>
            )}
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Application Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <Badge className={`ml-2 ${getStatusColor(application.status)}`} variant="outline">
                  {application.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Applied:</span>
                <span className="ml-2">{new Date(application.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium">CV:</span>
                <span className="ml-2">{cvUrl ? "✓ Uploaded" : "✗ Not provided"}</span>
              </div>
              <div>
                <span className="font-medium">Cover Letter:</span>
                <span className="ml-2">{application.cover_letter ? "✓ Included" : "✗ Not provided"}</span>
              </div>
            </div>

            {cvUrl && (
              <div className="pt-2 border-t">
                <Button variant="outline" size="sm" onClick={handleDownloadCV} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View CV/Resume
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cover Letter */}
      {application.cover_letter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Cover Letter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{application.cover_letter}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handleStatusChange("contacted")}
              disabled={isUpdating || application.status === "contacted"}
              className="w-full"
            >
              Mark as Contacted
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusChange("rejected")}
              disabled={isUpdating || application.status === "rejected"}
              className="w-full"
            >
              Reject Application
            </Button>
            <Button variant="outline" className="w-full">
              Schedule Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
