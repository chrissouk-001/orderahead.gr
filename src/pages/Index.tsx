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
        <section className="py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full bg-canteen-teal/10 dark:bg-primary/10 text-canteen-teal dark:text-primary text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Νέα έκδοση 2.0</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-canteen-dark dark:text-white mb-4">
                  Σχολικό κυλικείο
                  <span className="text-canteen-teal dark:text-primary block mt-1">
                    χωρίς ουρές αναμονής
                  </span>
                </h1>
                
                <p className="text-canteen-darkgray dark:text-gray-300 mb-6">
                  Με την εφαρμογή <span className="font-semibold">OrderAhead.gr</span>, 
                  η διαδικασία παραγγελίας γίνεται πιο γρήγορη, οργανωμένη και φιλική 
                  προς το περιβάλλον!
                </p>
                
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
              
              <div>
                <div className="relative">
                  <div className="bg-white dark:bg-card border border-gray-100 dark:border-primary/10 rounded-lg overflow-hidden">
                    <AnimatedAppFlow />
                  </div>
                  
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
        
        {/* School Meals Section */}
        <section className="py-16 bg-white dark:bg-background relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-canteen-yellow/10 dark:bg-secondary/10 text-canteen-yellow dark:text-secondary text-sm font-medium">
                <Coffee className="w-4 h-4" />
                <span>COMING SOON</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-canteen-dark dark:text-white mb-4">
                Πακέτα <span className="text-canteen-yellow dark:text-secondary">Γευμάτων για Σχολεία</span>
              </h2>
              <p className="text-canteen-darkgray dark:text-gray-400 max-w-2xl mx-auto">
                Σύντομα, η OrderAhead θα παρέχει έτοιμα πακέτα γευμάτων σε σχολεία σε όλη την Ελλάδα, 
                με μεγάλη ποικιλία επιλογών για μαθητές και εκπαιδευτικούς.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Leaf className="h-6 w-6 text-canteen-teal dark:text-primary mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-canteen-dark dark:text-white mb-2">Υγιεινές Επιλογές</h3>
                      <p className="text-canteen-darkgray dark:text-gray-400">
                        Πακέτα φρέσκων γευμάτων με υψηλή διατροφική αξία, προσαρμοσμένα στις ανάγκες των μαθητών όλων των ηλικιών.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="h-6 w-6 text-canteen-yellow dark:text-secondary mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-canteen-dark dark:text-white mb-2">Ποιοτικά Υλικά</h3>
                      <p className="text-canteen-darkgray dark:text-gray-400">
                        Χρησιμοποιούμε μόνο επιλεγμένα τοπικά υλικά από πιστοποιημένους προμηθευτές που εγγυώνται την ποιότητα.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-6 w-6 text-canteen-coral dark:text-canteen-coral mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-canteen-dark dark:text-white mb-2">Προσαρμοσμένα Πακέτα</h3>
                      <p className="text-canteen-darkgray dark:text-gray-400">
                        Δυνατότητα προσαρμογής των πακέτων γευμάτων ανάλογα με τις διατροφικές ανάγκες του κάθε σχολείου.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="bg-canteen-yellow dark:bg-secondary hover:opacity-90 text-white px-6 py-2 rounded-lg"
                      asChild
                    >
                      <Link to="/contact">
                        Εγγραφείτε για ενημερώσεις
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-card p-4 rounded-lg border border-gray-100 dark:border-primary/10">
                    <Leaf className="w-6 h-6 text-canteen-teal dark:text-primary mb-3" />
                    <p className="font-medium text-canteen-dark dark:text-white">Μεσογειακή Σαλάτα</p>
                    <p className="text-xs text-canteen-darkgray dark:text-gray-400">Φρέσκα λαχανικά εποχής</p>
                  </div>
                  <div className="bg-white dark:bg-card p-4 rounded-lg border border-gray-100 dark:border-primary/10">
                    <Coffee className="w-6 h-6 text-canteen-yellow dark:text-secondary mb-3" />
                    <p className="font-medium text-canteen-dark dark:text-white">Ολικής Άλεσης Σάντουιτς</p>
                    <p className="text-xs text-canteen-darkgray dark:text-gray-400">Με επιλεγμένα υλικά</p>
                  </div>
                  <div className="bg-white dark:bg-card p-4 rounded-lg border border-gray-100 dark:border-primary/10">
                    <Clock className="w-6 h-6 text-canteen-coral dark:text-canteen-coral mb-3" />
                    <p className="font-medium text-canteen-dark dark:text-white">Φρέσκα Φρούτα Εποχής</p>
                    <p className="text-xs text-canteen-darkgray dark:text-gray-400">Ποικιλία φρούτων</p>
                  </div>
                  <div className="bg-white dark:bg-card p-4 rounded-lg border border-gray-100 dark:border-primary/10">
                    <MessageSquare className="w-6 h-6 text-canteen-mint dark:text-canteen-mint mb-3" />
                    <p className="font-medium text-canteen-dark dark:text-white">Γιαούρτι με Δημητριακά</p>
                    <p className="text-xs text-canteen-darkgray dark:text-gray-400">Υψηλή περιεκτικότητα πρωτεΐνης</p>
                  </div>
                </div>
                
                <div className="mt-4 bg-white dark:bg-card p-4 rounded-lg border border-gray-100 dark:border-primary/10 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-canteen-yellow dark:text-secondary" />
                  <div>
                    <p className="text-sm text-canteen-darkgray dark:text-gray-400">Διαθέσιμα Πακέτα</p>
                    <p className="font-bold text-xl text-canteen-dark dark:text-white">20+ επιλογές</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Eco-friendly Section */}
        <section 
          ref={ecoRef}
          className="py-16 bg-white dark:bg-background"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
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

