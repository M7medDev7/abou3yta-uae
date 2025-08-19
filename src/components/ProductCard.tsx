import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PhoneItem } from '@/types/phone';
import { useFavorites } from '@/hooks/FavouritesContext';
import { useToast } from '@/hooks/use-toast';
import { QuickViewModal } from './QuickViewModal';
interface ProductCardProps {
  phone: PhoneItem;
}

export function ProductCard({ phone }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasAlreadyFavorite = isFavorite(phone.id);
    toggleFavorite(phone.id);
    
    // Show toast notification
    toast({
      title: wasAlreadyFavorite ? "تمت الإزالة من المفضلة" : "تم إضافة إلى المفضلة",
      description: wasAlreadyFavorite 
        ? `تم حذف ${phone.name} من قائمة المفضلة` 
        : `تم إضافة ${phone.name} إلى قائمة المفضلة`,
    });
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <Card className="group p-3 overflow-hidden phone-card-shadow hover:phone-glow-shadow transition-all duration-300 animate-slide-up">
        <div className="relative">
          <img 
            src={phone.images[phone.colors[0].key]}
            alt={phone.name}
            width={225}
            height={0}
            className=" object-fill p-1 group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Availability Badge */}
          <Badge 
            variant={phone.available === true ? 'default' : 'destructive'}
            className="absolute top-2 right-2"
          >
            {phone.available === true ? 'متاح' : 'غير متاح'}
          </Badge>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="absolute top-2 left-2 h-8 w-8 p-0 bg-background/80 hover:bg-background focus-ring"
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite(phone.id) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>

        <CardContent className="p-2">
          <h3 className="font-semibold text-xl mb-2 line-clamp-2">{phone.name}</h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span>{phone.variants[0].ram}</span>
            <span>•</span>
            <span>{phone.variants[0].storage}</span>
            <span>•</span>
            <span>{phone.colors[0].label}</span>
          </div>

          <div className="text-2xl font-bold text-primary mb-4">
            {phone.price.toLocaleString()} جنيه مصري
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-2">
          <div className="flex gap-2 w-full">
            <Link to={`/product/${phone.id}`} className="flex-1">
              <Button variant="outline" className="w-full focus-ring">
                عرض التفاصيل
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickViewClick}
              className="focus-ring"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <QuickViewModal 
        phone={phone}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}