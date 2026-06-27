import React, { useCallback, useEffect, useState } from 'react';
import {
  adminCreateProducto,
  adminDeleteProducto,
  adminGetProductos,
  adminReactivateProducto,
  adminUpdateProducto,
} from '../api/adminApi';
import type { Producto } from '../api/types';
import {
  PRODUCT_CATEGORY_ELECTRICAS,
  PRODUCT_CATEGORY_USADAS,
  PRODUCT_CATEGORY_VENADO_USADAS,
} from '../constants/categories';
import { mediaUrl } from '../utils/mediaUrl';
import { ApiError } from '../api/client';
import { useAdminBranch } from '../auth/AdminBranchContext';

const PARANA_PRESETS = [
  PRODUCT_CATEGORY_USADAS,
  PRODUCT_CATEGORY_VENADO_USADAS,
  PRODUCT_CATEGORY_ELECTRICAS,
  'Merchandising',
];

const VENADO_PRESETS = [PRODUCT_CATEGORY_VENADO_USADAS];

const AdminProductosPage: React.FC = () => {
  const { isParanaScope, isVenadoScope } = useAdminBranch();
  const categoryPresets = isVenadoScope ? VENADO_PRESETS : PARANA_PRESETS;
  const defaultCategory = isVenadoScope ? PRODUCT_CATEGORY_VENADO_USADAS : PRODUCT_CATEGORY_USADAS;
  const [list, setList] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState(defaultCategory);
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await adminGetProductos());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visibleList = isVenadoScope
    ? list.filter((p) => p.categoria.trim().toLowerCase() === PRODUCT_CATEGORY_VENADO_USADAS.toLowerCase())
    : list;

  const resetForm = () => {
    setEditId(null);
    setNombre('');
    setCategoria(defaultCategory);
    setDescripcion('');
    setPrecio('');
    setFoto(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isVenadoScope && categoria.trim().toLowerCase() !== PRODUCT_CATEGORY_VENADO_USADAS.toLowerCase()) {
      setError('En Venado Tuerto solo podés usar la categoría venado/Usadas');
      return;
    }
    try {
      const payload = {
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        descripcion: descripcion.trim(),
        precio: precio.trim() ? Number(precio) : null,
      };
      if (editId) {
        await adminUpdateProducto(editId, { ...payload, foto: foto ?? undefined });
      } else {
        if (!foto) {
          setError('Seleccioná una foto');
          return;
        }
        await adminCreateProducto({ ...payload, foto });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al guardar');
    }
  };

  const startEdit = (p: Producto) => {
    setEditId(p.id);
    setNombre(p.nombre);
    setCategoria(p.categoria);
    setDescripcion(p.descripcion);
    setPrecio(p.precio != null ? String(p.precio) : '');
    setFoto(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Productos</h1>
      <p className="text-sm text-gray-600 mb-4">
        {isParanaScope
          ? <>Usadas Paraná: <strong>{PRODUCT_CATEGORY_USADAS}</strong> · Venado: <strong>{PRODUCT_CATEGORY_VENADO_USADAS}</strong> · Eléctricas: <strong>{PRODUCT_CATEGORY_ELECTRICAS}</strong></>
          : <>Solo categoría <strong>{PRODUCT_CATEGORY_VENADO_USADAS}</strong> para usadas de Venado Tuerto.</>}
      </p>
      <form onSubmit={submit} className="bg-white rounded-xl p-6 shadow ring-1 ring-gray-200 mb-8 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <input list="cat-presets" value={categoria} onChange={(e) => setCategoria(e.target.value)} required readOnly={isVenadoScope} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <datalist id="cat-presets">
            {categoryPresets.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (opcional)</label>
          <input value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto {editId ? '(opcional)' : ''}</label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} className="w-full text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="px-5 py-2 rounded-lg bg-[#f75000] text-white font-bold">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg border border-gray-300">Cancelar</button>}
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
      </form>
      {loading ? <p className="text-gray-600">Cargando…</p> : (
        <div className="space-y-3">
          {visibleList.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-4 shadow ring-1 ring-gray-200 flex gap-4">
              <img src={mediaUrl(p.fotoUrl)} alt="" className="h-20 w-20 object-contain bg-gray-50 rounded-lg" />
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900">{p.nombre}</h2>
                <p className="text-sm text-gray-600">{p.categoria}</p>
                <p className="text-xs text-gray-500">{p.activo ? 'Activo' : 'Inactivo'}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button type="button" onClick={() => startEdit(p)} className="text-[#f75000] font-semibold text-sm">Editar</button>
                {p.activo ? (
                  <button type="button" onClick={async () => { await adminDeleteProducto(p.id); await load(); }} className="text-red-600 font-semibold text-sm">Desactivar</button>
                ) : (
                  <button type="button" onClick={async () => { await adminReactivateProducto(p.id); await load(); }} className="text-green-700 font-semibold text-sm">Reactivar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductosPage;
