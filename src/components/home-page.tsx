"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronUp, Mail, Menu, Phone, Search, X } from "lucide-react";
import { categories, products, type CategoryId, type Product } from "@/data/catalog";
import PackShelf from "@/components/pack-shelf";
import TrustGallery from "@/components/trust-gallery";
import { channel, email, facebook, phone, phoneLabel, whatsapp, whatsappFor } from "@/data/site";
import { FacebookMark, WhatsAppMark, YouTubeMark } from "@/components/brand-marks";
import ChannelPlayer from "@/components/channel-player";

gsap.registerPlugin(useGSAP);

function normalizeQuery(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

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
      {word}
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
  const reduced = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<CategoryId>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const query = normalizeQuery(search);
  const shown = products.filter((product) => {
    const categoryOk = filter === "all" || product.category === filter;
    if (!query) return categoryOk;
    const haystack = normalizeQuery(`${product.name} ${product.nameBn} ${product.aliases} ${product.maker} ${product.id}`);
    return categoryOk && haystack.includes(query);
  });
  const visible = query || expanded ? shown : shown.slice(0, 9);

  useEffect(() => {
    setExpanded(false);
  }, [filter, search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  function openProduct(product: Product) {
    setSelected(product);
  }

  function closeProduct() {
    setSelected(null);
  }

  function closeMenu() {
    setMenu(false);
  }

  return (
    <div className="site" ref={root}>
      <a className="skip-link" href="#main">
        মূল অংশে যান
      </a>
      <div className="topbar">
        <div className="container">
          <span>মাছ, গরু, পোল্ট্রি—খামারের দোকান</span>
          <a href={channel} target="_blank" rel="noopener noreferrer">
            <YouTubeMark size={15} />
            চাষি ভাই ইউটিউব
          </a>
        </div>
      </div>
      <header className={scrolled ? "header is-scrolled" : "header"}>
        <div className="container nav-row">
          <a className="brand" href="#main" aria-label="চাষি ভাই হোম">
            <Image src="/images/brand/crest.webp" alt="" width={52} height={52} />
            <span>
              চাষি ভাই<small>পুকুর · দোকান · ভিডিও</small>
            </span>
          </a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menu}
            aria-controls="navigation"
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? <X className="icon" size={18} strokeWidth={1.75} aria-hidden /> : <Menu className="icon" size={18} strokeWidth={1.75} aria-hidden />}
            {menu ? "বন্ধ" : "মেনু"}
          </button>
          <nav id="navigation" className={menu ? "navigation is-open" : "navigation"} aria-label="প্রধান মেনু" onClick={closeMenu}>
            <a href="#products">পণ্য</a>
            <a href="#trust">আমার কাজ</a>
            <a href="#videos">ভিডিও</a>
            <a className="nav-contact" href="#contact">
              যোগাযোগ
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-visual">
            <Image className="hero-photo" src="/images/trust/training.webp" alt="চাষিদের প্রশিক্ষণ অনুষ্ঠান" fill priority sizes="100vw" />
          </div>
          <div className="container hero-body">
            <div className="hero-copy">
              <h1>
                <span className="line">
                  <Words text="মাছ চাষ করি" />
                </span>
                <span className="line">
                  <Words text="নিজে, দোকানেও" /> <Words text="পাশে আছি।" />
                </span>
              </h1>
              <p className="lede">
                দুইটা বড় পুকুরে প্রতিদিন চাষ, আর দোকানে মাছ ও গরুর খাবার ও ওষুধ। দাম বা মজুত জানতে WhatsApp-এ লিখুন—সরাসরি
                উত্তর পাবেন।
              </p>
              <div className="actions">
                <a className="button primary" href="#products">
                  পণ্য দেখুন
                </a>
                <a className="button secondary" href="#videos">
                  চাষের ভিডিও
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="band trust" id="trust">
          <div className="container">
            <div className="section-copy">
              <h2>চাষই পেশা, দোকানও নিজের।</h2>
              <p>
                দুটো বড় পুকুরে নিজে মাছ চাষ, দোকানে খাবার-ওষুধ-চাষের সরঞ্জাম। চাষিদের প্রশিক্ষণ ও RMTP-সহ GAP, BAP,
                HACCP-সংক্রান্ত কাজে অংশ—নিচের ছবি সব নিজের পুকুর, দোকান ও আয়োজন থেকে।
              </p>
            </div>
            <TrustGallery />
          </div>
        </section>
        <section className="band channel" id="videos">
          <div className="container">
            <div className="section-copy">
              <h2>চাষের কাজে সাহায্য—ভিডিও।</h2>
              <p>
                মাছের যত্ন, Orulina ভিটামিন, সবুজ খাদ্য, খাওয়ানোর সাধারণ ভুল, Soil Care, চিংড়ি রোগ—YouTube-এ
                যেতে হবে না, এখানেই দেখুন।
              </p>
            </div>
            <ChannelPlayer reduced={reduced} />
            <a className="text-link channel-out" href={channel} target="_blank" rel="noopener noreferrer">
              <YouTubeMark size={16} />
              পুরো চ্যানেল
              <ArrowUpRight className="icon" size={16} strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </section>
        <PackShelf reduced={reduced} onOpen={openProduct} />
        <section className="band shop" id="products">
          <div className="container">
          <div className="section-heading reveal">
            <div className="section-copy">
              <h2>খামারে কী লাগবে, নাম দেখে খুঁজুন।</h2>
              <p>পানির যত্ন, প্রোবায়োটিক, পুষ্টি ও শক্তি, ভেট—মোট ৩৩টি পণ্য। দাম ও মজুত এখানে দেখানো হয় না।</p>
            </div>
            <label className="search">
              <Search className="icon" size={18} strokeWidth={1.75} aria-hidden />
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
          <p className="product-count">
            {query || expanded || shown.length <= 9
              ? `${shown.length}টি পণ্য`
              : `${visible.length}টি দেখা যাচ্ছে, মোট ${shown.length}টি`}
          </p>
          <div className="product-grid" aria-live="polite">
            {visible.map((product) => (
              <article className="product" key={product.id}>
                <div
                  className="product-open"
                  role="button"
                  tabIndex={0}
                  aria-label={`${product.name} বিস্তারিত`}
                  onClick={() => openProduct(product)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProduct(product);
                    }
                  }}
                >
                  <span className="pack-photo">
                    <Image src={product.image} alt={`${product.name} প্যাকেট`} fill sizes="(max-width: 640px) 90vw, 30vw" />
                  </span>
                  <span className="product-meta">
                    <span>{categories.find((item) => item.id === product.category)?.label}</span>
                    <span>{product.size || "প্যাকেট দেখুন"}</span>
                  </span>
                  <span className="product-name" lang="en">
                    {product.name}
                  </span>
                  <span className="bn">{product.nameBn}</span>
                  <span className="text-link">
                    বিস্তারিত দেখুন
                    <ArrowRight className="icon" size={16} strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
              </article>
            ))}
          </div>
          {!query && shown.length > 9 && (
            <div className="catalog-more">
              <button className="button secondary" type="button" aria-expanded={expanded} onClick={() => setExpanded((open) => !open)}>
                {expanded ? "কম দেখুন" : `আরও ${shown.length - 9}টি পণ্য`}
                {expanded ? (
                  <ChevronUp className="icon" size={18} strokeWidth={1.75} aria-hidden />
                ) : (
                  <ChevronDown className="icon" size={18} strokeWidth={1.75} aria-hidden />
                )}
              </button>
            </div>
          )}
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
            দাম ও স্টক জানতে WhatsApp করুন। কতটুকু দেবেন, প্যাকেটের লেখা ও প্রস্তুতকারকের নির্দেশ মেনে নিন।{" "}
            <a href="#contact">যোগাযোগ</a>
          </p>
          </div>
        </section>
        <section className="band order" id="order">
          <div className="container">
            <div className="order-intro reveal">
              <h2>পণ্য নিতে তিন ধাপ।</h2>
            </div>
            <div className="steps reveal">
              {[
                {
                  number: "১",
                  title: "পণ্য বাছুন",
                  copy: "তালিকা থেকে নাম দেখে আপনার দরকারি পণ্য বেছে নিন।",
                },
                {
                  number: "২",
                  title: "দাম জানুন",
                  copy: "WhatsApp-এ বর্তমান দাম, মজুত ও ডেলিভারি জেনে নিন।",
                },
                {
                  number: "৩",
                  title: "অর্ডার দিন",
                  copy: "কথা মিললে অর্ডার নিশ্চিত করুন—তারপর পাঠানোর ব্যবস্থা।",
                },
              ].map(({ number, title, copy }) => (
                <article className="step" key={number}>
                  <span className="step-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="band contact on-dark" id="contact">
          <div className="container">
          <div className="contact-grid reveal">
            <div>
              <h2>যোগাযোগ—WhatsApp সবচেয়ে দ্রুত।</h2>
              <p>কোন পণ্য, কতটা, কোথায় পাঠাতে হবে—তিনটা লিখে পাঠান। ফোন, ইমেইল বা Facebook-ও চলবে।</p>
            </div>
            <MagnetLink className="button primary" href={whatsapp} external>
              <WhatsAppMark />
              WhatsApp-এ কথা বলুন
            </MagnetLink>
          </div>
          <div className="contact-details">
            <a href={`tel:${phone}`}>
              <span className="contact-icon">
                <Phone className="icon" size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <small>ফোন ও WhatsApp</small>
              <strong>{phoneLabel}</strong>
              <span className="contact-action">
                সরাসরি ফোন করুন
                <ArrowUpRight className="icon" size={14} strokeWidth={1.75} aria-hidden />
              </span>
            </a>
            <a href={`mailto:${email}`}>
              <span className="contact-icon">
                <Mail className="icon" size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <small>ইমেইল</small>
              <strong>{email}</strong>
              <span className="contact-action">
                ইমেইল লিখুন
                <ArrowUpRight className="icon" size={14} strokeWidth={1.75} aria-hidden />
              </span>
            </a>
            <a href={facebook} target="_blank" rel="noopener noreferrer">
              <span className="contact-icon">
                <FacebookMark />
              </span>
              <small>সামাজিক যোগাযোগ</small>
              <strong>Facebook-এ চাষি ভাই</strong>
              <span className="contact-action">
                পেজ দেখুন
                <ArrowUpRight className="icon" size={14} strokeWidth={1.75} aria-hidden />
              </span>
            </a>
          </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="container footer-main">
          <a className="brand" href="#main">
            <Image src="/images/brand/crest.webp" alt="" width={48} height={48} />
            <span>
              চাষি ভাই<small>পুকুর · দোকান · ভিডিও</small>
            </span>
          </a>
          <nav aria-label="ফুটার">
            <a href="#products">পণ্য</a>
            <a href="#trust">আমার কাজ</a>
            <a href="#videos">ভিডিও</a>
            <a href="#contact">যোগাযোগ</a>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span suppressHydrationWarning>© {new Date().getFullYear()} চাষি ভাই</span>
          <span>ব্যবহারবিধির জন্য প্রস্তুতকারকের নির্দেশনা অনুসরণ করুন।</span>
        </div>
      </footer>
      <MagnetLink className="button primary dock" href={whatsapp} external>
        <WhatsAppMark />
        WhatsApp
      </MagnetLink>
      {selected && (
        <div className="product-modal" role="presentation">
          <button className="product-modal-backdrop" type="button" aria-label="বিস্তারিত বন্ধ করুন" onClick={closeProduct} />
          <div className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
            <div className="dialog-content">
              <button className="dialog-close" type="button" aria-label="বিস্তারিত বন্ধ করুন" onClick={closeProduct}>
                <X className="icon" size={18} strokeWidth={1.75} aria-hidden />
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
                    <dt>সাইজ</dt>
                    <dd>{selected.size || "প্যাকেট দেখুন"}</dd>
                  </div>
                  <div>
                    <dt>ব্র্যান্ড</dt>
                    <dd>{selected.maker || "প্যাকেট দেখুন"}</dd>
                  </div>
                </dl>
                <p>দাম ও মজুত এখানে দেখানো হয় না। WhatsApp-এ জেনে নিন; পরিমাণ প্যাকেটের লেখা অনুযায়ী।</p>
                <a className="button primary" href={whatsappFor(selected.name, selected.size)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark />
                  এই পণ্য নিয়ে WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
