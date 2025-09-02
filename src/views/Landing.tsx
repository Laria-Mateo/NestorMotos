import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleReview from '../components/GoogleReview';
import MotoCarousel from '../components/MotoCarousel';
import FinancingCard from '../components/FinancingCard';
import ContactForm from '../components/ContactForm';
import WhatsAppButton from '../components/WhatsAppButton';
// ... otros imports de componentes (SectionTitle, etc.)
import SectionTitle from '../components/SectionTitle';

import reviewsData from '../data/googleReviews.json';
import motorbikesVenado from '../data/motorbikesVenado.json';
import motorbikesParana from '../data/motorbikesParana.json';

// Definir el tipo de moto
interface Moto {
  id: string;
  name: string;
  cc: number;
  isQuad: boolean;
  image: string;
}

// Definir el tipo de categorías
interface MotoCategories {
  cc110: Moto[];
  cc125_150: Moto[];
  cc250plus: Moto[];
  quads: Moto[];
}

const getRandomReviews = (reviews: typeof reviewsData, count: number) => {
  const shuffled = [...reviews].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const groupMotosByCategory = (motos: Moto[]): MotoCategories => {
  return {
    cc110: motos.filter((m) => m.cc <= 110 && !m.isQuad),
    cc125_150: motos.filter((m) => (m.cc === 125 || m.cc === 150) && !m.isQuad),
    cc250plus: motos.filter((m) => m.cc >= 250 && !m.isQuad),
    quads: motos.filter((m) => m.isQuad),
  };
};

const financingOptions = [
  {
    title: 'Financiación Bancaria',
    description: 'Accedé a planes de financiación a través de bancos con tasas preferenciales y cuotas fijas.'
  },
  {
    title: 'Crédito Personal',
    description: 'Solicitá tu moto con crédito personal, mínimos requisitos y aprobación rápida.'
  },
  {
    title: 'Plan de Ahorro',
    description: 'Sumate a un plan de ahorro y pagá tu moto en cómodas cuotas mensuales.'
  }
];




const Landing: React.FC = () => {
  const [randomReviews, setRandomReviews] = useState<typeof reviewsData>([]);
  const branch = (typeof window !== 'undefined' ? localStorage.getItem('branch') : 'venado') || 'venado';
  const [motoCategories, setMotoCategories] = useState<MotoCategories>({
    cc110: [],
    cc125_150: [],
    cc250plus: [],
    quads: [],
  });
  const [activeTab, setActiveTab] = useState<'cc110' | 'cc125_150' | 'cc250plus' | 'quads'>('cc110');

  useEffect(() => {
    setRandomReviews(getRandomReviews(reviewsData, 3));
    const data = (branch === 'parana' ? (motorbikesParana as Moto[]) : (motorbikesVenado as Moto[]));
    setMotoCategories(groupMotosByCategory(data));
  }, [branch]);

  // Si el usuario cambió de sucursal desde el navbar, no forzar /sucursal
  const branchChanged = (typeof window !== 'undefined' ? sessionStorage.getItem('branchChanged') : null);

  // Scroll a cualquier sección si viene con hash
  const location = useLocation();
  const navigate = useNavigate();

  // Enforce branch selection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('branch');
      if (!saved && !branchChanged) {
        navigate('/sucursal', { replace: true });
      }
      try { if (branchChanged) sessionStorage.removeItem('branchChanged') } catch {}
    }
  }, [navigate, branchChanged]);
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location]);

  // Categorías disponibles según sucursal (oculta las vacías)
  const availableCategories = (
    [
      { key: 'cc110' as const, label: '110CC' },
      { key: 'cc125_150' as const, label: '125/150CC' },
      { key: 'cc250plus' as const, label: '250CC o más' },
      { key: 'quads' as const, label: 'Cuatriciclos' },
    ]
  ).filter(c => (motoCategories[c.key] || []).length > 0);

  // Asegurar activeTab válido
  useEffect(() => {
    if (!motoCategories[activeTab] || motoCategories[activeTab].length === 0) {
      if (availableCategories.length > 0) {
        setActiveTab(availableCategories[0].key);
      }
    }
  }, [motoCategories, activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        
        <section
          id="home"
          className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black hero-background"
          style={{
            backgroundImage: `url(${branch === 'parana' ? '/background2.webp' : '/backgroundVenado.webp'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Capa de color para mejorar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-20" />
          {/* Radiales sutiles con marca */}
          <div className="absolute inset-0 hero-overlay-radials z-10" />
          {/* Grid sutil */}
          <div className="absolute inset-0 hero-grid z-10" />
          {/* Viñeta alrededor */}
          <div className="absolute inset-0 hero-overlay-vignette z-20" />

          <div className="relative z-30 flex flex-col items-center justify-center w-full px-4 text-center">
            <div className="flex flex-col items-center gap-4">
              
              <img
                src={branch === 'parana' ? '/logoSinFondo3.webp' : '/logoSinFondo2.webp'}
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
        
        <section id="about" className="py-20 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <SectionTitle>Sobre Nosotros</SectionTitle>
            <div className="grid md:grid-cols-2 gap-8 items-center">
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
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl shadow p-4">
                  <span className="bg-[#ff6600]/10 p-3 rounded-full">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><circle cx="12" cy="12" r="10" stroke="#ff6600" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
                  </span>
                  <span className="text-lg font-semibold text-black">Horarios: <span className="text-[#ff6600] font-bold">Lun a Vie 8-13hs y 16-20hs, Sáb 9-13hs</span></span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl shadow p-4">
                  <span className="bg-[#ff6600]/10 p-3 rounded-full">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1" /><circle cx="9" cy="7" r="4" stroke="#ff6600" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11v9" /></svg>
                  </span>
                  <span className="text-lg font-semibold text-black">Casa Central: <span className="text-[#ff6600] font-bold">@nestormotosvenadotuerto Venado Tuerto - SF</span></span>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-center">
                {/* MapSwitcher removido; se define por sucursal elegida */}
                <div className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden w-full h-72 flex items-center justify-center relative">
                  <iframe
                    title={`Mapa ${branch === 'parana' ? 'Paraná' : 'Venado Tuerto'}`}
                    src={`https://www.google.com/maps?q=${branch === 'parana' ? '-31.756278196473883,-60.53260317611488' : '-33.74189278721354,-61.958780955946374'}&z=17&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="text-base text-black font-semibold text-center mt-2">
                  Dirección: <span className="text-[#ff6600] font-bold">{branch === 'parana' ? 'Esquina Av. Espejo, Leopoldo Lugones y, E3100 Paraná, Entre Ríos' : 'Av. Sta. Fe 740, S2600 Venado Tuerto, Santa Fe'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="models" className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle>Modelos de Motos</SectionTitle>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {availableCategories.map(c => (
                <button
                  key={c.key}
                  className={`px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm ${activeTab === c.key ? 'bg-[#ff6600] text-white border-[#ff6600] scale-105' : 'bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10'}`}
                  onClick={() => setActiveTab(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {activeTab === 'cc110' && <MotoCarousel motos={motoCategories.cc110} />}
            {activeTab === 'cc125_150' && <MotoCarousel motos={motoCategories.cc125_150} />}
            {activeTab === 'cc250plus' && <MotoCarousel motos={motoCategories.cc250plus} />}
            {activeTab === 'quads' && <MotoCarousel motos={motoCategories.quads} />}

            <div className="mt-6 text-center">
              <Link
                to="/modelos"
                className="px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10"
              >
                Ver todos
              </Link>
            </div>
          </div>
        </section>
        
        <section id="financing" className="py-20 bg-black border-b border-gray-900">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle className="text-white">Tipos de Financiaciones</SectionTitle>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch md:items-stretch">
              {financingOptions.map((option, idx) => (
                <FinancingCard key={idx} title={option.title} description={option.description} />
              ))}
            </div>
          </div>
        </section>
        
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-xl mx-auto px-4">
            <SectionTitle className="mb-8">Contacto</SectionTitle>
            <ContactForm />
          </div>
        </section>

        <section id="reviews" className="py-20 bg-gray-100 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle>Referencias de Google</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {randomReviews.map((review) => (
                <GoogleReview key={review.id} author={review.author} content={review.content} rating={review.rating} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Landing; 