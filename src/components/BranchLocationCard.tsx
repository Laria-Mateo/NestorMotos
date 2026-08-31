import React, { useState } from 'react';
import type { BranchLocation } from '../constants/branchLocations';

type BranchLocationCardProps = {
  location: BranchLocation;
};

const BranchLocationCard: React.FC<BranchLocationCardProps> = ({ location }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(location.image) && !imageFailed;

  return (
    <article className="flex flex-col gap-4 bg-gray-50 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative w-full aspect-[16/10] bg-gray-200">
        {showImage ? (
          <img
            src={location.image}
            alt={location.label}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500 px-4 text-center">
              {location.label}
            </span>
          </div>
        )}
      </div>
      <div className="px-4 flex flex-col gap-2">
        <h3 className="text-sm font-bold text-[#ff6600] uppercase tracking-wide">{location.label}</h3>
        <p className="text-base text-black font-semibold">
          <span className="text-[#ff6600] font-bold">{location.address}</span>
        </p>
      </div>
      <div className="bg-gray-100 w-full h-56 md:h-64 overflow-hidden">
        <iframe
          title={`Mapa ${location.label}`}
          src={`https://www.google.com/maps?q=${location.mapQuery}&z=17&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </article>
  );
};

export default BranchLocationCard;
