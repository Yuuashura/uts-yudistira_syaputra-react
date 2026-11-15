import { Star } from 'lucide-react';
export default function StarRating({ value, onChange }) {
  return <fieldset className="star-field"><legend>Rating kamu</legend><div className="star-options">{[1, 2, 3, 4, 5].map(star => <label key={star} className={star <= value ? 'selected' : ''}><input type="radio" name="rating" value={star} checked={value === star} onChange={() => onChange(star)} aria-label={`${star} bintang`} /><Star size={29} fill={star <= value ? 'currentColor' : 'none'} aria-hidden="true" /></label>)}<span>{value ? `${value} dari 5` : 'Pilih bintang'}</span></div></fieldset>;
}
