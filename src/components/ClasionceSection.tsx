import React from 'react';
import SectionTitle from './SectionTitle';
import { CONCESIONARIA_IMAGE, CONCESIONARIA_URL } from '../constants/concesionaria';

const ClasionceSection: React.FC = () => (
  <section id="clasionce" className="py-20 bg-white border-b border-gray-200">
    <div className="max-w-5xl mx-auto px-4">
      <SectionTitle>Estamos en Clasionce</SectionTitle>
      <p className="text-center text-gray-600 text-base md:text-lg max-w-2xl mx-auto -mt-4 mb-10">
        Encontrá los avisos de Néstor Motos en nuestra tienda verificada.
      </p>
      <img
        src={CONCESIONARIA_IMAGE}
        alt="Tienda de Néstor Motos en Clasionce"
        className="w-full h-auto rounded-2xl shadow-xl border border-gray-200"
        loading="lazy"
      />
      <div className="mt-8 text-center">
        <a
          href={CONCESIONARIA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-[#ff6600] hover:bg-[#ff944d] text-white font-bold rounded-xl transition shadow-lg"
        >
          Ver en Clasionce
        </a>
      </div>
    </div>
  </section>
);

export default ClasionceSection;
