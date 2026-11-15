import { ReceiptText, ArrowUpRight, RotateCcw } from 'lucide-react';
import Modal from './Modal';
import { money } from '../utils/pricing';
import { dateTime } from './ReviewList';
export default function HistoryModal({ orders, onClose, onReceipt, onReset }) {
  return <Modal title="Riwayat transaksi" onClose={onClose}><div className="history-summary"><span>Total belanja · {orders.length} transaksi</span><strong>{money(orders.reduce((sum, order) => sum + order.total, 0))}</strong><small>Seluruh transaksi adalah simulasi.</small></div>{orders.length ? <div className="history-list">{orders.map(order => <button key={order.id} className="history-order" onClick={() => onReceipt(order)}><ReceiptText size={23} /><span><b>{order.id}</b><small>{dateTime(order.createdAt)} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} item</small></span><strong>{money(order.total)}</strong><ArrowUpRight size={18} /></button>)}</div> : <div className="inline-empty"><ReceiptText size={28} /><p>Belum ada transaksi.<br />Pesanan yang dibayar akan tersimpan di sini.</p></div>}<button className="danger-button full-width" onClick={onReset}><RotateCcw size={17} />Reset stok + riwayat</button></Modal>;
}
