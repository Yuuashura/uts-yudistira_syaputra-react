import { useState } from 'react';
import { Send } from 'lucide-react';
import Modal from './Modal';
import StarRating from './StarRating';
import ReviewList from './ReviewList';
export default function CommentModal({ item, reviews, onClose, onSubmit, onInvalid }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || text.trim().length < 5) {
      const message = 'Pilih rating 1–5 dan tulis komentar minimal 5 karakter.';
      setError(message); onInvalid(message); return;
    }
    onSubmit({ rating, text: text.trim() }); setText(''); setRating(0); setError('');
  }
  return <Modal title={`Ulasan ${item.name}`} onClose={onClose}><p className="muted">Bagaimana rasanya? Ceritamu membuat jeda berikutnya lebih berarti.</p><form className="review-form" onSubmit={submit} noValidate><StarRating value={rating} onChange={setRating} /><label htmlFor="review-text">Komentar</label><textarea id="review-text" value={text} onChange={event => setText(event.target.value)} maxLength={1000} rows={4} placeholder="Bagikan pendapatmu tentang menu ini…" aria-describedby="review-help review-error" aria-invalid={!!error} /><div className="input-help"><small id="review-help">Minimal 5 karakter</small><small>{text.length}/1000</small></div><p id="review-error" className="form-error" role={error ? 'alert' : undefined}>{error}</p><button className="primary-button full-width" type="submit"><Send size={17} />Kirim ulasan</button></form><ReviewList reviews={reviews} /></Modal>;
}
