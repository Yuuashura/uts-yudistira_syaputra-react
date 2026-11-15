import { Bell, CheckCircle2, CircleAlert } from 'lucide-react';
import Modal from './Modal';
import { dateTime } from './ReviewList';
export default function NotificationsModal({ notifications, onClose }) {
  return <Modal title="Notifikasi" onClose={onClose}><p className="muted">Semua aktivitas kecilmu, tersimpan di sini.</p>{notifications.length ? <div className="notifications-list">{notifications.map(item => <article key={item.id} className={`notification ${item.read ? '' : 'unread'}`}>{item.type === 'error' ? <CircleAlert size={20} /> : <CheckCircle2 size={20} />}<div><p>{item.message}</p><small>{dateTime(item.createdAt)}{!item.read && ' · Belum dibaca'}</small></div></article>)}</div> : <div className="empty-state"><Bell size={38} strokeWidth={1} /><h3>Masih tenang di sini.</h3><p>Belum ada notifikasi. Aktivitasmu akan muncul di sini.</p></div>}</Modal>;
}
