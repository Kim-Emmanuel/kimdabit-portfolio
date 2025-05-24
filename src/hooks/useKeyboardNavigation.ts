import { useEffect } from 'react'

interface KeyboardNavigationProps {
  selector: string
  onActivate?: (element: HTMLElement) => void
  deps?: readonly unknown[]
}

export const useKeyboardNavigation = ({ selector, onActivate, deps = [] }: KeyboardNavigationProps) => {
  // Using the spread operator in deps array is discouraged, so we'll handle it differently
  useEffect(() => {
    // Validate inputs
    if (!selector) return
    const elements = document.querySelectorAll<HTMLElement>(selector)
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const currentIndex = Array.from(elements).indexOf(target)

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault()
          if (currentIndex < elements.length - 1) {
            elements[currentIndex + 1].focus()
          } else {
            elements[0].focus()
          }
          break

        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          if (currentIndex > 0) {
            elements[currentIndex - 1].focus()
          } else {
            elements[elements.length - 1].focus()
          }
          break

        case 'Home':
          event.preventDefault()
          elements[0].focus()
          break

        case 'End':
          event.preventDefault()
          elements[elements.length - 1].focus()
          break

        case 'Enter':
        case ' ':
          event.preventDefault()
          if (onActivate) {
            onActivate(target)
          } else {
            target.click()
          }
          break
      }
    }

    elements.forEach(element => {
      element.addEventListener('keydown', handleKeyDown)
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0')
      }
    })

    return () => {
      elements.forEach(element => {
        element.removeEventListener('keydown', handleKeyDown)
      })
    }
  }, deps)
}
