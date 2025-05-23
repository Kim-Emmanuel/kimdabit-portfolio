'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Canvas } from '@react-three/fiber'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import GodRays from '../canvas/GodRays'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin)

const HeroClient = () => {
  const textRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 700 }
  const rotateX = useSpring(0, springConfig)
  const rotateY = useSpring(0, springConfig)

  useEffect(() => {
    if (textRef.current) {
      const text = textRef.current
      const chars = text.textContent?.split('') || []
      
      text.innerHTML = chars
        .map(char => `<span class="inline-block">${char}</span>`)
        .join('')

      gsap.from(text.children, {
        opacity: 0,
        y: 20,
        rotation: 90,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        duration: 1,
      })
    }

    // Animate SVG paths
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path')
      gsap.set(paths, { drawSVG: "0%" })
      gsap.to(paths, {
        drawSVG: "100%",
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.inOut"
      })
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      
      const x = (clientX - innerWidth / 2) / innerWidth
      const y = (clientY - innerHeight / 2) / innerHeight
      
      mouseX.set(x)
      mouseY.set(y)
      rotateX.set(y * 20)
      rotateY.set(x * 20)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, rotateX, rotateY])

  const techStack = [
    'React', 'Next.js', 'TypeScript', 'Three.js', 'GSAP', 
    'Tailwind', 'Node.js', 'PostgreSQL', 'GraphQL', 'AWS'
  ]

  return (
    <div ref={containerRef} className="min-h-screen relative flex items-center overflow-hidden">
      {/* Animated SVG Background */}
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full z-0 opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q25,30 50,50 T100,50"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-secondary"
        />
        <path
          d="M0,60 Q25,40 50,60 T100,60"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-accent"
        />
      </svg>

      {/* Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <GodRays />
        </Canvas>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-secondary font-mono mb-4"
          >
            Hi, my name is
          </motion.p>

          <motion.div
            style={{
              perspective: 1000,
              rotateX: rotateX,
              rotateY: rotateY
            }}
          >
            <h1 ref={textRef} className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-secondary via-accent to-secondary 
                           bg-clip-text text-transparent inline-block">
                Kim Dabit
              </span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl leading-relaxed"
          >
            I craft <span className="text-secondary">immersive digital experiences</span> through 
            innovative engineering and thoughtful design.
          </motion.p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-4">
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.5 + (index * 0.1),
                  type: 'spring',
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [-1, 1, -1, 1, 0],
                  transition: { duration: 0.3 }
                }}
                className="px-4 py-2 rounded-full bg-primary-light text-secondary border border-secondary/20
                          hover:border-secondary transition-colors duration-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroClient
