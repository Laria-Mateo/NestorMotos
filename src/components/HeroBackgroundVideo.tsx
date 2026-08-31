import React, { useEffect, useRef, useState } from 'react';

type Props = {
  posterSrc: string;
  mp4Src: string;
  webmSrc?: string;
};

const HeroBackgroundVideo: React.FC<Props> = ({ posterSrc, mp4Src, webmSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const saveData = Boolean(connection?.saveData);
    const slowNetwork = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';

    if (prefersReducedMotion || saveData || slowNetwork) {
      setUseVideo(false);
      return;
    }

    setUseVideo(true);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!useVideo || !el) return;
    const play = el.play();
    if (play && typeof play.catch === 'function') {
      play.catch(() => setUseVideo(false));
    }
  }, [useVideo]);

  if (!useVideo) {
    return (
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${posterSrc})` }}
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 z-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={posterSrc}
      aria-hidden
    >
      {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
      <source src={mp4Src} type="video/mp4" />
    </video>
  );
};

export default HeroBackgroundVideo;
