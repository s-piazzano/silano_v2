"use client";

import Link from "next/link";

interface Brand {
  name: string;
  url: string;
}

interface PopularBrandsProps {
  items: Brand[];
}

const POPULAR_SLUGS = [
  "fiat",
  "ford",
  "volkswagen",
  "bmw",
  "mercedes-benz",
  "audi",
  "peugeot",
  "renault",
  "alfa-romeo",
  "lancia",
  "citroen",
  "toyota",
  "opel",
  "nissan",
  "hyundai",
];

export default function PopularBrands({ items }: PopularBrandsProps) {
  // Filter popular brands based on the predefined slugs
  const popularBrands = items.filter((item) => {
    const slug = item.url.split("/").pop();
    return slug && POPULAR_SLUGS.includes(slug);
  });

  if (popularBrands.length === 0) return null;

  return (
    <div className="my-12">
      <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-wider">
        Marche Popolari
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {popularBrands.map((brand, index) => {
          const slug = brand.url.split("/").pop() || "";
          // Using a reliable GitHub dataset for car logos
          const logoUrl = `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/${slug}.png`;

          return (
            <Link
              key={index}
              href={brand.url}
              className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-forest transition-all duration-300"
            >
              <div className="w-16 h-16 mb-4 relative flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                <img
                  src={logoUrl}
                  alt={`${brand.name} logo`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback in case the logo is not found
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${brand.name}&background=f3f4f6&color=15803d&bold=true`;
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-forest transition-colors">
                {brand.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
