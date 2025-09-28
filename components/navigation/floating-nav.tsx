"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { id: 'hero', label: 'Inicio', type: 'section' },
  { id: 'details', label: 'Detalles', type: 'section' },
  { id: 'faq', label: 'FAQ', type: 'section' },
  { id: 'judges', label: 'Jurado', type: 'section' },
  { id: 'sponsors', label: 'Patrocinadores', type: 'section' },
  { id: '/tta', label: 'Crear Alpaca', type: 'link' },
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
      const sections = navItems
        .filter(item => item.type === 'section')
        .map(item => document.getElementById(item.id));
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

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.type === 'link') {
      window.location.href = item.id;
    } else {
      const section = document.getElementById(item.id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
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
            <Button
              key={item.id}
              ref={(el) => { buttonRefs.current[item.id] = el; }}
              onClick={() => handleNavClick(item)}
              aria-current={activeSection === item.id ? 'page' : undefined}
              variant={activeSection === item.id ? "default" : "ghost"}
              size="sm"
              className={`
                rounded-full text-sm font-medium transition-all duration-200 shrink-0
                ${activeSection === item.id 
                  ? 'bg-brand-red text-white shadow-sm hover:bg-brand-red/90' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {item.label}
            </Button>
          ))}
          
          {/* GitHub Repository Link */}
          <a
            href="https://github.com/crafter-station/peru.ai-hackathon.co"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver repositorio en GitHub"
            className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 shrink-0 ml-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.098 3.292 9.418 7.868 10.944.575.104.786-.25.786-.556 0-.274-.01-1-.016-1.964-3.2.695-3.878-1.543-3.878-1.543-.523-1.33-1.277-1.684-1.277-1.684-1.044-.714.079-.699.079-.699 1.154.081 1.763 1.186 1.763 1.186 1.027 1.76 2.695 1.252 3.352.957.104-.744.402-1.253.73-1.541-2.555-.291-5.237-1.278-5.237-5.686 0-1.256.45-2.282 1.186-3.086-.119-.29-.514-1.463.113-3.05 0 0 .967-.309 3.17 1.18a11.01 11.01 0 0 1 2.886-.388c.979.005 1.964.132 2.886.388 2.201-1.49 3.166-1.18 3.166-1.18.63 1.587.235 2.76.117 3.05.74.804 1.185 1.83 1.185 3.086 0 4.42-2.688 5.39-5.252 5.676.413.353.78 1.043.78 2.102 0 1.517-.014 2.74-.014 3.111 0 .309.207.666.792.553C20.212 21.412 23.5 17.094 23.5 12 23.5 5.648 18.352.5 12 .5Z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
