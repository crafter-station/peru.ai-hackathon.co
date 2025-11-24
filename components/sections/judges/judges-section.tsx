"use client";

import Image from "next/image";

interface Judge {
  name: string;
  image: string;
  title: string;
  linkedin: string;
  featured?: boolean;
}

const judgesData: Judge[] = [
  {
    name: "Adrian Mastronardi",
    image: "/adrian-mastronardi.png",
    title: "CTO at Habi",
    linkedin: "https://www.linkedin.com/in/amastronardi/",
    featured: true,
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
    featured: true,
  },
  {
    name: "Sebastian Ruiz",
    image: "/sebastian-ruiz.png",
    title: "Program Lead at UTEC Ventures",
    linkedin: "https://www.linkedin.com/in/sruizdecastillam/",
  },
  {
    name: "Ariana Orué Medina",
    image: "/ariana.png",
    title: "Congresista del Perú",
    linkedin: "https://www.linkedin.com/in/arianaoruem/",
  },
];

export default function JudgesSection() {
  const judges = judgesData;

  return (
    <section className="bg-background dither-bg border-t min-h-screen px-4 md:px-6 relative overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto relative z-10 w-full py-12 md:py-20">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
            <span className="text-brand-red text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
              Nuestro Panel
            </span>
            <div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase text-white">
            Jueces
          </h2>
        </div>

        {/* Judges Grid - Single Row Staggered Layout for Portrait Images */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto">
          {judges.map((judge, index) => {
            const isFeatured = judge.featured;

            // Stagger cards alternately for visual interest
            const isStaggered = index % 2 === 1;

            return (
              <div
                key={index}
                className={`group relative overflow-hidden backdrop-blur-sm transition-all duration-300 aspect-[3/5] ${
                  isStaggered ? "lg:mt-16" : ""
                } ${
                  isFeatured
                    ? "bg-gradient-to-br from-red-950/20 to-zinc-900/30 border-2 border-red-500/30 hover:border-red-500/50"
                    : "bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 hover:border-red-500/30"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isFeatured
                      ? "from-red-500/10 to-transparent"
                      : "from-red-500/5 to-transparent"
                  }`}
                />

                {/* Image container */}
                <div className="relative h-full w-full">
                  <div className="relative h-full overflow-hidden">
                    <Image
                      src={judge.image}
                      alt={judge.name}
                      fill
                      className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent"></div>
                  </div>

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-1 leading-tight uppercase font-mono">
                      {judge.name}
                    </h3>
                    <p className="text-zinc-400 text-xs md:text-sm mb-3 leading-tight line-clamp-2">
                      {judge.title}
                    </p>

                    <a
                      href={judge.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn de ${judge.name}`}
                      className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-xs font-mono uppercase"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span className="hidden md:inline">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
