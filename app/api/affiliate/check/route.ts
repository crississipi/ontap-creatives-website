import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, username } = await req.json();

    if (!email && !username) {
      return NextResponse.json(
        { error: 'Email or username is required' },
        { status: 400 }
      );
    }

    const checks: { emailExists?: boolean; usernameExists?: boolean } = {};

    // Check if email already exists
    if (email) {
      const existingEmail = await prisma.affiliateApplication.findFirst({
        where: {
          primaryEmail: email.toLowerCase().trim(),
        },
      });
      checks.emailExists = !!existingEmail;
    }

    // Check if username already exists
    if (username) {
      const existingUsername = await prisma.affiliateApplication.findFirst({
        where: {
          desiredAffiliateUsername: username.toLowerCase().trim(),
        },
      });
      checks.usernameExists = !!existingUsername;
    }

    return NextResponse.json(checks);
  } catch (error) {
    console.error('Error checking affiliate data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
