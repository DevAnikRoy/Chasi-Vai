"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const channel = "https://www.youtube.com/@chashi-vai";
const whatsapp = "https://wa.me/8801775087675";
const facebook = "https://www.facebook.com/share/17Zu7y5ok3/";
const products = [
  {
    id: "bactinil",
    name: "Bactinil Aqua",
    size: "১০০ মি.লি.",
    maker: "SQUARE",
    category: "মাছ চাষের পণ্য",
    image: "/images/bactinil.jpg",
  },
  {
    id: "protox",
    name: "Protox Aqua Liquid",
    size: "১ লিটার",
    maker: "SQUARE",
    category: "মাছ চাষের পণ্য",
    image: "/images/protox.jpg",
  },
  {
    id: "nrg",
    name: "NRG C Aqua",
    size: "৫০০ গ্রাম",
    maker: "প্যাকেটের তথ্য দেখুন",
    category: "পুষ্টি ও সাপ্লিমেন্ট",
    image: "/images/nrg.jpg",
  },
];
type Product = (typeof products)[number];
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function Fish() {
  return (
    <svg viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 24C19 3 40 4 49 24 40 44 19 45 8 24ZM49 24l12-12v24L49 24ZM23 10l6-7 9 6M23 38l6 7 9-6" />
      <circle cx="20" cy="22" r="2" />
      <path d="M34 14q-7 10 0 20" />
    </svg>
  );
}
function Leaf() {
  return (
    <svg viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 41C4 10 28 4 52 7c4 23-10 38-32 27M14 41 43 16M24 31l-1-14M32 25l13 1" />
    </svg>
  );
}
function Hen() {
  return (
    <svg viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M16 18C0 9 3 34 20 37h17c16-3 16-15 10-21l-1-7-8 1-2 9c-8-5-15-3-20-1ZM47 13l10 3-8 4M21 38v8m14-8v8M14 25q11 13 22 0M39 7c-6-10 4-8 4-3 7-8 11 2 3 5" />
      <circle cx="42" cy="14" r="1" />
    </svg>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("সব পণ্য");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = products.filter(
    (p) =>
      (filter === "সব পণ্য" || p.category === filter) &&
      `${p.name} ${p.category} ${p.id === "bactinil" ? "ব্যাকটিনিল" : p.id === "protox" ? "প্রোটক্স" : "এনার্জি"}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  function openProduct(product: Product) {
    setSelected(product);
    dialog.current?.showModal();
  }
  return (
    <>
      <a className="skip-link" href="#main">
        মূল অংশে যান
      </a>
      <div className="topbar">
        <div className="container">
          <span>মাছ ও পোল্ট্রি খামারের প্রয়োজনীয় পণ্য</span>
          <a href={channel} target="_blank" rel="noopener noreferrer">
            চাষি ভাই ইউটিউব <Arrow />
          </a>
        </div>
      </div>
      <header className="header">
        <div className="container nav-row">
          <a className="brand" href="#" aria-label="চাষি ভাই হোম">
            <Image src="/images/logo.jpg" alt="" width={54} height={54} />
            <span>
              চাষি ভাই<small>খামারের যত্নে, আপনার পাশে</small>
            </span>
          </a>
          <button
            className="menu-button"
            aria-label="মেনু"
            aria-expanded={menu}
            aria-controls="navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? "বন্ধ করুন ×" : "মেনু ☰"}
          </button>
          <nav
            id="navigation"
            className={menu ? "navigation is-open" : "navigation"}
            aria-label="প্রধান মেনু"
            onClick={() => setMenu(false)}
          >
            <a href="#products">আমাদের পণ্য</a>
            <a href="#videos">ভিডিও</a>
            <a href="#about">চাষি ভাই সম্পর্কে</a>
            <a href="#contact" className="nav-contact">
              যোগাযোগ <Arrow />
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span /> মাটি, পানি আর খামারের গল্প
              </p>
              <h1>
                খামারের যত্নে,
                <br />
                পাশে <em>চাষি ভাই।</em>
              </h1>
              <p className="hero-description">
                মাছের খাবার, পোল্ট্রি ফিড ও খামার পরিচর্যার পণ্য। আপনার প্রয়োজনের পণ্যটি খুঁজুন,
                জেনে-বুঝে সিদ্ধান্ত নিন।
              </p>
              <div className="actions">
                <a className="button primary" href="#products">
                  পণ্য দেখুন <span aria-hidden="true">→</span>
                </a>
                <a
                  className="button secondary"
                  href={channel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">▷</span> ইউটিউব দেখুন
                </a>
              </div>
              <div className="hero-note">
                <span aria-hidden="true">✓</span> সহজ বাংলায় তথ্য, সরাসরি যোগাযোগ
              </div>
            </div>
            <figure className="hero-figure">
              <Image
                src="/images/pond.png"
                alt="সবুজ পুকুরপাড়ে জাল ফেলছেন একজন মাছচাষি—প্রতীকী চিত্র"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 55vw"
              />
              <figcaption>
                <span>আমাদের শিকড়, আমাদের পরিচয়</span>
                <strong>বাংলার খামার, বাংলার মানুষ।</strong>
              </figcaption>
              <span className="photo-label">প্রতীকী চিত্র</span>
            </figure>
          </div>
        </section>
        <div className="container categories" aria-label="পণ্যের বিভাগ">
          <a className="category blue" href="#contact">
            <Fish />
            <span>
              <strong>মাছের খাবার</strong>
              <small>পণ্য জানতে যোগাযোগ করুন</small>
            </span>
            <Arrow />
          </a>
          <a
            className="category green"
            href="#products"
            onClick={() => setFilter("মাছ চাষের পণ্য")}
          >
            <Leaf />
            <span>
              <strong>মাছ চাষের পণ্য</strong>
              <small>খামার পরিচর্যার প্রয়োজন</small>
            </span>
            <Arrow />
          </a>
          <a className="category sand" href="#contact">
            <Hen />
            <span>
              <strong>পোল্ট্রির খাবার</strong>
              <small>পণ্য জানতে যোগাযোগ করুন</small>
            </span>
            <Arrow />
          </a>
        </div>
        <section className="container products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">পণ্য পরিচিতি</p>
              <h2>খামারের প্রয়োজনীয় পণ্য</h2>
              <p>পণ্যের পরিচয় ও প্যাক সাইজ এক জায়গায়।</p>
            </div>
            <label className="search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                maxLength={100}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="পণ্যের নাম লিখুন..."
                aria-label="পণ্য খুঁজুন"
              />
            </label>
          </div>
          <div className="filters" aria-label="পণ্য ফিল্টার">
            {["সব পণ্য", "মাছ চাষের পণ্য", "পুষ্টি ও সাপ্লিমেন্ট"].map((item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="product-grid" aria-live="polite">
            {shown.map((p) => (
              <article className="product" key={p.id}>
                <button
                  className="product-photo"
                  onClick={() => openProduct(p)}
                  aria-label={`${p.name} বিস্তারিত দেখুন`}
                >
                  <Image
                    src={p.image}
                    alt={p.name + " প্যাকেট"}
                    fill
                    sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw"
                  />
                  <span className="product-view" aria-hidden="true">
                    ↗
                  </span>
                </button>
                <div className="product-meta">
                  <span>{p.category}</span>
                  <span>{p.size}</span>
                </div>
                <h3 lang="en">{p.name}</h3>
                <button className="text-link" onClick={() => openProduct(p)}>
                  বিস্তারিত দেখুন <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
          {shown.length === 0 && (
            <div className="empty">
              <p>এই নামে কোনো পণ্য পাওয়া যায়নি।</p>
              <button
                className="button secondary"
                onClick={() => {
                  setSearch("");
                  setFilter("সব পণ্য");
                }}
              >
                সব পণ্য দেখুন
              </button>
            </div>
          )}
          <p className="product-footnote">
            আরও পণ্য ও বর্তমান দাম সম্পর্কে জানতে সরাসরি যোগাযোগ করুন।{" "}
            <a href="#contact">
              যোগাযোগের তথ্য <span aria-hidden="true">→</span>
            </a>
          </p>
        </section>
        <section className="video-section" id="videos">
          <div className="container video-grid">
            <a
              className="video-visual"
              href={channel}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="চাষি ভাই ইউটিউব চ্যানেল খুলুন"
            >
              <Image
                src="/images/pond.png"
                alt="সবুজ মাছের খামারের প্রতীকী চিত্র"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
              <span className="play" aria-hidden="true">
                ▶
              </span>
              <span className="video-caption">
                চাষি ভাই / YouTube <Arrow />
              </span>
            </a>
            <div>
              <p className="eyebrow">দেখুন • জানুন • বুঝুন</p>
              <h2>
                ভিডিওতে জানুন,
                <br />
                বুঝে সিদ্ধান্ত নিন।
              </h2>
              <p>
                মাছ ও চিংড়ি চাষ, দৈনিক মাছের দাম এবং আধুনিক গবাদিপশু পালন নিয়ে চাষি ভাইয়ের ভিডিও দেখুন। কোনো পণ্য সম্পর্কে জানতে চাইলে
                নামটি লিখে রাখুন, তারপর সরাসরি কথা বলুন।
              </p>
              <a
                className="button secondary"
                href={channel}
                target="_blank"
                rel="noopener noreferrer"
              >
                ইউটিউব চ্যানেলে যান <Arrow />
              </a>
            </div>
          </div>
        </section>
        <section className="container about-section" id="about">
          <div className="about-brand">
            <Image src="/images/logo.jpg" alt="চাষি ভাইয়ের লোগো" width={170} height={170} />
            <div>
              <p className="eyebrow">চেনা মানুষ, সহজ যোগাযোগ</p>
              <h2>
                আপনার খামারের
                <br />
                কথা শুনতে চাই।
              </h2>
            </div>
          </div>
          <div className="about-copy">
            <p>
              আধুনিক কৃষির তথ্য সহজ বাংলায় পৌঁছে দেওয়াই চাষি ভাইয়ের লক্ষ্য। মাছ ও চিংড়ি চাষ, গবাদিপশু পালন এবং খামার পরিচর্যা নিয়ে জানতে
              পারবেন আমাদের ইউটিউব চ্যানেলে। পাশাপাশি আপনার খামারের প্রয়োজনীয় পণ্য সম্পর্কে সরাসরি কথা বলতে পারেন।
            </p>
            <a className="text-link" href="#contact">
              চাষি ভাইয়ের সঙ্গে যোগাযোগ <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
        <section className="order-section">
          <div className="container">
            <p className="eyebrow">পরবর্তী ধাপ</p>
            <h2>পণ্য নিতে চান? শুরুটা সহজ।</h2>
            <div className="steps">
              {[
                ["১", "পণ্য বেছে নিন", "নাম ও প্যাক সাইজ দেখে আপনার প্রয়োজনের পণ্যটি খুঁজুন।"],
                [
                  "২",
                  "বিস্তারিত জেনে নিন",
                  "দাম, মজুত ও ডেলিভারির সুযোগ সম্পর্কে সরাসরি কথা বলুন।",
                ],
                ["৩", "অর্ডার নিশ্চিত করুন", "পেমেন্ট ও পণ্য গ্রহণের নিয়ম জেনে তারপর অর্ডার দিন।"],
              ].map(([n, t, d]) => (
                <div className="step" key={n}>
                  <span className="step-number">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="container contact-section" id="contact">
          <div>
            <p className="eyebrow">যোগাযোগ</p>
            <h2>প্রয়োজনের কথা জানান।</h2>
            <p>পণ্যের নাম, প্রয়োজনীয় পরিমাণ ও আপনার এলাকা জানিয়ে WhatsApp করুন। দাম ও ডেলিভারি সম্পর্কে সরাসরি কথা বলুন।</p>
          </div>
          <a
            className="button primary"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp-এ কথা বলুন <Arrow />
          </a>
        </section>
        <div className="container contact-details">
          <a href="tel:+8801775087675"><small>ফোন ও WhatsApp</small><strong>01775-087675</strong><span>সরাসরি ফোন করুন ↗</span></a>
          <a href="mailto:chashivai07@gmail.com"><small>ইমেইল</small><strong>chashivai07@gmail.com</strong><span>ইমেইল লিখুন ↗</span></a>
          <a href={facebook} target="_blank" rel="noopener noreferrer"><small>সামাজিক যোগাযোগ</small><strong>Facebook-এ চাষি ভাই</strong><span>পেজ দেখুন ↗</span></a>
        </div>
      </main>
      <footer>
        <div className="container footer-main">
          <a className="brand" href="#">
            <Image src="/images/logo.jpg" alt="" width={48} height={48} />
            <span>
              চাষি ভাই<small>খামারের যত্নে, আপনার পাশে</small>
            </span>
          </a>
          <nav aria-label="ফুটার">
            <a href="#products">পণ্য</a>
            <a href="#videos">ভিডিও</a>
            <a href="#contact">যোগাযোগ</a>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} চাষি ভাই</span>
          <span>পণ্যের ব্যবহারবিধির জন্য প্রস্তুতকারকের নির্দেশনা অনুসরণ করুন।</span>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className="product-dialog"
        aria-labelledby="product-dialog-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <div className="dialog-content">
            <button
              className="dialog-close"
              aria-label="বিস্তারিত বন্ধ করুন"
              onClick={() => dialog.current?.close()}
            >
              ×
            </button>
            <div className="dialog-image">
              <Image src={selected.image} alt={selected.name} width={500} height={550} />
            </div>
            <div>
              <p className="eyebrow">{selected.category}</p>
              <h2 id="product-dialog-title" lang="en">
                {selected.name}
              </h2>
              <dl>
                <div>
                  <dt>প্যাক সাইজ</dt>
                  <dd>{selected.size}</dd>
                </div>
                <div>
                  <dt>ব্র্যান্ডের তথ্য</dt>
                  <dd>{selected.maker}</dd>
                </div>
              </dl>
              <p>
                দাম ও মজুত সম্পর্কে জানতে যোগাযোগ করুন। ব্যবহারবিধি ও প্রয়োগের মাত্রা আসল প্যাকেট
                এবং প্রস্তুতকারকের নির্দেশনা থেকে নিশ্চিত করুন।
              </p>
              <a className="button primary" href={`${whatsapp}?text=${encodeURIComponent(`আসসালামু আলাইকুম, ${selected.name} (${selected.size}) পণ্যটির দাম, মজুত ও ডেলিভারি সম্পর্কে জানতে চাই।`)}`} target="_blank" rel="noopener noreferrer">
                এই পণ্য নিয়ে WhatsApp করুন <Arrow />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
