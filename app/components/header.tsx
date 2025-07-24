"use client";

import { useEffect } from "react";

import styles from "./header.module.css";

import { createTimeline } from 'animejs';

import { Activity } from "@/interfaces/common";

interface HeaderProps {
  subtitle: string;
  title: string;
  slogan: string;
  activities: Array<Activity>;
}

export default function Header({
  subtitle,
  title,
  slogan,
  activities,
}: HeaderProps) {
  const tl = createTimeline({ defaults: { ease: "out(3)", duration: 450 } });
  useEffect(() => {
    let translateY = -30;
    let traslateYActivities = -70;

    /* tl.add(
      "#homepageSubtitle",
      { y: translateY, opacity: 1, },
    ); */
    tl.add(
      "#homepageTitle",
      {
        y: translateY,
        opacity: 1
      }
    );
    tl.add(
      "#homepageSlogan",
      {
        y: translateY,
        opacity: 1,
      }
    );

    if (activities && activities.length)
      activities.map((x) =>
        tl.add(
          `#card-${x.id}`,
          {
            y: traslateYActivities,
            opacity: 1,
          })
      );
  });

  return (
    <div className={`h-full ${styles.background}`}>
      <div
        className={`w-full h-full flex flex-col justify-center  items-center  text-stone-600 landscape:mt-32 lg:landscape:mt-0`}
      >
        <div className="text-center">
         {/*  <p
            id="homepageSubtitle"
            className="text-xs lg:text-base font-extralight opacity-0 uppercase "
          >
            {subtitle}
          </p> */}
          <h1
            id="homepageTitle"
            className="text-6xl lg:text-8xl font-extralight opacity-0"
          >
            {title}
          </h1>
          <h2 id="homepageSlogan" className="opacity-0 text-2xl lg:text-3xl font-light mt-4 italic">
            {slogan}
          </h2>
        </div>
      </div>
      {/* <Activities className="" activities={activities} /> */}
    </div>
  );
}
