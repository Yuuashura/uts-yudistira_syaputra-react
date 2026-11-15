# PRD — KopiKu

## 1. Identitas dan sumber acuan

- Pemilik proyek: **Yudistira Syaputra**.
- Nama folder dan nilai `name` pada package.json: **uts-yudistira_syaputra**.
- Nama aplikasi: **KopiKu**.
- Acuan utama: `../Ketentuan_UTS_KopiKu.pdf`, 3 halaman, UTS React Fundamental 2026.
- Acuan pembelajaran: `../MODUL PEMROGRAMAN REACT DASAR.docx`, pertemuan 1–7; pertemuan 8 adalah integrasi proyek UTS.
- Status: spesifikasi pra-implementasi. Dokumen ini tidak menyatakan aplikasi sudah dibuat atau diuji.
- Dokumen pendamping: [plan.md](plan.md) dan [design.md](design.md).

Jika modul dan PDF memiliki cakupan berbeda, ketentuan tugas pada PDF menjadi acuan proyek. Pencarian, sortir, Context, useReducer, dan custom hook tetap direncanakan karena tercantum dalam PDF, meskipun melampaui materi sebelum UTS.

## 2. Tujuan produk

Membangun aplikasi katalog dan pemesanan kedai kopi berbasis React: pengguna menemukan menu, melihat detail, memberi favorit dan ulasan, mengelola keranjang, menggunakan promo, serta menyelesaikan simulasi transaksi dengan struk dan riwayat.

Pengguna utama adalah pengunjung kedai; pengguna evaluasi adalah dosen/penguji yang memeriksa fungsi, struktur kode, tampilan, dan kepatuhan. Keberhasilan berarti seluruh kebutuhan wajib dapat didemonstrasikan dan build produksi berhasil, bukan sekadar tampilan statis.

## 3. Ruang lingkup

### Termasuk

- Seluruh fitur wajib versi KopiKu pada PDF.
- Dua nilai plus: penyimpanan lokal melalui custom hook dan tampilan responsif.
- Simulasi pembayaran di browser, tanpa akun dan backend.
- Data menu statis lokal, foto asli yang diunduh sebelum aplikasi dijalankan.

### Tidak termasuk

- Payment gateway, transfer uang nyata, autentikasi, dashboard admin, API menu eksternal saat runtime.
- Routing multipage, pengiriman, sinkronisasi perangkat, maupun sistem stok multiuser.
- Implementasi aplikasi pada tahap penulisan ketiga dokumen ini.

## 4. Ketentuan teknologi dan larangan

| Area | Keputusan sesuai PDF |
|---|---|
| Framework | React 19 dan React DOM 19, komponen fungsional |
| Tooling | Vite **5.x**, pnpm; versi patch dan plugin yang kompatibel diverifikasi saat setup |
| Bahasa | JavaScript / JSX |
| Styling | Seluruh CSS di `src/index.css`; tidak memakai Tailwind pada rancangan ini |
| Ikon | `lucide-react`, termasuk ikon tombol, bintang, notifikasi, dan navigasi |
| Struktur | Header, Footer, MainContent terpisah dalam `src/components` |
| Data | 15 menu, diteruskan ke kartu melalui props |
| Assets | 15 foto menu JPG lokal dalam `public/images` |
| State | CartContext berbasis useReducer + Context; ToastContext; NotificationContext |
| Persistensi | Custom hook `useLocalStorage` |
| Larangan | Bootstrap/framework CSS sejenis, alert(), prompt(), confirm(), emoji/kotak warna pengganti foto, API menu eksternal saat runtime |
| Eksekusi | `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm preview` |

Folder `../UTS_YUDISTIRA_SYAPUTRA` yang disebut dalam percakapan sebelumnya tidak ditemukan saat pemeriksaan akhir sesi dokumentasi. Tidak ada operasi pemindahan atau penghapusan proyek lama pada tugas ini. Proyek baru akan memakai Vite 5 sesuai PDF, bukan menyalin konfigurasi Vite 8 dari konteks sebelumnya.

## 5. Kebutuhan fungsional dan kriteria penerimaan

