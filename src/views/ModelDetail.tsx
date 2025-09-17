import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import motorbikesParana from '../data/motorbikesParana.json';
import useEmblaCarousel from 'embla-carousel-react';

type Moto = {
  id: string;
  name: string;
  cc: number;
  isQuad: boolean;
  image: string;
  colors?: string[];
};

const colorMap: Record<string, string> = {
  Rojo: '#ef4444',
  Azul: '#3b82f6',
  Negro: '#1f2937',
  Blanco: '#f8fafc',
  Verde: '#10b981',
  Amarillo: '#f59e0b',
  Gris: '#6b7280',
  Naranja: '#ff6600',
};

const ModelDetail: React.FC = () => {
  const { id, branch } = useParams();
  const navigate = useNavigate();

  // Usar siempre el dataset de Paraná (también para Venado)
  const allMotorbikes: Moto[] = [...(motorbikesParana as Moto[])];
  const moto = allMotorbikes.find((m) => m.id === id);

  // Asegurar que al entrar a un modelo el scroll inicia arriba
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  const related: Moto[] = useMemo(() => {
    if (!moto) return [] as Moto[];
    // Usar siempre Paraná para "Relacionados"
    const dataset: Moto[] = (motorbikesParana as Moto[]);
    return dataset
      .filter((m) => m.id !== moto.id && m.isQuad === moto.isQuad)
      .sort((a, b) => Math.abs(a.cc - moto.cc) - Math.abs(b.cc - moto.cc))
      .slice(0, 4);
  }, [moto]);

  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth < 768 : true);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [emblaRef/*, emblaApi*/] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', skipSnaps: true });

  if (!moto) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 grid place-items-center">
          <div className="text-center p-8">
            <p className="text-gray-700 mb-4">Modelo no encontrado.</p>
            <Link to={`/${branch || (typeof window !== 'undefined' ? (localStorage.getItem('branch') || 'parana') : 'parana')}/modelos`} className="text-primary font-bold">Volver a modelos</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 mb-4">← Volver</button>
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow ring-1 ring-gray-200 overflow-hidden">
              <div className="bg-white flex items-center justify-center p-6">
                <img src={moto.image} alt={moto.name} className="w-full h-[420px] object-contain" />
              </div>
              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{moto.name}</h1>
                <div className="flex items-center gap-3 text-primary mb-4">
                  <span className="font-semibold">{moto.cc}cc</span>
                  {moto.isQuad && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">CUATRICICLO</span>}
                </div>

                {moto.colors && moto.colors.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-700 mb-2">Colores disponibles</div>
                    <div className="flex gap-2">
                      {moto.colors.map((c, idx) => (
                        <div key={c + idx} className={`w-6 h-6 rounded-full border ${c === 'Blanco' ? 'border-gray-300' : 'border-transparent'}`} style={{ background: colorMap[c] || '#ccc' }} title={c} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-gray-900">Ficha técnica</h2>
                  <ul className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    <li>Marca: <span className="font-semibold">{moto.name.split(' ')[0]}</span></li>
                    <li>Modelo: <span className="font-semibold">{moto.name}</span></li>
                    <li>Cilindrada: <span className="font-semibold">{moto.cc} cc</span></li>
                    <li>Tipo: <span className="font-semibold">{moto.isQuad ? 'Cuatriciclo' : 'Moto'}</span></li>
                  </ul>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/${(branch as string) || (typeof window !== 'undefined' ? (localStorage.getItem('branch') || 'parana') : 'parana')}?modelId=${encodeURIComponent(moto.id)}#contact`}
                    className="inline-block bg-primary text-black font-bold px-6 py-3 rounded-xl shadow hover:bg-primary-light"
                  >
                    Consultar disponibilidad
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Relacionados */}
      {moto && related.length > 0 && (
        <section className="py-6">
          <div className="max-w-6xl mx-auto px-4 relative">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">Relacionados</h2>
            {isMobile ? (
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {related.map((r) => (
                    <div key={r.id} className="shrink-0 basis-full pr-4">
                      <Link
                        to={`/${(branch as string) || (typeof window !== 'undefined' ? (localStorage.getItem('branch') || 'parana') : 'parana')}/modelos/${r.id}`}
                        className="group bg-white rounded-xl shadow ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition block"
                      >
                        <div className="aspect-[4/3] bg-white flex items-center justify-center">
                          <img src={r.image} alt={r.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                        </div>
                        <div className="p-3 border-t border-gray-100">
                          <div className="text-sm font-bold text-gray-900 truncate" title={r.name}>{r.name}</div>
                          <div className="text-xs text-gray-600">{r.cc}cc {r.isQuad ? '· Cuatriciclo' : ''}</div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {related.map((r) => (
                  <Link
                    to={`/${(branch as string) || (typeof window !== 'undefined' ? (localStorage.getItem('branch') || 'parana') : 'parana')}/modelos/${r.id}`}
                    key={r.id}
                    className="group bg-white rounded-xl shadow ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition block"
                  >
                    <div className="aspect-[4/3] bg-white flex items-center justify-center">
                      <img src={r.image} alt={r.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <div className="text-sm font-bold text-gray-900 truncate" title={r.name}>{r.name}</div>
                      <div className="text-xs text-gray-600">{r.cc}cc {r.isQuad ? '· Cuatriciclo' : ''}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default ModelDetail;


