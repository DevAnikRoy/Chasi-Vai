"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { trustShots } from "@/data/trust";

export default function TrustGallery() {
  const [index, setIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);

  const go = useCallback((delta: number) => {
    setIndex((current) => {
      if (current === null) return null;
      return (current + delta + trustShots.length) % trustShots.length;
    });
  }, []);

  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, prev, next]);

  function open(at: number) {
    setIndex(at);
  }

  function onTouchStart(clientX: number) {
    touchStartX.current = clientX;
  }

  function onTouchEnd(clientX: number) {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const delta = clientX - start;
    if (Math.abs(delta) < 48) return;
    if (delta > 0) prev();
    else next();
  }

  const active = index === null ? null : trustShots[index];

  return (
    <>
      <div className="trust-spread">
        <button type="button" className="trust-card is-lead" aria-label={`${trustShots[0].alt} — বড় করে দেখুন`} onClick={() => open(0)}>
          <Image
            src={trustShots[0].src}
            alt={trustShots[0].alt}
            fill
            sizes="(max-width: 900px) 92vw, 50vw"
            style={{ objectPosition: trustShots[0].position }}
          />
        </button>
        <div className="trust-mosaic">
          {trustShots.slice(1).map((shot, mosaicIndex) => (
            <button
              type="button"
              className="trust-card"
              key={shot.src}
              aria-label={`${shot.alt} — বড় করে দেখুন`}
              onClick={() => open(mosaicIndex + 1)}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 45vw, 24vw"
                style={{ objectPosition: shot.position }}
              />
            </button>
          ))}
        </div>
      </div>
      {active && index !== null && (
        <div className="trust-lightbox" role="presentation">
          <button className="trust-lightbox-backdrop" type="button" aria-label="গ্যালারি বন্ধ করুন" onClick={close} />
          <div className="trust-lightbox-panel" role="dialog" aria-modal="true" aria-label="ছবির গ্যালারি">
            <button className="trust-lightbox-close" type="button" aria-label="বন্ধ করুন" onClick={close}>
              <X className="icon" size={20} strokeWidth={1.75} aria-hidden />
            </button>
            <button className="trust-lightbox-nav is-prev" type="button" aria-label="আগের ছবি" onClick={prev}>
              <ChevronLeft className="icon" size={26} strokeWidth={1.75} aria-hidden />
            </button>
            <figure
              className="trust-lightbox-figure"
              onTouchStart={(event) => onTouchStart(event.touches[0]?.clientX ?? 0)}
              onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
            >
              <div className="trust-lightbox-photo">
                <Image src={active.src} alt={active.alt} fill sizes="(max-width: 900px) 100vw, 900px" priority />
              </div>
              <figcaption>
                <span>{active.caption}</span>
                <span className="trust-lightbox-count">
                  {index + 1} / {trustShots.length}
                </span>
              </figcaption>
              <div className="trust-lightbox-mobile-nav">
                <button type="button" onClick={prev}>
                  আগের ছবি
                </button>
                <button type="button" onClick={next}>
                  পরের ছবি
                </button>
              </div>
            </figure>
            <button className="trust-lightbox-nav is-next" type="button" aria-label="পরের ছবি" onClick={next}>
              <ChevronRight className="icon" size={26} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
