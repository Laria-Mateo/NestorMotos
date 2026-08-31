import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ClientsMarquee from '../components/ClientsMarquee';
import MotoCarousel from '../components/MotoCarousel';
import FinancingCard from '../components/FinancingCard';
import ContactForm from '../components/ContactForm';
import WhatsAppButton from '../components/WhatsAppButton';
import FinancingModal from '../components/FinancingModal';
import TallerModal from '../components/TallerModal';
import SectionTitle from '../components/SectionTitle';
import BrandFilterBar from '../components/BrandFilterBar';
import HeroBackgroundVideo from '../components/HeroBackgroundVideo';
import OnlineSalesSection from '../components/OnlineSalesSection';
import { getAllMarcas, getAllMotos, getAllProductos } from '../api/catalogApi';
import type { Marca } from '../api/types';
import { PRODUCT_CATEGORY_ELECTRICAS } from '../constants/categories';
import { branchLocations } from '../constants/branchLocations';
import {
  groupCarouselMotos,
  motoToCarousel,
  productoToCarousel,
  type CarouselBuckets,
  type CarouselMoto,
} from '../types/catalog';
import { CILINDRADA_BUCKET_LABELS, type CilindradaBucket } from '../utils/cilindrada';
import { branchSlugToApiSucursal } from '../constants/sucursal';
import { resolveBranchSlug } from '../utils/branch';
import { mapsEmbedUrl } from '../utils/mapsEmbed';

// const getRandomReviews = (reviews: typeof reviewsData, count: number) => {
//   const shuffled = [...reviews].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

const groupMotosByCategory = (motos: CarouselMoto[]): CarouselBuckets => groupCarouselMotos(motos);

type CarouselTab = CilindradaBucket | 'quads' | 'electricas';

const financingOptions = [
  {
    title: 'Financiación Total al 100%',
    subtitle: '¡LA MÁS ELEGIDA POR NUESTROS CLIENTES!',
    items: [
      'SIN ENTREGA',
      'SOLO CON DNI'
    ],
    option: 1 as const,
    showCuota: true
  },
  {
    title: 'Financiación Parcial',
    items: [
      'CON ENTREGA ECONÓMICA'
    ],
    option: 2 as const,
    showCuota: true
  },
  {
    title: 'Plan Canje',
    items: [
      'TOMAMOS TU USADA COMO PARTE DE PAGO'
    ],
    option: 3 as const,
    showCuota: true
  }
];




