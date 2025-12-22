"use client";

import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';
import { RiCameraLine, RiEdit2Line } from 'react-icons/ri';
import Settings from './Settings';
import AffiliateDashboard from './AffiliateDashboard';
import OrderHistory from './OrderHistory'; // We'll create this or just mock it for now

const UserProfile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [coverImage, setCoverImage] = useState('/images/default-cover.jpg');
  const [profileImage, setProfileImage] = useState('/images/default-avatar.png');
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    contactNumber: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update images and form when user data loads
  React.useEffect(() => {
    if (user) {
      setCoverImage(user.coverImage || '/images/default-cover.jpg');
      setProfileImage(user.profileImage || '/images/default-avatar.png');
      setFormData({
        clientName: user.clientName || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        address: user.address || ''
      });
    }
  }, [user]);

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Account settings' },
    { id: 'settings', label: 'Security & Settings' },
    { id: 'orders', label: 'Order history' },
    // Add Affiliate tab if user is affiliate
    ...(user.isAffiliate ? [{ id: 'affiliate', label: 'Affiliate Dashboard' }] : []),
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        alert('Profile updated successfully!');
        // Update user context if needed
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/profile/upload-image', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const { imageUrl } = await response.json();
        if (type === 'profile') {
          setProfileImage(imageUrl);
        } else {
          setCoverImage(imageUrl);
        }
        alert('Image uploaded successfully!');
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading image');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20 z-50">
      {/* Profile Header */}
      <div className="relative h-64 w-full bg-linear-to-r from-violet to-dark-blue">
        {/* Cover Image */}
        <Image
          src={coverImage}
          alt="Cover"
          fill
          className="object-cover opacity-50"
        />
        <label htmlFor="cover-upload" className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
          <RiEdit2Line size={20} />
          <input 
            id="cover-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
          />
        </label>

        {/* Profile Info Overlay */}
        <div className="absolute -bottom-16 left-0 w-full px-4 md:px-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Profile Picture */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover"
            />
            <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <RiCameraLine className="text-white text-2xl" />
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'profile')}
              />
            </label>
          </div>
          
          <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 md:text-white drop-shadow-md">{user.clientName}</h1>
            <div className="flex flex-col md:flex-row gap-4 text-gray-600 md:text-white/90 mt-1">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {user.email}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                {user.contactNumber || 'No contact number'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-20 px-4 md:px-10 border-b border-gray-200">
        <div className="flex overflow-x-auto gap-8 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? 'text-violet'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet/20 focus:border-violet outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet/20 focus:border-violet outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet/20 focus:border-violet outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet/20 focus:border-violet outline-none transition-all"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-2 bg-violet text-white rounded-lg hover:bg-dark-blue transition-colors shadow-lg shadow-violet/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && <Settings />}
        
        {activeTab === 'orders' && <OrderHistory />}
        
        {activeTab === 'affiliate' && <AffiliateDashboard />}
      </div>
    </div>
  );
};

export default UserProfile;
