import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import BlogKeypoints from '../components/BlogKeypoints';
import BlogSpecTable, { type SpecRow } from '../components/BlogSpecTable';
import BlogCTA from '../components/BlogCTA';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  author: string;
  date: string;
  tags?: string[];
  seo?: { description?: string; keywords?: string[]; image?: string };
  content: string; // HTML
  gallery?: string[];
  blocks?: Array<
    | { type: 'paragraph'; html?: string; text?: string }
    | { type: 'heading'; level?: 2 | 3; text: string }
    | { type: 'image'; src: string; alt?: string; caption?: string; fullWidth?: boolean }
    | { type: 'list'; ordered?: boolean; items: string[] }
    | { type: 'quote'; text: string; cite?: string }
    | { type: 'gallery'; images: string[] }
    | { type: 'hr' }
    | { type: 'keypoints'; items: string[] }
    | { type: 'table'; rows: SpecRow[] }
    | { type: 'cta'; href: string; label: string }
  >;
  html?: string;
};

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    import('../data/blog.json').then((m) => {
      const list = (m as any).default as any[];
      setAllPosts(list);
      const p = list.find((x) => String(x.id) === String(id)) || null;
      // Mapear a Post minimal
      if (p) {
        const mapped: Post = {
          slug: String(p.id),
          title: p.title || 'Nota',
          excerpt: '',
          cover: (p.seo && p.seo.image) || '/logoSinFondo3.webp',
          author: 'Néstor Motos',
          date: new Date().toISOString(),
          content: (p.html && !p.blocks) ? p.html : '',
          gallery: [],
          html: p.blocks ? '' : (p.html || ''),
          blocks: p.blocks || [],
        };
        setPost(mapped);
      } else {
        setPost(null);
      }
    });
  }, [id]);

  // SEO/meta dinámicos: mantener SIEMPRE el mismo orden de hooks
  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    const title = `${post.title} | Néstor Motos`;
    document.title = title;

    const ensureMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
        return el;
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      return el;
    };
    const ensureLink = (rel: string, href: string) => {
      let el = Array.from(document.getElementsByTagName('link')).find((l) => l.getAttribute('rel') === rel) as HTMLLinkElement | undefined;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el!.setAttribute('href', href);
      return el!;
    };

    const desc = post.seo?.description || post.excerpt || `${post.title} - Néstor Motos`;
    const baseKeywords = (post.seo?.keywords || []);
    const cities = ['Paraná', 'Venado Tuerto'];
    const modelTokens = post.title.split(/\s+/).filter(Boolean);
    const extraKw = [
      ...cities.flatMap((c) => [
        `${post.title} ${c}`,
        `${modelTokens[0] || ''} ${modelTokens[1] || ''} ${c}`.trim(),
        `${(modelTokens[0] || '').toLowerCase()} ${(modelTokens[1] || '').toLowerCase()} ${c}`.trim(),
        `ficha técnica ${post.title}`,
      ]),
      'precio', 'financiación', '0km', 'usada', 'review', 'novedades'
    ];
    const keywords = Array.from(new Set([...baseKeywords, ...extraKw])).join(', ');
    const image = post.seo?.image || post.cover;

    // SEO básicos
    ensureMeta('meta[name="description"]', { name: 'description', content: desc });
    ensureMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: desc });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: image });

    // Canonical consolidado en Paraná para evitar duplicados entre sucursales
    const loc = typeof window !== 'undefined' ? window.location : undefined;
    const canonical = loc ? `${loc.origin}/parana/blog/${id}` : `/parana/blog/${id}`;
    ensureLink('canonical', canonical);
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });

    // Twitter cards
    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: desc });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

    return () => { document.title = prevTitle; };
  }, [post, id]);

  if (!post) {
    return <div className="min-h-screen bg-white"><div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600">Cargando…</div></div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.seo?.image || post.cover,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    description: post.seo?.description || post.excerpt,
    mainEntityOfPage: typeof window !== 'undefined' ? `${window.location.origin}/parana/blog/${id}` : `/parana/blog/${id}`,
    publisher: { '@type': 'Organization', name: 'Néstor Motos' },
    about: post.title,
    inLanguage: 'es-AR',
    articleSection: 'Motos'
  } as const;

  // Breadcrumbs para SEO
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: typeof window !== 'undefined' ? `${window.location.origin}/parana` : '/parana' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: typeof window !== 'undefined' ? `${window.location.origin}/parana/blog` : '/parana/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: typeof window !== 'undefined' ? `${window.location.origin}/parana/blog/${id}` : `/parana/blog/${id}` }
    ]
  };

  // Calcular tiempo de lectura aproximado (soporta html completo o blocks)
  const hasFullHtml = typeof (post as any).html === 'string' && (post as any).html.trim().length > 0;
  const wordCount = hasFullHtml
    ? ((post as any).html as string).replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length
    : post.blocks
    ? post.blocks
        .map((b: any) => (b.text || b.html || '').toString())
        .join(' ')
        .replace(/<[^>]*>/g, ' ')
        .trim()
        .split(/\s+/).length
    : post.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 220));

  const hasBlocks = !hasFullHtml && Array.isArray((post as any).blocks) && (post as any).blocks.length > 0;

  const getFirstImageFromHtml = (html: string | undefined): string | null => {
    if (!html) return null;
    const match = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
    return match ? match[1] : null;
  };

  const getFirstImageFromBlocks = (blocks: any[] | undefined): string | null => {
    if (!Array.isArray(blocks)) return null;
    const img = blocks.find((b) => b && b.type === 'image');
    return img ? img.src : null;
  };

  const recommended = allPosts
    .filter((p) => String(p.id) !== String(id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="p-6 md:p-8">
        <article>
          <header className="mb-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-[#f75000]">Novedades</div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 leading-tight tracking-tight">{post.title}</h1>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <span>Por {post.author}</span>
              <div className="flex items-center gap-2">
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                <span>•</span>
                <span>{readingTime} min de lectura</span>
                <span>•</span>
                {/* Instagram link dinámico por sucursal */}
                <a
                  href={(typeof window !== 'undefined' && (localStorage.getItem('branch') === 'parana'))
                    ? 'https://www.instagram.com/nestormotosparana/'
                    : 'https://www.instagram.com/nestormotosvenadotuerto/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram sucursal"
                  className="inline-flex items-center text-[#f75000] hover:text-[#ff7a33]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-.75a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </header>
          {/* Render HTML completo si está presente; si no, por bloques; si no, fallback */}
          {hasFullHtml ? (
            <div className="prose prose-orange max-w-none prose-headings:font-extrabold prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: (post as any).html as string }} />
          ) : hasBlocks ? (
            <div className="space-y-6">
              {(post as any).blocks.map((b: any, idx: number) => {
                if (b.type === 'heading') {
                  const Tag: any = b.level === 3 ? 'h3' : 'h2'
                  return (
                    <Tag key={idx} className="font-extrabold text-gray-900 text-2xl md:text-3xl">
                      {b.text}
                    </Tag>
                  )
                }
                if (b.type === 'paragraph') {
                  if (b.html) {
                    return (
                      <div key={idx} className="prose prose-orange max-w-none prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: b.html }} />
                    )
                  }
                  return <p key={idx} className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: b.text || '' }} />
                }
                if (b.type === 'image') {
                  return (
                    <figure key={idx} className="my-4">
                      <img src={b.src} alt={b.alt || ''} className="w-full rounded-xl shadow-md object-cover" />
                      {b.caption && <figcaption className="mt-2 text-sm text-gray-500">{b.caption}</figcaption>}
                    </figure>
                  )
                }
                if (b.type === 'gallery' && Array.isArray(b.images)) {
                  return (
                    <div key={idx} className="space-y-4">
                      {b.images.map((src: string, i: number) => (
                        <img key={src + i} src={src} alt={`${post.title} ${i + 1}`} className="w-full rounded-xl shadow-md object-cover" />
                      ))}
                    </div>
                  )
                }
                if (b.type === 'list' && Array.isArray(b.items)) {
                  const ListTag: any = b.ordered ? 'ol' : 'ul'
                  return (
                    <ListTag key={idx} className="list-disc pl-6 text-gray-800">
                      {b.items.map((it: string, i: number) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
                      ))}
                    </ListTag>
                  )
                }
                if (b.type === 'quote') {
                  return (
                    <blockquote key={idx} className="border-l-4 border-[#f75000] pl-4 italic text-gray-700">
                      {b.text}
                      {b.cite && <div className="mt-1 text-xs text-gray-500">— {b.cite}</div>}
                    </blockquote>
                  )
                }
                if (b.type === 'keypoints') {
                  return <BlogKeypoints key={idx} items={Array.isArray(b.items) ? b.items : []} />
                }
                if (b.type === 'table') {
                  return <BlogSpecTable key={idx} rows={Array.isArray(b.rows) ? b.rows : []} />
                }
                if (b.type === 'cta') {
                  return <BlogCTA key={idx} href={b.href} label={b.label || 'Consultar'} />
                }
                if (b.type === 'hr') {
                  return <hr key={idx} className="border-gray-200" />
                }
                return null
              })}
            </div>
          ) : (
            <>
              <img
                src={post.cover}
                alt={post.title}
                className="w-full rounded-2xl shadow mb-8 object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logoSinFondo3.webp'; }}
              />
              {/* Fallback al HTML + galería antigua */}
              <div className="prose prose-orange max-w-none prose-headings:font-extrabold prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
              {post.gallery && post.gallery.length > 0 && (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <img src={post.gallery[0]} alt={`${post.title} 1`} className="w-full rounded-2xl shadow object-cover" />
                  </div>
                  <div className="grid grid-rows-2 gap-5">
                    {post.gallery.slice(1, 3).map((src, i) => (
                      <img key={src + i} src={src} alt={`${post.title} ${i + 2}`} className="w-full h-full rounded-2xl shadow object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Logo al final */}
          <div className="mt-10 flex justify-center">
            <img src="/logoSinFondo3.webp" alt="Néstor Motos" className="h-16 w-auto opacity-90" />
          </div>

          {/* Recomendados */}
          {recommended.length > 0 && (
            <section className="mt-12">
              <h3 className="text-xl font-extrabold text-gray-900 mb-4">Recomendados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recommended.map((p) => {
                  const img = (p.seo && p.seo.image) || getFirstImageFromHtml(p.html) || getFirstImageFromBlocks(p.blocks) || '/logoSinFondo3.webp';
                  return (
                    <a key={p.id} href={`../blog/${p.id}`} className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden ring-1 ring-gray-200/60">
                      <img src={img} alt={p.title || 'Nota'} className="w-full aspect-[4/3] object-cover" />
                      <div className="p-3">
                        <div className="text-sm font-semibold text-gray-900 line-clamp-2">{p.title || 'Nota'}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </article>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
};

export default BlogPost;


