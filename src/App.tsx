import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './views/Landing';
import Models from './views/Models';
import ModelDetail from './views/ModelDetail';
import BranchSelect from './views/BranchSelect';
import Blog from './views/Blog.tsx';
import BlogPost from './views/BlogPost.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sucursal" element={<BranchSelect />} />
      <Route path="/modelos" element={<Models />} />
      <Route path="/modelos/:id" element={<ModelDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
