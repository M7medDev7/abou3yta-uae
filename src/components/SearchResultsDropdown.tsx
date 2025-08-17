import { Link } from 'react-router-dom';
import { PhoneItem } from '@/types/phone';
import s24Image from '@/assets/phones/s24-ultra-black.webp';
import iphoneImage from '@/assets/phones/iphone15-pro-titanium.jpg';
import xiaomiImage from '@/assets/phones/xiaomi14-ultra-black.jpg';
import oppoImage from '@/assets/phones/oppo-findx7-black.jpg';

interface SearchResultsDropdownProps {
  results: PhoneItem[];
  query: string;
  onClose: () => void;
}

export function SearchResultsDropdown({ results, query, onClose }: SearchResultsDropdownProps) {
  if (results.length === 0 && query.trim()) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 animate-fade-in">
        <div className="p-4 text-center text-muted-foreground">
          لا توجد نتائج
        </div>
      </div>
    );
  }

  if (results.length === 0) return null;

  // Simple mapping for demo - in real app you'd handle this properly
  const getImageForPhone = (phone: PhoneItem) => {
    if (phone.brand === 'Samsung') return s24Image;
    if (phone.brand === 'Apple') return iphoneImage;
    if (phone.brand === 'Xiaomi') return xiaomiImage;
    if (phone.brand === 'Oppo') return oppoImage;
    return s24Image; // fallback
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 animate-fade-in">
      <div className="max-h-96 overflow-y-auto">
        {results.map((phone) => (
          <Link
            key={phone.id}
            to={`/product/${phone.slug}`}
            onClick={onClose}
            className="flex items-center gap-3 p-3 hover:bg-accent/50 border-b last:border-b-0 focus-ring"
          >
            <img 
              src={getImageForPhone(phone)}
              alt={phone.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{phone.name}</h4>
              <p className="text-xs text-muted-foreground">
                {phone.brand} • {phone.shortSpecs.ram} • {phone.shortSpecs.storage}
              </p>
              <p className="text-xs font-semibold text-primary">
                {phone.price.toLocaleString()} {phone.currency}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}