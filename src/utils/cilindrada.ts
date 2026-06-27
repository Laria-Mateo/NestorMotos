export function parseCilindradaCc(value: string | null | undefined): number {
  if (!value) return 0;
  const m = value.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

export function normalizeCilindrada(value: string): string {
  return value.trim().toLowerCase();
}

export function uniqueCilindradas(values: string[]): string[] {
  const map = new Map<string, string>();
  for (const v of values) {
    const t = v.trim();
    if (!t) continue;
    const key = normalizeCilindrada(t);
    if (!map.has(key)) map.set(key, t);
  }
  return Array.from(map.values()).sort((a, b) => parseCilindradaCc(a) - parseCilindradaCc(b));
}

export type CilindradaBucket = 'cc110' | 'cc125_150' | 'cc160plus';

export function cilindradaBucket(cc: number): CilindradaBucket | null {
  if (cc <= 0) return null;
  if (cc <= 110) return 'cc110';
  if (cc === 125 || cc === 150) return 'cc125_150';
  if (cc >= 160) return 'cc160plus';
  return 'cc125_150';
}

export const CILINDRADA_BUCKET_LABELS: Record<CilindradaBucket, string> = {
  cc110: '110CC',
  cc125_150: '125/150CC',
  cc160plus: '160CC o más',
};
