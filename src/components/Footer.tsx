
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-canteen-dark text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Smart Canteen Atsoglou</h3>
            <p className="text-gray-300 mb-4">
              Μια καινοτόμα λύση για το σχολικό κυλικείο των Εκπαιδευτηρίων Ατσόγλου.
            </p>
            <p className="text-gray-300">
              Με την καθοδήγηση του κ. Δημήτρη Λιόφη, MSc.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Σύνδεσμοι</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Αρχική
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-white transition-colors">
                  Κατάλογος Προϊόντων
                </Link>
              </li>
              <li>
                <Link to="/order-status" className="text-gray-300 hover:text-white transition-colors">
                  Κατάσταση Παραγγελίας
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Επικοινωνία
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Επικοινωνία</h3>
            <address className="not-italic text-gray-300">
              <p>Εκπαιδευτήρια Ατσόγλου</p>
              <p>Email: info@atsoglou.edu.gr</p>
              <p>Τηλέφωνο: +30 123 456 7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Εκπαιδευτήρια Ατσόγλου. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">
              Διαγωνισμός Επιχειρηματικότητας - Γυμνάσιο Εκπαιδευτηρίων Ατσόγλου
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
