"use client";

import React from "react";

type GridProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Grid({ children, className = "" }: GridProps) {
  const childArray = React.Children.toArray(children);
  const count = childArray.length;

  // Imposta le colonne in base al numero di figli
  let gridCols = "grid-cols-1";
  if (count === 2) {
    gridCols = "sm:grid-cols-2";
  } else if (count === 3) {
    gridCols = "sm:grid-cols-2 lg:grid-cols-3";
  } else if (count > 3) {
    gridCols = "sm:grid-cols-2 lg:grid-cols-4";
  }

  return (
    <div className={`grid my-6 gap-6 ${gridCols} ${className}`}>
      {childArray.map((child, i) =>
        React.isValidElement(child) ? (
          child
        ) : (
          <div key={i} className="p-4 bg-gray-100 rounded-lg">
            {child}
          </div>
        )
      )}
    </div>
  );
}
