import React, { useRef, useState } from 'react';
import { ONLINE_SALES_PARANA } from '../constants/onlineSales';

type Step = (typeof ONLINE_SALES_PARANA.steps)[number];

const StepCard: React.FC<{ step: Step }> = ({ step }) => (
  <div className="flex gap-4 bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 h-full min-w-0">
    <div className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#ff6600] text-white font-extrabold text-lg md:text-xl flex items-center justify-center shadow-md">
      {step.number}
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="text-base md:text-xl font-bold uppercase tracking-wide text-black mb-1">
        {step.title}
      </h3>
      <p className="text-sm md:text-base text-gray-600 leading-relaxed">{step.description}</p>
    </div>
  </div>
);

const OnlineSalesStepsCarousel: React.FC = () => {
  const steps = ONLINE_SALES_PARANA.steps;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.min(Math.max(index, 0), steps.length - 1));
  };

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    setActive(index);
  };

  return (
    <div className="min-w-0 w-full">
      <div className="md:hidden overflow-hidden w-full">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide w-full"
        >
          {steps.map((step) => (
            <div key={step.number} className="min-w-full w-full shrink-0 snap-center">
              <StepCard step={step} />
            </div>
          ))}
        </div>
        {steps.length > 1 && (
          <div className="mt-5 flex justify-center gap-2">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                aria-label={`Ir al paso ${step.number}`}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  active === index ? 'w-6 bg-[#ff6600]' : 'w-2.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:flex md:flex-col md:gap-6">
        {steps.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </div>
    </div>
  );
};

export default OnlineSalesStepsCarousel;
