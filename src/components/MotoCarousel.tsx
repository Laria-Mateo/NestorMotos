"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
// import { Link, useNavigate } from "react-router-dom"

type Moto = {
  id: string
  name: string
  cc: number
  isQuad: boolean
  image: string
}

type MotoCarouselProps = {
  motos: Moto[]
}

const ArrowLeft = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ArrowRight = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

//

const ZapIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// Título limpiado (no usado actualmente)

const MotoCarousel: React.FC<MotoCarouselProps> = ({ motos }) => {
  const [current, setCurrent] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalMoto, setModalMoto] = useState<Moto | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [isManualChange, setIsManualChange] = useState(false)
  const length = Array.isArray(motos) ? motos.length : 0
  // const navigate = useNavigate()

  // Ref para los ítems de la lista
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const carouselRef = useRef<HTMLDivElement>(null)

  // Para slider táctil en mobile
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
    setIsTouching(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current
      const minSwipeDistance = 50

      if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
          handleNext() // swipe left -> next
        } else {
          handlePrev() // swipe right -> prev
        }
      }
    }
    touchStartX.current = null
    touchEndX.current = null
    // Mantener isTouching por un momento después del touch para evitar auto-play inmediato
    setTimeout(() => setIsTouching(false), 1000)
  }

  const handlePrev = () => {
    if (isAnimating || length === 0) return
    setIsAnimating(true)
    setIsManualChange(true) // Marcar como cambio manual
    setCurrent((prev) => (prev - 1 + length) % length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleNext = () => {
    if (isAnimating || length === 0) return
    setIsAnimating(true)
    setIsManualChange(true) // Marcar como cambio manual
    setCurrent((prev) => (prev + 1) % length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleAutoNext = () => {
    if (isAnimating || length === 0) return
    setIsAnimating(true)
    // NO marcar como manual para evitar scroll
    setCurrent((prev) => (prev + 1) % length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  // Handlers para mouse events
  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Handlers para focus events
  const handleFocus = () => {
    setHasFocus(true)
  }

  const handleBlur = () => {
    setHasFocus(false)
  }

  // Para lista infinita en mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768
  const repeatCount = isMobile && length > 1 ? 3 : 1
  const infiniteMotos = isMobile && length > 1 ? Array(repeatCount).fill(motos).flat() : motos

  // Si la lista cambia y el índice queda fuera de rango, resetear
  useEffect(() => {
    if (current >= length && length > 0) {
      setCurrent(0)
    }
  }, [length, current])

  // Ajustar el scroll automático para centrar el ítem activo en mobile
  useEffect(() => {
    if (isMobile && isManualChange && itemRefs.current[current + length]) {
      itemRefs.current[current + length]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
    // Reset el flag después del scroll
    if (isManualChange) {
      setIsManualChange(false)
    }
  }, [current, isMobile, length, isManualChange])

  // Auto-play mejorado con lógica de pausa
  useEffect(() => {
    // No hacer auto-play si:
    // - Modal está abierto
    // - Solo hay una moto
    // - El usuario está hovering
    // - El usuario está tocando (mobile)
    // - Hay focus en el carrusel
    // - Está animando
    const shouldPause = showModal || length <= 1 || isHovered || isTouching || hasFocus || isAnimating

    if (shouldPause) {
      return
    }

    const interval = setInterval(() => {
      handleAutoNext() // Usar la función específica para auto-play
    }, 5000)

    return () => clearInterval(interval)
  }, [showModal, length, isHovered, isTouching, hasFocus, isAnimating])

  const colorMap: Record<string, string> = {
    Rojo: "#ef4444",
    Azul: "#3b82f6",
    Negro: "#1f2937",
    Blanco: "#f8fafc",
    Verde: "#10b981",
    Amarillo: "#f59e0b",
    Gris: "#6b7280",
    Naranja: "#f75000",
  }

  // Modal de detalles
  const Modal = ({ moto, onClose }: { moto: Moto; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative max-w-6xl max-h-[90vh] mx-4">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">

          {/* Header del modal */}
          <div className="relative z-10 p-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{moto.name}</h3>
                <div className="flex items-center gap-2 text-orange-500">
                  <ZapIcon />
                  <span className="text-sm font-medium">{moto.cc}cc</span>
                  {moto.isQuad && <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">QUAD</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Colores en el modal si existen */}
            {(moto as any).colors && (moto as any).colors.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-gray-700">Colores disponibles:</span>
                <div className="flex gap-2">
                  {(moto as any).colors.map((color: string, idx: number) => (
                    <div
                      key={color + idx}
                      className={`w-6 h-6 rounded-full border-2 border-white/20 shadow ${color === "Blanco" ? "border-gray-400" : ""}`}
                      style={{ background: colorMap[color] || "#ccc" }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Imagen del modal */}
          <div className="relative p-8 bg-white">
            <img
              src={moto.image || "/placeholder.svg"}
              alt={moto.name}
              className="w-full max-h-[60vh] object-contain mx-auto drop-shadow-2xl"
              draggable="false"
            />
            {/* Marca de agua removida */}
          </div>

          {/* Botón Más info debajo de la imagen */}
          <div className="px-8 pb-8 bg-white">
            <a
              href={`../modelos/${moto.id}`}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const branch = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'parana';
                window.location.assign(`/${branch}/modelos/${moto.id}`);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const branch = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'parana';
                window.location.assign(`/${branch}/modelos/${moto.id}`);
              }}
              className="mx-auto block w-full max-w-xs text-center bg-[#f75000] text-white font-semibold px-6 py-3 rounded-full shadow-sm hover:bg-[#ff7a33] active:bg-[#cc3f00] focus:outline-none focus:ring-2 focus:ring-[#f75000]/40 text-base select-none"
            >
              Más info
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  if (length === 0) return null

  const activeMoto: Moto | undefined = length > 0 ? motos[current] : undefined

  return (
    <div className="mb-20">
      {/* Separador superior */}
      <div className="text-center mb-6">
        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4">
        {/* Carrusel principal mejorado */}
        <div className="flex-1">
          <div
            ref={carouselRef}
            className="relative bg-white rounded-2xl shadow-xl ring-1 ring-gray-200/60 overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={0}
          >
            

            {/* Indicador de pausa del auto-play */}
            {(isHovered || isTouching || hasFocus) && length > 1 && (
              <div className="absolute bottom-3 right-3 z-30 bg-black/40 text-white/90 px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm">
                Pausado
              </div>
            )}

            {/* Controles de navegación mejorados - SOLO EN DESKTOP */}
            {length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={isAnimating}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 text-gray-700 hover:text-orange-500 transition-all duration-200 hover:scale-110 disabled:opacity-50 hidden md:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 text-gray-700 hover:text-orange-500 transition-all duration-200 hover:scale-110 disabled:opacity-50 hidden md:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <ArrowRight />
                </button>
              </>
            )}

            {/* Contenido principal */}
            <div className="relative p-8 md:p-12">

              {/* Imagen principal mejorada */}
              <div
                className="relative group cursor-pointer"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => {
                  // Solo abrir modal en desktop o si no hay movimiento táctil
                  if (!isMobile || (touchStartX.current === null && touchEndX.current === null)) {
                    if (activeMoto) {
                      setShowModal(true)
                      setModalMoto(activeMoto)
                    }
                  }
                }}
              >
                <div className="relative">
                  <img
                    src={activeMoto?.image || "/placeholder.svg"}
                    alt={activeMoto?.name || "Modelo"}
                    className={`w-full h-[400px] md:h-[500px] object-contain transition-transform duration-500 ${
                      isAnimating ? "scale-95" : "md:group-hover:scale-105"
                    }`}
                    draggable="false"
                  />


                  {/* Indicador de deslizamiento en mobile (removido a pedido) */}
                </div>

                {/* Colores fuera de la imagen (moved arriba junto a cc) */}
              </div>

              {/* Colores debajo de la imagen */}
              {activeMoto && (activeMoto as any).colors && (activeMoto as any).colors.length > 0 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Colores :</span>
                  <div className="flex items-center gap-2">
                    {(activeMoto as any).colors.map((color: string, idx: number) => (
                      <span
                        key={color + idx}
                        className={`inline-block w-3.5 h-3.5 rounded-full border ${color === "Blanco" ? "border-gray-300" : "border-white"}`}
                        style={{ background: colorMap[color] || "#ccc" }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Indicadores mejorados */}
              {length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {motos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsManualChange(true)
                        setCurrent(idx)
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary ${
                        idx === current ? "w-3 h-3 bg-[#f75000] shadow" : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                  {/* Texto indicativo en mobile */}
                  {/* Mensaje mobile removido */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista lateral mejorada (oculta en mobile) */}
        <div className="hidden md:block lg:w-80">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200/60">
            <div className="bg-[#f75000] p-4">
              <h4 className="text-white font-bold text-lg">Modelos Disponibles</h4>
            </div>
            <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
              <ul className="flex flex-col gap-0 w-full justify-start overflow-x-visible">
                {(isMobile ? infiniteMotos : motos).map((moto, idx) => (
                  <li
                    key={moto.id + "-" + idx}
                    ref={(el) => {
                      itemRefs.current[idx] = el
                    }}
                    className={`moto-list-item cursor-pointer px-4 py-2 rounded-lg font-semibold text-base md:text-lg transition-colors select-none whitespace-normal w-full md:w-full md:p-4 md:text-left md:border-b md:border-gray-100 md:last:border-b-0 md:rounded-none ${
                      (isMobile ? idx % length : idx) === current
                        ? "bg-[#f75000]/10 text-[#f75000]"
                        : "bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setIsManualChange(true)
                      setCurrent(isMobile ? idx % length : idx)
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    tabIndex={0}
                  >
                    <div className="md:flex md:items-center md:justify-between">
                      <div>
                        <h5 className="font-semibold">
                          {moto.name}
                        </h5>
                        <div className="hidden md:flex md:items-center md:gap-2 md:mt-1">
                          {moto.isQuad && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">QUAD</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && modalMoto && (
        <Modal
          moto={modalMoto}
          onClose={() => {
            setShowModal(false)
            setModalMoto(null)
          }}
        />
      )}
    </div>
  )
}

export default MotoCarousel
