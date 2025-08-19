import { PhoneItem } from '@/types/phone';

// Normalize Arabic text for better search
function normalizeArabicText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[َُِٰٓٱ]/g, '') // Remove diacritics
    .replace(/[٠-٩]/g, (match) => String.fromCharCode(match.charCodeAt(0) - '٠'.charCodeAt(0) + '0'.charCodeAt(0))) // Convert Arabic digits
    .trim();
}

export function searchPhones(phones: PhoneItem[], query: string): PhoneItem[] {
  if (!query.trim()) return [];

  const normalizedQuery = normalizeArabicText(query);
  const queryTerms = normalizedQuery.split(/\s+/);

  return phones.filter(phone => {
    const searchableText = [
      phone.name,
      phone.brand,
      phone.variants[0].ram,
      phone.variants[0].storage,
      phone.colors[0].key,
      ...phone.colors.map(color => color.key),
      ...(phone.keywords || [])
    ].join(' ');

    const normalizedText = normalizeArabicText(searchableText);

    return queryTerms.every(term => normalizedText.includes(term));
  });
}

export function highlightSearchTerm(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const normalizedQuery = normalizeArabicText(query);
  const regex = new RegExp(`(${normalizedQuery})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}