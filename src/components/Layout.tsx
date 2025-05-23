"use client"

import { ReactNode, useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useA11y } from '@/context/A11yContext'
import FocusTrap from '@/components/ui/FocusTrap'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import Schema from './Schema'

gsap.registerPlugin(ScrollTrigger)

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const { isReducedMotion } = useA11y()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: isReducedMotion ? 1 : 1.2,
      lerp: !isReducedMotion ? 0.1 : 1,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      orientation: 'vertical'
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Enhanced navbar animation with backdrop blur effect
    if (navRef.current) {
      let lastScroll = 0
      
      const showAnim = gsap.from(navRef.current, {
        yPercent: -100,
        paused: true,
        duration: 0.3,
        ease: "power2.out"
      }).progress(1)

      ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          const scrollDirection = self.getVelocity() < 0
          const scrolled = self.scroll()

          // Update scroll state for background blur
          setIsScrolled(scrolled > 50)

          if (scrollDirection && scrolled > 100) {
            showAnim.reverse()
            lastScroll = scrolled
          } else if (!scrollDirection && scrolled < lastScroll) {
            showAnim.play()
            lastScroll = scrolled
          }
        },
      })

      // Active section detection
      const sections = document.querySelectorAll('section[id]')
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id)
            }
          })
        },
        { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' }
      )

      sections.forEach((section) => sectionObserver.observe(section))

      return () => {
        sectionObserver.disconnect()
      }
    }

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isReducedMotion])

  // Enhanced mobile menu animation
  useEffect(() => {
    if (!isReducedMotion && mobileMenuRef.current) {
      const menuItems = mobileMenuRef.current.querySelectorAll('a')
      
      if (isMenuOpen) {
        gsap.set(mobileMenuRef.current, { display: 'block' })
        gsap.fromTo(mobileMenuRef.current, 
          { 
            opacity: 0,
            y: -20,
            backdropFilter: 'blur(0px)'
          },
          { 
            opacity: 1,
            y: 0,
            backdropFilter: 'blur(20px)',
            duration: 0.3,
            ease: "power2.out"
          }
        )
        
        gsap.fromTo(menuItems,
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.4,
            stagger: 0.1,
            delay: 0.1,
            ease: "power2.out"
          }
        )
      } else {
        gsap.to(menuItems,
          { 
            opacity: 0, 
            x: -20, 
            duration: 0.2,
            stagger: 0.05
          }
        )
        gsap.to(mobileMenuRef.current,
          { 
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(mobileMenuRef.current, { display: 'none' })
            }
          }
        )
      }
    }
  }, [isMenuOpen, isReducedMotion])

  // Hamburger animation
  useEffect(() => {
    if (!isReducedMotion && hamburgerRef.current) {
      const lines = hamburgerRef.current.querySelectorAll('path')
      
      if (isMenuOpen) {
        gsap.to(lines[0], { 
          rotation: 45, 
          y: 6, 
          transformOrigin: "center",
          duration: 0.3,
          ease: "power2.out"
        })
        gsap.to(lines[1], { 
          opacity: 0, 
          duration: 0.2
        })
        gsap.to(lines[2], { 
          rotation: -45, 
          y: -6, 
          transformOrigin: "center",
          duration: 0.3,
          ease: "power2.out"
        })
      } else {
        gsap.to(lines[0], { 
          rotation: 0, 
          y: 0, 
          duration: 0.3,
          ease: "power2.out"
        })
        gsap.to(lines[1], { 
          opacity: 1, 
          duration: 0.2,
          delay: 0.1
        })
        gsap.to(lines[2], { 
          rotation: 0, 
          y: 0, 
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }
  }, [isMenuOpen, isReducedMotion])

  const navigationItems = [
    { href: '#projects', label: 'Projects', icon: '🚀' },
    { href: '#skills', label: 'Skills', icon: '⚡' },
    { href: '#contact', label: 'Contact', icon: '📬' }
  ]

  useKeyboardNavigation({
    selector: 'nav a[href^="#"]',
    deps: [isMenuOpen]
  })

  const handleNavClick = (href: string, isMobile = false) => {
    return (e: React.MouseEvent) => {
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        if (isMobile) {
          setIsMenuOpen(false)
        }
        
        // Smooth scroll with offset for fixed header
        const offsetTop = (target as HTMLElement).offsetTop - 80
        
        if (isReducedMotion) {
          window.scrollTo({ top: offsetTop, behavior: 'auto' })
        } else {
          window.scrollTo({ top: offsetTop, behavior: 'smooth' })
        }
        
        // Focus management
        setTimeout(() => {
          (target as HTMLElement).focus({ preventScroll: true })
        }, 500)
      }
    }
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://kimdabit.vercel.app/#website',
        'url': 'https://kimdabit.vercel.app',
        'name': 'Kim Dabit Portfolio',
        'description': 'A cutting-edge developer portfolio showcasing technical mastery and creative innovation',
        'potentialAction': [{
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://kimdabit.vercel.app/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }]
      },
      {
        '@type': 'Person',
        '@id': 'https://kimdabit.vercel.app/#person',
        'name': 'Kim Dabit',
        'image': {
          '@type': 'ImageObject',
          '@id': 'https://kimdabit.vercel.app/#image',
          'url': 'https://kimdabit.vercel.app/avatar.jpg',
          'width': 400,
          'height': 400
        },
        'description': 'Software Developer specializing in modern web technologies',
        'sameAs': [
          'https://github.com/Kim-Emmanuel',
          'https://www.linkedin.com/in/kimdabite',
          'https://instagram.com/kimdabit004'
        ]
      }
    ]
  }

  return (
    <>
      <Schema schema={schemaData} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-secondary focus:text-primary focus:rounded-lg focus:shadow-lg transform focus:scale-105 transition-transform"
      >
        Skip to main content
      </a>

      <nav
        ref={navRef}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-xl bg-primary/90 shadow-lg border-b border-white/10' 
            : 'backdrop-blur-lg bg-primary/80'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Enhanced Logo */}
          <div 
            className="relative group cursor-pointer"
            role="banner"
            aria-label="Kim Dabit Portfolio"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent animate-gradient-x">
              KD
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            ref={hamburgerRef}
            className="md:hidden relative p-3 text-white/80 hover:text-secondary transition-all duration-300 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="main-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg
              className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" />
            </svg>
          </button>

          {/* Enhanced Desktop Navigation */}
          <div 
            className="hidden md:flex items-center space-x-2"
            id="main-menu"
            role="menubar"
          >
            {navigationItems.map((item) => {
              const isActive = activeSection === item.href.substring(1)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary group ${
                    isActive 
                      ? 'text-secondary bg-secondary/10 shadow-lg' 
                      : 'text-white/80 hover:text-secondary hover:bg-white/10'
                  }`}
                  role="menuitem"
                  onClick={handleNavClick(item.href)}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-secondary rounded-full transform -translate-x-1/2"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        <FocusTrap active={isMenuOpen}>
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 w-full bg-primary border-t border-white/20 shadow-2xl"
            style={{ 
              display: isMenuOpen ? 'block' : 'none',
              background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.95))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="container mx-auto px-4 py-6 space-y-2">
              {navigationItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-lg font-medium transition-all duration-300 group ${
                      isActive 
                        ? 'text-secondary bg-secondary/20 shadow-lg border border-secondary/30' 
                        : 'text-white hover:text-secondary hover:bg-white/15 border border-transparent hover:border-white/20'
                    }`}
                    role="menuitem"
                    onClick={handleNavClick(item.href, true)}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    )}
                    <svg 
                      className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )
              })}
            </div>
            
            {/* Mobile menu footer */}
            <div className="border-t border-white/20 px-4 py-4 bg-primary-light/50">
              <div className="text-center text-xs text-white/60">
                Navigate with keyboard or touch
              </div>
            </div>
          </div>
        </FocusTrap>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </nav>

      <main id="main-content">
        {children}
      </main>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  )
}

export default Layout