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

// --- FUNZIONE reduceSubs (invariata) ---
const reduceSubs = (subs: Subcategory[]) => { // Aggiunto tipo per chiarezza
  const results = new Map<string, Test>(); // Tipi più specifici per Map

  for (const sub of subs) {
    // Gestione sicura degli attributi mancanti (opzionale ma consigliato)
    const categoryName = sub.attributes?.category?.data?.attributes?.name;
    const subName = sub.attributes?.name;
    const subSlug = sub.attributes?.slug;

    // Salta se mancano dati essenziali
    if (!categoryName || !subName || !subSlug) {
      console.warn("Skipping subcategory with missing data:", sub);
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
  // Ordina anche le categorie per nome
  resultsArray.sort((a, b) => a.category.localeCompare(b.category));

  return resultsArray;
};


export default function SubcategoryTable({
  subcategories,
}: SubcategoriesTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Stato per il filtro
  const [filter, setFilter] = useState('');
  // Stato per tenere traccia delle categorie aperte manualmente (usiamo un Set per efficienza)
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const handleClick = (link: string) => {
    router.push(`${pathname}/${link}`);
  };

  // Filtra le sottocategorie ORIGINALI prima di raggruppare
  const filteredSubcategories = subcategories.filter(sub =>
    sub.attributes.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Chiama reduceSubs UNA SOLA VOLTA con le sottocategorie filtrate
  const processedAndFilteredData = reduceSubs(filteredSubcategories);

  // Funzione per gestire l'apertura/chiusura manuale dei collapse
  const handleToggle = (categoryTitle: string) => {
    setOpenCategories(prevOpen => {
      const newOpen = new Set(prevOpen); // Crea una copia del Set
      if (newOpen.has(categoryTitle)) {
        newOpen.delete(categoryTitle); // Se già aperto, chiudi (rimuovi dal Set)
      } else {
        newOpen.add(categoryTitle); // Se chiuso, apri (aggiungi al Set)
      }
      return newOpen; // Aggiorna lo stato
    });
  };

  // Determina se l'utente sta attualmente filtrando
  const isFiltering = filter.length > 0;

  return (
    <div className="flex flex-col">
      {/* Input per il filtro */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtra sottocategorie..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-forest"
        />
      </div>

      {/* Rendering dei Collapse */}
      {processedAndFilteredData.length > 0 ? (
         processedAndFilteredData.map((categoryData) => {
           // Determina se questo Collapse specifico deve essere aperto
           const isManuallyOpen = openCategories.has(categoryData.category);
           // È aperto se stiamo filtrando OPPURE se è stato aperto manualmente
           const isOpen = isFiltering || isManuallyOpen;

           return (
             <Collapse
               // Usa un key stabile, il titolo della categoria se univoco va bene
               key={categoryData.category}
               title={categoryData.category}
               // Passa lo stato di apertura calcolato
               isOpen={isOpen}
               // Passa la funzione di toggle, ma solo se NON stiamo filtrando
               // Quando si filtra, il click sull'header non farà nulla (comportamento voluto)
               onToggle={isFiltering ? undefined : handleToggle}
             >
               {/* Contenuto del Collapse (invariato) */}
               <div className="flex flex-col items-start pl-4">
                 {categoryData.subs.map((sub, ind) => (
                   <button
                     key={`sub-${categoryData.category}-${ind}`}
                     onClick={() => handleClick(sub.link)}
                     className="my-2 text-left hover:text-forest transition-colors duration-150"
                   >
                     {sub.name}
                   </button>
                 ))}
               </div>
             </Collapse>
           );
         })
       ) : (
         filter && <p className="text-gray-500 px-2">Nessuna sottocategoria trovata per {filter}.</p>
       )}
    </div>
  );
}
