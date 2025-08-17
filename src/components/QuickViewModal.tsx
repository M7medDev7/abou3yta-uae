import { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PhoneItem } from '@/types/phone';
import { BuyNowModal } from './BuyNowModal';
import s24Image from '@/assets/phones/s24-ultra-black.webp';
import iphoneImage from '@/assets/phones/iphone15-pro-titanium.jpg';
import xiaomiImage from '@/assets/phones/xiaomi14-ultra-black.jpg';
import oppoImage from '@/assets/phones/oppo-findx7-black.jpg';

interface QuickViewModalProps {
  phone: PhoneItem;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ phone, isOpen, onClose }: QuickViewModalProps) {
  const [showBuyNow, setShowBuyNow] = useState(false);

  // Simple mapping for demo
  const getImageForPhone = (phone: PhoneItem) => {
    if (phone.brand === 'Samsung') return s24Image;
    if (phone.brand === 'Apple') return iphoneImage;
    if (phone.brand === 'Xiaomi') return xiaomiImage;
    if (phone.brand === 'Oppo') return oppoImage;
    return s24Image; // fallback
  };

  const handleBuyNow = () => {
    setShowBuyNow(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">{phone.name}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="space-y-4">
              <img 
                src={getImageForPhone(phone)}
                alt={phone.name}
                className="w-fit rounded-lg"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {phone.price.toLocaleString()} {phone.currency}
                </div>
                <Badge 
                  variant={phone.availability === 'in_stock' ? 'default' : 'destructive'}
                >
                  {phone.availability === 'in_stock' ? 'متاح' : 'غير متاح'}
                </Badge>
              </div>

              {/* Key Specs */}
              <div className="space-y-2">
                <h4 className="font-semibold">المواصفات الرئيسية:</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشاشة:</span>
                    <span>{phone.specs.screen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المعالج:</span>
                    <span>{phone.specs.processor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الذاكرة:</span>
                    <span>{phone.shortSpecs.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">التخزين:</span>
                    <span>{phone.shortSpecs.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">البطارية:</span>
                    <span>{phone.specs.battery}</span>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <Button 
                onClick={handleBuyNow}
                disabled={phone.availability !== 'in_stock'}
                variant="hero"
                className="w-full focus-ring"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                اشتري الآن
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BuyNowModal 
        phone={phone}
        isOpen={showBuyNow}
        onClose={() => setShowBuyNow(false)}
      />
    </>
  );
}