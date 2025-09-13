import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import motorbikesParana from '../data/motorbikesParana.json';
import { Link, useSearchParams } from 'react-router-dom';

type Moto = {
  id: string;
  name: string;
  cc: number;
  isQuad: boolean;
  image: string;
  colors?: string[];
};

// Opciones de cilindrada dinámicas en base a modelos disponibles

const Models: React.FC = () => {
  // Al entrar a la página, subir al inicio
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const branch = (typeof window !== 'undefined' ? localStorage.getItem('branch') : 'venado') || 'venado';
  // Usar siempre dataset de Paraná
  const data = (motorbikesParana as Moto[]);
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [cc, setCc] = useState<string>(searchParams.get('cc') || '');
  const [onlyQuads, setOnlyQuads] = useState<boolean>(searchParams.get('quads') === '1');

  const ccOptions = useMemo(() => {
    const all = data.map(m => m.cc)
    const unique = Array.from(new Set(all)).sort((a, b) => a - b)
    return unique
  }, [])

  const filtered = useMemo(() => {
    let list = data.slice();
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }
    if (cc) {
      const ccNum = Number(cc);
      list = list.filter(m => m.cc === ccNum);
    }
    if (onlyQuads) {
      list = list.filter(m => m.isQuad);
    }
    return list;
  }, [query, cc, onlyQuads, data]);

  const updateParams = (next: Partial<{ q: string; cc: string; quads: string }>) => {
    const newParams = new URLSearchParams(searchParams);
    if (next.q !== undefined) {
      if (next.q) newParams.set('q', next.q); else newParams.delete('q');
    }
    if (next.cc !== undefined) {
      if (next.cc) newParams.set('cc', next.cc); else newParams.delete('cc');
    }
    if (next.quads !== undefined) {
      if (next.quads) newParams.set('quads', next.quads); else newParams.delete('quads');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle className="mb-6">Todos los Modelos</SectionTitle>
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    updateParams({ q: e.target.value });
                  }}
                  placeholder="Buscar por nombre (ej: Honda, FZ, etc.)"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cilindrada</label>
                <select
                  value={cc}
                  onChange={(e) => {
                    setCc(e.target.value);
                    updateParams({ cc: e.target.value });
                  }}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todas</option>
                  {ccOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}cc</option>
                  ))}
                </select>
              </div>
              <label className="inline-flex items-center gap-2 text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyQuads}
                  onChange={(e) => {
                    setOnlyQuads(e.target.checked);
                    updateParams({ quads: e.target.checked ? '1' : '' });
                  }}
                  className="accent-primary w-5 h-5"
                />
                Solo cuatriciclos
              </label>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-600">No se encontraron modelos con esos filtros.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {filtered.map((moto) => (
                  <Link
                    to={`/modelos/${moto.id}`}
                    key={moto.id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden ring-1 ring-gray-200 max-w-[320px] md:max-w-[340px] w-full"
                  >
                    <div className="aspect-[4/5] bg-white flex items-center justify-center overflow-hidden">
                      <img src={moto.image} alt={moto.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 leading-snug truncate" title={moto.name}>{moto.name}</h3>
                      <div className="text-xs text-gray-600 mt-0.5">{moto.cc}cc {moto.isQuad ? '· Cuatriciclo' : ''}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Models;


