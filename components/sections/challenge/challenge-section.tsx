"use client";

import BullseyeIcon from "@/components/icons/bullseye-icon";
import SparklesIcon from "@/components/icons/sparkles-icon";
import TrophyIcon from "@/components/icons/trophy-icon";

/**
 * Challenge section explaining the hackathon format
 */
export default function ChallengeSection() {
	const features = [
		{
			title: "Formato Abierto",
			description:
				"No hay un problema específico por resolver. Explora las ideas que más te apasionen.",
			Icon: BullseyeIcon,
		},
		{
			title: "Tu Visión",
			description:
				"Libertad total para crear el proyecto que siempre soñaste construir.",
			Icon: TrophyIcon,
		},
		{
			title: "Equipos Apasionados",
			description:
				"Grupos de hasta 5 personas obsesionadas con crear algo increíble.",
			Icon: SparklesIcon,
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
							Formato Abierto
						</span>
						<div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
					</div>
					<h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase text-white mb-6">
						Construye Algo Increíble
					</h2>
					<p className="text-zinc-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
						<span className="text-red-400 font-bold">IA HACKATHON</span> es de
						carácter abierto. Queremos ver productos increíbles impulsados por
						equipos completamente apasionados y obsesionados.
					</p>
				</div>

				{/* Feature Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
					{features.map((feature, index) => {
						const IconComponent = feature.Icon;

						return (
							<div
								key={index}
								className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border-2 border-zinc-800/50 backdrop-blur-sm p-6 md:p-8 hover:border-red-500/30 transition-all duration-300"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

								<div className="relative z-10">
									{/* Icon */}
									<div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
										<IconComponent className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
									</div>

									{/* Title */}
									<h3 className="text-white font-bold text-lg md:text-xl mb-3 uppercase font-mono">
										{feature.title}
									</h3>

									{/* Description */}
									<p className="text-zinc-400 text-sm md:text-base leading-relaxed">
										{feature.description}
									</p>
								</div>

								{/* Decorative corner */}
								<div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-red-500/20 group-hover:border-red-500/40 transition-colors duration-300" />
								<div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-red-500/20 group-hover:border-red-500/40 transition-colors duration-300" />
							</div>
						);
					})}
				</div>

				{/* Bottom Message */}
				<div className="mt-12 md:mt-16 text-center">
					<div className="inline-block relative overflow-hidden bg-gradient-to-br from-red-950/20 to-zinc-900/30 border-2 border-red-500/30 backdrop-blur-sm p-6 md:p-8 max-w-2xl">
						<div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent" />
						<p className="relative z-10 text-white text-sm md:text-base leading-relaxed">
							Las inscripciones son{" "}
							<span className="font-bold text-red-400">individuales</span>. Los
							participantes aceptados formarán grupos de máximo{" "}
							<span className="font-bold text-red-400">5 personas</span> durante
							el evento.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
