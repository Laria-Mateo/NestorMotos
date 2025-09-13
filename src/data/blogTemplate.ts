// Plantilla para crear posts del blog por bloques
export type BlogBlock =
  | { type: 'heading'; level?: 2 | 3; text: string }
  | { type: 'paragraph'; html?: string; text?: string }
  | { type: 'image'; src: string; alt?: string; caption?: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'gallery'; images: string[] }
  | { type: 'hr' }
  | { type: 'keypoints'; items: string[] }
  | { type: 'table'; rows: { label: string; value: string }[] }
  | { type: 'cta'; href: string; label: string };

export type BlogSEO = {
  description?: string;
  keywords?: string[];
  image?: string;
};

export type BlogPostInput = {
  id: number | string;
  title: string;
  blocks: BlogBlock[];
  seo?: BlogSEO;
};

export const createBlogPost = (p: BlogPostInput) => ({
  id: p.id,
  title: p.title,
  blocks: p.blocks,
  html: '',
  seo: p.seo || {},
});

// Esqueleto listo para copiar/pegar
export const samplePost = createBlogPost({
  id: 999,
  title: 'Marca Modelo: ficha y novedades',
  seo: {
    description: 'Descripción corta del modelo para SEO.',
    keywords: ['marca', 'modelo', 'cilindrada'],
    image: '/motorbikes/Parana/ImagenPortada.webp',
  },
  blocks: [
    { type: 'image', src: '/motorbikes/.../cover.webp', alt: 'Modelo', caption: 'Pie de foto opcional' },
    { type: 'paragraph', html: 'Breve introducción del modelo y su posicionamiento.' },
    { type: 'heading', level: 2, text: 'Lo clave en 30 segundos' },
    { type: 'keypoints', items: [
      '<strong>Motor</strong> X cc, inyección',
      '<strong>Caja</strong> 6 vel, embrague asistido',
      '<strong>Seguridad</strong> ABS',
      '<strong>Equipamiento</strong> LED + tablero digital',
    ] },
    { type: 'hr' },
    { type: 'heading', level: 2, text: 'Motor y rendimiento' },
    { type: 'table', rows: [
      { label: 'Tipo', value: 'Mono 4T, OHC' },
      { label: 'Cilindrada', value: 'XXX cc' },
      { label: 'Potencia', value: 'XX HP @ XXXX rpm' },
      { label: 'Torque', value: 'XX Nm @ XXXX rpm' },
      { label: 'Alimentación', value: 'PGM-FI' },
    ] },
    { type: 'heading', level: 2, text: 'Chasis, suspensión y frenos' },
    { type: 'table', rows: [
      { label: 'Delantera', value: 'Horquilla, recorrido' },
      { label: 'Trasera', value: 'Pro-Link, recorrido' },
      { label: 'Frenos', value: 'Discos del/tras' },
      { label: 'ABS', value: 'Sí/No' },
    ] },
    { type: 'heading', level: 2, text: 'Medidas y capacidades' },
    { type: 'table', rows: [
      { label: 'Dimensiones', value: 'L × A × H' },
      { label: 'Distancia entre ejes', value: 'XXXX mm' },
      { label: 'Altura del asiento', value: 'XXX mm' },
      { label: 'Peso', value: 'XXX kg' },
      { label: 'Tanque', value: 'X,X L' },
    ] },
    { type: 'cta', href: '/#contacto', label: 'Consultar disponibilidad' },
  ],
});




