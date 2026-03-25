import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Verify Environment Variables
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing Resend SDK Key in Environment Variables.");
      return NextResponse.json(
        { success: false, message: "Server configuration missing Email API key." },
        { status: 500 }
      );
    }

    // Initialize Resend dynamically to prevent Next.js build crash
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Dispatch the email via Resend Transaction API
    const { data, error } = await resend.emails.send({
      from: 'IELA Website <onboarding@resend.dev>', // Resend's required free testing domain
      to: 'rajan.pusalkar51@gmail.com',             // This MUST be the email you used to sign up for Resend
      replyTo: email,                               // Allows you to hit 'Reply' directly to the sender!
      subject: `New Legal Inquiry from ${name}`,
      text: `
You have received a new secure inquiry from the India Energy Law Association website:

-----------------------------------------
NAME:   ${name}
EMAIL:  ${email}
PHONE:  ${phone}
-----------------------------------------

MESSAGE:
${message}
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Internal API Route Error:", error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while dispatching email.' },
      { status: 500 }
    );
  }
}
