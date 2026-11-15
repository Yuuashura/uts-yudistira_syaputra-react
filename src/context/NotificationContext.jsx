import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

const NotificationContext = createContext(null);
const validNotifications = value => Array.isArray(value) && value.every(item => item && typeof item.id === 'string' && typeof item.message === 'string' && typeof item.read === 'boolean' && Number.isFinite(item.createdAt));
export function NotificationProvider({ children }) {
  const [notifications, setNotifications, storageError] = useLocalStorage('kopiku.notifications', [], validNotifications);
  const { toast } = useToast();
  const notify = useCallback((message, type = 'success') => {
    toast(message, type);
    const item = { id: crypto.randomUUID(), message, type, createdAt: Date.now(), read: false };
    setNotifications(items => [item, ...items]);
  }, [toast, setNotifications]);
  const markRead = () => setNotifications(items => items.map(item => ({ ...item, read: true })));
  return <NotificationContext.Provider value={{ notifications, notify, markRead, storageError, unread: notifications.filter(item => !item.read).length }}>{children}</NotificationContext.Provider>;
}
export const useNotifications = () => useContext(NotificationContext);
