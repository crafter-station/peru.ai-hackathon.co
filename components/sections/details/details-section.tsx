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
			title: "UPCH La Molina",
			subtitle: "Jirón José Antonio 310, Lima",
			badge: "Ubicación",
			colSpan: "md:col-span-7",
			gradient: "from-brand-red/5",
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
			title: "24h",
			subtitle: "Debes permanecer en las instalaciones durante todo el evento",
			badge: "Duración",
			colSpan: "md:col-span-5",
			gradient: "from-red-500/5",
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
			title: "29-30 Nov",
			subtitle: "De 8am (29 Nov) a 1pm (30 Nov)",
			badge: "Fechas",
			colSpan: "md:col-span-5",
			gradient: "from-brand-red/5",
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
			title: "120",
			subtitle: "Evento presencial. Solo invitados con formulario completado",
			badge: "Capacidad",
			colSpan: "md:col-span-7",
			gradient: "from-red-500/5",
			titleExtra: (
				<span className="text-xl text-muted-foreground ml-2 font-normal">
					participantes
				</span>
			),
		},
	];

	return (
		<section className="bg-background dither-bg border-t min-h-screen px-4 md:px-6 relative overflow-hidden flex items-center">
			{/* Decorative background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/3 -left-32 w-64 h-64 bg-brand-red/3 blur-3xl" />
				<div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-brand-red/3 blur-3xl" />
			</div>

			<div className="max-w-7xl mx-auto relative z-10 w-full py-12 md:py-20">
				{/* Section Title */}
				<div className="text-center mb-12 md:mb-16">
					<div className="inline-flex items-center gap-3 mb-6">
						<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
						<span className="text-brand-red text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
							IA HACKATHON PERÚ 2025
						</span>
						<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
					</div>
					<h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase text-white">
						Información Esencial
					</h2>
				</div>

				{/* Details Grid */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
					{details.map((detail, index) => (
						<div
							key={index}
							className={`${detail.colSpan} group relative overflow-hidden bg-gradient-to-br from-background/90 to-background/50 border-2 border-foreground/10 backdrop-blur-sm p-6 md:p-8 hover:border-brand-red/30 transition-all duration-500`}
						>
							<div
								className={`absolute inset-0 bg-gradient-to-br ${detail.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
							/>
							<div className="relative z-10">
								<div className="flex items-start justify-between mb-6 md:mb-8">
									<span className="text-xs font-mono tracking-widest text-brand-red/60 uppercase">
										{detail.badge}
									</span>
									<div className="w-10 h-10 md:w-12 md:h-12 bg-brand-red/10 border-2 border-brand-red/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
										<div className="text-brand-red">{detail.icon}</div>
									</div>
								</div>
								<h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tight">
									{detail.badge === "Ubicación" ? (
										<span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
											{detail.title}
										</span>
									) : (
										<>
											<span className="text-white">{detail.title}</span>
											{detail.titleExtra}
										</>
									)}
								</h3>
								<p className="text-muted-foreground text-sm md:text-base leading-relaxed">
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
