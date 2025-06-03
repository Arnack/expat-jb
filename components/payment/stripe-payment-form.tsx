"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Shield } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  clientSecret: string
  amount: number
  jobTitle: string
  plan: string
  onSuccess: () => void
  onError: (error: string) => void
}

function PaymentForm({ clientSecret, amount, jobTitle, plan, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/employer/payment/success`,
      },
      redirect: "if_required",
    })

    if (error) {
      setMessage(error.message || "An unexpected error occurred.")
      onError(error.message || "Payment failed")
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess()
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Job Title:</span>
              <span className="font-medium">{jobTitle}</span>
            </div>
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-medium capitalize">{plan}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>30 days</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>€{(amount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Secure payment powered by Stripe</span>
          </div>

          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>

        {message && (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      <Button type="submit" disabled={!stripe || isProcessing} className="w-full" size="lg">
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay €${(amount / 100).toFixed(2)} & Publish Job`
        )}
      </Button>
    </form>
  )
}

interface StripePaymentFormProps {
  clientSecret: string
  amount: number
  jobTitle: string
  plan: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  const options = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Your Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm {...props} />
        </Elements>
      </CardContent>
    </Card>
  )
}
