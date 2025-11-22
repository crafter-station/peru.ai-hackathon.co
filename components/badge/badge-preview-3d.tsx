"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Atropos from "atropos/react"
import "atropos/css"

type BadgePreview3DProps = {
  badgeUrl: string | null
  isGenerating?: boolean
  participantNumber?: string | null
  className?: string
}

export function BadgePreview3D({
  badgeUrl,
  isGenerating = false,
  participantNumber,
  className,
}: BadgePreview3DProps) {
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [loadedImageUrl, setLoadedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (badgeUrl && badgeUrl !== loadedImageUrl) {
      setIsImageLoading(true)
    }
  }, [badgeUrl, loadedImageUrl])

  return (
    <div className={`flex w-full items-center justify-center ${className || ""}`}>
      <Atropos className="atropos-badge" activeOffset={40} shadowScale={1.05} rotateXMax={10} rotateYMax={10}>
        <div className="relative h-[373px] w-[280px] shrink-0 sm:h-[427px] sm:w-[320px] md:h-[512px] md:w-[384px]">
          {/* Acrylic glass layer - dark theme */}
          <div
            className="absolute inset-0 rounded-lg"
            data-atropos-offset="-2"
            style={{
              background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.6), inset 2px 2px 4px rgba(255, 255, 255, 0.05), inset -2px -2px 4px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />

          <div className="absolute inset-[8px] flex flex-col overflow-hidden rounded-md shadow-2xl shadow-black/40">
            {/* Badge content area */}
            <div
              className="relative flex-1 overflow-hidden rounded-sm"
              data-atropos-offset="2"
              style={{ backgroundColor: "#000000" }}
            >
              {isGenerating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 flex h-full flex-col items-center justify-center gap-3"
                >
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                  <p className="font-mono text-xs text-white/50">Generando credencial...</p>
                </motion.div>
              ) : badgeUrl ? (
                <div className="relative z-10 h-full w-full overflow-hidden rounded-sm" data-atropos-offset="3">
                  {isImageLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm"
                    >
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                      <p className="mt-3 font-mono text-xs text-white/50">Cargando imagen...</p>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: isImageLoading ? 0 : 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={badgeUrl}
                      alt={`Credencial ${participantNumber || ""}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 384px"
                      priority
                      onLoad={() => {
                        setIsImageLoading(false)
                        setLoadedImageUrl(badgeUrl)
                      }}
                    />
                  </motion.div>
                </div>
              ) : (
                <div className="relative z-10 flex h-full w-full items-center justify-center rounded-sm border border-dashed border-white/25 bg-white/5">
                  <p className="px-4 text-center font-mono text-[9px] leading-tight text-white/35">
                    No hay credencial
                    <br />
                    disponible
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Atropos>
    </div>
  )
}
