import React from 'react';
import { ONLINE_SALES_PARANA } from '../constants/onlineSales';

const OnlineSalesVideo: React.FC = () => {
  if (ONLINE_SALES_PARANA.videoSrc) {
    return (
      <video
        src={ONLINE_SALES_PARANA.videoSrc}
        controls
        playsInline
        preload="metadata"
        poster={ONLINE_SALES_PARANA.posterSrc}
        className="w-full h-full object-cover bg-black"
      />
    );
  }

  return (
    <iframe
      title="Venta online Nestor Motos Paraná"
      src={ONLINE_SALES_PARANA.instagramEmbedUrl}
      className="absolute inset-x-0 w-full border-0 pointer-events-auto"
      style={{
        top: '-56px',
        height: 'calc(100% + 56px)',
      }}
      allowFullScreen
      loading="lazy"
      scrolling="no"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default OnlineSalesVideo;
