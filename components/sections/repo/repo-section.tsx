"use client";

import Link from "next/link";

const repoUrl = "https://github.com/crafter-station/peru.ai-hackathon.co";

const highlights = [
  {
    title: "Stack moderno",
    description: "Next.js, Tailwind CSS y componentes reutilizables para escalar el sitio del hackathon.",
  },
  {
    title: "Contribuciones abiertas",
    description: "Recibimos issues, PRs y sugerencias para mejorar la experiencia de la comunidad peruana de IA.",
  },
  {
    title: "Guía rápida",
    description: "Incluye instrucciones claras para levantar el proyecto localmente y empezar a colaborar en minutos.",
  },
];

export default function RepoSection() {
  return (
    <section id="repo" className="py-20 px-4 md:px-8 bg-background/95 border-y">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-red/80 mb-4">Código abierto</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explora el repositorio oficial
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Súmate al desarrollo del sitio del IA Hackathon Perú, reporta ideas y crea nuevas funcionalidades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {highlights.map((highlight) => (
            <div key={highlight.title} className="h-full rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-2">{highlight.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-brand-red text-white font-semibold shadow-lg transition-all duration-300 hover:bg-brand-red-dark hover:shadow-xl"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.098 3.292 9.418 7.868 10.944.575.104.786-.25.786-.556 0-.274-.01-1-.016-1.964-3.2.695-3.878-1.543-3.878-1.543-.523-1.33-1.277-1.684-1.277-1.684-1.044-.714.079-.699.079-.699 1.154.081 1.763 1.186 1.763 1.186 1.027 1.76 2.695 1.252 3.352.957.104-.744.402-1.253.73-1.541-2.555-.291-5.237-1.278-5.237-5.686 0-1.256.45-2.282 1.186-3.086-.119-.29-.514-1.463.113-3.05 0 0 .967-.309 3.17 1.18a11.01 11.01 0 0 1 2.886-.388c.979.005 1.964.132 2.886.388 2.201-1.49 3.166-1.18 3.166-1.18.63 1.587.235 2.76.117 3.05.74.804 1.185 1.83 1.185 3.086 0 4.42-2.688 5.39-5.252 5.676.413.353.78 1.043.78 2.102 0 1.517-.014 2.74-.014 3.111 0 .309.207.666.792.553C20.212 21.412 23.5 17.094 23.5 12 23.5 5.648 18.352.5 12 .5Z" />
            </svg>
            Ver repositorio en GitHub
          </Link>
          <Link
            href={`${repoUrl}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-brand-red/40 text-brand-red font-semibold shadow-md transition-all duration-300 hover:border-brand-red hover:bg-brand-red/5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M11 7h2v6h-2zm0 8h2v2h-2z" />
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8Z" />
            </svg>
            Revisar issues abiertos
          </Link>
        </div>
      </div>
    </section>
  );
}

