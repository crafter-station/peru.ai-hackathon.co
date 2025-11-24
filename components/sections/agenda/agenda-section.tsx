"use client";

import CalendarIcon from "@/components/icons/calendar-icon";
import TrophyIcon from "@/components/icons/trophy-icon";

interface AgendaItem {
	time: string;
	title: string;
	description: string;
	duration?: string;
	highlighted?: boolean;
}

interface AgendaDay {
	dayLabel: string;
	dayNumber: string;
	icon: "calendar" | "trophy";
	items: AgendaItem[];
}

interface AgendaConfig {
	title: string;
	dateRange: string;
	days: AgendaDay[];
}

const defaultAgendaConfig: AgendaConfig = {
	title: "Agenda",
	dateRange: "29-30 NOV 2025",
	days: [
		{
			dayLabel: "Día 1",
			dayNumber: "Sábado 29",
			icon: "calendar",
			items: [
				{
					time: "8:00",
					title: "Check-in",
					description: "Registro y bienvenida de participantes",
					duration: "Duración: 1 hora",
				},
				{
					time: "9:00",
					title: "Conoce a los Patrocinadores",
					description: "Presentación de sponsors",
					duration: "Duración: 1 hora",
				},
				{
					time: "10:30",
					title: "Inicio de la Hackathon",
					description: "¡Empieza el cronómetro!",
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
			],
		},
		{
			dayLabel: "Día 2",
			dayNumber: "Domingo 30",
			icon: "trophy",
			items: [
				{
					time: "7:00",
					title: "Desayuno",
					description:
						"Un último impulso de energía para darlo todo en estas horas finales",
				},
				{
					time: "8:30",
					title: "Cierre de Entregas",
					description: "Deadline final para subir proyectos",
					highlighted: true,
				},
				{
					time: "11:00",
					title: "Demos",
					description: "Presentación de proyectos finalistas",
					duration: "Duración: 1 hora",
				},
				{
					time: "12:00",
					title: "Anuncio de Ganadores",
					description: "Premiación y cierre del evento",
					duration: "Duración: 30 min",
					highlighted: true,
				},
			],
		},
	],
};

interface AgendaSectionProps {
	config?: AgendaConfig;
}

export default function AgendaSection({
	config = defaultAgendaConfig,
}: AgendaSectionProps) {
	return (
		<section className="bg-background dither-bg border-t min-h-screen px-4 md:px-6 relative overflow-hidden flex items-center">
			<div className="max-w-7xl mx-auto relative z-10 w-full py-12 md:py-20">
				{/* Section Title */}
				<div className="text-center mb-12 md:mb-16">
					<div className="inline-flex items-center gap-3 mb-6">
						<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
						<span className="text-brand-red text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
							{config.dateRange}
						</span>
						<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
					</div>
					<h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase text-white">
						{config.title}
					</h2>
				</div>

				{/* Schedule Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{config.days.map((day, dayIndex) => {
						const Icon = day.icon === "calendar" ? CalendarIcon : TrophyIcon;

						return (
							<div key={dayIndex} className="space-y-6">
								<div className="flex items-center gap-4 mb-8">
									<div className="w-12 h-12 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center flex-shrink-0">
										<Icon className="w-6 h-6 text-red-400" />
									</div>
									<div className="flex-1">
										<p className="text-xs font-mono tracking-widest text-red-500/60 uppercase">
											{day.dayLabel}
										</p>
										<h3 className="text-3xl font-bold text-white">
											{day.dayNumber}
										</h3>
									</div>
								</div>

								<div className="space-y-3">
									{day.items.map((item, itemIndex) => {
										const isHighlighted = item.highlighted;
										const hasDuration = item.duration;

										return (
											<div
												key={itemIndex}
												className={`group relative overflow-hidden backdrop-blur-sm p-4 transition-all duration-300 ${
													isHighlighted
														? "bg-gradient-to-br from-red-950/20 to-zinc-900/30 border-2 border-red-500/30 hover:border-red-500/50"
														: "bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 hover:border-red-500/30"
												}`}
											>
												<div
													className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
														isHighlighted
															? "from-red-500/10 to-transparent"
															: "from-red-500/5 to-transparent"
													}`}
												/>
												<div className="relative z-10 flex items-start gap-3">
													<div className="flex-shrink-0 w-14">
														<span
															className={`text-base font-mono text-red-400 whitespace-nowrap ${
																isHighlighted ? "font-bold" : ""
															}`}
														>
															{item.time}
														</span>
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-white font-mono font-medium leading-relaxed text-base mb-0.5 uppercase">
															{item.title}
															{hasDuration && item.duration && (
																<span className="text-xs text-red-400/80 ml-2 normal-case">
																	({item.duration.replace(/Duración:\s*/i, "")})
																</span>
															)}
														</p>
														<p className="text-zinc-400 text-sm">
															{item.description}
														</p>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
