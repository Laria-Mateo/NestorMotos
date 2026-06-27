import { apiBaseUrl } from '../config/api';

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '/logoSinFondo3.webp';
  const s = path.trim();
  if (!s) return '/logoSinFondo3.webp';
  if (/^https?:\/\//i.test(s)) return s;
  const base = apiBaseUrl();
  return s.startsWith('/') ? `${base}${s}` : `${base}/${s}`;
}
