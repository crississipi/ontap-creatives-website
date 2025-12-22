"use client";

import React, { useEffect } from "react";
import Image from "next/image";

const coreValues = [
  {
    icon: "/icons/about/integrity.png",
    label: "Integrity",
    text: "Doing the right thing, even when no one is watching, because our character is our most valuable asset.",
  },
  {
    icon: "/icons/about/quality.png",
    label: "Quality Products",
    text: "We build excellence into every detail, creating products that don't just meet standards but define them.",
  },
  {
    icon: "/icons/about/creative.png",
    label: "Creative Team Members",
    text: "We are a collective of visionary problem-solvers, turning bold ideas into tangible reality.",
  },
  {
    icon: "/icons/about/satisfied.png",
    label: "Customer Satisfaction",
    text: "We measure our success not by sales, but by the success and loyalty of every customer we serve.",
  },
  {
    icon: "/icons/about/innovative.png",
    label: "Innovative Solutions",
    text: "We relentlessly challenge the status quo to pioneer the smarter, more effective ways of tomorrow.",
  },
  {
    icon: "/icons/about/simplistic.png",
    label: "Simplistic Interface",
    text: "We believe true sophistication lies in creating powerful technology that feels intuitive and effortless to use.",
  },
];

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // jump to top on mount
  }, []);

  return (
    <section className="h-screen md:h-auto w-full flex flex-col items-center gap-5 text-dark-blue py-16 z-50 bg-white">
      <div className="md:min-h-screen min-h-1/3 w-full flex items-center justify-center relative">
        <h1 className="z-20 md:text-8xl lg:text-9xl text-5xl tracking-wider text-white font-bold">
          ABOUT US!
        </h1>
        <Image
          height={4096}
          width={4096}
          alt="affiliate page background"
          src="/images/about-us-bg.png"
          className="h-full w-full object-cover object-center absolute left-0"
          draggable={false}
        />
      </div>
      <div className="w-6/7 flex flex-col lg:flex-row items-center justify-around gap-5 mt-0 lg:mt-20">
        <span className="w-full lg:w-2/5 flex flex-col gap-3">
          <h2 className="col-span-full text-center text-3xl font-extrabold lg:font-normal lg:text-6xl uppercase flex justify-center">
            <span>mis</span>
            <span className="text-black">sion</span>
          </h2>
          <h3 className="lg:text-xl border p-3 border-light-blue">
            To harness the modern technological landscape to build more
            efficient communities and elevate every user's journey. This
            dedicated focus on seamless interaction and connection is what
            ultimately drives sustainable business excellence for our partners.
          </h3>
        </span>
        <span className="w-full lg:w-2/5 flex flex-col gap-3">
          <h2 className="col-span-full text-center text-3xl font-extrabold lg:font-normal lg:text-6xl uppercase flex justify-center">
            <span>val</span>
            <span className="text-black">ues</span>
          </h2>
          <h3 className="lg:text-xl border p-3 border-light-blue">
            To deliver dynamic innovations through user-friendly technology that
            integrates seamlessly into daily life. With a single tap, we
            guarantee precision and reliability, transforming user satisfaction
            into an enhanced and trusted brand reputation.
          </h3>
        </span>
      </div>
      <div className="w-6/7 lg:w-3/4 h-max grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:mt-10 gap-5">
        <h2 className="col-span-full text-center text-3xl font-extrabold lg:font-normal lg:text-6xl uppercase flex justify-center gap-2">
          <span>Core</span>
          <span className="text-black">values</span>
        </h2>
        {coreValues.map((val, i) => (
          <div
            key={`core-values-${i}`}
            className="flex p-3 px-5 items-center gap-3 border border-light-blue"
          >
            <span className="h-16 aspect-square rounded-full bg-dark-blue p-3 flex items-center justify-center">
              <Image
                alt="core value icon"
                src={val.icon}
                height={2048}
                width={2048}
                className="h-full w-full object-center object-contain"
              />
            </span>
            <span className="h-full w-full flex flex-col">
              <strong className="uppercase text-xl font-extrabold">
                {val.label}
              </strong>
              <h3>{val.text}</h3>
            </span>
          </div>
        ))}
      </div>

      <div className="h-32 md:h-72 w-full flex items-center justify-center my-10">
        <Image
          height={1024}
          width={1024}
          alt="affiliate page background"
          src="/images/ontap-logo.png"
          className="h-16 md:h-24 w-full object-contain object-center"
          draggable={false}
        />
      </div>
    </section>
  );
};

export default AboutUs;
