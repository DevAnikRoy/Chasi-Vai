export const channel = "https://www.youtube.com/@chashi-vai";
export const whatsapp = "https://wa.me/8801775087675";
export const facebook = "https://www.facebook.com/share/17Zu7y5ok3/";
export const phone = "+8801775087675";
export const phoneLabel = "01775-087675";
export const email = "chashivai07@gmail.com";

export function whatsappFor(name: string, size: string) {
  const pack = size || "প্যাকেট";
  const text = `আসসালামু আলাইকুম, ${name} (${pack}) পণ্যটির দাম, মজুত ও ডেলিভারি সম্পর্কে জানতে চাই।`;
  return `${whatsapp}?text=${encodeURIComponent(text)}`;
}
