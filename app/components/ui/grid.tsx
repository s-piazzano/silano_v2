"use client";

import React from "react";

type GridProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Grid({ children, className = "" }: GridProps) {
  return (
    <div
      className={`grid grid-cols-1 my-6 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement(child)) {
          return child;
        }
        // 🔹 Wrappa stringhe / numeri / null
        return (
          <div key={i} className="p-4 bg-gray-100 rounded-lg">
            {child}
          </div>
        );
      })}
    </div>
  );
}
