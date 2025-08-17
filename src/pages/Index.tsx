import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { getAllPhones } from '@/lib/phones';
import { LocalStorageStatus } from '@/components/LocalStorageStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  
  const allPhones = getAllPhones();
  
  const filteredPhones = useMemo(() => {
    let phones = allPhones;
    
    if (selectedBrand) {
      phones = phones.filter(phone => phone.brand === selectedBrand);
    }
    
    if (showOnlyAvailable) {
      phones = phones.filter(phone => phone.availability === 'in_stock');
    }
    
    return phones;
  }, [allPhones, selectedBrand, showOnlyAvailable]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onBrandFilter={setSelectedBrand}
        selectedBrand={selectedBrand}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 phone-hero-gradient opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            مرحباً بك في <span className="phone-hero-gradient bg-clip-text text-transparent">أبو عيطه</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            اكتشف أحدث الهواتف الذكية من أفضل العلامات التجارية بأسعار تنافسية
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">الهواتف المتاحة</h2>
              <Badge variant="secondary">
                {filteredPhones.length} هاتف
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={showOnlyAvailable ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                className="focus-ring"
              >
                المتاح فقط
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredPhones.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">لا توجد هواتف متاحة</h3>
              <p className="text-muted-foreground mb-4">جرب تغيير الفلاتر أو البحث عن هاتف آخر</p>
              <Button onClick={() => {
                setSelectedBrand(null);
                setShowOnlyAvailable(false);
              }}>
                إعادة تعيين الفلاتر
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
              {filteredPhones.map((phone) => (
                <ProductCard key={phone.id} phone={phone} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 phone-hero-gradient bg-clip-text text-transparent">
                أبو عيطه
              </h3>
              <p className="text-muted-foreground">
                متجرك الموثوق للهواتف الذكية
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground">الرئيسية</a>
                <a href="/favorites" className="block text-muted-foreground hover:text-foreground">المفضلة</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">من نحن</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">تواصل معنا</h4>
              <a 
                href={`https://wa.me/+201020217073`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                واتساب: 01020217073
              </a>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">&copy; 2024 أبو عيطه. جميع الحقوق محفوظة.</p>
            <LocalStorageStatus />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
