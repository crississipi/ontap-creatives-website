import React, { useRef, useEffect } from 'react'
import Image from 'next/image'

/**
 * PROMPT USED TO GENERATE THIS COMPONENT:
 * 
 * Create an animated particle wave system based on the reference image showing flowing ribbon-like structures.
 * 
 * CRITICAL VISUAL REQUIREMENTS:
 * 1. Structure: The wave must be composed ENTIRELY of small individual dots/particles - NO LINES, NO STROKES, NO MESH
 * 2. Dot Properties:
 *    - Size: Very small (1-2 pixels base) but clearly visible as individual dots
 *    - Shape: Perfect circles
 *    - Spacing: Should match the density seen in reference (tightly packed to form visible ribbons)
 * 3. Colors: Extract and use ONLY colors from the reference image:
 *    - Deep navy/dark blue (#001040 - #003080 range) for distant/background ribbons
 *    - Medium cyan-blue (#0080C0 - #00A0E0) for mid-layer
 *    - Bright electric cyan (#00D0FF - #00FFFF) for foreground/highlight areas
 *    - NO pure white, NO other hues
 * 4. Background: Pure black (#000000) to match reference
 * 
 * ANIMATION REQUIREMENTS:
 * 1. Motion Type: Implement three simultaneous subtle motions:
 *    a) Waving: Gentle vertical sine wave oscillation (amplitude ~80-120px)
 *    b) Twisting: Slow rotation around the longitudinal axis of the ribbon
 *    c) Turning: Gradual 3D rotation to show different perspectives
 * 2. Speed: EXTREMELY slow - use time multiplier around 0.0001 to 0.0003
 * 3. Smoothness: Use smooth continuous functions (sine, cosine) - NO easing functions, NO lerp jumps
 * 4. Subtlety: Motion should be BARELY perceptible - viewer should notice it after 5-10 seconds of watching
 * 
 * MATHEMATICAL APPROACH:
 * 1. Create 40-80 parallel "ribbon lines" spread across Z-depth
 * 2. Each ribbon contains 100-200 particles distributed along its length
 * 3. For each particle at position index i on ribbon r:
 *    - Base X position: Map i linearly across screen width (0 to width)
 *    - Wave Y motion: sin(i * frequency + time + r * phase_offset) * amplitude
 *    - Add secondary Y ripple: cos(i * higher_frequency - time * 0.5) * smaller_amplitude
 *    - Z-depth: Base Z per ribbon + sin(i * frequency + time) * depth_oscillation
 *    - Apply 3D perspective projection to convert (x, y, z) to screen (x2d, y2d)
 * 4. Perspective: scale = focalLength / (focalLength + z + offset)
 * 5. Dot size: Scale with perspective (closer = larger)
 * 6. Opacity: Fade based on:
 *    - Distance from camera (z-depth)
 *    - Position along ribbon (fade at edges, i near 0 or max)
 * 
 * TECHNICAL IMPLEMENTATION:
 * 1. Use Canvas 2D API with ctx.arc() to draw each dot
 * 2. Set globalCompositeOperation to 'source-over' for natural layering
 * 3. Render loop:
 *    - Clear canvas with pure black
 *    - For each ribbon, for each particle:
 *      - Calculate 3D position with wave functions
 *      - Project to 2D
 *      - Draw circle if in front of camera
 * 4. Performance: Target 60fps, use requestAnimationFrame
 * 5. Responsive: Handle window resize, scale with DPR for sharp rendering
 * 
 * QUALITY CHECKLIST:
 * ✓ Dots are visible as distinct circles, not merged into lines
 * ✓ Motion is imperceptibly slow (30-60 second full cycle minimum)
 * ✓ Colors match reference (blue/cyan palette only)
 * ✓ Background is pure black
 * ✓ Animation loops seamlessly
 * ✓ Movement feels organic and natural, not mechanical
 * ✓ 3D depth illusion is present but subtle
 * ✓ No jitter, flicker, or sudden changes
 * 
 * The final result should look like a living, breathing data flow - elegant, minimal, hypnotic.
 */

