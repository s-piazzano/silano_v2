"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import Collapse from "../ui/collapse";

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

const reduceSubs = (subs) => {
  // Create a map to store the results.
  const results = new Map();

  // Iterate over the subscriptions.
  for (const sub of subs) {
    // Get the category of the subscription.
    const category = sub.attributes.category.data.attributes.name;

    // Check if the category already exists in the map.
    let existingCategory = results.get(category);

    // If the category does not exist, create a new entry.
    if (!existingCategory) {
      existingCategory = {
        category,
        subs: [],
      };
      results.set(category, existingCategory);
    }

    // Check if the subscription already exists in the category.
    const isDuplicate = existingCategory.subs.some(
      (existingSub) => existingSub.name === sub.attributes.name
    );

    // Add the subscription to the category if it's not a duplicate.
    if (!isDuplicate) {
      existingCategory.subs.push({
        name: sub.attributes.name,
        link: sub.attributes.slug,
      });
    }
  }

  // Convert the map to an array and sort the subscriptions within each category by name.
  const resultsArray = Array.from(results.values()).map((categoryData) => {
    return {
      ...categoryData,
      subs: categoryData.subs.sort((a, b) => a.name.localeCompare(b.name)),
    };
  });

  // Return the array of results.
  return resultsArray;
};

export default function SubcategoryTable({
  subcategories,
}: SubcategoriesTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [catShowed, setCatShowed] = useState(-1);

  const handleClick = (link) => {
    router.push(`${pathname}/${link}`);
  };

  return (
    <div className="flex flex-col">
      {reduceSubs(subcategories).length &&
        reduceSubs(subcategories).map((x, index) => (
          <Collapse key={index} title={x.category}>
            <div className="flex flex-col items-start">
              {x.subs.map((y, ind) => (
                <button
                  key={`sub-${x.category}-${ind}`}
                  onClick={() => handleClick(y.link)}
                  className="my-3"
                >
                  {y.name}
                </button>
              ))}
            </div>
          </Collapse>
        ))}
    </div>
  );
}
