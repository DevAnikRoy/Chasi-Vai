export type HeroSlide = {
  src: string;
  alt: string;
  position: string;
};

/** পুকুর, দোকান, প্রশিক্ষণ ও আয়োজন—হিরোতে ঘোরে */
export const heroSlides: HeroSlide[] = [
  {
    src: "/images/trust/training.webp",
    alt: "চাষিদের প্রশিক্ষণ অনুষ্ঠান",
    position: "center 42%",
  },
  {
    src: "/images/trust/pond-bank.webp",
    alt: "পুকুরের পাড়ে চাষি ভাই",
    position: "50% 22%",
  },
  {
    src: "/images/trust/seminar.webp",
    alt: "প্রশিক্ষণ ও সেমিনার",
    position: "50% 55%",
  },
  {
    src: "/images/trust/award.webp",
    alt: "দোকানে স্বীকৃতি",
    position: "50% 40%",
  },
  {
    src: "/images/trust/shop.webp",
    alt: "দোকানের ভিতর",
    position: "52% 45%",
  },
];
