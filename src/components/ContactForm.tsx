import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import motorbikes from '../data/motorbikes.json';

// const WHATSAPP_PARANA = '5493433007984'; // Paraná (comentado temporalmente)
const WHATSAPP_VENADO = '5493462669136'; // Venado Tuerto

const cilindradasUnicas = Array.from(new Set(motorbikes.map(m => m.cc))).sort((a, b) => a - b);

const ContactForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [mayor21, setMayor21] = useState('');
  const [usadas, setUsadas] = useState(false);
  const [cilindrada, setCilindrada] = useState('');
  const [modelo, setModelo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  // const [sucursal, setSucursal] = useState('venado'); // 'parana' | 'venado' (comentado: sitio exclusivo Venado)
  const [showErrors, setShowErrors] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const modelosFiltrados = useMemo(() => (cilindrada ? motorbikes.filter(m => String(m.cc) === cilindrada) : []), [cilindrada]);
  const modelosUnicos = Array.from(new Set(modelosFiltrados.map(m => m.name)));
  // const modeloSeleccionado = motorbikes.find(m => m.name === modelo && String(m.cc) === cilindrada);

  // Prellenar desde query param modelId
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modelId = params.get('modelId');
    if (modelId) {
      const found = motorbikes.find(m => m.id === modelId);
      if (found) {
        setUsadas(false);
        setCilindrada(String(found.cc));
        setModelo(found.name);
        setObservaciones(prev => prev && !prev.includes('Consulta por modelo')
          ? `${prev}\nConsulta por modelo: ${found.name}`
          : prev || `Consulta por modelo: ${found.name}`);
      }
    }
  }, [location.search]);

  // Mostrar ayuda si se llega desde el botón de WhatsApp (desktop)
  useEffect(() => {
    try {
      if (sessionStorage.getItem('showFormHint') === '1') {
        setShowHint(true);
        sessionStorage.removeItem('showFormHint');
      }
    } catch {}
  }, []);

  const isFormValid = nombre && apellido && dni && mayor21 && (usadas || (cilindrada && modelo));

  const missingFields = [];
  if (!nombre) missingFields.push('Nombre');
  if (!apellido) missingFields.push('Apellido');
  if (!dni) missingFields.push('DNI');
  if (!mayor21) missingFields.push('¿Tenés más de 21 años?');
  // if (!sucursal) missingFields.push('Sucursal');
  if (!usadas) {
    if (!cilindrada) missingFields.push('Cilindrada');
    if (!modelo) missingFields.push('Modelo');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(false);
    let mensaje = `Hola! Mi nombre es ${nombre} ${apellido}.\n`;
    mensaje += `DNI: ${dni}.\n`;
    mensaje += `Tengo ${mayor21 === 'si' ? 'más' : 'menos'} de 21 años.\n`;
    // Sitio exclusivo Venado Tuerto
    mensaje += `Sucursal: Venado Tuerto.\n`;
    if (usadas) {
      mensaje += `Quiero consultar por motos usadas.\n`;
    } else {
      mensaje += `Cilindrada: ${cilindrada}cc.\n`;
      mensaje += `Modelo: ${modelo}.\n`;
  
    }
    if (observaciones) {
      mensaje += `Observaciones: ${observaciones}`;
    }
    // Formato correcto para wa.me: https://wa.me/NUMERO?text=MENSAJE
    const url = `https://wa.me/${WHATSAPP_VENADO.replace('+','')}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowErrors(true);
  };

  // Lista de campos requeridos para mostrar feedback visual
  const requiredFields = [
    { label: 'Nombre', valid: !!nombre },
    { label: 'Apellido', valid: !!apellido },
    { label: 'DNI', valid: !!dni },
    { label: '¿Tenés más de 21 años?', valid: !!mayor21 },
    ...(!usadas ? [
      { label: 'Cilindrada', valid: !!cilindrada },
      { label: 'Modelo', valid: !!modelo }
    ] : [])
  ];

  return (
    <form className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto flex flex-col gap-7 border border-gray-200 relative" onSubmit={handleSubmit}>
      {showHint && (
        <div className="hidden lg:flex absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-full px-4 py-2 shadow z-10">
          Completá tu consulta: elegí cilindrada y modelo, o marcá usadas.
          <button type="button" className="ml-3 text-white/70 hover:text-white" onClick={() => setShowHint(false)}>Cerrar</button>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-5 w-full">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="nombre">Nombre</label>
          <input id="nombre" type="text" className={`bg-white border ${showErrors && !nombre ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm w-full`} placeholder="Nombre" value={nombre} onChange={e => { setNombre(e.target.value); setTouched(true); }} onFocus={() => setTouched(true)} required />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="apellido">Apellido</label>
          <input id="apellido" type="text" className={`bg-white border ${showErrors && !apellido ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm w-full`} placeholder="Apellido" value={apellido} onChange={e => { setApellido(e.target.value); setTouched(true); }} onFocus={() => setTouched(true)} required />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="dni">DNI</label>
        <input 
          id="dni" 
          type="text" 
          className={`bg-white border ${showErrors && !dni ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm w-full`} 
          placeholder="DNI (sin puntos ni espacios)" 
          value={dni} 
          onChange={e => { 
            const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
            setDni(value); 
            setTouched(true); 
          }} 
          onFocus={() => setTouched(true)} 
          maxLength={8}
          required 
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">¿Tenés más de 21 años?</label>
        <div className="flex gap-8 mt-1">
          <label className="flex items-center gap-2 text-gray-600 text-base">
            <input type="radio" name="mayor21" value="si" checked={mayor21==='si'} onChange={e => { setMayor21(e.target.value); setTouched(true); }} onFocus={() => setTouched(true)} required className={`accent-primary ${showErrors && !mayor21 ? 'ring-2 ring-red-500' : ''}`} /> Sí
          </label>
          <label className="flex items-center gap-2 text-gray-600 text-base">
            <input type="radio" name="mayor21" value="no" checked={mayor21==='no'} onChange={e => { setMayor21(e.target.value); setTouched(true); }} onFocus={() => setTouched(true)} required className={`accent-primary ${showErrors && !mayor21 ? 'ring-2 ring-red-500' : ''}`} /> No
          </label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={usadas} onChange={e => { setUsadas(e.target.checked); setCilindrada(''); setModelo(''); setTouched(true); }} onFocus={() => setTouched(true)} className="accent-primary w-5 h-5" id="usadas" />
        <label htmlFor="usadas" className="font-semibold text-gray-700 text-base select-none">Quiero consultar por motos usadas</label>
      </div>
      {/* Sucursal (comentado: sitio exclusivo Venado Tuerto)
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Sucursal</label>
        <div className="flex gap-8 mt-1">
          <label className="flex items-center gap-2 text-gray-600 text-base">
            <input type="radio" name="sucursal" value="venado" checked={sucursal==='venado'} onChange={e => { setSucursal(e.target.value); setTouched(true); }} onFocus={() => setTouched(true)} className="accent-primary" /> Venado Tuerto
          </label>
          <label className="flex items-center gap-2 text-gray-600 text-base">
            <input type="radio" name="sucursal" value="parana" checked={sucursal==='parana'} onChange={e => { setSucursal(e.target.value); setTouched(true); }} onFocus={() => setTouched(true)} className="accent-primary" /> Paraná
          </label>
        </div>
      </div>
      */}
            {!usadas && (
        <div className="flex flex-col md:flex-row gap-5 w-full">
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="cilindrada">Cilindrada</label>
            <select id="cilindrada" className={`bg-white border ${showErrors && !cilindrada ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm w-full min-w-0 max-w-full`} value={cilindrada} onChange={e => { setCilindrada(e.target.value); setModelo(''); setTouched(true); }} onFocus={() => setTouched(true)} required>
              <option value="">-- Elegir cilindrada --</option>
              {cilindradasUnicas.map((cc, idx) => (
                <option key={idx} value={cc}>{cc}cc</option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="modelo">Modelo</label>
            <select id="modelo" className={`bg-white border ${showErrors && !modelo ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm w-full min-w-0 max-w-full`} value={modelo} onChange={e => { setModelo(e.target.value); setTouched(true); }} onFocus={() => setTouched(true)} required>
              <option value="">-- Elegir modelo --</option>
              {modelosUnicos.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="observaciones">Observaciones <span className="text-gray-400 font-normal">(opcional)</span></label>
        <textarea id="observaciones" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm resize-none w-full" value={observaciones} onChange={e => { setObservaciones(e.target.value); setTouched(true); }} onFocus={() => setTouched(true)} rows={3} placeholder="Ej: Quiero saber por financiación, entrega, requisitos, etc." />
      </div>
      
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-[#ff6600] hover:bg-[#ff944d] text-white font-bold rounded-xl py-3 text-lg shadow-md border border-[#ff6600]/70 focus:outline-none focus:ring-2 focus:ring-[#ff6600] transition w-full disabled:opacity-50 mt-2"
        disabled={!isFormValid}
        onClick={isFormValid ? undefined : handleDisabledClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6.01L0 24l6.18-1.62A12.13 12.13 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.67.96.98-3.58-.23-.37A9.98 9.98 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 5.02 4.22.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
        Consultar por WhatsApp
      </button>
      {touched && (
        <ul className="mt-4 flex flex-col gap-2 text-sm font-semibold text-left">
          {requiredFields.map(f => (
            <li key={f.label} className={f.valid ? 'text-green-600 flex items-center gap-2' : 'text-red-600 flex items-center gap-2'}>
              <span className="inline-block w-4 mr-1">{f.valid ? '✔️' : '⛔'}</span> {f.label}
            </li>
          ))}
        </ul>
      )}
      {showErrors && missingFields.length > 0 && (
        <div className="mt-2 text-red-600 text-sm font-semibold text-center">
          Completá los siguientes campos: {missingFields.join(', ')}
        </div>
      )}
    </form>
  );
};

export default ContactForm; 