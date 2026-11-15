import { useRef, useState } from 'react';
import { Coffee, Search, X, Bell, History, ShoppingBag, ArrowUpRight, ReceiptText, CheckCircle2 } from 'lucide-react';
import { money } from '../utils/pricing';
import { dateTime } from './ReviewList';

export default function Header({ query, onQuery, onSearch, unread, count, open, notifications = [], orders = [] }) {
  const [preview, setPreview] = useState(null);
  const suppressed = useRef(false);
  function reveal(type) { if (!suppressed.current) setPreview(type); }
  function leave(event) { if (!event.currentTarget.contains(document.activeElement)) { setPreview(null); suppressed.current = false; } }
  function show(type) { setPreview(null); suppressed.current = true; open(type); }
  function previewPanel(type) {
    if (preview !== type) return null;
    const isNotice = type === 'notifications';
    const entries = isNotice ? notifications.slice(0, 3) : orders.slice(0, 3);
    return <section className="header-preview" aria-label={isNotice ? 'Preview notifikasi' : 'Preview riwayat'}>
      <div className="preview-heading"><strong>{isNotice ? 'Kabar jedamu' : 'Pesanan terakhir'}</strong><span>{isNotice ? `${unread} belum dibaca` : `${orders.length} transaksi`}</span></div>
      {entries.length ? <ul>{entries.map(item => <li key={item.id}>{isNotice ? <Bell size={16} /> : <ReceiptText size={16} />}<div><p>{isNotice ? item.message : item.items.map(line => `${line.quantity}× ${line.name}`).join(', ')}</p><small>{dateTime(item.createdAt)}</small>{isNotice ? <span className="preview-status">{item.read ? 'Sudah dibaca' : 'Belum dibaca'}</span> : <b>{money(item.total)}</b>}</div></li>)}</ul> : <div className="preview-empty"><Coffee size={25} /><p>{isNotice ? 'Belum ada kabar baru.' : 'Pesanan pertamamu menunggu.'}</p></div>}
      <button className="preview-link" onClick={() => show(type)}>Lihat semua {isNotice ? 'notifikasi' : 'transaksi'}<ArrowUpRight size={16} /></button>
    </section>;
  }
  return <header className="site-header"><div className="header-inner">
    <a href="#menu" className="brand" aria-label="KopiKu, ke menu"><Coffee aria-hidden="true" /><span>KopiKu<span className="brand-dot">.</span><small>COFFEE & LITTLE MOMENTS</small></span></a>
    <form className="search-box" onSubmit={event => { event.preventDefault(); onSearch(); }} role="search"><Search size={19} aria-hidden="true" /><input aria-label="Cari menu" placeholder="Temukan rasa favoritmu…" value={query} onChange={event => onQuery(event.target.value)} />{query ? <button type="button" aria-label="Hapus pencarian" onClick={() => { onQuery(''); onSearch('Pencarian dihapus.'); }}><X size={17} /></button> : <span className="search-accent" aria-hidden="true">15 rasa</span>}</form>
    <nav className="header-actions" aria-label="Aktivitas" onKeyDown={event => { if (event.key === 'Escape') { setPreview(null); suppressed.current = true; } }}>
      {['notifications', 'history'].map(type => <div key={type} className="header-preview-anchor" onPointerEnter={event => { if (event.pointerType === 'mouse') reveal(type); }} onPointerLeave={leave} onFocus={() => reveal(type)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setPreview(null); suppressed.current = false; } }}>
        <button className={`header-icon ${type === 'notifications' && unread > 0 ? 'has-notifications' : ''}`} aria-label={type === 'notifications' ? `Notifikasi, ${unread} belum dibaca` : 'Riwayat transaksi'} onClick={() => show(type)}>{type === 'notifications' ? <Bell size={21} /> : <History size={21} />}{type === 'notifications' && unread > 0 && <span className="badge" key={unread} aria-label={`${unread} notifikasi belum dibaca`}>{unread > 99 ? '99+' : unread}</span>}</button>
        {previewPanel(type)}
      </div>)}
      <span className="nav-divider" /><button className="cart-button" aria-label={`Keranjang, ${count} item`} onClick={() => show('cart')}><ShoppingBag size={19} /><span>Keranjang</span><b key={count}>{count}</b></button>
    </nav>
  </div><div className="header-thread" aria-hidden="true"><span /><CheckCircle2 size={11} /><span /></div></header>;
}
