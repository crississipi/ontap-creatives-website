"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoTriangle } from "react-icons/io5";
import Image from "next/image";
import { RiArrowRightLine } from "react-icons/ri";

// Define types for better TypeScript support
type Rarity = "very-common" | "common" | "ultra" | "rare" | "very-rare" | "ultra-rare";

interface Voucher {
  id: number; // Change this to number to match
  label: string;
  rarity: Rarity;
  discount?: number; // Add this to match
  expiration?: string; // Add this to match
}

interface VoucherRouletteProps {
  setRoulette: React.Dispatch<React.SetStateAction<boolean>>;
  onVoucherWon?: (voucher: Voucher) => void;
}

// 🎨 Fixed color mapping for each rarity
const rarityColors: Record<Rarity, string> = {
  "very-common": "#10B981", // Emerald
  "common": "#22C55E", // Green
  "ultra": "#EF4444", // Red
  "rare": "#F97316", // Orange
  "very-rare": "#EAB308", // Yellow
  "ultra-rare": "#8B5CF6" // Violet
};

 const Discounts: Record<string, string> = {
  "5% Discount" : "/icons/5-off.png",
  "10% Discount" : "/icons/10-off.png",
  "15% Discount" : "/icons/15-off.png",
  "20% Discount" : "/icons/20-off.png"
 }

