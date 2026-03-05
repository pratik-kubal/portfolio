import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 })
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ success: false, message: "Input too long" }, { status: 400 })
    }

    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}

Sent from: Portfolio Contact Form
Time: ${new Date().toLocaleString()}
    `.trim()

    const mailtoUrl = `mailto:pratik.kubal@example.com?subject=${encodeURIComponent(`Portfolio Contact from ${name}`)}&body=${encodeURIComponent(emailContent)}`

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
