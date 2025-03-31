import React, { useState, useEffect } from "react";
import { ShoppingBag, Clock, Leaf, CreditCard } from "lucide-react";

// Features data
const features = [
  {
    id: "order",
    title: "Παραγγελία",
    icon: ShoppingBag,
    color: "#29696B",
    lightColor: "#1e5e60",
    description: "Γρήγορη & εύκολη παραγγελία"
  },
  {
    id: "queue",
    title: "Ουρά",
    icon: Clock,
    color: "#F3C963",
    lightColor: "#e6b232",
    description: "Χωρίς αναμονή στην ουρά"
  },
  {
    id: "payment",
    title: "Πληρωμή",
    icon: CreditCard,
    color: "#29696B",
    lightColor: "#1e5e60",
    description: "Ασφαλείς συναλλαγές"
  },
  {
    id: "eco",
    title: "Περιβάλλον",
    icon: Leaf,
    color: "#4CAF50",
    lightColor: "#3d9140",
    description: "Μείωση πλαστικής σακούλας"
  }
];

// Particle configurations
const particleTypes = [
  { size: '1px', opacityRange: [0.3, 0.5], speedMultiplier: 1 },
  { size: '2px', opacityRange: [0.4, 0.6], speedMultiplier: 0.7 },
  { size: '3px', opacityRange: [0.2, 0.4], speedMultiplier: 0.5 },
  { size: '1.5px', opacityRange: [0.3, 0.7], speedMultiplier: 1.2 }
];

