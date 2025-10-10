"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoTriangle } from "react-icons/io5";
import Image from "next/image";
import { useClickOutside } from "@/hooks";

// Define types for better TypeScript support
type Rarity = "very-common" | "common" | "ultra" | "rare" | "very-rare" | "ultra-rare";

interface Voucher {
  id: number | string;
  label: string;
  rarity: Rarity;
}

interface VoucherRouletteProps {
  setRoulette: React.Dispatch<React.SetStateAction<boolean>>;
}

// 🎨 Fixed color mapping for each rarity
const rarityColors: Record<Rarity, string> = {
  "very-common": "#0FA36B", // Emerald — slightly teal-shifted for harmony
  "common": "#44C767", // Fresh Green — lighter, more vibrant complement tone
  "ultra": "#F43F5E", // Crimson Red — complements Cobalt beautifully
  "rare": "#F97316", // Vibrant Orange — complements Blue
  "very-rare": "#EAB308", // Golden Yellow — warmer, balances violet
  "ultra-rare": "#6366F1" // Soft Indigo Violet — complements the warm tones
};

export default function VoucherRoulette({setRoulette}: VoucherRouletteProps) {

  const outsideClickRef = useClickOutside<HTMLDivElement>(() => setRoulette(false));

  // 🎁 Base voucher list - no color property, only rarity
  const baseVouchers: Voucher[] = [
    { id: 1, label: "Better Luck Next Time", rarity: "very-common" },
    { id: 2, label: "Free Ship", rarity: "common" },
    { id: 3, label: "5% Discount", rarity: "ultra" },
    { id: 4, label: "10% Discount", rarity: "rare" },
    { id: 5, label: "15% Discount", rarity: "very-rare" },
    { id: 6, label: "20% Discount", rarity: "ultra-rare" },
  ];

  // ⚖️ Rarity weights with proper typing
  const rarityWeights: Record<Rarity, number> = {
    "very-common": 10,
    "common": 7,
    "ultra": 4,
    "rare": 2,
    "very-rare": 1,
    "ultra-rare": 1,
  };

  // 🧮 Group vouchers by label and calculate combined weights
  const groupedVouchers = useMemo(() => {
    const grouped: { [key: string]: { voucher: Voucher; weight: number } } = {};
    
    baseVouchers.forEach((voucher) => {
      const weight = rarityWeights[voucher.rarity];
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

  // 🎨 Create expanded voucher array for the wheel (with combined slices)
  const wheelVouchers = useMemo(() => {
    const expanded: (Voucher & { sliceSize: number })[] = [];
    
    groupedVouchers.forEach((group) => {
      for (let i = 0; i < group.weight; i++) {
        expanded.push({
          ...group.voucher,
          id: `${group.voucher.id}-slice${i}`,
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
      const color = rarityColors[group.voucher.rarity];
      
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

  // 🌀 Spin animation
  const startSpin = () => {
    if (isSpinning) return;

    // Reset states
    setShowResult(false);
    setSelectedIndex(null);
    setBounce(false);
    setPinRotation(0);
    pinPhaseRef.current = 0;
    lastRotationRef.current = 0;

    // 🎯 Weighted random selection by rarity
    const rarityChances: Record<Rarity, number> = {
      "ultra-rare": 1 / 9999,
      "very-rare": 1 / 4499,
      "rare": 1 / 1999,
      "ultra": 1 / 1499,
      "common": 1 / 599,
      "very-common": 1 / 1,
    };

    // Convert rarities to a weighted list
    const weightedVouchers = groupedVouchers.map((group) => ({
      ...group,
      probability: rarityChances[group.voucher.rarity],
    }));

    // Normalize probabilities
    const totalProb = weightedVouchers.reduce((sum, v) => sum + v.probability, 0);
    const normalized = weightedVouchers.map((v) => ({
      ...v,
      probability: v.probability / totalProb,
    }));

    // Pick based on cumulative probability
    const rand = Math.random();
    let cumulative = 0;
    let chosenGroup = normalized[0];
    for (const v of normalized) {
      cumulative += v.probability;
      if (rand <= cumulative) {
        chosenGroup = v;
        break;
      }
    }

    // Find all slices belonging to that group
    const matchingSlices = wheelVouchers
      .map((w, i) => ({ ...w, index: i }))
      .filter((w) => w.label === chosenGroup.voucher.label);

    // Pick a random slice within the group
    const targetSlice =
      matchingSlices[Math.floor(Math.random() * matchingSlices.length)].index;

    // Calculate spin amount so it lands exactly on the chosen slice
    const extraRotations = 5 + Math.floor(Math.random() * 2);
    const targetRotation =
      360 * extraRotations + targetSlice * degreePerSlice;

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
        setSelectedIndex(finalIndex);

        setTimeout(() => setBounce(true), 100);
        setTimeout(() => setShowResult(true), 800);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  // 👁️‍🗨️ Show result when user leaves the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
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
        setSelectedIndex(finalIndex);
        
        // Show results immediately
        setBounce(true);
        setShowResult(true);
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
      const radius = 100;

      currentAngle += sliceDegrees;

      return (
        <div
          key={group.voucher.id}
          className="absolute left-1/2 top-1/2 pointer-events-none origin-center flex items-center justify-center z-999"
          style={{
            transform: `translate(-50%, -50%) rotate(${sliceCenterAngle + 12}deg)`,
          }}
        >
          <div
            className="absolute text-sm font-semibold text-white w-24 text-right drop-shadow-md"
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

  const selectedVoucher = getSelectedVoucher();

  const image = ['/icons/truck.png', '/icons/percent.png', '/icons/gift.png']

  return (
    <div className="h-[100vh] bg-gradient-to-t from-violet via-light-blue to-white before:absolute before:top-0 before:left-0 before:h-full before:w-full before:z-30 before:bg-white/30 before:backdrop-blur-md p-6 flex flex-col items-center justify-center gap-6 select-none fixed top-1/2 left-1/2 -translate-1/2 w-full z-999">
      <motion.h1 
        initial={{scale:0.6, opacity:0}}
        animate={{scale:1, opacity:1}}
        exit={{scale:0.6, opacity:0}}
        transition={{type:'spring', stiffness:100, damping:20}}
        className="text-5xl font-extrabold text-dark-blue z-50"
      >Welcome to Spin-a-Wheel</motion.h1>
      <motion.p 
        initial={{scale:0.6, opacity:0}}
        animate={{scale:1, opacity:1}}
        exit={{scale:0.6, opacity:0}}
        transition={{type:'spring', stiffness:100, damping:20}}
        className="-mt-3 text-xl mb-10 z-50"
      >Try your luck in claiming best discounts!</motion.p>
      <div className="flex gap-20 z-50">
        <motion.div 
          initial={{y:150, opacity:0}}
          animate={{y:0, opacity:1}}
          exit={{y:150, opacity:0}}
          transition={{type:'spring', stiffness:100, damping:20}}
          className="flex flex-col relative"
        >
          {/* 🎡 Roulette Container */}
          <div className="relative">
            {/* 📍 Pin */}
            <motion.div
              animate={bounce ? { 
                rotateZ: [0, -4, 2, -2, 1, 0],
                scale: [1, 1.05, 1, 1.02, 1, 1]
              } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                rotate: pinRotation,
                transformOrigin: 'center top'
              }}
              className="absolute left-1/2 -translate-x-1/2 -top-7 z-30"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-16 flex items-center justify-center">
                  <IoTriangle className="text-rose-500 h-full w-full drop-shadow-md drop-shadow-black/30 rotate-z-180" />
                </div>
              </div>
            </motion.div>

            {/* 🎡 Wheel */}
            <div className="relative w-80 h-80">
              <div
                className="w-full h-full rounded-full border-8 border-white shadow-2xl relative overflow-hidden"
                style={{
                  background: `${wheelBackground}`,
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                {/* Slice Labels */}
                {renderLabels()}
              </div>

              {/* Decorative Outer Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400 -m-4 pointer-events-none" />
            </div>
            
            {/* Center Spin Button */}
            <button
              onClick={startSpin}
              disabled={isSpinning}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-lg font-bold transition-all duration-200 border-4 ${
                isSpinning
                  ? 'bg-white border-violet-400 cursor-not-allowed'
                  : 'bg-white text-violet-700 border-violet-200 hover:bg-violet-50 hover:scale-105 hover:text-violet-900 active:scale-95'
              }`}
            >
              <Image
                height={2048}
                width={2048}
                alt="spin icon"
                src='/images/logo.png'
                className="h-12 w-12 object-contain object-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                draggable={false}
              />
            </button>
          </div>

          {/* 🎉 Results */}
          <AnimatePresence>
            {showResult && selectedVoucher && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                ref={outsideClickRef}
                className="mt-6 bg-white p-6 rounded-2xl shadow-xl w-80 text-center border-2 border-violet-200"
              >
                {selectedVoucher.label !== 'Better Luck Next Time' ? (
                  <>
                    <div className="text-lg text-gray-600 mb-2">🎉 Congratulations!</div>
                    <div className="text-sm text-gray-500 mb-3">You won</div>
                    <div 
                      className="text-2xl font-bold mb-4 p-3 rounded-lg"
                      style={{ 
                        backgroundColor: `${rarityColors[selectedVoucher.rarity]}20`,
                        color: rarityColors[selectedVoucher.rarity]
                      }}
                    >
                      {selectedVoucher.label}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border">
                      Voucher code:{" "}
                      <span className="font-mono font-bold text-violet-600">
                        VCHR-{getOriginalId(selectedVoucher.id) * 239}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-lg text-gray-600">😞 Better Luck Next Time!</div>
                )}
                
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {selectedVoucher?.label !== 'Better Luck Next Time' && (
          <AnimatePresence>
            {showResult && selectedVoucher && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -100 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="h-full w-[40vw] grid grid-cols-3 gap-3"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <button key={i} type="button" className="col-span-1 w-full aspect-[2/3] rounded-xl flex flex-col bg-gradient-to-bl from-footer-bg via-violet to-dark-blue">
                    <span className="w-full aspect-square rounded-sm border-b-2 border-dashed border-white/40 p-3 flex items-center justify-center">
                      <span className="w-full h-full rounded-sm">
                        <Image
                          height={2048}
                          width={2048}
                          alt="voucher icon"
                          src={image[i]}
                          className="w-full h-full object-contain object-center"
                        />
                      </span>
                    </span>
                    <div className="min-h-10 w-full relative overflow-hidden -mt-4">
                      <span className="h-7 w-7 rounded-full bg-gradient-to-l from-white via-10% via-white to-70% to-neutral-50 absolute -left-3 shadow-[inset_0_2px_3px_rgba(0,0,0,1)]"></span>
                      <span className="h-7 w-7 rounded-full bg-gradient-to-r from-white via-10% via-white to-70% to-neutral-50 absolute -right-3 shadow-[inset_0_2px_3px_rgba(0,0,0,1)]"></span>
                    </div>
                    <div className="h-32 w-full shadow-md rounded-b-xl flex flex-col p-3 gap-3">
                      <div className="flex w-full items-center gap-1 text-neutral-50 text-left text-sm">
                        <span className="bg-neutral-50 h-3 w-3 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></span>
                        <p><strong>10% OFF</strong> on your first purchase</p>
                      </div>
                      <div className="flex w-full items-center gap-1 text-neutral-50 text-left text-sm">
                        <span className="bg-neutral-50 h-3 w-3 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></span>
                        <p><strong>Free Shipping</strong> for <strong>&gt;100</strong> qty </p>
                      </div>
                      <div className="flex w-full items-center gap-1 text-neutral-50 text-left text-sm">
                        <span className="bg-neutral-50 h-3 w-3 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></span>
                        <p><strong>₱50 OFF</strong> on every 75 items</p>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
      </div>
    </div>
  );
}