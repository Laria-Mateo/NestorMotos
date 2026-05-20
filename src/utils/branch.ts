export type BranchSlug = 'parana' | 'venado';

export function resolveBranchSlug(branchParam?: string | null): BranchSlug {
  const fromParam = (branchParam ?? '').trim().toLowerCase();
  if (fromParam === 'venado' || fromParam === 'parana') return fromParam;
  if (typeof window !== 'undefined') {
    const fromPath = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase() ?? '';
    if (fromPath === 'venado' || fromPath === 'parana') return fromPath;
    const fromStorage = (localStorage.getItem('branch') ?? '').trim().toLowerCase();
    if (fromStorage === 'venado' || fromStorage === 'parana') return fromStorage;
  }
  return 'parana';
}

export function isVenadoBranch(branch: string): boolean {
  return resolveBranchSlug(branch) === 'venado';
}
