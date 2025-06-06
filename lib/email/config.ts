import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is required")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Use environment variables for email configuration, with fallbacks
const fromAddress = process.env.EMAIL_FROM_ADDRESS || "JobBoard <noreply@yourdomain.com>"
const replyToAddress = process.env.EMAIL_REPLY_TO || "support@yourdomain.com"

export const EMAIL_CONFIG = {
  from: fromAddress,
  replyTo: replyToAddress,
} as const
