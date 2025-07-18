import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleReview from '../components/GoogleReview';
import Carousel from '../components/Carousel';
import MotoCarousel from '../components/MotoCarousel';
import FinancingCard from '../components/FinancingCard';
import ContactForm from '../components/ContactForm';
// ... otros imports de componentes (SectionTitle, etc.)
import SectionTitle from '../components/SectionTitle';

import reviewsData from '../data/googleReviews.json';
import customersData from '../data/customers.json';
import motorbikesData from '../data/motorbikes.json';

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
    cc110: motos.filter((m) => m.cc === 110 && !m.isQuad),
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
  const [motoCategories, setMotoCategories] = useState<MotoCategories>({
    cc110: [],
    cc125_150: [],
    cc250plus: [],
    quads: [],
  });
  const [activeTab, setActiveTab] = useState<'cc110' | 'cc125_150' | 'cc250plus' | 'quads'>('cc110');

  useEffect(() => {
    setRandomReviews(getRandomReviews(reviewsData, 3));
    setMotoCategories(groupMotosByCategory(motorbikesData as Moto[]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        
        <section
          id="home"
          className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black hero-background"
          style={{
            backgroundImage: 'url(/background2.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-20" />
          
          <div className="relative z-30 flex flex-col items-center justify-center w-full px-4 text-center">
            <div className="flex flex-col items-center gap-4">
              
              <img
                src="/logo.webp"
                alt="Logo Nestor Motos"
                className="w-40 md:w-56 object-contain shadow-lg mb-4"
                draggable="false"
                style={{ pointerEvents: 'none', background: 'transparent', borderRadius: 0, border: 'none' }}
              />
              <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-2">Tu próxima moto, hoy.</h1>
              <span className="block text-xl md:text-2xl text-white font-bold drop-shadow-2xl bg-black/40 rounded-lg px-4 py-2 mx-auto max-w-fit">0km y usadas · Financiación <span style={{ color: '#FF6600' }} className="font-bold">sólo con DNI</span></span>
              <a
                href="#models"
                className="mt-8 font-bold px-10 py-4 rounded-lg text-lg shadow-lg hover:bg-primary-light transition"
                style={{ backgroundColor: '#FF6600', color: '#111' }}
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
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.7 1l.94 1.88a2 2 0 001.7 1H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" /></svg>
                  </span>
                  <span className="text-lg font-semibold text-black">Teléfono: <a href="tel:03433007984" className="text-[#ff6600] font-bold hover:underline">0343 300-7984</a></span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl shadow p-4">
                  <span className="bg-[#ff6600]/10 p-3 rounded-full">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1" /><circle cx="9" cy="7" r="4" stroke="#ff6600" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11v9" /></svg>
                  </span>
                  <span className="text-lg font-semibold text-black">Casa Central: <span className="text-[#ff6600] font-bold">@nestormotos1 Venado Tuerto - SF</span></span>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-center">
                <div className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden w-full h-72 flex items-center justify-center relative">
                  <iframe
                    title="Mapa Nestor Motos"
                    src="https://www.google.com/maps?q=-31.756278196473883,-60.53260317611488&z=17&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="text-base text-black font-semibold text-center mt-2">
                  Dirección: <span className="text-[#ff6600] font-bold">Esquina Av. Espejo, Leopoldo Lugones y, E3100 Paraná, Entre Ríos</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="models" className="py-20 bg-gray-100 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle>Modelos de Motos</SectionTitle>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <button
                className={`px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm ${activeTab === 'cc110' ? 'bg-[#ff6600] text-white border-[#ff6600] scale-105' : 'bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10'}`}
                onClick={() => setActiveTab('cc110')}
              >
                110CC
              </button>
              <button
                className={`px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm ${activeTab === 'cc125_150' ? 'bg-[#ff6600] text-white border-[#ff6600] scale-105' : 'bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10'}`}
                onClick={() => setActiveTab('cc125_150')}
              >
                125/150CC
              </button>
              <button
                className={`px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm ${activeTab === 'cc250plus' ? 'bg-[#ff6600] text-white border-[#ff6600] scale-105' : 'bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10'}`}
                onClick={() => setActiveTab('cc250plus')}
              >
                250CC o más
              </button>
              <button
                className={`px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest border-2 transition-all shadow-sm ${activeTab === 'quads' ? 'bg-[#ff6600] text-white border-[#ff6600] scale-105' : 'bg-white text-[#ff6600] border-[#ff6600] hover:bg-[#ff6600]/10'}`}
                onClick={() => setActiveTab('quads')}
              >
                Cuatriciclos
              </button>
            </div>
            {activeTab === 'cc110' && <MotoCarousel motos={motoCategories.cc110} title="110CC" />}
            {activeTab === 'cc125_150' && <MotoCarousel motos={motoCategories.cc125_150} title="125/150CC" />}
            {activeTab === 'cc250plus' && <MotoCarousel motos={motoCategories.cc250plus} title="250CC o más" />}
            {activeTab === 'quads' && <MotoCarousel motos={motoCategories.quads} title="Cuatriciclos" />}
          </div>
        </section>
        
        <section id="financing" className="py-20 bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle>Tipos de Financiaciones</SectionTitle>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
              {financingOptions.map((option, idx) => (
                <FinancingCard key={idx} title={option.title} description={option.description} />
              ))}
            </div>
          </div>
        </section>
        
        <section id="reviews" className="py-20 bg-gray-100 border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4">
            <SectionTitle>Referencias de Google</SectionTitle>
            {randomReviews.map((review) => (
              <GoogleReview key={review.id} author={review.author} content={review.content} rating={review.rating} />
            ))}
          </div>
        </section>
        
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-xl mx-auto px-4">
            <SectionTitle className="mb-8">Contacto</SectionTitle>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing; 