"use client";

/**
 * Details section with key hackathon information
 */
export default function DetailsSection() {
  const details = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "UPCH LA MOLINA",
      subtitle: "Jirón José Antonio 310, Lima",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "24 HORAS",
      subtitle: "Debes permanecer en las instalaciones durante todo el evento",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "29-30 DE NOV",
      subtitle: "De 8am (29 Nov) a 1pm (30 Nov)",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "120 PARTICIPANTES",
      subtitle: "Evento presencial. Solo invitados con formulario completado",
    },
  ];

  return (
    <section className="bg-background dither-bg border-t py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px bg-brand-red/30 w-12"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              IA HACKATHON PERÚ 2025
            </span>
            <div className="h-px bg-brand-red/30 w-12"></div>
          </div>
          <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight leading-tight uppercase">
            INFORMACIÓN ESENCIAL
          </h2>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex md:block gap-4 items-start border-l-2 md:border-l-0 border-brand-red/30 md:border-0 pl-4 md:pl-0 py-2 md:py-0 md:text-center"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1 md:mt-0 md:flex md:justify-center md:mb-3">
                <div className="text-brand-red">{detail.icon}</div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-black mb-2 tracking-wide uppercase">
                  {detail.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-[280px] md:max-w-xs mx-auto md:mx-auto">
                  {detail.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