const Funnel = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { 
            alpha: true,
            desynchronized: true 
        })
        if (!ctx) return

        // Configuration matching reference image density and structure
        const config = {
            ribbonCount: 70,              // Number of parallel ribbon lines
            particlesPerRibbon: 150,      // Dots per ribbon for smooth continuous appearance
            timeSpeed: 0.0009,           // Extremely slow time progression
            waveAmplitude: 95,            // Primary wave height
            waveFrequency: 7.5,           // Waves across the screen
            rippleAmplitude: 28,          // Secondary ripple height
            rippleFrequency: 6,           // Secondary ripple frequency
            twistAmplitude: 45,           // Rotation/twist strength
            zSpread: 700,                 // Depth separation between ribbons
            zOscillation: 60,             // Depth breathing amplitude
            perspective: 1000,             // Camera focal length
            baseDotSize: 0.7,             // Base particle size in pixels
        }

        // Color palette from reference image
        const getParticleColor = (ribbonIndex: number, depth: number) => {
            const ribbonNorm = ribbonIndex / config.ribbonCount
            
            // Map ribbon position to color
            // Near ribbons: Bright cyan
            // Mid ribbons: Medium blue
            // Far ribbons: Dark blue
            
            const depthFactor = Math.max(0, Math.min(1, (depth + 200) / 400))
            
            if (ribbonNorm < 0.3) {
                // Front layer - Bright Cyan
                const r = 0
                const g = Math.floor(200 + depthFactor * 55)
                const b = 255
                return `rgba(${r}, ${g}, ${b}, 0.7)`
            } else if (ribbonNorm < 0.7) {
                // Mid layer - Electric Blue
                const r = 0
                const g = Math.floor(120 + depthFactor * 80)
                const b = Math.floor(200 + depthFactor * 55)
                return `rgba(${r}, ${g}, ${b}, 0.5)`
            } else {
                // Back layer - Deep Blue
                const r = 0
                const g = Math.floor(40 + depthFactor * 80)
                const b = Math.floor(100 + depthFactor * 100)
                return `rgba(${r}, ${g}, ${b}, 0.3)`
            }
        }

        let width = 0
        let height = 0
        let time = 0
        let animationFrameId: number

        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            
            ctx.scale(dpr, dpr)
        }
        
        window.addEventListener('resize', resize)
        resize()

        const render = () => {
            // Clear with transparency
            ctx.clearRect(0, 0, width, height)

            ctx.globalCompositeOperation = 'source-over'

            const centerX = width / 2
            const centerY = height / 2

            // Render all ribbons and particles
            for (let r = 0; r < config.ribbonCount; r++) {
                const ribbonNorm = r / config.ribbonCount
                const ribbonPhaseOffset = ribbonNorm * Math.PI * 2
                
                // Each ribbon has a base Z position
                const zBase = (ribbonNorm - 0.5) * config.zSpread

                for (let i = 0; i < config.particlesPerRibbon; i++) {
                    const particleNorm = i / config.particlesPerRibbon // 0 to 1
                    
                    // Calculate 3D position with wave mathematics
                    
                    // X: Spread across viewport width
                    const xRange = width * 1.3
                    const x3d = (particleNorm - 0.5) * xRange
                    
                    // Y: Multi-layered wave composition
                    // Primary slow wave
                    const y_wave1 = Math.sin(
                        particleNorm * Math.PI * config.waveFrequency + 
                        time + 
                        ribbonPhaseOffset
                    ) * config.waveAmplitude
                    
                    // Secondary faster ripple for complexity
                    const y_wave2 = Math.cos(
                        particleNorm * Math.PI * config.rippleFrequency - 
                        time * 0.7
                    ) * config.rippleAmplitude
                    
                    // Vertical twist based on ribbon index (creates rotation illusion)
                    const y_twist = Math.sin(
                        ribbonPhaseOffset + 
                        time * 0.3
                    ) * config.twistAmplitude * particleNorm
                    
                    const y3d = y_wave1 + y_wave2 + y_twist
                    
                    // Z: Depth oscillation (breathing effect)
                    const z_wave = Math.cos(
                        particleNorm * Math.PI * config.waveFrequency + 
                        time * 0.8 + 
                        ribbonPhaseOffset
                    ) * config.zOscillation
                    
                    const z3d = zBase + z_wave

                    // Perspective projection
                    const depth = config.perspective + z3d + 250
                    const scale = config.perspective / depth
                    
                    if (scale <= 0) continue // Behind camera
                    
                    const x2d = centerX + x3d * scale
                    const y2d = centerY + y3d * scale
                    
                    // Calculate dot properties
                    const dotSize = config.baseDotSize * scale * 1.2
                    
                    // Opacity falloff
                    // 1. Edge fade: Fade out at ribbon endpoints
                    const edgeFade = 1 - Math.pow(Math.abs(particleNorm - 0.5) * 2, 7)
                    // 2. Depth fade: Fade distant particles
                    const depthFade = Math.min(1, scale * 1.3)
                    
                    const opacity = edgeFade * depthFade
                    
                    if (opacity < 0.03) continue // Skip nearly invisible dots
                    
                    // Get color for this particle
                    const color = getParticleColor(r, z3d)
                    
                    // Draw the dot
                    ctx.globalAlpha = opacity
                    ctx.fillStyle = color
                    ctx.beginPath()
                    ctx.arc(x2d, y2d, dotSize, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            // Increment time at extremely slow rate
            time += config.timeSpeed
            
            animationFrameId = requestAnimationFrame(render)
        }
        
        animationFrameId = requestAnimationFrame(render)

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div ref={containerRef} className='fixed top-0 left-0 w-full h-full bg-transparent pointer-events-none flex'>
            <Image
                priority
                height={4096}
                width={4096}
                alt='ontap creatives logo'
                src='/images/hero-bg.png'
                className='h-full w-full object-cover pt-5 absolute top-1/2 left-1/2 -translate-1/2 -z-1'
                draggable={false}
            />
            <canvas 
                ref={canvasRef} 
                className='block w-full h-full z-50 mt-60'
            />
        </div>
    )
}

export default Funnel