import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { AdminBranchProvider } from './auth/AdminBranchContext'

// Clear branch selection on hard refresh to allow re-choosing branch,
// except when a branch change was just requested from the navbar
try {
  if (performance && performance.getEntriesByType) {
    const nav = performance.getEntriesByType('navigation')[0] as any
    if (nav && nav.type === 'reload') {
      // Siempre limpiar para permitir reelección tras refresh
      localStorage.removeItem('branch')
    }
  }
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminBranchProvider>
          <App />
        </AdminBranchProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
