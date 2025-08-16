import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}

Sent from: Portfolio Contact Form
Time: ${new Date().toLocaleString()}
    `.trim()

    const mailtoUrl = `mailto:pratik.kubal@example.com?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(emailContent)}`

    return NextResponse.json({
      success: true,
      mailtoUrl,
      message: "Email prepared successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ success: false, message: "Failed to process contact form" }, { status: 500 })
  }
}
