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
};

export const products: Product[] = [
  { slug:'hp-probook-450-g10', name:'HP ProBook 450 G10', brand:'HP', category:'Laptops', price:'KD 249.000', badge:'BEST SELLER', specs:['Intel Core i5','16GB RAM','512GB SSD'], icon:'laptop' },
  { slug:'hp-laserjet-pro-mfp-4103fdw', name:'HP LaserJet Pro MFP 4103fdw', brand:'HP', category:'Printers', price:'KD 129.000', badge:'BUSINESS PICK', specs:['Laser MFP','Duplex','Wi-Fi & Ethernet'], icon:'printer' },
  { slug:'epson-ecotank-l6290', name:'Epson EcoTank L6290', brand:'Epson', category:'Printers', price:'KD 89.000', badge:'POPULAR', specs:['Color Ink Tank','ADF','Wi-Fi'], icon:'printer' },
  { slug:'dell-p2725h-monitor', name:'Dell P2725H 27” Monitor', brand:'Dell', category:'Monitors', price:'KD 79.000', badge:'NEW', specs:['27-inch FHD','HDMI / DisplayPort','Business Display'], icon:'monitor' },
  { slug:'hp-designjet-t650', name:'HP DesignJet T650 36” Plotter', brand:'HP', category:'Plotters', price:'Request Quote', badge:'PROFESSIONAL', specs:['36-inch Large Format','CAD & Technical','Network Ready'], icon:'plotter' },
  { slug:'ubiquiti-unifi-u7-pro', name:'Ubiquiti UniFi U7 Pro', brand:'Ubiquiti', category:'Networking', price:'KD 69.000', specs:['Wi-Fi 7','Ceiling Mount','Enterprise Wireless'], icon:'network' },
  { slug:'samsung-990-pro-2tb', name:'Samsung 990 PRO 2TB SSD', brand:'Samsung', category:'Storage', price:'KD 54.000', specs:['2TB NVMe','PCIe 4.0','High Performance'], icon:'storage' },
  { slug:'lenovo-thinkpad-e14', name:'Lenovo ThinkPad E14', brand:'Lenovo', category:'Laptops', price:'KD 229.000', specs:['Intel Core i5','16GB RAM','512GB SSD'], icon:'laptop' },
];

export const categories = [
  ['Laptops & PCs','Business laptops, desktops and workstations','laptop'],
  ['Printers & MFPs','Office, business and multifunction printing','printer'],
  ['Plotters & Wide Format','CAD, technical and large-format printing','plotter'],
  ['Networking','Routers, switches, Wi-Fi and infrastructure','network'],
  ['Servers & Storage','Servers, NAS, SSD, HDD and memory','storage'],
  ['Monitors & Accessories','Displays, UPS, peripherals and connectivity','monitor'],
] as const;
