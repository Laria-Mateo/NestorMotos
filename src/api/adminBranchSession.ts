import type { BranchSlug } from '../utils/branch';

const ADMIN_BRANCH_KEY = 'nestor_admin_branch';

export function getAdminBranch(): BranchSlug | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_BRANCH_KEY);
    if (raw === 'parana' || raw === 'venado') return raw;
    return null;
  } catch {
    return null;
  }
}

export function setAdminBranch(branch: BranchSlug): void {
  sessionStorage.setItem(ADMIN_BRANCH_KEY, branch);
}

export function clearAdminBranch(): void {
  sessionStorage.removeItem(ADMIN_BRANCH_KEY);
}

export function isParanaAdmin(): boolean {
  return getAdminBranch() === 'parana';
}

export function isVenadoAdmin(): boolean {
  return getAdminBranch() === 'venado';
}
