import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validation helper functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phone: string): boolean {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  // Check if it has between 10 and 15 digits (international format)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      'fullLegalName',
      'dateOfBirth',
      'nationality',
      'primaryEmail',
      'mobileNumber',
      'completeResidentialAddress',
      'city',
      'province',
      'country',
      'timeZone',
      'desiredAffiliateUsername',
      'howDidYouHear',
      'currentOccupation',
      'employmentType',
      'industryField',
      'yearsOfExperience',
      'previousAffiliateExperience',
      'primarySkills',
      'toolsPlatformsUsed',
      'audienceDescription',
      'geographicReach',
      'estimatedAudienceSize',
      'marketingChannels',
      'promotionPlan',
      'primaryContentFormat',
      'accurateInformationConfirmed',
      'termsConditionsAgreed',
      'privacyPolicyAgreed',
      'brandingGuidelinesConfirmed',
      'ethicalMarketingConfirmed',
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(data.primaryEmail)) {
      return NextResponse.json(
        { error: 'Invalid primary email format' },
        { status: 400 }
      );
    }

    if (data.secondaryEmail && !validateEmail(data.secondaryEmail)) {
      return NextResponse.json(
        { error: 'Invalid secondary email format' },
        { status: 400 }
      );
    }

    // Validate phone numbers
    if (!validatePhoneNumber(data.mobileNumber)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }

    if (
      data.alternativeContactNumber &&
      !validatePhoneNumber(data.alternativeContactNumber)
    ) {
      return NextResponse.json(
        { error: 'Invalid alternative contact number format' },
        { status: 400 }
      );
    }

    // Validate URLs if provided
    if (data.businessWebsiteUrl && !validateURL(data.businessWebsiteUrl)) {
      return NextResponse.json(
        { error: 'Invalid business website URL' },
        { status: 400 }
      );
    }

    if (data.websiteBlogUrl && !validateURL(data.websiteBlogUrl)) {
      return NextResponse.json(
        { error: 'Invalid website/blog URL' },
        { status: 400 }
      );
    }

    // Validate agreements
    if (
      !data.accurateInformationConfirmed ||
      !data.termsConditionsAgreed ||
      !data.privacyPolicyAgreed ||
      !data.brandingGuidelinesConfirmed ||
      !data.ethicalMarketingConfirmed
    ) {
      return NextResponse.json(
        { error: 'All agreements must be confirmed' },
        { status: 400 }
      );
    }

    // Check for existing email or username
    const existingEmail = await prisma.affiliateApplication.findFirst({
      where: {
        primaryEmail: data.primaryEmail.toLowerCase().trim(),
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.affiliateApplication.findFirst({
      where: {
        desiredAffiliateUsername: data.desiredAffiliateUsername
          .toLowerCase()
          .trim(),
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 409 }
      );
    }

    // Parse marketing channels if it's a string
    let marketingChannels = data.marketingChannels;
    if (typeof marketingChannels === 'object') {
      marketingChannels = JSON.stringify(marketingChannels);
    }

    // Parse social media links if it's an object
    let socialMediaLinks = data.socialMediaLinks;
    if (typeof socialMediaLinks === 'object') {
      socialMediaLinks = JSON.stringify(socialMediaLinks);
    }

    // Create the affiliate application
    const application = await prisma.affiliateApplication.create({
      data: {
        // Part 1: General Information
        fullLegalName: data.fullLegalName.trim(),
        preferredDisplayName: data.preferredDisplayName?.trim() || null,
        dateOfBirth: new Date(data.dateOfBirth),
        nationality: data.nationality.trim(),
        govIdType: data.govIdType?.trim() || null,
        govIdNumber: data.govIdNumber?.trim() || null,
        primaryEmail: data.primaryEmail.toLowerCase().trim(),
        secondaryEmail: data.secondaryEmail?.toLowerCase().trim() || null,
        mobileNumber: data.mobileNumber.trim(),
        alternativeContactNumber: data.alternativeContactNumber?.trim() || null,
        completeResidentialAddress: data.completeResidentialAddress.trim(),
        city: data.city.trim(),
        province: data.province.trim(),
        country: data.country.trim(),
        timeZone: data.timeZone.trim(),
        desiredAffiliateUsername: data.desiredAffiliateUsername
          .toLowerCase()
          .trim(),
        howDidYouHear: data.howDidYouHear.trim(),

        // Part 2: Occupation History / Relevant Experience
        currentOccupation: data.currentOccupation.trim(),
        employmentType: data.employmentType.trim(),
        companyBusinessName: data.companyBusinessName?.trim() || null,
        industryField: data.industryField.trim(),
        yearsOfExperience: data.yearsOfExperience.trim(),
        previousAffiliateExperience: Boolean(data.previousAffiliateExperience),
        platformsWorkedWith: data.platformsWorkedWith?.trim() || null,
        durationOfAffiliateExp: data.durationOfAffiliateExp?.trim() || null,
        averageMonthlyPerformance:
          data.averageMonthlyPerformance?.trim() || null,
        primarySkills: data.primarySkills.trim(),
        toolsPlatformsUsed: data.toolsPlatformsUsed.trim(),
        registeredBusinessName: data.registeredBusinessName?.trim() || null,
        businessType: data.businessType?.trim() || null,
        businessWebsiteUrl: data.businessWebsiteUrl?.trim() || null,

        // Part 3: Marketing Strategy & Audience Reach
        audienceDescription: data.audienceDescription.trim(),
        geographicReach: data.geographicReach.trim(),
        estimatedAudienceSize: data.estimatedAudienceSize.trim(),
        marketingChannels: marketingChannels,
        socialMediaLinks: socialMediaLinks || null,
        websiteBlogUrl: data.websiteBlogUrl?.trim() || null,
        emailListSize: data.emailListSize?.trim() || null,
        promotionPlan: data.promotionPlan.trim(),
        primaryContentFormat: data.primaryContentFormat.trim(),
        estimatedMonthlySales: data.estimatedMonthlySales?.trim() || null,

        // Part 4: Agreements and Compliance
        accurateInformationConfirmed: Boolean(
          data.accurateInformationConfirmed
        ),
        termsConditionsAgreed: Boolean(data.termsConditionsAgreed),
        privacyPolicyAgreed: Boolean(data.privacyPolicyAgreed),
        brandingGuidelinesConfirmed: Boolean(
          data.brandingGuidelinesConfirmed
        ),
        ethicalMarketingConfirmed: Boolean(data.ethicalMarketingConfirmed),
        competingAffiliations: data.competingAffiliations?.trim() || null,

        applicationStatus: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        applicationId: application.applicationID,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting affiliate application:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
