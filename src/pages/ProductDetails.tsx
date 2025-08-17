import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPhoneBySlug } from '@/lib/phones';
import { PhoneItem } from '@/types/phone';
import { useFavorites } from '@/hooks/useFavorites';
import { BuyNowModal } from '@/components/BuyNowModal';
import { useToast } from '@/hooks/use-toast';
import s24Image from '@/assets/phones/s24-ultra-black.jpg';
import iphoneImage from '@/assets/phones/iphone15-pro-titanium.jpg';
import xiaomiImage from '@/assets/phones/xiaomi14-ultra-black.jpg';
import oppoImage from '@/assets/phones/oppo-findx7-black.jpg';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState<PhoneItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showBuyNow, setShowBuyNow] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (slug) {
      const foundPhone = getPhoneBySlug(slug);
      if (foundPhone) {
        setPhone(foundPhone);
        setSelectedColor(foundPhone.colors[0]?.name || '');
      } else {
        navigate('/404');
      }
    }
  }, [slug, navigate]);

  if (!phone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  // Simple mapping for demo
  const getImageForPhone = (phone: PhoneItem) => {
    if (phone.brand === 'Samsung') return s24Image;
    if (phone.brand === 'Apple') return iphoneImage;
    if (phone.brand === 'Xiaomi') return xiaomiImage;
    if (phone.brand === 'Oppo') return oppoImage;
    return s24Image; // fallback
  };

  const selectedColorData = phone.colors.find(color => color.name === selectedColor) || phone.colors[0];

  const handleShare = async () => {
    try {
      await navigator.share({
        title: phone.name,
        text: `تحقق من ${phone.name} بسعر ${phone.price.toLocaleString()} ${phone.currency}`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط المنتج إلى الحافظة"
      });
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(phone.id);
    toast({
      title: isFavorite(phone.id) ? "تمت الإزالة من المفضلة" : "تم إضافة إلى المفضلة",
      description: isFavorite(phone.id) 
        ? "تم حذف المنتج من قائمة المفضلة" 
        : "تم إضافة المنتج إلى قائمة المفضلة"
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">الرئيسية</Link>
            <ArrowRight className="h-4 w-4 rtl-flip" />
            <span className="text-foreground">{phone.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img 
                src={getImageForPhone(phone)}
                alt={phone.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{phone.name}</h1>
              <p className="text-muted-foreground text-lg">{phone.brand} {phone.model}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">
                {phone.price.toLocaleString()} {phone.currency}
              </div>
              <Badge 
                variant={phone.availability === 'in_stock' ? 'default' : 'destructive'}
                className="text-sm"
              >
                {phone.availability === 'in_stock' ? 'متاح' : 'غير متاح'}
              </Badge>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">اللون: {selectedColor}</h3>
              <div className="flex gap-2">
                {phone.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name 
                        ? 'border-primary ring-2 ring-primary/30' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => setShowBuyNow(true)}
                disabled={phone.availability !== 'in_stock'}
                size="lg"
                className="w-full phone-hero-gradient hover:opacity-90 focus-ring"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                اشتري الآن
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleFavoriteToggle}
                  className="flex-1 focus-ring"
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite(phone.id) ? 'fill-current' : ''}`} />
                  {isFavorite(phone.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                </Button>
                
                <Button variant="outline" onClick={handleShare} className="focus-ring">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="specs">المواصفات</TabsTrigger>
                <TabsTrigger value="pros">المميزات</TabsTrigger>
                <TabsTrigger value="cons">العيوب</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specs" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      {Object.entries(phone.specs).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                            <span className="text-muted-foreground capitalize">
                              {key === 'screen' && 'الشاشة'}
                              {key === 'processor' && 'المعالج'}
                              {key === 'camera' && 'الكاميرا'}
                              {key === 'battery' && 'البطارية'}
                              {key === 'os' && 'نظام التشغيل'}
                              {key === 'network' && 'الشبكة'}
                              {key === 'sim' && 'الشريحة'}
                              {key === 'dimensions' && 'الأبعاد'}
                              {key === 'weight' && 'الوزن'}
                              {!['screen', 'processor', 'camera', 'battery', 'os', 'network', 'sim', 'dimensions', 'weight'].includes(key) && key}
                            </span>
                            <span className="font-medium">{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pros" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {phone.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cons" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {phone.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <BuyNowModal 
        phone={phone}
        isOpen={showBuyNow}
        onClose={() => setShowBuyNow(false)}
      />
    </div>
  );
}