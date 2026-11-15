import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ title, children, onClose, drawer = false, destructive = false }) {
  const panelRef = useRef(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const panel = panelRef.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const initial = panel.querySelector('[data-autofocus]') || panel.querySelector(FOCUSABLE);
    initial?.focus();
    function onKeyDown(event) {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...panel.querySelectorAll(FOCUSABLE)].filter(element => element.offsetParent !== null);
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return createPortal(<div className={`modal-layer ${drawer ? 'is-drawer' : ''}`} onMouseDown={event => { if (!destructive && event.target === event.currentTarget) onClose(); }}>
    <div ref={panelRef} className={`modal ${drawer ? 'drawer' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="modal-heading"><div><span className="eyebrow">KOPIKU / YOUR LITTLE PAUSE</span><h2 id={titleId}>{title}</h2></div><button className="icon-button close-button" aria-label="Tutup dialog" onClick={onClose}><X /></button></div>
      <div className="modal-body">{children}</div>
    </div>
  </div>, document.body);
}
