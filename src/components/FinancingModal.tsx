import React, { useEffect, useMemo, useState } from 'react';
import { getAllMotos } from '../api/catalogApi';
import { branchSlugToApiSucursal } from '../constants/sucursal';
import { resolveBranchSlug } from '../utils/branch';
import type { Moto } from '../api/types';
import { normalizeCilindrada, uniqueCilindradas } from '../utils/cilindrada';

const WHATSAPP_PARANA = '5493433007984';
const WHATSAPP_VENADO = '5493462252244';

interface FinancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: 1 | 2 | 3;
}

const FinancingModal: React.FC<FinancingModalProps> = ({ isOpen, onClose, option }) => {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [mayor21, setMayor21] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [cilindrada, setCilindrada] = useState('');
  const [modelo, setModelo] = useState('');
  const [montoEntrega, setMontoEntrega] = useState(''); // Opción 2
  const [modeloUsada, setModeloUsada] = useState(''); // Opción 3
  const [kmUsada, setKmUsada] = useState(''); // Opción 3
  const [descripcionUsada, setDescripcionUsada] = useState(''); // Opción 3

  const branch = resolveBranchSlug(typeof window !== 'undefined' ? localStorage.getItem('branch') : null);
  const phone = branch === 'parana' ? WHATSAPP_PARANA : WHATSAPP_VENADO;

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      const list = await getAllMotos({
        sucursal: branchSlugToApiSucursal(branch),
        es0km: true,
      });
      if (!cancelled) setMotos(list);
    })();
    return () => { cancelled = true; };
  }, [isOpen, branch]);

  const cilindradasUnicas = useMemo(() => uniqueCilindradas(motos.map((m) => m.cilindrada)), [motos]);
  const modelosFiltrados = useMemo(
    () => (cilindrada ? motos.filter((m) => normalizeCilindrada(m.cilindrada) === normalizeCilindrada(cilindrada)) : []),
    [cilindrada, motos],
  );
  const modelosUnicos = Array.from(new Set(modelosFiltrados.map((m) => m.nombre)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos para opción 1 y 2
    if ((option === 1 || option === 2) && (!nombre || !apellido || !dni)) {
      alert('Por favor completá los campos requeridos: Nombre, Apellido y DNI');
      return;
    }
    
    let mensaje = '';
    
    if (option === 1) {
      mensaje = `Opción 1 - FINANCIACIÓN TOTAL AL 100%\n\n`;
    } else if (option === 2) {
      mensaje = `Opción 2 - FINANCIACIÓN PARCIAL\n\n`;
    } else if (option === 3) {
      mensaje = `Opción 3 - PLAN CANJE\n\n`;
    }

    if (nombre) mensaje += `Nombre: ${nombre}\n`;
    if (apellido) mensaje += `Apellido: ${apellido}\n`;
    if (dni) mensaje += `DNI: ${dni}\n`;
    if (mayor21) mensaje += `Mayor de 21 años: ${mayor21 === 'si' ? 'Sí' : 'No'}\n`;
    if (option === 2 && montoEntrega) mensaje += `Monto de entrega: $${montoEntrega}\n`;
    if (option === 3) {
      if (modeloUsada) mensaje += `Modelo de usada: ${modeloUsada}\n`;
      if (kmUsada) mensaje += `Kilometraje: ${Number(kmUsada).toLocaleString()} km\n`;
      if (descripcionUsada) mensaje += `Descripción: ${descripcionUsada}\n`;
    }
    if (option === 1 && cilindrada) mensaje += `Cilindrada: ${cilindrada}\n`;
    if (option === 1 && modelo) mensaje += `Modelo: ${modelo}\n`;
    if (observaciones) mensaje += `Observaciones: ${observaciones}\n`;
    
    mensaje += `Sucursal: ${branch === 'parana' ? 'Paraná' : 'Venado Tuerto'}`;

    const url = `https://api.whatsapp.com/send?phone=${phone.replace('+','')}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-extrabold text-[#f75000] uppercase">
            {option === 1 && 'Financiación Total al 100%'}
            {option === 2 && 'Financiación Parcial'}
            {option === 3 && 'Plan Canje'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campos comunes - requeridos para opción 1 y 2, opcionales para opción 3 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nombre {option === 3 && <span className="text-gray-400">(opcional)</span>}
              </label>
              <input
                type="text"
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000]"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required={option === 1 || option === 2}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Apellido {option === 3 && <span className="text-gray-400">(opcional)</span>}
              </label>
              <input
                type="text"
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000]"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                required={option === 1 || option === 2}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              DNI {option === 3 && <span className="text-gray-400">(opcional)</span>}
            </label>
            <input
              type="text"
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000]"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="DNI (sin puntos)"
              maxLength={8}
              required={option === 1 || option === 2}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">¿Tenés más de 21 años? <span className="text-gray-400">(opcional)</span></label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="mayor21" value="si" checked={mayor21 === 'si'} onChange={(e) => setMayor21(e.target.value)} className="accent-[#f75000]" />
                <span>Sí</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="mayor21" value="no" checked={mayor21 === 'no'} onChange={(e) => setMayor21(e.target.value)} className="accent-[#f75000]" />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Campos específicos por opción */}
          {option === 1 && (
            <>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Cilindrada <span className="text-gray-400">(opcional)</span></label>
                  <select
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000]"
                    value={cilindrada}
                    onChange={(e) => { setCilindrada(e.target.value); setModelo(''); }}
                  >
                    <option value="">-- Elegir cilindrada --</option>
                    {cilindradasUnicas.map((cc) => (
                      <option key={cc} value={cc}>{cc}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Modelo <span className="text-gray-400">(opcional)</span></label>
                  <select
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000]"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    disabled={!cilindrada}
                  >
                    <option value="">-- Elegir modelo --</option>
                    {modelosUnicos.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {option === 2 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Monto de entrega <span className="text-gray-400">(opcional)</span></label>
              <input
                type="text"
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000]"
                value={montoEntrega}
                onChange={(e) => setMontoEntrega(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Monto en pesos"
              />
            </div>
          )}

          {option === 3 && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Modelo de usada <span className="text-gray-400">(opcional)</span></label>
                <input
                  type="text"
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000]"
                  value={modeloUsada}
                  onChange={(e) => setModeloUsada(e.target.value)}
                  placeholder="Ej: Honda Wave 110"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Kilometraje <span className="text-gray-400">(opcional)</span></label>
                <input
                  type="text"
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000]"
                  value={kmUsada}
                  onChange={(e) => setKmUsada(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Kilometraje"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción <span className="text-gray-400">(opcional)</span></label>
                <textarea
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000] resize-none"
                  rows={3}
                  value={descripcionUsada}
                  onChange={(e) => setDescripcionUsada(e.target.value)}
                  placeholder="Estado de la moto, año, detalles, etc."
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Observaciones <span className="text-gray-400">(opcional)</span></label>
            <textarea
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f75000] resize-none"
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Información adicional"
            />
          </div>

          <p className="text-xs text-gray-500 text-center -mt-2">
            Los datos ingresados se utilizan únicamente para agilizar el trámite y no se almacenan.
          </p>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#f75000] hover:bg-[#ff7a33] text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6.01L0 24l6.18-1.62A12.13 12.13 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.67.96.98-3.58-.23-.37A9.98 9.98 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 5.02 4.22.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
              </svg>
              Consultar por WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancingModal;

