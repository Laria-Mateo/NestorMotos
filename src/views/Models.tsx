import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getAllMarcas, getAllMotos } from '../api/catalogApi';
import { branchSlugToApiSucursal } from '../constants/sucursal';
import type { Marca } from '../api/types';
import { normalizeCilindrada, uniqueCilindradas } from '../utils/cilindrada';
import { motoToCard, type CatalogCard } from '../types/catalog';
import { resolveBranchSlug } from '../utils/branch';

const Models: React.FC = () => {
  const { branch } = useParams<{ branch: string }>();
  const branchSlug = resolveBranchSlug(branch);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [items, setItems] = useState<CatalogCard[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [marcaId, setMarcaId] = useState(searchParams.get('marca') || '');
  const [cilindrada, setCilindrada] = useState(searchParams.get('cc') || '');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const sucursal = branchSlugToApiSucursal(branchSlug);
        const [marcaList, motoList] = await Promise.all([
          getAllMarcas(),
          getAllMotos({ sucursal, es0km: true }),
        ]);
        if (cancelled) return;
        setMarcas(marcaList);
        setItems(motoList.map(motoToCard));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [branchSlug]);

  const cilindradaOptions = useMemo(
    () => uniqueCilindradas(items.filter((m) => m.detailKind === 'moto').map((m) => m.cilindrada)),
    [items],
  );

  const filtered = useMemo(() => {
    let list = items.slice();
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) => m.name.toLowerCase().includes(q) || m.marcaNombre.toLowerCase().includes(q),
      );
    }
    if (marcaId) {
      const mid = Number(marcaId);
      list = list.filter((m) => m.detailKind === 'producto' || m.marcaId === mid);
    }
    if (cilindrada) {
      const target = normalizeCilindrada(cilindrada);
      list = list.filter(
        (m) => m.detailKind === 'producto' || normalizeCilindrada(m.cilindrada) === target,
      );
    }
    return list;
  }, [items, query, marcaId, cilindrada]);

  const updateParams = (next: Partial<{ q: string; marca: string; cc: string }>) => {
    const p = new URLSearchParams(searchParams);
    if (next.q !== undefined) { if (next.q) p.set('q', next.q); else p.delete('q'); }
    if (next.marca !== undefined) { if (next.marca) p.set('marca', next.marca); else p.delete('marca'); }
    if (next.cc !== undefined) { if (next.cc) p.set('cc', next.cc); else p.delete('cc'); }
    setSearchParams(p);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle className="mb-6">Todos los Modelos</SectionTitle>
            <div className="flex flex-col md:flex-row flex-wrap gap-4 md:items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input value={query} onChange={(e) => { setQuery(e.target.value); updateParams({ q: e.target.value }); }} placeholder="Nombre o marca" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <select value={marcaId} onChange={(e) => { setMarcaId(e.target.value); updateParams({ marca: e.target.value }); }} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Todas</option>
                  {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cilindrada</label>
                <select value={cilindrada} onChange={(e) => { setCilindrada(e.target.value); updateParams({ cc: e.target.value }); }} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Todas</option>
                  {cilindradaOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            {loading ? (
              <p className="text-center text-gray-600">Cargando modelos...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-600">No se encontraron modelos con esos filtros.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {filtered.map((moto) => (
                  <Link
                    key={`${moto.detailKind}-${moto.id}`}
                    to={`/${branchSlug}/modelos/${moto.id}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden ring-1 ring-gray-200 max-w-[320px] w-full"
                  >
                    <div className="aspect-[4/5] bg-white flex items-center justify-center p-2">
                      <img src={moto.image} alt={moto.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 truncate">{moto.name}</h3>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {moto.detailKind === 'producto'
                          ? moto.marcaNombre
                          : `${moto.marcaNombre} · ${moto.cilindrada || `${moto.cc}cc`}`}
                      </div>
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
