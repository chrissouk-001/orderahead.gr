import * as React from "react"
import { cn } from "@/lib/utils"

interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageTransition({ 
  children, 
  className, 
  ...props 
}: PageTransitionProps) {
  return (
    <div 
      className={cn("page-transition-wrapper", className)} 
      {...props}
    >
      {children}
    </div>
  )
} 