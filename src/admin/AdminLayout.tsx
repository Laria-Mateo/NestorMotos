import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useAdminBranch } from '../auth/AdminBranchContext';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-2 rounded-lg text-sm font-semibold transition ${isActive ? 'bg-[#f75000] text-white' : 'text-gray-700 hover:bg-gray-100'}`;

const branchLabel: Record<string, string> = {
  parana: 'Paraná',
  venado: 'Venado Tuerto',
};

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const { adminBranch, clearBranch } = useAdminBranch();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearBranch();
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleChangeBranch = () => {
    clearBranch();
    navigate('/admin/sucursal', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-200">
          <img src="/logoSinFondo3.webp" alt="Néstor Motos" className="h-10 w-auto mx-auto" />
          <p className="text-center text-xs font-bold text-gray-500 mt-2 uppercase tracking-wide">Administración</p>
          {adminBranch && (
            <p className="text-center text-xs font-bold text-[#f75000] mt-2">
              {branchLabel[adminBranch]}
            </p>
          )}
        </div>
        <nav className="p-4 flex flex-col gap-1 flex-1">
          <NavLink to="/admin/panel" end className={linkClass}>Inicio</NavLink>
          <NavLink to="/admin/panel/marcas" className={linkClass}>Marcas</NavLink>
          <NavLink to="/admin/panel/motos" className={linkClass}>Motos</NavLink>
          <NavLink to="/admin/panel/productos" className={linkClass}>Productos</NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            type="button"
            onClick={handleChangeBranch}
            className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
          >
            Cambiar sucursal
          </button>
          <Link to="/" className="block text-center text-sm text-gray-600 hover:text-[#f75000]">Ver sitio</Link>
          <button type="button" onClick={handleLogout} className="w-full py-2 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-800">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
