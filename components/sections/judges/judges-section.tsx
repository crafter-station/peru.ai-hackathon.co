"use client";

import Image from "next/image";

export default function JudgesSection() {
  const judges = [
    {
      name: "Adrian Mastronardi",
      image: "/adrian-mastronardi.png",
      title: "CTO at Habi",
      linkedin: "https://www.linkedin.com/in/amastronardi/",
    },
    {
      name: "Martin Pelaez",
      image: "/martinpelaez.png",
      title: "CTO & Co-founder at Finity",
      linkedin: "https://www.linkedin.com/in/martinpelaez/",
    },
    {
      name: "Piero Sifuentes",
      image: "/piero-sifuentes.png",
      title: "Co-founder & CTO at Hapi",
      linkedin: "https://www.linkedin.com/in/pierosifuentes",
    },
    {
      name: "Sebastian Ruiz",
      image: "/sebastian-ruiz.png",
      title: "Program Lead at UTech Ventures",
      linkedin: "https://www.linkedin.com/in/sruizdecastillam/",
    },
    {
      name: "Ariana Orué Medina",
      image: "/ariana.png",
      title: "Congresista del Perú",
      linkedin: "https://www.linkedin.com/in/arianaoruem/",
    },
  ];

  return (
    <section className="bg-background dither-bg border-t py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="relative mb-6">
          {/* Background decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-32 h-32 bg-brand-red rounded-full blur-3xl"></div>
          </div>

          {/* Title with red accents */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px bg-brand-red w-12 md:w-24"></div>
              <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
                Nuestro Panel
              </span>
              <div className="h-px bg-brand-red w-12 md:w-24"></div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-1 uppercase tracking-tight">
              JUECES
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Expertos de talla mundial nos acompañan en esta edición
            </p>
          </div>
        </div>

        {/* Judges Grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
          {judges.map((judge, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center w-32 md:w-36"
            >
              {/* Judge Photo with Red Glow */}
              <div className="relative mb-4">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-red to-brand-red/50 rounded-full opacity-20 group-hover:opacity-40 blur-sm transition-opacity"></div>
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-brand-red/30 group-hover:border-brand-red/60 transition-colors">
                  <Image
                    src={judge.image}
                    alt={judge.name}
                    fill
                    className="object-contain"
                    quality={90}
                  />
                </div>
              </div>

              <h3 className="font-bold text-xs md:text-sm mb-1 leading-tight">
                {judge.name}
              </h3>
              <p className="text-muted-foreground text-xs mb-2 leading-tight">
                {judge.title}
              </p>

              <a
                href={judge.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn de ${judge.name}`}
              >
                <svg
                  className="w-4 h-4 text-brand-red hover:text-brand-red/80 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
