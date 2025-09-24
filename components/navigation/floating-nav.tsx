"use client";

import { useState, useEffect, useRef } from "react";

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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

  // Ensure active tab stays visible within horizontal scroll area on mobile
  useEffect(() => {
    const activeButton = buttonRefs.current[activeSection];
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSection]);

  if (!isVisible) return null;

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 bottom-[calc(env(safe-area-inset-bottom)+12px)] sm:top-6 sm:bottom-auto">
      <div className="bg-background/90 backdrop-blur-md border rounded-full shadow-lg px-2 py-2 max-w-[90vw] sm:max-w-none">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              ref={(el) => { buttonRefs.current[item.id] = el; }}
              onClick={() => scrollToSection(item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0
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
