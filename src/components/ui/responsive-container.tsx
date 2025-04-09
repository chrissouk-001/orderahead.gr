import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  fluid?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * A responsive container component that provides consistent padding and max-width
 * across different screen sizes.
 * 
 * @param as The element type to render (default: div)
 * @param fluid Whether the container should be full-width (default: false)
 * @param className Additional classNames to apply
 * @param children Content to render within the container
 */
export const ResponsiveContainer = React.forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ as: Component = 'div', fluid = false, className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "w-full px-4 sm:px-6 md:px-8 mx-auto",
          {
            // Default max widths for different breakpoints
            "max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px]": !fluid,
          },
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ResponsiveContainer.displayName = "ResponsiveContainer";

/**
 * A responsive grid component that automatically adjusts columns based on screen size
 */
interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    xs?: number; // Mobile (< 640px)
    sm?: number; // Small (>= 640px)
    md?: number; // Medium (>= 768px)
    lg?: number; // Large (>= 1024px)
    xl?: number; // Extra large (>= 1280px)
  };
  gap?: string;
  className?: string;
  children: React.ReactNode;
}

export const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ columns = {}, gap = "gap-4", className, children, ...props }, ref) => {
    const { xs = 1, sm = 2, md = 3, lg = 4, xl = 4 } = columns;
    
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full",
          gap,
          {
            [`grid-cols-${xs}`]: xs,
            [`sm:grid-cols-${sm}`]: sm,
            [`md:grid-cols-${md}`]: md,
            [`lg:grid-cols-${lg}`]: lg,
            [`xl:grid-cols-${xl}`]: xl,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = "ResponsiveGrid"; 