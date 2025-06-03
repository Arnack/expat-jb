import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function PaymentFailedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const error = searchParams.error as string

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg">We couldn't process your payment.</p>
              <p className="text-muted-foreground">Don't worry, your job posting has been saved as a draft.</p>
            </div>

            {error && (
              <div className="bg-destructive/10 p-4 rounded-lg">
                <p className="text-sm text-destructive">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/employer/post-job">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/employer/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Common reasons for payment failure:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Insufficient funds</li>
                <li>Incorrect card details</li>
                <li>Card expired or blocked</li>
                <li>Bank security restrictions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
