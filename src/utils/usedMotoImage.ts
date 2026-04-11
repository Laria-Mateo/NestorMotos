export const USED_GALLERY_FALLBACK = [
  '/motorbikes/used/USADA1.webp',
  '/motorbikes/used/USADA2.webp',
  '/motorbikes/used/USADA3.webp',
  '/motorbikes/used/USADA4.webp',
  '/motorbikes/used/USADA 5.webp',
] as const;

export function toUsedImagePath(src: string): string {
  if (!src) return '/logoSinFondo3.webp';
  if (/^https?:\/\//i.test(src)) return src;
  const norm = src.replace(/\\/g, '/');
  if (/\/ImagenesLanding\//i.test(norm)) {
    const file = norm.split('/').filter(Boolean).pop();
    return file ? `/im/${file}` : '/logoSinFondo3.webp';
  }
  if (norm.startsWith('/im/')) return norm;
  if (norm.startsWith('/')) return norm;
  const file = norm.split('/').pop() || norm;
  return `/im/${file}`;
}

type MotoWithImage = { image: string };

export function getUsedMotoDisplayImage(moto: MotoWithImage, index: number): string {
  if (!moto.image) {
    return USED_GALLERY_FALLBACK[index % USED_GALLERY_FALLBACK.length];
  }
  const candidate = toUsedImagePath(moto.image);
  if (candidate.startsWith('/') || candidate.startsWith('http')) {
    return candidate;
  }
  return USED_GALLERY_FALLBACK[index % USED_GALLERY_FALLBACK.length];
}
