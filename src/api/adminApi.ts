import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPostForm,
  apiPutForm,
  fetchAllPages,
} from './client';
import type { Marca, Moto, PagedResult, Producto } from './types';

export async function adminGetMarcas(): Promise<Marca[]> {
  return fetchAllPages<Marca>('/admin/marcas', undefined, true);
}

export async function adminGetMarca(id: number): Promise<Marca | undefined> {
  try {
    return await apiGet<Marca>(`/admin/marcas/${id}`, undefined, true);
  } catch {
    return undefined;
  }
}

export async function adminCreateMarca(nombre: string, logo: File): Promise<Marca> {
  const form = new FormData();
  form.append('nombre', nombre);
  form.append('logo', logo);
  return apiPostForm<Marca>('/marcas', form, true);
}

export async function adminUpdateMarca(id: number, data: { nombre?: string; logo?: File }): Promise<Marca> {
  const form = new FormData();
  if (data.nombre) form.append('nombre', data.nombre);
  if (data.logo) form.append('logo', data.logo);
  return apiPutForm<Marca>(`/marcas/${id}`, form);
}

export async function adminDeleteMarca(id: number): Promise<void> {
  await apiDelete(`/marcas/${id}`);
}

export async function adminReactivateMarca(id: number): Promise<void> {
  await apiPatch(`/admin/marcas/${id}/reactivar`);
}

export async function adminGetMotos(): Promise<Moto[]> {
  return fetchAllPages<Moto>('/admin/motos', undefined, true);
}

export async function adminGetMoto(id: number): Promise<Moto | undefined> {
  try {
    return await apiGet<Moto>(`/admin/motos/${id}`, undefined, true);
  } catch {
    return undefined;
  }
}

export async function adminCreateMoto(data: {
  nombre: string;
  cilindrada: string;
  marcaId: number;
  descripcion: string;
  fotos: File[];
  enParana: boolean;
  enVenado: boolean;
  anio?: number | null;
  es0km: boolean;
  precio?: number | null;
}): Promise<Moto> {
  const form = new FormData();
  form.append('nombre', data.nombre);
  form.append('cilindrada', data.cilindrada);
  form.append('marcaId', String(data.marcaId));
  form.append('descripcion', data.descripcion);
  form.append('enParana', String(data.enParana));
  form.append('enVenado', String(data.enVenado));
  form.append('es0km', String(data.es0km));
  if (data.anio != null) form.append('anio', String(data.anio));
  if (data.precio != null) form.append('precio', String(data.precio));
  for (const f of data.fotos) form.append('fotos', f);
  return apiPostForm<Moto>('/motos', form, true);
}

export async function adminUpdateMoto(
  id: number,
  data: {
    nombre?: string;
    cilindrada?: string;
    marcaId?: number;
    descripcion?: string;
    enParana?: boolean;
    enVenado?: boolean;
    anio?: number | null;
    es0km?: boolean;
    precio?: number | null;
    fotosNuevas?: File[];
    fotosEliminarIds?: number[];
  },
): Promise<Moto> {
  const form = new FormData();
  if (data.nombre) form.append('nombre', data.nombre);
  if (data.cilindrada) form.append('cilindrada', data.cilindrada);
  if (data.marcaId != null) form.append('marcaId', String(data.marcaId));
  if (data.descripcion) form.append('descripcion', data.descripcion);
  if (data.enParana != null) form.append('enParana', String(data.enParana));
  if (data.enVenado != null) form.append('enVenado', String(data.enVenado));
  if (data.anio !== undefined) {
    if (data.anio === null) form.append('anio', '');
    else form.append('anio', String(data.anio));
  }
  if (data.precio != null) form.append('precio', String(data.precio));
  if (data.fotosNuevas) {
    for (const f of data.fotosNuevas) form.append('fotosNuevas', f);
  }
  if (data.fotosEliminarIds) {
    for (const fid of data.fotosEliminarIds) form.append('fotosEliminarIds', String(fid));
  }
  return apiPutForm<Moto>(`/motos/${id}`, form);
}

export async function adminDeleteMoto(id: number): Promise<void> {
  await apiDelete(`/motos/${id}`);
}

export async function adminDeleteMotoFoto(motoId: number, fotoId: number): Promise<void> {
  await apiDelete(`/motos/${motoId}/fotos/${fotoId}`);
}

export async function adminReactivateMoto(id: number): Promise<void> {
  await apiPatch(`/admin/motos/${id}/reactivar`);
}

export async function adminGetProductos(): Promise<Producto[]> {
  return fetchAllPages<Producto>('/admin/productos', undefined, true);
}

export async function adminGetProducto(id: number): Promise<Producto | undefined> {
  try {
    return await apiGet<Producto>(`/admin/productos/${id}`, undefined, true);
  } catch {
    return undefined;
  }
}

export async function adminCreateProducto(data: {
  nombre: string;
  categoria: string;
  descripcion: string;
  foto: File;
  precio?: number | null;
}): Promise<Producto> {
  const form = new FormData();
  form.append('nombre', data.nombre);
  form.append('categoria', data.categoria);
  form.append('descripcion', data.descripcion);
  form.append('foto', data.foto);
  if (data.precio != null) form.append('precio', String(data.precio));
  return apiPostForm<Producto>('/productos', form, true);
}

export async function adminUpdateProducto(
  id: number,
  data: {
    nombre?: string;
    categoria?: string;
    descripcion?: string;
    foto?: File;
    precio?: number | null;
  },
): Promise<Producto> {
  const form = new FormData();
  if (data.nombre) form.append('nombre', data.nombre);
  if (data.categoria) form.append('categoria', data.categoria);
  if (data.descripcion) form.append('descripcion', data.descripcion);
  if (data.foto) form.append('foto', data.foto);
  if (data.precio != null) form.append('precio', String(data.precio));
  return apiPutForm<Producto>(`/productos/${id}`, form);
}

export async function adminDeleteProducto(id: number): Promise<void> {
  await apiDelete(`/productos/${id}`);
}

export async function adminReactivateProducto(id: number): Promise<void> {
  await apiPatch(`/admin/productos/${id}/reactivar`);
}

export async function adminGetMarcasPaged(page = 1): Promise<PagedResult<Marca>> {
  return apiGet<PagedResult<Marca>>('/admin/marcas', { page, pageSize: 100 }, true);
}
