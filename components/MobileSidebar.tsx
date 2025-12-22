"use client";

import React from 'react';
import Image from 'next/image';
import { HiBell } from 'react-icons/hi';
import { RiBox3Line, RiHome5Line, RiLogoutBoxRLine, RiShoppingBasket2Line, RiShoppingCart2Line, RiUser5Fill, RiUserCommunityLine } from 'react-icons/ri';
import { TiUser } from 'react-icons/ti';
import { useClickOutside } from '@/hooks';
import { useUser } from '@/contexts/UserContext';

interface MobileSidebarProps {
  showNav: boolean;
  isNavShown: (show: boolean) => void;
  setPage: (page: number) => void;
  setShowLogin: (show: boolean) => void;
}

const MobileSidebar = ({ showNav, isNavShown, setPage, setShowLogin }: MobileSidebarProps) => {
  const { user, logout } = useUser();
  const clickRef = useClickOutside<HTMLDivElement>(() => isNavShown(false), showNav);

  const handleLogout = async () => {
    await logout();
    isNavShown(false);
    setPage(0);
  };

  const handleProtectedAction = (pageNumber: number) => {
    if (!user) {
      setShowLogin(true);
      isNavShown(false);
      return;
    }
    setPage(pageNumber);
    isNavShown(false);
  };

  return (
    <>
      {/* Mobile Navigation Backdrop */}
      {showNav && (
        <div 
          className="fixed inset-0 bg-black/60 z-9998 md:hidden backdrop-blur-sm"
          onClick={() => isNavShown(false)}
        />
      )}
      
      {/* Mobile Navigation Sidebar */}
      <div 
        ref={clickRef} 
        className={`fixed inset-y-0 right-0 w-[85%] sm:w-[70%] max-w-sm bg-white shadow-2xl z-9999 transform transition-transform duration-300 ease-in-out md:hidden ${showNav ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {user ? (
          <div className="flex flex-col h-full">
            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-100 bg-linear-to-br from-violet/5 to-blue/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-violet/20 bg-white">
                  <Image
                    src={user.profileImage || '/images/default-avatar.png'}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-dark-blue text-lg">{user.clientName || 'User'}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              {/* Main Navigation Links */}
              <nav className="space-y-1">
                <button 
                  onClick={() => handleProtectedAction(4)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-violet/10 hover:text-violet rounded-xl transition-colors"
                >
                  <RiShoppingCart2Line className="text-xl" />
                  <span className="font-medium">Cart</span>
                </button>
                <button 
                  onClick={() => handleProtectedAction(3)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-violet/10 hover:text-violet rounded-xl transition-colors"
                >
                  <RiShoppingBasket2Line className="text-xl" />
                  <span className="font-medium">Shop</span>
                </button>
                <button 
                  onClick={() => handleProtectedAction(6)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-violet/10 hover:text-violet rounded-xl transition-colors"
                >
                  <RiBox3Line className="text-xl" />
                  <span className="font-medium">Orders</span>
                </button>
                <button 
                  onClick={() => handleProtectedAction(9)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-violet/10 hover:text-violet rounded-xl transition-colors"
                >
                  <RiUser5Fill className="text-xl" />
                  <span className="font-medium">Profile & Settings</span>
                </button>
              </nav>
            </div>

            {/* Secondary Links */}
            <div className="p-6 flex-1 overflow-y-auto">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Support</h4>
              <nav className="space-y-1">
                <button 
                  onClick={() => {setPage(5); isNavShown(false);}}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-violet/5 hover:text-violet rounded-xl transition-colors"
                >
                  <RiUserCommunityLine className="text-xl" />
                  <span className="font-medium">About Us</span>
                </button>
                <button 
                  onClick={() => {setPage(5); isNavShown(false);}}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-violet/5 hover:text-violet rounded-xl transition-colors"
                >
                  <HiBell className="text-xl" />
                  <span className="font-medium">Notifications</span>
                  <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                </button>
              </nav>
            </div>

            {/* Logout Section */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <RiLogoutBoxRLine className="text-xl" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full p-6 bg-white">
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
              <div className="w-20 h-20 bg-violet/10 rounded-full flex items-center justify-center text-violet">
                <TiUser className="text-4xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-blue mb-2">Welcome Guest</h3>
                <p className="text-gray-500">Sign in to access your account and manage your orders.</p>
              </div>
              <button
                onClick={() => {setShowLogin(true); isNavShown(false);}}
                className="w-full py-3 bg-violet text-white rounded-xl font-semibold shadow-lg shadow-violet/30 hover:bg-dark-blue transition-all"
              >
                Sign In / Register
              </button>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <nav className="space-y-1">
                <button 
                  onClick={() => {setPage(0); isNavShown(false);}}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-violet/5 hover:text-violet rounded-xl transition-colors"
                >
                  <RiHome5Line className="text-xl" />
                  <span className="font-medium">Home</span>
                </button>
                <button 
                  onClick={() => {setPage(5); isNavShown(false);}}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-violet/5 hover:text-violet rounded-xl transition-colors"
                >
                  <RiUserCommunityLine className="text-xl" />
                  <span className="font-medium">About Us</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileSidebar;
