import type { BranchSlug } from '../utils/branch';

export type BranchLocation = {
  label: string;
  address: string;
  mapQuery: string;
  image?: string;
};

const PARANA_LOCATIONS: BranchLocation[] = [
  {
    label: 'Sucursal Centro',
    address: 'Esquina Av. Espejo, Leopoldo Lugones y, E3100 Paraná, Entre Ríos',
    mapQuery: '-31.756278196473883,-60.53260317611488',
    image: '/equipo/locales/centro.webp',
  },
  {
    label: 'Sucursal Gualeguaychú',
    address: 'Gualeguaychú y 9 de Julio, Paraná, Entre Ríos',
    mapQuery: '-31.736667,-60.529389',
    image: '/equipo/locales/gualeguaychu.webp',
  },
];

const VENADO_LOCATIONS: BranchLocation[] = [
  {
    label: 'Sucursal Venado Tuerto',
    address: 'Av. Sta. Fe 740, S2600 Venado Tuerto, Santa Fe',
    mapQuery: '-33.74189278721354,-61.958780955946374',
  },
];

export function branchLocations(branch: BranchSlug): BranchLocation[] {
  return branch === 'parana' ? PARANA_LOCATIONS : VENADO_LOCATIONS;
}
