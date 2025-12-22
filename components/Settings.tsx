"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiDeleteBinLine, RiLockPasswordLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

const Settings = () => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [keepUpdated, setKeepUpdated] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/profile/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ confirmation: deleteConfirmation, keepUpdated })
      });

      if (response.ok) {
        alert('Account deleted successfully');
        router.push('/');
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet/10 rounded-lg text-violet">
            <RiLockPasswordLine size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet/20 focus:border-violet outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet/20 focus:border-violet outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet/20 focus:border-violet outline-none transition-all"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
            className="px-6 py-2 bg-violet text-white rounded-lg hover:bg-dark-blue transition-colors shadow-lg shadow-violet/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg text-red-500">
            <RiDeleteBinLine size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <div className="flex justify-end">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-bold text-red-600">DELETE MY ACCOUNT</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none"
                    placeholder="DELETE MY ACCOUNT"
                  />
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepUpdated}
                    onChange={(e) => setKeepUpdated(e.target.checked)}
                    className="w-5 h-5 text-violet rounded border-gray-300 focus:ring-violet"
                  />
                  <span className="text-sm text-gray-600">Keep me updated with recent offers and promos</span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'DELETE MY ACCOUNT' || isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
