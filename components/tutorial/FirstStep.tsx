import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const Card = [
    "/images/card-1/front.png",
    "/images/card-5/front.png",
    "/images/card-2/front.png",
    "/images/card-3/front.png",
    "/images/card-4/front-card.png",
]

const Ontap = [
    "/images/dog-tag.png",
    "/images/info-tag.png",
    "/images/id-tap.png",
    "/images/key-chain.png",
    "/images/qr-standee.png"
]

const FirstStep = () => {
  const [index, setIndex] = useState(0);

  // Keep incrementing index forever
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1); // no modulo, just keeps going
    }, 3000); // every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='h-full w-full p-5 relative flex flex-col overflow-hidden'>
        <div className='absolute w-80 aspect-square'>
            <motion.div
                className="relative w-120 h-120 rounded-full border-1 border-dark-blue flex items-center justify-center transition-all transform-3d perspective-distant -left-[130%] top-1/2 -translate-y-1/3"
                animate={{ rotate: index * 72 }} // 360° / 5 cards = 72°
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                {Card.map((val, i) => {
                    return (
                        <div
                        key={i}
                        className="absolute top-1/2 left-1/2 -translate-1/2"
                        style={{
                            transform: `rotate(${i * (360 / Card.length)}deg) translateX(27rem)`,
                        }}
                        >
                        <span className='absolute top-1/2 -left-6 -translate-1/2 h-5 w-5 rounded-full bg-dark-blue z-50'></span>
                        {/* Gondola with counter-rotation */}
                        <motion.div
                            animate={{ rotate: index%5 / 72 }}
                            transition={{ type: "spring", stiffness: 150, damping: 18 }}
                            className="h-56 aspect-[3/2] overflow-hidden rounded-lg shadow-md shadow-black/30 bg-white flex items-center justify-center"
                        >
                            <Image
                            src={val}
                            alt="card image"
                            width={2048}
                            height={2048}
                            className="h-full w-full object-cover object-center"
                            />
                        </motion.div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
        <div className='mt-auto w-max p-2 rounded-lg mb-10 z-10 bg-white/30 backdrop-blur-sm border border-black/20'>
            <h2 className='font-bold text-lg'>Step 1: Select your card or any Ontap Product</h2>
            <p>We offer variety of styles, materials, and items.</p>
        </div>
    </div>
  )
}

export default FirstStep