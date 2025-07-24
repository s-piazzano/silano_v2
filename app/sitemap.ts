import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.silanosrl.it'
  
  return [
    {
      url: `${baseUrl}/sitemap-static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-dynamic-1.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-dynamic-2.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-dynamic-3.xml`,
      lastModified: new Date(),
    },
  ]
}
