import React from 'react';

type FinancingCardProps = {
  title: string;
  description: string;
};

const FinancingCard: React.FC<FinancingCardProps> = ({ title, description }) => (
  <div className="bg-white shadow rounded p-6 mt-4 md:m-2 w-full md:w-1/3">
    <h4 className="font-extrabold text-lg uppercase tracking-wide text-[#ff6600] mb-2 drop-shadow-sm border-b-2 border-[#ff6600]/30 inline-block pb-1">{title}</h4>
    <p>{description}</p>
  </div>
);

export default FinancingCard; 