export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type MotoFoto = {
  id: number;
  fotoUrl: string;
  orden: number;
};

export type Moto = {
  id: number;
  nombre: string;
  cilindrada: string;
  marcaId: number;
  marcaNombre: string;
  descripcion: string;
  fotos: MotoFoto[];
  fotoPrincipalUrl: string | null;
  anio: number | null;
  es0km: boolean;
  precio: number | null;
  enParana: boolean;
  enVenado: boolean;
  activo: boolean;
};

export type Marca = {
  id: number;
  nombre: string;
  logoUrl: string;
  activo: boolean;
};

export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string;
  precio: number | null;
  activo: boolean;
};

export type LoginResponse = {
  token: string;
  expiresAt: string;
};

export type ApiProblem = {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
};
