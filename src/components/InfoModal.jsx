import { Star, MessageCircle } from 'lucide-react';
import Modal from './Modal';
import ReviewList from './ReviewList';
import { money } from '../utils/pricing';
export default function InfoModal({ item, reviews, onClose, onComment }) {
  return <Modal title={item.name} onClose={onClose}><img className="detail-photo" src={item.image} alt={item.name} /><div className="detail-meta"><span>{item.category}</span><span className="rating"><Star size={16} fill="currentColor" />{item.rating.toFixed(1)}</span></div><p className="detail-description">{item.description}</p><div className="detail-price"><strong>{money(item.price)}</strong><span>{item.stock ? `Stok tersedia: ${item.stock}` : 'Stok habis'}</span></div><p className="help-text">{reviews.length ? 'Rating berdasarkan ulasan lokal di perangkat ini.' : 'Rating awal merupakan data demo. Belum ada ulasan lokal.'}</p><button className="secondary-button full-width" onClick={onComment}><MessageCircle size={18} />Tulis ulasan</button><ReviewList reviews={reviews} /></Modal>;
}
