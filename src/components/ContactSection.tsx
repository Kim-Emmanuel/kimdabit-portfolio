'use client'

import { useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import emailjs from '@emailjs/browser'
// import { Canvas } from '@react-three/fiber'
import ParticleCanvas from './canvas/ParticleCanvas'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/Kim-Emmanuel',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'www.linkedin.com/in/kimdabit',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/kimdabit004',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.207 0 3.58.012 4.85.07 1.27.059 2.16.27 2.66.57a5.25 5.25 0 011.8 1.8c.3.5.51 1.39.57 2.66.058 1.27.07 1.64.07 4.85s-.012 3.58-.07 4.85c-.059 1.27-.27 2.16-.57 2.66a5.25 5.25 0 01-1.8 1.8c-.5.3-1.39.51-2.66.57-1.27.058-1.64.07-4.85.07s-3.58-.012-4.85-.07c-1.27-.059-2.16-.27-2.66-.57a5.25 5.25 0 01-1.8-1.8c-.3-.5-.51-1.39-.57-2.66C2 15.257 2 14.88 2 12.163s.012-3.094.07-4.377c.059-1.27.27-2.16.57-2.66a5.25 5.25 0 011.8-1.8c.5-.3 1.39-.51 2.66-.57C8.37 2.175 8.74 2.163 12 2.163zm0-2.163c-3.259 0-3.668.014-4.948.072-1.277.06-2.148.261-2.913.558a5.419 5.419 0 00-1.948 1.277 5.418 5.418 0 00-1.276 1.949c-.297.765-.499 1.636-.558 2.913-.06 1.28-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.06 1.277.261 2.148.558 2.913.307.727.707 1.352 1.277 1.947a5.42 5.42 0 001.949 1.277c.765.297 1.636.499 2.913.558 1.28.06 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 1.277-.06 2.148-.261 2.913-.558a5.416 5.416 0 001.947-1.277 5.42 5.42 0 001.277-1.949c.297-.765.499-1.636.558-2.913.06-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.06-1.277-.261-2.148-.558-2.913a5.418 5.418 0 00-1.277-1.948 5.42 5.42 0 00-1.949-1.277c-.765-.297-1.636-.499-2.913-.558-1.28-.06-1.689-.073-4.948-.073z"/>
        <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
        <circle cx="18.406" cy="5.594" r="1.44"/>
      </svg>
    )
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/kimdabit',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    )
  }
]

const ContactSection = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const formControls = useAnimationControls()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await formControls.start({
        scale: [1, 0.98, 1],
        transition: { duration: 0.2 }
      })
      
      // Send email using EmailJS
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      if (result.text === 'OK') {
        setSubmitStatus('success')
        // Success animation
        await formControls.start({
          y: [0, -10, 0],
          transition: { duration: 0.3 }
        })

        // Reset form after successful submission
        if (formRef.current) {
          formRef.current.reset()
          setFormState({ name: '', email: '', message: '' })
        }
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-24 bg-primary-dark overflow-hidden">
      {/* Particle Background - Increased opacity for better visibility */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full">
          <ParticleCanvas
            mouseEffect={true}
            particleCount={2000} // Reduced count for better performance
            size={0.05} // Increased size for better visibility
            speed={0.04} // Slight increase in speed
            className="opacity-40 transition-opacity duration-500 hover:opacity-60" // Increased opacity
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl lg:max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Have a project in mind? Let's create something extraordinary together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <motion.form
              ref={formRef}
              animate={formControls}
              onSubmit={handleSubmit}
              className="w-full max-w-lg mx-auto backdrop-blur-xl bg-primary-light/20 p-6 sm:p-8 rounded-xl shadow-2xl border border-secondary/10"
            >
              {submitStatus === 'success' && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/20 text-green-300 text-sm">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">
                  Failed to send message. Please try again later or contact me directly at kimemmanuel004@gmail.com
                </div>
              )}

              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="name" className="block text-secondary font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-primary/70 border border-secondary/20 text-white placeholder-white/50
                            focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary
                            transition-colors"
                    placeholder="Your Name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="email" className="block text-secondary font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-primary/70 border border-secondary/20 text-white placeholder-white/50
                            focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary
                            transition-colors"
                    placeholder="your@email.com"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="message" className="block text-secondary font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-primary/70 border border-secondary/20 text-white placeholder-white/50
                            focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary
                            transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-lg bg-secondary text-primary font-bold text-lg
                          hover:bg-secondary-light transition-all duration-300 shadow-lg
                          disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center gap-4 max-w-lg mx-auto w-full"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-primary-light/30 backdrop-blur-md rounded-lg text-secondary
                        hover:bg-primary-light/50 transition-all duration-300 group border border-secondary/10"
                whileHover={{
                  scale: 1.03,
                  x: 8,
                  transition: { duration: 0.3 }
                }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index + 0.3 }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5 }
                  }}
                  className="text-accent"
                >
                  {link.icon}
                </motion.div>
                <span className="font-semibold group-hover:translate-x-1 transition-transform">
                  {link.name}
                </span>
                <svg 
                  className="w-5 h-5 ml-auto text-accent opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection