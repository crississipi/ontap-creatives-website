import { otpStore } from '@/lib/otpStore';
import cors from '@/lib/cors';

export async function OPTIONS(req: Request) {
  await cors(req as any, {} as any);
  return new Response(null, { status: 200 });
}

export async function POST(req: Request) {
  await cors(req as any, {} as any);

  const { email, otp } = await req.json();

  if (!email || !otp) {
    return Response.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
  }

  const record = otpStore.get(email);
  if (!record) {
    return Response.json({ success: false, message: 'No OTP requested for this email' }, { status: 400 });
  }

  const { otp: validOtp, expiresAt } = record;
  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return Response.json({ success: false, message: 'OTP expired' }, { status: 400 });
  }

  if (otp !== validOtp) {
    return Response.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
  }

  otpStore.delete(email);
  return Response.json({ success: true, message: 'OTP verified successfully' }, { status: 200 });
}
