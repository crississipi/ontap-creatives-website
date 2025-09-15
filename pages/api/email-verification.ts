// pages/api/email-verification.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type ResponseData = {
  success: boolean;
  message: string;
};

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Credentials are required.' });
  }



  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(email, { otp, expiresAt });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
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
      subject: 'Ontap Creatives: Account Sign-Up Verification',
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
    return res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (error: any) {
    console.error('Failed to send OTP email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
}


export { otpStore };


