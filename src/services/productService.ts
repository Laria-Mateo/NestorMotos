import { multisiteAssetsOrigin, multisiteProductsUrl } from '../config/multisite';
import { unwrapProductsList } from '../config/multisitePayload';
import { resolveBranchSlug } from '../utils/branch';

export type UsedMoto = {
  id: string;
  name: string;
  year?: number;
  km?: number;
  categoryId?: number;
  categoryName?: string;
  image: string;
  description?: string;
  whatsappMessage?: string;
};

type RawProduct = Record<string, unknown>;

export function formatUsedMotoMeta(m: Pick<UsedMoto, 'year' | 'km'>): string {
  const parts: string[] = [];
  if (m.year != null && Number.isFinite(m.year)) parts.push(`Año ${m.year}`);
  if (m.km != null && Number.isFinite(m.km)) parts.push(`${m.km.toLocaleString()} km`);
  return parts.length > 0 ? parts.join(' · ') : 'Consultá por detalles';
}

function parseBody(body: unknown): RawProduct {
  if (body == null) return {};
  if (typeof body === 'string') {
    try {
      const o = JSON.parse(body) as unknown;
      return typeof o === 'object' && o !== null ? (o as RawProduct) : {};
    } catch {
      return {};
    }
  }
  if (typeof body === 'object') return body as RawProduct;
  return {};
}

function asFiniteNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v.trim());
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function landingPathToImFolder(path: string): string | null {
  const n = path.replace(/\\/g, '/');
  if (!/\/ImagenesLanding\//i.test(n)) return null;
  const file = n.split('/').filter(Boolean).pop();
  return file ? `/im/${file}` : null;
}

function resolveImageUrl(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  const origin = multisiteAssetsOrigin() ?? '';
  if (origin) {
    if (s.startsWith('/')) return `${origin}${s}`;
    return `${origin}/${s}`;
  }
  const mapped = landingPathToImFolder(s.startsWith('/') ? s : `/${s}`);
  if (mapped) return mapped;
  return s.startsWith('/') ? s : `/${s}`;
}

function mapRawToUsedMoto(item: RawProduct): UsedMoto | null {
  if (item.isActive === false) return null;
  const idVal = item.id;
  if (idVal == null || idVal === '') return null;
  const id = String(idVal);
  const nameRaw = item.name;
  const name = typeof nameRaw === 'string' ? nameRaw.trim() : '';
  if (!name) return null;
  const body = parseBody(item.body);
  const year = asFiniteNumber(item.year) ?? asFiniteNumber(body.year);
  const km = asFiniteNumber(item.km) ?? asFiniteNumber(body.km);
  const imageRaw = item.imageUrl ?? item.image;
  const image = resolveImageUrl(imageRaw);
  const descRaw = item.description;
  const description = typeof descRaw === 'string' ? descRaw : undefined;
  const wmRaw = body.whatsappMessage;
  const whatsappMessage = typeof wmRaw === 'string' && wmRaw.trim() ? wmRaw.trim() : undefined;
  const categoryId = asFiniteNumber(item.categoryId) ?? asFiniteNumber(body.categoryId);
  const catNameRaw = item.categoryName ?? body.categoryName;
  const categoryName = typeof catNameRaw === 'string' && catNameRaw.trim() ? catNameRaw.trim() : undefined;
  return {
    id,
    name,
    year,
    km,
    categoryId,
    categoryName,
    image,
    description: description && description !== '' ? description : undefined,
    whatsappMessage,
  };
}

export function resolveUsedMotoWhatsappText(m: Pick<UsedMoto, 'name' | 'whatsappMessage'>): string {
  const t = m.whatsappMessage?.trim();
  if (t) return t;
  return `Hola! Me interesa el ${m.name}. ¿Podrías darme más información?`;
}

export const MULTISITE_CATEGORY_ELECTRICAS = 'Electricas';
export const MULTISITE_CATEGORY_USADAS = 'Usadas';
export const MULTISITE_CATEGORY_VENADO_USADAS = 'venado/Usadas';

const USADAS_LISTING_CATEGORIES = new Set(
  [MULTISITE_CATEGORY_USADAS, MULTISITE_CATEGORY_VENADO_USADAS].map((c) => c.toLowerCase()),
);

export function usedCategoryNameForBranch(branch: string): string {
  return resolveBranchSlug(branch) === 'venado'
    ? MULTISITE_CATEGORY_VENADO_USADAS
    : MULTISITE_CATEGORY_USADAS;
}

export function isUsedListingCategory(categoryName: string | undefined): boolean {
  const c = (categoryName || '').trim().toLowerCase();
  return USADAS_LISTING_CATEGORIES.has(c);
}

export function matchesUsedCategoryForBranch(
  categoryName: string | undefined,
  branch: string,
): boolean {
  const c = (categoryName || '').trim().toLowerCase();
  const slug = resolveBranchSlug(branch);
  if (slug === 'venado') {
    return c === MULTISITE_CATEGORY_VENADO_USADAS.toLowerCase();
  }
  return c === MULTISITE_CATEGORY_USADAS.toLowerCase();
}

export class ProductService {
  static async getProductsByCategoryName(categoryName: string): Promise<UsedMoto[]> {
    const list = await this.getProducts();
    const target = categoryName.trim().toLowerCase();
    if (!target) return [];
    return list.filter((p) => (p.categoryName || '').trim().toLowerCase() === target);
  }

  static async getUsedProductsForBranch(branch: string): Promise<UsedMoto[]> {
    const slug = resolveBranchSlug(branch);
    const list = await this.getProducts();
    return list.filter((p) => matchesUsedCategoryForBranch(p.categoryName, slug));
  }

  static async getProductsExcludingUsadas(): Promise<UsedMoto[]> {
    const list = await this.getProducts();
    return list.filter((p) => !isUsedListingCategory(p.categoryName));
  }

  static async getProducts(): Promise<UsedMoto[]> {
    try {
      const response = await fetch(multisiteProductsUrl());
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const raw: unknown = await response.json();
      const rows = unwrapProductsList(raw);
      const out: UsedMoto[] = [];
      for (const row of rows) {
        if (row === null || typeof row !== 'object') continue;
        const mapped = mapRawToUsedMoto(row as RawProduct);
        if (mapped) out.push(mapped);
      }
      return out;
    } catch {
      return [];
    }
  }

  static async getProductById(id: string): Promise<UsedMoto | undefined> {
    const list = await this.getProducts();
    return list.find((p) => p.id === id);
  }
}
