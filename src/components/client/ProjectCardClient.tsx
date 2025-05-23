'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, PresentationControls } from '@react-three/drei'
import { textScrambleEffect } from '@/utils/animations'
import { urlFor } from '@/utils/sanity'
import Schema from '../Schema'

interface ProjectCardProps {
  project: {
    title: string
    description: string
    image: any
    modelUrl?: string  // Optional 3D model URL
    techStack: Array<{ name: string }> | null
    demoUrl: string
    githubUrl: string
    performanceMetrics: {
      loadTime: number
      lighthouseScore: number
      firstContentfulPaint: number
    } | null
  }
}

const ProjectPreview = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  // Try to load the GLTF model with proper error handling
  const { nodes, materials } = useGLTF(url)

  useEffect(() => {
    const validateModel = async () => {
      try {
        if (!nodes || !nodes.Plane) {
          throw new Error('Failed to load model')
        }

        // Verify we have the required components
        const plane = nodes.Plane as any
        if (!plane || !plane.material?.map) {
          throw new Error('Model is missing required components')
        }

        setLoading(false)
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('3D Model Error:', errorMessage)
        setError(true)
        setLoading(false)
      }
    }

    validateModel()
  }, [nodes, url])

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-primary-dark/50 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent"></div>
        <p className="mt-4 text-secondary text-sm">Loading 3D Preview</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-primary-dark/50 backdrop-blur-sm">
        <div className="text-secondary/80 mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-secondary/80 text-sm">Failed to load 3D preview</p>
      </div>
    )
  }

  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]} // Optimize for retina displays
      performance={{ min: 0.5 }} // Lower framerate when not interacting
    >
      <PresentationControls
        global
        rotation={[0, -0.3, 0]}
        polar={[-0.4, 0.4]}
        azimuth={[-0.8, 0.8]}
        snap={true}
        speed={1.5}
        cursor={true}
      >
        <group position={[0, 0, 0]} scale={1.5}>
          <mesh>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              {...(nodes?.Plane as any)?.material}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        </group>
      </PresentationControls>
      
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <Environment preset="city" />
    </Canvas>
  )
}

const ProjectCardClient = ({ project }: ProjectCardProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleHover = () => {
      if (titleRef.current) {
        textScrambleEffect(titleRef.current, project.title)
      }
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mouseenter', handleHover)
      return () => card.removeEventListener('mouseenter', handleHover)
    }
  }, [project.title])

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    'name': project.title,
    'description': project.description,
    'codeRepository': project.githubUrl,
    'programmingLanguage': project.techStack ? project.techStack.map(tech => tech.name).join(', ') : '',
    'author': {
      '@type': 'Person',
      '@id': 'https://neuro-nexus.vercel.app/#person'
    },
    'url': project.demoUrl,
    'aggregateRating': project.performanceMetrics ? {
      '@type': 'AggregateRating',
      'ratingValue': project.performanceMetrics.lighthouseScore / 20,
      'bestRating': '5',
      'worstRating': '1',
      'ratingCount': '1'
    } : undefined
  }

  return (
    <>
      <Schema schema={projectSchema} />
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}
        className="group relative bg-primary-light rounded-lg overflow-hidden"
      >
        <div className="aspect-video relative overflow-hidden">
          {project.image ? (
            project.modelUrl ? (
              <ProjectPreview url={project.modelUrl} />
            ) : (
              <Image
                src={urlFor(project.image).url()}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )
          ) : (
            <div className="w-full h-full bg-primary-dark" />
          )}
        </div>

        <div className="p-6">
          <h3 ref={titleRef} className="text-2xl font-bold mb-2 text-secondary">
            {project.title}
          </h3>
          
          <p className="text-white/80 mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack && project.techStack.map((tech) => (
              <span
                key={tech.name}
                className="px-2 py-1 text-sm rounded-full bg-primary text-secondary/80"
              >
                {tech.name}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-light transition-colors"
                >
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary-light transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-sm text-secondary">
                {project.performanceMetrics?.lighthouseScore || 0}/100
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default ProjectCardClient