import React from 'react';

interface Part3Props {
  formData: any;
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxArrayChange: (value: string) => void;
}

const Part3: React.FC<Part3Props> = ({ formData, errors, handleInputChange, handleCheckboxArrayChange }) => {
  const geographicReachOptions = [
    'Local (within city)',
    'Regional (within province/state)',
    'National',
    'International',
  ];

  const audienceSizeOptions = [
    'Less than 1,000',
    '1,000 - 5,000',
    '5,000 - 10,000',
    '10,000 - 50,000',
    '50,000 - 100,000',
    'More than 100,000',
  ];

  const marketingChannelOptions = [
    'Facebook',
    'Instagram',
    'TikTok',
    'X (Twitter)',
    'LinkedIn',
    'Website / Blog',
    'Email Marketing',
    'Paid Advertising',
    'Community Groups',
    'Offline Methods',
  ];

  const contentFormatOptions = [
    'Video Content',
    'Written Content (Blog/Articles)',
    'Live Selling',
    'Paid Advertisements',
    'Direct Outreach',
    'Social Media Posts',
    'Email Campaigns',
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Part 3: Marketing Strategy & Audience Reach</h2>

      {/* Audience Profile Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Target Market / Audience Description<span className="text-red-500">*</span>
            </label>
            <textarea
              name="audienceDescription"
              value={formData.audienceDescription}
              onChange={handleInputChange}
              placeholder="Describe your target audience (e.g., small business owners, entrepreneurs, professionals aged 25-45)"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.audienceDescription ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.audienceDescription && <p className="text-red-500 text-xs mt-1">{errors.audienceDescription}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographic Reach<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="geographicReach"
                  value={formData.geographicReach}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none bg-white cursor-pointer hover:border-gray-400 transition-colors ${
                    errors.geographicReach ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                <option value="">Select geographic reach</option>
                {geographicReachOptions.map((option) => (
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
              {errors.geographicReach && <p className="text-red-500 text-xs mt-1">{errors.geographicReach}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Audience Size<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="estimatedAudienceSize"
                  value={formData.estimatedAudienceSize}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none bg-white cursor-pointer hover:border-gray-400 transition-colors ${
                    errors.estimatedAudienceSize ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                <option value="">Select audience size</option>
                {audienceSizeOptions.map((option) => (
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
              {errors.estimatedAudienceSize && <p className="text-red-500 text-xs mt-1">{errors.estimatedAudienceSize}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Channels Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Marketing Channels to Be Used<span className="text-red-500">*</span></h3>
        <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {marketingChannelOptions.map((channel) => (
            <label key={channel} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingChannels.includes(channel)}
                onChange={() => handleCheckboxArrayChange(channel)}
                className="w-4 h-4 text-violet focus:ring-violet rounded"
              />
              <span className="ml-3 text-gray-700">{channel}</span>
            </label>
          ))}
        </div>
        {errors.marketingChannels && <p className="text-red-500 text-xs mt-1">{errors.marketingChannels}</p>}
      </div>

      {/* Online Presence Details Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Online Presence Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Profile/Page URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourpage"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.facebookUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.facebookUrl && <p className="text-red-500 text-xs mt-1">{errors.facebookUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Profile URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourprofile"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.instagramUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.instagramUrl && <p className="text-red-500 text-xs mt-1">{errors.instagramUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok Profile URL
              </label>
              <input
                type="url"
                name="tiktokUrl"
                value={formData.tiktokUrl}
                onChange={handleInputChange}
                placeholder="https://tiktok.com/@yourprofile"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.tiktokUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.tiktokUrl && <p className="text-red-500 text-xs mt-1">{errors.tiktokUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.linkedinUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.linkedinUrl && <p className="text-red-500 text-xs mt-1">{errors.linkedinUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X (Twitter) Profile URL
              </label>
              <input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourprofile"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.twitterUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.twitterUrl && <p className="text-red-500 text-xs mt-1">{errors.twitterUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website / Blog URL
              </label>
              <input
                type="url"
                name="websiteBlogUrl"
                value={formData.websiteBlogUrl}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                  errors.websiteBlogUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.websiteBlogUrl && <p className="text-red-500 text-xs mt-1">{errors.websiteBlogUrl}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email List Size (if applicable)
            </label>
            <input
              type="text"
              name="emailListSize"
              value={formData.emailListSize}
              onChange={handleInputChange}
              placeholder="e.g., 5,000 subscribers"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
            />
          </div>
        </div>
      </div>

      {/* Customer Acquisition Plan Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Acquisition Plan</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brief Description of How You Plan to Promote Our Products/Services<span className="text-red-500">*</span>
            </label>
            <textarea
              name="promotionPlan"
              value={formData.promotionPlan}
              onChange={handleInputChange}
              placeholder="Describe your promotional strategy in detail..."
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet ${
                errors.promotionPlan ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.promotionPlan && <p className="text-red-500 text-xs mt-1">{errors.promotionPlan}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Content Format<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="primaryContentFormat"
                  value={formData.primaryContentFormat}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none bg-white cursor-pointer hover:border-gray-400 transition-colors ${
                    errors.primaryContentFormat ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                <option value="">Select content format</option>
                {contentFormatOptions.map((option) => (
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
              {errors.primaryContentFormat && <p className="text-red-500 text-xs mt-1">{errors.primaryContentFormat}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Monthly Lead or Sales Volume
              </label>
              <input
                type="text"
                name="estimatedMonthlySales"
                value={formData.estimatedMonthlySales}
                onChange={handleInputChange}
                placeholder="e.g., 20-30 sales per month"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part3;
