import React from 'react';

interface Part1Props {
  formData: any;
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const Part1: React.FC<Part1Props> = ({ formData, errors, handleInputChange }) => {
  const idTypes = ['Passport', 'Driver\'s License', 'National ID', 'Other'];
  const hearAboutOptions = [
    'Social Media',
    'Search Engine',
    'Friend/Colleague Referral',
    'Email',
    'Online Advertisement',
    'Blog/Article',
    'Other',
  ];

  return (
    <div className="space-y-6 h-max w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Part 1: General Information</h2>

      {/* Personal Details Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Legal Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullLegalName"
              value={formData.fullLegalName}
              onChange={handleInputChange}
              placeholder="Enter your full legal name"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.fullLegalName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullLegalName && <p className="text-red-500 text-xs mt-1">{errors.fullLegalName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Display Name
            </label>
            <input
              type="text"
              name="preferredDisplayName"
              value={formData.preferredDisplayName}
              onChange={handleInputChange}
              placeholder="Enter preferred name (if different)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              placeholder="Enter your nationality"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.nationality ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Government-Issued ID Type
            </label>
            <div className="relative">
              <select
                name="govIdType"
                value={formData.govIdType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none bg-white cursor-pointer hover:border-gray-400 transition-colors"
              >
              <option value="">Select ID Type</option>
              {idTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number
            </label>
            <input
              type="text"
              name="govIdNumber"
              value={formData.govIdNumber}
              onChange={handleInputChange}
              placeholder="Enter ID number (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Email Address<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="primaryEmail"
              value={formData.primaryEmail}
              onChange={handleInputChange}
              placeholder="Enter your primary email"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.primaryEmail ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.primaryEmail && <p className="text-red-500 text-xs mt-1">{errors.primaryEmail}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Email Address
            </label>
            <input
              type="email"
              name="secondaryEmail"
              value={formData.secondaryEmail}
              onChange={handleInputChange}
              placeholder="Enter secondary email (optional)"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.secondaryEmail ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.secondaryEmail && <p className="text-red-500 text-xs mt-1">{errors.secondaryEmail}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number (include country code)<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="+639171234567"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alternative Contact Number
            </label>
            <input
              type="tel"
              name="alternativeContactNumber"
              value={formData.alternativeContactNumber}
              onChange={handleInputChange}
              placeholder="+639171234567"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.alternativeContactNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.alternativeContactNumber && <p className="text-red-500 text-xs mt-1">{errors.alternativeContactNumber}</p>}
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complete Residential Address<span className="text-red-500">*</span>
            </label>
            <textarea
              name="completeResidentialAddress"
              value={formData.completeResidentialAddress}
              onChange={handleInputChange}
              placeholder="Enter your complete address"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.completeResidentialAddress ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.completeResidentialAddress && <p className="text-red-500 text-xs mt-1">{errors.completeResidentialAddress}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province/State<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="Enter province/state"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.province ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="timeZone"
              value={formData.timeZone}
              onChange={handleInputChange}
              placeholder="e.g., GMT+8, PST, EST"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.timeZone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.timeZone && <p className="text-red-500 text-xs mt-1">{errors.timeZone}</p>}
          </div>
        </div>
      </div>

      {/* Affiliate Account Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Affiliate Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired Affiliate Username<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="desiredAffiliateUsername"
              value={formData.desiredAffiliateUsername}
              onChange={handleInputChange}
              placeholder="Choose a unique username"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.desiredAffiliateUsername ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.desiredAffiliateUsername && <p className="text-red-500 text-xs mt-1">{errors.desiredAffiliateUsername}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you hear about our Affiliate Program?<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="howDidYouHear"
                value={formData.howDidYouHear}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none bg-white cursor-pointer hover:border-gray-400 transition-colors ${
                  errors.howDidYouHear ? 'border-red-500' : 'border-gray-300'
                }`}
              >
              <option value="">Select an option</option>
              {hearAboutOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.howDidYouHear && <p className="text-red-500 text-xs mt-1">{errors.howDidYouHear}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part1;
