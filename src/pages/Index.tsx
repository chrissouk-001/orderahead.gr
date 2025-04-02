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
  Bell
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProductCarousel } from "@/components/ProductCarousel";
import { getPopularProducts } from "@/data/products";
import { Product } from '@/types/product';
import { AnimatedAppFlow } from '@/components/ui/animated-app-flow';
import { Badge } from "@/components/ui/badge";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({
    features: false,
    about: false,
    eco: false
  });
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ecoRef = useRef<HTMLDivElement>(null);
  
  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Παρακαλώ συνδεθείτε για να προσθέσετε προϊόντα στο καλάθι');
      return;
    }
    
    addItem(product);
    toast.success(`${product.name} προστέθηκε στο καλάθι`);
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (featuresRef.current) {
        const featuresTop = featuresRef.current.getBoundingClientRect().top + scrollY - window.innerHeight + 100;
        setIsVisible(prev => ({ ...prev, features: scrollY > featuresTop }));
      }
      
      if (aboutRef.current) {
        const aboutTop = aboutRef.current.getBoundingClientRect().top + scrollY - window.innerHeight + 100;
        setIsVisible(prev => ({ ...prev, about: scrollY > aboutTop }));
      }
      
      if (ecoRef.current) {
        const ecoTop = ecoRef.current.getBoundingClientRect().top + scrollY - window.innerHeight + 100;
        setIsVisible(prev => ({ ...prev, eco: scrollY > ecoTop }));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const parallaxStyle = {
    transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background gradients and patterns */}
          <div className="absolute inset-0 bg-gradient-to-b from-canteen-lightgray via-white to-white dark:from-primary/5 dark:via-background dark:to-background"></div>
          <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('/pattern.svg')] bg-repeat" style={parallaxStyle}></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-canteen-teal/30 to-canteen-mint/30 dark:from-primary/20 dark:to-canteen-mint/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-tr from-canteen-yellow/30 to-canteen-coral/30 dark:from-secondary/20 dark:to-canteen-coral/20 rounded-full blur-3xl"></div>
          
          {/* Floating icons */}
          <div className="absolute top-20 right-[10%] animate-float hidden md:block">
            <div className="bg-white dark:bg-white/5 shadow-lg rounded-2xl p-3 backdrop-blur-sm border border-canteen-mint/20 dark:border-primary/10">
              <Coffee className="w-6 h-6 text-canteen-teal dark:text-primary" />
            </div>
          </div>
          <div className="absolute bottom-20 left-[15%] animate-float-delayed hidden md:block">
            <div className="bg-white dark:bg-white/5 shadow-lg rounded-2xl p-3 backdrop-blur-sm border border-canteen-yellow/20 dark:border-secondary/10">
              <Bell className="w-6 h-6 text-canteen-yellow dark:text-secondary" />
            </div>
          </div>
          
          {/* Hero content */}
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10 gap-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canteen-teal/10 dark:bg-primary/10 text-canteen-teal dark:text-primary text-sm font-medium animate-pulse-subtle">
                  <CheckCircle className="w-4 h-4" />
                  <span>Νέα έκδοση 2.0</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-canteen-dark dark:text-white">
                  Σχολικό κυλικείο <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint">
                    χωρίς ουρές αναμονής
                  </span>
                </h1>
                
                <p className="text-lg text-canteen-darkgray dark:text-gray-300 max-w-xl">
                  Με την εφαρμογή <span className="font-semibold">OrderAhead.gr</span>, 
                  η διαδικασία παραγγελίας γίνεται πιο γρήγορη, οργανωμένη και φιλική 
                  προς το περιβάλλον!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint
                    hover:opacity-90 text-white py-6 px-6 text-lg rounded-xl
                    shadow-lg hover:shadow-xl transition-all duration-300" 
                    asChild
                  >
                    <Link to={isAuthenticated ? "/menu" : "/login"}>
                      {isAuthenticated ? "Παραγγείλτε Τώρα" : "Σύνδεση"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    className="bg-white dark:bg-card hover:bg-canteen-lightgray dark:hover:bg-card/80 
                    text-canteen-dark dark:text-white border border-gray-200 dark:border-primary/10 py-6 px-6 text-lg rounded-xl
                    shadow-md hover:shadow-lg transition-all duration-300" 
                    asChild
                  >
                    <Link to="/contact">Μάθετε Περισσότερα</Link>
                  </Button>
                </div>
                
                <div className="pt-4 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white dark:bg-card border-2 border-white dark:border-background shadow-md overflow-hidden">
                        <img src={`/images/avatar-${i}.jpg`} alt="User avatar" className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-canteen-darkgray dark:text-gray-400">
                    <span className="font-medium text-canteen-dark dark:text-white">500+</span> παραγγελίες την ημέρα
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="relative">
                {/* App mockup with glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-canteen-teal/30 to-canteen-mint/30 dark:from-primary/30 dark:to-canteen-mint/30 rounded-3xl blur-2xl transform scale-95 opacity-70"></div>
                <div className="relative bg-white dark:bg-card border border-gray-100 dark:border-primary/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                  <AnimatedAppFlow />
                </div>
                
                {/* Stats cards */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-card p-3 rounded-xl shadow-lg border border-gray-100 dark:border-primary/10 animate-float hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-canteen-teal/10 dark:bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-canteen-teal dark:text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-canteen-darkgray dark:text-gray-400">Χρόνος αναμονής</p>
                      <p className="font-bold text-canteen-dark dark:text-white">-70%</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-white dark:bg-card p-3 rounded-xl shadow-lg border border-gray-100 dark:border-primary/10 animate-float-delayed hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-canteen-yellow/10 dark:bg-secondary/10 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-canteen-yellow dark:text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-canteen-darkgray dark:text-gray-400">Χαρτί που εξοικονομείται</p>
                      <p className="font-bold text-canteen-dark dark:text-white">+120kg</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-sm text-canteen-darkgray dark:text-gray-400">Scroll down</span>
            <ChevronDown className="h-6 w-6 text-canteen-teal dark:text-primary animate-bounce" />
          </div>
        </section>
        
        {/* Feature Section */}
        <section 
          ref={featuresRef} 
          className="py-12 bg-canteen-lightgray dark:bg-primary/5"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div 
                  className={`transition-all duration-700 ${
                    isVisible.features ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                  }`}
                >
                  <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-canteen-teal/10 dark:bg-primary/10 text-canteen-teal dark:text-primary text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>ΠΡΟΤΕΙΝΟΜΕΝΑ</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-canteen-dark dark:text-white mb-4">
                    Ανακαλύψτε τα <span className="text-canteen-teal dark:text-primary">πλεονεκτήματα</span>
                  </h2>
                  <p className="text-canteen-darkgray dark:text-gray-400 mb-6">
                    Απολαύστε μια άνετη εμπειρία παραγγελίας με την OrderAhead.gr
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {features.slice(0, 4).map((feature, index) => (
                      <div 
                        key={index}
                        className={`bg-white dark:bg-card rounded-xl p-3 shadow-sm border border-gray-100 dark:border-primary/10 flex items-start gap-3 transform transition-all duration-500 ${
                          isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${feature.bgColor}`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-canteen-dark dark:text-white mb-1">{feature.title}</h3>
                          <p className="text-xs text-canteen-darkgray dark:text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div 
                className={`md:w-1/2 transition-all duration-700 ${
                  isVisible.features ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-canteen-yellow/20 to-canteen-coral/20 dark:from-secondary/20 dark:to-canteen-coral/20 rounded-3xl blur-2xl transform scale-95"></div>
                  <img 
                    src="/images/features-app.jpg" 
                    alt="App features" 
                    className="relative z-10 rounded-3xl shadow-xl object-cover w-full h-full"
                  />
                  
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card p-4 rounded-xl shadow-lg border border-gray-100 dark:border-primary/10 z-20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-canteen-yellow to-canteen-coral dark:from-secondary dark:to-canteen-coral flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-canteen-darkgray dark:text-gray-400">Εξοικονόμηση χρόνου</p>
                        <p className="font-bold text-xl text-canteen-dark dark:text-white">
                          -70% <span className="text-sm font-normal">χρόνος αναμονής</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Popular Products Section */}
        <section className="py-20 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center mb-16">
              <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-canteen-yellow/10 dark:bg-secondary/10 text-canteen-yellow dark:text-secondary text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>TOP PICKS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-canteen-dark dark:text-white mb-4">
                Δημοφιλή Προϊόντα
              </h2>
              <p className="text-canteen-darkgray dark:text-gray-400 max-w-xl text-center">
                Ανακαλύψτε τις αγαπημένες επιλογές των μαθητών και καθηγητών του σχολείου μας.
              </p>
            </div>
            
            <ProductCarousel />
            
            <div className="mt-12 text-center">
              <Button 
                asChild 
                className="bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint
                hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl
                shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/menu">
                  Δείτε όλα τα προϊόντα
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Eco-friendly Section */}
        <section 
          ref={ecoRef}
          className="py-20 bg-gradient-to-br from-canteen-teal/5 to-canteen-mint/5 dark:from-primary/5 dark:to-canteen-mint/5"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div 
                  className={`transition-all duration-700 ${
                    isVisible.eco ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                  }`}
                >
                  <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-canteen-teal/10 dark:bg-primary/10 text-canteen-teal dark:text-primary text-sm font-medium">
                    <Leaf className="w-4 h-4" />
                    <span>ECO-FRIENDLY</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-canteen-dark dark:text-white mb-6">
                    Συμβάλλουμε στην προστασία του περιβάλλοντος
                  </h2>
                  <p className="text-canteen-darkgray dark:text-gray-400 mb-8">
                    Με τη χρήση της εφαρμογής OrderAhead.gr, βοηθάτε στη μείωση της χρήσης χαρτιού και 
                    πλαστικών αποδείξεων. Παρακολουθήστε τον περιβαλλοντικό σας αντίκτυπο και δείτε πόσο 
                    χαρτί έχετε εξοικονομήσει με τις ψηφιακές σας παραγγελίες.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-card rounded-xl p-4 shadow-md border border-gray-100 dark:border-primary/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-canteen-teal/10 dark:bg-primary/10 flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-canteen-teal dark:text-primary" />
                        </div>
                        <h3 className="font-semibold text-canteen-dark dark:text-white">Εξοικονόμηση χαρτιού</h3>
                      </div>
                      <p className="text-sm text-canteen-darkgray dark:text-gray-400">
                        Κάθε ψηφιακή παραγγελία εξοικονομεί περίπου 5 γραμμάρια χαρτιού.
                      </p>
                    </div>
                    <div className="bg-white dark:bg-card rounded-xl p-4 shadow-md border border-gray-100 dark:border-primary/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-canteen-yellow/10 dark:bg-secondary/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-canteen-yellow dark:text-secondary" />
                        </div>
                        <h3 className="font-semibold text-canteen-dark dark:text-white">Εξοικονόμηση χρόνου</h3>
                      </div>
                      <p className="text-sm text-canteen-darkgray dark:text-gray-400">
                        Μείωση του χρόνου αναμονής στην ουρά κατά 70% περίπου.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint
                    hover:opacity-90 text-white px-6 py-3 rounded-xl
                    shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link to="/eco-impact">
                      Δείτε τον αντίκτυπό σας
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div 
                className={`md:w-1/2 transition-all duration-700 ${
                  isVisible.eco ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-canteen-teal/20 to-canteen-mint/20 dark:from-primary/20 dark:to-canteen-mint/20 rounded-3xl blur-2xl transform scale-95"></div>
                  <img 
                    src="/images/eco-impact.jpg" 
                    alt="Eco-friendly impact" 
                    className="relative z-10 rounded-3xl shadow-xl object-cover w-full h-full"
                  />
                  
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card p-4 rounded-xl shadow-lg border border-gray-100 dark:border-primary/10 z-20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-canteen-darkgray dark:text-gray-400">Περιβαλλοντικό όφελος</p>
                        <p className="font-bold text-xl text-canteen-dark dark:text-white">
                          120kg <span className="text-sm font-normal">χαρτιού / έτος</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
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
