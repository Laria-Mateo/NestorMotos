import React, { useEffect, useState } from 'react';
import ImageMagnifier from './ImageMagnifier';

export type GalleryImage = {
  id: number | string;
  src: string;
};

type ImageGalleryProps = {
  images: GalleryImage[];
  alt: string;
  initialIndex?: number;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt, initialIndex = 0 }) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [images, initialIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft' && images.length > 1) {
        setSelectedIndex((i) => (i - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        setSelectedIndex((i) => (i + 1) % images.length);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, images.length]);

  if (images.length === 0) return null;

  const current = images[selectedIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const goPrev = () => setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setSelectedIndex((i) => (i + 1) % images.length);
  const openLightbox = () => setLightboxOpen(true);

  return (
    <>
      <div className="w-full flex flex-col items-center gap-4">
        <ImageMagnifier src={current.src} alt={alt} onOpen={openLightbox} />

        <button
          type="button"
          onClick={openLightbox}
          className="lg:hidden w-full group relative rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600]"
          aria-label="Ampliar imagen"
        >
          <img
            src={current.src}
            alt={alt}
            className="w-full max-h-[560px] object-contain transition group-hover:opacity-95"
          />
          <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 text-white text-xs font-semibold px-2.5 py-1">
            Ampliar
          </span>
        </button>

        {hasMultiple && (
          <div className="flex flex-wrap gap-2 justify-center w-full">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={selectedIndex === index}
                className={`h-16 w-16 rounded-lg overflow-hidden bg-white ring-2 transition ${
                  selectedIndex === index ? 'ring-[#ff6600] scale-105' : 'ring-gray-200 hover:ring-[#ff6600]/50'
                }`}
              >
                <img src={image.src} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/90"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar galería"
          />
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white p-2 transition"
            aria-label="Cerrar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 md:left-6 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition"
                aria-label="Imagen anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 md:right-6 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition"
                aria-label="Imagen siguiente"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
          <img
            src={current.src}
            alt={alt}
            className="relative z-[1] max-h-[90vh] max-w-[min(100%,1200px)] object-contain"
          />
          {hasMultiple && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
