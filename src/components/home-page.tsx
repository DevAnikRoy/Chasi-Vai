"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { categories, featured, products, type CategoryId, type Product } from "@/data/catalog";
import { channel, email, facebook, phone, phoneLabel, whatsapp, whatsappFor } from "@/data/site";

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

const phrases = ["মাছের পানি", "চিংড়ির ঘের", "পোল্ট্রির শক্তি"];
const railItems = ["পানির যত্ন", "প্রোবায়োটিক", "অক্সিজেন", "ভিটামিন", "পুকুরের মাটি", "ভেট", "চাষি ভাই"];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function Words({ text }: { text: string }) {
  return text.split(" ").map((word, index) => (
    <span className="word" key={`${word}-${index}`}>
      {word}{" "}
    </span>
  ));
}

function MagnetLink({
  href,
  className,
  children,
  external,
}: {
  href: string;
  className: string;
  children: ReactNode;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) < 140) {
        xTo(dx * 0.28);
        yTo(dy * 0.28);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  });
  return (
    <a
      ref={ref}
      className={className}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const flipFrom = useRef<HTMLImageElement | null>(null);
  const reduced = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<CategoryId>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [featureIndex, setFeatureIndex] = useState(0);
  const feature = featured[featureIndex] ?? featured[0];

  const shown = products.filter((product) => {
    const categoryOk = filter === "all" || product.category === filter;
    const haystack = `${product.name} ${product.nameBn} ${product.aliases} ${product.maker}`.toLowerCase();
    return categoryOk && haystack.includes(search.toLowerCase().trim());
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      setFeatureIndex((index) => (index + 1) % featured.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return;
      const intro = gsap.timeline();
      intro
        .from(".intro-crest", { scale: 0.86, autoAlpha: 0, duration: 0.55, ease: "power3.out" })
        .from(".intro-line", { scaleX: 0, duration: 0.35 }, "-=0.15")
        .to(".intro", { autoAlpha: 0, duration: 0.4, delay: 0.2 })
        .set(".intro", { display: "none" });

      gsap.from(".hero .word", {
        yPercent: 110,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.85,
      });

      const spin = gsap.utils.toArray<HTMLElement>(".spin-word");
      gsap.set(spin, { autoAlpha: 0, y: 14 });
      if (spin[0]) gsap.set(spin[0], { autoAlpha: 1, y: 0 });
      const cycle = gsap.timeline({ repeat: -1, delay: 1.2 });
      spin.forEach((word, index) => {
        cycle
          .to(word, { autoAlpha: 1, y: 0, duration: 0.4 }, index * 2.6)
          .to(word, { autoAlpha: 0, y: -14, duration: 0.35 }, index * 2.6 + 2);
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((section) => {
        gsap.from(section, {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 84%" },
        });
      });

      const track = document.querySelector(".rail-track");
      if (track) {
        const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const speed = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 3.5);
            gsap.to(loop, { timeScale: speed, duration: 0.25, overwrite: "auto" });
          },
        });
      }
    },
    { scope: root, dependencies: [reduced] },
  );

  useLayoutEffect(() => {
    const node = dialog.current;
    if (!selected || !node) return;
    if (!node.open) node.showModal();
    const target = node.querySelector("img");
    const source = flipFrom.current;
    if (target && source && !reduced) {
      const state = Flip.getState(source);
      Flip.from(state, {
        targets: target,
        duration: 0.65,
        scale: true,
        absolute: true,
        ease: "power3.inOut",
      });
    }
    flipFrom.current = null;
  }, [selected, reduced]);

  function openProduct(product: Product, image?: HTMLImageElement | null) {
    flipFrom.current = image ?? null;
    setSelected(product);
  }

  function closeMenu() {
    setMenu(false);
  }

  return (
    <div className="site" ref={root}>
      <a className="skip-link" href="#main">
        মূল অংশে যান
      </a>
      <div className="intro" aria-hidden={reduced}>
        <button className="intro-skip" type="button" onClick={() => gsap.set(".intro", { autoAlpha: 0, display: "none" })}>
          এড়িয়ে যান
        </button>
        <div className="intro-card">
          <Image className="intro-crest" src="/images/brand/crest.webp" alt="" width={148} height={148} priority />
          <span className="intro-line" />
          <strong>চাষি ভাই</strong>
        </div>
      </div>
      <div className="topbar">
        <div className="container">
          <span>মাছ ও পোল্ট্রি খামারের প্রয়োজনীয় পণ্য</span>
          <a href={channel} target="_blank" rel="noopener noreferrer">
            চাষি ভাই ইউটিউব ↗
          </a>
        </div>
      </div>
      <header className={scrolled ? "header is-scrolled" : "header"}>
        <div className="container nav-row">
          <a className="brand" href="#main" aria-label="চাষি ভাই হোম">
            <Image src="/images/brand/crest.webp" alt="" width={52} height={52} />
            <span>
              চাষি ভাই<small>খামারের যত্নে, আপনার পাশে</small>
            </span>
          </a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menu}
            aria-controls="navigation"
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? "বন্ধ" : "মেনু"}
          </button>
          <nav id="navigation" className={menu ? "navigation is-open" : "navigation"} aria-label="প্রধান মেনু" onClick={closeMenu}>
            <a href="#products">পণ্য</a>
            <a href="#videos">ভিডিও</a>
            <a href="#about">পরিচয়</a>
            <a className="nav-contact" href="#contact">
              যোগাযোগ ↗
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">CHASHI VAI</p>
              <h1>
                <span className="line">
                  <Words text="খামারের যত্নে," />
                </span>
                <span className="line">
                  <Words text="পাশে" /> <em>চাষি ভাই।</em>
                </span>
              </h1>
              <p className="lede">
                মাছের পানি, চিংড়ির ঘের আর পোল্ট্রির শক্তি। পণ্য দেখুন, নাম মিলিয়ে নিন, তারপর সরাসরি কথা বলুন।
              </p>
              <div className="spin" aria-hidden="true">
                {phrases.map((phrase) => (
                  <span className="spin-word" key={phrase}>
                    {phrase}
                  </span>
                ))}
              </div>
              <div className="actions">
                <MagnetLink className="button primary" href="#products">
                  পণ্য দেখুন →
                </MagnetLink>
                <a className="button secondary" href={channel} target="_blank" rel="noopener noreferrer">
                  ▷ ইউটিউব
                </a>
              </div>
            </div>
            {feature && (
              <div>
                <button
                  className="hero-stage"
                  type="button"
                  onClick={(event) => openProduct(feature, event.currentTarget.querySelector("img"))}
                  aria-label={`${feature.name} বিস্তারিত দেখুন`}
                >
                  <Image key={feature.id} src={feature.image} alt={feature.name} fill priority sizes="(max-width: 900px) 90vw, 42vw" />
                  <span className="stage-meta">
                    <span>
                      <span>{feature.nameBn}</span>
                      <strong lang="en">{feature.name}</strong>
                    </span>
                    <span>{feature.size || "প্যাক দেখুন"}</span>
                  </span>
                </button>
                <div className="stage-dots" role="tablist" aria-label="নির্বাচিত পণ্য">
                  {featured.map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      aria-label={product.name}
                      aria-current={index === featureIndex}
                      onClick={() => setFeatureIndex(index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        <div className="rail" aria-hidden="true">
          <div className="rail-track">
            {[...railItems, ...railItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
        <section className="band container" id="products">
          <div className="section-heading reveal">
            <div className="section-copy">
              <p className="eyebrow">CATALOG</p>
              <h2>খামারের পণ্য, এক স্টেজে।</h2>
            </div>
            <label className="search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                maxLength={100}
                value={search}
                placeholder="পণ্যের নাম লিখুন"
                aria-label="পণ্য খুঁজুন"
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>
          <div className="filters" role="toolbar" aria-label="পণ্যের বিভাগ">
            {categories.map((item) => (
              <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="product-count">{shown.length}টি পণ্য</p>
          <div className="product-grid" aria-live="polite">
            {shown.map((product) => (
              <article className="product" key={product.id}>
                <button
                  className="pack-photo"
                  type="button"
                  onClick={(event) => openProduct(product, event.currentTarget.querySelector("img"))}
                  aria-label={`${product.name} বিস্তারিত দেখুন`}
                >
                  <Image src={product.image} alt={`${product.name} প্যাকেট`} fill sizes="(max-width: 640px) 90vw, 30vw" />
                </button>
                <div className="product-meta">
                  <span>{categories.find((item) => item.id === product.category)?.label}</span>
                  <span>{product.size || "প্যাক দেখুন"}</span>
                </div>
                <h3 lang="en">{product.name}</h3>
                <p className="bn">{product.nameBn}</p>
                <button className="text-link" type="button" onClick={() => openProduct(product)}>
                  বিস্তারিত দেখুন →
                </button>
              </article>
            ))}
          </div>
          {shown.length === 0 && (
            <div className="empty">
              <p>এই নামে কোনো পণ্য পাওয়া যায়নি।</p>
              <button
                className="button secondary"
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                সব পণ্য দেখুন
              </button>
            </div>
          )}
          <p className="footnote">
            দাম, মজুত ও ডেলিভারি সরাসরি জানুন। ব্যবহারবিধি আসল প্যাকেট থেকে নিন।{" "}
            <a href="#contact">যোগাযোগ →</a>
          </p>
        </section>
        <section className="band channel" id="videos">
          <div className="container channel-grid reveal">
            <a className="film" href={channel} target="_blank" rel="noopener noreferrer" aria-label="চাষি ভাই ইউটিউব চ্যানেল খুলুন">
              <Image src="/images/pond.webp" alt="পুকুরপাড়ে জাল ফেলছেন একজন মাছচাষি" fill sizes="(max-width: 900px) 100vw, 50vw" />
              <span className="play" aria-hidden="true">
                ▶
              </span>
              <span className="film-caption">চাষি ভাই / YouTube ↗</span>
            </a>
            <div className="section-copy">
              <p className="eyebrow">WATCH</p>
              <h2>ভিডিওতে দেখুন, বুঝে সিদ্ধান্ত নিন।</h2>
              <p>মাছ ও চিংড়ি চাষ, দৈনিক মাছের দাম এবং গবাদিপশু পালন নিয়ে চাষি ভাইয়ের চ্যানেল খুলুন।</p>
              <a className="button secondary" href={channel} target="_blank" rel="noopener noreferrer">
                ইউটিউব চ্যানেলে যান ↗
              </a>
            </div>
          </div>
        </section>
        <section className="band container about" id="about">
          <div className="about-grid reveal">
            <div className="about-brand">
              <Image src="/images/brand/crest.webp" alt="চাষি ভাইয়ের লোগো" width={112} height={112} />
              <div>
                <p className="eyebrow">ABOUT</p>
                <h2>চেনা মানুষ, সহজ যোগাযোগ।</h2>
              </div>
            </div>
            <div>
              <p>
                আধুনিক কৃষির তথ্য সহজ বাংলায় পৌঁছে দেওয়াই চাষি ভাইয়ের লক্ষ্য। মাছ ও চিংড়ি চাষ, গবাদিপশু পালন এবং খামার পরিচর্যা নিয়ে জানতে
                পারবেন ইউটিউব চ্যানেলে। পণ্য নিতে চাইলে সরাসরি কথা বলুন।
              </p>
              <a className="text-link" href="#contact">
                যোগাযোগ করুন →
              </a>
            </div>
          </div>
        </section>
        <section className="band container order">
          <div className="reveal">
            <p className="eyebrow">PATH</p>
            <h2>পণ্য নিতে চাইলে, তিন ধাপ।</h2>
            <div className="steps">
              {[
                ["০১", "পণ্য বেছে নিন", "নাম ও প্যাক সাইজ দেখে আপনার প্রয়োজনের পণ্যটি খুঁজুন।"],
                ["০২", "বিস্তারিত জানুন", "দাম, মজুত ও ডেলিভারি নিয়ে সরাসরি কথা বলুন।"],
                ["০৩", "অর্ডার নিশ্চিত করুন", "পেমেন্ট ও গ্রহণের নিয়ম জেনে তারপর অর্ডার দিন।"],
              ].map(([number, title, copy]) => (
                <article className="step" key={number}>
                  <span className="step-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="band container contact" id="contact">
          <div className="contact-grid reveal">
            <div>
              <p className="eyebrow">CONTACT</p>
              <h2>প্রয়োজনের কথা জানান।</h2>
              <p>পণ্যের নাম, পরিমাণ আর এলাকা লিখে WhatsApp করুন।</p>
            </div>
            <MagnetLink className="button primary" href={whatsapp} external>
              WhatsApp-এ কথা বলুন ↗
            </MagnetLink>
          </div>
          <div className="contact-details">
            <a href={`tel:${phone}`}>
              <small>ফোন ও WhatsApp</small>
              <strong>{phoneLabel}</strong>
              <span>সরাসরি ফোন করুন ↗</span>
            </a>
            <a href={`mailto:${email}`}>
              <small>ইমেইল</small>
              <strong>{email}</strong>
              <span>ইমেইল লিখুন ↗</span>
            </a>
            <a href={facebook} target="_blank" rel="noopener noreferrer">
              <small>সামাজিক যোগাযোগ</small>
              <strong>Facebook-এ চাষি ভাই</strong>
              <span>পেজ দেখুন ↗</span>
            </a>
          </div>
        </section>
      </main>
      <footer>
        <div className="container footer-main">
          <a className="brand" href="#main">
            <Image src="/images/brand/crest.webp" alt="" width={48} height={48} />
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
          <span>ব্যবহারবিধির জন্য প্রস্তুতকারকের নির্দেশনা অনুসরণ করুন।</span>
        </div>
      </footer>
      <MagnetLink className="button primary dock" href={whatsapp} external>
        WhatsApp
      </MagnetLink>
      <dialog
        ref={dialog}
        className="product-dialog"
        aria-labelledby="product-dialog-title"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <div className="dialog-content">
            <button className="dialog-close" type="button" aria-label="বিস্তারিত বন্ধ করুন" onClick={() => dialog.current?.close()}>
              ×
            </button>
            <div className="dialog-photo">
              <Image src={selected.image} alt={selected.name} fill sizes="(max-width: 900px) 90vw, 420px" />
            </div>
            <div className="dialog-copy">
              <p className="eyebrow">{categories.find((item) => item.id === selected.category)?.label}</p>
              <h2 id="product-dialog-title" lang="en">
                {selected.name}
              </h2>
              <p>{selected.nameBn}</p>
              <dl>
                <div>
                  <dt>প্যাক সাইজ</dt>
                  <dd>{selected.size || "প্যাকেট দেখুন"}</dd>
                </div>
                <div>
                  <dt>ব্র্যান্ড</dt>
                  <dd>{selected.maker || "প্যাকেট দেখুন"}</dd>
                </div>
              </dl>
              <p>দাম ও মজুত জানতে যোগাযোগ করুন। প্রয়োগের মাত্রা আসল প্যাকেটের নির্দেশনা থেকে নিন।</p>
              <a className="button primary" href={whatsappFor(selected.name, selected.size)} target="_blank" rel="noopener noreferrer">
                এই পণ্য নিয়ে WhatsApp ↗
              </a>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
