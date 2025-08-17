import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFavorites } from '@/hooks/FavouritesContext';
import { useTheme } from '@/hooks/useTheme';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchResultsDropdown } from './SearchResultsDropdown';
import { getAllPhones } from '@/lib/phones';
import { searchPhones } from '@/lib/search';

interface NavbarProps {
  onBrandFilter?: (brand: string | null) => void;
  selectedBrand?: string | null;
}

export function Navbar({ onBrandFilter, selectedBrand }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { favoritesCount } = useFavorites();
  
  const debouncedSearch = useDebounce(searchQuery, 200);
  
  const searchResults = debouncedSearch.trim() 
    ? searchPhones(getAllPhones(), debouncedSearch).slice(0, 5)
    : [];

  const brands = [
    { name: 'Samsung', label: 'سامسونج' },
    { name: 'Apple', label: 'آبل' },
    { name: 'Xiaomi', label: 'شاومي' },
    { name: 'Oppo', label: 'أوبو' },
    { name: 'Realme', label: 'ريلمي' },
    { name: 'Infinix', label: 'إنفينكس' }
  ];

  const toggleThemeHandler = () => {
    toggleTheme();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <span className="phone-hero-gradient bg-clip-text text-transparent">
              أبو عيطه
            </span>
          </Link>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="البحث عن هاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="pr-10 focus-ring"
                dir="rtl"
              />
            </div>
            
            {isSearchFocused && (
              <SearchResultsDropdown 
                results={searchResults}
                query={debouncedSearch}
                onClose={() => setIsSearchFocused(false)}
              />
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/favorites">
              <Button variant="ghost" size="sm" className="relative focus-ring">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm" onClick={toggleThemeHandler} className="focus-ring">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Brand Categories */}
        <div className="border-t py-2">
          <div className="flex items-center space-x-4 rtl:space-x-reverse overflow-x-auto">
            <Button
              variant={selectedBrand === null ? "default" : "ghost"}
              size="sm"
              onClick={() => onBrandFilter?.(null)}
              className="whitespace-nowrap focus-ring"
            >
              الكل
            </Button>
            {brands.map((brand) => (
              <Button
                key={brand.name}
                variant={selectedBrand === brand.name ? "default" : "ghost"}
                size="sm"
                onClick={() => onBrandFilter?.(brand.name)}
                className="whitespace-nowrap focus-ring"
              >
                {brand.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}