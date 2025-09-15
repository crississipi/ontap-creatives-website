// pages/api/product-inquiry-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type EmailRequestBody = {
  email: string;
  name: string;
  subject: string;
  message: string;
  compName?: string;
  time: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email, name, subject, message, compName, time } = req.body as EmailRequestBody;

  if (!email || !name || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

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
      from: `"OnTap Inquiry" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px;">
        <div><strong>${email}</strong> of <a href='mailto:${compName}'>${compName}</a> has sent you an email.&nbsp; Kindly reply at your earliest convenience.</div>
        <div style="margin-top: 20px; padding: 15px 0; border-width: 1px 0; border-style: dashed; border-color: lightgrey;">
        <table role="presentation">
        <tbody>
        <tr>
        <td style="vertical-align: top;">
        <div style="color: #2c3e50; font-size: 18px;"><strong>Client Name: ${name}</strong><strong><em>Company: ${compName}</em></strong></div>
        <div style="color: #000000; font-size: 12px;">${time}</div>
        <span style="font-size: 16px;">${message}</span>
        </td>
        </tr>
        </tbody>
        </table>
        </div>
        </div>`,
    });
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Inquiry email error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
}








