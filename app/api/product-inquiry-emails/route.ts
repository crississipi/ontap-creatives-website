import nodemailer from "nodemailer";
import { corsHeaders } from "@/lib/corsHeaders";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  const { email, name, subject, message, compName, time } = await req.json();

  if (!email || !name || !subject || !message) {
    return Response.json(
      { success: false, message: "Missing required fields" },
      { status: 400, headers: corsHeaders }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"OnTap Inquiry" <${process.env.SMTP_USER}>`,
      to: 'design.ontap.ph@gmail.com',
      subject,
      html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px;">
        <div><a href='mailto:${email}'><strong>${email}</strong></a> ${compName && `of ${compName}`} has sent you an email.&nbsp; Kindly reply at your earliest convenience.</div>
        <div style="margin-top: 20px; padding: 15px 0; border-width: 1px 0; border-style: dashed; border-color: lightgrey;">
        <table role="presentation">
        <tbody>
        <tr>
        <td style="vertical-align: top;">
        <div style="color: #2c3e50; font-size: 18px;"><strong>Client Name: ${name}</strong>${compName ? `<strong><em>Company: ${compName}</em></strong>` : ``}</div>
        <div style="color: #000000; font-size: 12px; margin-top: 10px;">${time}</div>
        <div style="font-size: 16px;">${message}</div>
        </td>
        </tr>
        </tbody>
        </table>
        </div>
        </div>`,
    });

    return Response.json(
      { success: true, message: "Email sent successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Inquiry email error:", error);
    return Response.json(
      { success: false, message: "Failed to send email" },
      { status: 500, headers: corsHeaders }
    );
  }
}
