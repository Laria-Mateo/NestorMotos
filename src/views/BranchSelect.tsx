import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BranchSelect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Al entrar a selección, borrar la sucursal previa para forzar re-elección
    try { localStorage.removeItem('branch') } catch {}
  }, []);

  const choose = (b: 'venado' | 'parana') => {
    try { localStorage.setItem('branch', b) } catch {}
    navigate(`/${b}`)
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black">
      <div className="absolute inset-0" style={{ backgroundImage: 'url(/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="relative z-10 max-w-2xl w-full px-6 py-10 text-center text-white">
        <img src="/logoSinFondo3.webp" alt="Néstor Motos" className="h-28 md:h-36 w-auto mx-auto mb-6" />
        <p className="mb-8 text-white text-xl md:text-2xl font-extrabold">¿Qué sucursal querés ver?</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={() => choose('venado')} className="px-8 py-4 rounded-2xl font-extrabold bg-white text-[#f75000] border-8 border-[#201d1d] hover:bg-white/90 transition uppercase tracking-wide text-lg md:text-xl min-w-[260px]">
            Venado Tuerto, SF
          </button>
          <button onClick={() => choose('parana')} className="px-8 py-4 rounded-2xl font-extrabold bg-white text-[#f75000] border-8 border-[#201d1d] hover:bg-white/90 transition uppercase tracking-wide text-lg md:text-xl min-w-[260px]">
            Paraná, ER
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchSelect;


