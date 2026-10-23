"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories, shelf, type Product } from "@/data/catalog";

type PackShelfProps = {
  reduced: boolean;
  onOpen: (product: Product, image?: HTMLImageElement | null) => void;
};

export default function PackShelf({ reduced, onOpen }: PackShelfProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const hover = useRef(false);
  const holdUntil = useRef(0);
  const [seen, setSeen] = useState(0);

  function measure() {
    const el = scroller.current;
    const card = el?.querySelector<HTMLElement>(".shelf-card");
    if (!el || !card) return null;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 14;
    return { el, step: card.offsetWidth + gap };
  }

  function syncSeen() {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth;
    setSeen(max <= 0 ? 1 : Math.min(1, (el.scrollLeft + el.clientWidth) / max));
  }

  function move(direction: 1 | -1) {
    const box = measure();
    if (!box) return;
    const { el, step } = box;
    const max = el.scrollWidth - el.clientWidth;
    let next = el.scrollLeft + direction * step;
    if (next > max + 4) next = 0;
    if (next < -4) next = max;
    el.scrollTo({ left: next, behavior: reduced ? "auto" : "smooth" });
  }

  function hold() {
    holdUntil.current = Date.now() + 7000;
  }

  useEffect(() => {
    syncSeen();
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => syncSeen();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncSeen);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncSeen);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (!hover.current && Date.now() > holdUntil.current) move(1);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <section
      className="shelf"
      aria-roledescription="carousel"
      aria-label="নির্বাচিত প্যাক"
      onMouseEnter={() => {
        hover.current = true;
      }}
      onMouseLeave={() => {
        hover.current = false;
      }}
      onPointerDown={hold}
      onWheel={hold}
      onFocusCapture={() => {
        hover.current = true;
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hover.current = false;
      }}
    >
      <div className="container shelf-head">
        <div className="section-copy">
          <p className="eyebrow" lang="en">
            PACKS
          </p>
          <h2>নির্বাচিত প্যাক।</h2>
        </div>
        <div className="shelf-nav">
          <button type="button" aria-label="আগের প্যাক" onClick={() => move(-1)}>
            <ChevronLeft className="icon" size={20} strokeWidth={1.75} aria-hidden />
          </button>
          <button type="button" aria-label="পরের প্যাক" onClick={() => move(1)}>
            <ChevronRight className="icon" size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>
      <div className="shelf-scroller" ref={scroller}>
        {shelf.map((product) => (
          <button
            className="shelf-card"
            type="button"
            key={product.id}
            onClick={(event) => onOpen(product, event.currentTarget.querySelector("img"))}
          >
            <span className="shelf-photo">
              <Image src={product.image} alt="" fill sizes="250px" />
            </span>
            <span className="shelf-copy">
              <span>{categories.find((item) => item.id === product.category)?.label}</span>
              <strong lang="en">{product.name}</strong>
              <em>{product.nameBn}</em>
            </span>
          </button>
        ))}
      </div>
      <div className="container">
        <div className="shelf-progress" aria-hidden="true">
          <span style={{ width: `${seen * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
