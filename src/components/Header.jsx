import { Coffee, Search, X, Bell, History, ShoppingBag } from 'lucide-react';

export default function Header({ query, onQuery, onSearch, unread, count, open }) {
  return <header className="site-header"><div className="header-inner">
    <a href="#menu" className="brand" aria-label="KopiKu, ke menu"><Coffee aria-hidden="true" /><span>KopiKu<span className="brand-dot">.</span><small>COFFEE & LITTLE MOMENTS</small></span></a>
    <form className="search-box" onSubmit={event => { event.preventDefault(); onSearch(); }} role="search"><Search size={19} aria-hidden="true" /><input aria-label="Cari menu" placeholder="Temukan rasa favoritmu…" value={query} onChange={event => onQuery(event.target.value)} />{query && <button type="button" aria-label="Hapus pencarian" onClick={() => { onQuery(''); onSearch('Pencarian dihapus.'); }}><X size={17} /></button>}</form>
    <nav className="header-actions" aria-label="Aktivitas"><button className="header-icon" aria-label={`Notifikasi, ${unread} belum dibaca`} onClick={() => open('notifications')}><Bell size={21} />{unread > 0 && <span className="badge">{unread > 99 ? '99+' : unread}</span>}</button><button className="header-icon" aria-label="Riwayat transaksi" onClick={() => open('history')}><History size={21} /></button><span className="nav-divider" /><button className="cart-button" aria-label={`Keranjang, ${count} item`} onClick={() => open('cart')}><ShoppingBag size={19} /><span>Keranjang</span><b>{count}</b></button></nav>
  </div></header>;
}
