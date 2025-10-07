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
      title: "PERÚ - LIMA",
      subtitle: "Ubicación",
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
      subtitle: "Duración",
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
      subtitle: "Fecha",
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
      title: "100 PARTICIPANTES",
      subtitle: "Presenciales",
    },
  ];

  return (
    <section className="bg-background dither-bg border-t py-6 md:py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px bg-brand-red/30 w-8"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              IA HACKATHON PERÚ 2025
            </span>
            <div className="h-px bg-brand-red/30 w-8"></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight uppercase">
            INFORMACIÓN ESENCIAL
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            Descubre información clave de la mejor competencia de tecnología de
            Perú.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {details.map((detail, index) => (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className="flex justify-center mb-2 md:mb-3">
                <div className="p-1.5 md:p-2 text-brand-red">{detail.icon}</div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-sm md:text-lg font-bold mb-0.5 md:mb-1 tracking-wide">
                  {detail.title}
                </h3>
                <p className="text-muted-foreground text-xs">
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