export const AnimatedAppFlow: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: string;
    opacity: number;
    speed: number;
    direction: number;
    type: string;
  }>>([]);
  
  // Generate particles
  useEffect(() => {
    const particleCount = 12;
    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: type.size,
        opacity: type.opacityRange[0] + Math.random() * (type.opacityRange[1] - type.opacityRange[0]),
        speed: (0.5 + Math.random() * 1.5) * type.speedMultiplier,
        direction: Math.random() * 360,
        type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
      };
    });
    
    setParticles(newParticles);
  }, []);
  
  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        // Convert direction to radians
        const dirRadians = (particle.direction * Math.PI) / 180;
        
        // Calculate new position using trigonometry
        let newX = particle.x + Math.cos(dirRadians) * particle.speed * 0.1;
        let newY = particle.y + Math.sin(dirRadians) * particle.speed * 0.1;
        
        // Bounce off edges
        let newDirection = particle.direction;
        if (newX <= 0 || newX >= 100) {
          newDirection = 180 - newDirection;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY <= 0 || newY >= 100) {
          newDirection = 360 - newDirection;
          newY = Math.max(0, Math.min(100, newY));
        }
        
        // Add some random movement
        newDirection += Math.random() * 10 - 5;
        
        // Ensure direction stays within 0-360 range
        newDirection = (newDirection + 360) % 360;
        
        return {
          ...particle,
          x: newX,
          y: newY,
          direction: newDirection,
          opacity: particle.opacity * (Math.sin(Date.now() / 2000) * 0.2 + 0.8)
        };
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Auto cycle through features
    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
        setIsChanging(false);
      }, 300);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleFeatureClick = (index: number) => {
    if (index === activeFeature) return;
    setIsChanging(true);
    setTimeout(() => {
      setActiveFeature(index);
      setIsChanging(false);
    }, 300);
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-[#1d2525] rounded-xl py-4 px-4 relative overflow-hidden shadow-lg" style={{ maxHeight: "220px" }}>
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg z-0"></div>
      
      {/* Background glow */}
      <div 
        className="absolute w-32 h-32 rounded-full blur-3xl opacity-10 dark:opacity-20 transition-all duration-700 ease-in-out z-0"
        style={{ 
          backgroundColor: features[activeFeature].color,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Enhanced particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {particles.map(particle => {
          const currentColor = features[activeFeature].color;
          const particleColor = particle.id % 3 === 0 
            ? currentColor
            : particle.id % 3 === 1 
              ? features[(activeFeature + 1) % features.length].color
              : features[(activeFeature + 2) % features.length].color;
          
          return (
            <div
              key={particle.id}
              className="absolute transition-all motion-reduce:transition-none duration-200"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                width: particle.size,
                height: particle.size,
                backgroundColor: particleColor,
                borderRadius: particle.type === 'circle' ? '50%' : particle.type === 'square' ? '2px' : '0',
                transform: particle.type === 'triangle' ? 'rotate(45deg)' : 'none',
                boxShadow: `0 0 ${parseInt(particle.size) * 2}px ${particleColor}`,
                zIndex: 1
              }}
            />
          );
        })}
      </div>
      
      <div className="text-center mb-3 relative z-10">
        <h3 className="text-gray-900 dark:text-white font-bold text-base">OrderAhead.gr</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs">Απλή διαδικασία, χωρίς αναμονή</p>
      </div>
      
      {/* Active feature */}
      <div className="flex items-center justify-center mb-2 relative z-10">
        <div 
          className={`flex flex-col items-center max-w-xs py-3 px-5 bg-white dark:bg-[#1a2424] rounded-lg shadow-lg transition-all duration-300 ${isChanging ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}
          style={{ 
            borderLeft: `3px solid ${features[activeFeature].color}`,
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02), 0 0 20px ${features[activeFeature].color}30`
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative"
              style={{ backgroundColor: features[activeFeature].color }}
            >
              {React.createElement(features[activeFeature].icon, { 
                className: "h-6 w-6 text-white animate-pulse-slow" 
              })}
              <div className="absolute -inset-1 rounded-full animate-ping-slow opacity-30" style={{ backgroundColor: features[activeFeature].color }}></div>
              <div className="absolute inset-0 rounded-full animate-glow" style={{ 
                boxShadow: `0 0 15px ${features[activeFeature].color}80`, 
                opacity: 0.5
              }}></div>
            </div>
            
            <div className="flex flex-col items-start">
              <h4 className="text-gray-900 dark:text-white font-bold text-base mb-0.5">{features[activeFeature].title}</h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs">{features[activeFeature].description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature nav */}
      <div className="flex justify-center gap-2 mb-2 relative z-10">
        {features.map((feature, index) => (
          <button
            key={feature.id}
            onClick={() => handleFeatureClick(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeFeature 
                ? 'w-5 bg-gray-800 dark:bg-white' 
                : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Switch to ${feature.title}`}
          />
        ))}
      </div>
      
      {/* Small footer */}
      <div className="flex items-center justify-center gap-2 relative z-10">
        {features.map((feature, index) => (
          <div 
            key={feature.id}
            onClick={() => handleFeatureClick(index)}
            className={`relative rounded-full transition-all duration-300 cursor-pointer ${
              index === activeFeature ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-80 scale-100'
            }`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                index === activeFeature ? 'animate-slight-bounce' : ''
              }`}
              style={{ 
                backgroundColor: index === activeFeature 
                  ? feature.color 
                  : 'var(--feature-inactive-bg, #f0f0f0)'
              }}
            >
              {React.createElement(feature.icon, { 
                className: `h-4 w-4 ${
                  index === activeFeature 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-300'
                }` 
              })}
            </div>
            {index === activeFeature && (
              <div 
                className="absolute inset-0 rounded-full animate-glow z-0" 
                style={{ 
                  boxShadow: `0 0 10px ${feature.color}60`,
                  opacity: 0.7 
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Animations & CSS Variables */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --feature-inactive-bg: #f0f0f0;
          --grid-color: rgba(0, 0, 0, 0.05);
          --grid-size: 20px;
        }
        
        .dark {
          --feature-inactive-bg: #2d3535;
          --grid-color: rgba(255, 255, 255, 0.05);
        }

        .grid-bg {
          background-image: 
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
          background-size: var(--grid-size) var(--grid-size);
          background-position: center center;
          mask-image: radial-gradient(circle at center, black 70%, transparent 100%);
        }
      
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(0.8); opacity: 0.3; }
          70% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.5; transform: scale(1); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes slight-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slight-bounce {
          animation: slight-bounce 2s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}; 