// hooks/useToast.ts
import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    icon: 'info' as 'error' | 'success' | 'info',
    message: ''
  });

  const showToast = (icon: 'error' | 'success' | 'info', message: string, duration = 3000) => {
    setToast({ show: true, icon, message });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, duration);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return {
    toast,
    showToast,
    hideToast
  };
};