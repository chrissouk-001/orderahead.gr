
import React, { useState } from 'react';
import { Send, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Το μήνυμά σας εστάλη επιτυχώς!');
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Επικοινωνία</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Στείλτε μας μήνυμα</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Ονοματεπώνυμο <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Το ονοματεπώνυμό σας"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Το email σας"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base">
                  Μήνυμα <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Γράψτε το μήνυμά σας εδώ..."
                  rows={5}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-canteen-teal hover:bg-canteen-teal/90" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Αποστολή...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Αποστολή
                  </>
                )}
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Στοιχεία Επικοινωνίας</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-canteen-teal mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Υπεύθυνος Κυλικείου</h3>
                    <p className="text-gray-600 mt-1">
                      Για όλα τα θέματα που αφορούν το σχολικό κυλικείο και τις παραγγελίες σας, 
                      μπορείτε να επικοινωνήσετε απευθείας με τον υπεύθυνο του κυλικείου.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-canteen-teal mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Τηλέφωνο</h3>
                    <p className="text-gray-600 mt-1">+30 123 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-canteen-teal mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600 mt-1">canteen@atsoglou.edu.gr</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-canteen-teal mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Διεύθυνση</h3>
                    <p className="text-gray-600 mt-1">
                      Εκπαιδευτήρια Ατσόγλου, Οδός Παραδείγματος 123, Αθήνα
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Ώρες Λειτουργίας Κυλικείου</h3>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Δευτέρα - Παρασκευή</span>
                    <span className="font-medium">08:00 - 14:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Σάββατο</span>
                    <span className="font-medium">08:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Κυριακή</span>
                    <span className="font-medium">Κλειστά</span>
                  </div>
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
