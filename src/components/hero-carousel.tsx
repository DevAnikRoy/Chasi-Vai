"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
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

  const active = slides[index];

  return (
    <div className="hero-slides" aria-hidden={slides.length <= 1}>
      {slides.map((slide, at) => {
        const style = {
          "--hero-pos": slide.position,
          "--hero-pos-sm": slide.positionSm,
        } as CSSProperties;

        return (
          <div
            className={at === index ? "hero-slide is-active" : "hero-slide"}
            data-focus={slide.focus}
            key={slide.src}
            style={style}
          >
            <div className="hero-slide-media">
              <Image
                className="hero-photo"
                src={slide.src}
                alt=""
                fill
                priority={at === 0}
                sizes="100vw"
              />
            </div>
          </div>
        );
      })}
      <div className="hero-shade" />
      <p className="hero-slide-caption sr-only" aria-live="polite">
        {active?.alt}
      </p>
    </div>
  );
}
