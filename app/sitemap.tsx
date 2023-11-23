import { MetadataRoute } from "next";

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

const query = gql`
  query {
    pages {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;

async function graph() {
  // Fetch data
  const { data } = await getClient().query({
    query,
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://silanosr.it",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://silanosrl.it/contatti",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://acme.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
