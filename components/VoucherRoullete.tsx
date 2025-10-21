"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoTriangle } from "react-icons/io5";
import Image from "next/image";
import { RiArrowRightLine } from "react-icons/ri";

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

 const Discounts: Record<string, string> = {
  "5% Discount" : "/icons/5-off.png",
  "10% Discount" : "/icons/10-off.png",
  "15% Discount" : "/icons/15-off.png",
  "20% Discount" : "/icons/20-off.png"
 }

export default function VoucherRoulette({setRoulette}: VoucherRouletteProps) {

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
  const [wonVouchers, setWonVouchers] = useState<(Voucher | null)[]>([]);

  // 🔧 Refs
  const rotRef = useRef(0);
  const velRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pinPhaseRef = useRef(0);
  const lastRotationRef = useRef(0);

  useEffect(() => {
    if(showResult) {
      const selectedVoucher = getSelectedVoucher();
      if (selectedVoucher) {
        setWonVouchers((prev) => 
        [...prev, selectedVoucher]);
      }
    }
  },[showResult])

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

  const startSpin = () => {
    if (isSpinning) return;

    // Reset states
    setShowResult(false);
    setSelectedIndex(null);
    setBounce(false);
    setPinRotation(0);
    pinPhaseRef.current = 0;
    lastRotationRef.current = 0;

    // 🎯 Weighted random selection by rarity - FIXED PROBABILITIES
    const rarityChances: Record<Rarity, number> = {
      "very-common": 100,  // Highest probability for "Better Luck Next Time"
      "common": 10,
      "ultra": 5,
      "rare": 3,
      "very-rare": 2,
      "ultra-rare": 1,     // Lowest probability for rarest vouchers
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
        setTimeout(() => { setShowResult(true); }, 800);
        
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
            transform: `translate(-50%, -50%) rotate(${sliceCenterAngle + 14}deg)`,
          }}
        >
          <div
            className="absolute text-lg font-extrabold text-white mb-16 w-30 text-left drop-shadow-md"
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

  const image = ['/icons/truck.png', '/icons/percent.png', '/icons/gift.png']

  return (
    <div className="h-[100vh] bg-gradient-to-t from-0% from-[#e8e6e5] via-15% via-[#f3f1ee] to-25% to-[#f8f5f4] p-6 flex flex-col items-center justify-center gap-6 select-none fixed top-1/2 left-1/2 -translate-1/2 w-full z-999">
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
      <div className="flex gap-20 z-50 ml-52">
          <div className="h-2/5 absolute z-20 top-1/2 left-0">
            <Image 
              height={2048}
              width={2048}
              alt="robot animation"
              src={isSpinning ? '/video/robot-animation.gif' : getSelectedVoucher()?.label === 'Better Luck Next Time' ? '/video/sad-animation.gif' : '/video/happy-animation.gif'}
              className="h-full w-auto object-contain object-center"
            />
          </div>
        <motion.div 
          initial={{y:150, opacity:0}}
          animate={{y:0, opacity:1}}
          exit={{y:150, opacity:0}}
          transition={{type:'spring', stiffness:100, damping:20}}
          className="flex flex-col relative ml-36 z-40"
        >
          {/* 🎡 Roulette Container */}
          <div className="relative">
            {/* 📍 Pin */}
            <motion.div
              animate={bounce ? { 
                rotateZ: [0, 4, -2, 3, 1, 0],
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
            <div className="relative w-120 h-120">
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
              onClick={() => wonVouchers.length < 2 && startSpin()}
              disabled={isSpinning || wonVouchers.length > 2}
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
        </motion.div>
        <div className="h-full w-auto grid grid-cols-3 gap-3 items-center">
          {Array.from({length: 2}).map((_,i) => (
            <div key={i} className="col-span-1 w-full h-full relative flex">  
              <div className="w-full h-full flex flex-col overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
              <div className={`w-full aspect-square rounded-xl rounded-b-none ${wonVouchers[i] && wonVouchers[i]?.label === 'Better Luck Next Time' ? 'border-8 border-b-0 border-[#bb1d1c]' : 'border-4 border-b-0 border-dashed  border-black/30'}`}></div>
                <div className={`h-8 w-full flex items-center justify-between ${wonVouchers[i] && wonVouchers[i]?.label === 'Better Luck Next Time' && 'border-x-8 border-[#bb1d1c]'}`}>
                  {wonVouchers[i]?.label !== 'Better Luck Next Time' && (
                    <>
                      <span className="h-8 w-8 rounded-full border-4 border-dashed -ml-4  border-black/30"></span>
                      <span className="h-8 w-8 rounded-full border-4 border-dashed -mr-4  border-black/30"></span>
                    </>
                  )}
                </div>
                <div className={`w-full h-full rounded-xl rounded-t-none ${wonVouchers[i] && wonVouchers[i]?.label === 'Better Luck Next Time' ? 'border-8 border-t-0 border-[#bb1d1c]' : 'border-4 border-t-0 border-dashed  border-black/30'}`}></div>
              </div>

              <AnimatePresence>
                {wonVouchers[i] ? (
                  <>
                    {wonVouchers[i]?.label !== 'Better Luck Next Time' ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, x: -100 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -100 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="h-full w-full z-50"
                      >
                        <div className="h-full w-full rounded-xl z-50 flex flex-col bg-gradient-to-bl from-footer-bg via-violet to-dark-blue">
                          <span className="w-full aspect-square rounded-sm border-b-2 border-dashed border-white/40 p-1 flex items-center justify-center ">
                            <span className="w-full h-full rounded-lg overflow-hidden">
                              <Image
                                height={2048}
                                width={2048}
                                alt="voucher icon"
                                src={Discounts[wonVouchers[i].label]}
                                className="w-full h-full object-contain object-center"
                              />
                            </span>
                          </span>
                          <div className="min-h-10 w-full relative overflow-hidden -mt-4">
                            <span className="h-7 w-7 rounded-full bg-[#f8f5f4] absolute -left-3 shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></span>
                            <span className="h-7 w-7 rounded-full bg-[#f8f5f4] absolute -right-3 shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></span>
                          </div>
                          <span className="w-full flex flex-col items-center justify-center -mt-3 text-white">
                            <h3 className="text-lg font-extrabold uppercase">{wonVouchers[i].label}</h3>
                            <p className="text-sm -mt-1">in all items</p>
                          </span>
                          <div className="mt-auto h-auto w-full shadow-md rounded-b-xl flex flex-col p-3 gap-1">
                            <div className="flex w-full items-center gap-1 text-neutral-50 text-left text-sm">
                              <span className="bg-neutral-50 h-3 aspect-square rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></span>
                              <p>This voucher is <strong className="font-extrabold">one-time use only</strong></p>
                            </div>
                            <div className="flex w-full items-center gap-1 text-neutral-50 text-left text-sm">
                              <span className="bg-neutral-50 h-3 aspect-square rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></span>
                              <p>
                                Expires in{" "}
                                <strong>
                                  {(() => {
                                    const d = new Date();
                                    d.setMonth(d.getMonth() + 1);
                                    return d.toLocaleString("default", { month: "long", year: "numeric" });
                                  })()}
                                </strong>
                              </p>
                            </div>
                            <div className="flex w-full items-center gap-1 text-neutral-50 text-left text-sm">
                              <span className="bg-neutral-50 h-3 aspect-square rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></span>
                              <p>You can only use <strong className="font-extrabold">1 voucher</strong> in every purchase</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                  ): (
                      <motion.div 
                      initial={{opacity: 0, scale: 1.3}}
                      animate={{opacity: 1, scale: 1}}
                      transition={{duration: 0.7}}
                      className="h-full w-full aspect-square p-3 flex items-center justify-center"
                      >
                        <Image
                          height={2048}
                          width={2048}
                          alt="better luck next time icon"
                          src='/icons/better-luck-next-time.png'
                          className="w-full aspect-square object-center object-contain"
                        />
                      </motion.div>
                  )}
                  </>
                ) : (
                  <div className="border-4 border-dashed border-black/10 m-auto mt-20 w-3/4 text-2xl font-extrabold text-black/10 text-center p-3 rounded-md">
                    Your voucher goes here
                  </div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {/** voucher 1 */}

          {wonVouchers.length === 2 && (
            <div className="flex items-end h-full w-full ml-10 mb-20">
              <motion.button 
              animate={{ 
                boxShadow: [
                  '0 0 0 0px #C5D9E7',
                  '0 0 0 5px #5A5CA8',
                  '0 0 0 3px #C5D9E7',
                  '0 0 0 5px #2C4594',
                  '0 0 0 0px #5A5CA8',
                ],
              }}
              transition={{
                  duration: 1.5,
                  ease: 'easeOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              type="button" className="px-5 pr-3 py-3 rounded-md flex items-center gap-3 bg-blue font-bold text-white ring-4 hover:bg-violet focus:bg-dark-blue ease-out duration-200 z-50" onClick={() => setRoulette(false)}>GO BACK
                <motion.span 
                animate={{x: [-20,0,-10,0,-15,0]}}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                  repeatDelay: 2
                }}
                className="text-2xl">
                  <RiArrowRightLine />
                </motion.span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}