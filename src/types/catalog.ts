import type { Moto, Producto } from '../api/types';
import { mediaUrl } from '../utils/mediaUrl';
import { cilindradaBucket, parseCilindradaCc } from '../utils/cilindrada';

export type CarouselMoto = {
  id: string;
  name: string;
  cc: number;
  cilindrada: string;
  marcaNombre: string;
  image: string;
  detailKind: 'moto' | 'producto';
  isQuad?: boolean;
};

export function isQuadLabel(nombre: string, cilindrada: string): boolean {
  const s = `${nombre} ${cilindrada}`.toLowerCase();
  return s.includes('quad') || s.includes('cuatri');
}

export type CarouselBuckets = {
  cc110: CarouselMoto[];
  cc125_150: CarouselMoto[];
  cc160plus: CarouselMoto[];
  quads: CarouselMoto[];
};

export function groupCarouselMotos(motos: CarouselMoto[]): CarouselBuckets {
  const buckets: CarouselBuckets = { cc110: [], cc125_150: [], cc160plus: [], quads: [] };
  for (const m of motos) {
    if (m.detailKind !== 'moto') continue;
    if (m.isQuad) {
      buckets.quads.push(m);
      continue;
    }
    const bucket = cilindradaBucket(m.cc);
    if (bucket) buckets[bucket].push(m);
  }
  return buckets;
}

export function motoToCarousel(m: Moto): CarouselMoto {
  return {
    id: String(m.id),
    name: m.nombre,
    cc: parseCilindradaCc(m.cilindrada),
    cilindrada: m.cilindrada,
    marcaNombre: m.marcaNombre,
    image: mediaUrl(m.fotoPrincipalUrl),
    detailKind: 'moto',
    isQuad: isQuadLabel(m.nombre, m.cilindrada),
  };
}

export function productoToCarousel(p: Producto): CarouselMoto {
  return {
    id: String(p.id),
    name: p.nombre,
    cc: 0,
    cilindrada: '',
    marcaNombre: p.categoria,
    image: mediaUrl(p.fotoUrl),
    detailKind: 'producto',
  };
}

export type CatalogCard = CarouselMoto & {
  categoria?: string;
  es0km?: boolean;
  marcaId?: number;
};

export function motoToCard(m: Moto): CatalogCard {
  return { ...motoToCarousel(m), es0km: m.es0km, marcaId: m.marcaId };
}

export function productoToCard(p: Producto): CatalogCard {
  return { ...productoToCarousel(p), categoria: p.categoria };
}
