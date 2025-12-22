import React from 'react';

interface Part4Props {
  formData: any;
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const Part4: React.FC<Part4Props> = ({ formData, errors, handleInputChange, handleSubmit, isSubmitting }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Part 4: Summary & Agreements</h2>

      {/* Application Summary */}
      <div className="mb-8 p-6 bg-linear-to-br from-violet/5 to-blue/5 rounded-xl border border-violet/10">
        <h3 className="text-lg font-semibold text-dark-blue mb-4">Application Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Full Name:</span>
            <span className="text-gray-600">{formData.fullLegalName || '-'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-600">{formData.primaryEmail || '-'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Username:</span>
            <span className="text-gray-600">{formData.desiredAffiliateUsername || '-'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Location:</span>
            <span className="text-gray-600">{formData.city && formData.country ? `${formData.city}, ${formData.country}` : '-'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Current Occupation:</span>
            <span className="text-gray-600">{formData.currentOccupation || '-'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Experience Level:</span>
            <span className="text-gray-600">{formData.yearsOfExperience || '-'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Marketing Channels:</span>
            <span className="text-gray-600">{formData.marketingChannels.length > 0 ? formData.marketingChannels.join(', ') : '-'}</span>
          </div>
        </div>
      </div>

      {/* Agreements Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms & Agreements<span className="text-red-500">*</span></h3>
        <div className="space-y-4">
          <label className={`flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
            errors.accurateInformationConfirmed ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}>
            <input
              type="checkbox"
              name="accurateInformationConfirmed"
              checked={formData.accurateInformationConfirmed}
              onChange={handleInputChange}
              className="w-5 h-5 text-violet focus:ring-violet rounded mt-0.5 shrink-0"
            />
            <span className="ml-3 text-gray-700">
              I confirm that all information provided in this application is accurate and complete to the best of my knowledge.
            </span>
          </label>
          {errors.accurateInformationConfirmed && <p className="text-red-500 text-xs">{errors.accurateInformationConfirmed}</p>}

          <label className={`flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
            errors.termsConditionsAgreed ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}>
            <input
              type="checkbox"
              name="termsConditionsAgreed"
              checked={formData.termsConditionsAgreed}
              onChange={handleInputChange}
              className="w-5 h-5 text-violet focus:ring-violet rounded mt-0.5 shrink-0"
            />
            <span className="ml-3 text-gray-700">
              I have read and agree to the <a href="/terms" target="_blank" className="text-violet hover:underline">Affiliate Terms & Conditions</a>.
            </span>
          </label>
          {errors.termsConditionsAgreed && <p className="text-red-500 text-xs">{errors.termsConditionsAgreed}</p>}

          <label className={`flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
            errors.privacyPolicyAgreed ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}>
            <input
              type="checkbox"
              name="privacyPolicyAgreed"
              checked={formData.privacyPolicyAgreed}
              onChange={handleInputChange}
              className="w-5 h-5 text-violet focus:ring-violet rounded mt-0.5 shrink-0"
            />
            <span className="ml-3 text-gray-700">
              I have read and agree to the <a href="/privacy" target="_blank" className="text-violet hover:underline">Marketing & Data Privacy Policy</a>.
            </span>
          </label>
          {errors.privacyPolicyAgreed && <p className="text-red-500 text-xs">{errors.privacyPolicyAgreed}</p>}
        </div>
      </div>

      {/* Compliance & Brand Alignment Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Compliance & Brand Alignment<span className="text-red-500">*</span></h3>
        <div className="space-y-4">
          <label className={`flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
            errors.brandingGuidelinesConfirmed ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}>
            <input
              type="checkbox"
              name="brandingGuidelinesConfirmed"
              checked={formData.brandingGuidelinesConfirmed}
              onChange={handleInputChange}
              className="w-5 h-5 text-violet focus:ring-violet rounded mt-0.5 shrink-0"
            />
            <span className="ml-3 text-gray-700">
              I commit to following company branding guidelines and representing the brand professionally in all marketing materials and communications.
            </span>
          </label>
          {errors.brandingGuidelinesConfirmed && <p className="text-red-500 text-xs">{errors.brandingGuidelinesConfirmed}</p>}

          <label className={`flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
            errors.ethicalMarketingConfirmed ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}>
            <input
              type="checkbox"
              name="ethicalMarketingConfirmed"
              checked={formData.ethicalMarketingConfirmed}
              onChange={handleInputChange}
              className="w-5 h-5 text-violet focus:ring-violet rounded mt-0.5 shrink-0"
            />
            <span className="ml-3 text-gray-700">
              I commit to following ethical marketing practices, including honest representation of products/services and compliance with advertising standards.
            </span>
          </label>
          {errors.ethicalMarketingConfirmed && <p className="text-red-500 text-xs">{errors.ethicalMarketingConfirmed}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disclosure of Competing Affiliations (if any)
            </label>
            <textarea
              name="competingAffiliations"
              value={formData.competingAffiliations}
              onChange={handleInputChange}
              placeholder="Please disclose any competing affiliate partnerships or state 'None' if not applicable"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
            />
            <p className="text-xs text-gray-500 mt-1">Transparency helps us understand potential conflicts of interest.</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-violet text-white hover:bg-dark-blue shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        By submitting this application, you acknowledge that our team will review your information and contact you within 3-5 business days.
      </p>
    </div>
  );
};

export default Part4;