| ID | Prioritas | Kebutuhan | Kriteria penerimaan |
|---|---|---|---|
| FR-01 | Wajib | Struktur komponen | Header, Footer, MainContent berada di `src/components`; MainContent mengirim data ke MenuCard lewat props, bukan seluruh UI ditumpuk di App |
| FR-02 | Wajib | Data menu | Tepat 15 menu; tiap menu memiliki id, name, category, price, stock, image, description, rating; id unik |
| FR-03 | Wajib | Foto asli lokal | Setiap menu memiliki foto makanan/minuman relevan dari Unsplash/Wikimedia; 15 file JPG tersimpan lokal, tanpa ketergantungan URL foto runtime |
| FR-04 | Wajib | Kartu menu | Menampilkan nama, kategori, harga Rupiah, foto, deskripsi, stok, rating, dan empat tombol aksi |
| FR-05 | Wajib | Info | Tombol Info membuka popup detail: kategori, harga, stok, rating, deskripsi, dan ulasan; belum ada ulasan memiliki empty state |
| FR-06 | Wajib | Favorit | Heart menjadi merah saat aktif; menu masuk Favorit; klik ulang membatalkan; waktu penambahan disimpan untuk sortir |
| FR-07 | Wajib | Komentar | Popup berisi form rating integer 1–5 dan komentar minimal 5 karakter setelah trim, serta daftar ulasan; kiriman valid muncul teratas tanpa menutup popup |
| FR-08 | Wajib | Tambah keranjang | Klik Add menaikkan jumlah unit dan badge; qty per menu tidak boleh melampaui stok tersedia |
| FR-09 | Wajib | Pencarian/filter | Pencarian nama di Header; kategori Semua, Kopi, Non-Kopi, Makanan, Snack, Favorit beserta jumlah item; kombinasi pencarian dan kategori berjalan |
| FR-10 | Wajib | Sortir | Harga, rating, nama; tab Favorit juga memiliki Favorit terbaru dan Favorit terlama |
| FR-11 | Wajib | Notifikasi | Aksi favorit, komentar, keranjang, promo, pesanan, reset menghasilkan toast dan entri notifikasi; badge menghitung belum dibaca; daftar dibuka lewat popup |
| FR-12 | Wajib | Drawer keranjang | Tambah, kurang, hapus, batas stok, promo UTS25/HEMAT10/KOPI15, pajak 10%, ringkasan dan struk pembayaran |
| FR-13 | Wajib | Riwayat | Popup daftar transaksi terbayar, rincian dan total belanja; tombol reset stok + riwayat memakai konfirmasi modal kustom |
| FR-14 | Nilai plus | Penyimpanan lokal | Favorit, komentar, keranjang, notifikasi tetap tersedia setelah reload melalui useLocalStorage |
| FR-15 | Nilai plus | Responsif | Grid, toolbar, dialog, drawer tetap terbaca dan operabel di ponsel tanpa scroll horizontal halaman |
| FR-16 | Wajib | Build | Instalasi, development server, build, dan preview produksi berhasil; tidak ada referensi asset rusak |

## 6. Keputusan implementasi untuk bagian PDF yang belum rinci

Bagian ini adalah **asumsi desain proyek**, bukan kutipan ketentuan dosen. Semua nilai dibuat terpusat agar dapat diubah jika terdapat klarifikasi.

### 6.1 Promo dan pajak

- UTS25 = diskon 25%, HEMAT10 = 10%, KOPI15 = 15%.
- Ketiga promo berlaku atas subtotal seluruh item; tidak ditambahkan aturan khusus kategori kopi tanpa ketentuan tambahan.
- Satu promo per transaksi, tidak ditumpuk; tanpa minimum belanja atau batas nominal diskon pada rancangan awal.
- Normalisasi kode dengan trim dan huruf kapital. Kode tidak dikenal menampilkan error dan tidak mengubah promo valid yang sedang aktif.
- `subtotal = jumlah(price × quantity)`.
- `diskon = Math.round(subtotal × persentase)`; `dasarPajak = subtotal − diskon`.
- `pajak = Math.round(dasarPajak × 10%)`; `total = dasarPajak + pajak`.
- Seluruh perhitungan menggunakan bilangan Rupiah, tidak memakai string hasil format. Pajak setelah diskon merupakan asumsi eksplisit.
- Contoh uji: subtotal Rp100.000 + UTS25 → diskon Rp25.000, pajak Rp7.500, total Rp82.500.

