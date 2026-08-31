import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import SectionTitle from '../components/SectionTitle';
import BranchLocationCard from '../components/BranchLocationCard';
import { branchLocations } from '../constants/branchLocations';
import { EMPRESA_PARANA } from '../constants/empresa';
import { resolveBranchSlug } from '../utils/branch';

const Empresa: React.FC = () => {
  const { branch } = useParams<{ branch: string }>();
  const branchSlug = resolveBranchSlug(branch);
  const [teamImageFailed, setTeamImageFailed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (branchSlug !== 'parana') {
    return <Navigate to={`/${branchSlug}`} replace />;
  }

  const locations = branchLocations('parana');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <section className="py-16 md:py-20 bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle>{EMPRESA_PARANA.title}</SectionTitle>
            <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              {EMPRESA_PARANA.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gray-100 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <SectionTitle>{EMPRESA_PARANA.teamTitle}</SectionTitle>
            <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              {EMPRESA_PARANA.teamSubtitle}
            </p>
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl bg-gray-200">
              {!teamImageFailed ? (
                <img
                  src={EMPRESA_PARANA.image}
                  alt={EMPRESA_PARANA.imageAlt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={() => setTeamImageFailed(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300">
                  <span className="text-base md:text-lg font-bold uppercase tracking-wide text-gray-500 px-6 text-center">
                    Foto del equipo próximamente
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle>Nuestros locales</SectionTitle>
            <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-12">
              Conocé las sucursales de Nestor Motos en Paraná.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {locations.map((location) => (
                <BranchLocationCard key={location.label} location={location} />
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

export default Empresa;
