/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MULTISITE_PRODUCTS_URL?: string;
  readonly VITE_MULTISITE_ASSETS_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
