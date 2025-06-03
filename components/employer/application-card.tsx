"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { MapPin, Calendar, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface ApplicationCardProps {
  application: Application
  isSelected: boolean
  onClick: () => void
  onStatusUpdate: (applicationId: string, status: string) => void
  isUpdating: boolean
}

export function ApplicationCard({
  application,
  isSelected,
  onClick,
  onStatusUpdate,
  isUpdating,
}: ApplicationCardProps) {
  const applicantName = application.job_seeker_profiles?.user_profiles?.full_name || "Anonymous"
  const headline = application.job_seeker_profiles?.headline
  const location = application.job_seeker_profiles?.location
  const hasCV = !!application.job_seeker_profiles?.cv_url

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

  const handleStatusUpdate = (e: React.MouseEvent, status: string) => {
    e.stopPropagation()
    onStatusUpdate(application.id, status)
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary ring-1 ring-primary" : ""
      } ${application.status === "pending" ? "border-l-4 border-l-yellow-500" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{applicantName}</h3>
                {headline && <p className="text-sm text-muted-foreground truncate">{headline}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(application.status)} variant="outline">
                {application.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => handleStatusUpdate(e, "viewed")}
                    disabled={isUpdating || application.status === "viewed"}
                  >
                    Mark as Viewed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleStatusUpdate(e, "contacted")}
                    disabled={isUpdating || application.status === "contacted"}
                  >
                    Mark as Contacted
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleStatusUpdate(e, "rejected")}
                    disabled={isUpdating || application.status === "rejected"}
                  >
                    Mark as Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}</span>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex items-center gap-2">
            {hasCV && (
              <Badge variant="outline" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                CV
              </Badge>
            )}
            {application.cover_letter && (
              <Badge variant="outline" className="text-xs">
                Cover Letter
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
