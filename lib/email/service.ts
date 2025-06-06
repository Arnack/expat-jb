import { resend, EMAIL_CONFIG } from "./config"
import { ApplicationReceivedEmail } from "@/components/emails/application-received"
import { ApplicationConfirmationEmail } from "@/components/emails/application-confirmation"
import { ApplicationStatusUpdateEmail } from "@/components/emails/application-status-update"
import { render } from "@react-email/render"

interface SendApplicationReceivedEmailProps {
  to: string
  employerName: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  coverLetter?: string
  applicationUrl: string
  jobUrl: string
}

export async function sendApplicationReceivedEmail({
  to,
  employerName,
  jobTitle,
  applicantName,
  applicantEmail,
  coverLetter,
  applicationUrl,
  jobUrl,
}: SendApplicationReceivedEmailProps) {
  try {
    console.log(`📧 Sending application received email to: ${to} for job: ${jobTitle}`)
    
    const emailHtml = await render(
      ApplicationReceivedEmail({
        employerName,
        jobTitle,
        applicantName,
        applicantEmail,
        coverLetter,
        applicationUrl,
        jobUrl,
      }),
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: `New Application: ${jobTitle}`,
      html: emailHtml,
    })

    if (error) {
      console.error("❌ Failed to send application received email:", error)
      return { success: false, error }
    }

    console.log(`✅ Application received email sent successfully to: ${to}`, data)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Error sending application received email:", error)
    return { success: false, error }
  }
}

interface SendApplicationConfirmationEmailProps {
  to: string
  applicantName: string
  jobTitle: string
  companyName: string
  applicationDate: string
  jobUrl: string
  dashboardUrl: string
}

export async function sendApplicationConfirmationEmail({
  to,
  applicantName,
  jobTitle,
  companyName,
  applicationDate,
  jobUrl,
  dashboardUrl,
}: SendApplicationConfirmationEmailProps) {
  try {
    console.log(`📧 Sending application confirmation email to: ${to} for job: ${jobTitle}`)
    
    const emailHtml = await render(
      ApplicationConfirmationEmail({
        applicantName,
        jobTitle,
        companyName,
        applicationDate,
        jobUrl,
        dashboardUrl,
      }),
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: `Application Confirmed: ${jobTitle}`,
      html: emailHtml,
    })

    if (error) {
      console.error("❌ Failed to send application confirmation email:", error)
      return { success: false, error }
    }

    console.log(`✅ Application confirmation email sent successfully to: ${to}`, data)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Error sending application confirmation email:", error)
    return { success: false, error }
  }
}

interface SendApplicationStatusUpdateEmailProps {
  to: string
  applicantName: string
  jobTitle: string
  companyName: string
  oldStatus: string
  newStatus: string
  statusMessage?: string
  applicationUrl: string
  jobUrl: string
}

export async function sendApplicationStatusUpdateEmail({
  to,
  applicantName,
  jobTitle,
  companyName,
  oldStatus,
  newStatus,
  statusMessage,
  applicationUrl,
  jobUrl,
}: SendApplicationStatusUpdateEmailProps) {
  try {
    console.log(`📧 Sending application status update email to: ${to} for job: ${jobTitle} (${oldStatus} → ${newStatus})`)
    
    const emailHtml = await render(
      ApplicationStatusUpdateEmail({
        applicantName,
        jobTitle,
        companyName,
        oldStatus,
        newStatus,
        statusMessage,
        applicationUrl,
        jobUrl,
      }),
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: `Application Update: ${jobTitle}`,
      html: emailHtml,
    })

    if (error) {
      console.error("❌ Failed to send application status update email:", error)
      return { success: false, error }
    }

    console.log(`✅ Application status update email sent successfully to: ${to}`, data)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Error sending application status update email:", error)
    return { success: false, error }
  }
}
