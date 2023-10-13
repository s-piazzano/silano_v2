"use client";

import { ReactNode, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Remark } from "react-remark";

interface CollapseProps {
  title: String;
  isRemakable?: Boolean;
  children: ReactNode;
  className?: String;
}

export default function Collapse({
  title,
  isRemakable = false,
  children,
  className,
}: CollapseProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`flex flex-col py-4 cursor-pointer ${className}`}>
      <div
        className="w-full flex justify-between items-center text-stone-600 font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="font-extralight">{title}</h2>
        {isOpen ? (
          <ChevronUpIcon className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </div>
      {isOpen && (
        <div className="w-full mt-2">
          {isRemakable ? <Remark>{children as string}</Remark> : children}
        </div>
      )}
    </div>
  );
}
