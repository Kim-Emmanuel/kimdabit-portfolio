'use client'

import { useRef, useEffect, useMemo, useCallback, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { optimizePerformance } from '@/utils/performance'
import ThreeJSErrorBoundary from './ThreeJSErrorBoundary'

interface ParticleFieldProps {
  count?: number
  mouseEffect?: boolean
  color?: string
  size?: number
  speed?: number
}

function ParticleField({ 
  count = 5000, 
  mouseEffect = true,
  color = '#BEF264',
  size = 0.05,
  speed = 0.05
}: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null!)
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  
  // Memoize particle arrays to prevent recreation on each render
  const [particlesPosition, particlesTarget, particlesColor] = useMemo(() => {
    const position = new Float32Array(count * 3)
    const target = new Float32Array(count * 3)
    const color = new Float32Array(count * 3)
    return [position, target, color]
  }, [count])
  
  const color1 = useMemo(() => new THREE.Color(color), [color])
  const color2 = useMemo(() => new THREE.Color('#EC4899'), [])
  
  // Initialize particle positions and colors
  useEffect(() => {
    const initializeParticles = () => {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        
        // Use cached Math functions for better performance
        const radius = Math.random() * 10
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const sinPhi = Math.sin(phi)
        
        // Spherical distribution with optimized calculations
        particlesPosition[i3] = radius * sinPhi * Math.cos(theta)
        particlesPosition[i3 + 1] = radius * sinPhi * Math.sin(theta)
        particlesPosition[i3 + 2] = radius * Math.cos(phi)
        
        // Copy initial positions to targets
        particlesTarget.set(particlesPosition.subarray(i3, i3 + 3), i3)
        
        // Optimize color calculation
        const mixFactor = (particlesPosition[i3 + 1] + 10) / 20
        const mixedColor = new THREE.Color()
        mixedColor.lerpColors(color1, color2, mixFactor)
        particlesColor.set([mixedColor.r, mixedColor.g, mixedColor.b], i3)
      }
    }

    initializeParticles()

    // Cleanup function
    return () => {
      const geometry = points.current?.geometry
      if (geometry) {
        geometry.dispose()
      }
    }
  }, [count, color1, color2, particlesPosition, particlesTarget, particlesColor])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseEffect) {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseEffect])

  // Memoize update functions for better performance
  const updateParticlePosition = useCallback((
    index: number,
    time: number,
    mouseEffect: boolean,
    positions: Float32Array,
    targets: Float32Array
  ) => {
    const i3 = index * 3
    
    // Reset target to base position
    targets[i3] = particlesPosition[i3]
    targets[i3 + 1] = particlesPosition[i3 + 1]
    targets[i3 + 2] = particlesPosition[i3 + 2]
    
    // Mouse interaction
    if (mouseEffect) {
      const dx = positions[i3] - lastMouse.current.x * 5
      const dy = positions[i3 + 1] - lastMouse.current.y * 5
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 2) {
        const force = (1 - dist / 2) * 0.2
        targets[i3] += dx * force
        targets[i3 + 1] += dy * force
      }
    }
    
    // Wave effect with performance optimization
    const timeOffset = time * speed + index * 0.1
    const sinVal = Math.sin(timeOffset)
    const cosVal = Math.cos(timeOffset)
    
    // Apply wave effect as an offset from base position
    targets[i3] += sinVal * 0.3
    targets[i3 + 1] += cosVal * 0.3
    targets[i3 + 2] += sinVal * 0.3
  }, [speed, particlesPosition])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Smooth mouse movement with damping
    const damping = 0.1
    lastMouse.current.x += (mouse.current.x - lastMouse.current.x) * damping
    lastMouse.current.y += (mouse.current.y - lastMouse.current.y) * damping
    
    // Batch updates for better performance
    const positions = points.current.geometry.attributes.position.array as Float32Array
    
    // Update target positions
    for (let i = 0; i < count; i++) {
      updateParticlePosition(i, time, mouseEffect, positions, particlesTarget)
    }

    // Apply smooth interpolation
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const lerpFactor = 0.02
      positions[i3] += (particlesTarget[i3] - positions[i3]) * lerpFactor
      positions[i3 + 1] += (particlesTarget[i3 + 1] - positions[i3 + 1]) * lerpFactor
      positions[i3 + 2] += (particlesTarget[i3 + 2] - positions[i3 + 2]) * lerpFactor
    }
    
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y = time * speed
  })

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        vertexColors
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
          needsUpdate={true}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particlesColor, 3]}
          needsUpdate={true}
        />
      </bufferGeometry>
    </Points>
  )
}

interface ParticleCanvasProps {
  mouseEffect?: boolean
  color?: string
  particleCount?: number
  size?: number
  speed?: number
  className?: string
}

const ParticleCanvas = ({
  mouseEffect = true,
  color = '#BEF264',
  particleCount = 5000,
  size = 0.05,
  speed = 0.05,
  className = ''
}: ParticleCanvasProps) => {
  // Detect device capabilities
  const isLowPerformance = useMemo(() => {
    if (typeof window === 'undefined') return false
    const hardwareConcurrency = window.navigator.hardwareConcurrency || 4
    return (
      hardwareConcurrency <= 4 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent
      )
    )
  }, [])

  // Get optimized Three.js configuration
  const threeJSConfig = useMemo(() => {
    const config = optimizePerformance()?.threeJSConfig
    return {
      antialias: config?.antialias ?? true,
      alpha: config?.alpha ?? true,
      powerPreference: (config?.powerPreference ?? 'high-performance') as WebGLPowerPreference
    }
  }, [])

  // Adjust particle count based on device capabilities
  const optimizedCount = useMemo(() => {
    return isLowPerformance ? Math.floor(particleCount / 2) : particleCount
  }, [isLowPerformance, particleCount])
  
  return (
    <div className={`${className} w-full h-full`} role="presentation" aria-hidden="true">
      <ThreeJSErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, isLowPerformance ? 1 : 2) : 1}
          performance={{ min: 0.5 }}
          gl={threeJSConfig}
        >
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <ParticleField
              count={optimizedCount}
              mouseEffect={mouseEffect && !isLowPerformance}
              color={color}
              size={size}
              speed={isLowPerformance ? speed * 0.75 : speed}
            />
          </Suspense>
        </Canvas>
      </ThreeJSErrorBoundary>
    </div>
  )
}

export default ParticleCanvas
