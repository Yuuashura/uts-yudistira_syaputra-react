import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { menu, categories } from './data/menu';
import { useCart } from './context/CartContext';
import { useNotifications } from './context/NotificationContext';
import { useToast } from './context/ToastContext';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import InfoModal from './components/InfoModal';
import CommentModal from './components/CommentModal';
import CartDrawer from './components/CartDrawer';
import HistoryModal from './components/HistoryModal';
import ReceiptModal from './components/ReceiptModal';
import ConfirmModal from './components/ConfirmModal';
import NotificationsModal from './components/NotificationsModal';
import ToastViewport from './components/ToastViewport';

const menuIds = new Set(menu.map(item => item.id));
const validFavorites = value => value && !Array.isArray(value) && typeof value === 'object' && Object.entries(value).every(([id, time]) => menuIds.has(id) && Number.isFinite(time) && time > 0);
const validReviews = value => Array.isArray(value) && value.every(item => item && typeof item.id === 'string' && menuIds.has(item.menuId) && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5 && typeof item.text === 'string' && item.text.trim().length >= 5 && Number.isFinite(item.createdAt));

export default function App() {
  const cart = useCart();
  const { notify, unread, notifications, markRead, storageError: notificationError } = useNotifications();
  const { toast } = useToast();
  const [favorites, setFavorites, favoriteError] = useLocalStorage('kopiku.favorites', {}, validFavorites);
  const [reviews, setReviews, reviewError] = useLocalStorage('kopiku.reviews', [], validReviews);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [sort, setSort] = useState('default');
  const [overlay, setOverlay] = useState(null);
  const enriched = menu.map(item => {
    const comments = reviews.filter(review => review.menuId === item.id);
    return { ...item, stock: cart.state.stock[item.id], rating: comments.length ? comments.reduce((sum, review) => sum + review.rating, 0) / comments.length : item.rating };
  });
  const matches = enriched.filter(item => item.name.toLocaleLowerCase('id').includes(query.trim().toLocaleLowerCase('id')));
  const inCategory = (item, name) => name === 'Semua' || (name === 'Favorit' ? !!favorites[item.id] : item.category === name);
  const counts = Object.fromEntries(categories.map(name => [name, matches.filter(item => inCategory(item, name)).length]));
  const visible = matches.filter(item => inCategory(item, category));
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    'name-asc': (a, b) => a.name.localeCompare(b.name, 'id'),
    'name-desc': (a, b) => b.name.localeCompare(a.name, 'id'),
    'favorite-new': (a, b) => favorites[b.id] - favorites[a.id],
    'favorite-old': (a, b) => favorites[a.id] - favorites[b.id],
  };
  if (sorters[sort]) visible.sort((a, b) => sorters[sort](a, b) || a.id.localeCompare(b.id));
  const selected = enriched.find(item => item.id === overlay?.itemId);
  const selectedReviews = reviews.filter(review => review.menuId === selected?.id).sort((a, b) => b.createdAt - a.createdAt);
  function open(type, item) { if (type === 'notifications') markRead(); setOverlay({ type, itemId: item?.id }); }
  const close = () => setOverlay(null);
  function action(type, payload) { const result = cart.act(type, payload); notify(result.message, result.ok ? 'success' : 'error'); return result; }
  function favorite(item) {
    const active = !!favorites[item.id];
    const next = { ...favorites };
    if (active) delete next[item.id];
    else next[item.id] = Math.max(Date.now(), ...Object.values(favorites).map(time => time + 1));
    setFavorites(next); notify(`${item.name} ${active ? 'dihapus dari' : 'ditambahkan ke'} favorit.`);
  }
  function changeCategory(name) { setCategory(name); setSort(name === 'Favorit' ? 'favorite-new' : 'default'); toast(`Menampilkan ${name.toLowerCase()}.`, 'info'); }
  function checkout() { const result = action('CHECKOUT'); if (result.ok) setOverlay({ type: 'receipt', order: result.order }); }
  const storageError = favoriteError || reviewError || notificationError || cart.storageError;
  return <><a className="skip-link" href="#menu">Langsung ke menu</a><Header query={query} onQuery={setQuery} onSearch={message => toast(typeof message === 'string' ? message : `${visible.length} menu ditemukan.`, 'info')} unread={unread} count={cart.count} open={open} />
    {storageError && <div className="storage-warning" role="status"><CircleAlert size={18} /><span>Penyimpanan lokal bermasalah. Data yang tidak valid dipulihkan; perubahan mungkin hanya tersimpan selama sesi ini.</span></div>}
    <MainContent items={visible} categories={categories} counts={counts} category={category} onCategory={changeCategory} sort={sort} onSort={value => { setSort(value); toast('Urutan menu diperbarui.', 'info'); }} favorites={favorites} cart={cart.state.cart} onFavorite={favorite} open={open} add={item => action('ADD', { id: item.id })} resetFilters={() => { setQuery(''); changeCategory('Semua'); }} applyOffer={() => { action('PROMO', { code: 'UTS25' }); open('cart'); }} />
    <Footer />
    {overlay?.type === 'info' && selected && <InfoModal item={selected} reviews={selectedReviews} onClose={close} onComment={() => open('comment', selected)} />}
    {overlay?.type === 'comment' && selected && <CommentModal key={selected.id} item={selected} reviews={selectedReviews} onClose={close} onInvalid={message => notify(message, 'error')} onSubmit={review => { setReviews(items => [{ ...review, id: crypto.randomUUID(), menuId: selected.id, createdAt: Date.now() }, ...items]); notify(`Ulasan untuk ${selected.name} berhasil dikirim.`); }} />}
    {overlay?.type === 'cart' && <CartDrawer cart={cart} onClose={close} action={action} onCheckout={checkout} />}
    {overlay?.type === 'history' && <HistoryModal orders={cart.state.orders} onClose={close} onReceipt={order => setOverlay({ type: 'receipt', order })} onReset={() => open('confirm')} />}
    {overlay?.type === 'receipt' && <ReceiptModal order={overlay.order} onClose={close} />}
    {overlay?.type === 'confirm' && <ConfirmModal onClose={() => open('history')} onConfirm={() => { action('RESET'); open('history'); }} />}
    {overlay?.type === 'notifications' && <NotificationsModal notifications={notifications} onClose={close} />}
    <ToastViewport />
  </>;
}
