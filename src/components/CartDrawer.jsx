import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X, ShieldCheck } from 'lucide-react';
import Modal from './Modal';
import { money } from '../utils/pricing';
export function Totals({ totals }) {
  return <dl className="totals"><div><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div><div><dt>Diskon {totals.promoCode && <span>({totals.promoCode})</span>}</dt><dd>−{money(totals.discount)}</dd></div><div><dt>Pajak 10%</dt><dd>{money(totals.tax)}</dd></div><div className="grand-total"><dt>Total</dt><dd>{money(totals.total)}</dd></div></dl>;
}
export default function CartDrawer({ cart, onClose, action, onCheckout }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [motion, setMotion] = useState(null);
  const pending = useRef(new Set());
  const timers = useRef(new Set());
  useEffect(() => () => timers.current.forEach(timer => clearTimeout(timer)), []);
  function animate(id, kind) {
    setMotion({ id, kind, token: Date.now() });
    const timer = setTimeout(() => {
      setMotion(current => current?.id === id ? null : current);
      timers.current.delete(timer);
    }, kind === 'out' ? 280 : 520);
    timers.current.add(timer);
  }
  function changeQuantity(item, type) {
    if (pending.current.has(item.id)) return;
    if (type === 'ADD') {
      const result = action('ADD', { id: item.id });
      if (result.ok) animate(item.id, 'in');
      return;
    }
    pending.current.add(item.id);
    animate(item.id, 'out');
    const timer = setTimeout(() => {
      action(type, { id: item.id });
      pending.current.delete(item.id);
      timers.current.delete(timer);
    }, 180);
    timers.current.add(timer);
  }
  function removeItem(item) {
    if (pending.current.has(item.id)) return;
    pending.current.add(item.id);
    animate(item.id, 'out');
    const timer = setTimeout(() => {
      action('REMOVE', { id: item.id });
      pending.current.delete(item.id);
      timers.current.delete(timer);
    }, 180);
    timers.current.add(timer);
  }
  function apply(event) { event.preventDefault(); const result = action('PROMO', { code }); setError(result.ok ? '' : result.message); if (result.ok) setCode(''); }
  return <Modal title="Keranjangmu" drawer onClose={onClose}>{cart.items.length ? <><p className="cart-caption">{cart.count} pilihan untuk jeda yang lebih nikmat.</p><div className="cart-items">{cart.items.map(item => { const isPending = pending.current.has(item.id); const currentMotion = motion?.id === item.id ? motion.kind : ''; return <article className={`cart-item ${currentMotion ? `is-${currentMotion}` : ''}`} key={item.id}><img src={item.image} alt={item.name} width="76" height="80" /><div className="cart-item-content"><h3>{item.name}</h3><p>{money(item.price)}</p><div className="cart-item-bottom"><div className="stepper"><button aria-label={`Kurangi ${item.name}`} disabled={isPending} onClick={() => changeQuantity(item, 'DECREMENT')}><Minus size={15} /></button><span aria-label={`Jumlah ${item.name}`}>{item.quantity}</span><button aria-label={`Tambah jumlah ${item.name}`} disabled={isPending || item.quantity >= cart.state.stock[item.id]} onClick={() => changeQuantity(item, 'ADD')}><Plus size={15} /></button></div><button className="icon-button remove-button" aria-label={`Hapus ${item.name}`} disabled={isPending} onClick={() => removeItem(item)}><Trash2 size={17} /></button><strong>{money(item.price * item.quantity)}</strong></div></div></article>; })}</div><div className="promo-section"><label htmlFor="promo-code"><Tag size={17} />Punya kode promo?</label><form className="promo-form" onSubmit={apply}><input id="promo-code" placeholder="Masukkan kode" value={code} onChange={event => setCode(event.target.value)} aria-invalid={!!error} aria-describedby="promo-error" /><button className="secondary-button" type="submit">Terapkan</button></form><small>UTS25 · HEMAT10 · KOPI15</small><p className="form-error" id="promo-error">{error}</p>{cart.state.promoCode && <div className="active-promo"><Tag size={16} /><span>{cart.state.promoCode} diterapkan</span><button className="icon-button" aria-label="Hapus promo" onClick={() => { action('CLEAR_PROMO'); setError(''); }}><X size={16} /></button></div>}</div><div className="checkout-section"><Totals totals={cart.totals} /><button className="primary-button full-width" onClick={onCheckout}>Bayar (simulasi)<ArrowRight size={19} /></button><p className="safe-note"><ShieldCheck size={15} />Tidak ada uang yang ditagihkan.</p></div></> : <div className="empty-state"><ShoppingBag size={42} strokeWidth={1} /><h3>Jeda yang nikmat<br />dimulai dari satu pilihan.</h3><p>Keranjangmu masih kosong.</p><button className="primary-button" onClick={onClose}>Lihat menu<ArrowRight size={17} /></button></div>}</Modal>;
}
