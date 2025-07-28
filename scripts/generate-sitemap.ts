import fs from 'fs';
import path from 'path';
import { gql } from '@apollo/client';
import createApolloClient from '../lib/client';

import * as dotenv from 'dotenv';
dotenv.config(); // <-- QUESTA RIGA È FONDAMENTALE PER GLI SCRIPT STANDALONE!

// Definizione dei tipi
type ProductAttributes = {
  slug: string;
  updatedAt: string;
};

type Product = {
  attributes: ProductAttributes;
};

type ProductsQueryResult = {
  products: {
    data: Product[];
  };
};

const STATIC_PAGES: string[] = [
  '/',
  '/contatti',
  '/autorizzazioni',
  '/ricambi',
  '/rottamazione-veicoli',
  '/auto-usate',
  '/demolizioni',
  '/commercio-rottami',
  '/smaltimento-rifiuti',
  '/sgombero-locali',
  '/bonifiche-in-spazi-confinati',
  '/bonifica-amianto',
  '/analisi',
  '/nomina-responsabile-amianto',
];

const DYNAMIC_QUERY = gql`
  query {
    products(filters: {},pagination: { pageSize: 10000000 }) {
      data {
        attributes {
          slug
          updatedAt
        }
      }
    }
  }
`;

const generateSitemap = async (): Promise<void> => {
  try {

    const { data } = await createApolloClient().query({
      query: DYNAMIC_QUERY,
    })
    console.log(data)
    const baseUrl = 'https://www.silanosrl.it';

    const staticUrls = STATIC_PAGES.map((pagePath) => {
      return `
  <url>
    <loc>${baseUrl}${pagePath}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`;
    });

    const dynamicUrls = data.products.data.map((product) => {
      return `
  <url>
    <loc>${baseUrl}/ricambi/${product.attributes.slug}</loc>
    <lastmod>${new Date(product.attributes.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...dynamicUrls].join('\n')}
</urlset>`;

    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemapContent);

    console.log('✅ Sitemap generata con successo:', outputPath);
    console.log(`• ${staticUrls.length} pagine statiche`);
    console.log(`• ${dynamicUrls.length} prodotti dinamici`);
  } catch (error) {
    console.error('❌ Errore nella generazione della sitemap:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

// Esegui la funzione
generateSitemap();