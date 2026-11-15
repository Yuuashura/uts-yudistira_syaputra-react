import { ArrowUpRight, Coffee } from 'lucide-react';

export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-brand-block">
        <a className="footer-brand" href="#menu"><Coffee size={24} aria-hidden="true" />KopiKu.</a>
        <p className="footer-tagline">Sepenuh rasa, sesederhana jeda.</p>
      </div>
      <div className="footer-meta">
        <div className="footer-credit">
          <span className="footer-label">Proyek UTS</span>
          <p>React Fundamental 2026</p>
          <strong>Yudistira Syaputra</strong>
        </div>
        <div className="footer-note">
          <span className="footer-label">Catatan</span>
          <p>Transaksi simulasi, tanpa pembayaran nyata.</p>
          <a href="/images/SOURCES.md" target="_blank" rel="noreferrer">Sumber fotografi<ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 KopiKu · proyek akademik</span>
      <span>Dibangun dengan React 19, Vite, dan lucide-react</span>
    </div>
  </footer>;
}
