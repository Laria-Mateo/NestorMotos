import React, { useRef, useState } from 'react';
import type { BranchLocation } from '../constants/branchLocations';
import BranchLocationCard from './BranchLocationCard';

type Props = {
  locations: BranchLocation[];
};

const BranchLocationsCarousel: React.FC<Props> = ({ locations }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.min(Math.max(index, 0), locations.length - 1));
  };

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    setActive(index);
  };

  return (
    <div>
      <div className="md:hidden">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4"
        >
          {locations.map((location) => (
            <div
              key={location.label}
              className="w-full shrink-0 snap-center px-1"
            >
              <BranchLocationCard location={location} />
            </div>
          ))}
        </div>
        {locations.length > 1 && (
          <div className="mt-5 flex justify-center gap-2">
            {locations.map((location, index) => (
              <button
                key={location.label}
                type="button"
                aria-label={`Ir a ${location.label}`}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  active === index ? 'w-6 bg-[#ff6600]' : 'w-2.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:grid md:grid-cols-2 gap-8 items-stretch">
        {locations.map((location) => (
          <BranchLocationCard key={location.label} location={location} />
        ))}
      </div>
    </div>
  );
};

export default BranchLocationsCarousel;
