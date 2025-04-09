/**
 * Index.tsx
 * 
 * Homepage component for OrderAhead.gr application
 * Features:
 * - Hero section with CTA for ordering
 * - Eco-friendly initiative information
 * - Features showcase with parallax effects
 * - Popular products carousel
 * - About and testimonials section
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Coffee, 
  Clock, 
  User, 
  CreditCard, 
  ShieldCheck, 
  MessageSquare, 
  Leaf, 
  ChevronDown, 
  Plus,
  CheckCircle,
  ExternalLink,
  Bell,
  Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ProductCarousel } from "@/components/ProductCarousel";
import { getPopularProducts } from "@/data/products";
import { Product } from '@/types/product';
import { AnimatedAppFlow } from '@/components/ui/animated-app-flow';
import { Badge } from "@/components/ui/badge";

const Index: React.FC = () => {
  // Access authentication and cart contexts
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  
  // State for parallax effect based on mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // State to track visibility for scroll animations
  const [isVisible, setIsVisible] = useState({
    features: false,
    about: false,
    eco: false
  });
  
  // Refs for scroll animation sections
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ecoRef = useRef<HTMLDivElement>(null);
  
  /**
   * Handle adding a product to cart with authentication check
   * @param product - Product to add to cart
   */
  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Παρακαλώ συνδεθείτε για να προσθέσετε προϊόντα στο καλάθι');
      return;
    }
    
    addItem(product);
    toast.success(`${product.name} προστέθηκε στο καλάθι`);
  };
  
  useEffect(() => {
    // Track mouse movement for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle scroll events for revealing animations
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      
      // Check if features section is visible
      if (featuresRef.current) {
        const featuresTop = featuresRef.current.getBoundingClientRect().top + scrollY - window.innerHeight + 100;
        setIsVisible(prev => ({ ...prev, features: scrollY > featuresTop }));
      }
      
      // Check if about section is visible
      if (aboutRef.current) {
        const aboutTop = aboutRef.current.getBoundingClientRect().top + scrollY - window.innerHeight + 100;
        setIsVisible(prev => ({ ...prev, about: scrollY > aboutTop }));
      }
      
      // Check if eco section is visible
      if (ecoRef.current) {
        const ecoTop = ecoRef.current.getBoundingClientRect().top + scrollY - window.innerHeight + 100;
        setIsVisible(prev => ({ ...prev, eco: scrollY > ecoTop }));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Calculate parallax effect based on mouse position
  const parallaxStyle = {
    transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background transition-colors duration-300">
      <main className="flex-grow">
        {/* Hero Section - Main landing area with CTAs */}
        <section className="py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                {/* Version badge */}
                <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full bg-canteen-teal/10 dark:bg-primary/10 text-canteen-teal dark:text-primary text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Νέα έκδοση 2.0</span>
                </div>
                
                {/* Main headline */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-canteen-dark dark:text-white mb-4">
                  Σχολικό κυλικείο
                  <span className="text-canteen-teal dark:text-primary block mt-1">
                    χωρίς ουρές αναμονής
                  </span>
                </h1>
                
                {/* Value proposition */}
                <p className="text-canteen-darkgray dark:text-gray-300 mb-6">
                  Με την εφαρμογή <span className="font-semibold">OrderAhead.gr</span>, 
                  η διαδικασία παραγγελίας γίνεται πιο γρήγορη, οργανωμένη και φιλική 
                  προς το περιβάλλον!
                </p>
                
                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button 
                    className="bg-canteen-teal dark:bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg"
                    asChild
                  >
                    <Link to={isAuthenticated ? "/menu" : "/login"}>
                      {isAuthenticated ? "Παραγγείλτε Τώρα" : "Σύνδεση"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    className="bg-white dark:bg-card text-canteen-dark dark:text-white border border-gray-200 dark:border-primary/10 px-6 py-2 rounded-lg" 
                    asChild
                  >
                    <Link to="/contact">Μάθετε Περισσότερα</Link>
                  </Button>
                </div>
                
                {/* Social proof section */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-white dark:bg-card border border-white dark:border-background overflow-hidden">
                        <img src={`/images/avatar-${i}.jpg`} alt="User avatar" className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                  <img src="/images/stats/orders-per-day.png" alt="500+ παραγγελίες την ημέρα" className="h-7" />
                </div>
              </div>
              
              {/* App flow animation/demo */}
              <div>
                <div className="relative">
                  <div className="bg-white dark:bg-card border border-gray-100 dark:border-primary/10 rounded-lg overflow-hidden">
                    <AnimatedAppFlow />
                  </div>
                  
                  {/* Waiting time stat */}
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-card p-3 rounded-lg border border-gray-100 dark:border-primary/10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-canteen-teal dark:text-primary" />
                      <div>
                        <p className="text-xs text-canteen-darkgray dark:text-gray-400">Χρόνος αναμονής</p>
                        <p className="font-bold text-canteen-dark dark:text-white">-70%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Eco-friendly Section - Highlighting environmental benefits */}
        <section 
          ref={ecoRef}
          className="py-16 bg-white dark:bg-background"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                {/* Eco badge */}
                <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full bg-canteen-teal/10 dark:bg-primary/10 text-canteen-teal dark:text-primary text-sm font-medium">
                  <Leaf className="w-4 h-4" />
                  <span>ECO-FRIENDLY</span>
                </div>
                <h2 className="text-3xl font-bold text-canteen-dark dark:text-white mb-4">
                  Συμβάλλουμε στην προστασία του περιβάλλοντος
                </h2>
                <p className="text-canteen-darkgray dark:text-gray-400 mb-6">
                  Με τη χρήση της εφαρμογής OrderAhead.gr, βοηθάτε στη μείωση της χρήσης χαρτιού και 
                  πλαστικών αποδείξεων. Παρακολουθήστε τον περιβαλλοντικό σας αντίκτυπο και δείτε πόσο 
                  χαρτί έχετε εξοικονομήσει με τις ψηφιακές σας παραγγελίες.
                </p>
                
                {/* Environmental impact stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white dark:bg-card rounded-lg p-4 border border-gray-100 dark:border-primary/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Leaf className="w-5 h-5 text-canteen-teal dark:text-primary" />
                      <h3 className="font-medium text-canteen-dark dark:text-white">Εξοικονόμηση χαρτιού</h3>
                    </div>
                    <p className="text-sm text-canteen-darkgray dark:text-gray-400">
                      Κάθε ψηφιακή παραγγελία εξοικονομεί περίπου 5 γραμμάρια χαρτιού.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-card rounded-lg p-4 border border-gray-100 dark:border-primary/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-canteen-yellow dark:text-secondary" />
                      <h3 className="font-medium text-canteen-dark dark:text-white">Εξοικονόμηση χρόνου</h3>
                    </div>
                    <p className="text-sm text-canteen-darkgray dark:text-gray-400">
                      Μείωση του χρόνου αναμονής στην ουρά κατά 70% περίπου.
                    </p>
                  </div>
                </div>
                
                <Button 
                  asChild 
                  className="bg-canteen-teal dark:bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg"
                >
                  <Link to="/eco-impact">
                    Δείτε τον αντίκτυπό σας
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <div className="relative">
                  <img 
                    src="/images/eco-earth.jpg" 
                    alt="Eco-friendly impact" 
                    className="rounded-lg object-cover w-full h-auto"
                  />
                  
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-card p-3 rounded-lg border border-gray-100 dark:border-primary/10">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-canteen-teal dark:text-primary" />
                      <p className="font-bold text-canteen-dark dark:text-white">
                        120kg <span className="text-xs font-normal">χαρτιού / έτος</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Features data
const features = [
  {
    icon: <Clock className="h-6 w-6 text-canteen-teal dark:text-primary" />,
    title: "Γρήγορη Παραγγελία",
    description: "Παραγγείλτε εύκολα και γρήγορα χωρίς να περιμένετε στην ουρά.",
    bgColor: "bg-canteen-teal/10 dark:bg-primary/10"
  },
  {
    icon: <Bell className="h-6 w-6 text-canteen-yellow dark:text-secondary" />,
    title: "Ειδοποιήσεις",
    description: "Λάβετε ειδοποίηση όταν η παραγγελία σας είναι έτοιμη για παραλαβή.",
    bgColor: "bg-canteen-yellow/10 dark:bg-secondary/10"
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-canteen-coral dark:text-canteen-coral" />,
    title: "Ασφαλείς Συναλλαγές",
    description: "Πληρώστε με ασφάλεια μέσω της εφαρμογής ή κατά την παραλαβή.",
    bgColor: "bg-canteen-coral/10 dark:bg-canteen-coral/10"
  },
  {
    icon: <Leaf className="h-6 w-6 text-canteen-teal dark:text-primary" />,
    title: "Οικολογική Λύση",
    description: "Συμβάλλετε στη μείωση του χαρτιού με τις ψηφιακές παραγγελίες.",
    bgColor: "bg-canteen-teal/10 dark:bg-primary/10"
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-canteen-yellow dark:text-secondary" />,
    title: "Ζωντανή Υποστήριξη",
    description: "Επικοινωνήστε με το προσωπικό του κυλικείου σε πραγματικό χρόνο.",
    bgColor: "bg-canteen-yellow/10 dark:bg-secondary/10"
  },
  {
    icon: <User className="h-6 w-6 text-canteen-coral dark:text-canteen-coral" />,
    title: "Προσωπικό Προφίλ",
    description: "Αποθηκεύστε τις αγαπημένες σας παραγγελίες για μελλοντική χρήση.",
    bgColor: "bg-canteen-coral/10 dark:bg-canteen-coral/10"
  }
];

export default Index;

