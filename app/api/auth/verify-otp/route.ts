import { otpStore } from "@/lib/otpStore";
import { corsHeaders } from "@/lib/corsHeaders";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return Response.json(
      { success: false, message: "Email and OTP are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const record = otpStore.get(email);
  if (!record) {
    return Response.json(
      { success: false, message: "No OTP requested for this email" },
      { status: 400, headers: corsHeaders }
    );
  }

  const { otp: validOtp, expiresAt } = record;
  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return Response.json(
      { success: false, message: "OTP expired" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (otp !== validOtp) {
    return Response.json(
      { success: false, message: "Invalid OTP" },
      { status: 400, headers: corsHeaders }
    );
  }

  otpStore.delete(email);
  return Response.json(
    { success: true, message: "OTP verified successfully" },
    { status: 200, headers: corsHeaders }
  );
}
