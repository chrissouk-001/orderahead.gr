import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Clock, User, CreditCard, ShieldCheck, MessageSquare, Leaf, ChevronDown, Plus } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen dark:bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-canteen-dark dark:bg-background text-white py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('/pattern.svg')] bg-repeat" style={parallaxStyle}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-canteen-dark/50 to-canteen-dark dark:from-primary/10 dark:to-transparent"></div>
          
          {/* Dark mode decorative elements */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-secondary/5 to-transparent dark:from-secondary/10 dark:to-transparent"></div>
          
          {/* Floating Icon */}
          <div className="absolute top-12 right-12 z-50 animate-float">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/20 dark:bg-white/5 dark:border-white/10">
              <Coffee className="w-5 h-5 text-canteen-yellow dark:text-secondary" />
            </div>
          </div>
          
          {/* Animated waves */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="wave wave1 opacity-20 dark:opacity-30"></div>
            <div className="wave wave2 opacity-15 dark:opacity-25"></div>
            <div className="wave wave3 opacity-10 dark:opacity-20"></div>
          </div>
          
          {/* Floating shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <img src="/images/shapes.svg" className="absolute top-10 left-10 w-40 h-40 opacity-10 dark:opacity-15 animate-float" />
            <img src="/images/shapes.svg" className="absolute bottom-20 right-10 w-32 h-32 opacity-10 dark:opacity-15 animate-float-delayed rotate-45" />
            <img src="/images/shapes.svg" className="absolute top-1/2 right-1/4 w-24 h-24 opacity-10 dark:opacity-15 animate-float-reverse rotate-90" />
          </div>
          
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 fade-in-up text-white dark:text-white drop-shadow-sm dark:drop-shadow-lg">
                  Order <span className="text-canteen-yellow dark:text-secondary">Ahead.gr</span>
                </h1>
                <p className="text-xl md:text-2xl mb-6 text-gray-300 dark:text-gray-200 fade-in-up delay-200 drop-shadow-sm dark:drop-shadow-md">
                  Παραγγείλτε εύκολα και γρήγορα το φαγητό σας
                </p>
                <p className="mb-8 text-gray-300 dark:text-gray-200 max-w-xl fade-in-up delay-300 drop-shadow-sm dark:drop-shadow-md">
                  Με την εφαρμογή OrderAhead.gr, η διαδικασία της παραγγελίας γίνεται 
                  πιο γρήγορη, οργανωμένη και φιλική προς το περιβάλλον!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 fade-in-up delay-400">
                <Button 
                  className="bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 
                  text-white dark:text-primary-foreground py-6 px-6 text-lg 
                  shadow-lg dark:shadow-primary/30 
                  transform hover:translate-y-[-4px] hover:shadow-xl dark:hover:shadow-primary/40 
                  transition-all duration-300" 
                  asChild
                >
                  <Link to={isAuthenticated ? "/menu" : "/login"}>
                    {isAuthenticated ? "Παραγγείλτε Τώρα" : "Σύνδεση"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  className="bg-canteen-yellow hover:bg-canteen-yellow/90 dark:bg-secondary dark:hover:bg-secondary/90 
                  text-canteen-dark dark:text-secondary-foreground font-medium py-6 px-6 text-lg 
                  shadow-lg dark:shadow-secondary/30 
                  transform hover:translate-y-[-4px] hover:shadow-xl dark:hover:shadow-secondary/40 
                  transition-all duration-300" 
                  asChild
                >
                  <Link to="/contact">Μάθετε Περισσότερα</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center fade-in-up delay-500">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
                <AnimatedAppFlow />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white opacity-70 dark:opacity-90" />
          </div>
        </section>
        
        {/* Popular Products Section */}
        <section className="bg-white dark:bg-[#121212] py-20 relative overflow-hidden">
          {/* Dark mode decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent dark:from-transparent dark:via-gray-800/5 dark:to-transparent"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-96 -right-96 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-canteen-teal/5 to-transparent dark:from-primary/10 dark:to-transparent blur-3xl"></div>
            <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-canteen-yellow/5 to-transparent dark:from-secondary/10 dark:to-transparent blur-3xl"></div>
          </div>
          
          {/* Section header with animated underline */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center justify-center mb-16">
              <div className="inline-flex items-center gap-1.5 mb-4 px-5 py-2 rounded-full bg-gradient-to-r from-canteen-teal via-canteen-yellow to-canteen-teal dark:from-primary/90 dark:via-secondary/90 dark:to-primary/90 shadow-md border border-white/20 dark:border-white/10 animate-pulse-subtle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white animate-spin-slow">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-bold text-sm tracking-wider">TOP PICKS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-center text-canteen-dark dark:text-white relative inline-block mb-6">
                Δημοφιλή Προϊόντα
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-canteen-teal/70 to-transparent dark:via-primary/70"></span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-xl text-center">
                Ανακαλύψτε τις αγαπημένες επιλογές των μαθητών και καθηγητών του σχολείου μας.
              </p>
            </div>
            
            {/* Featured products display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {getPopularProducts().slice(0, 3).map((product, index) => (
                <div 
                  key={product.id} 
                  className={`${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''} group`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-full bg-gray-50 dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/20 transition-all duration-500 flex flex-col border border-gray-100 dark:border-gray-800">
                    {/* Main content container with conditional height for featured item */}
                    <div className={`relative ${index === 0 ? 'lg:min-h-[480px] min-h-[350px]' : 'min-h-[270px]'} overflow-hidden`}>
                      {/* Background pattern */}
                      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 dark:opacity-10 z-0"></div>
                      
                      {/* Product image with parallax effect */}
                      <div className="absolute inset-0 z-10 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className={`w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 ${index === 0 ? 'object-center' : 'object-center'}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/products/sandwich.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-800/50 to-transparent"></div>
                      </div>
                      
                      {/* Product info overlay */}
                      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col">
                        {/* Tags container */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.popular && (
                            <span className="bg-canteen-teal/90 dark:bg-primary/90 text-white text-xs font-bold py-1 px-3 rounded-full z-20 shadow-md">
                              ★ δημοφιλές
                            </span>
                          )}
                          {product.isNew && (
                            <span className="bg-canteen-yellow text-canteen-dark text-xs font-bold py-1 px-3 rounded-full z-20 shadow-md animate-pulse">
                              Νέο
                            </span>
                          )}
                        </div>
                        
                        {/* Product title and description */}
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-canteen-yellow dark:group-hover:text-secondary transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="flex text-canteen-yellow dark:text-secondary">
                              {Array(5).fill(0).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-300">(42)</span>
                          </div>
                          <span className="text-white text-sm font-bold">{product.price.toFixed(2)}€</span>
                        </div>
                      </div>
                      
                      {/* Floating add button */}
                      <div className="absolute top-4 right-4 z-30">
                        <Button
                          size="sm"
                          className="rounded-full h-10 w-10 p-0 bg-white/20 hover:bg-canteen-yellow dark:hover:bg-secondary text-white hover:text-canteen-dark dark:hover:text-secondary-foreground shadow-lg transition-all duration-300 hover:scale-110"
                          onClick={() => handleAddToCart(product)}
                          aria-label={`Προσθήκη ${product.name} στο καλάθι`}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View all products button */}
            <div className="mt-16 text-center">
              <Button 
                className="relative bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white font-medium py-6 px-10 text-lg rounded-xl hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden" 
                asChild
              >
                <Link to="/menu">
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Δείτε όλα τα προϊόντα</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-canteen-teal via-canteen-teal/90 to-canteen-teal dark:from-primary dark:via-primary/90 dark:to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-gray-100 dark:bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-canteen-teal/5 dark:bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-canteen-yellow/5 dark:bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-canteen-dark dark:text-white">Λειτουργίες της Εφαρμογής</h2>
              <div className="w-20 h-1 bg-canteen-teal dark:bg-primary mx-auto mt-4 mb-6 rounded-full"></div>
              <p className="text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">Η εφαρμογή μας προσφέρει μια σειρά από χρήσιμες λειτουργίες που κάνουν την εμπειρία του κυλικείου πιο ευχάριστη και αποτελεσματική.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`bg-white dark:bg-card p-8 rounded-lg shadow-md text-center hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-500 border-t-4 border-canteen-teal dark:border-primary relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} dark:border dark:border-primary/10`} style={{ transitionDelay: '0ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 dark:bg-primary/10 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 dark:bg-primary/20 rounded-full mb-6 relative z-10">
                  <User className="h-8 w-8 text-canteen-teal dark:text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark dark:text-white relative z-10">Login & Εγγραφή</h3>
                <p className="text-gray-600 dark:text-muted-foreground relative z-10">
                  Σύνδεση μέσω email/κωδικού ή Google Account για εύκολη πρόσβαση.
                </p>
              </div>
              
              <div className={`bg-white dark:bg-card p-8 rounded-lg shadow-md text-center hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-500 border-t-4 border-canteen-teal dark:border-primary relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} dark:border dark:border-primary/10`} style={{ transitionDelay: '100ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 dark:bg-primary/10 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 dark:bg-primary/20 rounded-full mb-6 relative z-10">
                  <Coffee className="h-8 w-8 text-canteen-teal dark:text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark dark:text-white relative z-10">Κατάλογος Προϊόντων</h3>
                <p className="text-gray-600 dark:text-muted-foreground relative z-10">
                  Πλήρης λίστα προϊόντων με τιμές για εύκολη επιλογή και αγορά.
                </p>
              </div>
              
              <div className={`bg-white dark:bg-card p-8 rounded-lg shadow-md text-center hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-500 border-t-4 border-canteen-teal dark:border-primary relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} dark:border dark:border-primary/10`} style={{ transitionDelay: '200ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 dark:bg-primary/10 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 dark:bg-primary/20 rounded-full mb-6 relative z-10">
                  <CreditCard className="h-8 w-8 text-canteen-teal dark:text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark dark:text-white relative z-10">Ολοκλήρωση Παραγγελίας</h3>
                <p className="text-gray-600 dark:text-muted-foreground relative z-10">
                  Προβολή κόστους και επιλογή για οικολογική συσκευασία.
                </p>
              </div>
              
              <div className={`bg-white dark:bg-card p-8 rounded-lg shadow-md text-center hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-500 border-t-4 border-canteen-teal dark:border-primary relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} dark:border dark:border-primary/10`} style={{ transitionDelay: '300ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 dark:bg-primary/10 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 dark:bg-primary/20 rounded-full mb-6 relative z-10">
                  <Clock className="h-8 w-8 text-canteen-teal dark:text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark dark:text-white relative z-10">Σειρά Προτεραιότητας</h3>
                <p className="text-gray-600 dark:text-muted-foreground relative z-10">
                  Ενημέρωση για τη σειρά εξυπηρέτησης και το χρόνο αναμονής.
                </p>
              </div>
              
              <div className={`bg-white dark:bg-card p-8 rounded-lg shadow-md text-center hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-500 border-t-4 border-canteen-teal dark:border-primary relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} dark:border dark:border-primary/10`} style={{ transitionDelay: '400ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 dark:bg-primary/10 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 dark:bg-primary/20 rounded-full mb-6 relative z-10">
                  <ShieldCheck className="h-8 w-8 text-canteen-teal dark:text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark dark:text-white relative z-10">Ασφάλεια</h3>
                <p className="text-gray-600 dark:text-muted-foreground relative z-10">
                  Ασφαλείς συναλλαγές και προστασία προσωπικών δεδομένων.
                </p>
              </div>
              
              <div className={`bg-white dark:bg-card p-8 rounded-lg shadow-md text-center hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-500 border-t-4 border-canteen-teal dark:border-primary relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} dark:border dark:border-primary/10`} style={{ transitionDelay: '500ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 dark:bg-primary/10 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 dark:bg-primary/20 rounded-full mb-6 relative z-10">
                  <MessageSquare className="h-8 w-8 text-canteen-teal dark:text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark dark:text-white relative z-10">Επικοινωνία</h3>
                <p className="text-gray-600 dark:text-muted-foreground relative z-10">
                  Άμεση επικοινωνία με τον υπεύθυνο του κυλικείου.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Project Section */}
        <section ref={aboutRef} className="py-20 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className={`md:w-1/2 mb-10 md:mb-0 transition-all duration-700 ${isVisible.about ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <img 
                  src="/images/school-project.jpg" 
                  alt="Εκπαιδευτήρια Ατσόγλου" 
                  className="max-w-full h-auto rounded-lg shadow-xl dark:shadow-primary/20" 
                />
              </div>
              <div className={`md:w-1/2 md:pl-16 transition-all duration-700 ${isVisible.about ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-canteen-dark dark:text-white">Σχετικά με το Project</h2>
                <div className="w-20 h-1 bg-canteen-teal dark:bg-primary mb-6 rounded-full"></div>
                <p className="mb-4 text-gray-700 dark:text-muted-foreground text-lg">
                  Στο πλαίσιο της συνεχούς βελτίωσης των υπηρεσιών εστίασης, αναπτύχθηκε η εφαρμογή OrderAhead.gr.
                </p>
                <p className="mb-8 text-gray-700 dark:text-muted-foreground text-lg">
                  Το project δημιουργήθηκε με την καθοδήγηση του κ. Δημήτρη Λιόφη, MSc, και στοχεύει 
                  στη βελτίωση της εμπειρίας αγοράς στο σχολικό κυλικείο, προσφέροντας μια γρήγορη, 
                  εύχρηστη και φιλική προς το περιβάλλον λύση.
                </p>
                <Button className="bg-canteen-yellow hover:bg-canteen-yellow/90 dark:bg-secondary dark:hover:bg-secondary/90 text-canteen-dark dark:text-secondary-foreground font-medium py-3 px-6 text-lg shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300" asChild>
                  <Link to="/contact">Μάθετε Περισσότερα</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Eco-friendly Section */}
        <section ref={ecoRef} className="py-20 bg-gray-100 dark:bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/5 dark:to-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className={`md:w-1/2 mb-10 md:mb-0 md:pl-16 transition-all duration-700 ${isVisible.eco ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <img 
                  src="/images/eco-friendly-bags.jpg" 
                  alt="Οικολογική Συσκευασία" 
                  className="max-w-full h-auto rounded-lg shadow-xl dark:shadow-primary/20" 
                />
              </div>
              <div className={`md:w-1/2 transition-all duration-700 ${isVisible.eco ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 dark:bg-primary/20 rounded-full mb-6">
                  <Leaf className="h-8 w-8 text-canteen-teal dark:text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-canteen-dark dark:text-white">Φιλικό προς το Περιβάλλον</h2>
                <div className="w-20 h-1 bg-canteen-teal dark:bg-primary mb-6 rounded-full"></div>
                <p className="mb-4 text-gray-700 dark:text-muted-foreground text-lg">
                  Η εφαρμογή OrderAhead.gr προωθεί την οικολογική συνείδηση, επιτρέποντας στους 
                  χρήστες να επιλέξουν εάν επιθυμούν να χρησιμοποιήσουν πλαστική σακούλα ή όχι.
                </p>
                <p className="mb-8 text-gray-700 dark:text-muted-foreground text-lg">
                  Επιπλέον, η ηλεκτρονική παραγγελία μειώνει τη χρήση χαρτιού και συμβάλλει στη 
                  μείωση του περιβαλλοντικού αποτυπώματος του σχολείου.
                </p>
                <Button className="bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground text-lg px-6 py-3 shadow-lg transform hover:translate-y-[-2px] transition-transform duration-300" asChild>
                  <Link to={isAuthenticated ? "/menu" : "/login"}>
                    Δοκιμάστε το Τώρα
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-background relative overflow-hidden">
          <div className="absolute -left-64 top-20 w-96 h-96 bg-canteen-yellow/5 dark:bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-64 bottom-20 w-96 h-96 bg-canteen-teal/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-canteen-dark dark:text-white">Τι Λένε οι Χρήστες μας</h2>
              <div className="w-20 h-1 bg-canteen-teal dark:bg-primary mx-auto mt-4 mb-6 rounded-full"></div>
              <p className="text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">Η γνώμη των μαθητών και καθηγητών για την εφαρμογή OrderAhead.gr.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-card rounded-xl p-6 shadow-md dark:shadow-primary/10 relative dark:border dark:border-primary/10">
                <div className="absolute -top-4 left-6 text-canteen-teal dark:text-primary text-6xl opacity-20 dark:opacity-20">"</div>
                <div className="relative z-10">
                  <p className="text-gray-700 dark:text-muted-foreground mb-6 italic">Εξαιρετική εφαρμογή! Τώρα δε χρειάζεται να περιμένω στην ουρά για το διάλειμμα.</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-canteen-teal/20 dark:bg-primary/25 rounded-full flex items-center justify-center text-canteen-teal dark:text-primary font-bold">ΓΚ</div>
                    <div className="ml-3">
                      <h4 className="font-medium text-canteen-dark dark:text-white">Γιώργος Κ.</h4>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground">Μαθητής Β' Γυμνασίου</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-card rounded-xl p-6 shadow-md dark:shadow-primary/10 relative md:translate-y-6 dark:border dark:border-primary/10">
                <div className="absolute -top-4 left-6 text-canteen-teal dark:text-primary text-6xl opacity-20 dark:opacity-20">"</div>
                <div className="relative z-10">
                  <p className="text-gray-700 dark:text-muted-foreground mb-6 italic">Ως καθηγήτρια, εκτιμώ ιδιαίτερα την οργάνωση που προσφέρει. Τώρα το διάλειμμα είναι πιο άνετο για όλους.</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-canteen-teal/20 dark:bg-primary/25 rounded-full flex items-center justify-center text-canteen-teal dark:text-primary font-bold">ΜΠ</div>
                    <div className="ml-3">
                      <h4 className="font-medium text-canteen-dark dark:text-white">Μαρία Π.</h4>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground">Καθηγήτρια Φυσικής</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-card rounded-xl p-6 shadow-md dark:shadow-primary/10 relative">
                <div className="absolute -top-4 left-6 text-canteen-teal dark:text-primary text-6xl opacity-20 dark:opacity-20">"</div>
                <div className="relative z-10">
                  <p className="text-gray-700 dark:text-muted-foreground mb-6 italic">Η επιλογή για οικολογική συσκευασία είναι φανταστική ιδέα. Χαίρομαι που το σχολείο μας προωθεί την περιβαλλοντική συνείδηση.</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-canteen-teal/20 dark:bg-primary/25 rounded-full flex items-center justify-center text-canteen-teal dark:text-primary font-bold">ΑΔ</div>
                    <div className="ml-3">
                      <h4 className="font-medium text-canteen-dark dark:text-white">Αλέξανδρος Δ.</h4>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground">Μαθητής Γ' Γυμνασίου</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-canteen-teal dark:bg-background text-white dark:text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 dark:opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white dark:bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white dark:bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Έτοιμοι να δοκιμάσετε το OrderAhead.gr;</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Κάντε την καθημερινή εμπειρία παραγγελίας φαγητού πιο γρήγορη, οργανωμένη και 
              φιλική προς το περιβάλλον!
            </p>
            <Button className="bg-white dark:bg-secondary text-canteen-teal dark:text-secondary-foreground hover:bg-gray-100 dark:hover:bg-secondary/90 text-lg px-8 py-4 shadow-lg transform hover:translate-y-[-4px] transition-transform duration-300" asChild>
              <Link to={isAuthenticated ? "/menu" : "/login"}>
                {isAuthenticated ? "Παραγγείλτε Τώρα" : "Ξεκινήστε Τώρα"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
