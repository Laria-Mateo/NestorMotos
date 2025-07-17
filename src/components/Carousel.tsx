import React, { useState, useEffect } from 'react';

type CarouselProps = {
  images: string[];
};

const names = [
  'Juan Pérez',
  'María Gómez',
  'Carlos Díaz',
  'Lucía Fernández',
  'Pedro Sosa',
  'Sofía Ramírez',
];

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 3000);
    return () => clearInterval(interval);
  }, [length]);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);

  if (!images.length) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl bg-gray-900">
      <img
        src={images[current]}
        alt={`Cliente ${current + 1}`}
        className="absolute inset-0 w-full h-full object-cover z-10 block transition-all duration-700"
        draggable="false"
        style={{ pointerEvents: 'none' }}
      />
      <div className="absolute inset-0 bg-black/40 z-20" />
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 bg-white/80 text-black font-bold text-xl md:text-2xl px-6 py-2 rounded-full shadow-lg backdrop-blur-md">
        {names[current % names.length]}
      </div>
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full p-2 shadow-lg transition z-30 border-2 border-primary/30">
        &#8592;
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full p-2 shadow-lg transition z-30 border-2 border-primary/30">
        &#8594;
      </button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-4 h-4 rounded-full transition-all duration-300 border-2 border-primary ${idx === current ? 'bg-primary scale-125 shadow-lg' : 'bg-primary/30 hover:bg-primary/60'}`}
            aria-label={`Ir a la imagen ${idx + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel; 