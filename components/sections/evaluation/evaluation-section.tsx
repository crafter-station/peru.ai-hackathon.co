"use client";

/**
 * Evaluation criteria section
 */
export default function EvaluationSection() {
  const criteria = [
    {
      title: "Innovation & Impact",
      description: "¿Resuelve un problema real de forma diferente?",
      percentage: "35%",
    },
    {
      title: "Technical Execution",
      description: "Código limpio, demo reproducible y excelencia técnica",
      percentage: "30%",
    },
    {
      title: "Viability",
      description: "¿Puede esto convertirse en un producto?",
      percentage: "20%",
    },
    {
      title: "Pitch & UX",
      description: "Mensaje claro y efectivo. ¿Vende?",
      percentage: "15%",
    },
  ];

  return (
    <section className="bg-muted/20 border-t py-6 md:py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-2">
          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight uppercase">
            CRITERIOS DE EVALUACIÓN
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
            Cómo evaluamos los proyectos para seleccionar a los ganadores
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Se asigna un{" "}
              <span className="font-medium text-foreground">
                puntaje del 1 al 5
              </span>{" "}
              para cada criterio y se calcula un promedio ponderado para cada
              equipo.
            </p>
          </div>

          {/* Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criteria.map((criterion, index) => (
              <div key={index} className="text-center">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-brand-red text-white text-xs font-bold rounded-full">
                    {criterion.percentage}
                  </span>
                </div>
                <h3 className="font-medium mb-1">{criterion.title}</h3>
                <p className="text-muted-foreground text-xs">
                  {criterion.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
