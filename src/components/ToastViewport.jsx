import { useEffect } from 'react';
import { CheckCircle2, CircleAlert, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

function Toast({ item, dismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => dismiss(item.id), item.type === 'error' ? 6500 : 4200);
    return () => clearTimeout(timer);
  }, [item.id, item.type, dismiss]);
  const Icon = item.type === 'error' ? CircleAlert : CheckCircle2;
  return <div className={`toast toast-${item.type}`}><Icon size={20} /><span>{item.message}</span><button className="icon-button" aria-label="Tutup pemberitahuan" onClick={() => dismiss(item.id)}><X size={16} /></button></div>;
}
export default function ToastViewport() {
  const { toasts, dismiss } = useToast();
  return <div className="toast-viewport" aria-live="polite" aria-atomic="false">{toasts.slice(0, 3).map(item => <Toast key={item.id} item={item} dismiss={dismiss} />)}</div>;
}
