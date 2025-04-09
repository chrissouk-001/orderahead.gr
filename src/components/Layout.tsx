import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  fullWidth?: boolean;
}

/**
 * Main layout component that wraps all pages
 * Handles responsive layout with mobile bottom navigation
 */
const Layout: React.FC<LayoutProps> = ({ 
  children, 
  hideFooter = false,
  fullWidth = false
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background transition-colors duration-300">
      {/* Common header */}
      <Navbar />
      
      {/* Main content with bottom padding for mobile nav */}
      <main className={`flex-grow ${isMobile ? 'pb-24' : ''} ${fullWidth ? 'w-full' : 'container mx-auto px-4 sm:px-6'}`}>
        {children}
      </main>
      
      {/* Footer - optional */}
      {!hideFooter && <Footer />}
      
      {/* Mobile bottom navigation - only visible on mobile */}
      <MobileBottomNav />
    </div>
  );
};

export default Layout; 