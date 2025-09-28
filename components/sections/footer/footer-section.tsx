"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function FooterSection() {
	return (
		<footer className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-black to-neutral-950 border-t border-neutral-800/50">
			{/* Subtle background pattern */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,113,108,0.1),transparent_50%)]" />
			<div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]" />

			<div className="relative max-w-7xl mx-auto px-6 lg:px-8">
				{/* Main Footer Content */}
				<div className="pt-16 pb-8">
					{/* Hero Logo Section */}
					<div className="text-center mb-16">
						<div className="mb-6">
							<Image
								src="/IA_HACK_BRAND.svg"
								alt="IA HACKATHON"
								width={180}
								height={45}
								className="h-10 w-auto mx-auto opacity-90"
							/>
						</div>
						<div className="space-y-4">
							<p className="text-neutral-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
								24 horas de innovación y tecnología
							</p>
							<div className="flex items-center justify-center gap-3 text-neutral-500">
								<Image
									src="/PE_FLAG.svg"
									alt="Perú"
									width={24}
									height={16}
									className="w-6 h-4"
								/>
								<span className="text-sm font-medium tracking-wide">
									Lima, Perú • Nov 29-30, 2025
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Organizers Grid */}
				<div className="mb-16">
					<div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-4xl mx-auto">
						<div className="text-center">
							<div className="mb-4">
								<p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">
									Organizado por
								</p>
								<a
									href="https://hackathon.lat/"
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-block transition-all duration-300 hover:scale-105 hover:opacity-80"
								>
									<div className="relative flex items-center justify-center gap-3">
										<Image
											src="/BY_THC.svg"
											alt="The Hackathon Company"
											width={120}
											height={40}
											className="h-8 w-auto"
										/>
										<ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
									</div>
								</a>
							</div>
						</div>

						<div className="text-center">
							<div className="mb-4">
								<p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">
									En alianza con
								</p>
								<a
									href="https://makers.ngo/"
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-block transition-all duration-300 hover:scale-105 hover:opacity-80"
								>
									<div className="relative flex items-center justify-center gap-3">
										<Image
											src="/In_partnership_with_ MAKERS.svg"
											alt="MAKERS"
											width={140}
											height={32}
											className="h-6 w-auto"
										/>
										<ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Community Partners */}
				<div className="mb-16">
					<div className="text-center">
						<p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-8">
							Apoyados por
						</p>
						<div className="flex items-center justify-center gap-8 max-w-lg mx-auto">
							<a
								href="https://www.linkedin.com/company/ai-playgrounds-tech/posts/?feedView=all"
								target="_blank"
								rel="noopener noreferrer"
								className="group relative"
							>
								<div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-neutral-700/50 group-hover:bg-neutral-900/50">
									<Image
										src="/ip.png"
										alt="IA Playgrounds"
										width={240}
										height={96}
										quality={95}
										className="h-8 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
									/>
									<ExternalLink className="absolute top-2 right-2 w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
								</div>
							</a>
							<a
								href="https://chat.whatsapp.com/LDLugaQtGknIKoAGXb3m61"
								target="_blank"
								rel="noopener noreferrer"
								className="group relative"
							>
								<div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-neutral-700/50 group-hover:bg-neutral-900/50">
									<Image
										src="/crafter-logotipo.svg"
										alt="Crafter Station"
										width={120}
										height={48}
										quality={95}
										className="h-8 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
									/>
									<ExternalLink className="absolute top-2 right-2 w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
								</div>
							</a>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-neutral-800/50 pt-12 pb-8">
					<div className="space-y-8">
						{/* Legacy Links */}
						<div className="text-center">
							<p className="text-sm text-neutral-400 mb-4 max-w-2xl mx-auto leading-relaxed">
								De los mismos creadores de{" "}
								<a
									href="https://www.ai-hackathon.co/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white font-medium hover:text-red-400 transition-colors duration-200 underline decoration-neutral-600 hover:decoration-red-400"
								>
									AI Hackathon Colombia
								</a>{" "}
								y{" "}
								<a
									href="https://www.colombiatechfest.ai-hackathon.co/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white font-medium hover:text-red-400 transition-colors duration-200 underline decoration-neutral-600 hover:decoration-red-400"
								>
									AI Hackathon en Colombia Tech Week
								</a>
							</p>
						</div>

						{/* Footer Bottom */}
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-neutral-800/30">
							<p className="text-xs text-neutral-500 font-medium">
								© 2025 IA Hackathon Peru. Todos los derechos reservados.
							</p>

							<a
								href="https://github.com/crafter-station/peru.ai-hackathon.co"
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-neutral-800/50"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200"
								>
									<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
									<path d="M9 18c-4.51 2-5-2-7-2"></path>
								</svg>
								<span className="font-medium">Contribute</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
