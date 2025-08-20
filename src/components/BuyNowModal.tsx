import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PhoneItem } from '@/types/phone';
import { useToast } from '@/hooks/use-toast';

interface BuyNowModalProps {
  phone: PhoneItem;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phonePrimary: string;
  color: string;
  variant: string;
}

const WHATSAPP_NUMBER = '+201020217073';

export function BuyNowModal({ phone, isOpen, onClose }: BuyNowModalProps) {
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phonePrimary: '',
    color: '',
    variant: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validatePhone = (phone: string): boolean => {
    return /^01[0-2,5]{1}[0-9]{8}$/.test(phone) && phone.length === 11;
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم الرباعي مطلوب';
    }
    
    if (!formData.phonePrimary.trim()) {
      newErrors.phonePrimary = 'رقم الهاتف الأساسي مطلوب';
    } else if (!validatePhone(formData.phonePrimary)) {
      newErrors.phonePrimary = 'رقم الهاتف غير صحيح';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create WhatsApp message
      const message = `
مرحباً، أريد طلب هاتف:

📱 *${phone.name}*
💰 السعر: ${phone.variants[Number(selectedVariant)].price.toLocaleString()} جنيه مصري
🔧 المواصفات: ${phone.variants[Number(selectedVariant)].ram} • ${phone.variants[Number(selectedVariant)].storage} • ${phone.colors[`${selectedColor}`].label}


👤 *بيانات العميل:*
الاسم: ${formData.name}
الهاتف الأساسي: ${formData.phonePrimary}

أرجو التواصل معي لإتمام الطلب، شكراً.
      `.trim();

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "تم إرسال الطلب!",
        description: "سيتم توجيهك إلى واتساب لإكمال الطلب",
      });

      // Reset form and close modal
      setFormData({ name: '', phonePrimary: '', color: '', variant: '' });
      onClose();
      
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">اشتري الآن - {phone.name}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الرباعي *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className={errors.name ? 'border-destructive' : ''}
              dir="rtl"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phonePrimary">رقم هاتف أساسي *</Label>
            <Input
              id="phonePrimary"
              type="tel"
              value={formData.phonePrimary}
              onChange={(e) => handleInputChange('phonePrimary', e.target.value)}
              placeholder="01xxxxxxxxx"
              className={errors.phonePrimary ? 'border-destructive' : ''}
              dir="ltr"
            />
            {errors.phonePrimary && (
              <p className="text-sm text-destructive">{errors.phonePrimary}</p>
            )}
          </div>

          <div className="space-y-3">
              <h3 className="font-semibold">اللون: {phone.colors[selectedColor].label}</h3>
              <div className="flex gap-2">
                {phone.colors.map((color, index) => (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => {setSelectedColor(index); handleInputChange('color', color.label)}}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === index 
                        ? 'border-primary ring-2 ring-primary/30' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.label}
                  />
                ))}
              </div>
          </div>

          <div className="variants-group flex items-center flex-wrap gap-2">
              {phone.variants.map((variant) => (
                <button
                  key={variant.id}
                  type='button'
                  onClick={() => {setSelectedVariant(variant.id); handleInputChange('variant', String(variant.id))}}
                  className={`p-2.5 rounded-lg border-2 max-sm:w-full font-semibold transition-all ${
                    selectedVariant === variant.id
                    ? 'border-primary ring-2 ring-primary/30 dark:bg-[#007bff3e] bg-[#007bff29] text-primary dark:text-white' 
                    : 'border-border hover:border-primary/50 dark:text-white text-black'
                  }`}
                >
                  {variant.storage} / {variant.ram}
                </button>
              ))}
            </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            variant="hero"
            className="w-full focus-ring"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {isSubmitting ? 'جارٍ الإرسال...' : 'تأكيد الطلب عبر واتساب'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}