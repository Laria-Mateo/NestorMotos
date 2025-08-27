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
    navigate('/')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/backgroundVenado.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="relative z-10 max-w-xl w-full px-6 py-10 bg-white/90 backdrop-blur rounded-2xl shadow-xl text-center">
        <img src="/logoSinFondo2.webp" alt="Néstor Motos" className="h-20 w-auto mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Elegí la sucursal</h1>
        <p className="text-gray-600 mb-6">¿Qué sucursal querés ver?</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={() => choose('venado')} className="px-6 py-3 rounded-xl font-bold bg-[#ff6600] text-white hover:bg-[#ff944d] transition">Venado Tuerto</button>
          <button onClick={() => choose('parana')} className="px-6 py-3 rounded-xl font-bold bg-[#ff6600] text-white hover:bg-[#ff944d] transition">Paraná</button>
        </div>
      </div>
    </div>
  );
};

export default BranchSelect;


