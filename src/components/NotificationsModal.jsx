import { useId, useRef, useState } from 'react';
import { Bell, CheckCircle2, CircleAlert } from 'lucide-react';
import Modal from './Modal';
import { dateTime } from './ReviewList';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationsModal({ onClose }) {
  const { notifications, unread, markRead, markUnread, autoRead, setAutoRead, storageError } = useNotifications();
  const [filter, setFilter] = useState('all');
  const autoReadHintId = useId();
  const activeFilterRef = useRef(null);
  const filters = [
    { value: 'all', label: 'Semua', count: notifications.length },
    { value: 'unread', label: 'Belum dibaca', count: unread },
    { value: 'read', label: 'Sudah dibaca', count: notifications.length - unread },
  ];
  const visibleNotifications = notifications.filter(item => filter === 'all' || (filter === 'read' ? item.read : !item.read));

  function toggleRead(item) {
    if (item.read) markUnread(item.id);
    else markRead(item.id);
    // The row leaves a filtered list; keep keyboard focus inside the dialog.
    if (filter !== 'all') activeFilterRef.current?.focus();
  }

  return <Modal title="Notifikasi" onClose={onClose}>
    <p className="muted">Semua aktivitas kecilmu, tersimpan di sini.</p>
    <div className="notification-settings">
      <label className="notification-auto-read">
        <input type="checkbox" checked={autoRead} onChange={event => setAutoRead(event.target.checked)} aria-describedby={autoReadHintId} />
        <span>Tandai otomatis sebagai dibaca</span>
      </label>
      <p id={autoReadHintId} className="muted notification-auto-read-hint">Saat diaktifkan, notifikasi yang ada dan notifikasi baru ditandai sudah dibaca. Kamu tetap bisa menandainya belum dibaca secara manual.</p>
    </div>
    {storageError && <p className="notification-storage-error" role="status">{storageError}</p>}
    <div className="notification-toolbar">
      <div className="notification-filters" role="group" aria-label="Filter notifikasi">
        {filters.map(option => <button
          key={option.value}
          ref={filter === option.value ? activeFilterRef : null}
          type="button"
          className={`notification-filter${filter === option.value ? ' active' : ''}`}
          aria-pressed={filter === option.value}
          onClick={() => setFilter(option.value)}
        >{option.label} <span className="notification-count">{option.count}</span></button>)}
      </div>
      <button type="button" className="secondary-button notification-mark-all" disabled={!unread} onClick={() => {
        markRead();
        activeFilterRef.current?.focus();
      }}>Tandai semua dibaca</button>
    </div>
    <p className="muted notification-summary" role="status">{visibleNotifications.length} notifikasi · {filters.find(option => option.value === filter).label}</p>
    {visibleNotifications.length ? <div className="notifications-list">
      {visibleNotifications.map(item => <article key={item.id} className={`notification${item.read ? '' : ' unread'}`}>
        {item.type === 'error' ? <CircleAlert size={20} aria-hidden="true" /> : <CheckCircle2 size={20} aria-hidden="true" />}
        <div className="notification-content">
          <p className="notification-message">{item.message}</p>
          <small><time dateTime={new Date(item.createdAt).toISOString()}>{dateTime(item.createdAt)}</time> · {item.read ? 'Sudah dibaca' : 'Belum dibaca'}</small>
          <button type="button" className="secondary-button notification-read-toggle" onClick={() => toggleRead(item)}>{item.read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}</button>
        </div>
      </article>)}
    </div> : <div className="empty-state">
      <Bell size={38} strokeWidth={1} aria-hidden="true" />
      <h3>{notifications.length ? (filter === 'unread' ? 'Semua sudah dibaca.' : 'Belum ada yang dibaca.') : 'Masih tenang di sini.'}</h3>
      <p>{notifications.length ? 'Pilih filter Semua untuk melihat seluruh notifikasi.' : 'Belum ada notifikasi. Aktivitasmu akan muncul di sini.'}</p>
    </div>}
  </Modal>;
}
