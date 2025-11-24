"use client";

import CalendarIcon from "@/components/icons/calendar-icon";
import TrophyIcon from "@/components/icons/trophy-icon";

interface ScheduleEvent {
	time: string;
	title: string;
	description?: string;
	emoji?: string;
	highlighted?: boolean;
}

export default function AgendaSection() {
	const saturdayEvents: ScheduleEvent[] = [
		{
			time: "8:00 - 9:00",
			title: "Check-in",
			description: "Registro y bienvenida de participantes",
			emoji: "🎯",
			highlighted: true,
		},
		{
			time: "9:00 - 10:00",
			title: "Conoce a los Patrocinadores",
			description: "Presentación de sponsors",
		},
		{
			time: "10:30",
			title: "Inicio de la Hackathon",
			description: "¡Empieza el cronómetro!",
			emoji: "🚀",
			highlighted: true,
		},
		{
			time: "14:00",
			title: "Almuerzo",
			description: "Recargamos energías para que las ideas sigan fluyendo",
		},
		{
			time: "19:00",
			title: "Cena",
			description: "Un respiro merecido para seguir construyendo",
		},
	];

	const sundayEvents: ScheduleEvent[] = [
		{
			time: "7:00",
			title: "Desayuno",
			description: "Un último impulso de energía para darlo todo",
		},
		{
			time: "8:30",
			title: "Cierre de Entregas",
			description: "Deadline final para subir proyectos",
			emoji: "🏁",
			highlighted: true,
		},
		{
			time: "11:00 - 12:00",
			title: "Demos",
			description: "Presentación de proyectos finalistas",
			emoji: "🎤",
			highlighted: true,
		},
		{
			time: "12:00 - 12:30",
			title: "Anuncio de Ganadores",
			description: "Premiación y cierre del evento",
			emoji: "🏆",
			highlighted: true,
		},
	];

	return (
		<section className="bg-background dither-bg border-t min-h-screen px-4 md:px-6 relative overflow-hidden flex items-center">
			<div className="max-w-7xl mx-auto relative z-10 w-full py-12 md:py-20">
				{/* Section Title */}
				<div className="text-center mb-12 md:mb-16">
					<div className="inline-flex items-center gap-3 mb-6">
						<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
						<span className="text-brand-red text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
							29-30 NOV 2025
						</span>
						<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
					</div>
					<h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase text-white">
						Agenda
					</h2>
				</div>

				{/* Schedule Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Saturday Schedule */}
					<div className="space-y-6">
						<div className="flex items-center gap-4 mb-8">
							<div className="w-12 h-12 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center flex-shrink-0">
								<CalendarIcon className="w-6 h-6 text-red-400" />
							</div>
							<div className="flex-1">
								<p className="text-xs font-mono tracking-widest text-red-500/60 uppercase">
									Día 1
								</p>
								<h3 className="text-3xl font-bold text-white">Sábado 29</h3>
							</div>
						</div>

						<div className="space-y-3">
							{/* Time slots */}
							<div className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-4 hover:border-red-500/30 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 whitespace-nowrap">
											8:00
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Check-in
										</p>
										<p className="text-zinc-400 text-sm mb-1.5">
											Registro y bienvenida de participantes
										</p>
										<span className="inline-block text-sm font-mono text-red-400/80 uppercase tracking-wider">
											Duración: 1 hora
										</span>
									</div>
								</div>
							</div>

							<div className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-4 hover:border-red-500/30 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 whitespace-nowrap">
											9:00
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Conoce a los Patrocinadores
										</p>
										<p className="text-zinc-400 text-sm mb-1.5">
											Presentación de sponsors
										</p>
										<span className="inline-block text-sm font-mono text-red-400/80 uppercase tracking-wider">
											Duración: 1 hora
										</span>
									</div>
								</div>
							</div>

							<div className="group relative overflow-hidden bg-gradient-to-br from-red-950/20 to-zinc-900/30 border-2 border-red-500/30 backdrop-blur-sm p-4 hover:border-red-500/50 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 font-bold whitespace-nowrap">
											10:30
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Inicio de la Hackathon
										</p>
										<p className="text-zinc-400 text-xs">
											¡Empieza el cronómetro!
										</p>
									</div>
								</div>
							</div>

							<div className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-4 hover:border-red-500/30 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 whitespace-nowrap">
											14:00
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Almuerzo
										</p>
										<p className="text-zinc-400 text-xs">
											Recargamos energías para que las ideas sigan fluyendo
										</p>
									</div>
								</div>
							</div>

							<div className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-4 hover:border-red-500/30 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 whitespace-nowrap">
											19:00
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Cena
										</p>
										<p className="text-zinc-400 text-xs">
											Un respiro merecido para seguir construyendo
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Sunday Schedule */}
					<div className="space-y-6">
						<div className="flex items-center gap-4 mb-8">
							<div className="w-12 h-12 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center flex-shrink-0">
								<TrophyIcon className="w-6 h-6 text-red-400" />
							</div>
							<div className="flex-1">
								<p className="text-xs font-mono tracking-widest text-red-500/60 uppercase">
									Día 2
								</p>
								<h3 className="text-3xl font-bold text-white">Domingo 30</h3>
							</div>
						</div>

						<div className="space-y-3">
							<div className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-4 hover:border-red-500/30 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 whitespace-nowrap">
											7:00
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Desayuno
										</p>
										<p className="text-zinc-400 text-xs">
											Un último impulso de energía para darlo todo en estas
											horas finales
										</p>
									</div>
								</div>
							</div>

							<div className="group relative overflow-hidden bg-gradient-to-br from-red-950/20 to-zinc-900/30 border-2 border-red-500/30 backdrop-blur-sm p-4 hover:border-red-400/50 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 font-bold whitespace-nowrap">
											8:30
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Cierre de Entregas
										</p>
										<p className="text-zinc-400 text-xs">
											Deadline final para subir proyectos
										</p>
									</div>
								</div>
							</div>

							<div className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-4 hover:border-red-500/30 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 whitespace-nowrap">
											11:00
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Demos
										</p>
										<p className="text-zinc-400 text-sm mb-1.5">
											Presentación de proyectos finalistas
										</p>
										<span className="inline-block text-sm font-mono text-red-400/80 uppercase tracking-wider">
											Duración: 1 hora
										</span>
									</div>
								</div>
							</div>

							<div className="group relative overflow-hidden bg-gradient-to-br from-red-950/20 to-zinc-900/30 border-2 border-red-500/30 backdrop-blur-sm p-4 hover:border-red-400/50 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10 flex items-start gap-3">
									<div className="flex-shrink-0 w-14">
										<span className="text-base font-mono text-red-400 font-bold whitespace-nowrap">
											12:00
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium leading-relaxed text-base mb-0.5 uppercase">
											Anuncio de Ganadores
										</p>
										<p className="text-zinc-400 text-sm mb-1.5">
											Premiación y cierre del evento
										</p>
										<span className="inline-block text-sm font-mono text-red-400/80 uppercase tracking-wider">
											Duración: 30 min
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
