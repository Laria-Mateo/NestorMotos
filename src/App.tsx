import { Routes, Route } from 'react-router-dom';
import Landing from './views/Landing';
import Models from './views/Models';
import ModelDetail from './views/ModelDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/modelos" element={<Models />} />
      <Route path="/modelos/:id" element={<ModelDetail />} />
    </Routes>
  );
}

export default App;