### 6.2 Stok, checkout, dan reset

- `menu.stock` adalah stok awal. Saldo stok berjalan dikelola terpisah; tidak memutasi data katalog.
- Menambah keranjang belum mengurangi stok fisik. Qty keranjang dibatasi saldo stok; sisa yang dapat ditambah = saldo stok − qty dalam keranjang.
- Pembayaran simulasi berhasil mengurangi saldo stok, menyimpan snapshot transaksi, mengosongkan keranjang dan promo, lalu membuka struk.
- Checkout menolak keranjang kosong, qty tidak valid, atau stok tidak cukup; klik ganda tidak membuat pesanan duplikat.
- Struk berisi id transaksi, waktu, item, qty, harga saat pembelian, subtotal, kode promo, diskon, pajak, total, dan status Dibayar (simulasi).
- Tombol Bayar bukan pembayaran nyata. UI harus menyatakan simulasi.
- Reset stok + riwayat memulihkan stok awal dan menghapus riwayat; sekaligus mengosongkan keranjang/promo agar konsisten. Konfirmasi menjelaskan semua dampak ini sebelum dijalankan.
- Reset tidak menghapus favorit, komentar, atau notifikasi; menghasilkan notifikasi baru.
- Stok dan riwayat juga dipersist bersama keranjang sebagai perluasan desain, agar reload tidak menciptakan stok/transaksi yang tidak konsisten.

### 6.3 Ulasan dan rating

- Data awal memakai rating dalam menu.js; tidak mengarang ulasan pelanggan sebagai data nyata.
- Komentar adalah data terpisah dengan id, menuId, rating, text, createdAt.
- Jika belum ada komentar, tampilkan rating awal. Jika sudah ada, tampilkan rata-rata rating komentar lokal, satu desimal; jelaskan asal rating dalam popup.
- Validasi komentar kosong/pendek dan rating belum dipilih tidak menambah komentar.
- Sesudah berhasil, reset form, pertahankan popup terbuka, tampilkan komentar baru paling atas, toast, dan entri notifikasi.

### 6.4 Pencarian, kategori, sortir, dan badge

- Pencarian nama tidak sensitif huruf besar/kecil; spasi luar diabaikan.
- Count tab menghitung menu yang cocok dengan pencarian dalam tiap kategori; Favorit menghitung irisan hasil pencarian dan daftar favorit.
- Count adalah jumlah menu, bukan jumlah unit atau stok. Menu habis tetap tampil dengan status jelas.
- Sortir harga termurah/termahal, rating tertinggi, nama A–Z/Z–A; urutan stabil menggunakan id sebagai pembeda tambahan.
- Favorit terbaru menjadi default ketika memasuki Favorit; bila keluar dari Favorit, reset sortir khusus favorit ke urutan katalog.
- Hapus lalu favoritkan kembali menghasilkan waktu favorit baru.
- Badge keranjang adalah total unit seluruh item, bukan jumlah jenis menu.

### 6.5 Popup, toast, dan notifikasi

- Info, komentar, notifikasi, riwayat, struk dan konfirmasi memakai modal kustom; keranjang memakai drawer.
- Setiap aksi perubahan data (berhasil maupun ditolak) menghasilkan toast dan catatan notifikasi. Validasi form juga muncul dekat input.
- Pencarian/filter/sortir memberi feedback hasil; toast ringkas saat filter/sortir dipilih dan saat pencarian diselesaikan, bukan setiap karakter. Tidak memenuhi daftar notifikasi dengan tiap ketikan.
- Membuka/menutup UI bukan perubahan data: popup/drawer itu sendiri menjadi feedback, tidak menghasilkan notifikasi berulang.
- Saat popup notifikasi dibuka, entri yang saat itu ditampilkan ditandai terbaca. Entri baru sesudahnya tetap belum dibaca.
- Toast tidak mencuri fokus. Gunakan satu jalur pemberitahuan agar satu aksi tidak tercatat dua kali.

## 7. Data dan kepemilikan state

