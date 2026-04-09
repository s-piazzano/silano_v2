// 1. Rendi il componente un Client Component
"use client";

import Link from "next/link";
// 2. Importa useState
import { useState } from "react";

interface Items {
  name: string;
  url: string;
}
interface ClassfierProps {
  divItems?: Array<string>; // Assumiamo che questi siano le lettere iniziali maiuscole A, B, C...
  items: Array<Items>;
  placeholder?: string;
}

export default function Classifier({ divItems, items, placeholder }: ClassfierProps) {
  // 3. Aggiungi lo stato per il testo del filtro
  const [filter, setFilter] = useState('');

  // 4. Filtra gli items in base allo stato del filtro (case-insensitive)
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Determina se mostrare il raggruppamento: solo se divItems esiste E non c'è un filtro attivo
  // Modifichiamo questo: mostriamo i gruppi anche se filtrati, ma solo se contengono elementi
  const showGrouping = divItems?.length; // Mostra sempre la struttura a gruppi se divItems è fornito

  return (
    <div className="flex flex-col">
      {/* 5. Aggiungi l'elemento input per il filtro */}
      <div className="my-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-forest transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder || "Cerca la tua marca (es. Fiat, Audi...)"}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all text-gray-700"
        />
      </div>

      {/* 6. Aggiorna la logica di rendering usando filteredItems */}
      <div className="space-y-6">
        {showGrouping ? (
          // Vista Raggruppata
          divItems.map((groupLetter, index) => {
            const groupItems = filteredItems.filter(
              item => item.name.toUpperCase().startsWith(groupLetter.toUpperCase())
            );

            if (groupItems.length === 0) {
              return null;
            }

            return (
              <div key={index} className="border-b border-gray-50 pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-black text-forest/20 select-none">{groupLetter}</span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {groupItems.map((item, itemIndex) => (
                    <Link
                      key={`group-${groupLetter}-${itemIndex}`}
                      href={item.url}
                      className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-forest/5 hover:border-forest/30 hover:text-forest transition-all text-sm font-medium text-gray-700 group"
                      prefetch={false}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-forest transition-colors"></div>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Vista Lista Piatta
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item, index) => (
              <Link
                key={`flat-${index}`}
                href={item.url}
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-forest/5 hover:border-forest/30 hover:text-forest transition-all text-sm font-medium text-gray-700 group"
                prefetch={false}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-forest transition-colors"></div>
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}