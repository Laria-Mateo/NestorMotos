import React from 'react';

const Footer: React.FC = () => {
  const branch = (typeof window !== 'undefined' ? localStorage.getItem('branch') : 'venado') || 'venado';
  return (
    <footer className="w-full bg-black text-white pt-10 pb-0 mt-12 shadow-inner">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <img src={branch === 'parana' ? '/logoSinFondo3.webp' : '/logoSinFondo2.webp'} alt="Logo Nestor Motos" className="h-20 w-auto object-contain" draggable="false" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/20 pt-8">
          <div>
            <h3 className="text-lg font-extrabold mb-3">Venado Tuerto</h3>
            <ul className="space-y-1 text-sm">
              <li>Tel: <a href="tel:+5493462252244" className="hover:text-[#ff6600] transition">+54 9 3462 252244</a></li>
              <li>Email: <a href="mailto:nestormotos@gmail.com" className="hover:text-[#ff6600] transition">nestormotos@gmail.com</a></li>
              <li>Dirección: Av. Sta. Fe 740, S2600 Venado Tuerto, Santa Fe</li>
              <li>Instagram: <a href="https://www.instagram.com/nestormotosvenadotuerto/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6600] transition">@nestormotosvenadotuerto</a></li>
            </ul>
          </div>
          <div className="md:border-l md:border-white/20 md:pl-8">
            <h3 className="text-lg font-extrabold mb-3">Paraná</h3>
            <ul className="space-y-1 text-sm">
              <li>Tel: <a href="tel:+5493433007984" className="hover:text-[#ff6600] transition">+54 9 343 300-7984</a></li>
              <li>Email: <a href="mailto:nestormotos@gmail.com" className="hover:text-[#ff6600] transition">nestormotos@gmail.com</a></li>
              <li>Dirección: Esquina Av. Espejo, Leopoldo Lugones y, E3100 Paraná, Entre Ríos</li>
              <li>Instagram: <a href="https://www.instagram.com/nestormotos2/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6600] transition">@nestormotos2</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full bg-white text-black text-center py-2 text-xs font-semibold mt-8">
        <div className="flex items-center justify-center gap-3">
          <span>Desarrollado por:</span>
          <a href="https://www.instagram.com/quvos.digitalmarketing/" target="_blank" rel="noopener noreferrer">
            <img src="/logoQuvos.png" alt="Quvos" className="h-7 md:h-8 w-auto object-contain" />
          </a>
        </div>
        <div className="mt-1">
          Dev <a href="https://www.mateolaria.site" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6600] transition">Mateo Laria</a> · Técnico Universitario en Programación
        </div>
      </div>
    </footer>
  );
};

export default Footer; 