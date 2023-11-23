import { useRef, useEffect } from "react";

import Card from "../ui/card";

import { Image } from "@/interfaces/common";

import { LinkInt, Activity } from "@/interfaces/common";

interface ActivitiesProps {
  className?: string;
  activities: Array<Activity>;
}

export default function Activities({ className, activities }: ActivitiesProps) {
  return (
    <div
      className={`w-full landscape:h-screen md:landscape:h-1/3 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 justify-center items-stretch px-4 md:px-16  ${className} landscape:mt-32 lg:landscape:mt-0`}
    >
      {activities.map((activity) => (
        <Card
          className="opacity-0 flex-1"
          containerClass="px-2 lg:px-2"
          linkClass="px-2 lg:px-6"
          id={`card-${activity.id}`}
          key={activity.id}
          title={activity.title}
          description={activity.description}
          link={activity.link}
          imageUrl={activity.image?.data?.attributes?.formats?.medium.url}
        ></Card>
      ))}
    </div>
  );
}
