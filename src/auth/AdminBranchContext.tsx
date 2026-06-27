import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  clearAdminBranch,
  getAdminBranch,
  setAdminBranch as persistAdminBranch,
} from '../api/adminBranchSession';
import type { BranchSlug } from '../utils/branch';

type AdminBranchContextValue = {
  adminBranch: BranchSlug | null;
  isParanaScope: boolean;
  isVenadoScope: boolean;
  selectBranch: (branch: BranchSlug) => void;
  clearBranch: () => void;
};

const AdminBranchContext = createContext<AdminBranchContextValue | null>(null);

export const AdminBranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminBranch, setAdminBranchState] = useState<BranchSlug | null>(() => getAdminBranch());

  const selectBranch = useCallback((branch: BranchSlug) => {
    persistAdminBranch(branch);
    setAdminBranchState(branch);
  }, []);

  const clearBranch = useCallback(() => {
    clearAdminBranch();
    setAdminBranchState(null);
  }, []);

  const value = useMemo(
    () => ({
      adminBranch,
      isParanaScope: adminBranch === 'parana',
      isVenadoScope: adminBranch === 'venado',
      selectBranch,
      clearBranch,
    }),
    [adminBranch, selectBranch, clearBranch],
  );

  return <AdminBranchContext.Provider value={value}>{children}</AdminBranchContext.Provider>;
};

export function useAdminBranch(): AdminBranchContextValue {
  const ctx = useContext(AdminBranchContext);
  if (!ctx) throw new Error('useAdminBranch fuera de AdminBranchProvider');
  return ctx;
}
