import React, { useCallback, useEffect, useState } from 'react';
import {
  adminCreateMarca,
  adminDeleteMarca,
  adminGetMarcas,
  adminReactivateMarca,
  adminUpdateMarca,
} from '../api/adminApi';
import type { Marca } from '../api/types';
import { mediaUrl } from '../utils/mediaUrl';
import { ApiError } from '../api/client';

const AdminMarcasPage: React.FC = () => {
  const [list, setList] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setList(await adminGetMarcas());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setNombre('');
    setLogo(null);
    setEditId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        await adminUpdateMarca(editId, { nombre: nombre.trim(), logo: logo ?? undefined });
      } else {
        if (!logo) {
          setError('Seleccioná un logo');
          return;
        }
        await adminCreateMarca(nombre.trim(), logo);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al guardar');
    }
  };

  const startEdit = (m: Marca) => {
    setEditId(m.id);
    setNombre(m.nombre);
    setLogo(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Marcas</h1>
      <form onSubmit={submit} className="bg-white rounded-xl p-6 shadow ring-1 ring-gray-200 mb-8 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo {editId ? '(opcional)' : ''}</label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} className="w-full text-sm" />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="px-5 py-2 rounded-lg bg-[#f75000] text-white font-bold">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg border border-gray-300">Cancelar</button>}
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
      </form>
      {loading ? <p className="text-gray-600">Cargando…</p> : (
        <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Logo</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="p-3"><img src={mediaUrl(m.logoUrl)} alt="" className="h-10 w-10 object-contain" /></td>
                  <td className="p-3 font-semibold">{m.nombre}</td>
                  <td className="p-3">{m.activo ? 'Activa' : 'Inactiva'}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => startEdit(m)} className="text-[#f75000] font-semibold">Editar</button>
                    {m.activo ? (
                      <button type="button" onClick={async () => { await adminDeleteMarca(m.id); await load(); }} className="text-red-600 font-semibold">Desactivar</button>
                    ) : (
                      <button type="button" onClick={async () => { await adminReactivateMarca(m.id); await load(); }} className="text-green-700 font-semibold">Reactivar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMarcasPage;
