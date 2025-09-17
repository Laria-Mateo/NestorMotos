import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './views/Landing';
import Models from './views/Models';
import ModelDetail from './views/ModelDetail';
import BranchSelect from './views/BranchSelect';
import Blog from './views/Blog.tsx';
import BlogPost from './views/BlogPost.tsx';
import UsedModels from './views/UsedModels.tsx';
import BranchLayout from './views/BranchLayout.tsx';

function App() {
  return (
    <Routes>
      {/* Selector de sucursal como raíz */}
      <Route path="/" element={<BranchSelect />} />

      {/* Rutas por sucursal */}
      <Route path=":branch" element={<BranchLayout />}>
        <Route index element={<Landing />} />
        <Route path="modelos" element={<Models />} />
        <Route path="modelos/:id" element={<ModelDetail />} />
        <Route path="usadas" element={<UsedModels />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogPost />} />
      </Route>

      {/* Compatibilidad con rutas antiguas */}
      <Route path="/sucursal" element={<BranchSelect />} />
      <Route path="/modelos" element={<Navigate to="/parana/modelos" replace />} />
      <Route path="/usadas" element={<Navigate to="/parana/usadas" replace />} />
      <Route path="/blog" element={<Navigate to="/parana/blog" replace />} />
      {/* Evitar que quede /parana/blog/:id literal */}
      <Route path="/blog/:id" element={<Navigate to="/parana/blog" replace />} />
      <Route path="*" element={<Navigate to="/parana" replace />} />
    </Routes>
  );
}

export default App;
