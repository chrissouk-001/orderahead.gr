import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-canteen-dark dark:bg-background text-white pt-10 pb-6 border-t border-gray-700 dark:border-border transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-white dark:text-white">Smart Canteen Atsoglou</h3>
            <p className="text-gray-300 dark:text-muted-foreground mb-4 transition-colors duration-300">
              Μια καινοτόμα λύση για το σχολικό κυλικείο των Εκπαιδευτηρίων Ατσόγλου.
            </p>
            <p className="text-gray-300 dark:text-muted-foreground transition-colors duration-300">
              Με την καθοδήγηση του κ. Δημήτρη Λιόφη, MSc.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white dark:text-white">Σύνδεσμοι</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 dark:text-muted-foreground hover:text-white dark:hover:text-primary transition-colors duration-300">
                  Αρχική
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 dark:text-muted-foreground hover:text-white dark:hover:text-primary transition-colors duration-300">
                  Κατάλογος Προϊόντων
                </Link>
              </li>
              <li>
                <Link to="/order-status" className="text-gray-300 dark:text-muted-foreground hover:text-white dark:hover:text-primary transition-colors duration-300">
                  Κατάσταση Παραγγελίας
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 dark:text-muted-foreground hover:text-white dark:hover:text-primary transition-colors duration-300">
                  Επικοινωνία
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white dark:text-white">Επικοινωνία</h3>
            <address className="not-italic text-gray-300 dark:text-muted-foreground transition-colors duration-300">
              <p>Εκπαιδευτήρια Ατσόγλου</p>
              <p>Email: info@atsoglou.edu.gr</p>
              <p>Τηλέφωνο: +30 123 456 7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 dark:border-muted mt-8 pt-6 flex flex-col md:flex-row justify-between items-center transition-colors duration-300">
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
