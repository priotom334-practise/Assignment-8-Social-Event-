"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  { src: "/ban1.png" },
  { src: "/ban2.png" },
  { src: "/ban4.png" },
  { src: "/ban5.png" },
];

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      id="upcoming-events"
      className="relative isolate flex min-h-[500px] items-center overflow-hidden bg-[#062d24] text-white sm:min-h-[560px] lg:min-h-[600px]"
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          sizes="100vw"
          preload={index === 0}
          aria-hidden="true"
          className={`-z-20 object-cover object-center transition-opacity duration-300 motion-reduce:transition-none ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#04251e]/90 via-[#04251e]/65 to-[#04251e]/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#04251e]/50 via-transparent to-[#04251e]/20"
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-50 backdrop-blur sm:text-sm">
            <span className="size-2 rounded-full bg-lime-300" />
            Community care starts with you
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Together for a{" "}
            <span className="text-lime-300">better community.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
            Find local events, meet neighbors who care, and make a difference
            through small acts of kindness and service.
          </p>
          <Link
            href="/signup"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
          >
            Get involved
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}