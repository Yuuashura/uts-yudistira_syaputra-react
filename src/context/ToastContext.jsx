import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback(id => setToasts(items => items.filter(item => item.id !== id)), []);
  const toast = useCallback((message, type = 'success') => {
    setToasts(items => [...items, { id: crypto.randomUUID(), message, type }]);
  }, []);
  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);
