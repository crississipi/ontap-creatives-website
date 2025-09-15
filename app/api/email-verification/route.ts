import nodemailer from "nodemailer";
import { otpStore, generateOtp } from "@/lib/otpStore";
import { corsHeaders } from "@/lib/corsHeaders";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  const { email, name } = await req.json();

  if (!email || !name) {
    return Response.json(
      { success: false, message: "Credentials are required." },
      { status: 400, headers: corsHeaders }
    );
  }

  const otp = generateOtp();
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

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
      from: `"Ontap Creatives Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Ontap Creatives: Account Sign-Up Verification",
      html: `<p>Hi <strong>${name}</strong>, your OTP is <strong>${otp}</strong>.</p>`,
    });

    return Response.json(
      { success: true, message: "OTP sent to email" },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Failed to send OTP:", err);
    return Response.json(
      { success: false, message: "Failed to send email" },
      { status: 500, headers: corsHeaders }
    );
  }
}
