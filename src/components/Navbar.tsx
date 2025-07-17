import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (open) return; // Si el menú está abierto, no ocultar el navbar
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false); // Scroll hacia abajo, ocultar
      } else {
        setShow(true); // Scroll hacia arriba, mostrar
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, open]);

  return (
    <nav
      className={`w-full bg-gray-100 text-black shadow-lg sticky top-0 z-50 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-8xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img
            src="/logoSinFondo2.png"
            alt="Logo Nestor Motos"
            className="h-16 md:h-20 w-auto object-contain bg-transparent"
            style={{ pointerEvents: 'none', background: 'transparent', border: 'none' }}
            draggable="false"
          />
        </div>
        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 font-medium font-sans">
          <li><a href="#home" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={e => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}>Inicio</a></li>
          <li><a href="#about" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>Sobre Nosotros</a></li>
          <li><a href="#models" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={e => { e.preventDefault(); document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' }); }}>Modelos</a></li>
          <li><a href="#financing" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={e => { e.preventDefault(); document.getElementById('financing')?.scrollIntoView({ behavior: 'smooth' }); }}>Financiación</a></li>
          <li><a href="#reviews" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={e => { e.preventDefault(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>Referencias</a></li>
          <li><a href="#contact" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contacto</a></li>
        </ul>
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded border-2 border-[#ff6600] focus:outline-none" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="flex flex-col gap-2 px-4 pb-4 bg-gray-100 text-black border-t border-[#ff6600]">
          <li><a href="#home" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={e => { e.preventDefault(); setOpen(false); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}>Inicio</a></li>
          <li><a href="#about" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={e => { e.preventDefault(); setOpen(false); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>Sobre Nosotros</a></li>
          <li><a href="#models" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={e => { e.preventDefault(); setOpen(false); document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' }); }}>Modelos</a></li>
          <li><a href="#financing" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={e => { e.preventDefault(); setOpen(false); document.getElementById('financing')?.scrollIntoView({ behavior: 'smooth' }); }}>Financiaciones</a></li>
          <li><a href="#reviews" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={e => { e.preventDefault(); setOpen(false); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>Referencias</a></li>
          <li><a href="#contact" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={e => { e.preventDefault(); setOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contacto</a></li>
        </ul>
      </div>
      <style>{`
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fade-in-down 0.2s; }
      `}</style>
    </nav>
  );
};

export default Navbar; 