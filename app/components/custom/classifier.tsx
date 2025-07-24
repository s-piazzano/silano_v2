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
}

export default function Classifier({ divItems, items }: ClassfierProps) {
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
      <div className="my-4"> {/* Spazio sotto l'input */}
        <input
          type="text"
          placeholder="Filtra per nome..." // Testo segnaposto
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Aggiorna lo stato quando l'utente scrive
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-forest" // Stile base
        />
      </div>

      {/* 6. Aggiorna la logica di rendering usando filteredItems */}
      {showGrouping ? (
        // Vista Raggruppata (modificata per usare filteredItems)
        divItems.map((groupLetter, index) => {
          // Filtra ulteriormente gli items filtrati per questo gruppo specifico
          const groupItems = filteredItems.filter(
            item => item.name.toUpperCase().startsWith(groupLetter.toUpperCase())
            // Assumendo che groupLetter sia una singola lettera, potresti usare anche:
            // item => item.name.length > 0 && item.name[0].toUpperCase() === groupLetter.toUpperCase()
          );

          // Se non ci sono item in questo gruppo DOPO aver applicato il filtro, non mostrare il gruppo
          if (groupItems.length === 0) {
            return null;
          }

          // Altrimenti, mostra il gruppo e i suoi item filtrati
          return (
            <div key={index} className="mb-2">
              <span className="text-lg">{groupLetter}</span>
              <div className="w-full border-b mb-2"></div>
              <div className="w-full flex flex-wrap ">
                {groupItems.map((item, itemIndex) => { // Usa groupItems qui
                  return (
                    <Link
                      key={`group-${groupLetter}-${itemIndex}`} // Chiave unica
                      href={item.url}
                      className="m-2 p-2 border border-forest hover:bg-gray-100" // Aggiunto hover
                      prefetch={false}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        // Vista Lista Piatta (usa sempre filteredItems se non ci sono divItems)
        <div className="w-full flex flex-wrap">
          {filteredItems.map((item, index) => (
            <Link
              key={`flat-${index}`} // Chiave unica
              href={item.url}
              className="m-2 p-2 border border-forest hover:bg-gray-100" // Aggiunto hover
              prefetch={false}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}