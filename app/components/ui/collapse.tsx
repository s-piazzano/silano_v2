"use client";

import React, { ReactNode, useState, PropsWithChildren } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
// Remark non è rilevante per la logica di controllo, lo lascio invariato
import { Remark } from "react-remark";

interface CollapseProps {
  key?: React.Key;
  title: ReactNode;
  identifier?: string; // Nuova prop per lo stato esterno se title è un nodo
  isRemarkable?: boolean;
  className?: string;
  isOpen?: boolean;
  onToggle?: (id: string) => void;
}

const Collapse: React.FC<PropsWithChildren<CollapseProps>> = ({
  title,
  identifier,
  isRemarkable = false,
  children,
  className,
  isOpen: controlledOpen,
  onToggle,
}) => {
  const id = React.useId();
  const contentId = `collapse-content-${id}`;
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalIsOpen;

  const handleHeaderClick = () => {
    if (isControlled) {
      // Usa identifier se fornito, altrimenti fallback su title se è stringa
      const idToToggle = identifier ?? (typeof title === "string" ? title : "");
      onToggle?.(idToToggle);
    } else {
      setInternalIsOpen(prev => !prev);
    }
  };

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
          {isRemarkable && typeof children === "string" ? (
            // eslint-disable-next-line react/no-children-prop
            <Remark children={children as string} />
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

export default Collapse;