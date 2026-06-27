import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  adminCreateProducto,
  adminDeleteProducto,
  adminGetProductos,
  adminReactivateProducto,
  adminUpdateProducto,
} from '../api/adminApi';
import type { Producto } from '../api/types';
import {
  DEFAULT_PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_PRESETS,
} from '../constants/categories';
import { mediaUrl } from '../utils/mediaUrl';
import { ApiError } from '../api/client';

const AdminProductosPage: React.FC = () => {
  const [list, setList] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState(DEFAULT_PRODUCT_CATEGORY);
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');

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

  const categoriasEnListado = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of list) {
      const c = p.categoria.trim();
      if (c) map.set(c.toLowerCase(), c);
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'es'));
  }, [list]);

  const filteredList = useMemo(() => {
    let arr = list;
    const q = search.trim().toLowerCase();
    if (q) arr = arr.filter((p) => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q));
    if (filterCategoria) {
      arr = arr.filter((p) => p.categoria.trim().toLowerCase() === filterCategoria.toLowerCase());
    }
    return arr;
  }, [list, search, filterCategoria]);

  const resetForm = () => {
    setEditId(null);
    setNombre('');
    setCategoria(DEFAULT_PRODUCT_CATEGORY);
    setDescripcion('');
    setPrecio('');
    setFoto(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
        Cascos, guantes, accesorios, repuestos y merchandising. Las motos usadas se cargan en <strong>Motos</strong> desmarcando 0 km.
      </p>
      <form onSubmit={submit} className="bg-white rounded-xl p-6 shadow ring-1 ring-gray-200 mb-8 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <input list="cat-presets" value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <datalist id="cat-presets">
            {PRODUCT_CATEGORY_PRESETS.map((c) => <option key={c} value={c} />)}
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
      <div className="bg-white rounded-xl p-4 shadow ring-1 ring-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre o categoría" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div className="min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Todas</option>
              {categoriasEnListado.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Mostrando <span className="font-bold text-gray-900">{filteredList.length}</span> de{' '}
          <span className="font-bold text-gray-900">{list.length}</span> productos
        </p>
      </div>
      {loading ? <p className="text-gray-600">Cargando…</p> : filteredList.length === 0 ? (
        <p className="text-gray-600">No hay productos con esos filtros.</p>
      ) : (
        <div className="space-y-3">
          {filteredList.map((p) => (
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
