"use server"

import { stripe } from "@/lib/stripe/config"
import { createClient } from "@/lib/supabase/server"

export async function createPaymentIntent(jobId: string, plan: string) {
  const supabase = await createClient()

  try {
    // Verify user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Get job posting
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", jobId)
      .eq("employer_id", session.user.id)
      .single()

    if (jobError || !job) {
      throw new Error("Job not found")
    }

    // Verify job is in draft status
    if (job.status !== "draft") {
      throw new Error("Job is already published")
    }

    // Get plan pricing
    const planPrices = {
      standard: 488, // 4.88 EUR in cents
      premium: 988, // 9.88 EUR in cents
      pro: 1988, // 19.88 EUR in cents
    }

    const amount = planPrices[plan as keyof typeof planPrices]
    if (!amount) {
      throw new Error("Invalid plan")
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      metadata: {
        jobId,
        plan,
        employerId: session.user.id,
        jobTitle: job.title,
      },
      description: `Job posting: ${job.title} (${plan} plan)`,
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error: any) {
    console.error("Payment intent creation failed:", error)
    throw new Error(error.message || "Failed to create payment intent")
  }
}

export async function confirmJobPublication(paymentIntentId: string) {
  const supabase = await createClient()

  try {
    // Verify user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not completed")
    }

    const { jobId, plan } = paymentIntent.metadata

    // Update job status to published
    const { error: updateError } = await supabase
      .from("job_postings")
      .update({
        status: "published",
        plan,
        published_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", jobId)
      .eq("employer_id", session.user.id)

    if (updateError) {
      throw updateError
    }

    return { success: true, jobId }
  } catch (error: any) {
    console.error("Job publication confirmation failed:", error)
    throw new Error(error.message || "Failed to confirm job publication")
  }
}