| Data | Bentuk inti | Pemilik / penyimpanan |
|---|---|---|
| Menu | id, name, category, price, stock, image, description, rating | `src/data/menu.js`, immutable; masuk kartu via props |
| Favorit | menuId, addedAt | state aplikasi + useLocalStorage |
| Komentar | id, menuId, rating, text, createdAt | state aplikasi + useLocalStorage |
| Keranjang | menuId, quantity | CartContext reducer |
| Stok | map menuId → remainingStock | CartContext reducer |
| Transaksi | id, createdAt, snapshot items, subtotal, discount, tax, total, promoCode | CartContext reducer |
| Notifikasi | id, type, message, createdAt, read | NotificationContext + useLocalStorage |
| Toast | id, type, message | ToastContext, sementara |
| UI | query, category, sort, activeOverlay, activeMenuId | state lokal, tidak wajib dipersist |

CartContext menyimpan keranjang, stok, transaksi, dan promo dalam satu objek berversi. Reducer harus murni: id/waktu dibuat sebelum dispatch; notifikasi dipicu dari handler setelah hasil aksi diketahui, bukan dari reducer. Persistensi melalui useLocalStorage menggunakan efek yang tidak memicu loop atau duplikasi toast.

Data localStorage yang rusak atau tidak sesuai versi ditangani dengan fallback aman; menuId yang tidak dikenal dibuang dan qty dinormalisasi terhadap stok. Jika storage tidak tersedia, aplikasi tetap bekerja selama sesi dan memberi feedback kegagalan persistensi. Sinkronisasi antar-tab tidak masuk lingkup.

## 8. Rencana katalog dan asset

Target distribusi: Kopi 5, Non-Kopi 4, Makanan 3, Snack 3 = 15 menu.

Nama rencana: Espresso, Americano, Cappuccino, Caffe Latte, Kopi Susu Gula Aren; Matcha Latte, Chocolate, Lemon Tea, Red Velvet; Nasi Goreng, Chicken Rice Bowl, Spaghetti; Croissant, French Fries, Chocolate Brownie.

Harga, stok, deskripsi, dan rating awal adalah data demo yang harus ditetapkan konsisten saat implementasi. Foto harus cocok dengan menu, bukan sekadar gambar kedai. Catat URL halaman sumber, pembuat, lisensi/atribusi setiap foto dalam `public/images/SOURCES.md`; memenuhi kewajiban lisensi masing-masing sumber. Tidak menggunakan gambar generatif atau placeholder sebagai hasil akhir.

## 9. Kualitas, aksesibilitas, dan evaluasi

- Bahasa antarmuka Indonesia; format Rupiah dan waktu Indonesia.
- Semua aksi tersedia lewat keyboard; icon-only button memiliki accessible name.
- Modal/drawer mengelola fokus, Escape, focus trap, pemulihan fokus, dan scroll lock.
- Label, status error, empty state, stok habis, dan batas qty eksplisit.
- Target viewport uji: 360, 390, 768, dan 1440 px; teks panjang tidak menutupi tombol.
- Konten komentar dirender sebagai teks, tidak melalui HTML mentah.
- Tidak menjanjikan kemampuan offline penuh; asset lokal mencegah ketergantungan hotlink ketika app disajikan server lokal.

| Aspek penilaian PDF | Bobot | Bukti yang disiapkan |
|---|---:|---|
| Struktur & komponen | 20% | File komponen terpisah dan aliran props |
| Fungsi wajib | 30% | Demo Info, Favorit, Komentar, Add |
| Popup & notifikasi | 20% | Modal/toast dan daftar notifikasi tanpa dialog browser |
| Keranjang & transaksi | 15% | Uji promo/pajak/stok, struk, riwayat/reset |
| Estetika & kerapian kode | 15% | Layout responsif, konsistensi visual, tanpa kode mati |

## 10. Definition of Done

Seluruh FR wajib lulus, kedua nilai plus selesai, 15 foto memiliki sumber yang tercatat, perhitungan dan reload telah diuji, larangan tidak ditemukan dalam implementasi, pnpm build berhasil, serta README mencatat cara menjalankan dan asumsi bisnis. Checklist pelaksanaan berada di plan.md; belum ada klaim selesai sebelum bukti tersedia.
