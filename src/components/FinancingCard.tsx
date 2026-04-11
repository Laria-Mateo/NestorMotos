import React from 'react';

type FinancingCardProps = {
  title: string;
  subtitle?: string;
  items: string[];
  showCuota?: boolean;
  onConsultar: () => void;
};

const FinancingCard: React.FC<FinancingCardProps> = ({ title, subtitle, items, showCuota, onConsultar }) => (
  <div className="bg-white shadow rounded p-6 mt-4 md:m-2 w-full md:w-1/3 flex flex-col">
    <div className="mb-4">
      <h4 className="font-extrabold text-xl uppercase tracking-wide text-[#f75000]">{title}</h4>
    </div>
    {subtitle && (
      <div className="bg-black text-white font-bold text-xs uppercase px-4 py-2 rounded-lg mb-4 text-center">
        {subtitle}
      </div>
    )}
    <div className="flex-grow space-y-3 mb-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-white border-2 border-[#f75000] rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-[#f75000]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-black font-bold text-sm uppercase">{item}</span>
        </div>
      ))}
    </div>
    {showCuota && (
      <div className="text-center mb-4">
        <span className="text-[#f75000] font-bold text-sm uppercase">*PAGÁS LA 1º CUOTA EL PRÓXIMO MES</span>
      </div>
    )}
    <button
      onClick={onConsultar}
      className="px-4 py-2 bg-[#f75000] hover:bg-[#ff7a33] text-white font-bold rounded-xl transition w-full"
    >
      Consultar
    </button>
  </div>
);

export default FinancingCard; 