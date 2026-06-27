const trim = (v: string | undefined) => (v ?? '').trim();

export function apiBaseUrl(): string {
  const fromEnv = trim(import.meta.env.VITE_API_BASE_URL);
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return 'https://foxsolutions.com.ar:5001';
}

export const API_PREFIX = '/api/v1';
