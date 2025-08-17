import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export function LocalStorageStatus() {
  const [status, setStatus] = useState<{
    favorites: number;
    theme: string;
    isAvailable: boolean;
  }>({
    favorites: 0,
    theme: 'light',
    isAvailable: false
  });

  useEffect(() => {
    const checkStatus = () => {
      try {
        // Check if localStorage is available
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);

        // Get current values
        const favoritesData = localStorage.getItem('abou3yta.favorites');
        const themeData = localStorage.getItem('abou3yta.theme');
        
        setStatus({
          favorites: favoritesData ? JSON.parse(favoritesData).length : 0,
          theme: themeData || 'light',
          isAvailable: true
        });
      } catch (error) {
        setStatus(prev => ({ ...prev, isAvailable: false }));
      }
    };

    checkStatus();
    
    // Update every second to show real-time changes
    const interval = setInterval(checkStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {status.isAvailable ? (
        <CheckCircle className="h-3 w-3 text-green-500" />
      ) : (
        <XCircle className="h-3 w-3 text-red-500" />
      )}
      <span>
        التخزين المحلي: {status.isAvailable ? 'يعمل' : 'معطل'} | 
        المفضلة: {status.favorites} | 
        المظهر: {status.theme === 'dark' ? 'داكن' : 'فاتح'}
      </span>
    </div>
  );
}