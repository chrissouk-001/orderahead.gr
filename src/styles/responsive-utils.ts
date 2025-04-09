/**
 * responsive-utils.ts
 * 
 * Utility functions and constants for responsive design
 */

/**
 * Common breakpoints in pixels
 */
export const BREAKPOINTS = {
  xs: 0,       // Extra small devices
  sm: 640,     // Small devices (phones)
  md: 768,     // Medium devices (tablets)
  lg: 1024,    // Large devices (laptops)
  xl: 1280,    // Extra large devices (desktops)
  xxl: 1536    // Extra extra large devices
};

/**
 * Media query strings for CSS-in-JS solutions
 */
export const MEDIA_QUERIES = {
  xs: `@media (min-width: ${BREAKPOINTS.xs}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `@media (min-width: ${BREAKPOINTS.xxl}px)`,
  
  // Max width queries (up to specified breakpoint)
  xsMax: `@media (max-width: ${BREAKPOINTS.sm - 1}px)`,
  smMax: `@media (max-width: ${BREAKPOINTS.md - 1}px)`,
  mdMax: `@media (max-width: ${BREAKPOINTS.lg - 1}px)`,
  lgMax: `@media (max-width: ${BREAKPOINTS.xl - 1}px)`,
  xlMax: `@media (max-width: ${BREAKPOINTS.xxl - 1}px)`,
  
  // Range queries (between breakpoints)
  smOnly: `@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  mdOnly: `@media (min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  lgOnly: `@media (min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`,
  xlOnly: `@media (min-width: ${BREAKPOINTS.xl}px) and (max-width: ${BREAKPOINTS.xxl - 1}px)`,
  
  // Orientation queries
  portrait: `@media (orientation: portrait)`,
  landscape: `@media (orientation: landscape)`,
  
  // Touch capability
  touch: `@media (hover: none) and (pointer: coarse)`,
  mouse: `@media (hover: hover) and (pointer: fine)`,
};

/**
 * Helper to create responsive object properties based on breakpoints
 * 
 * @example
 * const spacing = responsive({
 *   base: '1rem',    // Default for all sizes
 *   sm: '1.5rem',    // Applied at sm breakpoint and up
 *   lg: '2rem'       // Applied at lg breakpoint and up
 * });
 */
export type ResponsiveValue<T> = {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
};

export function responsive<T>(values: ResponsiveValue<T>): ResponsiveValue<T> {
  return values;
}

/**
 * Helper to create Tailwind conditional classes for responsive designs
 * 
 * @example
 * <div className={twResponsive({
 *   base: 'px-4 py-2',
 *   sm: 'px-6 py-4',
 *   lg: 'px-8 py-6'
 * })}>
 *   Responsive padding
 * </div>
 */
export function twResponsive(classes: ResponsiveValue<string>): string {
  const { base = '', xs = '', sm = '', md = '', lg = '', xl = '', xxl = '' } = classes;
  
  return [
    base,
    xs ? `xs:${xs}` : '',
    sm ? `sm:${sm}` : '',
    md ? `md:${md}` : '',
    lg ? `lg:${lg}` : '',
    xl ? `xl:${xl}` : '',
    xxl ? `2xl:${xxl}` : ''
  ].filter(Boolean).join(' ');
} 