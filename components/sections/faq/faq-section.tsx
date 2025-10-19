"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * FAQ section with frequently asked questions
 */
export default function FAQSection() {
  const faqs = [
    {
      question: "¿Cómo puedo inscribir mi equipo?",
      answer:
        "Las inscripciones son individuales. Todas las personas del equipo deben aplicar para participar por separado llenando el formulario de registro.",
    },
    {
      question: "¿Qué premios hay?",
      answer:
        "Los premios los estaremos anunciando en los próximos días. Mantente atento a nuestras redes sociales para conocer todos los detalles.",
    },
    {
      question: "¿Hay algún costo de participación?",
      answer:
        "No, el evento es completamente gratis para los participantes. Solo necesitas registrarte y confirmar tu asistencia.",
    },
    {
      question: "¿Cómo funcionan las inscripciones?",
      answer:
        "Primero debes aplicar para participar llenando el formulario que encuentras en la parte superior de la página. Después nuestro equipo revisará las aplicaciones e invitará a los mejores 100 participantes.",
    },
    {
      question: "¿Cómo puedo formar mi equipo?",
      answer:
        "Como participante seleccionado, es tu responsabilidad armar tu equipo. Organizaremos dinámicas y llamadas online para que se conozcan y hagan match, pero es clave que participes activamente en el grupo para crear un equipo ganador.",
    },
    {
      question: "¿Qué cosas necesito llevar?",
      answer:
        "Recuerda que esto es un evento de 24 horas. Vamos a tener comida, agua, café y todo lo que puedas necesitar, pero igual recuerda llevar ropa cómoda, tu computador y el cargador. Si quieres llevar snacks extra, dale sin problema.",
    },
    {
      question: "¿Puedo traer código ya desarrollado?",
      answer:
        "No, solo puedes traer la idea. Los jueces evaluarán únicamente el trabajo realizado durante las 24 horas del evento.",
    },
    {
      question: "¿De quién son los derechos de propiedad intelectual?",
      answer:
        "Los participantes retienen la titularidad completa de todos los derechos de propiedad intelectual sobre sus desarrollos. Ni los organizadores ni los patrocinadores del hackathon adquieren ningún derecho sobre las creaciones de los participantes. Para efectos de evaluación, se requiere que los proyectos sean de acceso público durante el evento (código, documentación y materiales). Esta visibilidad es exclusivamente para permitir la valoración del jurado y no implica transferencia alguna de derechos.",
    },
  ];

  return (
    <section className="bg-background dither-bg border-t py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px bg-brand-red/30 w-12"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              ¿TIENES DUDAS?
            </span>
            <div className="h-px bg-brand-red/30 w-12"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight uppercase">
            PREGUNTAS
            <br />
            FRECUENTES
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre el hackathon
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-red/20 via-brand-red/5 to-transparent hidden md:block"></div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent rounded-lg px-6 hover:border-white/10 transition-colors data-[state=open]:border-brand-red/30 data-[state=open]:bg-brand-red/5"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <div className="flex items-start gap-3 pr-4">
                    <span className="text-brand-red font-black text-sm min-w-[2rem]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-bold text-sm md:text-base">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pl-11 pr-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
