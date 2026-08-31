import React from 'react';
import SectionTitle from './SectionTitle';
import OnlineSalesVideo from './OnlineSalesVideo';
import OnlineSalesStepsCarousel from './OnlineSalesStepsCarousel';
import { ONLINE_SALES_PARANA } from '../constants/onlineSales';

const OnlineSalesSection: React.FC = () => {
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${ONLINE_SALES_PARANA.whatsapp}&text=${encodeURIComponent(ONLINE_SALES_PARANA.whatsappMessage)}`;

  return (
    <section id="venta-online" className="py-20 bg-white border-b border-gray-200 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle>{ONLINE_SALES_PARANA.title}</SectionTitle>
        <p className="text-center text-gray-600 text-base md:text-lg max-w-2xl mx-auto -mt-6 mb-4 px-2">
          {ONLINE_SALES_PARANA.subtitle}
        </p>
        <p className="text-center mb-10 md:mb-12">
          <span className="inline-block bg-[#ff6600] text-white text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            {ONLINE_SALES_PARANA.badge}
          </span>
        </p>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start min-w-0">
          <div className="flex flex-col gap-6 min-w-0 w-full order-2 lg:order-1">
            <OnlineSalesStepsCarousel />

            <div className="flex flex-col gap-3 pt-2 w-full">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition shadow-lg text-sm md:text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
                WhatsApp venta online
              </a>
              <a
                href={ONLINE_SALES_PARANA.instagramPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 px-5 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition shadow-lg text-sm md:text-base"
              >
                Ver en Instagram
              </a>
            </div>
            <p className="text-sm text-gray-500 text-center lg:text-left">
              WhatsApp exclusivo:{' '}
              <span className="font-semibold text-gray-700">{ONLINE_SALES_PARANA.whatsappDisplay}</span>
            </p>
          </div>

          <div className="w-full min-w-0 max-w-[340px] mx-auto lg:max-w-none order-1 lg:order-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-black">
              <OnlineSalesVideo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineSalesSection;