export default function VoucherRoulette({setRoulette, onVoucherWon}: VoucherRouletteProps) {
  const [clientID, setClientID] = useState<number | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [spinsRemaining, setSpinsRemaining] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [spin, numOfSpin] = useState(0);
  const [wonVouchers, setWonVouchers] = useState<(Voucher | null)[]>([]);

  // Initialize client session
  const initializeClient = async () => {
    try {
      // Get user session
      const sessionResponse = await fetch('https://ontap-creatives-website.vercel.app/api/auth/session', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        
      if (!sessionResponse.ok) {
        throw new Error('Failed to get session');
      }
      
      const sessionData = await sessionResponse.json();

      if (sessionData.user) {
        setUser(sessionData.user);
        setClientID(sessionData.user.clientID);

        // Check voucher eligibility
        const vouchersResponse = await fetch(`https://ontap-creatives-website.vercel.app/api/voucher?clientID=${sessionData.user.clientID}`);
        
        if (vouchersResponse.ok) {
          const vouchersData = await vouchersResponse.json();
          setCanSpin(vouchersData.canSpin);
          setSpinsRemaining(vouchersData.spinsRemaining);
          if (vouchersData.vouchers) {
            setWonVouchers(vouchersData.vouchers.map((v: any) => ({
              id: v.voucherID,
              label: v.voucherLabel,
              rarity: getRarityFromLabel(v.voucherLabel)
            })));
          }
        } else {
          setCanSpin(true);
          setSpinsRemaining(2);
        }
      } else {
        setCanSpin(false);
        setSpinsRemaining(0);
      }
    } catch (error) {
      setCanSpin(true);
      setSpinsRemaining(2);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeClient();
  }, []);

  const saveVoucherToBackend = async (selectedVoucherParam?: Voucher) => {
    const selectedVoucher = selectedVoucherParam || getSelectedVoucher();
    
    // ✅ FIX: Use the component's props, not a local 'props' variable
    if (selectedVoucher && onVoucherWon) {
      onVoucherWon(selectedVoucher);
    }
    
    if (selectedVoucher && clientID) {
      try {
        const response = await fetch('https://ontap-creatives-website.vercel.app/api/voucher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientID,
            voucherLabel: selectedVoucher.label,
            discount: selectedVoucher.label.includes('%') ? 
              parseInt(selectedVoucher.label) : 0
          })
        });

        const text = await response.text();
        let data;
        try { 
          data = JSON.parse(text); 
        } catch { 
          throw new Error('Invalid JSON response from server'); 
        }

        if (response.ok) {
          // ✅ Update spin-related states immediately
          setCanSpin(data.canSpin);
          setSpinsRemaining(data.spinsRemaining);

          // ✅ Add voucher to won list once only
          setWonVouchers(prev => [...prev, selectedVoucher]);

          // ✅ Show result *after successful save*
          setShowResult(true);
        } else {
          updateLocalSpinState();
          setWonVouchers(prev => [...prev, selectedVoucher]);
          setShowResult(true);
        }
      } catch (error) {
        updateLocalSpinState();
        setWonVouchers(prev => [...prev, selectedVoucher]);
        setShowResult(true);
      }
    }
  };

  // Helper function to update local state when backend fails
  const updateLocalSpinState = () => {
    // Use the actual spin count instead of wonVouchers.length
    const newSpinsUsed = spin + 1; // ⭐⭐ FIX: Use spin state instead of wonVouchers.length
    setSpinsRemaining(Math.max(0, 2 - newSpinsUsed));
    setCanSpin(newSpinsUsed < 2);
  };

  // Helper function with proper return type
  const getRarityFromLabel = (label: string): Rarity => {
    switch (label) {
      case 'Better Luck Next Time': return 'very-common';
      case '5% Discount': return 'ultra';
      case '10% Discount': return 'rare';
      case '15% Discount': return 'very-rare';
      case '20% Discount': return 'ultra-rare';
      default: return 'very-common';
    }
  };

  // 🎁 Base voucher list - no color property, only rarity
  const baseVouchers: Voucher[] = [
    { id: 1, label: "Better Luck Next Time", rarity: "very-common" },
    //    { id: 2, label: "Free Ship", rarity: "common" },
    { id: 3, label: "5% Discount", rarity: "ultra" },
    { id: 4, label: "10% Discount", rarity: "rare" },
    { id: 5, label: "15% Discount", rarity: "very-rare" },
    { id: 6, label: "20% Discount", rarity: "ultra-rare" },
  ];

  // ⚖️ Rarity weights with proper typing
  const rarityWeights: Record<Rarity, number> = {
    "very-common": 100,
    "common": 25,
    "ultra": 20,
    "rare": 15,
    "very-rare": 10,
    "ultra-rare": 5,
  };

  // Add type guard for Rarity
  const isRarity = (value: string): value is Rarity => {
    return ["very-common", "common", "ultra", "rare", "very-rare", "ultra-rare"].includes(value);
  };
  
  // Safe access to rarity weights
  const getRarityWeight = (rarity: string): number => {
    return isRarity(rarity) ? rarityWeights[rarity] : 0;
  };

  // Safe access to rarity colors
  const getRarityColor = (rarity: string): string => {
    return isRarity(rarity) ? rarityColors[rarity] : "#6B7280"; // default gray
  };

  // 🧮 Group vouchers by label and calculate combined weights
  const groupedVouchers = useMemo(() => {
    const grouped: { [key: string]: { voucher: Voucher; weight: number } } = {};
    
    baseVouchers.forEach((voucher) => {
      const weight = getRarityWeight(voucher.rarity); // Use safe access
      if (grouped[voucher.label]) {
        grouped[voucher.label].weight += weight;
      } else {
        grouped[voucher.label] = {
          voucher: { ...voucher },
          weight: weight
        };
      }
    });

    return Object.values(grouped);
  }, []);

  const totalSlices = groupedVouchers.reduce((sum, group) => sum + group.weight, 0);
  const degreePerSlice = 360 / totalSlices;

  // 🔄 State
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [pinRotation, setPinRotation] = useState(0);
  // 🔧 Refs
  const rotRef = useRef(0);
  const velRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pinPhaseRef = useRef(0);
  const lastRotationRef = useRef(0);

  // useEffect(() => {
  //   if(showResult) {
  //     const selectedVoucher = getSelectedVoucher();
  //     if (selectedVoucher && !wonVouchers.some(v => v?.id === selectedVoucher.id)) {
  //       setWonVouchers((prev) => [...prev, selectedVoucher]);
  //     }
  //   }
  // },[showResult])

  // 🎨 Create expanded voucher array for the wheel (with combined slices)
  const wheelVouchers = useMemo(() => {
    const expanded: (Voucher & { sliceSize: number })[] = [];
    
    groupedVouchers.forEach((group) => {
      for (let i = 0; i < group.weight; i++) {
        expanded.push({
          ...group.voucher,
          id: group.voucher.id * 100 + i,
          sliceSize: group.weight // Store the total slice size for this voucher
        });
      }
    });

    return expanded;
  }, []);

  // 🎨 Conic gradient with combined slices
  const gradientStops = useMemo(() => {
    let currentAngle = 0;
    const stops: string[] = [];

    groupedVouchers.forEach((group) => {
      const sliceDegrees = group.weight * degreePerSlice;
      const color = getRarityColor(group.voucher.rarity); // Use safe access
      
      // Main color for most of the slice
      stops.push(`${color} ${currentAngle + 0.5}deg ${currentAngle + sliceDegrees - 0.5}deg`);
      
      currentAngle += sliceDegrees;
    });

    return stops.join(", ");
  }, [groupedVouchers, degreePerSlice]);

  const wheelBackground = `conic-gradient(from 373deg, ${gradientStops})`;

  // 🎯 Calculate which voucher the pin is pointing to
  const calculateSelectedVoucher = (currentRotation: number): number => {
    // Normalize rotation to 0-360
    let normalizedRotation = currentRotation % 360;
    if (normalizedRotation < 0) normalizedRotation += 360;

    const pinAngle = 360;
    const effectiveAngle = (pinAngle - normalizedRotation + 360) % 360;
    const index = Math.floor(effectiveAngle / degreePerSlice);
    
    return index % wheelVouchers.length;
  };

  const startSpin = () => {
    if (isSpinning || !canSpin || !clientID) return;

    // Reset states
    setShowResult(false);
    setSelectedIndex(null);
    setBounce(false);
    setPinRotation(0);
    pinPhaseRef.current = 0;
    lastRotationRef.current = 0;

    // Replace the current probability calculation in startSpin with:
    const rarityChances: Record<Rarity, number> = {
      "very-common": 74.14,
      "common": 10.29,
      "ultra": 7.43,
      "rare": 4.57,
      "very-rare": 2.71,
      "ultra-rare": 0.86,
    };

    // Safe access to rarity chances
    const getRarityChance = (rarity: string): number => {
      return isRarity(rarity) ? rarityChances[rarity] : 0;
    };

// In your startSpin function:
const weightedVouchers = groupedVouchers.map((group) => ({
  ...group,
  probability: getRarityChance(group.voucher.rarity), // Use safe access
}));

    // Pick based on cumulative probability (OUTSIDE of animation loop)
    const rand = Math.random();
    let cumulative = 0;
    let chosenGroup = weightedVouchers[0];

    for (const v of weightedVouchers) {
      cumulative += v.probability;
      if (rand <= cumulative / 100) {
        chosenGroup = v;
        break;
      }
    }

    // Find all slices belonging to that group
    const matchingSlices = wheelVouchers
      .map((w, i) => ({ ...w, index: i }))
      .filter((w) => w.label === chosenGroup.voucher.label);

    // Pick a random slice within the group
    const targetSliceIndex = matchingSlices[Math.floor(Math.random() * matchingSlices.length)].index;

    // Calculate spin amount so it lands exactly on the chosen slice
    const extraRotations = 5 + Math.floor(Math.random() * 2);
    const targetRotation =
      360 * extraRotations + targetSliceIndex * degreePerSlice;

    // Start with high velocity
    velRef.current = targetRotation / 0.8;
    setIsSpinning(true);

    let lastTime = performance.now();
    const friction = 0.992;
    const minVelocity = 2;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (deltaTime > 0.1) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const previousRotation = rotRef.current;
      rotRef.current += velRef.current * deltaTime;
      setRotation(rotRef.current);
      velRef.current *= Math.pow(friction, deltaTime * 60);

      const absVel = Math.abs(velRef.current);
      if (absVel > 20) {
        const rotationDelta = rotRef.current - previousRotation;
        const sliceHits = Math.abs(rotationDelta) / degreePerSlice;
        const vibrationIntensity = Math.min(8, absVel / 40);
        const vibrationSpeed = Math.min(50, absVel / 5);
        pinPhaseRef.current += vibrationSpeed * deltaTime;
        const baseVibration = Math.sin(pinPhaseRef.current * 2) * vibrationIntensity;
        const impactVibration = Math.sin(pinPhaseRef.current * 8) * (vibrationIntensity * 0.3);
        const sliceCrossIntensity = Math.min(12, sliceHits * 3);
        const bounceEffect = Math.abs(Math.sin(pinPhaseRef.current * 4)) * sliceCrossIntensity;
        setPinRotation(baseVibration + impactVibration + bounceEffect);
      } else if (absVel > 5) {
        const vibrationIntensity = Math.min(4, absVel / 15);
        pinPhaseRef.current += absVel * deltaTime * 0.5;
        const vibration = Math.sin(pinPhaseRef.current * 3) * vibrationIntensity;
        setPinRotation(vibration);
      } else {
        if (absVel > 1) {
          pinPhaseRef.current += absVel * deltaTime * 0.2;
          const subtleMove = Math.sin(pinPhaseRef.current) * absVel * 0.1;
          setPinRotation(subtleMove);
        } else {
          setPinRotation(pinRotation * 0.9);
        }
      }

      lastRotationRef.current = rotRef.current;

      if (Math.abs(velRef.current) < minVelocity) {
        velRef.current = 0;
        setIsSpinning(false);
        setPinRotation(0);

        const finalIndex = calculateSelectedVoucher(rotRef.current);
        const selectedVoucher = wheelVouchers[finalIndex]; // ✅ get it immediately
        setSelectedIndex(finalIndex);
        numOfSpin((prev) => prev + 1);

        setTimeout(() => setBounce(true), 100);
        setTimeout(async () => { 
          await saveVoucherToBackend(selectedVoucher); // ✅ pass directly
        }, 800);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  // 👁️‍🗨️ Show result when user leaves the tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && isSpinning) {
        // User left the tab - stop spinning and show result immediately
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        
        velRef.current = 0;
        setIsSpinning(false);
        setPinRotation(0);
        
        // Calculate final selected voucher
        const finalIndex = calculateSelectedVoucher(rotRef.current);
        const selectedVoucher = wheelVouchers[finalIndex]; // ✅ get it immediately
        setSelectedIndex(finalIndex);
        numOfSpin((prev) => prev + 1);
        await saveVoucherToBackend(selectedVoucher);
        setBounce(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSpinning]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // 🏷️ Render slice labels - only one label per voucher group, centered in their combined slice
  const renderLabels = () => {
    let currentAngle = 0;
    
    return groupedVouchers.map((group) => {
      const sliceDegrees = group.weight * degreePerSlice;
      const sliceCenterAngle = currentAngle + (sliceDegrees / 2);
      const radius = 130;

      currentAngle += sliceDegrees;

      return (
        <div
          key={group.voucher.id}
          className="absolute left-1/2 top-1/2 pointer-events-none origin-center flex items-center justify-center z-20"
          style={{
            transform: `translate(-50%, -50%) rotate(${sliceCenterAngle}deg)`,
          }}
        >
          <div
            className="absolute text-xs md:text-sm font-black text-white w-32 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            style={{
              transform: `translateY(-${radius}px) rotate(90deg)`,
            }}
          >
            {group.voucher.label}
          </div>
        </div>
      );
    });
  };

  // 🔢 Extract original ID for voucher code
  const getOriginalId = (voucherId: string | number): number => {
    const idString = voucherId.toString();
    return parseInt(idString.split('-')[0]);
  };

  // 🎯 Get the original voucher from the selected wheel slice
  const getSelectedVoucher = () => {
    if (selectedIndex === null) return null;
    
    const wheelVoucher = wheelVouchers[selectedIndex];
    // Find the original base voucher that matches this label
    return baseVouchers.find(v => v.label === wheelVoucher.label) || wheelVoucher;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans selection:bg-violet-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-gray-100 to-gray-200 -z-10" />
      
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-gray-900 to-gray-600 drop-shadow-sm">
          LUCKY SPIN
        </h1>
        <p className="text-gray-600 mt-2 font-medium tracking-wide uppercase text-sm">
          Spin the wheel & win exclusive discounts
        </p>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center gap-12 z-10 w-full max-w-4xl">
        
        {/* 🎡 Roulette Machine */}
        <div className="relative group">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-violet-500/10 blur-[100px] rounded-full" />
            
            {/* Machine Casing */}
            <div className="relative w-[320px] h-80 md:w-120 md:h-120 rounded-full bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,1)] border border-gray-200 ring-1 ring-gray-100">
                
                {/* Inner Rim */}
                <div className="w-full h-full rounded-full bg-gray-100 p-2 shadow-[inset_0_5px_10px_rgba(0,0,0,0.1)]">
                    
                    {/* The Wheel */}
                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                        <motion.div
                            className="w-full h-full rounded-full relative"
                            style={{
                                background: wheelBackground,
                                rotate: rotation,
                            }}
                        >
                            {/* Overlay Gradient for 3D effect */}
                            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none z-10" />
                            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none z-10" />
                            
                            {/* Labels */}
                            {renderLabels()}
                        </motion.div>
                    </div>
                </div>

                {/* 📍 Pin (Hyperrealistic) */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-lg">
                    <motion.div
                        animate={bounce ? { rotateZ: [0, -15, 10, -5, 0] } : { rotateZ: pinRotation }}
                        transition={{ duration: 0.2 }}
                        style={{ transformOrigin: 'top center' }}
                        className="relative w-12 h-16"
                    >
                        {/* Pin Body */}
                        <div className="w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-30 border-t-gray-800 filter drop-shadow-[0_4px_2px_rgba(0,0,0,0.1)]" />
                        {/* Pin Head */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-linear-to-b from-gray-700 to-gray-900 shadow-md" />
                    </motion.div>
                </div>

                {/* Center Spin Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <button
                        onClick={startSpin}
                        disabled={isSpinning || isLoading || spin >= 2}
                        className={`
                            relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
                            transition-all duration-200 active:scale-95
                            ${isSpinning || isLoading || spin >= 2 
                                ? 'grayscale cursor-not-allowed opacity-80' 
                                : 'hover:scale-105 cursor-pointer'}
                        `}
                    >
                        {/* Button Bezel */}
                        <div className="absolute inset-0 rounded-full bg-linear-to-b from-gray-100 to-gray-300 shadow-[0_10px_20px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)]" />
                        
                        {/* Button Face */}
                        <div className="absolute inset-2 rounded-full bg-linear-to-b from-white to-gray-100 shadow-[inset_0_2px_5px_rgba(0,0,0,0.1)] flex items-center justify-center border border-gray-200">
                            {/* Inner Icon/Text */}
                            <div className="text-gray-800 font-bold text-sm md:text-base tracking-widest drop-shadow-sm">
                                {isSpinning ? '...' : 'SPIN'}
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Spins Remaining Indicator */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    spinsRemaining > 0 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                        : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                    {isLoading ? 'Loading...' : spinsRemaining <= 0 ? 'No spins left' : `${spinsRemaining} Spins Left`}
                </div>
            </div>
        </div>

        {/* Results Section (Below) */}
        <div className="w-full max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
                {Array.from({length: 2}).map((_, i) => (
                    <div key={i} className="relative h-24 md:h-32 rounded-xl bg-white border border-gray-200 overflow-hidden group shadow-sm">
                        {wonVouchers[i] ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex items-center p-4 gap-4"
                            >
                                {/* Icon */}
                                <div className="h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-lg bg-gray-50 p-2 border border-gray-100 shadow-inner">
                                    <Image
                                        height={100}
                                        width={100}
                                        alt="voucher"
                                        src={wonVouchers[i]?.label === 'Better Luck Next Time' ? '/icons/better-luck-next-time.png' : Discounts[wonVouchers[i]!.label]}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                {/* Text */}
                                <div className="flex flex-col">
                                    <span className={`text-sm md:text-lg font-bold ${wonVouchers[i]?.label === 'Better Luck Next Time' ? 'text-gray-500' : 'text-gray-900'}`}>
                                        {wonVouchers[i]?.label}
                                    </span>
                                    {wonVouchers[i]?.label !== 'Better Luck Next Time' && (
                                        <span className="text-xs text-emerald-600 font-medium">Active Reward</span>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium uppercase tracking-wider border-2 border-dashed border-gray-200 rounded-xl m-1">
                                Empty Slot
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Back Button */}
            {wonVouchers.length === 2 && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setRoulette(false)}
                    className="mt-8 w-full py-4 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all active:scale-[0.98]"
                >
                    Collect & Return
                </motion.button>
            )}
        </div>

      </div>
    </div>
  );
}