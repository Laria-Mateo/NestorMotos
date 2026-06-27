import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  adminCreateMoto,
  adminDeleteMoto,
  adminGetMarcas,
  adminGetMotos,
  adminReactivateMoto,
  adminUpdateMoto,
} from '../api/adminApi';
import type { Marca, Moto } from '../api/types';
import { useAdminBranch } from '../auth/AdminBranchContext';
import { motoSucursalLabel } from '../constants/sucursal';
import { mediaUrl } from '../utils/mediaUrl';
import { ApiError } from '../api/client';
import { normalizeCilindrada, uniqueCilindradas } from '../utils/cilindrada';

const emptyForm = (isParanaScope: boolean) => ({
  nombre: '',
  cilindrada: '',
  marcaId: '',
  descripcion: '',
  anio: '',
  es0km: true,
  precio: '',
  enParana: isParanaScope,
  enVenado: !isParanaScope,
});

const AdminMotosPage: React.FC = () => {
  const { isParanaScope, isVenadoScope } = useAdminBranch();
  const [list, setList] = useState<Moto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm(isParanaScope));
  const [fotos, setFotos] = useState<File[]>([]);
  const [preserveEnParana, setPreserveEnParana] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMarcaId, setFilterMarcaId] = useState('');
  const [filterCilindrada, setFilterCilindrada] = useState('');

  const visibleList = useMemo(
    () => (isVenadoScope ? list.filter((m) => m.enVenado) : list),
    [list, isVenadoScope],
  );

  const cilindradaFilterOptions = useMemo(
    () => uniqueCilindradas(visibleList.map((m) => m.cilindrada)),
    [visibleList],
  );

  const filteredList = useMemo(() => {
    let arr = visibleList;
    const q = search.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (m) => m.nombre.toLowerCase().includes(q) || m.marcaNombre.toLowerCase().includes(q),
      );
    }
    if (filterMarcaId) arr = arr.filter((m) => m.marcaId === Number(filterMarcaId));
    if (filterCilindrada) {
      const target = normalizeCilindrada(filterCilindrada);
      arr = arr.filter((m) => normalizeCilindrada(m.cilindrada) === target);
    }
    return arr;
  }, [visibleList, search, filterMarcaId, filterCilindrada]);

  const filtered0km = useMemo(() => filteredList.filter((m) => m.es0km), [filteredList]);
  const filteredUsadas = useMemo(() => filteredList.filter((m) => !m.es0km), [filteredList]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [motos, marcasData] = await Promise.all([adminGetMotos(), adminGetMarcas()]);
      setList(motos);
      setMarcas(marcasData.filter((m) => m.activo));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm(emptyForm(isParanaScope));
    setFotos([]);
    setEditId(null);
    setPreserveEnParana(false);
  };

  const resolveSucursales = (): { enParana: boolean; enVenado: boolean } | null => {
    if (isVenadoScope) {
      return { enParana: preserveEnParana, enVenado: true };
    }
    if (!form.enParana && !form.enVenado) {
      setError('Marcá al menos una sucursal');
      return null;
    }
    return { enParana: form.enParana, enVenado: form.enVenado };
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const marcaId = Number(form.marcaId);
    if (!marcaId) {
      setError('Seleccioná una marca');
      return;
    }
    const sucursales = resolveSucursales();
    if (!sucursales) return;
    try {
      const payload = {
        nombre: form.nombre.trim(),
        cilindrada: form.cilindrada.trim(),
        marcaId,
        descripcion: form.descripcion.trim(),
        es0km: form.es0km,
        anio: form.anio.trim() ? Number(form.anio) : null,
        precio: form.precio.trim() ? Number(form.precio) : null,
        enParana: sucursales.enParana,
        enVenado: sucursales.enVenado,
      };
      if (editId) {
        await adminUpdateMoto(editId, {
          ...payload,
          fotosNuevas: fotos.length > 0 ? fotos : undefined,
        });
      } else {
        if (fotos.length === 0) {
          setError('Agregá al menos una foto');
          return;
        }
        await adminCreateMoto({ ...payload, fotos });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al guardar');
    }
  };

  const startEdit = (m: Moto) => {
    setEditId(m.id);
    setForm({
      nombre: m.nombre,
      cilindrada: m.cilindrada,
      marcaId: String(m.marcaId),
      descripcion: m.descripcion,
      anio: m.anio != null ? String(m.anio) : '',
      es0km: m.es0km,
      precio: m.precio != null ? String(m.precio) : '',
      enParana: isParanaScope ? m.enParana : false,
      enVenado: isVenadoScope ? true : m.enVenado,
    });
    setPreserveEnParana(m.enParana);
    setFotos([]);
  };

  const renderMotoRow = (m: Moto) => (
    <div key={m.id} className="bg-white rounded-xl p-4 shadow ring-1 ring-gray-200 flex flex-col sm:flex-row gap-4 items-start">
      <img src={mediaUrl(m.fotoPrincipalUrl)} alt="" className="h-24 w-24 object-contain bg-gray-50 rounded-lg" />
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-gray-900">{m.nombre}</h2>
        <p className="text-sm text-gray-600">{m.marcaNombre} · {m.cilindrada} · {m.es0km ? '0 km' : `Año ${m.anio ?? '—'}`}</p>
        <p className="text-xs text-[#f75000] font-semibold mt-1">{motoSucursalLabel(m.enParana, m.enVenado)}</p>
        <p className="text-xs text-gray-500 mt-0.5">{m.activo ? 'Activa' : 'Inactiva'}</p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <button type="button" onClick={() => startEdit(m)} className="text-[#f75000] font-semibold text-sm">Editar</button>
        {m.activo ? (
          <button type="button" onClick={async () => { await adminDeleteMoto(m.id); await load(); }} className="text-red-600 font-semibold text-sm">Desactivar</button>
        ) : (
          <button type="button" onClick={async () => { await adminReactivateMoto(m.id); await load(); }} className="text-green-700 font-semibold text-sm">Reactivar</button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Motos</h1>
      <p className="text-sm text-gray-600 mb-6">
        {isParanaScope
          ? 'Podés asignar motos a Paraná, Venado o ambas sucursales.'
          : 'Solo podés gestionar motos visibles en Venado Tuerto.'}
      </p>
      <form onSubmit={submit} className="bg-white rounded-xl p-6 shadow ring-1 ring-gray-200 mb-8 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cilindrada</label>
          <input value={form.cilindrada} onChange={(e) => setForm({ ...form, cilindrada: e.target.value })} placeholder="150cc" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <select value={form.marcaId} onChange={(e) => setForm({ ...form, marcaId: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="">Seleccionar</option>
            {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (opcional)</label>
          <input value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Año (vacío = 0 km)</label>
          <input value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value.replace(/\D/g, '').slice(0, 4) })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <label className="flex items-center gap-2 pt-6">
          <input type="checkbox" checked={form.es0km} onChange={(e) => setForm({ ...form, es0km: e.target.checked })} />
          <span className="text-sm font-medium">Es 0 km</span>
        </label>
        <div className="md:col-span-2 flex flex-wrap gap-6">
          {isParanaScope ? (
            <>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.enParana}
                  onChange={(e) => setForm({ ...form, enParana: e.target.checked })}
                />
                <span className="text-sm font-medium">Visible en Paraná</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.enVenado}
                  onChange={(e) => setForm({ ...form, enVenado: e.target.checked })}
                />
                <span className="text-sm font-medium">Visible en Venado Tuerto</span>
              </label>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Esta moto se publicará en Venado Tuerto
              {preserveEnParana ? ' (también permanece en Paraná)' : ''}.
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fotos {editId ? '(nuevas, opcional)' : '(1 a 10)'}</label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={(e) => setFotos(Array.from(e.target.files ?? []))} className="w-full text-sm" />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="px-5 py-2 rounded-lg bg-[#f75000] text-white font-bold">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg border border-gray-300">Cancelar</button>}
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
      </form>
      <div className="bg-white rounded-xl p-4 shadow ring-1 ring-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre o marca"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <select
              value={filterMarcaId}
              onChange={(e) => setFilterMarcaId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todas</option>
              {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cilindrada</label>
            <select
              value={filterCilindrada}
              onChange={(e) => setFilterCilindrada(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todas</option>
              {cilindradaFilterOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          <span className="font-bold text-gray-900">{filtered0km.length}</span> 0 km ·{' '}
          <span className="font-bold text-gray-900">{filteredUsadas.length}</span> usadas ·{' '}
          <span className="font-bold text-gray-900">{filteredList.length}</span> de{' '}
          <span className="font-bold text-gray-900">{visibleList.length}</span> motos
        </p>
      </div>
      {loading ? <p className="text-gray-600">Cargando…</p> : filteredList.length === 0 ? (
        <p className="text-gray-600">No hay motos con esos filtros.</p>
      ) : (
        <div className="space-y-10">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">0 km ({filtered0km.length})</h2>
            {filtered0km.length === 0 ? (
              <p className="text-sm text-gray-500">Sin motos 0 km con estos filtros.</p>
            ) : (
              <div className="space-y-3">{filtered0km.map(renderMotoRow)}</div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Usadas ({filteredUsadas.length})</h2>
            {filteredUsadas.length === 0 ? (
              <p className="text-sm text-gray-500">Sin usadas con estos filtros.</p>
            ) : (
              <div className="space-y-3">{filteredUsadas.map(renderMotoRow)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMotosPage;
