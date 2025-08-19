import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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

  const location = useLocation();
  const navigate = useNavigate();

  const goOrScroll = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      document.getElementById(hash.replace('#',''))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Al cambiar de ruta, mostrar siempre el navbar inmediatamente
  useEffect(() => {
    setShow(true);
    setLastScrollY(window.scrollY);
  }, [location.pathname, location.hash]);

  return (
    <nav
      className={`w-full bg-gray-100 text-black shadow-lg sticky top-0 z-50 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-8xl mx-auto flex items-center justify-between p-4 relative z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
              } else {
                window.location.reload();
              }
            }}
            aria-label="Ir al inicio"
            className="focus:outline-none"
          >
            <img
              src="/logoSinFondo2.webp"
              alt="Logo Nestor Motos"
              className="w-40 md:w-56 h-auto object-contain bg-transparent cursor-pointer"
              draggable="false"
            />
          </button>
        </div>
        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 font-medium font-sans">
          <li><a href="#home" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={goOrScroll('#home')}>Inicio</a></li>
          <li><a href="#about" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={goOrScroll('#about')}>Sobre Nosotros</a></li>
          <li className="relative group">
            <a href="#models" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={goOrScroll('#models')}>Modelos</a>
            <div className="absolute left-0 top-full w-56 bg-white shadow-lg ring-1 ring-gray-200 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition z-50">
              <Link to="/modelos" className="block px-4 py-2 hover:bg-gray-50">Ver todos</Link>
            </div>
          </li>
          <li><a href="#financing" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={goOrScroll('#financing')}>Financiación</a></li>
          <li><a href="#reviews" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={goOrScroll('#reviews')}>Referencias</a></li>
          <li><a href="#contact" className="px-2 py-1 rounded transition hover:text-[#ff6600] hover:underline underline-offset-8 decoration-2 decoration-[#ff6600]" onClick={goOrScroll('#contact')}>Contacto</a></li>
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
          <li><a href="#home" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={(e) => { e.preventDefault(); setOpen(false); goOrScroll('#home')(e); }}>Inicio</a></li>
          <li><a href="#about" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={(e) => { e.preventDefault(); setOpen(false); goOrScroll('#about')(e); }}>Sobre Nosotros</a></li>
          <li className="relative">
            <a href="#models" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={(e) => { e.preventDefault(); setOpen(false); goOrScroll('#models')(e); }}>Modelos</a>
            <Link to="/modelos" className="block py-2 px-3 rounded border border-gray-200 mt-1 bg-white text-black">Ver todos</Link>
          </li>
          <li><a href="#financing" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={(e) => { e.preventDefault(); setOpen(false); goOrScroll('#financing')(e); }}>Financiaciones</a></li>
          <li><a href="#reviews" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={(e) => { e.preventDefault(); setOpen(false); goOrScroll('#reviews')(e); }}>Referencias</a></li>
          <li><a href="#contact" className="block py-2 px-3 rounded hover:bg-[#ff6600] hover:text-white transition" onClick={(e) => { e.preventDefault(); setOpen(false); goOrScroll('#contact')(e); }}>Contacto</a></li>
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