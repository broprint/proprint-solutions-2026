export const PRODUCT_CATEGORIES = [
  'Computers',
  'Printers & MFPs',
  'Plotters & Wide Format',
  'Networking',
  'Servers & Storage',
  'Monitors & Displays',
  'UPS & Power',
  'Consumables',
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
  monitors: 'Monitors & Displays',
  monitor: 'Monitors & Displays',
  displays: 'Monitors & Displays',
  'monitors & displays': 'Monitors & Displays',
  ups: 'UPS & Power',
  power: 'UPS & Power',
  'ups & power': 'UPS & Power',
  consumables: 'Consumables',
  consumable: 'Consumables',
  toner: 'Consumables',
  ink: 'Consumables',
  accessories: 'Accessories',
  accessory: 'Accessories',
  'it accessories': 'Accessories',
};

export function normalizeProductCategory(category: string): string {
  const trimmed = category.trim();
  return CATEGORY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

// Maps public homepage category cards to canonical category values used by
// the self-managed catalog. Every homepage card has an explicit destination,
// including categories that may temporarily contain zero products.
export const HOME_CATEGORY_FILTERS: Record<string, ProductCategory> = {
  'Laptops & PCs': 'Computers',
  'Printers & MFPs': 'Printers & MFPs',
  'Plotters & Wide Format': 'Plotters & Wide Format',
  Networking: 'Networking',
  'Servers & Storage': 'Servers & Storage',
  'Monitors & Displays': 'Monitors & Displays',
  'UPS & Power': 'UPS & Power',
  Consumables: 'Consumables',
  'IT Accessories': 'Accessories',
};

export function categoryShopHref(displayName: string) {
  const category = HOME_CATEGORY_FILTERS[displayName];
  return category ? `/shop?category=${encodeURIComponent(category)}#catalog` : '/shop#catalog';
}
