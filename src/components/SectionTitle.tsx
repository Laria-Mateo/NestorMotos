import React from 'react';

type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = '' }) => (
  <h2
    className={`relative text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-center mb-12 text-black drop-shadow-lg ${className}`}
    style={{ letterSpacing: '0.08em' }}
  >
    <span className="relative z-10">{children}</span>
    <span
      className="absolute left-1/2 -translate-x-1/2 bottom-[-18px] w-24 h-2 rounded-full bg-gradient-to-r from-[#ff6600] via-[#ff944d] to-[#ff6600] animate-pulse z-0"
      aria-hidden="true"
    />
  </h2>
);

export default SectionTitle; 