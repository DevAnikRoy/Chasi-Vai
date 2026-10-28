"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides, type HeroSlide } from "@/data/hero-slides";

const INTERVAL_MS = 5500;

type HeroCarouselProps = {
  reduced: boolean;
  slides?: HeroSlide[];
};

export default function HeroCarousel({ reduced, slides = heroSlides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [reduced, slides.length]);

  return (
    <div className="hero-slides" aria-hidden={slides.length <= 1}>
      {slides.map((slide, at) => (
        <div className={at === index ? "hero-slide is-active" : "hero-slide"} key={slide.src}>
          <Image
            className="hero-photo"
            src={slide.src}
            alt=""
            fill
            priority={at === 0}
            sizes="100vw"
            style={{ objectPosition: slide.position }}
          />
        </div>
      ))}
      <div className="hero-shade" />
    </div>
  );
}
