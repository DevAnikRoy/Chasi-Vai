"use client";

import Image from "next/image";
import { categories, shelf, type Product } from "@/data/catalog";

type PackShelfProps = {
  reduced: boolean;
  onOpen: (product: Product) => void;
};

export default function PackShelf({ reduced, onOpen }: PackShelfProps) {
  return (
    <section className="shelf" aria-roledescription="carousel" aria-label="দোকানের কিছু পণ্য">
      <div className="container">
        <div className="shelf-head">
          <div className="section-copy">
            <h2>দোকানে যা পাবেন।</h2>
            <p>পানির যত্ন, প্রোবায়োটিক, পুষ্টি, ভেট—প্যাক দেখে নাম মিলিয়ে নিন।</p>
          </div>
        </div>
        <div className="shelf-window">
          <div className={reduced ? "shelf-track is-still" : "shelf-track"}>
            {(reduced ? [shelf] : [shelf, shelf]).map((group, loop) => (
              <div className="shelf-group" key={loop} aria-hidden={loop > 0}>
                {group.map((product) => (
                  <button
                    className="shelf-card"
                    type="button"
                    key={`${product.id}-${loop}`}
                    tabIndex={loop > 0 ? -1 : undefined}
                    onClick={() => onOpen(product)}
                  >
                    <span className="shelf-photo">
                      <Image src={product.image} alt="" fill sizes="220px" />
                    </span>
                    <span className="shelf-copy">
                      <span>{categories.find((item) => item.id === product.category)?.label}</span>
                      <strong lang="en">{product.name}</strong>
                      <em>{product.nameBn}</em>
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
