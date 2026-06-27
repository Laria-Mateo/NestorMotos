import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMotoById, getProductoById, getAllMotos } from '../api/catalogApi';
import { branchSlugToApiSucursal } from '../constants/sucursal';
import type { Moto, Producto } from '../api/types';
import { mediaUrl } from '../utils/mediaUrl';
import { motoToCarousel } from '../types/catalog';
import { resolveBranchSlug } from '../utils/branch';

type DetailState =
  | { kind: 'loading' }
  | { kind: 'moto'; data: Moto }
  | { kind: 'producto'; data: Producto }
  | { kind: 'missing' };

const ModelDetail: React.FC = () => {
  const { id, branch } = useParams();
  const navigate = useNavigate();
  const branchSlug = resolveBranchSlug(branch);
  const [state, setState] = useState<DetailState>({ kind: 'loading' });
  const [related, setRelated] = useState<Moto[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id || !/^\d+$/.test(id)) {
        setState({ kind: 'missing' });
        return;
      }
      const numId = Number(id);
      const sucursal = branchSlugToApiSucursal(branchSlug);
      const moto = await getMotoById(numId, sucursal);
      if (cancelled) return;
      if (moto) {
        setState({ kind: 'moto', data: moto });
        const all = await getAllMotos({ sucursal, es0km: moto.es0km });
        if (!cancelled) {
          setRelated(all.filter((m) => m.id !== moto.id && m.marcaId === moto.marcaId).slice(0, 4));
        }
        return;
      }
      const producto = await getProductoById(numId);
      if (cancelled) return;
      if (producto) {
        setState({ kind: 'producto', data: producto });
        setRelated([]);
        return;
      }
      setState({ kind: 'missing' });
    })();
    return () => { cancelled = true; };
  }, [id, branchSlug]);

  if (state.kind === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 grid place-items-center"><p className="text-gray-600">Cargando…</p></main>
        <Footer />
      </div>
    );
  }

  if (state.kind === 'missing') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 grid place-items-center">
          <div className="text-center p-8">
            <p className="text-gray-700 mb-4">Modelo no encontrado.</p>
            <Link to={`/${branchSlug}/modelos`} className="text-primary font-bold">Volver a modelos</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (state.kind === 'producto') {
    const producto = state.data;
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <section className="py-8">
            <div className="max-w-6xl mx-auto px-4">
              <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 mb-4">← Volver</button>
              <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow ring-1 ring-gray-200 overflow-hidden">
                <div className="bg-gray-50 flex items-center justify-center p-6 md:p-10">
                  <img src={mediaUrl(producto.fotoUrl)} alt={producto.nombre} className="w-full max-h-[560px] object-contain" />
                </div>
                <div className="p-6 md:p-8 flex flex-col">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">{producto.nombre}</h1>
                  <p className="mt-3 text-base text-gray-600">{producto.categoria}</p>
                  {producto.descripcion ? (
                    <div className="mt-8 text-gray-800 text-base leading-relaxed whitespace-pre-line">{producto.descripcion}</div>
                  ) : (
                    <p className="mt-8 text-gray-500">Consultá por más detalles.</p>
                  )}
                  <Link
                    to={`/${branchSlug}?modelId=${producto.id}#contact`}
                    className="mt-10 inline-flex px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary-light w-fit"
                  >
                    Consultar disponibilidad
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const moto = state.data;
  const fotos = [...moto.fotos].sort((a, b) => a.orden - b.orden);
  const mainImage = mediaUrl(moto.fotoPrincipalUrl ?? fotos[0]?.fotoUrl);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 mb-4">← Volver</button>
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow ring-1 ring-gray-200 overflow-hidden">
              <div className="bg-gray-50 flex flex-col items-center justify-center p-6 gap-4">
                <img src={mainImage} alt={moto.nombre} className="w-full max-h-[420px] object-contain" />
                {fotos.length > 1 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {fotos.map((f) => (
                      <img key={f.id} src={mediaUrl(f.fotoUrl)} alt="" className="h-16 w-16 object-contain bg-white rounded-lg ring-1 ring-gray-200" />
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{moto.nombre}</h1>
                <p className="text-gray-600 mb-4">{moto.marcaNombre} · {moto.cilindrada}{moto.es0km ? ' · 0 km' : moto.anio ? ` · Año ${moto.anio}` : ''}</p>
                {moto.descripcion && (
                  <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line mb-6">{moto.descripcion}</div>
                )}
                <Link
                  to={`/${branchSlug}?modelId=${moto.id}#contact`}
                  className="inline-block bg-primary text-black font-bold px-6 py-3 rounded-xl shadow hover:bg-primary-light"
                >
                  Consultar disponibilidad
                </Link>
              </div>
            </div>
          </div>
        </section>
        {related.length > 0 && (
          <section className="py-6">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">Relacionados</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((r) => {
                  const card = motoToCarousel(r);
                  return (
                    <Link
                      key={r.id}
                      to={`/${branchSlug}/modelos/${r.id}`}
                      className="group bg-white rounded-xl shadow ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition block"
                    >
                      <div className="aspect-[4/3] bg-white flex items-center justify-center p-2">
                        <img src={card.image} alt={card.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <div className="text-sm font-bold text-gray-900 truncate">{card.name}</div>
                        <div className="text-xs text-gray-600">{r.cilindrada}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ModelDetail;
