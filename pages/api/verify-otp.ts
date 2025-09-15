// pages/api/verify-otp.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { otpStore } from './email-verification';

type EmailRequestBody = {
    email: string,
    otp: string;
}

type ResponseData = {
  success: boolean;
  message: string;
};


export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, otp } = req.body as EmailRequestBody;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }


  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
  }
  
  const { otp: validOtp, expiresAt } = record;

  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (otp !== validOtp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  otpStore.delete(email); // Clear on successful verification

  return res.status(200).json({ success: true, message: 'OTP verified successfully' });
}






