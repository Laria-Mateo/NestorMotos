import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageGallery from '../components/ImageGallery';
import { getMotoById } from '../api/catalogApi';
import type { Moto } from '../api/types';
import { branchSlugToApiSucursal } from '../constants/sucursal';
import { mediaUrl } from '../utils/mediaUrl';
import { resolveBranchSlug } from '../utils/branch';

const UsedModelDetail: React.FC = () => {
  const { id, branch } = useParams<{ id: string; branch: string }>();
  const navigate = useNavigate();
  const branchSlug = resolveBranchSlug(branch);
  const [moto, setMoto] = useState<Moto | null | undefined>(undefined);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id || !/^\d+$/.test(id)) {
        setMoto(null);
        return;
      }
      const sucursal = branchSlugToApiSucursal(branchSlug);
      const found = await getMotoById(Number(id), sucursal);
      if (cancelled) return;
      if (!found || found.es0km) {
        setMoto(null);
        return;
      }
      setMoto(found);
    })();
    return () => { cancelled = true; };
  }, [id, branchSlug]);

  const galleryImages = useMemo(() => {
    if (!moto) return [];
    return [...moto.fotos]
      .sort((a, b) => a.orden - b.orden)
      .map((f) => ({ id: f.id, src: mediaUrl(f.fotoUrl) }));
  }, [moto]);

  const initialIndex = useMemo(() => {
    if (!moto?.fotoPrincipalUrl) return 0;
    const principal = mediaUrl(moto.fotoPrincipalUrl);
    const index = galleryImages.findIndex((image) => image.src === principal);
    return index >= 0 ? index : 0;
  }, [galleryImages, moto?.fotoPrincipalUrl]);

  const openConsult = () => {
    if (!moto) return;
    const phone = branchSlug === 'parana' ? '5493433007984' : '5493462252244';
    const text = `Hola! Me interesa el ${moto.nombre}. ¿Podrías darme más información?`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (moto === undefined) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 grid place-items-center"><p className="text-gray-600">Cargando...</p></main>
        <Footer />
      </div>
    );
  }

  if (!moto) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 grid place-items-center">
          <div className="text-center p-8">
            <p className="text-gray-700 mb-4">Moto no encontrada.</p>
            <Link to={`/${branchSlug}/usadas`} className="text-primary font-bold">Volver a usadas</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 mb-4">← Volver</button>
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow ring-1 ring-gray-200">
              <div className="bg-gray-50 flex flex-col items-center justify-center p-6 overflow-visible">
                <ImageGallery images={galleryImages} alt={moto.nombre} initialIndex={initialIndex} />
              </div>
              <div className="p-6 md:p-8 flex flex-col">
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">{moto.nombre}</h1>
                <p className="mt-3 text-base text-gray-600">
                  {moto.marcaNombre} · {moto.cilindrada}{moto.anio ? ` · Año ${moto.anio}` : ''}
                </p>
                {moto.descripcion ? (
                  <div className="mt-8 text-gray-800 text-base leading-relaxed whitespace-pre-line">{moto.descripcion}</div>
                ) : (
                  <p className="mt-8 text-gray-500">Consultá por más detalles de esta unidad.</p>
                )}
                <div className="mt-10">
                  <button type="button" onClick={openConsult} className="inline-flex px-6 py-3 rounded-xl bg-[#f75000] text-white font-bold hover:bg-[#ff7a33]">Consultar</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UsedModelDetail;
