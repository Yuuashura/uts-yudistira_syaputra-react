import { Heart, SearchX, ArrowUpRight, Coffee, CupSoda, Utensils, Cookie, LayoutGrid } from 'lucide-react';
import MenuCard from './MenuCard';
import SortDropdown from './SortDropdown';
const icons = { Semua: LayoutGrid, Kopi: Coffee, 'Non-Kopi': CupSoda, Makanan: Utensils, Snack: Cookie, Favorit: Heart };

export default function MainContent({ items, categories, counts, category, onCategory, sort, onSort, favorites, cart, onFavorite, open, add, resetFilters, applyOffer }) {
  return <main id="menu" className="main-content">
    <section className="intro" aria-labelledby="catalogue-heading"><div className="intro-copy"><span className="eyebrow">THE KOPIKU COLLECTION</span><h1 id="catalogue-heading" tabIndex={-1}>Sepenuh rasa,<br /><em>sesederhana jeda.</em></h1><p>Kopi yang menemani. Rasa yang dinikmati.<br />Temukan sesuatu yang pas untuk jedamu hari ini.</p></div><div className="intro-aside"><div className="coffee-seal"><Coffee size={29} strokeWidth={1} /><span>TAKE A SIP<br />TAKE A MOMENT</span></div><div className="offer"><span>SEDIKIT MANIS UNTUK JEDAMU</span><button onClick={applyOffer}>Diskon 25% dengan <b>UTS25</b><ArrowUpRight size={19} /></button><small>Berlaku pada subtotal · transaksi simulasi</small></div></div></section>
    <section className="catalogue" aria-label="Katalog menu"><div className="category-bar">{categories.map(name => { const Icon = icons[name]; return <button key={name} className={`category-button ${category === name ? 'active' : ''}`} aria-pressed={category === name} onClick={() => onCategory(name)}><Icon size={17} /><span>{name}</span><small>{counts[name]}</small></button>; })}</div>
    <div className="catalogue-toolbar"><p aria-live="polite"><b>{category === 'Semua' ? 'Menu pilihan' : category}</b><span>{items.length} menu untuk dinikmati</span></p><SortDropdown value={sort} onChange={onSort} favoritesOnly={category === 'Favorit'} /></div>
    {items.length ? <div className="menu-grid">{items.map((item, index) => <MenuCard key={item.id} item={item} index={index} favorite={favorites[item.id]} quantity={cart.find(line => line.menuId === item.id)?.quantity || 0} onFavorite={() => onFavorite(item)} onInfo={() => open('info', item)} onComment={() => open('comment', item)} onAdd={() => add(item)} />)}</div> : <div className="empty-state"><SearchX size={38} strokeWidth={1} /><h3>{category === 'Favorit' ? 'Favoritmu menunggu cerita.' : 'Rasa itu belum ditemukan.'}</h3><p>{category === 'Favorit' ? 'Ketuk hati pada menu yang ingin kamu nikmati lagi.' : 'Coba nama lain atau lihat kembali semua menu.'}</p><button className="primary-button" onClick={resetFilters}>Lihat semua menu</button></div>}
    <div className="catalogue-note"><Coffee size={18} /><p>Setiap jeda punya rasa. Terima kasih sudah memilih KopiKu.</p><span>MENU &amp; HARGA DEMO</span></div>
    </section>
  </main>;
}
