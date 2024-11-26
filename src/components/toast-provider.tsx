import { createContext, useContext, useState } from 'react';
import {
  Toast,
  ToastProvider as Provider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
} from '@/components/ui/toast';

interface ToastContextType {
  showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showError: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <ToastContext.Provider value={{ showError }}>
      <Provider>
        {children}
        {error && (
          <Toast variant="destructive">
            <div className="grid gap-1">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{error}</ToastDescription>
            </div>
          </Toast>
        )}
        <ToastViewport />
      </Provider>
    </ToastContext.Provider>
  );
}