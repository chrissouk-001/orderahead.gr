import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !message) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Το μήνυμά σας εστάλη επιτυχώς!');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0d1424]">
      <Navbar />
      
      <div className="bg-gradient-to-r from-canteen-teal to-blue-500 dark:from-primary dark:to-blue-700 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white">Επικοινωνία</h1>
          <p className="text-white/90 mt-2 max-w-xl mx-auto">
            Είμαστε εδώ για να βοηθήσουμε με οποιαδήποτε απορία για το έξυπνο κυλικείο
          </p>
        </div>
      </div>
      
      <main className="flex-grow bg-gray-50 dark:bg-[#0d1424] py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white dark:bg-[#141d30] rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                  <MapPin className="h-5 w-5 text-canteen-teal dark:text-canteen-teal mr-2" />
                  Πού θα μας βρείτε
                </h2>
                
                <div className="space-y-5">
                  <div className="flex">
                    <MapPin className="h-5 w-5 text-canteen-teal dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Διεύθυνση</p>
                      <p className="text-gray-600 dark:text-gray-300">Εκπαιδευτήρια Ατσόγλου, Οδός Παραδείγματος 123, Αθήνα</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Phone className="h-5 w-5 text-canteen-teal dark:text-canteen-teal mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Τηλέφωνο</p>
                      <p className="text-gray-600 dark:text-gray-300">+30 123 456 7890</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Δευτ-Παρ 08:00-14:30</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Mail className="h-5 w-5 text-canteen-teal dark:text-canteen-teal mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Email</p>
                      <a href="mailto:canteen@atsoglou.edu.gr" className="text-canteen-teal hover:underline dark:text-blue-400">
                        canteen@atsoglou.edu.gr
                      </a>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-6 text-gray-700 dark:text-gray-300"
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                >
                  Άνοιγμα σε Google Maps
                  <ExternalLink size={14} className="ml-2" />
                </Button>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white dark:bg-[#141d30] rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                  <Send className="h-5 w-5 text-canteen-teal dark:text-canteen-teal mr-2" />
                  Στείλτε μας μήνυμα
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Το email σας"
                    className="bg-gray-50 border-gray-200 focus:border-canteen-teal text-gray-900 dark:bg-[#1a2642] dark:border-gray-700 dark:text-white"
                    required
                  />
                  
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Πώς μπορούμε να βοηθήσουμε;"
                    rows={4}
                    className="bg-gray-50 border-gray-200 focus:border-canteen-teal text-gray-900 dark:bg-[#1a2642] dark:border-gray-700 dark:text-white"
                    required
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-canteen-teal hover:bg-canteen-teal/90 text-white" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Αποστολή...' : 'Αποστολή'}
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Location Map */}
            <div className="mt-8 bg-white dark:bg-[#141d30] rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-canteen-teal dark:text-canteen-teal mr-2" />
                Τοποθεσία
              </h2>
              
              <div className="h-[200px] bg-gray-100 dark:bg-[#1a2642] rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white dark:bg-[#213251] p-3 rounded-full shadow-md">
                    <MapPin className="h-6 w-6 text-canteen-teal dark:text-canteen-teal" />
                  </div>
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-100/90 to-transparent dark:from-[#1a2642]/90 py-3 px-4 text-center">
                  <p className="text-gray-700 dark:text-gray-300">Το κυλικείο βρίσκεται στον κεντρικό διάδρομο του σχολείου, δίπλα στο προαύλιο</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
