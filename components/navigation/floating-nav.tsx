"use client";

import { useState, useEffect } from "react";

const navItems = [
  { id: 'hero', label: 'Inicio' },
  { id: 'details', label: 'Detalles' },
  { id: 'faq', label: 'FAQ' },
  { id: 'repo', label: 'Repositorio' },
  { id: 'judges', label: 'Jurado' },
  { id: 'sponsors', label: 'Patrocinadores' },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 200);
      }

      // Update active section
      const sections = navItems.map(item => document.getElementById(item.id));
      const currentSection = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
      <div className="bg-background/90 backdrop-blur-md border rounded-full shadow-lg px-2 py-2">
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${activeSection === item.id 
                  ? 'bg-brand-red text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
