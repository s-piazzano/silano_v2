"use client";

import { useEffect } from "react";

import styles from "./header.module.css";

import anime from "animejs";

import Activities from "./custom/activities";

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
  useEffect(() => {
    let translateY = -230;
    let traslateYActivities = -470;

    var tl = anime.timeline({
      easing: "easeOutExpo",
      duration: 400,
    });
    tl.add({
      targets: "#homepageSubtitle",
      translateY,
      opacity: 1,
    });
    tl.add({
      targets: "#homepageTitle",
      translateY,
      opacity: 1,
    });
    tl.add({
      targets: "#homepageSlogan",
      translateY,
      opacity: 1,
    });

    if (activities && activities.length)
      activities.map((x) =>
        tl.add({
          targets: `#card-${x.id}`,
          translateY: traslateYActivities,
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
          <p
            id="homepageSubtitle"
            className="text-xs lg:text-base font-extralight opacity-0 uppercase "
          >
            {subtitle}
          </p>
          <h1
            id="homepageTitle"
            className="text-6xl lg:text-8xl font-extralight opacity-0"
          >
            {title}
          </h1>
          <p id="homepageSlogan" className="opacity-0 font-thin">
            {slogan}
          </p>
        </div>
      </div>
      {/* <Activities className="" activities={activities} /> */}
    </div>
  );
}
