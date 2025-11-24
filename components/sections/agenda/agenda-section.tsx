"use client";

export default function AgendaSection() {
  const agenda = [
    {
      day: "Sábado 29 Nov",
      events: [
        {
          time: "8:00 - 9:00",
          title: "Check-in",
          desc: "Registro y bienvenida de participantes",
        },
        {
          time: "9:00 - 10:00",
          title: "Conoce a los Patrocinadores",
          desc: "Presentación de sponsors",
        },
        {
          time: "10:30",
          title: "Inicio de la Hackathon",
          desc: "Empieza el cronometro!",
        },
        {
          time: "14:00",
          title: "Almuerzo",
          desc: "Recargamos energías para que las ideas sigan fluyendo",
        },
        {
          time: "19:00",
          title: "Cena",
          desc: "Un respiro merecido para seguir construyendo",
        },
      ],
    },
    {
      day: "Domingo 30 Nov",
      events: [
        {
          time: "7:00",
          title: "Desayuno",
          desc: "Un último impulso de energía para darlo todo en estas horas finales",
        },
        {
          time: "8:30",
          title: "Cierre de Entregas",
          desc: "Deadline final para subir proyectos",
        },
        {
          time: "11:00 - 12:00",
          title: "Demos",
          desc: "Presentación de proyectos finalistas",
        },
        {
          time: "12:00 - 12:30",
          title: "Anuncio de Ganadores",
          desc: "Premiación y cierre del evento",
        },
      ],
    },
  ];

  return (
    <section className="bg-background dither-bg border-t py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px bg-brand-red/30 w-12"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              CRONOGRAMA
            </span>
            <div className="h-px bg-brand-red/30 w-12"></div>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight uppercase">
            AGENDA
          </h2>
        </div>

        {/* Agenda Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {agenda.map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-4">
              {/* Day Header */}
              <div className="text-center pb-3 border-b-2 border-brand-red/20">
                <h3 className="text-lg md:text-xl font-black uppercase">
                  {day.day}
                </h3>
              </div>

              {/* Events */}
              <div className="space-y-3">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="group relative">
                    <div className="flex gap-3 items-start">
                      {/* Time Badge */}
                      <div className="flex-shrink-0 mt-0.5">
                        <span className="inline-block px-2 py-1 bg-brand-red/10 text-brand-red text-xs font-black rounded">
                          {event.time}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm md:text-base font-black mb-0.5 leading-tight">
                          {event.title}
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                          {event.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
