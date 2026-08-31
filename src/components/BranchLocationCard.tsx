import React, { useEffect, useRef, useState } from 'react';
import type { BranchLocation } from '../constants/branchLocations';
import { mapsEmbedUrl } from '../utils/mapsEmbed';

type BranchLocationCardProps = {
  location: BranchLocation;
};

const BranchLocationCard: React.FC<BranchLocationCardProps> = ({ location }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const hasVideo = Boolean(location.video) && !videoFailed;
  const showImage = Boolean(location.image) && !imageFailed && !hasVideo;

  useEffect(() => {
    const el = videoRef.current;
    if (!hasVideo || !el) return;
    const play = el.play();
    if (play && typeof play.catch === 'function') {
      play.catch(() => setVideoFailed(true));
    }
  }, [hasVideo, location.video]);

  return (
    <article className="flex h-full flex-col bg-gray-50 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative w-full aspect-[16/10] shrink-0 bg-gray-200 overflow-hidden">
        {hasVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={location.image}
            onError={() => setVideoFailed(true)}
          >
            <source src={location.video} type="video/mp4" />
          </video>
        ) : showImage ? (
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
      <div className="px-4 py-4 flex flex-col gap-2 shrink-0">
        <h3 className="text-sm font-bold text-[#ff6600] uppercase tracking-wide">{location.label}</h3>
        <p className="text-base text-black font-semibold min-h-[3rem]">
          <span className="text-[#ff6600] font-bold">{location.address}</span>
        </p>
      </div>
      <div className="relative mt-auto bg-gray-100 w-full min-h-56 md:min-h-64 flex-1 overflow-hidden">
        <iframe
          title={`Mapa ${location.label}`}
          src={mapsEmbedUrl(location.mapQuery)}
          className="absolute left-0 top-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </article>
  );
};

export default BranchLocationCard;
