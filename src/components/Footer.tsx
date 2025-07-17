import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white pt-10 pb-0 mt-12 shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start px-4 gap-8">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <img
            src="/src/assets/logo.png"
            alt="Logo Nestor Motos"
            className="h-24 w-auto object-contain mb-2"
            style={{ background: 'transparent', border: 'none', pointerEvents: 'none' }}
            draggable="false"
          />
        </div>
        <div className="flex flex-col items-center md:items-end gap-1 text-base font-medium">
          <div>Tel: <a href="tel:03433007984" className="hover:text-[#ff6600] transition">0343 300-7984</a></div>
          <div>Email: <a href="mailto:nestormotos@gmail.com" className="hover:text-[#ff6600] transition">nestormotos@gmail.com</a></div>
          <div>Dirección: Esquina Av. Espejo, Leopoldo Lugones y, E3100 Paraná, Entre Ríos</div>
          <div className="flex items-center gap-2 mt-2">
            <span>Escribinos</span>
            <a href="https://www.instagram.com/nestormotos2/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z" fill="white"/>
                <path d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z" fill="white"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* Franja inferior */}
      <div className="w-full bg-white text-black text-center py-3 text-sm font-semibold mt-8">
        Desarrollado por Mateo Laria - Técnico Universitario en Programación
      </div>
    </footer>
  );
};

export default Footer; 