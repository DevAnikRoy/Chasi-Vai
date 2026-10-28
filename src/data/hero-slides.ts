export type HeroSlide = {
  src: string;
  alt: string;
  /** wide = অনেক মানুষ/বanner; people = মুখ দেখা জরুরি */
  focus: "wide" | "people";
  position: string;
  positionSm: string;
};

/** পুকুর, দোকান, প্রশিক্ষণ—হিরোতে ঘোরে (ফোকাস প্রতি ছবি) */
export const heroSlides: HeroSlide[] = [
  {
    src: "/images/trust/training.webp",
    alt: "চাষিদের প্রশিক্ষণ অনুষ্ঠান",
    focus: "wide",
    position: "50% 28%",
    positionSm: "50% 24%",
  },
  {
    src: "/images/trust/pond-bank.webp",
    alt: "পুকুরের পাড়ে চাষি ভাই",
    focus: "people",
    position: "50% 16%",
    positionSm: "50% 12%",
  },
  {
    src: "/images/trust/seminar.webp",
    alt: "প্রশিক্ষণ ও সেমিনার",
    focus: "wide",
    position: "50% 45%",
    positionSm: "50% 40%",
  },
  {
    src: "/images/trust/shelves.webp",
    alt: "দোকানে পুরস্কারসহ চাষি ভাই",
    focus: "people",
    position: "44% 32%",
    positionSm: "50% 28%",
  },
  {
    src: "/images/trust/award.webp",
    alt: "দোকানে দলের সঙ্গে",
    focus: "people",
    position: "50% 34%",
    positionSm: "50% 28%",
  },
  {
    src: "/images/trust/shop.webp",
    alt: "দোকানের ভিতর",
    focus: "people",
    position: "50% 36%",
    positionSm: "50% 30%",
  },
];
