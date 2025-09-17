import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (open) return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, open]);

  const location = useLocation();
  const navigate = useNavigate();
  const branchFromPath = location.pathname.split('/')[1] || (localStorage.getItem('branch') || 'parana');
  const branch = (typeof window !== 'undefined' ? localStorage.getItem('branch') : 'venado') || 'venado';

  const goOrScroll = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const root = `/${branchFromPath}`;
    if (location.pathname !== root) {
      navigate(root + hash);
    } else {
      document.getElementById(hash.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setShow(true);
    setLastScrollY(window.scrollY);
  }, [location.pathname, location.hash]);

  // Submenú Modelos (desktop) por click
  const [modelsOpen, setModelsOpen] = useState(false);
  const modelsRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!modelsRef.current) return;
      if (!modelsRef.current.contains(e.target as Node)) setModelsOpen(false);
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  return (
    <nav className={`w-full bg-gray-100 text-black shadow-lg sticky top-0 z-50 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-8xl mx-auto flex items-center justify-between p-4 relative z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/${branchFromPath}`)}
            aria-label="Ir al inicio"
            className="focus:outline-none"
          >
            <img
              src={branch === 'parana' ? '/logoSinFondo3.webp' : '/logoSinFondo3.webp'}
              alt="Logo Nestor Motos"
              className="w-40 md:w-56 h-auto object-contain bg-transparent cursor-pointer"
              draggable="false"
            />
          </button>
        </div>

        {/* Desktop */}
        <ul className="hidden md:flex gap-6 font-medium items-center">
          <li><a href={`/${branchFromPath}#home`} className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]" onClick={goOrScroll('#home')}>Inicio</a></li>
          <li><a href={`/${branchFromPath}#about`} className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]" onClick={goOrScroll('#about')}>Sobre Nosotros</a></li>

          <li className="relative flex items-center gap-2" ref={modelsRef}>
            <a
              href={`/${branchFromPath}#models`}
              className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]"
              onClick={goOrScroll('#models')}
            >
              Modelos
            </a>
            <button
              type="button"
              aria-label="Abrir submenú"
              aria-haspopup="menu"
              aria-expanded={modelsOpen}
              onClick={(e) => { e.preventDefault(); setModelsOpen(v => !v); }}
              className={`p-1.5 rounded-lg border transition ${modelsOpen ? 'border-[#f75000] text-[#f75000] bg-[#f75000]/10' : 'border-transparent text-gray-700 hover:text-[#f75000] hover:border-[#f75000]/40'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            {modelsOpen && (
              <div className="absolute left-0 top-full w-64 bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-[#f75000]/30 border border-white/70 z-50 mt-2">
                <div className="py-2">
                  <Link to={`/${branchFromPath}/modelos`} onClick={() => setModelsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f75000]/10 hover:text-[#f75000]">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f75000]/15 text-[#f75000]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                    </span>
                    <span className="font-semibold">Ver todos</span>
                  </Link>
                  <Link to={`/${branchFromPath}/usadas`} onClick={() => setModelsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f75000]/10 hover:text-[#f75000]">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f75000]/15 text-[#f75000]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
                    </span>
                    <span className="font-semibold">Motos usadas</span>
                  </Link>
                </div>
              </div>
            )}
          </li>

          <li><a href={`/${branchFromPath}#financing`} className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]" onClick={goOrScroll('#financing')}>Financiación</a></li>
          <li><a href={`/${branchFromPath}#reviews`} className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]" onClick={goOrScroll('#reviews')}>Referencias</a></li>
          <li><Link to={`/${branchFromPath}/blog`} className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]">Blog</Link></li>
          <li><a href={`/${branchFromPath}#contact`} className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]" onClick={goOrScroll('#contact')}>Contacto</a></li>
          <li><button onClick={() => navigate('/sucursal')} className="px-2 py-1 rounded border border-[#f75000] text-[#f75000] hover:bg-[#f75000]/10">Sucursal</button></li>
        </ul>

        {/* Mobile */}
        <button className="md:hidden p-2 rounded border-2 border-[#f75000]" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#f75000"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="flex flex-col gap-2 px-4 pb-4 bg-gray-100 text-black border-t border-[#f75000]">
          <li><a href={`/${branchFromPath}#home`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e)=>{e.preventDefault(); setOpen(false); goOrScroll('#home')(e);}}>Inicio</a></li>
          <li><a href={`/${branchFromPath}#about`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e)=>{e.preventDefault(); setOpen(false); goOrScroll('#about')(e);}}>Sobre Nosotros</a></li>
          <li className="relative">
            <a href={`/${branchFromPath}#models`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e)=>{e.preventDefault(); setOpen(false); goOrScroll('#models')(e);}}>Modelos</a>
            <Link to={`/${branchFromPath}/modelos`} className="block py-2 px-3 rounded-xl border border-[#f75000]/30 mt-1 bg-white text-black hover:bg-[#f75000]/10 font-semibold">Ver todos</Link>
            <Link to={`/${branchFromPath}/usadas`} className="block py-2 px-3 rounded-xl border border-[#f75000]/30 mt-1 bg-white text-black hover:bg-[#f75000]/10 font-semibold">Motos usadas</Link>
          </li>
          <li><a href={`/${branchFromPath}#financing`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e)=>{e.preventDefault(); setOpen(false); goOrScroll('#financing')(e);}}>Financiaciones</a></li>
          <li><a href={`/${branchFromPath}#reviews`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e)=>{e.preventDefault(); setOpen(false); goOrScroll('#reviews')(e);}}>Referencias</a></li>
          <li><Link to={`/${branchFromPath}/blog`} onClick={()=>setOpen(false)} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white">Blog</Link></li>
          <li><a href={`/${branchFromPath}#contact`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e)=>{e.preventDefault(); setOpen(false); goOrScroll('#contact')(e);}}>Contacto</a></li>
          <li className="pt-2 border-t border-gray-200"><button onClick={()=>{setOpen(false); navigate('/sucursal');}} className="w-full py-2 rounded border border-[#f75000] text-[#f75000]">Elegir sucursal</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 