import { useState } from 'react';
import { Heart, Info, MessageCircle, Plus, Star } from 'lucide-react';
import { money } from '../utils/pricing';

export default function MenuCard({ item, index, favorite, quantity, onFavorite, onInfo, onComment, onAdd }) {
  const [imageFailed, setImageFailed] = useState(false);
  const limit = quantity >= item.stock;
  return <article className="menu-card" aria-label={item.name}>
    <div className="menu-photo">{imageFailed ? <div className="photo-error" role="img" aria-label={`Foto ${item.name} tidak dapat dimuat`}><span>Foto menu<br />belum tersedia</span></div> : <img src={item.image} alt={item.name} width="640" height="480" loading={index < 4 ? 'eager' : 'lazy'} onError={() => setImageFailed(true)} />}<span className="photo-category">{item.category}</span><button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} aria-label={`Favorit ${item.name}`} aria-pressed={!!favorite} onClick={onFavorite}><Heart size={19} fill={favorite ? 'currentColor' : 'none'} /></button></div>
    <div className="menu-card-body"><div className="menu-meta"><span>{item.stock ? `Tersedia ${item.stock}` : 'Stok habis'}</span><span className="rating"><Star size={14} fill="currentColor" />{item.rating.toFixed(1)}</span></div><h3>{item.name}</h3><p className="menu-description">{item.description}</p><div className="price-line"><strong>{money(item.price)}</strong><span>/ porsi</span></div>
    <div className="card-actions"><button className="icon-button" aria-label={`Info ${item.name}`} title="Lihat detail" onClick={onInfo}><Info size={19} /></button><button className="icon-button" aria-label={`Komentar ${item.name}`} title="Tulis ulasan" onClick={onComment}><MessageCircle size={19} /></button><button className="add-button" disabled={limit} onClick={onAdd} aria-label={`Tambah ${item.name}`}><Plus size={17} />{item.stock === 0 ? 'Habis' : limit ? 'Batas stok' : 'Tambah'}{quantity > 0 && <span className="quantity-chip">{quantity}</span>}</button></div></div>
  </article>;
}
