import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://proprint-solutions-2026.vercel.app';
  const routes = ['', '/shop', '/service', '/amc', '/enterprise', '/quote', '/about', '/contact'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/shop' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/shop' ? 0.9 : 0.7,
  }));
}
