"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function FooterSection() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-background dither-bg border-t py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Image 
                src="/IA_HACK_BRAND.svg" 
                alt="IA HACKATHON" 
                width={200}
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              El evento de inteligencia artificial más importante del Perú. 
              Únete a nosotros para 24 horas de innovación y tecnología.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Image 
                src="/PE_FLAG.svg" 
                alt="Perú" 
                width={24}
                height={16}
                className="w-6 h-4"
              />
              <span className="text-sm text-muted-foreground">Lima, Perú</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('hero')}
                  className="text-muted-foreground hover:text-brand-red transition-colors duration-200 justify-start p-0 h-auto font-normal"
                >
                  Inicio
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('details')}
                  className="text-muted-foreground hover:text-brand-red transition-colors duration-200 justify-start p-0 h-auto font-normal"
                >
                  Detalles
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('faq')}
                  className="text-muted-foreground hover:text-brand-red transition-colors duration-200 justify-start p-0 h-auto font-normal"
                >
                  FAQ
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('judges')}
                  className="text-muted-foreground hover:text-brand-red transition-colors duration-200 justify-start p-0 h-auto font-normal"
                >
                  Jurado
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('sponsors')}
                  className="text-muted-foreground hover:text-brand-red transition-colors duration-200 justify-start p-0 h-auto font-normal"
                >
                  Patrocinadores
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <div className="space-y-3">
              <a 
                href="https://chat.whatsapp.com/H6RV2cFfL47CCXVzVmHedR?mode=ems_share_t"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                </svg>
                WhatsApp Group
              </a>
              <a 
                href="https://github.com/crafter-station/peru.ai-hackathon.co"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                title="Ver repositorio en GitHub"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.098 3.292 9.418 7.868 10.944.575.104.786-.25.786-.556 0-.274-.01-1-.016-1.964-3.2.695-3.878-1.543-3.878-1.543-.523-1.33-1.277-1.684-1.277-1.684-1.044-.714.079-.699.079-.699 1.154.081 1.763 1.186 1.763 1.186 1.027 1.76 2.695 1.252 3.352.957.104-.744.402-1.253.73-1.541-2.555-.291-5.237-1.278-5.237-5.686 0-1.256.45-2.282 1.186-3.086-.119-.29-.514-1.463.113-3.05 0 0 .967-.309 3.17 1.18a11.01 11.01 0 0 1 2.886-.388c.979.005 1.964.132 2.886.388 2.201-1.49 3.166-1.18 3.166-1.18.63 1.587.235 2.76.117 3.05.74.804 1.185 1.83 1.185 3.086 0 4.42-2.688 5.39-5.252 5.676.413.353.78 1.043.78 2.102 0 1.517-.014 2.74-.014 3.111 0 .309.207.666.792.553C20.212 21.412 23.5 17.094 23.5 12 23.5 5.648 18.352.5 12 .5Z" />
                </svg>
                Repositorio GitHub
              </a>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Fechas del Evento</p>
                <p>29 - 30 Noviembre 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizers */}
        <div className="border-t pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Organizado por</p>
              <a 
                href="https://hackathon.lat/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity duration-200"
              >
                <Image 
                  src="/BY_THC.svg" 
                  alt="The Hackathon Company" 
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </a>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">En alianza con</p>
              <a 
                href="https://makers.ngo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity duration-200"
              >
                <Image 
                  src="/In_partnership_with_ MAKERS.svg" 
                  alt="MAKERS" 
                  width={140}
                  height={32}
                  className="h-6 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 IA Hackathon Peru. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
