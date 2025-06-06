import { resend, EMAIL_CONFIG } from "./config"

interface SendTestEmailProps {
  to: string
  subject?: string
}

export async function sendTestEmail({ 
  to, 
  subject = "JobBoard Email Test" 
}: SendTestEmailProps) {
  try {
    console.log(`📧 Sending test email to: ${to}`)
    
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">🎉 Email Test Successful!</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #666;">
            Congratulations! Your Resend email configuration is working properly.
          </p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Configuration Details:</h3>
            <ul style="color: #666;">
              <li><strong>From:</strong> ${EMAIL_CONFIG.from}</li>
              <li><strong>Reply To:</strong> ${EMAIL_CONFIG.replyTo}</li>
              <li><strong>Test Sent To:</strong> ${to}</li>
              <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
            </ul>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            This is a test email from your JobBoard application.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("❌ Failed to send test email:", error)
      return { success: false, error }
    }

    console.log(`✅ Test email sent successfully to: ${to}`, data)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Error sending test email:", error)
    return { success: false, error }
  }
} 