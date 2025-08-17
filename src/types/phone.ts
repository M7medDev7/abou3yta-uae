export type Availability = "in_stock" | "out_of_stock";

export interface PhoneColor {
  name: string;         // Arabic color name, e.g. "أسود"
  code: string;         // HEX like "#111111"
  images: string[];     // image URLs specific to this color
}

export interface ShortSpecs {
  ram: string;          // "8GB"
  storage: string;      // "256GB"
  color: string;        // default color name, Arabic
}

export interface Specs {
  screen: string;       // e.g. '6.8" QHD+ AMOLED 120Hz'
  processor: string;    // e.g. 'Snapdragon 8 Gen 3'
  camera: string;       // e.g. '200MP + 12MP + 10MP + 10MP'
  battery: string;      // '5000mAh'
  os: string;           // 'Android 14'
  dimensions?: string;
  weight?: string;
  network?: string;     // '5G'
  sim?: string;         // 'Dual SIM'
  [key: string]: string | undefined;
}

export interface PhoneItem {
  id: string;           // unique id, e.g. 's24-ultra'
  slug: string;         // URL slug, e.g. 'samsung-galaxy-s24-ultra'
  brand: string;        // 'Samsung' | 'Oppo' | 'Xiaomi' | etc.
  model: string;        // 'Galaxy S24 Ultra'
  name: string;         // Arabic display name: 'سامسونج جالاكسي S24 ألترا'
  shortSpecs: ShortSpecs;
  price: number;        // in EGP
  currency: "EGP";
  colors: PhoneColor[]; // color options each with their images
  specs: Specs;         // full specs
  pros: string[];       // Arabic bullet points
  cons: string[];       // Arabic bullet points
  extraImages: string[];// box, accessories, etc.
  availability: Availability;
  keywords?: string[];  // Arabic/English keywords to improve search
}