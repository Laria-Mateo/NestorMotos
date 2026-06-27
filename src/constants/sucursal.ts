import type { BranchSlug } from '../utils/branch';

export type ApiSucursal = 'Parana' | 'Venado';

export function branchSlugToApiSucursal(branch: BranchSlug): ApiSucursal {
  return branch === 'venado' ? 'Venado' : 'Parana';
}

export function apiSucursalToBranchSlug(sucursal: ApiSucursal): BranchSlug {
  return sucursal === 'Venado' ? 'venado' : 'parana';
}

export function motoSucursalLabel(enParana: boolean, enVenado: boolean): string {
  if (enParana && enVenado) return 'Paraná y Venado';
  if (enParana) return 'Paraná';
  if (enVenado) return 'Venado Tuerto';
  return 'Sin sucursal';
}
