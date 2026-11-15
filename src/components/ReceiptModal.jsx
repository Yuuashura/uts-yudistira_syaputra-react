import { useEffect } from 'react';
import { CheckCircle2, Coffee, Printer } from 'lucide-react';
import Modal from './Modal';
import { Totals } from './CartDrawer';
import { dateTime } from './ReviewList';
import { money } from '../utils/pricing';
import { useToast } from '../context/ToastContext';

export default function ReceiptModal({ order, onClose }) {
  const { toast } = useToast();

  useEffect(() => {
    document.body.classList.add('printing-receipt');
    return () => document.body.classList.remove('printing-receipt');
  }, []);

  function printReceipt() {
    if (typeof window.print !== 'function') {
      toast('Fitur cetak tidak tersedia di browser ini. Coba gunakan browser lain.', 'error');
      return;
    }
    toast('Dialog cetak diminta. Pilih printer atau simpan struk sebagai PDF.', 'info');
    try {
      window.print();
    } catch {
      toast('Dialog cetak tidak dapat dibuka. Coba lagi melalui menu cetak browser.', 'error');
    }
  }

  return <Modal title="Struk pesanan" onClose={onClose}>
    <div className="receipt-document">
      <header className="receipt-brand"><Coffee size={30} strokeWidth={1} aria-hidden="true" /><h3>KopiKu.</h3><span>Terima kasih sudah berbagi jeda.</span></header>
      <div className="paid-label"><CheckCircle2 size={17} aria-hidden="true" />Dibayar (simulasi)</div>
      <div className="receipt-reference"><span>{order.id}</span><time dateTime={new Date(order.createdAt).toISOString()}>{dateTime(order.createdAt)}</time></div>
      <div className="receipt-items">{order.items.map(item => <div key={item.id}><span><b>{item.name}</b><small>{item.quantity} × {money(item.price)}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}</div>
      <Totals totals={order} />
      <p className="safe-note">Struk simulasi untuk proyek UTS. Bukan bukti pembayaran nyata.</p>
    </div>
    <div className="receipt-actions">
      <button type="button" className="secondary-button full-width" onClick={printReceipt}><Printer size={18} aria-hidden="true" />Cetak struk</button>
      <button type="button" className="primary-button full-width" onClick={onClose}>Kembali menikmati menu</button>
    </div>
  </Modal>;
}
