import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import ConfirmModal from '../components/ConfirmModal';
import { getAllProductos } from '../api/catalogApi';
import type { Producto } from '../api/types';
import { usedProductCategoryForBranch } from '../constants/categories';
import { mediaUrl } from '../utils/mediaUrl';
import { resolveBranchSlug } from '../utils/branch';

const UsedModels: React.FC = () => {
  const { branch } = useParams<{ branch: string }>();
  const branchSlug = resolveBranchSlug(branch);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState('');
  const [list, setList] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const cat = usedProductCategoryForBranch(branchSlug);
        const products = await getAllProductos({ categoria: cat });
        if (!cancelled) setList(products);
      } catch {
        if (!cancelled) setList([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [branchSlug]);

  const categorias = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of list) {
      const c = p.categoria.trim();
      if (c) map.set(c.toLowerCase(), c);
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'es'));
  }, [list]);

  const filtered = useMemo(() => {
    let arr = list.slice();
    const q = query.trim().toLowerCase();
    if (q) arr = arr.filter((m) => m.nombre.toLowerCase().includes(q));
    if (categoria) arr = arr.filter((m) => m.categoria.toLowerCase() === categoria.toLowerCase());
    return arr;
  }, [list, query, categoria]);

  const openWhatsapp = (p: Producto) => {
    const phone = branchSlug === 'parana' ? '5493433007984' : '5493462252244';
    const text = `Hola! Me interesa el ${p.nombre}. ¿Podrías darme más información?`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle className="mb-3">Motos Usadas</SectionTitle>
            <div className="flex flex-col md:flex-row flex-wrap gap-4 md:items-end mt-6">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              {categorias.length > 1 && (
                <div className="min-w-[160px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Todas</option>
                    {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            {isLoading ? (
              <p className="text-center text-gray-600">Cargando motos usadas...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-600">No hay usadas disponibles en este momento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {filtered.map((moto) => (
                  <div key={moto.id} className="group bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden ring-1 ring-gray-200 max-w-[320px] w-full flex flex-col">
                    <Link to={`/${branchSlug}/usadas/${moto.id}`} className="block">
                      <div className="aspect-[4/5] bg-white flex items-center justify-center overflow-hidden p-2">
                        <img src={mediaUrl(moto.fotoUrl)} alt={moto.nombre} className="w-full h-full object-contain group-hover:scale-105 transition" />
                      </div>
                      <div className="p-4 border-t border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 truncate">{moto.nombre}</h3>
                        <div className="text-xs text-gray-600 mt-0.5">{moto.categoria}</div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <button type="button" onClick={() => openWhatsapp(moto)} className="w-full py-2 rounded-xl bg-[#f75000] text-white text-sm font-bold hover:bg-[#ff7a33]">Consultar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <ConfirmModal open={confirmOpen} message="¿Querés ir al formulario de contacto?" confirmLabel="Sí, ir" cancelLabel="Cancelar" onConfirm={() => { setConfirmOpen(false); window.location.href = `/${branchSlug}?used=1#contact`; }} onCancel={() => setConfirmOpen(false)} />
      <Footer />
    </div>
  );
};

export default UsedModels;
