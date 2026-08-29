export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  specs: string[];
  icon: 'laptop' | 'printer' | 'plotter' | 'monitor' | 'network' | 'storage';
  image?: string;
  imageAlt?: string;
  sku?: string;
  stock?: 'In stock' | 'Low stock' | 'Available on order' | 'Request availability' | 'Out of stock' | 'Quote only';
};

// Product photos are intentionally optional. When a verified manufacturer/product
// image is added under /public/products, the UI will use it automatically and
// otherwise fall back to the existing category illustration.
export const products: Product[] = [
  { slug:'hp-probook-450-g10', name:'HP ProBook 450 G10', brand:'HP', category:'Laptops', price:'KD 249.000', badge:'BEST SELLER', specs:['Intel Core i5','16GB RAM','512GB SSD'], icon:'laptop', imageAlt:'HP ProBook 450 G10 business laptop', sku:'DEMO-HP-PB450', stock:'In stock' },
  { slug:'hp-laserjet-pro-mfp-4103fdw', name:'HP LaserJet Pro MFP 4103fdw', brand:'HP', category:'Printers', price:'KD 129.000', badge:'BUSINESS PICK', specs:['Laser MFP','Duplex','Wi-Fi & Ethernet'], icon:'printer', imageAlt:'HP LaserJet Pro MFP 4103fdw printer', sku:'DEMO-HP-4103', stock:'In stock' },
  { slug:'epson-ecotank-l6290', name:'Epson EcoTank L6290', brand:'Epson', category:'Printers', price:'KD 89.000', badge:'POPULAR', specs:['Color Ink Tank','ADF','Wi-Fi'], icon:'printer', imageAlt:'Epson EcoTank L6290 multifunction printer', sku:'DEMO-EP-L6290', stock:'In stock' },
  { slug:'dell-p2725h-monitor', name:'Dell P2725H 27” Monitor', brand:'Dell', category:'Monitors', price:'KD 79.000', badge:'NEW', specs:['27-inch FHD','HDMI / DisplayPort','Business Display'], icon:'monitor', imageAlt:'Dell P2725H 27 inch business monitor', sku:'DEMO-DE-P2725H', stock:'In stock' },
  { slug:'hp-designjet-t650', name:'HP DesignJet T650 36” Plotter', brand:'HP', category:'Plotters', price:'Request Quote', badge:'PROFESSIONAL', specs:['36-inch Large Format','CAD & Technical','Network Ready'], icon:'plotter', imageAlt:'HP DesignJet T650 36 inch large format plotter', sku:'DEMO-HP-T650', stock:'Quote only' },
  { slug:'ubiquiti-unifi-u7-pro', name:'Ubiquiti UniFi U7 Pro', brand:'Ubiquiti', category:'Networking', price:'KD 69.000', specs:['Wi-Fi 7','Ceiling Mount','Enterprise Wireless'], icon:'network', imageAlt:'Ubiquiti UniFi U7 Pro wireless access point', sku:'DEMO-UB-U7P', stock:'Request availability' },
  { slug:'samsung-990-pro-2tb', name:'Samsung 990 PRO 2TB SSD', brand:'Samsung', category:'Storage', price:'KD 54.000', specs:['2TB NVMe','PCIe 4.0','High Performance'], icon:'storage', imageAlt:'Samsung 990 PRO 2TB NVMe SSD', sku:'DEMO-SA-990P', stock:'In stock' },
  { slug:'lenovo-thinkpad-e14', name:'Lenovo ThinkPad E14', brand:'Lenovo', category:'Laptops', price:'KD 229.000', specs:['Intel Core i5','16GB RAM','512GB SSD'], icon:'laptop', imageAlt:'Lenovo ThinkPad E14 business laptop', sku:'DEMO-LE-E14', stock:'In stock' },
];

export const categories = [
  ['Laptops & PCs','Business laptops, desktops and workstations','laptop'],
  ['Printers & MFPs','Office, business and multifunction printing','printer'],
  ['Plotters & Wide Format','CAD, technical and large-format printing','plotter'],
  ['Networking','Routers, switches, Wi-Fi and infrastructure','network'],
  ['Servers & Storage','Servers, NAS, SSD, HDD and memory','storage'],
  ['Monitors & Displays','Business displays and professional monitors','monitor'],
  ['UPS & Power','UPS systems, power protection and accessories','storage'],
  ['Consumables','Toner, ink, printheads and maintenance supplies','printer'],
  ['IT Accessories','Keyboards, mice, docks, cables and connectivity','monitor'],
] as const;
