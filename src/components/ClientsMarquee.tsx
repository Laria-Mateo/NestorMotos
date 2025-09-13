import React, { useMemo } from 'react';

// Lista estática basada en archivos en public/clients
const CLIENT_IMAGES = [
  '/clients/CLIENTE1.webp',
  '/clients/CLIENTE2.webp',
  '/clients/CLIENTE3.webp',
  '/clients/CLIENTE4.webp',
  '/clients/CLIENTE5.webp',
  '/clients/CLIENTE6.webp',
  '/clients/CLIENTE7.webp',
  '/clients/CLIENTE9.webp',
  '/clients/CLIENTE10.webp',
];

const ClientsMarquee: React.FC = () => {
  const images = useMemo(() => CLIENT_IMAGES.filter(Boolean), []);
  // Duplicar para loop suave
  const loop = useMemo(() => images.concat(images), [images]);

  return (
    <div className="relative overflow-hidden w-full">
      {/* track */}
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="flex items-center gap-6 animate-marquee will-change-transform">
          {loop.map((src, idx) => (
            <div key={src + idx} className="shrink-0 h-56 md:h-64 rounded-2xl p-0 bg-transparent flex items-center justify-center">
              <img
                src={src}
                alt={`Cliente ${idx + 1}`}
                className="h-full w-auto object-contain mx-auto"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logoSinFondo3.webp'; }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 bg-gradient-to-r from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-black/70 to-transparent" />
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 35s linear infinite; }
        @media (max-width: 640px) { .animate-marquee { animation-duration: 22s; } }
      `}</style>
    </div>
  );
};

export default ClientsMarquee;


