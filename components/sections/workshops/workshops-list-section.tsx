"use client";

function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export default function WorkshopsListSection() {
  const workshops = [
    {
      title:
        "De la idea al prototipo funcional: IA, Figma y Vibe Coding en acción",
      date: "18 de Noviembre • 19:00",
      eventId: "evt-JH2aVEI18JkBa6O",
      url: "https://luma.com/jgmm8k4t",
      recording: "https://www.youtube.com/watch?v=KvK3LSu4zfQ",
    },
    {
      title: "Expo",
      date: "21 de Noviembre • 19:00",
      eventId: "evt-fRK0BHtluFjMmGJ",
      url: "https://luma.com/a7z7af8a",
    },
    {
      title: "Cómo implementar un chatbot de atención al cliente en tu empresa, sin servidores, en AWS",
      date: "23 de Noviembre • 19:00",
      eventId: "evt-eCHtn8JzvB54Siu",
      url: "https://luma.com/afar70gw",
      recording: "https://www.youtube.com/watch?v=gUCBvjm4wII",
    },
    {
      title: "Lovable",
      date: "24 de Noviembre • 10:00",
      eventId: "evt-bKIYraV1WFuAtat",
      url: "https://luma.com/ajzg8pzg",
      recording: "https://www.youtube.com/watch?v=ZDgkSYpo5yI",
    },
    {
      title: "Serverless para el despliegue de tus prototipos",
      date: "24 de Noviembre • 19:00",
      eventId: "evt-4P2LUnbPJgMgJBc",
      url: "https://luma.com/oqb5jxtk",
    },
    {
      title:
        "Métele más diseño: Herramientas para vibecodear sin sacrificar diseño",
      date: "25 de Noviembre • 18:00",
      eventId: "evt-rgjgXaPshpMCQQc",
      url: "https://luma.com/7nu0wxau",
    },
    {
      title: "Add auth to your app in seconds with Clerk",
      date: "25 de Noviembre • 19:00",
      eventId: "evt-D2X1QLuzb8zz3LG",
      url: "https://luma.com/2dcxn97v",
    },
    {
      title:
        "De la idea al impacto: cómo construir productos de IA que la gente realmente use",
      date: "26 de Noviembre • 19:00",
      eventId: "evt-GLmGu1OMFy4C88k",
      url: "https://luma.com/8gixx4h6",
    },
    {
      title: "De idea a Demo",
      date: "27 de Noviembre • 18:00",
      eventId: "evt-JE3YbK7fVuPwnoh",
      url: "https://luma.com/5vt6xzqu",
    },
    {
      title: "Build MCP's in minutes with Vercel AI SDK and Lupa",
      date: "27 de Noviembre • 19:00",
      eventId: "evt-RNCH2399KcMOt4r",
      url: "https://luma.com/w638p0cx",
    },
    {
      title: "Creando un unicornio",
      date: "28 de Noviembre • 18:00",
      eventId: "evt-aw4mxgcSkgAcUNp",
      url: "https://luma.com/6fw39vpj",
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
                    <p className="text-muted-foreground text-sm">
                      {workshop.date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Show recording if available, otherwise show Luma embed */}
              {workshop.recording ? (
                <div className="w-full relative overflow-hidden rounded-sm" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(workshop.recording)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Grabación: ${workshop.title}`}
                  ></iframe>
                </div>
              ) : (
                <div className="w-full relative overflow-hidden h-[800px] md:h-[460px]">
                  <div
                    className="w-full h-full"
                    style={{
                      transform: "scale(1.1) translateY(40px)",
                      transformOrigin: "center center",
                    }}
                  >
                    <iframe
                      className="w-full h-[800px] md:h-[460px]"
                      src={`https://lu.ma/embed/event/${workshop.eventId}/simple`}
                      frameBorder="0"
                      allow="fullscreen; payment"
                      aria-hidden="true"
                      tabIndex={-1}
                      style={{
                        backgroundColor: "rgb(0, 0, 0)",
                      }}
                    ></iframe>
                  </div>
                  <div
                    onClick={() =>
                      window.open(workshop.url, "_blank", "noopener,noreferrer")
                    }
                    className="absolute inset-0 w-full h-full cursor-pointer z-10 bg-transparent hover:bg-black/5 transition-colors"
                    role="button"
                    tabIndex={0}
                    aria-label={`Abrir evento: ${workshop.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        window.open(
                          workshop.url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    }}
                  />
                </div>
              )}
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
            Después de completar los workshops, estarás listo para participar en
            el hackathon
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
