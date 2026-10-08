import type { MetadataRoute } from 'next';

const siteUrl = 'https://expensio.online';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Public marketing + auth pages
        allow: '/',
        // Keep private app surfaces and API routes out of the index
        disallow: ['/dashboard', '/admin', '/api', '/auth'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
