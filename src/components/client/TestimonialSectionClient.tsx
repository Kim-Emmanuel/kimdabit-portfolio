'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { urlFor } from '@/utils/sanity'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable)
}

interface Testimonial {
  _id: string
  name: string
  role: string
  company: string
  image: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  testimonial: string
}

interface TestimonialSectionClientProps {
  testimonials: Testimonial[]
}

// Slider configuration
const SLIDE_WIDTH = 400
const SLIDE_GAP = 24
const SLIDE_FULL_WIDTH = SLIDE_WIDTH + SLIDE_GAP

const TestimonialSlider = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<HTMLDivElement[]>([])
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Motion values for smooth animation
  const x = useMotionValue(0)
  const springConfig = { damping: 30, stiffness: 300 }
  const springX = useSpring(x, springConfig)

  // Calculate slider width based on testimonials
  const isValidTestimonials = Array.isArray(testimonials) && testimonials.length > 0
  const sliderWidth = isValidTestimonials ? testimonials.length * SLIDE_FULL_WIDTH : 0

  // Early return component for empty state
  if (!isValidTestimonials) {
    return (
      <div className="text-center text-white/70 py-8">
        No testimonials available at the moment.
      </div>
    )
  }

  useEffect(() => {
    if (!sliderRef.current) return

    // Initialize GSAP Draggable
    const draggable = Draggable.create(sliderRef.current, {
      type: 'x',
      inertia: true,        bounds: {
          minX: -sliderWidth + SLIDE_WIDTH,
          maxX: 0
      },
      onDragStart: () => {
        setAutoPlayEnabled(false)
      },
      onDragEnd: function() {
        // Snap to nearest slide
        const currentX = this.x
        const nearestSlide = Math.round(Math.abs(currentX) / SLIDE_FULL_WIDTH)
        const targetX = -nearestSlide * SLIDE_FULL_WIDTH
        
        gsap.to(sliderRef.current, {
          x: targetX,
          duration: 0.5,
          ease: 'power2.out'
        })
        
        setCurrentIndex(nearestSlide)
      }
    })[0]

    return () => {
      draggable.kill()
    }
  }, [sliderWidth])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlayEnabled) return
    
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % testimonials.length
      const targetX = -nextIndex * SLIDE_FULL_WIDTH
      
      gsap.to(sliderRef.current, {
        x: targetX,
        duration: 1,
        ease: 'power2.inOut'
      })
      
      setCurrentIndex(nextIndex)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, autoPlayEnabled, testimonials.length])

  return (
    <div className="relative overflow-hidden" data-testid="testimonial-slider">
      {/* Slider Track */}
      <motion.div
        ref={sliderRef}
        className="flex gap-6"
        style={{ x: springX }}
        drag="x"
        dragConstraints={{
          left: -sliderWidth + SLIDE_WIDTH,
          right: 0
        }}
      >
        {testimonials.map((testimonial, index) => {
          // Ensure each testimonial has a valid ID
          const key = testimonial._id || `testimonial-${index}`
          return (
            <motion.div
              key={key}
              ref={el => {
                if (el) slideRefs.current[index] = el
              }}
              className="relative flex-shrink-0 w-[400px] p-6 bg-black/40 backdrop-blur-sm rounded-xl 
                       border border-secondary/10 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 }
              }}
              data-testid={`testimonial-slide-${index}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black/20">
                  {testimonial.image && (
                    <Image
                      src={urlFor(testimonial.image).url()}
                      alt={testimonial.name || 'Testimonial author'}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary">
                    {testimonial.name || 'Anonymous'}
                  </h3>
                  <p className="text-sm text-white/80">
                    {testimonial.role && testimonial.company 
                      ? `${testimonial.role} at ${testimonial.company}`
                      : ''}
                  </p>
                </div>
              </div>
              <p className="text-white/90 leading-relaxed">
                {testimonial.testimonial || 'No content available'}
              </p>
              
              {/* Quote decoration */}
              <svg
                className="absolute top-4 right-4 w-8 h-8 text-secondary/20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((testimonial, index) => {
          const key = testimonial._id || `nav-${index}`
          return (
            <button
              key={key}
              onClick={() => {
                setAutoPlayEnabled(false)
                const targetX = -index * SLIDE_FULL_WIDTH
                
                gsap.to(sliderRef.current, {
                  x: targetX,
                  duration: 0.7,
                  ease: 'power2.inOut'
                })
                
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-secondary w-6'
                  : 'bg-secondary/30 hover:bg-secondary/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`testimonial-nav-dot-${index}`}
            />
          )
        })}
      </div>

      {/* Auto-play Toggle */}
      <button
        onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
        className={`absolute bottom-0 right-0 p-2 text-sm text-secondary/70 hover:text-secondary
                   transition-colors ${autoPlayEnabled ? 'opacity-50' : ''}`}
        aria-label={autoPlayEnabled ? 'Pause auto-play' : 'Enable auto-play'}
      >
        {autoPlayEnabled ? 'Auto-playing' : 'Auto-play paused'}
      </button>
    </div>
  )
}

const TestimonialSectionClient = ({ testimonials }: TestimonialSectionClientProps) => {
  // Validate testimonials prop
  const validTestimonials = Array.isArray(testimonials) ? testimonials : []

  return (
    <section className="py-20 bg-primary-light/50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-primary-light/50 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            What People Say
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            {validTestimonials.length > 0 
              ? 'Hear what others have to say about their experience working with me.'
              : 'Testimonials coming soon.'}
          </p>
        </motion.div>

        <TestimonialSlider testimonials={validTestimonials} />
      </div>
    </section>
  )
}

export default TestimonialSectionClient