const Landing: React.FC = () => {
  const branchFromPath = (typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '');
  const branch = resolveBranchSlug(branchFromPath || (typeof window !== 'undefined' ? localStorage.getItem('branch') : null));
  const [motoCategories, setMotoCategories] = useState<CarouselBuckets>({
    cc110: [],
    cc125_150: [],
    cc160plus: [],
    quads: [],
  });
  const [electricMotos, setElectricMotos] = useState<CarouselMoto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [selectedMarcaId, setSelectedMarcaId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<CarouselTab | null>('cc110');
  const [selectedFinancingOption, setSelectedFinancingOption] = useState<1 | 2 | 3 | null>(null);
  const [isTallerModalOpen, setIsTallerModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sucursal = branchSlugToApiSucursal(branch);
      const [motos, marcasData] = await Promise.all([
        getAllMotos({ sucursal, es0km: true }),
        getAllMarcas(),
      ]);
      if (cancelled) return;
      const carousel = motos.map(motoToCarousel);
      setMotoCategories(groupMotosByCategory(carousel));
      setMarcas(marcasData.filter((m) => m.activo));
      setSelectedMarcaId(null);
      setActiveTab('cc110');
    })();
    return () => { cancelled = true; };
  }, [branch]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const products = await getAllProductos({ categoria: PRODUCT_CATEGORY_ELECTRICAS });
      if (cancelled) return;
      setElectricMotos(products.map(productoToCarousel));
    })();
    return () => { cancelled = true; };
  }, []);

  // Si el usuario cambió de sucursal desde el navbar, no forzar /sucursal
  const branchChanged = (typeof window !== 'undefined' ? sessionStorage.getItem('branchChanged') : null);

  // Scroll a cualquier sección si viene con hash
  const location = useLocation();
  

  // En entornos con rutas por sucursal, no forzar redirección
  useEffect(() => {
    try { if (branchChanged) sessionStorage.removeItem('branchChanged') } catch {}
  }, [branchChanged]);
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location]);

  // Prellenado desde /usadas o tarjeta: ?used=1&usedModel=...&usedYear=...&usedKm=...
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(location.search);
    const used = params.get('used');
    if (used === '1') {
      try {
        sessionStorage.setItem('showFormHint', '1');
      } catch {}
      // Guardar en session para que ContactForm lea y prellene
      const usedModel = params.get('usedModel') || '';
      const usedYear = params.get('usedYear') || '';
      const usedKm = params.get('usedKm') || '';
      try {
        sessionStorage.setItem('usedModel', usedModel);
        sessionStorage.setItem('usedYear', usedYear);
        sessionStorage.setItem('usedKm', usedKm);
      } catch {}
    }
  }, [location.search]);

  const availableCategories = useMemo(
    () =>
      (
        [
          { key: 'cc110' as const, label: CILINDRADA_BUCKET_LABELS.cc110 },
          { key: 'cc125_150' as const, label: CILINDRADA_BUCKET_LABELS.cc125_150 },
          { key: 'cc160plus' as const, label: CILINDRADA_BUCKET_LABELS.cc160plus },
          { key: 'quads' as const, label: 'Cuatriciclos' },
        ] as const
      ).filter((c) => (motoCategories[c.key] || []).length > 0),
    [motoCategories],
  );

  const categoryTabs = useMemo(() => {
    const rows: { key: CarouselTab; label: string }[] = availableCategories.map((c) => ({
      key: c.key,
      label: c.label,
    }));
    if (electricMotos.length > 0) {
      rows.push({ key: 'electricas', label: 'Eléctricas' });
    }
    return rows;
  }, [availableCategories, electricMotos.length]);

  useEffect(() => {
    if (selectedMarcaId) return;

    if (activeTab === 'electricas') {
      if (electricMotos.length === 0) {
        const first = availableCategories[0];
        if (first) setActiveTab(first.key);
      }
      return;
    }
    if (!activeTab) {
      if (availableCategories[0]) setActiveTab(availableCategories[0].key);
      else if (electricMotos.length > 0) setActiveTab('electricas');
      return;
    }
    const motosInTab = motoCategories[activeTab];
    if (!motosInTab || motosInTab.length === 0) {
      if (electricMotos.length > 0) setActiveTab('electricas');
      else if (availableCategories[0]) setActiveTab(availableCategories[0].key);
    }
  }, [motoCategories, activeTab, electricMotos.length, availableCategories, selectedMarcaId]);

  const allMotosInCarousel = useMemo(
    () => [
      ...motoCategories.cc110,
      ...motoCategories.cc125_150,
      ...motoCategories.cc160plus,
      ...motoCategories.quads,
    ],
    [motoCategories],
  );

  const handleCilindradaTab = (key: CarouselTab) => {
    setSelectedMarcaId(null);
    setActiveTab(key);
  };

  const handleMarcaSelect = (marcaId: number | null) => {
    if (marcaId) {
      setSelectedMarcaId(marcaId);
      setActiveTab(null);
      return;
    }
    setSelectedMarcaId(null);
    const first = availableCategories[0]?.key;
    if (first) setActiveTab(first);
    else if (electricMotos.length > 0) setActiveTab('electricas');
  };

  const marcasConMotos = useMemo(() => {
    const ids = new Set<number>();
    for (const bucket of Object.values(motoCategories)) {
      for (const m of bucket) ids.add(m.marcaId);
    }
    return marcas
      .filter((m) => ids.has(m.id))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [marcas, motoCategories]);

  const carouselMotos = useMemo(() => {
    if (selectedMarcaId) {
      return allMotosInCarousel.filter((m) => m.marcaId === selectedMarcaId);
    }
    if (activeTab === 'electricas') return electricMotos;
    if (activeTab) return motoCategories[activeTab] ?? [];
    return [];
  }, [activeTab, motoCategories, electricMotos, selectedMarcaId, allMotosInCarousel]);

  const locations = branchLocations(branch);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        
        <section
          id="home"
          className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black hero-background"
        >
          {branch === 'parana' ? (
            <HeroBackgroundVideo
              posterSrc="/background2.webp"
              mp4Src="/videos/parana-hero.mp4"
            />
          ) : (
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/backgroundVenado.webp)' }}
              aria-hidden
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-20" />
          <div className="absolute inset-0 hero-overlay-radials z-10" />
          <div className="absolute inset-0 hero-grid z-10" />
          <div className="absolute inset-0 hero-overlay-vignette z-20" />

          <div className="relative z-30 flex flex-col items-center justify-center w-full px-4 text-center">
            <div className="flex flex-col items-center gap-4">
              
              <img
                src={branch === 'parana' ? '/logoSinFondo3.webp' : '/logoSinFondo3.webp'}
                alt="Logo Nestor Motos"
                className="h-16 md:h-20 w-auto object-contain shadow-lg mb-4"
                draggable="false"
                style={{ pointerEvents: 'none', background: 'transparent', borderRadius: 0, border: 'none' }}
              />
              <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-2">
                Tu próxima moto, hoy.
              </h1>
              <span className="block text-xl md:text-2xl text-white/95 font-semibold bg-black/40 rounded-xl px-4 py-2 mx-auto max-w-fit backdrop-blur-sm">
                0km y usadas · Financiación <span className="text-primary font-extrabold">sólo con DNI</span>
              </span>
              <a
                href="#models"
                className="mt-8 inline-block font-bold px-10 py-4 rounded-xl text-lg shadow-2xl bg-[#ff6600] text-white hover:bg-[#ff944d] active:bg-[#cc5200] focus:outline-none focus:ring-4 focus:ring-[#ff6600]/40 transition relative z-40 btn-underline-gradient"
                onClick={e => {
                  e.preventDefault();
                  document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Modelos
              </a>
              
            </div>
          </div>
        </section>

        <section id="models" className="py-20 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 border-b border-gray-300">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle>Modelos que trabajamos</SectionTitle>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {categoryTabs.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm ${activeTab === c.key && selectedMarcaId === null ? 'bg-[#ff6600] text-white border-[#ff6600] scale-105' : 'bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10'}`}
                  onClick={() => handleCilindradaTab(c.key)}
                >
                  {c.label}
                </button>
              ))}
              <a
                href={`/${branch}/usadas`}
                className="px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10"
              >
                Usadas
              </a>
            </div>
            {activeTab !== 'electricas' && marcasConMotos.length > 0 && (
              <BrandFilterBar
                marcas={marcasConMotos}
                selectedMarcaId={selectedMarcaId}
                onSelect={handleMarcaSelect}
              />
            )}
            {carouselMotos.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No hay modelos con ese filtro en esta categoría.</p>
            ) : (
              <MotoCarousel motos={carouselMotos} />
            )}

            <div className="mt-6 text-center">
              <Link
                to={`/${branch}/modelos`}
                className="px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10"
              >
                Ver todos
              </Link>
            </div>
          </div>
        </section>

        {branch === 'parana' && <OnlineSalesSection />}
        
        <section id="financing" className="py-20 bg-black border-b border-gray-900">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle className="text-white">Métodos de Pago</SectionTitle>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch md:items-stretch">
              {financingOptions.map((option, idx) => (
                <FinancingCard 
                  key={idx} 
                  title={option.title}
                  subtitle={option.subtitle}
                  items={option.items}
                  showCuota={option.showCuota}
                  onConsultar={() => option.option && setSelectedFinancingOption(option.option)}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-white font-bold text-lg uppercase mb-4 tracking-wide">Para consultas personalizadas o contado</p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block px-8 py-3 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition shadow-lg"
              >
                Consultar
              </a>
            </div>
            <FinancingModal
              isOpen={selectedFinancingOption !== null}
              onClose={() => setSelectedFinancingOption(null)}
              option={selectedFinancingOption || 1}
            />
          </div>
        </section>
        
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-xl mx-auto px-4">
            <SectionTitle className="mb-8">Contacto</SectionTitle>
            <ContactForm />
          </div>
        </section>

        <section id="servicios" className="py-20 bg-white border-b border-gray-200">
          <div className={`mx-auto px-4 ${branch === 'parana' ? 'max-w-5xl' : 'max-w-4xl'}`}>
            <SectionTitle>Servicios</SectionTitle>
            <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              Financiación, marcas, taller y horarios de atención.
            </p>
            {branch === 'parana' ? (
              <div className="flex flex-col gap-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl shadow p-4">
                    <span className="bg-[#ff6600]/10 p-3 rounded-full shrink-0">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-lg font-semibold text-black">Financiamos tu moto <span className="text-[#ff6600] font-bold">solo con DNI</span></span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl shadow p-4">
                    <span className="bg-[#ff6600]/10 p-3 rounded-full shrink-0">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v-2a4 4 0 014-4h8a4 4 0 014 4v2" /><circle cx="12" cy="7" r="4" stroke="#ff6600" strokeWidth={2}/></svg>
                    </span>
                    <span className="text-lg font-semibold text-black">Trabajamos <span className="text-[#ff6600] font-bold">todas las marcas</span></span>
                  </div>
                  <div className="flex items-start gap-4 bg-gray-50 rounded-xl shadow p-4">
                    <span className="bg-[#ff6600]/10 p-3 rounded-full shrink-0">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><circle cx="12" cy="12" r="10" stroke="#ff6600" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
                    </span>
                    <div className="text-lg font-semibold text-black">
                      Horarios
                      <div className="mt-1 text-base font-normal text-black/80 leading-relaxed">
                        <div><span className="text-[#ff6600] font-bold">Lunes a Viernes</span>: 08:00–13:00 y 16:00–20:00</div>
                        <div><span className="text-[#ff6600] font-bold">Sábados</span>: 09:00–13:00</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl shadow p-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-[#ff6600]/10 p-3 rounded-full shrink-0">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l3-3 3 3M9 7l3 3 3-3" /></svg>
                      </span>
                      <span className="text-lg font-bold text-[#ff6600] uppercase">TALLER PROPIO</span>
                    </div>
                    <button
                      onClick={() => setIsTallerModalOpen(true)}
                      className="px-4 py-2 bg-[#ff6600] hover:bg-[#ff7a33] text-white font-bold rounded-xl transition shrink-0"
                    >
                      Por turnos
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Link
                    to={`/${branch}/empresa`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#ff6600] hover:bg-[#ff7a33] text-white font-bold rounded-xl transition"
                  >
                    Conocé el equipo y nuestros locales
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl shadow p-4">
                    <span className="bg-[#ff6600]/10 p-3 rounded-full">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-lg font-semibold text-black">Financiamos tu moto <span className="text-[#ff6600] font-bold">solo con DNI</span></span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl shadow p-4">
                    <span className="bg-[#ff6600]/10 p-3 rounded-full">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v-2a4 4 0 014-4h8a4 4 0 014 4v2" /><circle cx="12" cy="7" r="4" stroke="#ff6600" strokeWidth={2}/></svg>
                    </span>
                    <span className="text-lg font-semibold text-black">Trabajamos <span className="text-[#ff6600] font-bold">todas las marcas</span></span>
                  </div>
                  <div className="flex items-start gap-4 bg-gray-50 rounded-xl shadow p-4">
                    <span className="bg-[#ff6600]/10 p-3 rounded-full">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><circle cx="12" cy="12" r="10" stroke="#ff6600" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
                    </span>
                    <div className="text-lg font-semibold text-black">
                      Horarios
                      <div className="mt-1 text-base font-normal text-black/80 leading-relaxed">
                        <div><span className="text-[#ff6600] font-bold">Lunes a Viernes</span>: 08:00–13:00 y 16:00–20:00</div>
                        <div><span className="text-[#ff6600] font-bold">Sábados</span>: 09:00–13:00</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl shadow p-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-[#ff6600]/10 p-3 rounded-full">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l3-3 3 3M9 7l3 3 3-3" /></svg>
                      </span>
                      <span className="text-lg font-bold text-[#ff6600] uppercase">TALLER PROPIO</span>
                    </div>
                    <button
                      onClick={() => setIsTallerModalOpen(true)}
                      className="px-4 py-2 bg-[#ff6600] hover:bg-[#ff7a33] text-white font-bold rounded-xl transition"
                    >
                      Por turnos
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  {locations.map((loc) => (
                    <div key={loc.label} className="flex flex-col gap-3">
                      <h3 className="text-sm font-bold text-[#ff6600] uppercase tracking-wide">{loc.label}</h3>
                      <div className="relative bg-gray-100 rounded-2xl shadow-lg overflow-hidden w-full h-56">
                        <iframe
                          title={`Mapa ${loc.label}`}
                          src={mapsEmbedUrl(loc.mapQuery)}
                          className="absolute inset-0 w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <p className="text-base text-black font-semibold text-center">
                        <span className="text-[#ff6600] font-bold">{loc.address}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <TallerModal
          isOpen={isTallerModalOpen}
          onClose={() => setIsTallerModalOpen(false)}
        />

        <section
          id="reviews"
          className="relative py-20 border-b border-gray-900 overflow-hidden bg-black"
          style={{
            backgroundImage: `url(${branch === 'parana' ? '/background2.webp' : '/backgroundVenado.webp'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-10" />
          <div className="absolute inset-0 hero-overlay-radials z-10" />
          <div className="absolute inset-0 hero-grid z-10" />
          <div className="absolute inset-0 hero-overlay-vignette z-10" />
          <div className="relative z-20 max-w-6xl mx-auto px-4">
            <SectionTitle className="text-white">Clientes felices</SectionTitle>
            <ClientsMarquee />
            <p className="mt-6 text-center text-sm text-white/80">Fotos en sucursal Paraná.</p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Landing; 