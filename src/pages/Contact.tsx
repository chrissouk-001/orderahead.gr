import React, { FormEvent, useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!name || !email || !message) {
      toast({
        title: "Συμπληρώστε όλα τα πεδία",
        description: "Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά πεδία.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate API call
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Επιτυχής αποστολή!",
        description: "Το μήνυμά σας στάλθηκε επιτυχώς. Θα επικοινωνήσουμε μαζί σας σύντομα.",
        variant: "default",
      });
      // Clear form
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background">
      {/* Removed Navbar here */}
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-canteen-teal to-blue-500 dark:from-primary dark:to-primary/80 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Επικοινωνήστε μαζί μας</h1>
          <p className="text-white/90 max-w-xl mx-auto">
            Έχετε κάποια ερώτηση ή πρόταση; Μη διστάσετε να επικοινωνήσετε μαζί μας!
          </p>
        </div>
      </div>
      
      <main className="flex-grow bg-gray-50 dark:bg-background/90 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <MapPin className="h-5 w-5 text-canteen-teal dark:text-canteen-teal mr-2" />
                Στοιχεία Επικοινωνίας
              </h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <MapPin className="h-5 w-5 text-canteen-teal dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Διεύθυνση</p>
                    <p className="text-gray-600 dark:text-gray-300">OrderAhead.gr, Λεωφόρος Συγγρού 123, Αθήνα</p>
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
                    <a href="mailto:support@orderahead.gr" className="text-canteen-teal hover:underline dark:text-blue-400">
                      support@orderahead.gr
                    </a>
                  </div>
                </div>
              </div>
              
              <hr className="mt-6 text-gray-700 dark:text-gray-300" />
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Ωράριο Λειτουργίας Κυλικείου</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Δευτέρα - Παρασκευή: 08:00 - 14:30</li>
                  <li>Σάββατο - Κυριακή: Κλειστά</li>
                </ul>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <Send className="h-5 w-5 text-canteen-teal dark:text-canteen-teal mr-2" />
                Φόρμα Επικοινωνίας
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Ονοματεπώνυμο <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Το ονοματεπώνυμό σας"
                    className="bg-gray-50 border-gray-200 focus:border-canteen-teal text-gray-900 dark:bg-muted dark:border-muted dark:text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Το email σας"
                    className="bg-gray-50 border-gray-200 focus:border-canteen-teal text-gray-900 dark:bg-muted dark:border-muted dark:text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">Μήνυμα <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Το μήνυμά σας..."
                    className="min-h-[120px] bg-gray-50 border-gray-200 focus:border-canteen-teal text-gray-900 dark:bg-muted dark:border-muted dark:text-white"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-canteen-teal hover:bg-canteen-teal/90 text-white dark:bg-primary dark:hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Αποστολή..." : "Αποστολή Μηνύματος"}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Map Location */}
          <div className="mt-8 bg-white dark:bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <MapPin className="h-5 w-5 text-canteen-teal dark:text-canteen-teal mr-2" />
              Τοποθεσία
            </h2>
            
            {/* Placeholder map */}
            <div className="h-[200px] bg-gray-100 dark:bg-muted rounded-lg relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white dark:bg-card p-3 rounded-full shadow-md">
                  <MapPin className="h-6 w-6 text-canteen-teal dark:text-canteen-teal" />
                </div>
              </div>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-100/90 to-transparent dark:from-muted/90 py-3 px-4 text-center">
                <p className="text-gray-700 dark:text-gray-300">Το κυλικείο βρίσκεται στον κεντρικό διάδρομο του σχολείου, δίπλα στο προαύλιο</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Removed Footer here */}
    </div>
  );
};

export default Contact;
