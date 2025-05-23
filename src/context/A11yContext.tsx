"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from 'react'

interface A11yContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  isReducedMotion: boolean
  setSkipToContent: (ref: HTMLElement | null) => void
}

const A11yContext = createContext<A11yContextType | undefined>(undefined)

interface A11yProviderProps {
  children: ReactNode
}

export const A11yProvider = ({ children }: A11yProviderProps) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const politeAnnouncerRef = useRef<HTMLDivElement>(null)
  const assertiveAnnouncerRef = useRef<HTMLDivElement>(null)
  const skipToContentRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = priority === 'polite' ? politeAnnouncerRef.current : assertiveAnnouncerRef.current
    if (announcer) {
      // Clear the announcer first
      announcer.textContent = ''
      // Force a reflow
      void announcer.offsetHeight
      // Set the new message
      announcer.textContent = message
    }
  }, [])

  const setSkipToContent = useCallback((ref: HTMLElement | null) => {
    skipToContentRef.current = ref
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.querySelector('[data-skip-link]') as HTMLElement
        if (skipLink) {
          skipLink.style.opacity = '1'
          skipLink.style.pointerEvents = 'auto'
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <A11yContext.Provider value={{ announce, isReducedMotion, setSkipToContent }}>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 opacity-0 pointer-events-none bg-secondary text-primary px-4 py-2 rounded-lg transition-opacity focus:opacity-100 focus:pointer-events-auto"
        data-skip-link
        onClick={(e) => {
          e.preventDefault()
          skipToContentRef.current?.focus()
        }}
      >
        Skip to main content
      </a>

      {/* Live regions for announcements */}
      <div
        ref={politeAnnouncerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        ref={assertiveAnnouncerRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />

      {children}
    </A11yContext.Provider>
  )
}

export const useA11y = () => {
  const context = useContext(A11yContext)
  if (context === undefined) {
    throw new Error('useA11y must be used within an A11yProvider')
  }
  return context
}
