import { NextRequest, NextResponse } from "next/server"
import { sendTestEmail } from "@/lib/email/test"

export async function POST(request: NextRequest) {
  try {
    const { to, subject } = await request.json()

    if (!to) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    const result = await sendTestEmail({ to, subject })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        data: result.data
      })
    } else {
      return NextResponse.json(
        { error: "Failed to send test email", details: result.error },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("❌ Test email API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email test endpoint. Use POST with { 'to': 'email@example.com' }"
  })
} 