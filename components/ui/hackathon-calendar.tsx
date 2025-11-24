/**
 * Calendar component optimized for hackathon dates
 * Highlights November 29-30, 2025
 */

export default function HackathonCalendar() {
  // November 2025 calendar data
  // November starts on Saturday (day 6) and has 30 days
  const daysInMonth = 30;
  const firstDayOfMonth = 6; // Saturday (0 = Sunday, 6 = Saturday)
  const hackathonDays = [29, 30]; // Days to highlight

  const weekDays = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Calendar Header */}
      <div className="text-center mb-4">
        <h3 className="text-2xl md:text-3xl font-black uppercase mb-1">
          Noviembre 2025
        </h3>
        <p className="text-sm text-muted-foreground font-mono">
          Marca tu calendario
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="border-2 border-foreground bg-background p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-black text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isHackathonDay = day && hackathonDays.includes(day);
            const isSaturday = day === 29;

            return (
              <div
                key={index}
                className={`
                  aspect-square flex items-center justify-center text-sm md:text-base font-black
                  ${
                    day === null
                      ? "invisible"
                      : isHackathonDay
                        ? "bg-brand-red text-background border-2 border-background scale-110 z-10 relative"
                        : "text-foreground/40"
                  }
                  ${isHackathonDay ? "rounded-lg" : ""}
                `}
              >
                {day !== null && (
                  <div className="flex flex-col items-center justify-center">
                    <span>{day}</span>
                    {isHackathonDay && (
                      <span className="text-[8px] uppercase font-bold mt-0.5">
                        {isSaturday ? "Día 1" : "Día 2"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-brand-red border border-foreground rounded" />
          <span className="font-mono">Días del Hackathon</span>
        </div>
      </div>
    </div>
  );
}
