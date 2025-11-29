"use client";

/**
 * Evaluation criteria section
 */
export default function EvaluationSection() {
	const criteria = [
		{
			icon: "💡",
			title: "Innovation & Impact",
			percentage: "35%",
			description: "¿Resuelve un problema real de forma diferente?",
			highlighted: true,
		},
		{
			icon: "⚙️",
			title: "Technical Execution",
			percentage: "30%",
			description: "Código limpio, demo reproducible y excelencia técnica",
			highlighted: true,
		},
		{
			icon: "📈",
			title: "Viability",
			percentage: "20%",
			description: "¿Puede esto convertirse en un producto?",
			highlighted: false,
		},
		{
			icon: "🎤",
			title: "Pitch & UX",
			percentage: "15%",
			description: "Mensaje claro y efectivo. ¿Vende?",
			highlighted: false,
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
							¿CÓMO SE EVALÚA?
						</span>
						<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
					</div>
					<h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase text-white">
						Criterios de Evaluación
					</h2>
				</div>

				{/* Criteria Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{criteria.map((criterion, index) => (
						<div
							key={index}
							className={`group relative overflow-hidden ${
								criterion.highlighted
									? "bg-gradient-to-br from-red-950/20 to-zinc-900/30 border-2 border-red-500/30"
									: "bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50"
							} backdrop-blur-sm p-6 md:p-8 hover:border-red-500/50 transition-all duration-300`}
						>
							<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

							<div className="relative z-10">
								{/* Icon and Percentage */}
								<div className="flex items-start justify-between mb-6">
									<div className="w-12 h-12 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
										<span className="text-2xl">{criterion.icon}</span>
									</div>
									<div className="bg-red-500/10 border-2 border-red-500/30 px-3 py-1">
										<span className="text-xl font-black text-red-400 font-mono">
											{criterion.percentage}
										</span>
									</div>
								</div>

								{/* Title */}
								<h3 className="text-xl md:text-2xl font-black uppercase text-white mb-3 tracking-tight">
									{criterion.title}
								</h3>

								{/* Decorative line */}
								<div className="h-px w-16 bg-red-500/30 mb-4"></div>

								{/* Description */}
								<p className="text-zinc-300 text-sm md:text-base leading-relaxed">
									{criterion.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Additional Info */}
				<div className="mt-8 text-center">
					<p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
						Se asigna un puntaje del 1 al 5 para cada criterio y se calcula un
						promedio ponderado para cada equipo.
					</p>
				</div>

				{/* Evaluation Process */}
				<div className="mt-16 md:mt-20">
					<div className="text-center mb-10">
						<div className="inline-flex items-center gap-3 mb-6">
							<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
							<span className="text-brand-red text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
								¿CÓMO FUNCIONA?
							</span>
							<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
						</div>
						<h3 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-none uppercase text-white">
							Proceso de Evaluación
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-6 md:p-8 hover:border-red-500/50 transition-all duration-300">
							<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<div className="relative z-10">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-12 h-12 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
										<span className="text-2xl">📁</span>
									</div>
									<div className="bg-red-500/10 border-2 border-red-500/30 px-3 py-1">
										<span className="text-sm font-black text-red-400 font-mono uppercase">
											Paso 1
										</span>
									</div>
								</div>
								<h4 className="text-lg md:text-xl font-black uppercase text-white mb-3 tracking-tight">
									Entrega de Materiales
								</h4>
								<div className="h-px w-16 bg-red-500/30 mb-4"></div>
								<p className="text-zinc-300 text-sm md:text-base leading-relaxed">
									Al finalizar el hackathon, cada equipo deberá entregar el{" "}
									<span className="text-red-400 font-semibold">repositorio del proyecto</span> y las{" "}
									<span className="text-red-400 font-semibold">diapositivas de su presentación</span>.
								</p>
							</div>
						</div>

						<div className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-6 md:p-8 hover:border-red-500/50 transition-all duration-300">
							<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<div className="relative z-10">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-12 h-12 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
										<span className="text-2xl">🎯</span>
									</div>
									<div className="bg-red-500/10 border-2 border-red-500/30 px-3 py-1">
										<span className="text-sm font-black text-red-400 font-mono uppercase">
											Paso 2
										</span>
									</div>
								</div>
								<h4 className="text-lg md:text-xl font-black uppercase text-white mb-3 tracking-tight">
									Pitch ante Mentores
								</h4>
								<div className="h-px w-16 bg-red-500/30 mb-4"></div>
								<p className="text-zinc-300 text-sm md:text-base leading-relaxed">
									Después de la entrega, los equipos presentarán su proyecto en una{" "}
									<span className="text-red-400 font-semibold">sesión cerrada con los mentores</span>. De esta ronda se seleccionarán los{" "}
									<span className="text-red-400 font-semibold">5 finalistas</span>.
								</p>
							</div>
						</div>

						<div className="group relative overflow-hidden bg-gradient-to-br from-red-950/20 to-zinc-900/30 border-2 border-red-500/30 backdrop-blur-sm p-6 md:p-8 hover:border-red-500/50 transition-all duration-300">
							<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<div className="relative z-10">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-12 h-12 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
										<span className="text-2xl">🏆</span>
									</div>
									<div className="bg-red-500/10 border-2 border-red-500/30 px-3 py-1">
										<span className="text-sm font-black text-red-400 font-mono uppercase">
											Paso 3
										</span>
									</div>
								</div>
								<h4 className="text-lg md:text-xl font-black uppercase text-white mb-3 tracking-tight">
									Pitch Final
								</h4>
								<div className="h-px w-16 bg-red-500/30 mb-4"></div>
								<p className="text-zinc-300 text-sm md:text-base leading-relaxed">
									Los 5 finalistas presentarán su proyecto frente a los{" "}
									<span className="text-red-400 font-semibold">jueces y todos los participantes</span>. Aquí se elegirán los{" "}
									<span className="text-red-400 font-semibold">ganadores</span>.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
