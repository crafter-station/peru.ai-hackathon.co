"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "¿Cuándo y dónde será el hackathon?",
    answer:
      "El IA Hackathon Peru se realizará los días 29 y 30 de noviembre de 2025 en Lima, Perú. La ubicación exacta será confirmada próximamente.",
  },
  {
    question: "¿Quién puede participar?",
    answer:
      "El hackathon está abierto a estudiantes, profesionales, desarrolladores, diseñadores y cualquier persona interesada en inteligencia artificial e innovación tecnológica.",
  },
  {
    question: "¿Necesito experiencia previa en IA?",
    answer:
      "No es necesario ser un experto en IA. Buscamos equipos diversos con diferentes habilidades: programación, diseño, negocios, y personas con ganas de aprender y crear.",
  },
  {
    question: "¿Cuál es el costo de participación?",
    answer:
      "La participación es gratuita. Incluye comidas, bebidas, espacio de trabajo y acceso a mentores durante las 48 horas del evento.",
  },
  {
    question: "¿Puedo participar solo o necesito un equipo?",
    answer:
      "Puedes registrarte individualmente y formar equipo el día del evento, o puedes venir con tu equipo ya formado. Los equipos pueden tener entre 2-5 miembros.",
  },
  {
    question: "¿Qué tipo de proyectos se pueden desarrollar?",
    answer:
      "Cualquier proyecto que utilice inteligencia artificial para resolver problemas reales. Puede ser una aplicación, un sistema, un algoritmo, o cualquier solución innovadora.",
  },
  {
    question: "¿Habrá mentores disponibles?",
    answer:
      "Sí, contaremos con mentores expertos en IA, desarrollo, diseño y negocios que estarán disponibles durante todo el evento para guiar a los equipos.",
  },
  {
    question: "¿Qué premios habrá?",
    answer:
      "Los detalles de los premios se anunciarán próximamente. Habrá reconocimientos para las mejores soluciones en diferentes categorías.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="min-h-screen py-20 px-4 md:px-8 bg-muted/30 dither-bg"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las dudas más comunes sobre el hackathon
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-card rounded-lg shadow-sm border">
          <Accordion type="single" collapsible className="p-6">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b-0 mb-4 last:mb-0"
              >
                <AccordionTrigger className="text-left hover:text-brand-red transition-colors duration-200 py-4 px-0 [&[data-state=open]]:text-brand-red">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            ¿Tienes más preguntas? ¡Únete a nuestro grupo de WhatsApp!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-brand-red text-white font-semibold hover:bg-brand-red/90 transition-colors duration-300"
          >
            <a
              href="https://chat.whatsapp.com/H6RV2cFfL47CCXVzVmHedR?mode=ems_share_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
              </svg>
              Únete al Grupo de WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
