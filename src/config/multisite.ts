const trim = (v: string | undefined) => (v ?? '').trim();

export function multisiteProductsUrl(): string {
  const u = trim(import.meta.env.VITE_MULTISITE_PRODUCTS_URL);
  if (u) return u;
  return '/im/products.json';
}

export function multisiteAssetsOrigin(): string | undefined {
  const o = trim(import.meta.env.VITE_MULTISITE_ASSETS_ORIGIN);
  if (!o) return undefined;
  return o.replace(/\/$/, '');
}
