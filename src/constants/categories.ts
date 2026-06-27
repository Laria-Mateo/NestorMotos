export const PRODUCT_CATEGORY_ELECTRICAS = 'Electricas';
export const PRODUCT_CATEGORY_USADAS = 'Usadas';
export const PRODUCT_CATEGORY_VENADO_USADAS = 'venado/Usadas';

const USED_CATEGORIES = new Set([
  PRODUCT_CATEGORY_USADAS.toLowerCase(),
  PRODUCT_CATEGORY_VENADO_USADAS.toLowerCase(),
]);

export function usedProductCategoryForBranch(branch: string): string {
  return branch.trim().toLowerCase() === 'venado'
    ? PRODUCT_CATEGORY_VENADO_USADAS
    : PRODUCT_CATEGORY_USADAS;
}

export function isUsedProductCategory(categoria: string | undefined): boolean {
  return USED_CATEGORIES.has((categoria ?? '').trim().toLowerCase());
}

export function matchesUsedProductCategory(categoria: string | undefined, branch: string): boolean {
  return (categoria ?? '').trim().toLowerCase() === usedProductCategoryForBranch(branch).toLowerCase();
}
