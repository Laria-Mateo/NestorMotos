import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => (
  <div>
    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Panel Néstor Motos</h1>
    <p className="text-gray-600 mb-8">Gestioná el catálogo que ve el sitio público.</p>
    <div className="grid sm:grid-cols-3 gap-4">
      <Link to="/admin/panel/marcas" className="bg-white rounded-xl p-6 shadow ring-1 ring-gray-200 hover:ring-[#f75000] transition">
        <h2 className="font-bold text-lg text-gray-900">Marcas</h2>
        <p className="text-sm text-gray-500 mt-1">Logos y nombres</p>
      </Link>
      <Link to="/admin/panel/motos" className="bg-white rounded-xl p-6 shadow ring-1 ring-gray-200 hover:ring-[#f75000] transition">
        <h2 className="font-bold text-lg text-gray-900">Motos</h2>
        <p className="text-sm text-gray-500 mt-1">0 km y usadas del catálogo</p>
      </Link>
      <Link to="/admin/panel/productos" className="bg-white rounded-xl p-6 shadow ring-1 ring-gray-200 hover:ring-[#f75000] transition">
        <h2 className="font-bold text-lg text-gray-900">Productos</h2>
        <p className="text-sm text-gray-500 mt-1">Usadas, eléctricas y más</p>
      </Link>
    </div>
  </div>
);

export default AdminDashboard;
