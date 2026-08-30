export const PRODUCT_CATEGORIES = [
  'Computers',
  'Printers & MFPs',
  'Plotters & Wide Format',
  'Networking',
  'Servers & Storage',
  'Accessories',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

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
