import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import {
  ProductService,
  MULTISITE_CATEGORY_USADAS,
  formatUsedMotoMeta,
  resolveUsedMotoWhatsappText,
  type UsedMoto,
} from '../services/productService';
import ConfirmModal from '../components/ConfirmModal';
import { getUsedMotoDisplayImage } from '../utils/usedMotoImage';

const UsedModels: React.FC = () => {
  const { branch } = useParams<{ branch: string }>();
  const branchPath = branch || (typeof window !== 'undefined' ? localStorage.getItem('branch') || 'parana' : 'parana');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [formModelo, setFormModelo] = useState('');
  const [formAnio, setFormAnio] = useState('');
  const [formKm, setFormKm] = useState('');
  const [formObs, setFormObs] = useState('');
  const [tModelo, setTModelo] = useState(false);
  const [tAnio, setTAnio] = useState(false);
  const [tKm, setTKm] = useState(false);
  const [list, setList] = useState<UsedMoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await ProductService.getProductsByCategoryName(MULTISITE_CATEGORY_USADAS);
        setList(products);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setList([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const years = useMemo(() => {
    const ys = list.map((m) => m.year).filter((y): y is number => y != null && Number.isFinite(y));
    return Array.from(new Set(ys)).sort((a, b) => b - a);
  }, [list]);

  const categories = useMemo(() => {
    const map = new Map<number, string>();
    for (const m of list) {
      const cid = m.categoryId;
      if (cid == null || !Number.isFinite(cid)) continue;
      if (!map.has(cid)) {
        const label = (m.categoryName || '').trim() || `Categoría ${cid}`;
        map.set(cid, label);
      }
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1], 'es'));
  }, [list]);

  const hasData = list.length > 0;
  const filtered = useMemo(() => {
    let arr = list.slice();
    const q = query.trim().toLowerCase();
    if (q) arr = arr.filter(m => m.name.toLowerCase().includes(q));
    if (year) arr = arr.filter((m) => m.year != null && String(m.year) === year);
    if (categoryId) {
      const cid = Number(categoryId);
      arr = arr.filter((m) => m.categoryId != null && m.categoryId === cid);
    }
    return arr;
  }, [list, query, year, categoryId]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmAndGo = () => {
    setConfirmOpen(true);
  };
  const handleConfirm = () => {
    setConfirmOpen(false);
    try {
      sessionStorage.removeItem('usedModel');
      sessionStorage.removeItem('usedYear');
      sessionStorage.removeItem('usedKm');
    } catch {}
    const currentBranch = (typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || localStorage.getItem('branch') || 'parana') : 'parana');
    window.location.href = `/${currentBranch}?used=1#contact`;
  };

  const openUsedWhatsapp = (moto: UsedMoto) => {
    const br = typeof window !== 'undefined' ? localStorage.getItem('branch') || 'parana' : 'parana';
    const WHATSAPP_PARANA = '5493433007984';
    const WHATSAPP_VENADO = '5493462252244';
    const phone = br === 'parana' ? WHATSAPP_PARANA : WHATSAPP_VENADO;
    const text = resolveUsedMotoWhatsappText(moto);
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const canSubmit = useMemo(() => {
    const modelOk = formModelo.trim().length > 0;
    const yearOk = /^\d{4}$/.test(formAnio.trim());
    const kmOk = /^\d{1,7}$/.test(formKm.trim());
    return modelOk && yearOk && kmOk;
  }, [formModelo, formAnio, formKm]);
  const modelOk = formModelo.trim().length > 0;
  const yearOk = /^\d{4}$/.test(formAnio.trim());
  const kmOk = /^\d{1,7}$/.test(formKm.trim());

  const submitUsedForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setTModelo(true);
      setTAnio(true);
      setTKm(true);
      return;
    }
    const branch = (typeof window !== 'undefined' ? (localStorage.getItem('branch') || 'parana') : 'parana');
    const WHATSAPP_PARANA = '5493433007984';
    const WHATSAPP_VENADO = '5493462252244';
    const phone = branch === 'parana' ? WHATSAPP_PARANA : WHATSAPP_VENADO;
    let mensaje = 'USADAS.\n';
    const lines: string[] = [];
    if (formModelo) lines.push(`Modelo: ${formModelo}`);
    if (formAnio) lines.push(`Año: ${formAnio}`);
    if (formKm) lines.push(`Kilometraje: ${Number(formKm).toLocaleString()} km`);
    if (formObs) lines.push(`Observaciones: ${formObs}`);
    if (lines.length === 0) lines.push('Consulta general por usadas.');
    mensaje += lines.join('\n');
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <SectionTitle className="mb-3">Motos Usadas</SectionTitle>
              <button
                type="button"
                onClick={() => { const el = document.getElementById('used-form'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className="inline-flex items-center px-5 py-2 rounded-xl bg-[#f75000] text-white font-bold shadow hover:bg-[#ff7a33] transition"
              >
                Cotizá tu usada sin costo
              </button>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap gap-4 md:items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nombre"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="min-w-[160px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todas</option>
                  {categories.map(([id, label]) => (
                    <option key={id} value={String(id)}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            {isLoading ? (
              <p className="text-center text-gray-600">Cargando motos usadas...</p>
            ) : !hasData ? (
              <p className="text-center text-gray-600">No hay modelos disponibles en la web, consultar por modelos</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-600">No hay usadas que coincidan con tu búsqueda.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {filtered.map((moto, idx) => {
                  const displaySrc = getUsedMotoDisplayImage(moto, idx);
                  return (
                    <div key={moto.id} className="group bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden ring-1 ring-gray-200 max-w-[320px] md:max-w-[340px] w-full flex flex-col">
                      <Link
                        to={`/${branchPath}/usadas/${moto.id}`}
                        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-xl"
                      >
                        <div className="aspect-[4/5] bg-white flex items-center justify-center overflow-hidden">
                          <img
                            src={displaySrc}
                            alt={moto.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.onerror = null;
                              img.src = '/logoSinFondo3.webp';
                            }}
                          />
                        </div>
                        <div className="p-4 border-t border-gray-100">
                          <h3 className="text-base font-bold text-gray-900 leading-snug truncate" title={moto.name}>{moto.name}</h3>
                          <div className="text-xs text-gray-600 mt-0.5">{formatUsedMotoMeta(moto)}</div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4 pt-0">
                        <button
                          type="button"
                          onClick={() => openUsedWhatsapp(moto)}
                          className="inline-flex items-center px-4 py-2 rounded-xl bg-[#f75000] text-white text-sm font-bold hover:bg-[#ff7a33] transition w-full justify-center sm:w-auto"
                        >
                          Consultar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-4">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <button
              type="button"
              onClick={() => confirmAndGo()}
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-white text-[#f75000] font-extrabold border-2 border-[#f75000] hover:bg-[#ff7a33]/10 transition"
            >
              Consultar por usadas (sin seleccionar modelo)
            </button>
          </div>
        </section>

        <section id="used-form" className="py-10 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">¿Querés cotizar tu usada?</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submitUsedForm}>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  value={formModelo}
                  onChange={(e)=>setFormModelo(e.target.value)}
                  onBlur={()=>setTModelo(true)}
                  aria-invalid={tModelo && !modelOk}
                  className={`w-full bg-white border rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 ${tModelo && !modelOk ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                  placeholder="Ej: Honda Wave 110"
                />
                {tModelo && !modelOk && (
                  <p className="mt-1 text-sm text-red-600">Ingresá el modelo.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <input
                  value={formAnio}
                  onChange={(e)=>{
                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormAnio(v);
                  }}
                  onBlur={()=>setTAnio(true)}
                  aria-invalid={tAnio && !yearOk}
                  className={`w-full bg-white border rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 ${tAnio && !yearOk ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                  placeholder="Ej: 2019"
                  inputMode="numeric"
                  maxLength={4}
                />
                {tAnio && !yearOk && (
                  <p className="mt-1 text-sm text-red-600">Ingresá un año válido (4 dígitos).</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
                <input
                  value={formKm}
                  onChange={(e)=>{
                    const v = e.target.value.replace(/\D/g, '').slice(0, 7);
                    setFormKm(v);
                  }}
                  onBlur={()=>setTKm(true)}
                  aria-invalid={tKm && !kmOk}
                  className={`w-full bg-white border rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 ${tKm && !kmOk ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                  placeholder="Ej: 22000"
                  inputMode="numeric"
                  maxLength={7}
                />
                {tKm && !kmOk && (
                  <p className="mt-1 text-sm text-red-600">Ingresá solo números (sin puntos).</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
                <textarea value={formObs} onChange={(e)=>setFormObs(e.target.value)} rows={3} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej: Estado, accesorios, detalles" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={!canSubmit} className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#f75000] text-white font-bold hover:bg-[#ff7a33] transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Cotizar por WhatsApp
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <ConfirmModal
        open={confirmOpen}
        message="¿Querés ir al formulario para consultar por esta usada?"
        subtitle={undefined}
        confirmLabel="Sí, ir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
      <Footer />
    </div>
  );
};

export default UsedModels;


