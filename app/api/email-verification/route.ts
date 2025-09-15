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
      html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px">
  <div
    style="padding: 15px 0;"
  >
    <table role="presentation">
      <tr>
        <td style="vertical-align: top; text-align: center">
          <div
            style="
              padding: 6px 10px;
              margin: 0 10px;
              border-radius: 5px;
            "
            role="img"
          >
            <img src="https://github.com/burnboxprinting/ontap-website/raw/main/logo-ontap.png" alt="ontap-logo"/>
          </div>
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top">
          <p>Hi <strong>${name}</strong>,
          Welcome to OnTap Creatives, we're excited to have you on board!
          
          To complete your registration and verify your email address, please use the One-Time Code (OTC) below:</p>
          <br><br>
          <div style="text-align:center; font-size:24px; font-weight:bold; letter-spacing:6px; color:#2E86C1; margin: 20px 0;"> ${otp} </div> <br>
          <p>
            This code is valid for 10 minutes and can only be used once.
            <br/><br/>
          If you didn't request this, you can safely ignore this message, no further action will be taken.
          <br/><br/>
          Thanks for choosing OnTap Creatives.
          Let's bring your vision to life.
          </p>
          <br><br>
          <p style="padding-bottom: 20px">
          Best regards,
          <strong>The OnTap Creatives Team</strong></p>
          <p style="color: #2E86C1; font-size: 12px; padding: 10px 0px; border-top: 1px solid #2E86C1">This is an automated message. Please do not reply to this email.</p>
        </td>
      </tr>
    </table>
  </div>
</div>`,
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
