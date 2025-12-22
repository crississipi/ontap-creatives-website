import React from 'react';

interface Part2Props {
  formData: any;
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const Part2: React.FC<Part2Props> = ({ formData, errors, handleInputChange }) => {
  const employmentTypes = [
    'Employed',
    'Self-Employed',
    'Freelancer',
    'Business Owner',
    'Student',
    'Unemployed',
  ];

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Corporation',
    'LLC',
    'Other',
  ];

  const yearsOptions = [
    'Less than 1 year',
    '1-2 years',
    '3-5 years',
    '6-10 years',
    'More than 10 years',
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Part 2: Occupation History / Relevant Experience</h2>

      {/* Current Professional Status Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Professional Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Occupation / Role<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="currentOccupation"
              value={formData.currentOccupation}
              onChange={handleInputChange}
              placeholder="e.g., Marketing Manager, Freelance Designer"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.currentOccupation ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.currentOccupation && <p className="text-red-500 text-xs mt-1">{errors.currentOccupation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none bg-white cursor-pointer hover:border-gray-400 transition-colors ${
                  errors.employmentType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
              <option value="">Select employment type</option>
              {employmentTypes.map((type) => (
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
            {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company / Business Name
            </label>
            <input
              type="text"
              name="companyBusinessName"
              value={formData.companyBusinessName}
              onChange={handleInputChange}
              placeholder="Enter company/business name (if applicable)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry / Field<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="industryField"
              value={formData.industryField}
              onChange={handleInputChange}
              placeholder="e.g., Technology, Retail, Marketing"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.industryField ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.industryField && <p className="text-red-500 text-xs mt-1">{errors.industryField}</p>}
          </div>
        </div>
      </div>

      {/* Relevant Experience Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Relevant Experience</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience in Sales, Marketing, Content Creation, or Related Fields<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none bg-white cursor-pointer hover:border-gray-400 transition-colors ${
                  errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
                }`}
              >
              <option value="">Select experience level</option>
              {yearsOptions.map((option) => (
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
            {errors.yearsOfExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Affiliate Marketing Experience<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="previousAffiliateExperience"
                  value="true"
                  checked={formData.previousAffiliateExperience === true}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: { ...e.target, name: 'previousAffiliateExperience', value: 'true', type: 'radio' }
                  } as any)}
                  className="w-4 h-4 text-violet focus:ring-violet"
                />
                <span className="ml-2 text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="previousAffiliateExperience"
                  value="false"
                  checked={formData.previousAffiliateExperience === false}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: { ...e.target, name: 'previousAffiliateExperience', value: 'false', type: 'radio' }
                  } as any)}
                  className="w-4 h-4 text-violet focus:ring-violet"
                />
                <span className="ml-2 text-gray-700">No</span>
              </label>
            </div>
          </div>

          {formData.previousAffiliateExperience === true && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platforms or Companies Worked With
                </label>
                <textarea
                  name="platformsWorkedWith"
                  value={formData.platformsWorkedWith}
                  onChange={handleInputChange}
                  placeholder="List the platforms or companies you've worked with as an affiliate"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration of Affiliate Experience
                  </label>
                  <input
                    type="text"
                    name="durationOfAffiliateExp"
                    value={formData.durationOfAffiliateExp}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Monthly Performance
                  </label>
                  <input
                    type="text"
                    name="averageMonthlyPerformance"
                    value={formData.averageMonthlyPerformance}
                    onChange={handleInputChange}
                    placeholder="e.g., $1000 in sales, 50 referrals"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Skills & Expertise Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Expertise</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Skills<span className="text-red-500">*</span>
            </label>
            <textarea
              name="primarySkills"
              value={formData.primarySkills}
              onChange={handleInputChange}
              placeholder="e.g., Sales, Copywriting, Video Creation, Paid Ads, SEO, Community Building"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.primarySkills ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.primarySkills && <p className="text-red-500 text-xs mt-1">{errors.primarySkills}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tools & Platforms Used<span className="text-red-500">*</span>
            </label>
            <textarea
              name="toolsPlatformsUsed"
              value={formData.toolsPlatformsUsed}
              onChange={handleInputChange}
              placeholder="e.g., Facebook Ads, Google Ads, TikTok, Email Marketing Tools, Canva"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.toolsPlatformsUsed ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.toolsPlatformsUsed && <p className="text-red-500 text-xs mt-1">{errors.toolsPlatformsUsed}</p>}
          </div>
        </div>
      </div>

      {/* Business Presence Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Presence (if applicable)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registered Business Name
            </label>
            <input
              type="text"
              name="registeredBusinessName"
              value={formData.registeredBusinessName}
              onChange={handleInputChange}
              placeholder="Enter business name (if registered)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type
            </label>
            <div className="relative">
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none bg-white cursor-pointer hover:border-gray-400 transition-colors"
              >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Website or Landing Page URL
            </label>
            <input
              type="url"
              name="businessWebsiteUrl"
              value={formData.businessWebsiteUrl}
              onChange={handleInputChange}
              placeholder="https://yourbusiness.com"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.businessWebsiteUrl ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.businessWebsiteUrl && <p className="text-red-500 text-xs mt-1">{errors.businessWebsiteUrl}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part2;
