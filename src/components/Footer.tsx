import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Heart, ExternalLink, ChevronRight, Leaf } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-white to-gray-50 dark:from-background dark:to-background/90 border-t border-gray-100 dark:border-primary/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[url('/pattern.svg')] bg-repeat"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white dark:from-background to-transparent"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-canteen-teal/5 dark:bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-canteen-yellow/5 dark:bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center gap-2 group mb-4">
                <div className="bg-gradient-to-br from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint rounded-full p-1.5 overflow-hidden shadow-md">
                  <img 
                    src="/OrderAhead-logo.svg" 
                    alt="OrderAhead.gr Logo" 
                    className="h-6 w-6 rounded-full" 
                  />
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-canteen-dark to-canteen-teal dark:from-white dark:to-primary transition-colors duration-300">
                  OrderAhead.gr
                </span>
              </Link>
              <p className="text-canteen-darkgray dark:text-gray-400 text-sm mb-6">
                Η εφαρμογή παραγγελίας για τα σχολικά κυλικεία. Απολαύστε γρήγορη εξυπηρέτηση χωρίς ουρές αναμονής.
              </p>
              
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={16} className="text-canteen-teal dark:text-primary flex-shrink-0" />
                <span className="text-sm text-canteen-darkgray dark:text-gray-300">
                  Λεωφ. Κηφισίας 123, 11525 Αθήνα
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Phone size={16} className="text-canteen-teal dark:text-primary flex-shrink-0" />
                <a href="tel:+302101234567" className="text-sm text-canteen-darkgray dark:text-gray-300 hover:text-canteen-teal dark:hover:text-primary transition-colors">
                  210 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-canteen-teal dark:text-primary flex-shrink-0" />
                <a href="mailto:info@orderahead.gr" className="text-sm text-canteen-darkgray dark:text-gray-300 hover:text-canteen-teal dark:hover:text-primary transition-colors">
                  info@orderahead.gr
                </a>
              </div>
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-canteen-dark dark:text-white font-semibold mb-5">Γρήγορη πλοήγηση</h3>
            <ul className="space-y-3">
              {[
                { name: 'Αρχική', path: '/' },
                { name: 'Κατάλογος', path: '/menu' },
                { name: 'Κατάσταση Παραγγελίας', path: '/order-status' },
                { name: 'Επικοινωνία', path: '/contact' },
                { name: 'Σχετικά με εμάς', path: '/about' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors text-sm flex items-center"
                  >
                    <ChevronRight size={14} className="mr-1.5 text-canteen-teal/50 dark:text-primary/50" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Useful Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-canteen-dark dark:text-white font-semibold mb-5">Χρήσιμοι Σύνδεσμοι</h3>
            <ul className="space-y-3">
              {[
                { name: 'Όροι Χρήσης', path: '/terms' },
                { name: 'Πολιτική Απορρήτου', path: '/privacy' },
                { name: 'Συχνές Ερωτήσεις', path: '/faq' },
                { name: 'Βοήθεια', path: '/help' },
                { name: 'Υπ. Παιδείας', path: 'https://www.minedu.gov.gr/', external: true },
              ].map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a 
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors text-sm flex items-center"
                    >
                      <ExternalLink size={14} className="mr-1.5 text-canteen-teal/50 dark:text-primary/50" />
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.path}
                      className="text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors text-sm flex items-center"
                    >
                      <ChevronRight size={14} className="mr-1.5 text-canteen-teal/50 dark:text-primary/50" />
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-canteen-dark dark:text-white font-semibold mb-5">Εγγραφείτε στο Newsletter</h3>
            <p className="text-canteen-darkgray dark:text-gray-400 text-sm mb-4">
              Λάβετε ενημερώσεις για νέα προϊόντα και προσφορές στο email σας.
            </p>
            
            <form className="mb-6">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Διεύθυνση email" 
                  className="w-full bg-white dark:bg-card border border-gray-200 dark:border-primary/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-canteen-teal/20 dark:focus:ring-primary/20"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint hover:opacity-90 text-white rounded-md px-3 py-1.5 text-xs transition-all">
                  Εγγραφή
                </button>
              </div>
            </form>
            
            {/* Eco Friendly */}
            <div className="bg-gradient-to-br from-canteen-teal/10 to-canteen-mint/10 dark:from-primary/10 dark:to-canteen-mint/5 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-canteen-teal/20 dark:bg-primary/20 rounded-full p-2 flex-shrink-0">
                <Leaf className="h-4 w-4 text-canteen-teal dark:text-primary" />
              </div>
              <div>
                <h4 className="text-canteen-dark dark:text-white text-sm font-medium mb-1">Φιλικό προς το περιβάλλον</h4>
                <p className="text-canteen-darkgray dark:text-gray-400 text-xs">
                  Έχουμε εξοικονομήσει πάνω από 120kg χαρτί με τις ψηφιακές παραγγελίες μας!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Social Media & Copyright */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white dark:bg-card border border-gray-200 dark:border-primary/10 flex items-center justify-center text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors shadow-sm hover:shadow-md"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white dark:bg-card border border-gray-200 dark:border-primary/10 flex items-center justify-center text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors shadow-sm hover:shadow-md"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white dark:bg-card border border-gray-200 dark:border-primary/10 flex items-center justify-center text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors shadow-sm hover:shadow-md"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
          </div>
          
          <div className="text-sm text-canteen-darkgray dark:text-gray-400 flex items-center flex-wrap gap-2">
            <span>© {currentYear} OrderAhead.gr • Όλα τα δικαιώματα διατηρούνται</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center">
              Made with <Heart size={12} className="mx-1 text-canteen-coral" /> in Greece
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
