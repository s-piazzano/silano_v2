"use client";

// Import useState se non già presente per altre ragioni
import { useState } from "react";
// Link non sembra usato, puoi rimuoverlo se usi solo button
// import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import Collapse from "../ui/collapse";

// --- INTERFACCE (invariate) ---
interface Subcategory {
  id: string;
  attributes: {
    name: string;
    slug: string;
    category: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
  };
}

import { 
  WrenchScrewdriverIcon, 
  LightBulbIcon, 
  RectangleGroupIcon, 
  CircleStackIcon, 
  BoltIcon, 
  BoltSlashIcon,
  SparklesIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BeakerIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";

// --- INTERFACCE (invariate) ---
// ... (same as before)

const CATEGORY_ICONS: Record<string, any> = {
  "Motore": WrenchScrewdriverIcon,
  "Illuminazione": LightBulbIcon,
  "Carrozzeria": RectangleGroupIcon,
  "Frenante": CircleStackIcon,
  "Elettronica": BoltIcon,
  "Impianto elettrico": BoltSlashIcon,
  "Sospensioni": SparklesIcon,
  "Interni": UserGroupIcon,
  "Trasmissione": Cog6ToothIcon,
  "Accessori": BeakerIcon,
};

interface SubcategoriesTableProps {
  subcategories: Array<Subcategory>;
}

interface Subs {
  name: string;
  link: string;
}
interface Test {
  category: string;
  subs: Array<Subs>;
}

const reduceSubs = (subs: Subcategory[]) => {
  const results = new Map<string, Test>();

  for (const sub of subs) {
    const categoryName = sub.attributes?.category?.data?.attributes?.name;
    const subName = sub.attributes?.name;
    const subSlug = sub.attributes?.slug;

    if (!categoryName || !subName || !subSlug) {
      continue;
    }

    let existingCategory = results.get(categoryName);

    if (!existingCategory) {
      existingCategory = {
        category: categoryName,
        subs: [],
      };
      results.set(categoryName, existingCategory);
    }

    const isDuplicate = existingCategory.subs.some(
      (existingSub) => existingSub.name === subName
    );

    if (!isDuplicate) {
      existingCategory.subs.push({
        name: subName,
        link: subSlug,
      });
    }
  }

  const resultsArray = Array.from(results.values()).map((categoryData) => {
    return {
      ...categoryData,
      subs: categoryData.subs.sort((a, b) => a.name.localeCompare(b.name)),
    };
  });
  resultsArray.sort((a, b) => a.category.localeCompare(b.category));
  return resultsArray;
};

export default function SubcategoryTable({
  subcategories,
}: SubcategoriesTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [filter, setFilter] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const handleClick = (link: string) => {
    router.push(`${pathname}/${link}`);
  };

  const filteredSubcategories = subcategories.filter(sub =>
    sub.attributes?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const processedAndFilteredData = reduceSubs(filteredSubcategories);

  const handleToggle = (categoryTitle: string) => {
    setOpenCategories(prevOpen => {
      const newOpen = new Set(prevOpen);
      if (newOpen.has(categoryTitle)) {
        newOpen.delete(categoryTitle);
      } else {
        newOpen.add(categoryTitle);
      }
      return newOpen;
    });
  };

  const isFiltering = filter.length > 0;

  return (
    <div className="flex flex-col">
      <div className="mb-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-forest transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Cerca un pezzo o una categoria (es. Specchietto, Fanale...)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="space-y-3">
        {processedAndFilteredData.length > 0 ? (
           processedAndFilteredData.map((categoryData) => {
             const isManuallyOpen = openCategories.has(categoryData.category);
             const isOpen = isFiltering || isManuallyOpen;
             const CategoryIcon = CATEGORY_ICONS[categoryData.category] || ArchiveBoxIcon;
             const count = categoryData.subs.length;

             return (
               <div key={categoryData.category} className="overflow-hidden">
                 <Collapse
                   identifier={categoryData.category}
                   title={
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className={`font-semibold text-sm md:text-base transition-colors ${isOpen ? 'text-forest' : 'text-gray-700'}`}>
                        {categoryData.category}
                      </span>
                      <span className="flex-shrink-0 ml-4 bg-gray-100 text-gray-500 text-[10px] md:text-xs px-2 py-1 rounded-full border border-gray-200 font-medium whitespace-nowrap">
                        {count} {count === 1 ? 'pezzo' : 'pezzi'}
                      </span>
                    </div>
                   }
                   isOpen={isOpen}
                   onToggle={isFiltering ? undefined : handleToggle}
                 >
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 py-4 px-2 border-t border-gray-50 mt-1">
                     {categoryData.subs.map((sub, ind) => (
                       <button
                         key={`sub-${categoryData.category}-${ind}`}
                         onClick={() => handleClick(sub.link)}
                         className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-forest/5 hover:text-forest transition-all text-sm text-gray-600 group text-left cursor-pointer"
                       >
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-forest transition-colors"></div>
                         {sub.name}
                       </button>
                     ))}
                   </div>
                 </Collapse>
               </div>
             );
           })
         ) : (
           filter && <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 max-w-sm mx-auto">
                Al momento non abbiamo categorie disponibili per questo modello. Prova a cercare un&apos;altra marca o contattaci.
              </p>
              <p className="text-gray-500">Nessun ricambio trovato per &quot;<span className="font-semibold">{filter}</span>&quot;.</p>
           </div>
         )}
      </div>
    </div>
  );
}
