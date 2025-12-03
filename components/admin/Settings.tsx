"use client"

import { useClickOutside } from '@/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react'
import { RiAddLargeLine, RiBallPenFill, RiDeleteBinLine } from 'react-icons/ri';
import Staff from './Staff';
import {
  DEFAULT_GENERAL_ACCESS_ROLE,
  STAFF_ROLE_OPTIONS,
  StaffRole,
  normalizeRole,
} from '@/constants/staffRoles';
import {
  getGeneralVisibility,
  setGeneralVisibility,
} from '@/utils/adminAccessSession';

interface StaffData {
  staffID: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  dateAdded: string;
  viewDashboard: boolean;
  viewOrders: boolean;
  viewClients: boolean;
  viewAffiliates: boolean;
  addProducts: boolean;
  changeContent: boolean;
  addOffers: boolean;
}

const Settings = () => {
  const [enable, setEnable] = useState(false);
  const [generalExpiry, setGeneralExpiry] = useState<string | null>(null);
  const [role, showRoles] = useState(false);
  const [addStaff, showAddStaff] = useState(false);

  // Staff profile state
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [age, setAge] = useState('');
  const [birthday, setBirthday] = useState('');
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  // Add Staff form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [roleInput, setRoleInput] = useState<StaffRole>(DEFAULT_GENERAL_ACCESS_ROLE);
  const [viewDashboard, setViewDashboard] = useState(false);
  const [viewOrders, setViewOrders] = useState(false);
  const [viewClients, setViewClients] = useState(false);
  const [viewAffiliates, setViewAffiliates] = useState(false);
  const [addProducts, setAddProducts] = useState(false);
  const [changeContent, setChangeContent] = useState(false);
  const [addOffers, setAddOffers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const generatedStaffPassword = firstName
    ? `${firstName}_${roleInput}`
    : `firstname_${roleInput}`;

  const [isEditing, setIsEditing] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [editData, setEditData] = useState<StaffData | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [staffRoleDropdown, setStaffRoleDropdown] = useState(false);


  // Staff list state
  const [staffList, setStaffList] = useState<StaffData[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setRoleInput(DEFAULT_GENERAL_ACCESS_ROLE);
    setViewDashboard(false);
    setViewOrders(false);
    setViewClients(false);
    setViewAffiliates(false);
    setAddProducts(false);
    setChangeContent(false);
    setAddOffers(false);
  }

  // Fetch current staff profile
  useEffect(() => {
    const fetchProfile = async () => {
        setProfileLoading(true);
        try {
            const res = await fetch('/api/staff/me');
            if (res.ok) {
                const data = await res.json();
                setProfileFirstName(data.firstName || '');
                setProfileLastName(data.lastName || '');
                setProfileEmail(data.email || '');
                setProfileRole(data.role || null);
                setAge(data.age?.toString() || '');
                if (data.birthday) {
                    const date = new Date(data.birthday);
                    const formattedDate = date.toISOString().split('T')[0];
                    setBirthday(formattedDate);
                }
            } else {
                console.log('Could not fetch staff profile. This may be a client account.');
            }
        } catch (err) {
            console.error('Failed to fetch staff profile:', err);
        } finally {
            setProfileLoading(false);
        }
    };
    fetchProfile();
  }, []);


  // Fetch staff list on mount
  useEffect(() => {
    const fetchStaff = async () => {
      setLoadingStaff(true);
      try {
        const res = await fetch('/api/client/staff');
        if (res.ok) {
          const data = await res.json();
          setStaffList(data.staff || []);
        }
      } catch (err) {
        console.error('Failed to fetch staff:', err);
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const stored = getGeneralVisibility();
    if (stored) {
      setEnable(true);
      setGeneralExpiry(stored.expiresAt);
    }
  }, []);

  useEffect(() => {
    if (!enable) return;
    const interval = setInterval(() => {
      const current = getGeneralVisibility();
      if (!current) {
        setEnable(false);
        setGeneralExpiry(null);
      } else {
        setGeneralExpiry(current.expiresAt);
      }
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [enable]);

  const handleConfirm = async () => {
    if (submitting) return;
    if (!firstName || !lastName || !email || !roleInput) {
      alert('Please fill out first name, last name, email and role.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('https://ontap-creatives-website.vercel.app/api/client/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          role: roleInput,
          viewDashboard,
          viewOrders,
          viewClients,
          viewAffiliates,
          addProducts,
          changeContent,
          addOffers
        })
      })

      if (res.status === 201) {
        showAddStaff(false)
        resetForm()
        // Refresh staff list
        const staffRes = await fetch('https://ontap-creatives-website.vercel.app/api/client/staff');
        if (staffRes.ok) {
          const data = await staffRes.json();
          setStaffList(data.staff || []);
        }
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data?.error || 'Failed to add staff')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to add staff')
    } finally {
      setSubmitting(false)
    }
  }

  const handleProfileSave = async () => {
    try {
        const res = await fetch('https://ontap-creatives-website.vercel.app/api/staff/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: profileFirstName,
                lastName: profileLastName,
                email: profileEmail,
                age: age,
                birthday: birthday,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            alert('Profile updated successfully!');
        } else {
            alert(`Failed to update profile: ${data.error}`);
        }
    } catch (error) {
        alert('An error occurred while updating profile.');
        console.error(error);
    }
  };

  const handlePasswordChange = async () => {
      if (newPassword !== confirmPassword) {
          alert("Passwords do not match.");
          return;
      }
      try {
          const res = await fetch('https://ontap-creatives-website.vercel.app/api/staff/me/password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ newPassword, confirmPassword }),
          });

          const data = await res.json();
          if (res.ok) {
              alert('Password updated successfully!');
              setNewPassword('');
              setConfirmPassword('');
          } else {
              alert(`Failed to change password: ${data.error}`);
          }
      } catch (error) {
          alert('An error occurred while changing password.');
          console.error(error);
      }
  };

  const outsideRoleOptions = useClickOutside<HTMLSpanElement>(() => showRoles(false), role);
  const outsideAddStaff = useClickOutside<HTMLDivElement>(() => showAddStaff(false), addStaff);
  const staffRoleOptionsRef = useClickOutside<HTMLSpanElement>(() => setStaffRoleDropdown(false), staffRoleDropdown);

  useEffect(() => {
    setIsEditing(false);
    setShowEditConfirm(false);
    setEditData(null);
    setStaffRoleDropdown(false);
  }, [selectedStaff]);

  const handleEditClick = () => {
    if (!selectedStaff) return;
    if (!isEditing) {
      setIsEditing(true);
      setEditData({ ...selectedStaff });
      return;
    }
    setShowEditConfirm(true);
  };

  const handleToggleGeneral = () => {
    if (enable) {
      setEnable(false);
      setGeneralExpiry(null);
      setGeneralVisibility(false);
      return;
    }

    const session = setGeneralVisibility(true);
    setGeneralExpiry(session?.expiresAt ?? null);
    setEnable(true);
  };

  const updateEditData = <K extends keyof StaffData>(field: K, value: StaffData[K]) => {
    setEditData(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    setEditLoading(true);
    try {
      const res = await fetch(`https://ontap-creatives-website.vercel.app/api/client/staff`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setStaffList(prev =>
          prev.map(s => s.staffID === editData.staffID ? editData : s)
        );
        setSelectedStaff(editData);
        setIsEditing(false);
        setShowEditConfirm(false);
        setEditData(null);
      } else {
        alert("Failed to update staff.");
      }
    } catch (err) {
      alert("Error updating staff.");
    } finally {
      setEditLoading(false);
    }
  };

  const formatExpiryDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString();
  };

  return (
    <div className='h-full w-full flex flex-col overflow-hidden bg-neutral-50 relative md:pl-10 2xl:pl-0'>
        <div className='w-full flex bg-white p-5 pt-10 border-b border-black/20 shadow-md shadow-black/20'>
          <span className='w-1/2 flex flex-col'>
            <h1 className='text-2xl font-semibold'>Settings</h1>
            <p className='text-dark-blue text-sm md:text-base hidden md:block'>Manage your account settings and preferences.</p>
          </span>
          <span className='ml-auto flex items-center gap-2 md:gap-3'>
            <button type="button" className='py-2 px-3 text-sm md:text-base md:px-5 md:py-2 rounded-full border border-black/30 text-black/50 hover:border-black/70 hover:text-black/70 focus:bg-black focus:text-white ease-out duration-200'>Cancel</button>
            <button onClick={handleProfileSave} type="button" className='py-2 px-3 text-sm md:text-base md:px-5 md:py-2 text-nowrap rounded-full border border-blue text-blue hover:border-dark-blue hover:text-dark-blue focus:bg-dark-blue focus:text-white ease-out duration-200'>Save Changes</button>
          </span>
        </div>
        <div className='w-full h-full flex flex-col overflow-x-hidden'>
          <div className='w-full flex flex-col p-5'>
            <h2 className='text-xl font-bold'>Profile</h2>
            <p className='text-dark-blue text-sm md:text-base'>Update your personal information here.</p>
            <div className='w-full grid grid-cols-1 md:grid-cols-3'>
              <div className='col-span-2 w-full flex flex-col pt-5 md:p-5 gap-5'>
                <span className='flex flex-col xl:w-1/2 group'>
                  <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>First Name</strong>
                  <input type="text" placeholder='First Name' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={profileFirstName} onChange={(e) => setProfileFirstName(e.target.value)} />
                </span>
                <span className='flex flex-col xl:w-1/2 group'>
                  <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>last Name</strong>
                  <input type="text" placeholder='Last Name' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={profileLastName} onChange={(e) => setProfileLastName(e.target.value)} />
                </span>
                <span className='flex flex-col xl:w-1/2 group'>
                  <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>email address</strong>
                  <input type="email" placeholder='Email Address' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                </span>
                <div className='flex gap-3 xl:w-1/2'>
                  <span className='flex flex-col w-20 group'>
                    <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Age</strong>
                    <input type="number" placeholder='20' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={age} onChange={(e) => setAge(e.target.value)} />
                  </span>
                  <span className='flex flex-col w-full group'>
                    <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>birthday</strong>
                    <input type="date" className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col p-5'>
            <h2 className='text-xl font-bold'>Security</h2>
            <p className='text-dark-blue text-sm md:text-base'>Secure your account by changing your password moderately.</p>
            <div className='w-full grid grid-cols-1 md:grid-cols-3'>
              <div className='col-span-2 w-full flex flex-col pt-5 md:p-5 gap-5'>
                <span className='flex flex-col xl:w-1/2 group'>
                  <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>new password</strong>
                  <input type="password" placeholder='New Password' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </span>
                <span className='flex flex-col xl:w-1/2 group'>
                  <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>confirm password</strong>
                  <input type="password" placeholder='Confirm Password' className='px-5 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </span>
                <span className='flex flex-col xl:w-1/2'>
                    <button onClick={handlePasswordChange} type="button" className='py-2 px-5 mt-2 text-nowrap rounded-full border w-max border-blue text-blue hover:border-dark-blue hover:text-dark-blue focus:bg-dark-blue focus:text-white ease-out duration-200'>Update Password</button>
                </span>
              </div>
            </div>
          </div>
          {(profileRole === 'Admin' || profileRole === 'Manager') && (
            <div className='w-full flex flex-col p-5 pb-10'>
              <div className='w-full flex items-center justify-between'>
                <span className='flex flex-col'>
                  <h2 className='text-xl font-bold'>Manage Accounts</h2>
                  <p className='text-dark-blue text-sm md:text-base'>Manage your staff's authorizations and activities.</p>
                </span>
                <button type="button" className='flex items-center gap-2 py-2 pl-3 px-5 rounded-full text-sm md:text-base border md:border-2 border-blue text-blue font-bold hover:border-dark-blue hover:text-dark-blue focus:bg-dark-blue focus:border-dark-blue focus:text-white ease-out duration-200' onClick={() => showAddStaff(!addStaff)}>
                  <RiAddLargeLine className='md:text-lg'/>
                  Add Staff
                </button>
              </div>
              <div className='my-5 w-full flex flex-col md:flex-row md:items-center p-2 md:p-5 gap-5 md:gap-3 border-y border-black/20'>
                <span className='w-full flex flex-col'>
                  <span className='font-extrabold'>Enable Admin Page General Accessibility</span>
                  <span className='text-xs md:text-sm'>Once turned on, the Admin Page can be accessed by all visitors upon clicking the combination key <strong>(CTRL + SHIFT + A)</strong>. This override automatically disables after 30 minutes.</span>
                  {enable && generalExpiry && (
                    <em className='hidden md:block text-sm text-rose-500 mt-5'>
                      Active session expires on {formatExpiryDate(generalExpiry)}.
                    </em>
                  )}
                </span>
                <div className='w-full md:w-1/2 flex flex-col gap-1'>
                  <span className='flex gap-2 items-center justify-end'>
                    <strong className={`text-sm font-extrabold ${enable ? 'text-blue' : 'text-footer-bg'}`}>{enable ? 'ON' : 'OFF'}</strong>
                    <button type="button" className={`h-8 w-16 rounded-full border p-1 flex relative ${enable ? 'justify-end' : 'justify-start'} hover:border-light-blue focus:border-violet transition-all ease-out duration-200`} onClick={handleToggleGeneral}>
                      <span className={`h-full aspect-square rounded-full ${enable ? 'bg-blue' : 'bg-footer-bg'} ease-out duration-200`}></span>
                    </button>
                  </span>
                  <span className='text-xs text-neutral-600 text-right'>Automatically turns off after 30 minutes.</span>
                </div>
              </div>
              <div className='w-full grid grid-cols-1 md:grid-cols-3'>
                <div className='col-span-1 w-full flex flex-col rounded-xl border border-black/20 p-3 gap-3'>
                  <span className='w-full grid grid-cols-4 text-sm'>
                    <h3 className='col-span-3 font-bold'>Staffs</h3>
                    <h3 className='col-span-1 font-bold'>Role</h3>
                  </span>
                  <div className='w-full flex flex-col'>
                    {loadingStaff ? (
                      <div className='w-full text-center py-5 text-neutral-500'>Loading staff...</div>
                    ) : staffList.length === 0 ? (
                      <div className='w-full text-center py-5 text-neutral-500'>No staff added yet</div>
                    ) : (
                      staffList.map((staff) => (
                        <button
                          key={staff.staffID}
                          type="button"
                          onClick={() =>
                            setSelectedStaff({
                              staffID: staff.staffID,
                              firstName: staff.firstName,
                              lastName: staff.lastName,
                              email: staff.email,
                              role: normalizeRole(staff.role) || staff.role,
                              dateAdded: staff.dateAdded,
                              viewDashboard: Boolean(staff.viewDashboard),
                              viewOrders: Boolean(staff.viewOrders),
                              viewClients: Boolean(staff.viewClients),
                              viewAffiliates: Boolean(staff.viewAffiliates),
                              addProducts: Boolean(staff.addProducts),
                              changeContent: Boolean(staff.changeContent),
                              addOffers: Boolean(staff.addOffers)
                            })
                          }
                          className={`w-full grid grid-cols-4 text-sm py-2 px-2 rounded-md gap-2 text-left transition-colors ${
                            selectedStaff?.staffID === staff.staffID
                              ? 'bg-light-blue text-white'
                              : 'hover:bg-light-blue/30 text-black'
                          }`}
                        >
                          <span className='col-span-3 truncate font-medium'>{staff.firstName} {staff.lastName}</span>
                          <span className='col-span-1 text-xs truncate'>{staff.role}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <div className='col-span-2 md:flex w-full pl-10 hidden'>
                    {selectedStaff ? (
                      (() => {
                        const formData = (isEditing && editData) ? editData : selectedStaff;
                        return (
                      <div className='h-max xl:w-2/3 border border-black/20 rounded-xl p-3'>
                        <span className='w-full flex items-center gap-0.5 pl-2'>
                          <h5>Staff's Information</h5>
                          <button
                            type="button"
                            onClick={handleEditClick}
                            className='p-2 rounded-md text-xl ml-auto hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                          >
                            <RiBallPenFill />
                          </button>
                          <button
                            type="button"
                            className='p-2 rounded-md text-xl hover:bg-rose-200 focus:bg-rose-500 focus:text-white ease-out duration-200'
                            onClick={() => {
                              if (!selectedStaff) return;
                              setStaffToDelete(selectedStaff);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <RiDeleteBinLine />
                          </button>
                        </span>
                        <div className='w-full grid grid-cols-2 px-2 pb-5 mt-5 gap-5'>
                          <span className='col-span-1 flex flex-col w-full group'>
                            <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>First Name</strong>
                            <input
                              type="text"
                              placeholder='First Name'
                              value={formData?.firstName || ''}
                              disabled={!isEditing}
                              className={`px-5 py-2 rounded-md border border-black/30 ease-out duration-200 ${isEditing ? 'bg-white' : 'bg-neutral-100'}`}
                              onChange={(e) => isEditing && updateEditData('firstName', e.currentTarget.value)}
                            />
                          </span>
                          <span className='col-span-1 flex flex-col w-full group'>
                            <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Last Name</strong>
                            <input
                              type="text"
                              placeholder='Last Name'
                              value={formData?.lastName || ''}
                              disabled={!isEditing}
                              className={`px-5 py-2 rounded-md border border-black/30 ease-out duration-200 ${isEditing ? 'bg-white' : 'bg-neutral-100'}`}
                              onChange={(e) => isEditing && updateEditData('lastName', e.currentTarget.value)}
                            />
                          </span>
                          <span className='col-span-full flex flex-col w-full group'>
                            <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Email Address</strong>
                            <input
                              type="email"
                              placeholder='Email Address'
                              value={formData?.email || ''}
                              disabled={!isEditing}
                              className={`px-5 py-2 rounded-md border border-black/30 ease-out duration-200 ${isEditing ? 'bg-white' : 'bg-neutral-100'}`}
                              onChange={(e) => isEditing && updateEditData('email', e.currentTarget.value)}
                            />
                          </span>
                          <span className='col-span-full flex flex-col w-full group'>
                            <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Role</strong>
                            <span className='w-full flex relative'>
                              <input
                                type="text"
                                placeholder='Select Role'
                                value={formData?.role || ''}
                                readOnly
                                disabled={!isEditing}
                                className={`px-5 py-2 rounded-md border border-black/30 ease-out duration-200 cursor-pointer ${isEditing ? 'bg-white' : 'bg-neutral-100'}`}
                                onClick={() => {
                                  if (!isEditing) return;
                                  setStaffRoleDropdown(!staffRoleDropdown);
                                }}
                              />
                              {isEditing && staffRoleDropdown && (
                                <span
                                  ref={staffRoleOptionsRef}
                                  className='absolute flex flex-col top-full mt-1 rounded-md border border-black/20 w-full overflow-hidden bg-white hover:border-dark-blue ease-out duration-200 z-10'
                                >
                                  {STAFF_ROLE_OPTIONS.map((option) => (
                                    <button
                                      type="button"
                                      key={option}
                                      className='py-2 px-3 text-left hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                                      onClick={() => {
                                        updateEditData('role', option);
                                        setStaffRoleDropdown(false);
                                      }}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </span>
                              )}
                            </span>
                          </span>
                          <div className='col-span-full grid grid-cols-2 gap-3 mt-3'>
                            <div className='w-full flex flex-col col-span-1'>
                                <strong>General</strong>
                                <div className='ml-2 flex flex-col'>
                                  <span className='flex items-center gap-2'>
                                    <input
                                      type="checkbox"
                                      checked={!!formData?.viewDashboard}
                                      disabled={!isEditing}
                                      onChange={(e) => isEditing && updateEditData('viewDashboard', e.currentTarget.checked)}
                                    />
                                    <span>Dashboard</span>
                                  </span>
                                  <span className='flex items-center gap-2'>
                                    <input
                                      type="checkbox"
                                      checked={!!formData?.viewOrders}
                                      disabled={!isEditing}
                                      onChange={(e) => isEditing && updateEditData('viewOrders', e.currentTarget.checked)}
                                    />
                                    <span>Order List</span>
                                  </span>
                                  <span className='flex items-center gap-2'>
                                    <input
                                      type="checkbox"
                                      checked={!!formData?.viewClients}
                                      disabled={!isEditing}
                                      onChange={(e) => isEditing && updateEditData('viewClients', e.currentTarget.checked)}
                                    />
                                    <span>Client List</span>
                                  </span>
                                  <span className='flex items-center gap-2'>
                                    <input
                                      type="checkbox"
                                      checked={!!formData?.viewAffiliates}
                                      disabled={!isEditing}
                                      onChange={(e) => isEditing && updateEditData('viewAffiliates', e.currentTarget.checked)}
                                    />
                                    <span>Affiliate List</span>
                                  </span>
                                </div>
                            </div>
                            <div className='w-full flex flex-col col-span-1'>
                              <strong>Page Customization</strong>
                              <div className='ml-2 flex flex-col'>
                                <span className='flex items-center gap-2'>
                                  <input
                                    type="checkbox"
                                    checked={!!formData?.addProducts}
                                    disabled={!isEditing}
                                    onChange={(e) => isEditing && updateEditData('addProducts', e.currentTarget.checked)}
                                  />
                                  <span>Adding Products</span>
                                </span>
                                <span className='flex items-center gap-2'>
                                  <input
                                    type="checkbox"
                                    checked={!!formData?.changeContent}
                                    disabled={!isEditing}
                                    onChange={(e) => isEditing && updateEditData('changeContent', e.currentTarget.checked)}
                                  />
                                  <span>Changing Content</span>
                                </span>
                                <span className='flex items-center gap-2'>
                                  <input
                                    type="checkbox"
                                    checked={!!formData?.addOffers}
                                    disabled={!isEditing}
                                    onChange={(e) => isEditing && updateEditData('addOffers', e.currentTarget.checked)}
                                  />
                                  <span>Adding Offers</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                        );
                      })()
                    ) : (
                      <div className='h-max xl:w-2/3 border border-black/20 rounded-xl p-8 flex items-center justify-center'>
                        <p className='text-neutral-500'>Select a staff member to view details</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
        <AnimatePresence mode="wait">
          {addStaff && (
            <div className='absolute h-full w-full top-0 left-0 bg-black/20 backdrop-blur-xs z-50 flex items-center justify-center'>
              <motion.div 
                initial={{scale: 0.7, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.7, opacity: 0}}
                ref={outsideAddStaff} 
                className='xl:w-1/4 h-max rounded-lg bg-white p-5'
              >
                <h4 className='text-xl font-bold'>Add New Staff</h4>
                <div className='mt-10 flex flex-col gap-5'>
                  <span className='col-span-1 flex flex-col w-full group'>
                    <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>First Name</strong>
                    <input type="text" placeholder='First Name' className='px-3 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} />
                  </span>
                  <span className='col-span-1 flex flex-col w-full group'>
                    <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Last Name</strong>
                    <input type="text" placeholder='Last Name' className='px-3 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={lastName} onChange={(e) => setLastName(e.currentTarget.value)}/>
                  </span>
                  <span className='col-span-1 flex flex-col w-full group'>
                    <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Email Address</strong>
                    <input type="email" placeholder='Email Address' className='px-3 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200' value={email} onChange={(e) => setEmail(e.currentTarget.value)}/>
                  </span>
                  <span className='col-span-1 flex flex-col w-full group'>
                    <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Role</strong>
                    <span className='w-full flex relative'>
                      <input
                        type="text"
                        placeholder='Select Role'
                        value={roleInput}
                        readOnly
                        className='w-full px-3 py-2 rounded-md border border-black/30 hover:border-dark-blue ease-out duration-200 cursor-pointer'
                        onClick={() => showRoles(!role)}
                      />
                      {role && (
                        <span ref={outsideRoleOptions} className='absolute flex flex-col top-full mt-1 rounded-md border border-black/20 w-full overflow-hidden bg-white hover:border-dark-blue ease-out duration-200 z-10'>
                          {STAFF_ROLE_OPTIONS.map((option) => (
                            <button
                              type="button"
                              key={option}
                              className='py-2 px-3 text-left hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                              onClick={() => {
                                setRoleInput(option);
                                showRoles(false);
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className='col-span-1 flex flex-col w-full group'>
                    <strong className='text-sm uppercase text-neutral-500 font-extrabold group-hover:text-dark-blue ease-out duration-200'>Generated Password</strong>
                    <input
                      type="text"
                      value={generatedStaffPassword}
                      readOnly
                      className='px-3 py-2 rounded-md border border-dashed border-black/30 bg-neutral-100 text-sm tracking-wide text-neutral-600'
                    />
                    <small className='text-xs text-neutral-500 mt-1'>Share this password with the staff member. They can change it later.</small>
                  </span>
                  <strong className='text-lg'>Authorization</strong>
                  <div className='w-full grid grid-cols-2 gap-2 ml-3'>
                    <div className='flex flex-col col-span-1'>
                      <strong>General</strong>
                      <div className='ml-2 flex flex-col'>
                        <span className='flex items-center gap-2'>
                          <input type="checkbox" checked={viewDashboard} onChange={(e) => setViewDashboard(e.currentTarget.checked)}/>
                          <span>Dashboard</span>
                        </span>
                        <span className='flex items-center gap-2'>
                          <input type="checkbox" name="" id="" checked={viewOrders} onChange={(e) => setViewOrders(e.currentTarget.checked)} />
                          <span>Order List</span>
                        </span>
                        <span className='flex items-center gap-2'>
                          <input type="checkbox" name="" id="" checked={viewClients} onChange={(e) => setViewClients(e.currentTarget.checked)} />
                          <span>Client List</span>
                        </span>
                        <span className='flex items-center gap-2'>
                          <input type="checkbox" name="" id="" checked={viewAffiliates} onChange={(e) => setViewAffiliates(e.currentTarget.checked)} />
                          <span>Affiliate List</span>
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col col-span-1'>
                      <strong>Page Customization</strong>
                      <div className='ml-2 flex flex-col'>
                        <span className='flex items-center gap-2'>
                          <input type="checkbox" name="" id="" checked={addProducts} onChange={(e) => setAddProducts(e.currentTarget.checked)} />
                          <span>Adding Products</span>
                        </span>
                        <span className='flex items-center gap-2'>
                          <input type="checkbox" name="" id="" checked={changeContent} onChange={(e) => setChangeContent(e.currentTarget.checked)} />
                          <span>Changing Content</span>
                        </span>
                        <span className='flex items-center gap-2'>
                          <input type="checkbox" name="" id="" checked={addOffers} onChange={(e) => setAddOffers(e.currentTarget.checked)} />
                          <span>Adding Offers</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='w-full grid grid-cols-2 gap-3 mt-5'>
                    <button type="button" className='py-2 rounded-md border border-black/50 hover:border-black/70 focus:border-black focus:bg-black focus:text-white ease-out duration-200' onClick={() => { showAddStaff(false); resetForm() }}>Cancel</button>
                    <button type="button" className='py-2 rounded-md border border-blue text-blue hover:border-dark-blue hover:text-dark-blue focus:border-dark-blue focus:bg-dark-blue focus:text-white ease-out duration-200' onClick={handleConfirm} disabled={submitting}>{submitting ? 'Saving...' : 'Confirm'}</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {showEditConfirm && editData && (
          <div className='absolute h-full w-full top-0 left-0 bg-black/20 backdrop-blur-xs z-50 flex items-center justify-center'>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className='xl:w-1/4 h-max rounded-lg bg-white p-5'
            >
              <h4 className='text-xl font-bold'>Edit Staff</h4>
              <p className='mt-2 text-sm text-neutral-600'>
                Please review the changes carefully. Are you sure you want to update this staff member&apos;s information?
              </p>
              <div className='flex gap-3 mt-10'>
                <button
                  className='w-full p-2 rounded-md bg-gray-200'
                  onClick={() => setShowEditConfirm(false)}
                >
                  Cancel
                </button>

                <button
                  className='w-full p-2 rounded-md bg-blue-600 text-white disabled:opacity-70'
                  disabled={editLoading}
                  onClick={handleSaveEdit}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {showDeleteConfirm && staffToDelete && (
          <div className='absolute h-full w-full top-0 left-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='xl:w-1/4 h-max rounded-lg bg-white p-6 space-y-4'
            >
              <h4 className='text-xl font-bold text-rose-600'>Confirm Deletion</h4>
              <p className='text-sm text-neutral-700'>
                You are about to delete <strong>{staffToDelete.firstName} {staffToDelete.lastName}</strong>. This action cannot be undone.
                Do you wish to continue?
              </p>
              <div className='flex gap-3'>
                <button
                  type="button"
                  className='w-full py-2 rounded-md border border-neutral-400 hover:border-neutral-600 focus:border-neutral-800 ease-out duration-200'
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setStaffToDelete(null);
                  }}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className='w-full py-2 rounded-md border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white focus:bg-rose-700 focus:text-white ease-out duration-200'
                  onClick={async () => {
                    if (!staffToDelete) return;
                    setDeleteLoading(true);
                    try {
                      const res = await fetch(`https://ontap-creatives-website.vercel.app/api/client/staff/${staffToDelete.staffID}`, {
                        method: "DELETE",
                      });

                      if (res.ok) {
                        setStaffList(prev => prev.filter(s => s.staffID !== staffToDelete.staffID));
                        if (selectedStaff?.staffID === staffToDelete.staffID) {
                          setSelectedStaff(null);
                        }
                        setShowDeleteConfirm(false);
                        setStaffToDelete(null);
                      } else {
                        alert("Failed to delete staff.");
                      }
                    } catch (err) {
                      alert("Error deleting staff.");
                    } finally {
                      setDeleteLoading(false);
                    }
                  }}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
    </div>
  )
}

export default Settings