import { gsap } from 'gsap'

export const textScrambleEffect = (element: HTMLElement, newText: string) => {
  const chars = '!<>-_\\/[]{}—=+*^?#'
  const oldText = element.innerText
  const maxLength = Math.max(oldText.length, newText.length)
  
  interface QueueItem {
    from: string;
    to: string;
    start: number;
    end: number;
  }

  const queue: QueueItem[] = [];
  
  for (let i = 0; i < maxLength; i++) {
    const from = oldText[i] || ''
    const to = newText[i] || ''
    const start = Math.floor(Math.random() * 40)
    const end = start + Math.floor(Math.random() * 40)
    queue.push({ from, to, start, end })
  }
  
  let frame = 0
  
  const update = () => {
    let output = ''
    let complete = 0
    
    for (let i = 0; i < queue.length; i++) {
      const { from, to, start, end } = queue[i]
      
      if (frame >= end) {
        complete++
        output += to
      } else if (frame >= start) {
        output += chars[Math.floor(Math.random() * chars.length)]
      } else {
        output += from
      }
    }
    
    element.innerText = output
    
    if (complete === queue.length) {
      return false
    }
    
    frame++
    return true
  }
  
  const timer = setInterval(() => {
    if (!update()) {
      clearInterval(timer)
    }
  }, 50)
}

export const revealAnimation = (element: HTMLElement, delay: number = 0) => {
  return gsap.from(element, {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: 'power4.out',
    delay,
  })
}

export const floatingAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    y: 20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  })
}

export const staggerReveal = (elements: HTMLElement[], stagger: number = 0.1) => {
  return gsap.from(elements, {
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger,
    ease: 'power3.out',
  })
}

export const pathAnimation = (path: SVGPathElement) => {
  const length = path.getTotalLength()
  
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  })
  
  return gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2,
    ease: 'power2.inOut',
  })
}
