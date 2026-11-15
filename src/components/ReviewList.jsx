import { MessageCircle, Star } from 'lucide-react';
export const dateTime = timestamp => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));
export default function ReviewList({ reviews }) {
  return <section className="reviews"><h3>Ulasan <span>({reviews.length})</span></h3>{reviews.length ? reviews.map(review => <article className="review" key={review.id}><div><strong>Pengunjung lokal</strong><span className="rating"><Star size={14} fill="currentColor" />{review.rating}</span></div><p>{review.text}</p><small>{dateTime(review.createdAt)}</small></article>) : <div className="inline-empty"><MessageCircle size={24} /><p>Belum ada ulasan untuk menu ini.<br />Jadilah yang pertama berbagi rasa.</p></div>}</section>;
}
