import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthSession } from '../api/authSession';
import { getAdminBranch } from '../api/adminBranchSession';
import { useAuth } from './AuthContext';

type Props = { children: React.ReactNode };

const AdminPanelRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const validAuth = isAuthenticated && getAuthSession() !== null;

  if (!validAuth) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!getAdminBranch()) {
    return <Navigate to="/admin/sucursal" replace />;
  }

  return <>{children}</>;
};

export default AdminPanelRoute;
