import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { getAllPhones } from '@/lib/phones';
import { useFavorites } from '@/hooks/useFavorites';

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();
  const allPhones = getAllPhones();
  
  const favoritePhones = useMemo(() => {
    return allPhones.filter(phone => favorites.includes(phone.id));
  }, [allPhones, favorites]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">الرئيسية</Link>
            <ArrowRight className="h-4 w-4 rtl-flip" />
            <span className="text-foreground">المفضلة</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">المفضلة</h1>
            <p className="text-muted-foreground">
              {favoritePhones.length} من الهواتف المحفوظة
            </p>
          </div>
          
          {favoritePhones.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFavorites}
              className="focus-ring"
            >
              مسح الكل
            </Button>
          )}
        </div>

        {/* Content */}
        {favoritePhones.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد هواتف مفضلة</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              لم تقم بإضافة أي هواتف إلى قائمة المفضلة بعد. ابدأ بتصفح مجموعتنا الرائعة من الهواتف الذكية.
            </p>
            <Link to="/">
              <Button variant="hero" className="focus-ring">
                تصفح الهواتف
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritePhones.map((phone) => (
              <ProductCard key={phone.id} phone={phone} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}