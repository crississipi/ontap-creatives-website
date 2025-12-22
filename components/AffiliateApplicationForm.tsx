"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Part1 from './affiliate/Part1';
import Part2 from './affiliate/Part2';
import Part3 from './affiliate/Part3';
import Part4 from './affiliate/Part4';

// Types
interface FormData {
  // Part 1: General Information
  fullLegalName: string;
  preferredDisplayName: string;
  dateOfBirth: string;
  nationality: string;
  govIdType: string;
  govIdNumber: string;
  primaryEmail: string;
  secondaryEmail: string;
  mobileNumber: string;
  alternativeContactNumber: string;
  completeResidentialAddress: string;
  city: string;
  province: string;
  country: string;
  timeZone: string;
  desiredAffiliateUsername: string;
  howDidYouHear: string;

  // Part 2: Occupation History
  currentOccupation: string;
  employmentType: string;
  companyBusinessName: string;
  industryField: string;
  yearsOfExperience: string;
  previousAffiliateExperience: boolean;
  platformsWorkedWith: string;
  durationOfAffiliateExp: string;
  averageMonthlyPerformance: string;
  primarySkills: string;
  toolsPlatformsUsed: string;
  registeredBusinessName: string;
  businessType: string;
  businessWebsiteUrl: string;

  // Part 3: Marketing Strategy
  audienceDescription: string;
  geographicReach: string;
  estimatedAudienceSize: string;
  marketingChannels: string[];
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  websiteBlogUrl: string;
  emailListSize: string;
  promotionPlan: string;
  primaryContentFormat: string;
  estimatedMonthlySales: string;

  // Part 4: Agreements
  accurateInformationConfirmed: boolean;
  termsConditionsAgreed: boolean;
  privacyPolicyAgreed: boolean;
  brandingGuidelinesConfirmed: boolean;
  ethicalMarketingConfirmed: boolean;
  competingAffiliations: string;
}

interface FormErrors {
  [key: string]: string;
}

const AffiliateApplicationForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    // Part 1
    fullLegalName: '',
    preferredDisplayName: '',
    dateOfBirth: '',
    nationality: '',
    govIdType: '',
    govIdNumber: '',
    primaryEmail: '',
    secondaryEmail: '',
    mobileNumber: '',
    alternativeContactNumber: '',
    completeResidentialAddress: '',
    city: '',
    province: '',
    country: '',
    timeZone: '',
    desiredAffiliateUsername: '',
    howDidYouHear: '',

    // Part 2
    currentOccupation: '',
    employmentType: '',
    companyBusinessName: '',
    industryField: '',
    yearsOfExperience: '',
    previousAffiliateExperience: false,
    platformsWorkedWith: '',
    durationOfAffiliateExp: '',
    averageMonthlyPerformance: '',
    primarySkills: '',
    toolsPlatformsUsed: '',
    registeredBusinessName: '',
    businessType: '',
    businessWebsiteUrl: '',

    // Part 3
    audienceDescription: '',
    geographicReach: '',
    estimatedAudienceSize: '',
    marketingChannels: [],
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    websiteBlogUrl: '',
    emailListSize: '',
    promotionPlan: '',
    primaryContentFormat: '',
    estimatedMonthlySales: '',

    // Part 4
    accurateInformationConfirmed: false,
    termsConditionsAgreed: false,
    privacyPolicyAgreed: false,
    brandingGuidelinesConfirmed: false,
    ethicalMarketingConfirmed: false,
    competingAffiliations: '',
  });

  // Countdown timer for redirect
  useEffect(() => {
    if (showSuccess && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && redirectCountdown === 0) {
      router.push('/');
    }
  }, [showSuccess, redirectCountdown, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxArrayChange = (value: string) => {
    setFormData((prev) => {
      const channels = prev.marketingChannels.includes(value)
        ? prev.marketingChannels.filter((c) => c !== value)
        : [...prev.marketingChannels, value];
      return { ...prev, marketingChannels: channels };
    });
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const validateURL = (url: string): boolean => {
    if (!url) return true; // Optional fields
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Part 1 validation
      if (!formData.fullLegalName.trim()) newErrors.fullLegalName = 'Full legal name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
      if (!formData.primaryEmail.trim()) {
        newErrors.primaryEmail = 'Primary email is required';
      } else if (!validateEmail(formData.primaryEmail)) {
        newErrors.primaryEmail = 'Invalid email format';
      } else {
        // Check if email exists
        try {
          const response = await fetch('https://ontap-creatives-website.vercel.app/api/affiliate/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.primaryEmail }),
            credentials: 'include',
          });
          const data = await response.json();
          if (data.emailExists) {
            newErrors.primaryEmail = 'An application with this email already exists';
          }
        } catch (error) {
          console.error('Error checking email:', error);
        }
      }
      if (formData.secondaryEmail && !validateEmail(formData.secondaryEmail)) {
        newErrors.secondaryEmail = 'Invalid email format';
      }
      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!validatePhoneNumber(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Invalid phone number format';
      }
      if (formData.alternativeContactNumber && !validatePhoneNumber(formData.alternativeContactNumber)) {
        newErrors.alternativeContactNumber = 'Invalid phone number format';
      }
      if (!formData.completeResidentialAddress.trim()) newErrors.completeResidentialAddress = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.province.trim()) newErrors.province = 'Province is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
      if (!formData.timeZone.trim()) newErrors.timeZone = 'Time zone is required';
      if (!formData.desiredAffiliateUsername.trim()) {
        newErrors.desiredAffiliateUsername = 'Username is required';
      } else {
        // Check if username exists
        try {
          const response = await fetch('https://ontap-creatives-website.vercel.app/api/affiliate/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: formData.desiredAffiliateUsername }),
            credentials: 'include',
          });
          const data = await response.json();
          if (data.usernameExists) {
            newErrors.desiredAffiliateUsername = 'This username is already taken';
          }
        } catch (error) {
          console.error('Error checking username:', error);
        }
      }
      if (!formData.howDidYouHear.trim()) newErrors.howDidYouHear = 'This field is required';
    } else if (step === 2) {
      // Part 2 validation
      if (!formData.currentOccupation.trim()) newErrors.currentOccupation = 'Current occupation is required';
      if (!formData.employmentType.trim()) newErrors.employmentType = 'Employment type is required';
      if (!formData.industryField.trim()) newErrors.industryField = 'Industry/field is required';
      if (!formData.yearsOfExperience.trim()) newErrors.yearsOfExperience = 'Years of experience is required';
      if (!formData.primarySkills.trim()) newErrors.primarySkills = 'Primary skills are required';
      if (!formData.toolsPlatformsUsed.trim()) newErrors.toolsPlatformsUsed = 'Tools/platforms used are required';
      if (formData.businessWebsiteUrl && !validateURL(formData.businessWebsiteUrl)) {
        newErrors.businessWebsiteUrl = 'Invalid URL format';
      }
    } else if (step === 3) {
      // Part 3 validation
      if (!formData.audienceDescription.trim()) newErrors.audienceDescription = 'Audience description is required';
      if (!formData.geographicReach.trim()) newErrors.geographicReach = 'Geographic reach is required';
      if (!formData.estimatedAudienceSize.trim()) newErrors.estimatedAudienceSize = 'Estimated audience size is required';
      if (formData.marketingChannels.length === 0) newErrors.marketingChannels = 'Select at least one marketing channel';
      if (!formData.promotionPlan.trim()) newErrors.promotionPlan = 'Promotion plan is required';
      if (!formData.primaryContentFormat.trim()) newErrors.primaryContentFormat = 'Primary content format is required';
      if (formData.websiteBlogUrl && !validateURL(formData.websiteBlogUrl)) {
        newErrors.websiteBlogUrl = 'Invalid URL format';
      }
      if (formData.facebookUrl && !validateURL(formData.facebookUrl)) {
        newErrors.facebookUrl = 'Invalid URL format';
      }
      if (formData.instagramUrl && !validateURL(formData.instagramUrl)) {
        newErrors.instagramUrl = 'Invalid URL format';
      }
      if (formData.tiktokUrl && !validateURL(formData.tiktokUrl)) {
        newErrors.tiktokUrl = 'Invalid URL format';
      }
      if (formData.linkedinUrl && !validateURL(formData.linkedinUrl)) {
        newErrors.linkedinUrl = 'Invalid URL format';
      }
      if (formData.twitterUrl && !validateURL(formData.twitterUrl)) {
        newErrors.twitterUrl = 'Invalid URL format';
      }
    } else if (step === 4) {
      // Part 4 validation
      if (!formData.accurateInformationConfirmed) newErrors.accurateInformationConfirmed = 'You must confirm the accuracy of information';
      if (!formData.termsConditionsAgreed) newErrors.termsConditionsAgreed = 'You must agree to terms and conditions';
      if (!formData.privacyPolicyAgreed) newErrors.privacyPolicyAgreed = 'You must agree to privacy policy';
      if (!formData.brandingGuidelinesConfirmed) newErrors.brandingGuidelinesConfirmed = 'You must confirm to follow branding guidelines';
      if (!formData.ethicalMarketingConfirmed) newErrors.ethicalMarketingConfirmed = 'You must confirm to follow ethical marketing practices';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateStep(4);
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Prepare social media links
      const socialMediaLinks = {
        facebook: formData.facebookUrl,
        instagram: formData.instagramUrl,
        tiktok: formData.tiktokUrl,
        linkedin: formData.linkedinUrl,
        twitter: formData.twitterUrl,
      };

      const submitData = {
        ...formData,
        socialMediaLinks: JSON.stringify(socialMediaLinks),
      };

      const response = await fetch('https://ontap-creatives-website.vercel.app/api/affiliate/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
      } else {
        alert(data.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success page component
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue via-violet to-dark-blue flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-violet to-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Thank you for your interest in joining our Affiliate Program. Our marketing and sales team will review your application and get back to you soon.
            </p>
            <p className="text-gray-500 mb-4">
              We typically review applications within 3-5 business days. You'll receive an email notification once your application has been processed.
            </p>
            <div className="mt-8 p-4 bg-blue/5 rounded-lg border border-blue/10">
              <p className="text-gray-700 font-medium">
                Redirecting to homepage in <span className="text-violet font-bold text-2xl">{redirectCountdown}</span> seconds...
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-2 bg-violet text-white rounded-lg hover:bg-dark-blue transition-all shadow-lg shadow-violet/20"
              >
                Go to Homepage Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-linear-to-br from-violet/5 via-blue/5 to-light-blue/10 pt-24 pb-6 px-4 flex flex-col overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-6 flex-none">
          <h1 className="text-4xl md:text-5xl font-bold text-blue mb-4">
            Let's get you started
          </h1>
          <p className="text-light-blue text-lg">Enter the details to get going</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6 px-4 flex-none">
          {[1, 2, 3, 4].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors ${
                    currentStep === step
                      ? 'bg-violet text-white'
                      : currentStep > step
                      ? 'bg-violet text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                <div
                  className={`mt-2 text-xs md:text-sm font-medium text-nowrap ${
                    currentStep === step ? 'text-violet' : 'text-gray-400'
                  }`}
                >
                  {step === 1 && 'General Details'}
                  {step === 2 && 'Experience'}
                  {step === 3 && 'Marketing'}
                  {step === 4 && 'Submit'}
                </div>
              </div>
              {index < 3 && (
                <div
                  className={`-mt-5 h-0.5 w-12 md:w-24 mx-2 transition-colors ${
                    currentStep > step ? 'bg-violet' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Container */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col flex-1 overflow-y-auto"
        >
          {/* Step Content */}
          {currentStep === 1 && (
            <Part1
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
            />
          )}
          {currentStep === 2 && (
            <Part2
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
            />
          )}
          {currentStep === 3 && (
            <Part3
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handleCheckboxArrayChange={handleCheckboxArrayChange}
            />
          )}
          {currentStep === 4 && (
            <Part4
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={handlePrevious}
                className="px-8 py-3 border-2 border-violet text-violet rounded-lg font-medium hover:bg-violet hover:text-white transition-all shadow-sm hover:shadow-md"
              >
                Previous
              </button>
            )}
            {currentStep < 4 && (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-violet text-white rounded-lg font-medium hover:bg-dark-blue transition-all shadow-lg shadow-violet/20 hover:shadow-violet/40"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AffiliateApplicationForm;
