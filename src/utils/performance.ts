/**
 * Interface for Web Vitals metrics
 * @interface WebVitals
 */
export interface WebVitals {
  /** First Contentful Paint in milliseconds */
  FCP: number
  /** Largest Contentful Paint in milliseconds */
  LCP: number
  /** Cumulative Layout Shift score */
  CLS: number
  /** First Input Delay in milliseconds */
  FID: number
  /** Time to First Byte in milliseconds */
  TTFB: number
}

/**
 * Retrieves Web Vitals metrics for performance monitoring
 * @async
 * @returns {Promise<WebVitals>} Object containing performance metrics
 */
export const getWebVitals = async (): Promise<WebVitals> => {
  if (typeof window === 'undefined') {
    return {
      FCP: 0,
      LCP: 0,
      CLS: 0,
      FID: 0,
      TTFB: 0,
    }
  }

  const entries = performance.getEntriesByType('navigation')
  const paintEntries = performance.getEntriesByType('paint')
  
  const navEntry = entries[0] as PerformanceNavigationTiming
  const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
  
  return {
    FCP: fcpEntry ? fcpEntry.startTime : 0,
    LCP: 0, // Requires PerformanceObserver in real implementation
    CLS: 0, // Requires PerformanceObserver in real implementation
    FID: 0, // Requires PerformanceObserver in real implementation
    TTFB: navEntry ? navEntry.responseStart - navEntry.requestStart : 0,
  }
}

/**
 * Optimizes application performance through various techniques
 * @returns {Object} Configuration object containing optimized settings
 * @property {Object} threeJSConfig - Optimized Three.js renderer configuration
 */
export const optimizePerformance = () => {
  if (typeof window === 'undefined') return

  // Preload critical assets
  const preloadLinks = [
    { rel: 'preload', href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    { rel: 'preload', href: '/fonts/roboto-mono.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  ]

  preloadLinks.forEach(({ rel, href, as, type, crossOrigin }) => {
    const link = document.createElement('link')
    link.rel = rel
    link.href = href
    if (as) link.as = as
    if (type) link.type = type
    if (crossOrigin) link.crossOrigin = crossOrigin
    document.head.appendChild(link)
  })

  // Optimize Three.js performance
  const optimizeThreeJS = () => {
    // Disable antialiasing for mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      return {
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
      }
    }
    return {
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    }
  }

  return {
    threeJSConfig: optimizeThreeJS(),
  }
}
