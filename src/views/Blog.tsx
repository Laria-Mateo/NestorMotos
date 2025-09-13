import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

type BlogPost = {
  id: number;
  title?: string;
  html?: string;
  blocks?: any[];
  seo?: { description?: string; keywords?: string[]; image?: string };
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [q, setQ] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const initialQ = searchParams.get('q') || '';
    setQ(initialQ);
  }, [searchParams]);

  useEffect(() => {
    import('../data/blog.json')
      .then((m) => setPosts((m as any).default as BlogPost[]))
      .catch(() => setPosts([]));
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((p) => {
      const text = [
        p.title || '',
        (p.html || '').replace(/<[^>]*>/g, ' '),
        Array.isArray(p.blocks)
          ? p.blocks.map((b: any) => (b.text || b.html || '').toString()).join(' ')
          : '',
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(term);
    });
  }, [posts, q]);

  const getFirstImageFromBlocks = (blocks: any[] | undefined): string | null => {
    if (!Array.isArray(blocks)) return null;
    const img = blocks.find((b) => b && b.type === 'image');
    return img ? img.src : null;
  };

  const pageSize = 9;
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [q]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Blog y Novedades</h1>
          <p className="text-gray-600 mt-2">Últimos lanzamientos, fichas técnicas y noticias del mundo de las motos.</p>
          <div className="mt-6 max-w-lg mx-auto flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                const v = e.target.value;
                if (v) setSearchParams({ q: v }); else setSearchParams({});
              }}
              placeholder="Buscar por modelo, marca o cilindrada"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f75000] bg-white"
            />
            {q && (
              <button onClick={() => { setQ(''); setSearchParams({}); }} className="px-3 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100">Limpiar</button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 py-20">No hay publicaciones que coincidan con tu búsqueda.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageItems.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden ring-1 ring-gray-200/60">
                <Link to={`/blog/${p.id}`} className="block">
                  <img
                    src={(p.seo && p.seo.image) || getFirstImageFromBlocks(p.blocks) || '/logoSinFondo3.webp'}
                    alt={p.title || 'Nota'}
                    className="w-full aspect-[4/3] object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logoSinFondo3.webp'; }}
                  />
                  <div className="p-5">
                    <h2 className="text-lg font-extrabold text-gray-900 line-clamp-2">{p.title || 'Nota'}</h2>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{((p.html || '') || (Array.isArray(p.blocks) ? p.blocks.map((b:any)=> (b.text||b.html||'').toString()).join(' ') : '')).replace(/<[^>]*>/g, ' ').slice(0, 160)}…</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-[#f75000] font-semibold">Leer más
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {filtered.length > pageSize && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-2 rounded border border-gray-300 bg-white disabled:opacity-50"
              disabled={page === 1}
            >
              Anterior
            </button>
            <div className="px-3 py-2 text-gray-700">Página {page} de {totalPages}</div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-2 rounded border border-gray-300 bg-white disabled:opacity-50"
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;


