export type Availability = "in_stock" | "out_of_stock";

export interface PhoenColors {
  key: string;
  code: string;
  label: string;
}

export interface PhoneImages {
  [key: string]: string;
}

export interface PhoneVariants {
  id: string;
  ram: string;
  storage: string;
  price: number;
}

export interface PhoneSpecs {
  processor: string;
  screen: number;
  display: string;
  weight: number;
  battery: number;
  os: string;
  camera: string[];
  network: string;
  sim: string;
}

export interface PhoneItem {
  id: string;           // unique id, e.g. 's24-ultra'
  name: string;         // URL slug, e.g. 'samsung-galaxy-s24-ultra'
  brand: string;        // 'Samsung' | 'Oppo' | 'Xiaomi' | etc.
  price: number;        // 'Galaxy S24 Ultra'
  available: boolean;         // Arabic display name: 'سامسونج جالاكسي S24 ألترا'
  images: PhoneImages;
  colors: PhoenColors[];        // in EGP
  variants: PhoneVariants[];
  specs: PhoneSpecs; // color options each with their images
  pros: string[];       // Arabic bullet points
  cons: string[];       // Arabic bullet points
  keywords: string[];  // Arabic/English keywords to improve search
}