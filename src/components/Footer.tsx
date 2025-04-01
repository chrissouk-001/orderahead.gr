import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Leaf, 
  Clock,
  ArrowRight,
  Send
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer: React.FC = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Subscription logic would go here
  };

  return (
    <footer className="bg-white dark:bg-background border-t border-gray-100 dark:border-primary/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-gradient-to-br from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint rounded-full p-1.5 overflow-hidden shadow-md">
                <img 
                  src="/OrderAhead-logo.svg" 
                  alt="OrderAhead.gr Logo" 
                  className="h-6 w-6 rounded-full" 
                />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-canteen-dark to-canteen-teal dark:from-white dark:to-primary">
                OrderAhead.gr
              </span>
            </div>
            <p className="text-canteen-darkgray dark:text-gray-400 text-sm mb-5">
              Παραγγείλτε εύκολα και γρήγορα το φαγητό σας από το κυλικείο του σχολείου. 
              Μια σύγχρονη λύση για πιο γρήγορη εξυπηρέτηση και λιγότερες ουρές αναμονής.
            </p>
            <div className="flex items-center space-x-3">
              <SocialLink href="https://instagram.com" aria-label="Instagram">
                <Instagram size={16} />
              </SocialLink>
              <SocialLink href="https://facebook.com" aria-label="Facebook">
                <Facebook size={16} />
              </SocialLink>
              <SocialLink href="https://twitter.com" aria-label="Twitter">
                <Twitter size={16} />
              </SocialLink>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-canteen-dark dark:text-white font-medium mb-5">Γρήγορη Πλοήγηση</h4>
            <ul className="space-y-2.5">
              <li>
                <FooterLink to="/">Αρχική Σελίδα</FooterLink>
              </li>
              <li>
                <FooterLink to="/menu">Κατάλογος Προϊόντων</FooterLink>
              </li>
              <li>
                <FooterLink to="/order-status">Κατάσταση Παραγγελίας</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Επικοινωνία</FooterLink>
              </li>
              <li>
                <FooterLink to="/faq">Συχνές Ερωτήσεις</FooterLink>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-canteen-dark dark:text-white font-medium mb-5">Επικοινωνία</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-canteen-teal/10 dark:bg-primary/10 flex items-center justify-center">
                  <MapPin size={14} className="text-canteen-teal dark:text-primary" />
                </div>
                <span className="text-canteen-darkgray dark:text-gray-400 text-sm">
                  Λεωφόρος Παιδείας 42, 15125 Αθήνα
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-canteen-teal/10 dark:bg-primary/10 flex items-center justify-center">
                  <Phone size={14} className="text-canteen-teal dark:text-primary" />
                </div>
                <span className="text-canteen-darkgray dark:text-gray-400 text-sm">
                  +30 210 1234567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-canteen-teal/10 dark:bg-primary/10 flex items-center justify-center">
                  <Mail size={14} className="text-canteen-teal dark:text-primary" />
                </div>
                <span className="text-canteen-darkgray dark:text-gray-400 text-sm">
                  info@orderahead.gr
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-canteen-teal/10 dark:bg-primary/10 flex items-center justify-center">
                  <Clock size={14} className="text-canteen-teal dark:text-primary" />
                </div>
                <span className="text-canteen-darkgray dark:text-gray-400 text-sm">
                  Δευτ-Παρ: 8:00-16:00
                </span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-canteen-dark dark:text-white font-medium mb-5">Ενημερωτικό Δελτίο</h4>
            <p className="text-canteen-darkgray dark:text-gray-400 text-sm mb-5">
              Εγγραφείτε στο newsletter μας για να λαμβάνετε τα νέα μας και ειδικές προσφορές.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-grow">
                <Input 
                  type="email" 
                  placeholder="Το email σας" 
                  className="bg-canteen-lightgray dark:bg-primary/5 border-transparent focus:border-canteen-teal dark:focus:border-primary rounded-lg pr-10"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Mail size={14} className="text-canteen-darkgray dark:text-gray-400" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint hover:opacity-90 text-white shadow-md"
              >
                <Send size={14} />
              </Button>
            </form>
          </div>
        </div>
        
        {/* Eco Friendly Banner */}
        <div className="mt-12 mb-8 p-6 bg-canteen-lightgray dark:bg-primary/5 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint flex items-center justify-center shadow-md">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-canteen-dark dark:text-white font-medium mb-1">Φιλική προς το περιβάλλον</h4>
                <p className="text-canteen-darkgray dark:text-gray-400 text-sm">
                  Βοηθάμε στη μείωση της χρήσης χαρτιού και πλαστικού με τις ψηφιακές παραγγελίες
                </p>
              </div>
            </div>
            <Link to="/eco-impact">
              <Button 
                variant="outline" 
                className="border-canteen-teal dark:border-primary text-canteen-teal dark:text-primary hover:bg-canteen-teal/10 dark:hover:bg-primary/10"
              >
                Δείτε την επίδραση <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-100 dark:border-primary/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-canteen-darkgray dark:text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} OrderAhead.gr. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-canteen-darkgray dark:text-gray-400">
            <Link to="/terms" className="hover:text-canteen-teal dark:hover:text-primary transition-colors">
              Όροι Χρήσης
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link to="/privacy" className="hover:text-canteen-teal dark:hover:text-primary transition-colors">
              Πολιτική Απορρήτου
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link to="/cookies" className="hover:text-canteen-teal dark:hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ 
  children, 
  ...props 
}) => {
  return (
    <a 
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="h-8 w-8 rounded-full bg-canteen-lightgray dark:bg-primary/10 hover:bg-canteen-teal hover:dark:bg-primary text-canteen-darkgray hover:text-white dark:text-gray-400 dark:hover:text-white flex items-center justify-center transition-colors duration-300"
    >
      {children}
    </a>
  );
};

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ 
  to, 
  children 
}) => {
  return (
    <Link 
      to={to} 
      className="inline-flex items-center text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary text-sm transition-colors duration-300 group"
    >
      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight size={12} />
      </span>
      {children}
    </Link>
  );
};

export default Footer;
