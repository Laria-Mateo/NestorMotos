import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

const modelMenuItems = (branch: string, onPick: () => void, goModels: (e: React.MouseEvent) => void) => [
  {
    key: 'destacados',
    label: 'Modelos destacados',
    onClick: (e: React.MouseEvent) => {
      onPick();
      goModels(e);
    },
  },
  {
    key: 'todos',
    label: 'Ver todos',
    to: `/${branch}/modelos`,
  },
  {
    key: 'usadas',
    label: 'Motos usadas',
    to: `/${branch}/usadas`,
  },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [modelsMobileOpen, setModelsMobileOpen] = useState(false);
  const modelsRef = useRef<HTMLLIElement | null>(null);

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
    const handleScroll = () => {
      if (open || modelsOpen) return;
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
  }, [lastScrollY, open, modelsOpen]);

  useEffect(() => {
    setShow(true);
    setLastScrollY(window.scrollY);
    setModelsOpen(false);
    setModelsMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!modelsRef.current) return;
      if (!modelsRef.current.contains(e.target as Node)) setModelsOpen(false);
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  const closeMenus = () => {
    setModelsOpen(false);
    setModelsMobileOpen(false);
    setOpen(false);
  };

  const desktopModelItems = modelMenuItems(branchFromPath, () => setModelsOpen(false), goOrScroll('#models'));
  const mobileModelItems = modelMenuItems(branchFromPath, closeMenus, goOrScroll('#models'));

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

        <ul className="hidden md:flex gap-6 font-medium items-center">
          <li><a href={`/${branchFromPath}#home`} className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]" onClick={goOrScroll('#home')}>Inicio</a></li>
          {branchFromPath === 'parana' ? (
            <>
              <li>
                <Link
                  to={`/${branchFromPath}/empresa`}
                  className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]"
                >
                  Empresa
                </Link>
              </li>
              <li>
                <a
                  href={`/${branchFromPath}#servicios`}
                  className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]"
                  onClick={goOrScroll('#servicios')}
                >
                  Servicios
                </a>
              </li>
            </>
          ) : (
            <li>
              <a
                href={`/${branchFromPath}#servicios`}
                className="px-2 py-1 hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]"
                onClick={goOrScroll('#servicios')}
              >
                Servicios
              </a>
            </li>
          )}

          <li className="relative" ref={modelsRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={modelsOpen}
              onClick={() => setModelsOpen((v) => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
                modelsOpen
                  ? 'text-[#f75000] bg-[#f75000]/10'
                  : 'hover:text-[#f75000] hover:underline underline-offset-8 decoration-2 decoration-[#f75000]'
              }`}
            >
              <span>Modelos</span>
              <ChevronDown open={modelsOpen} />
            </button>
            {modelsOpen && (
              <div className="absolute left-0 top-full w-56 bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-[#f75000]/30 border border-white/70 z-50 mt-2">
                <div className="py-2">
                  {desktopModelItems.map((item) => (
                    item.to ? (
                      <Link
                        key={item.key}
                        to={item.to}
                        onClick={() => setModelsOpen(false)}
                        className="block px-4 py-2.5 font-semibold hover:bg-[#f75000]/10 hover:text-[#f75000]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={item.key}
                        type="button"
                        onClick={item.onClick}
                        className="w-full text-left px-4 py-2.5 font-semibold hover:bg-[#f75000]/10 hover:text-[#f75000]"
                      >
                        {item.label}
                      </button>
                    )
                  ))}
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

        <button className="md:hidden p-2 rounded border-2 border-[#f75000]" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#f75000"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[580px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="flex flex-col gap-2 px-4 pb-4 bg-gray-100 text-black border-t border-[#f75000]">
          <li><a href={`/${branchFromPath}#home`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e) => { e.preventDefault(); closeMenus(); goOrScroll('#home')(e); }}>Inicio</a></li>
          {branchFromPath === 'parana' ? (
            <>
              <li>
                <Link
                  to={`/${branchFromPath}/empresa`}
                  onClick={closeMenus}
                  className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white"
                >
                  Empresa
                </Link>
              </li>
              <li>
                <a
                  href={`/${branchFromPath}#servicios`}
                  className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white"
                  onClick={(e) => { e.preventDefault(); closeMenus(); goOrScroll('#servicios')(e); }}
                >
                  Servicios
                </a>
              </li>
            </>
          ) : (
            <li>
              <a
                href={`/${branchFromPath}#servicios`}
                className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white"
                onClick={(e) => { e.preventDefault(); closeMenus(); goOrScroll('#servicios')(e); }}
              >
                Servicios
              </a>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={() => setModelsMobileOpen((v) => !v)}
              className={`w-full flex items-center justify-between py-2 px-3 rounded font-medium ${
                modelsMobileOpen ? 'bg-[#f75000]/10 text-[#f75000]' : 'hover:bg-[#f75000] hover:text-white'
              }`}
            >
              <span>Modelos</span>
              <ChevronDown open={modelsMobileOpen} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${modelsMobileOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col gap-1 pl-3 border-l-2 border-[#f75000]/30 ml-3">
                {mobileModelItems.map((item) => (
                  item.to ? (
                    <Link
                      key={item.key}
                      to={item.to}
                      onClick={closeMenus}
                      className="block py-2 px-3 rounded-lg bg-white border border-[#f75000]/20 font-semibold hover:bg-[#f75000]/10"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.key}
                      type="button"
                      onClick={item.onClick}
                      className="w-full text-left py-2 px-3 rounded-lg bg-white border border-[#f75000]/20 font-semibold hover:bg-[#f75000]/10"
                    >
                      {item.label}
                    </button>
                  )
                ))}
              </div>
            </div>
          </li>
          <li><a href={`/${branchFromPath}#financing`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e) => { e.preventDefault(); closeMenus(); goOrScroll('#financing')(e); }}>Financiaciones</a></li>
          <li><a href={`/${branchFromPath}#reviews`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e) => { e.preventDefault(); closeMenus(); goOrScroll('#reviews')(e); }}>Referencias</a></li>
          <li><Link to={`/${branchFromPath}/blog`} onClick={closeMenus} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white">Blog</Link></li>
          <li><a href={`/${branchFromPath}#contact`} className="block py-2 px-3 rounded hover:bg-[#f75000] hover:text-white" onClick={(e) => { e.preventDefault(); closeMenus(); goOrScroll('#contact')(e); }}>Contacto</a></li>
          <li className="pt-2 border-t border-gray-200"><button onClick={() => { closeMenus(); navigate('/sucursal'); }} className="w-full py-2 rounded border border-[#f75000] text-[#f75000]">Elegir sucursal</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
