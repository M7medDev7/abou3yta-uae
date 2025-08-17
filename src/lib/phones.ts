import { PhoneItem } from '@/types/phone';
import phonesData from '@/data/phones.json';

export function getAllPhones(): PhoneItem[] {
  return phonesData as PhoneItem[];
}

export function getPhoneBySlug(slug: string): PhoneItem | null {
  const phones = getAllPhones();
  return phones.find(phone => phone.slug === slug) || null;
}

export function getPhonesByBrand(brand: string): PhoneItem[] {
  const phones = getAllPhones();
  return phones.filter(phone => phone.brand.toLowerCase() === brand.toLowerCase());
}

export function getAvailablePhones(): PhoneItem[] {
  const phones = getAllPhones();
  return phones.filter(phone => phone.availability === 'in_stock');
}

export function getBrands(): string[] {
  const phones = getAllPhones();
  const brands = new Set(phones.map(phone => phone.brand));
  return Array.from(brands);
}