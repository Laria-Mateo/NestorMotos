import React, { useCallback, useEffect, useRef, useState } from 'react';

type ImageMagnifierProps = {
  src: string;
  alt: string;
  onOpen: () => void;
};

const ZOOM = 2.4;
const LENS_SIZE = 140;
const ZOOM_PANE_SIZE = 340;

type DisplayRect = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

function getDisplayRect(containerW: number, containerH: number, naturalW: number, naturalH: number): DisplayRect {
  const containerRatio = containerW / containerH;
  const imageRatio = naturalW / naturalH;

  if (imageRatio > containerRatio) {
    const width = containerW;
    const height = containerW / imageRatio;
    return { width, height, offsetX: 0, offsetY: (containerH - height) / 2 };
  }

  const height = containerH;
  const width = containerH * imageRatio;
  return { width, height, offsetX: (containerW - width) / 2, offsetY: 0 };
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({ src, alt, onOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [lens, setLens] = useState({ x: 0, y: 0 });
  const [displayRect, setDisplayRect] = useState<DisplayRect | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const updateDisplayRect = useCallback(() => {
    const container = containerRef.current;
    if (!container || naturalSize.width === 0) return;
    const { width, height } = container.getBoundingClientRect();
    setDisplayRect(getDisplayRect(width, height, naturalSize.width, naturalSize.height));
  }, [naturalSize]);

  useEffect(() => {
    updateDisplayRect();
    window.addEventListener('resize', updateDisplayRect);
    return () => window.removeEventListener('resize', updateDisplayRect);
  }, [updateDisplayRect, src]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !displayRect) return;

    const bounds = container.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    const insideImage =
      mouseX >= displayRect.offsetX &&
      mouseX <= displayRect.offsetX + displayRect.width &&
      mouseY >= displayRect.offsetY &&
      mouseY <= displayRect.offsetY + displayRect.height;

    if (!insideImage) {
      setActive(false);
      return;
    }

    const lensX = Math.min(
      Math.max(mouseX - LENS_SIZE / 2, displayRect.offsetX),
      displayRect.offsetX + displayRect.width - LENS_SIZE,
    );
    const lensY = Math.min(
      Math.max(mouseY - LENS_SIZE / 2, displayRect.offsetY),
      displayRect.offsetY + displayRect.height - LENS_SIZE,
    );

    setLens({ x: lensX, y: lensY });
    setActive(true);
  };

  const zoomBackgroundPosition = displayRect
    ? (() => {
        const relX = (lens.x - displayRect.offsetX) / displayRect.width;
        const relY = (lens.y - displayRect.offsetY) / displayRect.height;
        const zoomW = displayRect.width * ZOOM;
        const zoomH = displayRect.height * ZOOM;
        return {
          backgroundSize: `${zoomW}px ${zoomH}px`,
          backgroundPosition: `${ZOOM_PANE_SIZE / 2 - relX * zoomW}px ${ZOOM_PANE_SIZE / 2 - relY * zoomH}px`,
        };
      })()
    : undefined;

  return (
    <div className="hidden lg:block relative w-full">
      <div
        ref={containerRef}
        className="relative w-full h-[420px] rounded-xl bg-white border border-gray-200 overflow-hidden cursor-crosshair"
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(false)}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        aria-label="Ampliar imagen"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          onLoad={(e) => {
            const img = e.currentTarget;
            setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
          }}
        />
        {active && displayRect && (
          <div
            className="absolute pointer-events-none border-2 border-[#ff6600] bg-[#ff6600]/10 shadow-[0_0_0_1px_rgba(255,102,0,0.35)]"
            style={{
              left: lens.x,
              top: lens.y,
              width: LENS_SIZE,
              height: LENS_SIZE,
            }}
          />
        )}
        <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 text-white text-xs font-semibold px-2.5 py-1 pointer-events-none">
          Clic para ampliar
        </span>
      </div>

      <div
        className={`absolute left-full top-0 ml-4 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden transition-opacity z-20 ${
          active ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          width: ZOOM_PANE_SIZE,
          height: ZOOM_PANE_SIZE,
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'no-repeat',
          ...zoomBackgroundPosition,
        }}
        aria-hidden={!active}
      />
    </div>
  );
};

export default ImageMagnifier;
