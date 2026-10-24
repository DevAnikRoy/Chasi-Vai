"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Mail, Menu, MessageCircle, Package, Phone, Search, X } from "lucide-react";
import { categories, products, type CategoryId, type Product } from "@/data/catalog";
import PackShelf from "@/components/pack-shelf";
import { channel, email, facebook, phone, phoneLabel, whatsapp, whatsappFor } from "@/data/site";
import { FacebookMark, WhatsAppMark, YouTubeMark } from "@/components/brand-marks";
import ChannelPlayer from "@/components/channel-player";

gsap.registerPlugin(Flip, useGSAP);

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
  const dialog = useRef<HTMLDialogElement>(null);
  const flipFrom = useRef<HTMLImageElement | null>(null);
  const reduced = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<CategoryId>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

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
        <button
          className="intro-skip"
          type="button"
          onClick={(event) => event.currentTarget.closest(".intro")?.classList.add("is-skipped")}
        >
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
          <span>মাছ, চিংড়ি ও পোল্ট্রি খামারের পণ্য</span>
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
              চাষি ভাই<small>মাছ, চিংড়ি ও পোল্ট্রির পণ্য</small>
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
            <a href="#videos">ভিডিও</a>
            <a href="#about">পরিচয়</a>
            <a className="nav-contact" href="#contact">
              যোগাযোগ
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <Image
            className="hero-photo"
            src="/images/hero-pond.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-shade" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">মাছ · চিংড়ি · পোল্ট্রি</p>
              <h1>
                <span className="line">
                  <Words text="খামারের পণ্য," />
                </span>
                <span className="line">
                  <Words text="নাম ধরে" /> <em>খুঁজুন।</em>
                </span>
              </h1>
              <p className="lede">
                চাষি ভাই মাছ ও চিংড়ি চাষ এবং পোল্ট্রির প্রয়োজনীয় পণ্য রাখে। প্যাক দেখে নাম মিলিয়ে নিন। দাম ও মজুত জানতে WhatsApp বা ফোন করুন।
              </p>
              <ul className="hero-points">
                <li>{products.length}টি পণ্য: পানির যত্ন, প্রোবায়োটিক, পুষ্টি ও ভেট</li>
                <li>চাষের ভিডিও এই সাইটেই চলে</li>
                <li>অর্ডার হয় সরাসরি কথা বলে, এখানে দাম লেখা নেই</li>
              </ul>
              <div className="actions">
                <MagnetLink className="button primary" href="#products">
                  পণ্য দেখুন
                  <ArrowRight className="icon" size={18} strokeWidth={1.75} aria-hidden />
                </MagnetLink>
                <a className="button secondary" href="#videos">
                  <YouTubeMark size={16} />
                  ভিডিও দেখুন
                </a>
              </div>
            </div>
          </div>
        </section>
        <PackShelf reduced={reduced} onOpen={openProduct} />
        <section className="band container" id="products">
          <div className="section-heading reveal">
            <div className="section-copy">
              <p className="eyebrow" lang="en">
                CATALOG
              </p>
              <h2>সব প্যাক একসাথে।</h2>
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
                  বিস্তারিত দেখুন
                  <ArrowRight className="icon" size={16} strokeWidth={1.75} aria-hidden />
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
            দাম, মজুত ও ডেলিভারি এই তালিকায় নেই। জানতে যোগাযোগ করুন। ব্যবহারের নিয়ম প্যাকেটের লেখা থেকে নিন।{" "}
            <a href="#contact">
              যোগাযোগ
              <ArrowRight className="icon" size={14} strokeWidth={1.75} aria-hidden />
            </a>
          </p>
        </section>
        <section className="band channel" id="videos">
          <div className="container">
            <div className="section-copy">
              <p className="eyebrow" lang="en">
                WATCH
              </p>
              <h2>চাষের ভিডিও এখানেই চলবে।</h2>
              <p>মাছ ও চিংড়ি চাষ নিয়ে চাষি ভাইয়ের ভিডিও এই পাতাতেই চলে। তালিকা থেকে অন্য ভিডিও বেছে নিলে সেটাও এখানেই শুরু হয়।</p>
            </div>
            <ChannelPlayer reduced={reduced} />
            <a className="text-link channel-out" href={channel} target="_blank" rel="noopener noreferrer">
              <YouTubeMark size={16} />
              পুরো চ্যানেল
              <ArrowUpRight className="icon" size={16} strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </section>
        <section className="band container about" id="about">
          <div className="about-grid reveal">
            <div className="about-brand">
              <Image src="/images/brand/crest.webp" alt="চাষি ভাইয়ের লোগো" width={112} height={112} />
              <div>
                <p className="eyebrow" lang="en">
                  ABOUT
                </p>
                <h2>চাষি ভাই কী করে।</h2>
              </div>
            </div>
            <div>
              <p>
                মাছ ও চিংড়ি চাষ এবং পোল্ট্রির প্রয়োজনীয় পণ্য সরবরাহ করে, আর ইউটিউবে সেই চাষ নিয়ে ভিডিও বানায়। পণ্য নিতে চাইলে নাম বলে WhatsApp করুন।
              </p>
              <a className="text-link" href="#contact">
                যোগাযোগ করুন
                <ArrowRight className="icon" size={16} strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </div>
        </section>
        <section className="band container order">
          <div className="reveal">
            <p className="eyebrow" lang="en">
              PATH
            </p>
            <h2>পণ্য নিতে এই তিন ধাপ।</h2>
            <div className="steps">
              {[
                { number: "০১", title: "পণ্য বেছে নিন", copy: "প্যাকের নাম দেখে আপনার দরকারের পণ্যটি খুঁজুন।", icon: Package },
                { number: "০২", title: "দাম জানুন", copy: "মজুত ও ডেলিভারি নিয়ে সরাসরি কথা বলুন। এখানে দাম লেখা নেই।", icon: MessageCircle },
                { number: "০৩", title: "অর্ডার দিন", copy: "পেমেন্ট ও নেওয়ার নিয়ম বুঝে তারপর নিশ্চিত করুন।", icon: BadgeCheck },
              ].map(({ number, title, copy, icon: StepIcon }) => (
                <article className="step" key={number}>
                  <span className="step-number">
                    <StepIcon className="icon" size={16} strokeWidth={1.75} aria-hidden />
                    {number}
                  </span>
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
              <p className="eyebrow" lang="en">
                CONTACT
              </p>
              <h2>দাম ও মজুত জানতে কথা বলুন।</h2>
              <p>পণ্যের নাম, কতটা লাগবে, আর কোথায় পাঠাতে হবে, সেটা লিখে WhatsApp করুন।</p>
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
        </section>
      </main>
      <footer>
        <div className="container footer-main">
          <a className="brand" href="#main">
            <Image src="/images/brand/crest.webp" alt="" width={48} height={48} />
            <span>
              চাষি ভাই<small>মাছ, চিংড়ি ও পোল্ট্রির পণ্য</small>
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
        <WhatsAppMark />
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
                  <dt>প্যাক সাইজ</dt>
                  <dd>{selected.size || "প্যাকেট দেখুন"}</dd>
                </div>
                <div>
                  <dt>ব্র্যান্ড</dt>
                  <dd>{selected.maker || "প্যাকেট দেখুন"}</dd>
                </div>
              </dl>
              <p>দাম ও মজুত এই পাতায় নেই। জানতে যোগাযোগ করুন। কতটুকু দেবেন, সেটা প্যাকেটের নির্দেশনা থেকে নিন।</p>
              <a className="button primary" href={whatsappFor(selected.name, selected.size)} target="_blank" rel="noopener noreferrer">
                <WhatsAppMark />
                এই পণ্য নিয়ে WhatsApp
              </a>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
