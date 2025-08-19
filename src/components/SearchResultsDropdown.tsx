import { Link } from 'react-router-dom';
import { PhoneItem } from '@/types/phone';
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

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 animate-fade-in">
      <div className="max-h-96 overflow-y-auto">
        {results.map((phone) => (
          <Link
            key={phone.id}
            to={`/product/${phone.id}`}
            onClick={onClose}
            className="flex items-center gap-3 p-3 hover:bg-accent/50 border-b last:border-b-0 focus-ring"
          >
            <img 
              src={"#"}
              alt={phone.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{phone.name}</h4>
              <p className="text-xs text-muted-foreground">
                {phone.brand} • {phone.variants[0].ram} • {phone.variants[0].storage}
              </p>
              <p className="text-xs font-semibold text-primary">
                {phone.variants[0].price.toLocaleString()} جنيه مصري
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}