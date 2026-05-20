import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ProductService,
  formatUsedMotoMeta,
  isUsedListingCategory,
  matchesUsedCategoryForBranch,
  resolveUsedMotoWhatsappText,
  type UsedMoto,
} from '../services/productService';
import { getUsedMotoDisplayImage } from '../utils/usedMotoImage';
import { resolveBranchSlug } from '../utils/branch';

const UsedModelDetail: React.FC = () => {
  const { id, branch } = useParams<{ id: string; branch: string }>();
  const navigate = useNavigate();
  const branchSlug = resolveBranchSlug(branch);

  const [moto, setMoto] = useState<UsedMoto | null | undefined>(undefined);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) {
        setMoto(null);
        return;
      }
      const found = await ProductService.getProductById(id);
      if (cancelled) return;
      if (!found) {
        setMoto(null);
        return;
      }
      if (isUsedListingCategory(found.categoryName) && !matchesUsedCategoryForBranch(found.categoryName, branchSlug)) {
        setMoto(null);
        return;
      }
      setMoto(found);
    };
    run();
    return () => { cancelled = true; };
  }, [id, branchSlug]);

  const displaySrc = moto ? getUsedMotoDisplayImage(moto, 0) : '';

  const openConsult = () => {
    if (!moto) return;
    const WHATSAPP_PARANA = '5493433007984';
    const WHATSAPP_VENADO = '5493462252244';
    const phone = branchSlug === 'parana' ? WHATSAPP_PARANA : WHATSAPP_VENADO;
    const text = resolveUsedMotoWhatsappText(moto);
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (moto === undefined) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 grid place-items-center">
          <p className="text-gray-600">Cargando...</p>
        </main>
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

  const desc = (moto.description || '').trim();
  const metaLine = formatUsedMotoMeta(moto);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 mb-4">← Volver</button>
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow ring-1 ring-gray-200 overflow-hidden">
              <div className="bg-gray-50 flex items-center justify-center p-6 md:p-10 min-h-[280px] md:min-h-[480px]">
                <img
                  src={displaySrc}
                  alt={moto.name}
                  className="w-full max-h-[min(70vh,560px)] md:max-h-[560px] object-contain"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.onerror = null;
                    img.src = '/logoSinFondo3.webp';
                  }}
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col">
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">{moto.name}</h1>
                <p className="mt-3 text-base text-gray-600">{metaLine}</p>
                {desc ? (
                  <div className="mt-8 text-gray-800 text-base leading-relaxed whitespace-pre-line">{desc}</div>
                ) : (
                  <p className="mt-8 text-gray-500 text-base">Consultá por más detalles de esta unidad.</p>
                )}
                <div className="mt-10">
                  <button
                    type="button"
                    onClick={openConsult}
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-[#f75000] text-white font-bold hover:bg-[#ff7a33] transition"
                  >
                    Consultar
                  </button>
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
