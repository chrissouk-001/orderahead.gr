import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Clock, User, CreditCard, ShieldCheck, MessageSquare, Leaf, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProductCarousel } from "@/components/ProductCarousel";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({
    features: false,
    about: false,
    eco: false
  });
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ecoRef = useRef<HTMLDivElement>(null);
  
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-canteen-dark text-white py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat" style={parallaxStyle}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-canteen-dark/50 to-canteen-dark"></div>
          
          {/* Animated waves */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="wave wave1 opacity-20"></div>
            <div className="wave wave2 opacity-15"></div>
            <div className="wave wave3 opacity-10"></div>
          </div>
          
          {/* Floating shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <img src="/images/shapes.svg" className="absolute top-10 left-10 w-40 h-40 opacity-10 animate-float" />
            <img src="/images/shapes.svg" className="absolute bottom-20 right-10 w-32 h-32 opacity-10 animate-float-delayed rotate-45" />
            <img src="/images/shapes.svg" className="absolute top-1/2 right-1/4 w-24 h-24 opacity-10 animate-float-reverse rotate-90" />
          </div>
          
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 fade-in-up">
                  Smart Canteen <span className="text-canteen-yellow">Atsoglou</span>
                </h1>
                <p className="text-xl md:text-2xl mb-6 text-gray-300 fade-in-up delay-200">
                  Καινοτόμα λύση για το σχολικό κυλικείο
                </p>
                <p className="mb-8 text-gray-300 max-w-xl fade-in-up delay-300">
                  Με την εφαρμογή Smart Canteen Atsoglou, η καθημερινή εμπειρία του σχολικού κυλικείου 
                  γίνεται πιο γρήγορη, οργανωμένη και φιλική προς το περιβάλλον!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 fade-in-up delay-400">
                <Button className="bg-canteen-teal hover:bg-canteen-teal/90 text-white py-6 px-6 text-lg shadow-lg transform hover:translate-y-[-4px] transition-transform duration-300" asChild>
                  <Link to={isAuthenticated ? "/menu" : "/login"}>
                    {isAuthenticated ? "Παραγγείλτε Τώρα" : "Σύνδεση"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-canteen-yellow text-canteen-yellow hover:bg-canteen-yellow/20 hover:text-canteen-dark transition-colors duration-300 font-medium shadow-sm py-6 px-6 text-lg transform hover:translate-y-[-4px] transition-transform duration-300" asChild>
                  <Link to="/contact">Μάθετε Περισσότερα</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center fade-in-up delay-500">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-canteen-teal to-canteen-yellow rounded-lg opacity-70 blur-sm animate-pulse"></div>
                <img 
                  src="/lovable-uploads/8c8c878b-ccef-4b47-9625-910f0cdf1bd7.png" 
                  alt="Smart Canteen App" 
                  className="relative max-w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 z-10" 
                />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white opacity-70" />
          </div>
        </section>
        
        {/* Popular Products Section */}
        <section className="bg-white py-20 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>
          <div className="absolute left-0 bottom-0 w-full h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
          
          <div className="absolute -left-32 top-1/4 w-64 h-64 bg-canteen-yellow/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-32 bottom-1/4 w-64 h-64 bg-canteen-teal/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-canteen-dark">Δημοφιλή Προϊόντα</h2>
              <div className="w-20 h-1 bg-canteen-teal mx-auto mt-4 mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">Ανακαλύψτε τις αγαπημένες επιλογές των μαθητών και καθηγητών του σχολείου μας.</p>
            </div>
            
            <div className="relative">
              <div className="absolute hidden md:block left-1/2 top-0 -translate-x-1/2 -translate-y-10 text-canteen-teal/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="240" height="120" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M156.56 32a16 16 0 00-13.42 24.56l21.1 35.16c4.98 8.3 8.26 13.71 10.42 18.57 2.33 5.24 3.34 9.23 3.34 17.71v224c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16V128c0-8.48 1.01-12.47 3.34-17.71 2.16-4.86 5.44-10.27 10.42-18.57l21.1-35.16A16 16 0 00247.44 32h-90.88zM343.3 141.66l-14.8 26.88c-2.55 4.62-4.29 7.19-5.53 8.92-1.7 2.37-2.79 3.8-3.97 5.34V349c0 17.67 14.33 32 32 32h16c17.67 0 32-14.33 32-32V95c0-17.67-14.33-32-32-32h-4c-12.73 0-24.25 7.39-29.7 18.66z"/>
                </svg>
              </div>
              
              <ProductCarousel />
              
              <div className="mt-8 text-center">
                <Button className="bg-canteen-teal hover:bg-canteen-teal/90 text-white shadow-sm rounded-md py-3 px-6 transition-all duration-300" asChild>
                  <Link to="/menu">
                    Δείτε όλα τα προϊόντα
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-canteen-teal/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-canteen-yellow/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-canteen-dark">Λειτουργίες της Εφαρμογής</h2>
              <div className="w-20 h-1 bg-canteen-teal mx-auto mt-4 mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">Η εφαρμογή μας προσφέρει μια σειρά από χρήσιμες λειτουργίες που κάνουν την εμπειρία του κυλικείου πιο ευχάριστη και αποτελεσματική.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-500 border-t-4 border-canteen-teal relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 rounded-full mb-6 relative z-10">
                  <User className="h-8 w-8 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark relative z-10">Login & Εγγραφή</h3>
                <p className="text-gray-600 relative z-10">
                  Σύνδεση μέσω email/κωδικού ή Google Account για εύκολη πρόσβαση.
                </p>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-500 border-t-4 border-canteen-teal relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 rounded-full mb-6 relative z-10">
                  <Coffee className="h-8 w-8 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark relative z-10">Κατάλογος Προϊόντων</h3>
                <p className="text-gray-600 relative z-10">
                  Πλήρης λίστα προϊόντων με τιμές για εύκολη επιλογή και αγορά.
                </p>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-500 border-t-4 border-canteen-teal relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 rounded-full mb-6 relative z-10">
                  <CreditCard className="h-8 w-8 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark relative z-10">Ολοκλήρωση Παραγγελίας</h3>
                <p className="text-gray-600 relative z-10">
                  Προβολή κόστους και επιλογή για οικολογική συσκευασία.
                </p>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-500 border-t-4 border-canteen-teal relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 rounded-full mb-6 relative z-10">
                  <Clock className="h-8 w-8 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark relative z-10">Σειρά Προτεραιότητας</h3>
                <p className="text-gray-600 relative z-10">
                  Ενημέρωση για τη σειρά εξυπηρέτησης και το χρόνο αναμονής.
                </p>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-500 border-t-4 border-canteen-teal relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 rounded-full mb-6 relative z-10">
                  <ShieldCheck className="h-8 w-8 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark relative z-10">Ασφάλεια</h3>
                <p className="text-gray-600 relative z-10">
                  Ασφαλείς συναλλαγές και προστασία προσωπικών δεδομένων.
                </p>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-500 border-t-4 border-canteen-teal relative overflow-hidden group ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
                <div className="absolute inset-0 opacity-0 bg-canteen-teal/5 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 rounded-full mb-6 relative z-10">
                  <MessageSquare className="h-8 w-8 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-canteen-dark relative z-10">Επικοινωνία</h3>
                <p className="text-gray-600 relative z-10">
                  Άμεση επικοινωνία με τον υπεύθυνο του κυλικείου.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Project Section */}
        <section ref={aboutRef} className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className={`md:w-1/2 mb-10 md:mb-0 transition-all duration-700 ${isVisible.about ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <img 
                  src="/images/project-about.jpg" 
                  alt="Εκπαιδευτήρια Ατσόγλου" 
                  className="max-w-full h-auto rounded-lg shadow-xl" 
                />
              </div>
              <div className={`md:w-1/2 md:pl-16 transition-all duration-700 ${isVisible.about ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-canteen-dark">Σχετικά με το Project</h2>
                <div className="w-20 h-1 bg-canteen-teal mb-6 rounded-full"></div>
                <p className="mb-4 text-gray-700 text-lg">
                  Στο πλαίσιο του διαγωνισμού επιχειρηματικότητας, η ομάδα του Γυμνασίου των 
                  Εκπαιδευτηρίων Ατσόγλου αναλαμβάνει την ανάπτυξη της εφαρμογής Smart Canteen Atsoglou.
                </p>
                <p className="mb-8 text-gray-700 text-lg">
                  Το project δημιουργήθηκε με την καθοδήγηση του κ. Δημήτρη Λιόφη, MSc, και στοχεύει 
                  στη βελτίωση της εμπειρίας αγοράς στο σχολικό κυλικείο, προσφέροντας μια γρήγορη, 
                  εύχρηστη και φιλική προς το περιβάλλον λύση.
                </p>
                <Button className="bg-canteen-yellow text-canteen-dark hover:bg-canteen-yellow/90 font-medium py-3 px-6 text-lg shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300" asChild>
                  <Link to="/contact">Μάθετε Περισσότερα</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Eco-friendly Section */}
        <section ref={ecoRef} className="py-20 bg-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className={`md:w-1/2 mb-10 md:mb-0 md:pl-16 transition-all duration-700 ${isVisible.eco ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <img 
                  src="/images/eco-packaging.jpg" 
                  alt="Οικολογική Συσκευασία" 
                  className="max-w-full h-auto rounded-lg shadow-xl" 
                />
              </div>
              <div className={`md:w-1/2 transition-all duration-700 ${isVisible.eco ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                <div className="inline-flex items-center justify-center p-4 bg-canteen-teal/10 rounded-full mb-6">
                  <Leaf className="h-8 w-8 text-canteen-teal" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-canteen-dark">Φιλικό προς το Περιβάλλον</h2>
                <div className="w-20 h-1 bg-canteen-teal mb-6 rounded-full"></div>
                <p className="mb-4 text-gray-700 text-lg">
                  Η εφαρμογή Smart Canteen Atsoglou προωθεί την οικολογική συνείδηση, επιτρέποντας στους 
                  μαθητές να επιλέξουν εάν επιθυμούν να χρησιμοποιήσουν πλαστική σακούλα ή όχι.
                </p>
                <p className="mb-8 text-gray-700 text-lg">
                  Επιπλέον, η ηλεκτρονική παραγγελία μειώνει τη χρήση χαρτιού και συμβάλλει στη 
                  μείωση του περιβαλλοντικού αποτυπώματος του σχολείου.
                </p>
                <Button className="bg-canteen-teal hover:bg-canteen-teal/90 text-white text-lg px-6 py-3 shadow-lg transform hover:translate-y-[-2px] transition-transform duration-300" asChild>
                  <Link to={isAuthenticated ? "/menu" : "/login"}>
                    Δοκιμάστε το Τώρα
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-canteen-teal text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Έτοιμοι να δοκιμάσετε το Smart Canteen Atsoglou;</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Κάντε την καθημερινή εμπειρία του σχολικού κυλικείου πιο γρήγορη, οργανωμένη και 
              φιλική προς το περιβάλλον!
            </p>
            <Button className="bg-white text-canteen-teal hover:bg-gray-100 text-lg px-8 py-4 shadow-lg transform hover:translate-y-[-4px] transition-transform duration-300" asChild>
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
