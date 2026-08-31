import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Landing from './views/Landing';
import Models from './views/Models';
import ModelDetail from './views/ModelDetail';
import BranchSelect from './views/BranchSelect';
import Blog from './views/Blog.tsx';
import BlogPost from './views/BlogPost.tsx';
import UsedModels from './views/UsedModels.tsx';
import UsedModelDetail from './views/UsedModelDetail.tsx';
import BranchLayout from './views/BranchLayout.tsx';
import Empresa from './views/Empresa.tsx';
import AdminLogin from './admin/AdminLogin';
import AdminBranchSelect from './admin/AdminBranchSelect';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminMarcasPage from './admin/AdminMarcasPage';
import AdminMotosPage from './admin/AdminMotosPage';
import AdminProductosPage from './admin/AdminProductosPage';
import AdminPanelRoute from './auth/AdminPanelRoute';
import { getAuthSession } from './api/authSession';
import { getAdminBranch } from './api/adminBranchSession';

function AdminEntry() {
  if (!getAuthSession()) return <Navigate to="/admin/login" replace />;
  if (!getAdminBranch()) return <Navigate to="/admin/sucursal" replace />;
  return <Navigate to="/admin/panel" replace />;
}

function EmpresaRedirect() {
  const { branch } = useParams<{ branch: string }>();
  return <Navigate to={`/${branch || 'parana'}/empresa`} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminEntry />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/sucursal" element={<AdminBranchSelect />} />
      <Route
        path="/admin/panel"
        element={
          <AdminPanelRoute>
            <AdminLayout />
          </AdminPanelRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="marcas" element={<AdminMarcasPage />} />
        <Route path="motos" element={<AdminMotosPage />} />
        <Route path="productos" element={<AdminProductosPage />} />
      </Route>

      <Route path="/" element={<BranchSelect />} />

      <Route path=":branch" element={<BranchLayout />}>
        <Route index element={<Landing />} />
        <Route path="modelos" element={<Models />} />
        <Route path="modelos/:id" element={<ModelDetail />} />
        <Route path="usadas" element={<UsedModels />} />
        <Route path="usadas/:id" element={<UsedModelDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogPost />} />
        <Route path="empresa" element={<Empresa />} />
        <Route path="nosotros" element={<EmpresaRedirect />} />
        <Route path="equipo" element={<EmpresaRedirect />} />
      </Route>

      <Route path="/sucursal" element={<BranchSelect />} />
      <Route path="/modelos" element={<Navigate to="/parana/modelos" replace />} />
      <Route path="/usadas" element={<Navigate to="/parana/usadas" replace />} />
      <Route path="/blog" element={<Navigate to="/parana/blog" replace />} />
      <Route path="/blog/:id" element={<Navigate to="/parana/blog" replace />} />
      <Route path="*" element={<Navigate to="/parana" replace />} />
    </Routes>
  );
}

export default App;
