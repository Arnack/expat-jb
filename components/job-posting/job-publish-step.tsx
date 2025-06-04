"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"
import { Check, Crown, Star, Zap, Loader2 } from "lucide-react"
import type { JobFormData, EmployerProfile } from "@/types"
import { createPaymentIntent, confirmJobPublication } from "@/app/actions/payment"
import { StripePaymentForm } from "@/components/payment/stripe-payment-form"

interface JobPublishStepProps {
  formData: JobFormData
  employerId: string
  employerProfile: EmployerProfile | null
  onSuccess: () => void
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Basic job posting",
    features: [
      "Job posted for 30 days",
      "Standard listing",
      "Basic applicant tracking",
      "Maximum 3 active jobs per account",
    ],
    limitations: ["No editing after publication", "No priority placement", "No employer contact visibility"],
    icon: <Check className="h-5 w-5" />,
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: 4.88,
    description: "Enhanced visibility",
    features: [
      "Everything in Free",
      "Priority placement in search results",
      "Edit job posting anytime",
      "Employer contact information visible",
      "Featured in category listings",
    ],
    icon: <Star className="h-5 w-5" />,
    popular: true,
  },
  // {
  //   id: "premium",
  //   name: "Premium",
  //   price: 9.88,
  //   description: "Maximum exposure",
  //   features: [
  //     "Everything in Standard",
  //     "Top placement in all searches",
  //     "Highlighted job posting",
  //     "Social media promotion",
  //     "Priority customer support",
  //   ],
  //   icon: <Crown className="h-5 w-5" />,
  //   popular: false,
  // },
  // {
  //   id: "pro",
  //   name: "Pro",
  //   price: 19.88,
  //   description: "Ultimate package",
  //   features: [
  //     "Everything in Premium",
  //     "Featured on homepage",
  //     "Email newsletter inclusion",
  //     "Dedicated account manager",
  //     "Advanced analytics",
  //     "Unlimited job edits",
  //   ],
  //   icon: <Zap className="h-5 w-5" />,
  //   popular: false,
  // },
]

export function JobPublishStep({ formData, employerId, employerProfile, onSuccess }: JobPublishStepProps) {
  const [selectedPlan, setSelectedPlan] = useState("free")
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<"idle" | "creating" | "payment" | "confirming">("idle")
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string
    paymentIntentId: string
    amount: number
  } | null>(null)

  const handlePublish = async () => {
    setIsPublishing(true)
    setError(null)

    try {
      // Check if user has reached free job limit
      if (selectedPlan === "free") {
        const { data: existingJobs, error: countError } = await supabase
          .from("job_postings")
          .select("id")
          .eq("employer_id", employerId)
          .eq("plan", "free")
          .eq("status", "published")

        if (countError) throw countError

        if (existingJobs && existingJobs.length >= 3) {
          setError("You have reached the maximum of 3 free job postings. Please upgrade to a paid plan.")
          return
        }
      }

      // Create job posting
      const jobData = {
        employer_id: employerId,
        title: formData.title,
        country: formData.country || null,
        city: formData.city || null,
        place_nominatum_id: formData.placeNominatumId || null,
        description: formData.description,
        salary_from: formData.salaryFrom,
        salary_to: formData.salaryTo,
        email_to_apply: formData.emailToApply || null,
        link_to_apply: formData.linkToApply || null,
        is_global_remote: formData.isGlobalRemote,
        is_visa_sponsorship: formData.isVisaSponsorship,
        sphere: formData.sphere || null,
        plan: selectedPlan,
        status: selectedPlan === "free" ? "published" : "draft", // Paid plans need payment first
        published_at: selectedPlan === "free" ? new Date().toISOString() : null,
        expires_at: selectedPlan === "free" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      }

      const { data: job, error: jobError } = await supabase.from("job_postings").insert(jobData).select().single()

      if (jobError) throw jobError

      if (selectedPlan === "free") {
        // Free plan - job is published immediately
        onSuccess()
      } else {
        // Paid plan - redirect to payment
        await handlePayment(job.id)
      }
    } catch (err: any) {
      setError(err.message || "Failed to publish job")
    } finally {
      setIsPublishing(false)
    }
  }

  const handlePayment = async (jobId: string) => {
    try {
      setPaymentStep("creating")

      // Create payment intent
      const result = await createPaymentIntent(jobId, selectedPlan)

      setPaymentData({
        clientSecret: result.clientSecret!,
        paymentIntentId: result.paymentIntentId!,
        amount: plans.find((p) => p.id === selectedPlan)?.price || 0,
      })

      setPaymentStep("payment")
    } catch (err: any) {
      setError(err.message || "Failed to initialize payment")
      setPaymentStep("idle")
    }
  }

  const handlePaymentSuccess = async () => {
    if (!paymentData) return

    setPaymentStep("confirming")

    try {
      await confirmJobPublication(paymentData.paymentIntentId)
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Failed to confirm payment")
      setPaymentStep("payment")
    }
  }

  const handlePaymentError = (error: string) => {
    setError(error)
    setPaymentStep("payment")
  }

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Publishing Plan</h2>
        <p className="text-muted-foreground">Select the plan that best fits your hiring needs</p>
      </div>

      {paymentStep === "payment" && paymentData ? (
        <StripePaymentForm
          clientSecret={paymentData.clientSecret}
          amount={paymentData.amount}
          jobTitle={formData.title}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      ) : (
        <>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="relative">
                  <Label htmlFor={plan.id} className="cursor-pointer">
                    <Card
                      className={`transition-all hover:border-primary ${
                        selectedPlan === plan.id ? "border-primary ring-1 ring-primary" : ""
                      } ${plan.popular ? "border-primary/50" : ""}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {plan.icon}
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                          </div>
                          <RadioGroupItem value={plan.id} id={plan.id} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">{plan.price === 0 ? "Free" : `€${plan.price}`}</span>
                            {plan.price > 0 && <span className="text-sm text-muted-foreground">per job</span>}
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        {plan.limitations && (
                          <div className="space-y-2 pt-2 border-t">
                            {plan.limitations.map((limitation, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                </div>
                                <span>{limitation}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Publishing Summary</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Plan:</strong> {selectedPlanData?.name}
                  </p>
                  <p>
                    <strong>Cost:</strong> {selectedPlanData?.price === 0 ? "Free" : `€${selectedPlanData?.price}`}
                  </p>
                  <p>
                    <strong>Duration:</strong> 30 days
                  </p>
                  <p>
                    <strong>Job Title:</strong> {formData?.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handlePublish}
              disabled={isPublishing || paymentStep !== "idle"}
              className="min-w-[200px]"
            >
              {isPublishing || paymentStep === "creating" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {paymentStep === "creating" ? "Preparing Payment..." : "Publishing..."}
                </>
              ) : paymentStep === "confirming" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming Payment...
                </>
              ) : (
                <>{selectedPlan === "free" ? "Publish Job for Free" : `Continue to Payment`}</>
              )}
            </Button>
          </div>

          {selectedPlan !== "free" && paymentStep === "idle" && (
            <div className="text-center text-sm text-muted-foreground">
              <p>You will be redirected to our secure payment form</p>
              <p>Your job will be published immediately after successful payment</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
