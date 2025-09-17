import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

const BranchLayout: React.FC = () => {
  const { branch } = useParams<{ branch: string }>();
  const b = (branch || '').toLowerCase();

  // Persistir sucursal actual si viene en la URL
  useEffect(() => {
    if (!b) return;
    try { localStorage.setItem('branch', b); } catch {}
  }, [b]);

  return <Outlet />;
};

export default BranchLayout;


