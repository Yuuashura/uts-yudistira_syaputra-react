import { RotateCcw } from 'lucide-react';
import Modal from './Modal';
export default function ConfirmModal({ onClose, onConfirm }) {
  return <Modal title="Mulai kembali?" onClose={onClose} destructive><div className="confirmation-copy"><RotateCcw size={34} strokeWidth={1} /><p>Stok kembali ke jumlah awal. Seluruh riwayat transaksi, isi keranjang, dan promo aktif akan dihapus.</p><p>Favorit, ulasan, dan notifikasi tetap disimpan. Tindakan ini tidak dapat dibatalkan.</p></div><div className="confirmation-actions"><button className="secondary-button" data-autofocus onClick={onClose}>Batal</button><button className="danger-button" onClick={onConfirm}>Ya, reset sekarang</button></div></Modal>;
}
