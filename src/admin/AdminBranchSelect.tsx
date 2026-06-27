import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAuthSession } from '../api/authSession';
import { getAdminBranch } from '../api/adminBranchSession';
import { useAdminBranch } from '../auth/AdminBranchContext';
import type { BranchSlug } from '../utils/branch';

const options: { slug: BranchSlug; title: string; description: string }[] = [
  {
    slug: 'parana',
    title: 'Paraná',
    description: 'Administración completa: motos en Paraná, Venado o ambas sucursales.',
  },
  {
    slug: 'venado',
    title: 'Venado Tuerto',
    description: 'Solo motos y productos de la sucursal Venado Tuerto.',
  },
];

const AdminBranchSelect: React.FC = () => {
  const navigate = useNavigate();
  const { selectBranch } = useAdminBranch();

  if (!getAuthSession()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (getAdminBranch()) {
    return <Navigate to="/admin/panel" replace />;
  }

  const choose = (branch: BranchSlug) => {
    selectBranch(branch);
    navigate('/admin/panel', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <img src="/logoSinFondo3.webp" alt="Néstor Motos" className="h-14 w-auto" />
        </div>
        <h1 className="text-2xl font-extrabold text-white text-center mb-2">Elegí la sucursal</h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          Definí qué catálogo vas a administrar en esta sesión.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {options.map((opt) => (
            <button
              key={opt.slug}
              type="button"
              onClick={() => choose(opt.slug)}
              className="text-left bg-white rounded-2xl p-6 shadow-xl hover:ring-2 hover:ring-[#f75000] transition"
            >
              <h2 className="text-xl font-extrabold text-gray-900">{opt.title}</h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBranchSelect;
