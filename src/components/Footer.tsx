import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-canteen-dark dark:bg-[#0f172a] text-white pt-10 pb-6 border-t border-gray-700 dark:border-primary/20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-canteen-teal dark:bg-primary rounded-full p-1.5 mr-2 overflow-hidden shadow-md">
                <img 
                  src="https://img.freepik.com/premium-vector/school-food-logo-design-template_145155-2789.jpg?w=826" 
                  alt="Smart Canteen Atsoglou Logo" 
                  className="h-8 w-8 rounded-full" 
                />
              </div>
              <h3 className="text-lg font-bold text-white">
                <span>Smart Canteen</span>{" "}
                <span className="text-canteen-teal dark:text-primary">Atsoglou</span>
              </h3>
            </div>
            <p className="text-gray-300 dark:text-muted-foreground mb-4 transition-colors duration-300">
              Μια καινοτόμα λύση για το σχολικό κυλικείο των Εκπαιδευτηρίων Ατσόγλου.
            </p>
            <p className="text-gray-300 dark:text-muted-foreground transition-colors duration-300">
              Με την καθοδήγηση του κ. Δημήτρη Λιόφη, MSc.
            </p>
            
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white dark:text-white relative inline-block">
              Σύνδεσμοι
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-canteen-teal dark:bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 dark:text-muted-foreground hover:text-white hover:pl-1 dark:hover:text-primary transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-canteen-teal dark:bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100"></span>
                  Αρχική
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 dark:text-muted-foreground hover:text-white hover:pl-1 dark:hover:text-primary transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-canteen-teal dark:bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100"></span>
                  Κατάλογος Προϊόντων
                </Link>
              </li>
              <li>
                <Link to="/order-status" className="text-gray-300 dark:text-muted-foreground hover:text-white hover:pl-1 dark:hover:text-primary transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-canteen-teal dark:bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100"></span>
                  Κατάσταση Παραγγελίας
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 dark:text-muted-foreground hover:text-white hover:pl-1 dark:hover:text-primary transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-canteen-teal dark:bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100"></span>
                  Επικοινωνία
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white dark:text-white relative inline-block">
              Επικοινωνία
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-canteen-teal dark:bg-primary"></span>
            </h3>
            <address className="not-italic text-gray-300 dark:text-muted-foreground space-y-2 transition-colors duration-300">
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-canteen-teal dark:bg-primary rounded-full mr-2"></span>
                Εκπαιδευτήρια Ατσόγλου
              </p>
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-canteen-teal dark:bg-primary rounded-full mr-2"></span>
                Email: info@atsoglou.edu.gr
              </p>
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-canteen-teal dark:bg-primary rounded-full mr-2"></span>
                Τηλέφωνο: +30 123 456 7890
              </p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-canteen-teal dark:text-primary mt-2 hover:underline"
              >
                Δείτε στο χάρτη <ExternalLink size={14} className="ml-1" />
              </a>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 dark:border-primary/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center transition-colors duration-300">
          <p className="text-gray-400 dark:text-muted-foreground/80 text-sm transition-colors duration-300">
            &copy; {new Date().getFullYear()} Εκπαιδευτήρια Ατσόγλου. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400 dark:text-muted-foreground/80 text-sm transition-colors duration-300">
              Διαγωνισμός Επιχειρηματικότητας - Γυμνάσιο Εκπαιδευτηρίων Ατσόγλου
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
