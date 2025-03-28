
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Clock, User, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCarousel from '@/components/ProductCarousel';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-canteen-dark text-white py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Smart Canteen <span className="text-canteen-yellow">Atsoglou</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-300">
                Καινοτόμα λύση για το σχολικό κυλικείο
              </p>
              <p className="mb-8 text-gray-300">
                Με την εφαρμογή Smart Canteen Atsoglou, η καθημερινή εμπειρία του σχολικού κυλικείου 
                γίνεται πιο γρήγορη, οργανωμένη και φιλική προς το περιβάλλον!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-canteen-teal hover:bg-canteen-teal/90" asChild>
                  <Link to={isAuthenticated ? "/menu" : "/login"}>
                    {isAuthenticated ? "Παραγγείλτε Τώρα" : "Σύνδεση"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/contact">Μάθετε Περισσότερα</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/lovable-uploads/8c8c878b-ccef-4b47-9625-910f0cdf1bd7.png" 
                alt="Smart Canteen App" 
                className="max-w-full h-auto rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </section>
        
        {/* Popular Products Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Δημοφιλή Προϊόντα</h2>
            <ProductCarousel />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Λειτουργίες της Εφαρμογής</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center p-3 bg-canteen-teal/10 rounded-full mb-4">
                  <User className="h-6 w-6 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-2">Login & Εγγραφή</h3>
                <p className="text-gray-600">
                  Σύνδεση μέσω email/κωδικού ή Google Account για εύκολη πρόσβαση.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center p-3 bg-canteen-teal/10 rounded-full mb-4">
                  <Coffee className="h-6 w-6 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-2">Κατάλογος Προϊόντων</h3>
                <p className="text-gray-600">
                  Πλήρης λίστα προϊόντων με τιμές για εύκολη επιλογή και αγορά.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center p-3 bg-canteen-teal/10 rounded-full mb-4">
                  <CreditCard className="h-6 w-6 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ολοκλήρωση Παραγγελίας</h3>
                <p className="text-gray-600">
                  Προβολή κόστους και επιλογή για οικολογική συσκευασία.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center p-3 bg-canteen-teal/10 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-2">Σειρά Προτεραιότητας</h3>
                <p className="text-gray-600">
                  Ενημέρωση για τη σειρά εξυπηρέτησης και το χρόνο αναμονής.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center p-3 bg-canteen-teal/10 rounded-full mb-4">
                  <ShieldCheck className="h-6 w-6 text-canteen-teal" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ασφάλεια</h3>
                <p className="text-gray-600">
                  Ασφαλείς συναλλαγές και προστασία προσωπικών δεδομένων.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center p-3 bg-canteen-teal/10 rounded-full mb-4">
                  <svg className="h-6 w-6 text-canteen-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Επικοινωνία</h3>
                <p className="text-gray-600">
                  Άμεση επικοινωνία με τον υπεύθυνο του κυλικείου.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Project Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <img 
                  src="/images/school-canteen.jpg" 
                  alt="Εκπαιδευτήρια Ατσόγλου" 
                  className="max-w-full h-auto rounded-lg shadow-lg" 
                />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h2 className="text-3xl font-bold mb-6">Σχετικά με το Project</h2>
                <p className="mb-4 text-gray-700">
                  Στο πλαίσιο του διαγωνισμού επιχειρηματικότητας, η ομάδα του Γυμνασίου των 
                  Εκπαιδευτηρίων Ατσόγλου αναλαμβάνει την ανάπτυξη της εφαρμογής Smart Canteen Atsoglou.
                </p>
                <p className="mb-6 text-gray-700">
                  Το project δημιουργήθηκε με την καθοδήγηση του κ. Δημήτρη Λιόφη, MSc, και στοχεύει 
                  στη βελτίωση της εμπειρίας αγοράς στο σχολικό κυλικείο, προσφέροντας μια γρήγορη, 
                  εύχρηστη και φιλική προς το περιβάλλον λύση.
                </p>
                <Button variant="outline" className="border-canteen-teal text-canteen-teal hover:bg-canteen-teal/10" asChild>
                  <Link to="/contact">Επικοινωνήστε μαζί μας</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Eco-friendly Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pl-12">
                <img 
                  src="/images/eco-friendly.jpg" 
                  alt="Οικολογική Συσκευασία" 
                  className="max-w-full h-auto rounded-lg shadow-lg" 
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Φιλικό προς το Περιβάλλον</h2>
                <p className="mb-4 text-gray-700">
                  Η εφαρμογή Smart Canteen Atsoglou προωθεί την οικολογική συνείδηση, επιτρέποντας στους 
                  μαθητές να επιλέξουν εάν επιθυμούν να χρησιμοποιήσουν πλαστική σακούλα ή όχι.
                </p>
                <p className="mb-6 text-gray-700">
                  Επιπλέον, η ηλεκτρονική παραγγελία μειώνει τη χρήση χαρτιού και συμβάλλει στη 
                  μείωση του περιβαλλοντικού αποτυπώματος του σχολείου.
                </p>
                <Button className="bg-canteen-teal hover:bg-canteen-teal/90" asChild>
                  <Link to={isAuthenticated ? "/menu" : "/login"}>
                    Δοκιμάστε το Τώρα
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-canteen-teal text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Έτοιμοι να δοκιμάσετε το Smart Canteen Atsoglou;</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Κάντε την καθημερινή εμπειρία του σχολικού κυλικείου πιο γρήγορη, οργανωμένη και 
              φιλική προς το περιβάλλον!
            </p>
            <Button className="bg-white text-canteen-teal hover:bg-gray-100" asChild>
              <Link to={isAuthenticated ? "/menu" : "/login"}>
                {isAuthenticated ? "Παραγγείλτε Τώρα" : "Ξεκινήστε Τώρα"}
                <ArrowRight className="ml-2 h-4 w-4" />
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
