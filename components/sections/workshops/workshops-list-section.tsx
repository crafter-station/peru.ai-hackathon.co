"use client";

export default function WorkshopsListSection() {
  const workshops = [
    {
      title: "De la idea al prototipo funcional: IA, Figma y Vibe Coding en acción",
      date: "19 de Noviembre • 19:00",
      eventId: "evt-JH2aVEI18JkBa6O",
    },
    {
      title: "Lovable",
      date: "24 de Noviembre • 10:00",
      eventId: "evt-bKIYraV1WFuAtat",
    },
    {
      title: "Serverless para el despliegue de tus prototipos",
      date: "24 de Noviembre • 19:00",
      eventId: "evt-4P2LUnbPJgMgJBc",
    },
    {
      title: "Add auth to your app in seconds with Clerk",
      date: "25 de Noviembre • 19:00",
      eventId: "evt-D2X1QLuzb8zz3LG",
    },
    {
      title: "De la idea al impacto: cómo construir productos de IA que la gente realmente use",
      date: "26 de Noviembre • 19:00",
      eventId: "evt-GLmGu1OMFy4C88k",
    },
    {
      title: "Build MCP's in minutes with Vercel AI SDK and Lupa",
      date: "27 de Noviembre • 19:00",
      eventId: "evt-RNCH2399KcMOt4r",
    },
    {
      title: "Creando un unicornio",
      date: "28 de Noviembre • 18:00",
      eventId: "evt-6fw39vpj",
    },
  ];

  return (
    <section className="bg-background dither-bg border-t py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Workshops Grid */}
        <div className="space-y-8 md:space-y-10">
          {workshops.map((workshop, index) => (
            <div key={index} className="w-full">
              {/* Workshop Info */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-brand-red/10 border border-brand-red/30 flex items-center justify-center">
                    <span className="text-brand-red font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-1 tracking-tight">
                      {workshop.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {workshop.date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Luma Embed */}
              <div className="w-full">
                <iframe
                  className="w-full h-[800px] md:h-[460px]"
                  src={`https://lu.ma/embed/event/${workshop.eventId}/simple`}
                  frameBorder="0"
                  allow="fullscreen; payment"
                  aria-hidden="false"
                  tabIndex={0}
                  style={{
                    border: "1px solid rgba(191, 203, 218, 0.2)",
                    borderRadius: "16px",
                    backgroundColor: "rgb(0, 0, 0)",
                  }}
                ></iframe>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px bg-brand-red/30 w-12"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              ¿Listo para el desafío?
            </span>
            <div className="h-px bg-brand-red/30 w-12"></div>
          </div>
          <p className="text-muted-foreground text-base mb-6 max-w-xl mx-auto">
            Después de completar los workshops, estarás listo para participar en el hackathon
          </p>
          <a
            href="https://luma.com/slqfykte"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red text-white font-bold text-base border-0 rounded-none hover:bg-brand-red/90 transition-colors uppercase tracking-wide"
          >
            <span>Inscríbete al Hackathon</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

