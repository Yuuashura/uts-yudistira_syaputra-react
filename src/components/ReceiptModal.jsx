import { CheckCircle2, Coffee } from 'lucide-react';
import Modal from './Modal';
import { Totals } from './CartDrawer';
import { dateTime } from './ReviewList';
import { money } from '../utils/pricing';
export default function ReceiptModal({ order, onClose }) {
  return <Modal title="Struk pesanan" onClose={onClose}><div className="receipt-brand"><Coffee size={30} strokeWidth={1} /><h3>KopiKu.</h3><span>Terima kasih sudah berbagi jeda.</span></div><div className="paid-label"><CheckCircle2 size={17} />Dibayar (simulasi)</div><div className="receipt-reference"><span>{order.id}</span><time>{dateTime(order.createdAt)}</time></div><div className="receipt-items">{order.items.map(item => <div key={item.id}><span><b>{item.name}</b><small>{item.quantity} × {money(item.price)}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}</div><Totals totals={order} /><p className="safe-note">Struk simulasi untuk proyek UTS. Bukan bukti pembayaran nyata.</p><button className="primary-button full-width" onClick={onClose}>Kembali menikmati menu</button></Modal>;
}
