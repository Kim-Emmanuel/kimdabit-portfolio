import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { BakeShadows } from '@react-three/drei'
import * as THREE from 'three'

interface GodRaysProps {
  color?: string
  intensity?: number
  speed?: number
  rayCount?: number
}

const GodRays: React.FC<GodRaysProps> = ({
  color = '#BEF264',
  intensity = 0.5,
  speed = 2.0,
  rayCount = 8
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const godRaysMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(size.width, size.height) },
      color: { value: new THREE.Color(color) },
      intensity: { value: intensity },
      speed: { value: speed },
      rayCount: { value: rayCount }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 resolution;
      uniform vec3 color;
      uniform float intensity;
      uniform float speed;
      uniform float rayCount;
      
      varying vec2 vUv;
      varying vec3 vPosition;

      #define PI 3.14159265359

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u * u * (3.0 - 2.0 * u);
        
        float res = mix(
          mix(dot(vec2(127.1, 311.7), sin(ip)), 
              dot(vec2(269.5, 183.3), sin(ip + vec2(0.0, 1.0))), u.y),
          mix(dot(vec2(419.2, 371.9), sin(ip + vec2(1.0, 0.0))), 
              dot(vec2(271.9, 269.5), sin(ip + vec2(1.0, 1.0))), u.y),
          u.x
        );
        return sin(res * 0.02) * 0.5 + 0.5;
      }

      void main() {
        vec2 position = vUv * 2.0 - 1.0;
        float angle = atan(position.y, position.x);
        float radius = length(position);
        
        // Enhanced ray effect with noise
        float rays = sin(angle * rayCount + time * speed) * 0.5 + 0.5;
        rays *= noise(vec2(angle * 4.0, time * speed * 0.5));
        
        // Improved radial falloff
        float circle = 1.0 - smoothstep(0.0, 0.8, abs(radius - 0.3));
        circle *= smoothstep(0.0, 0.1, radius);
        
        // Add subtle pulsing
        float pulse = sin(time * speed * 0.5) * 0.1 + 0.9;
        
        // Combine effects
        float alpha = rays * circle * pulse * intensity;
        
        // Add color variation based on angle
        vec3 finalColor = mix(color, color * 1.2, rays);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [color, intensity, speed, rayCount, size])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.resolution.value.set(size.width, size.height)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [size])

  // Animate the material
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth rotation based on mouse position
      const mouseX = (state.mouse.x * Math.PI) / 8
      const mouseY = (state.mouse.y * Math.PI) / 8
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY, 0.1)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, 0.1)
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta
    }
  })

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      <planeGeometry args={[5, 5, 64, 64]} />
      <primitive object={godRaysMaterial} ref={materialRef} attach="material" />
      <BakeShadows />
    </mesh>
  )
}

export default GodRays
