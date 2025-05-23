import { useEffect, useRef, ReactNode } from 'react'

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  className?: string
}

const FocusTrap = ({ children, active = true, className = '' }: FocusTrapProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    // Store the element that had focus before the trap was activated
    initialFocusRef.current = document.activeElement as HTMLElement

    // Get all focusable elements within the container
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements[focusableElements.length - 1]

    // Set initial focus to the first focusable element
    firstFocusableElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!active) return
      if (e.key !== 'Tab') return

      // Handling Tab and Shift+Tab navigation
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault()
          lastFocusableElement?.focus()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault()
          firstFocusableElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      // Restore focus when trap is deactivated
      if (active) {
        initialFocusRef.current?.focus()
      }
    }
  }, [active])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export default FocusTrap
