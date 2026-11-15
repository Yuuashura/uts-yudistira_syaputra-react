import { createContext, useContext, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

const NotificationContext = createContext(null);
const validNotifications = value => Array.isArray(value) && value.every(item => item && typeof item.id === 'string' && typeof item.message === 'string' && typeof item.read === 'boolean' && Number.isFinite(item.createdAt));
const validBoolean = value => typeof value === 'boolean';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications, notificationsStorageError] = useLocalStorage('kopiku.notifications', [], validNotifications);
  const [autoRead, setAutoRead, autoReadStorageError] = useLocalStorage('kopiku.autoRead', false, validBoolean);
  const { toast } = useToast();

  // Enabling the preference also reads existing notifications. Do not watch the
  // list here: users can still explicitly mark an individual item unread.
  useEffect(() => {
    if (autoRead) {
      setNotifications(items => items.some(item => !item.read)
        ? items.map(item => item.read ? item : { ...item, read: true })
        : items);
    }
  }, [autoRead, setNotifications]);

  const notify = useCallback((message, type = 'success') => {
    toast(message, type);
    const item = { id: crypto.randomUUID(), message, type, createdAt: Date.now(), read: autoRead };
    setNotifications(items => [item, ...items]);
  }, [toast, setNotifications, autoRead]);

  const markRead = useCallback(target => {
    // Non-string values (for example a click event) mean "mark all".
    const id = typeof target === 'string' ? target : undefined;
    if (!notifications.some(item => !item.read && (id === undefined || item.id === id))) return;
    setNotifications(items => items.map(item => !item.read && (id === undefined || item.id === id)
      ? { ...item, read: true } : item));
    toast(id === undefined ? 'Semua notifikasi ditandai sudah dibaca.' : 'Notifikasi ditandai sudah dibaca.', 'info');
  }, [notifications, setNotifications, toast]);

  const markUnread = useCallback(id => {
    if (!notifications.some(item => item.id === id && item.read)) return;
    setNotifications(items => items.map(item => item.id === id && item.read ? { ...item, read: false } : item));
    toast('Notifikasi ditandai belum dibaca.', 'info');
  }, [notifications, setNotifications, toast]);

  const unread = notifications.filter(item => !item.read).length;
  const storageError = notificationsStorageError || autoReadStorageError;
  return <NotificationContext.Provider value={{ notifications, notify, unread, markRead, markUnread, autoRead, setAutoRead, storageError }}>{children}</NotificationContext.Provider>;
}
export const useNotifications = () => useContext(NotificationContext);
