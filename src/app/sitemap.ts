import type { MetadataRoute } from 'next';

const siteUrl = 'https://expensio.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Only publicly crawlable routes — /dashboard, /admin, /auth are disallow-listed
  // in robots.ts and excluded here as well.
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ];
}
