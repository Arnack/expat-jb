"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.replace("/auth/login")
          return
        }

        setSession(session)
      } catch (error) {
        console.error('Payment success page authentication failed:', error)
        router.replace("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthentication()
  }, [router])

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const paymentIntentId = searchParams.payment_intent as string

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg">Your job posting has been published successfully.</p>
              <p className="text-muted-foreground">
                Your job is now live and visible to thousands of job seekers worldwide.
              </p>
            </div>

            {paymentIntentId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Payment ID:</strong> {paymentIntentId}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Keep this for your records</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/employer/dashboard">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/employer/post-job">Post Another Job</Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Your job posting will remain active for 30 days.</p>
              <p>You can manage your postings from your dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
