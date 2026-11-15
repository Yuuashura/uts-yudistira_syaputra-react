# KopiKu — UTS React Fundamental

Proyek UTS atas nama **Yudistira Syaputra**. Aplikasi katalog kedai kopi dengan pencarian, favorit, ulasan, keranjang berbatas stok, promo, pajak, struk, dan riwayat transaksi. Seluruh transaksi adalah **simulasi**: tidak ada pembayaran nyata, backend, atau data pelanggan yang dikirim ke mana pun.

## Menjalankan

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5180
pnpm build
pnpm preview    # http://127.0.0.1:5181
pnpm test       # 18 uji logika (node:test)
pnpm test:e2e   # 8 skenario Playwright
```

Butuh Node 20+ dan pnpm. Port 5180/5181 dipakai agar tidak bertabrakan dengan proyek lain di 5173; `strictPort` membuat kegagalan port terlihat jelas.

## Versi

| Paket | Versi |
|---|---|
| react / react-dom | 19.3.1 |
| vite | 5.4.21 |
| @vitejs/plugin-react | 4.7.0 |
| lucide-react | 0.468.0 |
| @playwright/test | 1.58.x |

Lockfile `pnpm-lock.yaml` disertakan agar instalasi dapat direproduksi.

## Struktur

```
src/
├── components/   Header, Footer, MainContent, MenuCard, Modal, InfoModal,
│                 CommentModal, CartDrawer, HistoryModal, ReceiptModal,
│                 ConfirmModal, NotificationsModal, StarRating,
│                 ReviewList, ToastViewport
├── context/      CartContext (useReducer), ToastContext, NotificationContext
├── hooks/        useLocalStorage (envelope berversi + validasi + fallback)
├── utils/        pricing.js, cartReducer.js (murni, dapat diuji terpisah)
├── data/menu.js  15 menu: 5 Kopi, 4 Non-Kopi, 3 Makanan, 3 Snack
├── App.jsx       orkestrasi filter, sortir, favorit, ulasan, overlay
├── index.css     seluruh styling aplikasi
└── main.jsx
public/images/    15 JPG lokal + SOURCES.md
```

Tidak ada CSS framework, CDN, font online, ikon manual, atau API menu runtime. Seluruh ikon memakai `lucide-react`, seluruh gaya berada di `src/index.css`, dan semua foto disajikan dari `public/images`.

## Fitur

- **Katalog & pencarian** — 15 menu, pencarian nama tanpa sensitif kapital/spasi luar, count per kategori mengikuti hasil pencarian, empty state dengan reset.
- **Sortir** — harga naik/turun, rating, nama A–Z/Z–A, serta favorit terbaru/terlama khusus tab Favorit.
- **Popup info** — detail lengkap, stok, rating, dan daftar ulasan lokal.
- **Favorit** — hati merah, tersimpan di perangkat, timestamp untuk urutan terbaru/terlama.
- **Ulasan** — rating 1–5 wajib, komentar minimal 5 karakter setelah trim; kiriman valid langsung tampil tanpa menutup popup; rating kartu memakai rata-rata ulasan lokal bila ada.
- **Keranjang** — stepper, hapus, badge jumlah unit, pembatasan jumlah sesuai stok, empty state.
- **Promo & pajak** — satu promo aktif, rincian subtotal/diskon/pajak/total.
- **Checkout simulasi** — stok berkurang, struk snapshot immutable, keranjang dan promo kosong, pembayaran ganda dicegah.
- **Riwayat & reset** — daftar transaksi, buka struk lama, total belanja; reset memulihkan stok dan menghapus riwayat/keranjang/promo, tetapi mempertahankan favorit, ulasan, dan notifikasi.
- **Feedback terpusat** — toast dan riwayat notifikasi dengan badge belum dibaca; membuka daftar menandai entri yang tampil terbaca.
- **Persistensi** — snapshot keranjang/stok/order/promo berversi, divalidasi dalam-dalam; data rusak dipulihkan tanpa crash dan pengguna diberi tahu.
- **Aksesibilitas** — modal dengan focus trap, Escape, focus restore, scroll lock, skip link, label ARIA, dan `prefers-reduced-motion`.

## Asumsi promo, pajak, dan rating

PDF tidak merinci aturan promo/pajak, sehingga ditetapkan sebagai berikut dan dipakai konsisten di kode, uji, dan UI:

| Aturan | Nilai |
|---|---|
| Kode promo | `UTS25` = 25%, `HEMAT10` = 10%, `KOPI15` = 15% |
| Jumlah promo aktif | satu per transaksi |
| Batas minimum / maksimum diskon | tidak ada |
| Urutan perhitungan | diskon dari subtotal, pajak 10% dari (subtotal − diskon) |
| Pembulatan | diskon dan pajak dibulatkan ke Rupiah utuh, terpisah |
| Contoh | subtotal Rp100.000 + UTS25 → diskon Rp25.000, pajak Rp7.500, total Rp82.500 |

Rating awal pada `data/menu.js` adalah **data demo**, bukan ulasan pelanggan. Begitu ada ulasan lokal untuk sebuah menu, rating menu tersebut menjadi rata-rata ulasan lokal.

Penambahan ke keranjang tidak memesan stok; stok baru berkurang saat checkout berhasil.

## Pengujian

- `pnpm test` — 18 uji `node:test`: format Rupiah, promo/normalisasi, contoh Rp100.000, pembulatan Rp10.001, penolakan input tidak aman, transisi keranjang immutable, batas stok, checkout ganda, restore snapshot rusak, kegagalan storage.
- `pnpm test:e2e` — 8 skenario Playwright: katalog/foto lokal/nol request eksternal, pencarian + count + favorit + sortir, info + validasi + kirim ulasan, keranjang + promo + struk + riwayat + reset, stok tersisa satu, reload, notifikasi terbaca, layout mobile 390 px.
- `pnpm build` dan `pnpm preview` diverifikasi; aset lokal termuat dan console bersih.

Playwright memakai Chromium dari Nix store pada `playwright.config.js` karena browser unduhan gagal di lingkungan ini (library sistem tidak lengkap). Di mesin lain, ganti dengan `executablePath` milik sendiri atau hapus baris tersebut setelah `npx playwright install chromium`.

## Sumber foto — batas yang jujur

15 foto di `public/images` adalah foto asli yang diunduh dari CDN Unsplash; tidak ada gambar hasil generasi. Kecocokan isi foto dengan nama menu sudah diperiksa lewat contact sheet. Namun halaman pembuat dan halaman lisensi individual menolak akses saat pengunduhan (HTTP 429/401), sehingga nama fotografer dan lisensi spesifik dicatat **`unknown`** di `public/images/SOURCES.md` — tidak ditebak. Periksa dan lengkapi atribusi sebelum distribusi komersial.

## Catatan

- Tidak memakai `alert()`, `prompt()`, atau `confirm()`; semua dialog adalah komponen React.
- Tidak ada backend, autentikasi, atau penyimpanan jaringan. Semua data tersimpan di `localStorage` perangkat.
- Proyek ini dibuat untuk penilaian UTS, bukan untuk operasional kedai nyata.
