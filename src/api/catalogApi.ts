import { apiGet, apiPostJson, fetchAllPages } from './client';
import type { ApiSucursal } from '../constants/sucursal';
import type { LoginResponse, Marca, Moto, PagedResult, Producto } from './types';

export async function login(username: string, password: string): Promise<LoginResponse> {
  return apiPostJson<LoginResponse>('/auth/login', { username, password });
}

export type MotoQueryParams = {
  sucursal: ApiSucursal;
  page?: number;
  pageSize?: number;
  marcaId?: number;
  es0km?: boolean;
};

export async function getMotos(params: MotoQueryParams): Promise<PagedResult<Moto>> {
  return apiGet<PagedResult<Moto>>('/motos', params);
}

export async function getAllMotos(
  params: { sucursal: ApiSucursal; marcaId?: number; es0km?: boolean },
): Promise<Moto[]> {
  return fetchAllPages<Moto>('/motos', params);
}

export async function getMotoById(id: number, sucursal: ApiSucursal): Promise<Moto | undefined> {
  try {
    return await apiGet<Moto>(`/motos/${id}`, { sucursal });
  } catch {
    return undefined;
  }
}

export async function getMarcas(params?: { page?: number; pageSize?: number }): Promise<PagedResult<Marca>> {
  return apiGet<PagedResult<Marca>>('/marcas', params);
}

export async function getAllMarcas(): Promise<Marca[]> {
  return fetchAllPages<Marca>('/marcas');
}

export async function getMarcaById(id: number): Promise<Marca | undefined> {
  try {
    return await apiGet<Marca>(`/marcas/${id}`);
  } catch {
    return undefined;
  }
}

export async function getProductos(params?: {
  page?: number;
  pageSize?: number;
  categoria?: string;
}): Promise<PagedResult<Producto>> {
  return apiGet<PagedResult<Producto>>('/productos', params);
}

export async function getAllProductos(params?: { categoria?: string }): Promise<Producto[]> {
  return fetchAllPages<Producto>('/productos', params);
}

export async function getProductoById(id: number): Promise<Producto | undefined> {
  try {
    return await apiGet<Producto>(`/productos/${id}`);
  } catch {
    return undefined;
  }
}
