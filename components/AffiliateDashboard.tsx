"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

interface AffiliateStats {
  totalEarnings: number;
  pendingPayout: number;
  totalReferrals: number;
  conversionRate: string;
}

interface Referral {
  id: number;
  clientName: string;
  date: string;
  status: string;
  commission: number;
}

const AffiliateDashboard = () => {
  const { user } = useUser();
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats>({
    totalEarnings: 0,
    pendingPayout: 0,
    totalReferrals: 0,
    conversionRate: '0%'
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [affiliateCode, setAffiliateCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      try {
        const response = await fetch('https://ontap-creatives-website.vercel.app/api/profile/affiliate', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setAffiliateStats(data.stats);
          setReferrals(data.referrals);
          setAffiliateCode(data.affiliateCode);
        }
      } catch (error) {
        console.error('Error fetching affiliate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateCode);
    alert('Affiliate code copied to clipboard!');
  };

  if (loading) {
    return <div className="text-center py-12">Loading affiliate data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
          <h3 className="text-2xl font-bold text-dark-blue">₱{affiliateStats.totalEarnings.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Pending Payout</p>
          <h3 className="text-2xl font-bold text-violet">₱{affiliateStats.pendingPayout.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Referrals</p>
          <h3 className="text-2xl font-bold text-gray-900">{affiliateStats.totalReferrals}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
          <h3 className="text-2xl font-bold text-green-600">{affiliateStats.conversionRate}</h3>
        </div>
      </div>

      {/* Affiliate Code Section */}
      <div className="bg-linear-to-r from-violet to-blue p-6 rounded-xl text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1">Your Affiliate Code</h3>
            <p className="text-white/80 text-sm">Share this code with your network to earn commissions.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
            <code className="text-xl font-mono font-bold px-4">{affiliateCode || 'N/A'}</code>
            <button 
              onClick={copyToClipboard}
              className="px-3 py-1 bg-white text-violet rounded hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Referred Clients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{referral.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{referral.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      referral.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{referral.commission.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
