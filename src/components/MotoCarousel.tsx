import React, { useState, useEffect, useRef } from 'react';

type Moto = {
  id: string;
  name: string;
  cc: number;
  isQuad: boolean;
  image: string;
};

type MotoCarouselProps = {
  motos: Moto[];
  title: string;
};

const ArrowLeft = () => (
  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const ArrowRight = () => (
  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// Eliminar TrapezoidLabel y recuadros SVG

const MotoCarousel: React.FC<MotoCarouselProps> = ({ motos, title }) => {
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMoto, setModalMoto] = useState<Moto | null>(null);
  const length = motos.length;

  // Ref para los ítems de la lista
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Para lista infinita en mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const repeatCount = isMobile && motos.length > 1 ? 3 : 1; // Repetir 3 veces para efecto infinito
  const infiniteMotos = isMobile && motos.length > 1 ? Array(repeatCount).fill(motos).flat() : motos;

  // Ajustar el scroll automático para centrar el ítem activo en mobile
  useEffect(() => {
    if (isMobile && itemRefs.current[current + motos.length]) {
      itemRefs.current[current + motos.length]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [current, isMobile, motos.length]);

  const handlePrev = () => setCurrent((prev) => (prev - 1 + length) % length);
  const handleNext = () => setCurrent((prev) => (prev + 1) % length);

  // Modal de detalles
  const Modal = ({ moto, onClose }: { moto: Moto; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative flex items-center justify-center">
        <img
          src={moto.image}
          alt={moto.name}
          className="max-h-[80vh] max-w-[90vw] object-contain mx-auto drop-shadow-2xl"
          draggable="false"
          style={{ background: 'none', border: 'none' }}
        />
        {/* Logo dentro de la imagen */}
        <img
          src="/logo.webp"
          alt="Logo Nestor Motos"
          className="absolute right-2 bottom-2 w-20 md:w-32 h-auto opacity-90 select-none pointer-events-none"
          draggable="false"
        />
        {/* Cruz dentro de la imagen */}
        <button
          className="absolute top-2 right-2 text-[#ff6600] hover:bg-[#ff6600]/10 rounded-full p-2 transition text-4xl font-extrabold z-50"
          onClick={onClose}
          aria-label="Cerrar"
          style={{ lineHeight: 1 }}
        >
          &times;
        </button>
      </div>
    </div>
  );

  return (
    <div className="mb-20 flex flex-col md:flex-row md:items-start gap-8">
      <div className="flex-1">
        <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-black text-center mb-8 drop-shadow-sm border-b-4 border-[#ff6600]/60 inline-block pb-2 px-6">{title}</h3>
        <section className="relative w-full max-w-3xl mx-auto bg-transparent rounded-3xl shadow-none p-0 flex flex-col items-center justify-center min-h-[480px]">
          {length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-transparent border-none text-primary rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#ff6600]/10 transition duration-200"
              aria-label="Anterior"
            >
              <ArrowLeft />
            </button>
          )}
          {length > 0 && (
            <div className="w-full flex flex-col items-center mb-2">
              <span className="relative text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-black text-center mb-4 drop-shadow-lg" style={{ letterSpacing: '0.08em' }}>
                <span className="relative z-10">{motos[current].name}</span>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-16 h-1.5 rounded-full bg-gradient-to-r from-[#ff6600] via-[#ff944d] to-[#ff6600] animate-pulse z-0" aria-hidden="true" />
              </span>
            </div>
          )}
          {length > 0 && (
            <div className="w-full flex items-center justify-center">
              <img
                src={motos[current].image}
                alt={motos[current].name}
                className="w-full max-h-[420px] md:max-h-[500px] object-contain mx-auto transition-transform duration-300 hover:scale-105 drop-shadow-xl cursor-pointer"
                draggable="false"
                style={{ background: 'none', border: 'none' }}
                onClick={() => { setShowModal(true); setModalMoto(motos[current]); }}
              />
            </div>
          )}
          {length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-transparent border-none text-primary rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#ff6600]/10 transition duration-200"
              aria-label="Siguiente"
            >
              <ArrowRight />
            </button>
          )}
          {length > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              {motos.map((_, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-300 rounded-full ${idx === current ? 'w-8 h-3 bg-[#ff6600] scale-110 shadow-lg' : 'w-4 h-2 bg-[#ff6600]/30'}`}
                  style={{ boxShadow: idx === current ? '0 2px 12px #FF660088' : undefined }}
                />
              ))}
            </div>
          )}
          {showModal && modalMoto && <Modal moto={modalMoto} onClose={() => { setShowModal(false); setModalMoto(null); }} />}
        </section>
      </div>
      {/* Lista de motos a la derecha (o abajo en mobile) */}
      <div className="md:w-64 w-full md:sticky md:top-32 max-h-[520px] overflow-y-auto mt-8 md:mt-0 md:px-0 px-2">
        <ul className="flex md:flex-col flex-row gap-2 md:gap-3 w-auto md:w-full min-w-0 justify-center md:justify-start overflow-x-auto scrollbar-hide scroll-px-2">
          {(isMobile ? infiniteMotos : motos).map((moto, idx) => (
            <li
              key={moto.id + '-' + idx}
              ref={el => { itemRefs.current[idx] = el; }}
              className={`moto-list-item cursor-pointer px-4 py-2 rounded-lg font-bold text-base md:text-lg transition-all select-none whitespace-nowrap min-w-max w-auto ${((isMobile ? idx % motos.length : idx) === current) ? 'bg-[#ff6600]/90 text-white shadow-md active' : 'bg-gray-100 text-black hover:bg-[#ff6600]/20'}`}
              onClick={() => setCurrent(isMobile ? idx % motos.length : idx)}
            >
              {moto.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MotoCarousel; 
