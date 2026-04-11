export function unwrapProductsList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data !== null && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    for (const k of ['data', 'items', 'products', 'result'] as const) {
      const v = o[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}
