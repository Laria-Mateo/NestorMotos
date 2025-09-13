import React from 'react';

const Footer: React.FC = () => {
  const branch = (typeof window !== 'undefined' ? localStorage.getItem('branch') : 'venado') || 'venado';
  return (
    <footer className="w-full bg-black text-white pt-10 pb-0 mt-12 shadow-inner">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <img src={branch === 'parana' ? '/logoSinFondo3.webp' : '/logoSinFondo3.webp'} alt="Logo Nestor Motos" className="h-20 w-auto object-contain" draggable="false" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/20 pt-8">
          <div>
            <h3 className="text-lg font-extrabold mb-3">Venado Tuerto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-[#f75000] shrink-0" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5A2.25 2.25 0 0021 19.5v-1.372c0-.518-.352-.966-.852-1.09l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a.75.75 0 01-.82.262A12.035 12.035 0 016.62 10.761a.75.75 0 01.262-.82l1.293-.97c.371-.278.544-.739.417-1.173L7.46 3.102A1.125 1.125 0 006.37 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span><a href="tel:+5493462252244" className="hover:text-[#ff6600] transition">+54 9 3462 252244</a></span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-[#f75000] shrink-0" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span><a href="mailto:nestormotos@gmail.com" className="hover:text-[#ff6600] transition">nestormotos@gmail.com</a></span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-[#f75000] shrink-0" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>Av. Sta. Fe 740, S2600 Venado Tuerto, Santa Fe</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-[#f75000] shrink-0" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3h10.5A2.25 2.25 0 0119.5 5.25v10.5A2.25 2.25 0 0117.25 18H6.75A2.25 2.25 0 014.5 15.75V5.25A2.25 2.25 0 016.75 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75h.008v.008h-.008z" />
                </svg>
                <span><a href="https://www.instagram.com/nestormotosvenadotuerto/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6600] transition">@nestormotosvenadotuerto</a></span>
              </li>
            </ul>
          </div>
          <div className="md:border-l md:border-white/20 md:pl-8">
            <h3 className="text-lg font-extrabold mb-3">Paraná</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-[#f75000] shrink-0" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5A2.25 2.25 0 0021 19.5v-1.372c0-.518-.352-.966-.852-1.09l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a.75.75 0 01-.82.262A12.035 12.035 0 016.62 10.761a.75.75 0 01.262-.82l1.293-.97c.371-.278.544-.739.417-1.173L7.46 3.102A1.125 1.125 0 006.37 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span><a href="tel:+5493433007984" className="hover:text-[#ff6600] transition">+54 9 343 300-7984</a></span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-[#f75000] shrink-0" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span><a href="mailto:nestormotos@gmail.com" className="hover:text-[#ff6600] transition">nestormotos@gmail.com</a></span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-[#f75000] shrink-0" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>Esquina Av. Espejo, Leopoldo Lugones y, E3100 Paraná, Entre Ríos</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-[#f75000] shrink-0" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3h10.5A2.25 2.25 0 0119.5 5.25v10.5A2.25 2.25 0 0117.25 18H6.75A2.25 2.25 0 014.5 15.75V5.25A2.25 2.25 0 016.75 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75h.008v.008h-.008z" />
                </svg>
                <span><a href="https://www.instagram.com/nestormotos2/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6600] transition">@nestormotos2</a></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full bg-white text-black text-center py-2 text-xs font-semibold mt-8">
        <div className="mb-2">© 2025 Nestor Motos</div>
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