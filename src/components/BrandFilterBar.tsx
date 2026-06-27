import React from 'react';
import type { Marca } from '../api/types';
import { mediaUrl } from '../utils/mediaUrl';

type Props = {
  marcas: Marca[];
  selectedMarcaId: number | null;
  onSelect: (marcaId: number | null) => void;
};

const BrandFilterBar: React.FC<Props> = ({ marcas, selectedMarcaId, onSelect }) => {
  if (marcas.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center text-xs font-bold uppercase transition-all shadow-sm ${
            selectedMarcaId === null
              ? 'border-[#ff6600] bg-[#ff6600] text-white scale-105'
              : 'border-gray-300 bg-white text-gray-600 hover:border-[#ff6600]/50'
          }`}
        >
          Todas
        </button>
        {marcas.map((marca) => {
          const active = selectedMarcaId === marca.id;
          return (
            <button
              key={marca.id}
              type="button"
              title={marca.nombre}
              onClick={() => onSelect(active ? null : marca.id)}
              className={`w-20 h-20 rounded-xl border-2 p-2 flex items-center justify-center transition-all shadow-sm overflow-hidden ${
                active
                  ? 'border-[#ff6600] bg-white scale-105 ring-2 ring-[#ff6600]/30'
                  : 'border-gray-200 bg-white hover:border-[#ff6600]/40'
              }`}
            >
              <img
                src={mediaUrl(marca.logoUrl)}
                alt={marca.nombre}
                className={`w-full h-full object-contain transition-all duration-200 ${
                  active ? 'grayscale-0 opacity-100' : 'grayscale opacity-70'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BrandFilterBar;
