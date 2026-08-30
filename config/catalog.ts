export const PRODUCT_CATEGORIES = [
  'Computers',
  'Printers & MFPs',
  'Plotters & Wide Format',
  'Networking',
  'Servers & Storage',
  'Accessories',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const CATEGORY_ALIASES: Record<string, ProductCategory> = {
  laptops: 'Computers',
  laptop: 'Computers',
  computers: 'Computers',
  computer: 'Computers',
  pcs: 'Computers',
  'laptops & pcs': 'Computers',
  printers: 'Printers & MFPs',
  printer: 'Printers & MFPs',
  'printers & mfps': 'Printers & MFPs',
  mfps: 'Printers & MFPs',
  plotters: 'Plotters & Wide Format',
  plotter: 'Plotters & Wide Format',
  'plotters & wide format': 'Plotters & Wide Format',
  networking: 'Networking',
  network: 'Networking',
  storage: 'Servers & Storage',
  servers: 'Servers & Storage',
  'servers & storage': 'Servers & Storage',
  accessories: 'Accessories',
  accessory: 'Accessories',
  'it accessories': 'Accessories',
};

export function normalizeProductCategory(category: string): string {
  const trimmed = category.trim();
  return CATEGORY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

// Maps the public homepage category cards to the canonical category values
// stored by the admin catalog. Keeping this in one place makes the catalog
// easier to reuse for future white-label deployments.
export const HOME_CATEGORY_FILTERS: Record<string, ProductCategory> = {
  'Laptops & PCs': 'Computers',
  'Printers & MFPs': 'Printers & MFPs',
  'Plotters & Wide Format': 'Plotters & Wide Format',
  Networking: 'Networking',
  'Servers & Storage': 'Servers & Storage',
  'IT Accessories': 'Accessories',
};

export function categoryShopHref(displayName: string) {
  const category = HOME_CATEGORY_FILTERS[displayName];
  return category ? `/shop?category=${encodeURIComponent(category)}#catalog` : '/shop#catalog';
}
