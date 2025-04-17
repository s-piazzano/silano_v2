"use client";

import { ReactNode, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
// Remark non è rilevante per la logica di controllo, lo lascio invariato
import { Remark } from "react-remark";

interface CollapseProps {
  // Tipi Primitivi: usare string, boolean (lowercase)
  title: string;
  isRemakable?: boolean;
  children: ReactNode;
  className?: string;
  // Props Aggiunte per il controllo esterno:
  isOpen?: boolean; // Stato di apertura controllato dal genitore (opzionale)
  onToggle?: (title: string) => void; // Callback chiamata al click sull'header (opzionale)
}

export default function Collapse({
  title,
  isRemakable = false,
  children,
  className,
  // Rinominiamo la prop per evitare conflitti con la variabile interna 'isOpen'
  isOpen: controlledOpen,
  onToggle,
}: CollapseProps) {
  // Stato interno: usato SOLO se il componente NON è controllato (controlledOpen === undefined)
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Determina se il componente è controllato dall'esterno
  const isControlled = controlledOpen !== undefined;

  // Determina lo stato di apertura effettivo da usare per il rendering
  // Se è controllato, usa il valore passato via prop, altrimenti usa lo stato interno
  const isOpen = isControlled ? controlledOpen : internalIsOpen;

  // Gestore del click sull'header
  const handleHeaderClick = () => {
    if (isControlled) {
      // Se controllato, chiama la funzione onToggle passata dal genitore
      // passando il titolo per permettere al genitore di identificarlo
      onToggle?.(title);
    } else {
      // Se non controllato, aggiorna semplicemente lo stato interno
      setInternalIsOpen(prev => !prev);
    }
  };

  // Genera un ID univoco per l'area del contenuto per l'accessibilità (aria-controls)
  // Sostituisce spazi nel titolo per creare un ID valido
  const contentId = `collapse-content-${title.replace(/\s+/g, '-')}`;

  return (
    // Aggiunto nullish coalescing per className se non fornito
    <div className={`flex flex-col py-4 ${className ?? ''}`}>
      <div
        className="w-full flex justify-between items-center text-stone-600 font-normal cursor-pointer" // Spostato cursor-pointer qui
        onClick={handleHeaderClick} // Usa il nuovo gestore
        // Attributi per accessibilità
        role="button" // Indica che è cliccabile
        aria-expanded={isOpen} // Indica se l'area è espansa
        aria-controls={contentId} // Collega il bottone all'area del contenuto
      >
        <h2 className="font-extralight">{title}</h2>
        {/* Usa lo stato di apertura effettivo per decidere l'icona */}
        {isOpen ? (
          <ChevronUpIcon className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </div>
      {/* Usa lo stato di apertura effettivo per decidere se mostrare i children */}
      {isOpen && (
        <div
          className="w-full mt-2"
          id={contentId} // ID corrispondente ad aria-controls
          role="region" // Indica che è una regione di contenuto
        >
          {isRemakable ? <Remark>{children as string}</Remark> : children}
        </div>
      )}
    </div>
  );
}