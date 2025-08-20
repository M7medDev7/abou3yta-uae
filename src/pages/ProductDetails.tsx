import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPhoneBySlug } from '@/lib/phones';
import { PhoneItem } from '@/types/phone';
import { useFavorites } from '@/hooks/FavouritesContext';
import { BuyNowModal } from '@/components/BuyNowModal';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState<PhoneItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [phoneImage, setPhoneImage] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const foundPhone = getPhoneBySlug(slug);
      if (foundPhone) {
        setPhone(foundPhone);
        setSelectedColor(foundPhone.colors[0]?.label || '');
        setPhoneImage(foundPhone.images[`${foundPhone.colors[0].key}`]);
        console.log(phoneImage);
      } else {
        navigate('/404');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const selectedColorData = phone.colors.find(color => color.label === selectedColor) || phone.colors[0].label;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: phone.name,
        text: `تحقق من ${phone.name} بسعر ${phone[selectedVariant]} EGP`,
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

      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 w-full">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square w-5/6 max-md:w-full p-4 rounded-lg overflow-hidden bg-muted">
              <img 
                src={phoneImage}
                alt={phone.name}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{phone.name}</h1>
              {/* <p className="text-muted-foreground text-lg">{phone.brand} {phone.model}</p> */}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">
                {phone.variants[selectedVariant].price.toLocaleString()} EGP
              </div>
              <Badge 
                variant={phone.available === true ? 'default' : 'destructive'}
                className="text-sm"
              >
                {phone.available === true ? 'متاح' : 'غير متاح'}
              </Badge>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">اللون: {selectedColor}</h3>
              <div className="flex gap-2">
                {phone.colors.map((color) => (
                  <button
                    key={color.key}
                    onClick={() => {setSelectedColor(color.label); setPhoneImage(phone.images[color.key])}}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.key 
                        ? 'border-primary ring-2 ring-primary/30' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="variants-group flex items-center flex-wrap gap-3">
              {phone.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`p-4 rounded-lg border-2 max-sm:w-full font-semibold transition-all ${
                    selectedVariant === variant.id
                    ? 'border-primary ring-2 ring-primary/30 dark:bg-[#007bff3e] bg-[#007bff29] text-primary dark:text-white' 
                    : 'border-border hover:border-primary/50 dark:text-white text-black'
                  }`}
                >
                  مساحة {variant.storage} / رام {variant.ram}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => setShowBuyNow(true)}
                disabled={phone.available !== true}
                size="lg"
                variant="hero"
                className="w-full focus-ring"
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
                        <li key={index} className="flex items-start justify-end gap-2 text-right">
                          <span className='leading-[1.6]'>{pro}</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
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
                        <li key={index} className="flex items-start justify-end gap-2 text-right">
                          <span className=''>{con}</span>
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
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