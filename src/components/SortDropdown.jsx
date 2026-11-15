import { useEffect, useId, useRef, useState } from 'react';
import { ArrowDownUp, ArrowDownWideNarrow, ArrowUpWideNarrow, Star, AArrowDown, AArrowUp, Clock, LayoutGrid, Check, ChevronDown } from 'lucide-react';

const options = [
  { value: 'default', label: 'Pilihan menu', detail: 'Urutan koleksi KopiKu', Icon: LayoutGrid },
  { value: 'price-asc', label: 'Harga termurah', detail: 'Mulai dari harga terendah', Icon: ArrowUpWideNarrow },
  { value: 'price-desc', label: 'Harga termahal', detail: 'Mulai dari harga tertinggi', Icon: ArrowDownWideNarrow },
  { value: 'rating', label: 'Rating tertinggi', detail: 'Temukan rasa paling disukai', Icon: Star },
  { value: 'name-asc', label: 'Nama A–Z', detail: 'Abjad dari awal', Icon: AArrowDown },
  { value: 'name-desc', label: 'Nama Z–A', detail: 'Abjad dari akhir', Icon: AArrowUp },
  { value: 'favorite-new', label: 'Favorit terbaru', detail: 'Yang terakhir kamu simpan', Icon: Clock, favorite: true },
  { value: 'favorite-old', label: 'Favorit terlama', detail: 'Yang pertama kamu simpan', Icon: Clock, favorite: true },
];

export default function SortDropdown({ value, onChange, favoritesOnly }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const id = useId();
  const available = options.filter(option => !option.favorite || favoritesOnly);
  const selected = available.find(option => option.value === value) || options[0];
  useEffect(() => {
    if (!open) return;
    const buttons = root.current.querySelectorAll('[role="menuitemradio"]');
    (root.current.querySelector('[aria-checked="true"]') || buttons[0])?.focus();
    const outside = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  function keys(event) {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.current.focus(); }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const buttons = [...root.current.querySelectorAll('[role="menuitemradio"]')];
      const current = buttons.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }
  }
  return <div className="sort-dropdown" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} className={`sort-trigger ${open ? 'is-open' : ''}`} aria-label={`Urutkan menu: ${selected.label}`} aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={() => setOpen(state => !state)} onKeyDown={event => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); setOpen(true); } }}><ArrowDownUp size={17} /><span>{selected.label}</span><ChevronDown className="sort-chevron" size={16} /></button>
    {open && <div className="sort-popover" id={id} role="menu" aria-label="Pilihan urutan menu" onKeyDown={keys}><div className="sort-caption">SUSUN JEDAMU</div>{available.map(({ value: key, label, detail, Icon }) => <button key={key} role="menuitemradio" aria-checked={key === value} onClick={() => { onChange(key); setOpen(false); trigger.current.focus(); }}><Icon size={18} /><span><b>{label}</b><small>{detail}</small></span>{key === value && <Check size={16} />}</button>)}</div>}
  </div>;
}
