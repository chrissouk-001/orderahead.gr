/**
 * use-mobile.tsx
 * 
 * Custom React hook for responsive design that detects if the current viewport
 * is mobile-sized based on a breakpoint width.
 * 
 * This hook:
 * - Uses media queries to detect viewport size
 * - Re-renders components when window size changes
 * - Returns a boolean flag for conditionally rendering mobile layouts
 */

import * as React from "react"

/**
 * Breakpoint widths in pixels - expanded for better device coverage
 */
const BREAKPOINTS = {
  SMALL_MOBILE: 375,  // iPhone SE, small Android phones
  MOBILE: 640,        // sm - most phones
  TABLET: 768,        // md - tablets, large phones in landscape
  LAPTOP: 1024,       // lg - laptops
  DESKTOP: 1280       // xl - desktop
}

/**
 * Hook to determine if the current viewport is mobile-sized
 * 
 * @returns {boolean} true if viewport width is less than mobile breakpoint
 */
export function useIsMobile() {
  // State starts as undefined to prevent hydration mismatch with SSR
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create media query list for tracking viewport width
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE - 1}px)`)
    
    // Handler for media query change events
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }
    
    // Handler for window resize events (more reliable across browsers)
    const onResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }
    
    // Listen for viewport size changes with both methods
    mql.addEventListener("change", onChange)
    window.addEventListener("resize", onResize)
    
    // Also check on orientation change for mobile devices
    window.addEventListener("orientationchange", onResize)
    
    // Set initial value
    setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    
    // Clean up event listeners on component unmount
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("orientationchange", onResize)
    }
  }, [])

  // Double-bang ensures we always return a boolean, even if state is undefined
  return !!isMobile
}

/**
 * Hook to determine if the current viewport is small mobile-sized (iPhone SE, etc)
 * 
 * @returns {boolean} true if viewport width is less than small mobile breakpoint
 */
export function useIsSmallMobile() {
  const [isSmallMobile, setIsSmallMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.SMALL_MOBILE - 1}px)`)
    
    const onChange = () => {
      setIsSmallMobile(window.innerWidth < BREAKPOINTS.SMALL_MOBILE)
    }
    
    const onResize = () => {
      setIsSmallMobile(window.innerWidth < BREAKPOINTS.SMALL_MOBILE)
    }
    
    mql.addEventListener("change", onChange)
    window.addEventListener("resize", onResize)
    window.addEventListener("orientationchange", onResize)
    
    setIsSmallMobile(window.innerWidth < BREAKPOINTS.SMALL_MOBILE)
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("orientationchange", onResize)
    }
  }, [])

  return !!isSmallMobile
}

/**
 * Hook to determine if the current viewport is tablet-sized
 * 
 * @returns {boolean} true if viewport width is less than tablet breakpoint
 */
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.TABLET - 1}px)`)
    
    const onChange = () => {
      setIsTablet(window.innerWidth < BREAKPOINTS.TABLET)
    }
    
    const onResize = () => {
      setIsTablet(window.innerWidth < BREAKPOINTS.TABLET)
    }
    
    mql.addEventListener("change", onChange)
    window.addEventListener("resize", onResize)
    window.addEventListener("orientationchange", onResize)
    
    setIsTablet(window.innerWidth < BREAKPOINTS.TABLET)
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("orientationchange", onResize)
    }
  }, [])

  return !!isTablet
}

/**
 * Hook that returns the current device type based on viewport width
 * 
 * @returns {string} 'small-mobile', 'mobile', 'tablet', 'laptop', or 'desktop'
 */
export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState<string>('desktop')

  React.useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.SMALL_MOBILE) {
        setDeviceSize('small-mobile')
      } else if (width < BREAKPOINTS.MOBILE) {
        setDeviceSize('mobile')
      } else if (width < BREAKPOINTS.TABLET) {
        setDeviceSize('tablet') 
      } else if (width < BREAKPOINTS.LAPTOP) {
        setDeviceSize('laptop')
      } else {
        setDeviceSize('desktop')
      }
    }
    
    window.addEventListener('resize', checkDeviceSize)
    window.addEventListener('orientationchange', checkDeviceSize)
    checkDeviceSize()
    
    return () => {
      window.removeEventListener('resize', checkDeviceSize)
      window.removeEventListener('orientationchange', checkDeviceSize)
    }
  }, [])

  return deviceSize
}
