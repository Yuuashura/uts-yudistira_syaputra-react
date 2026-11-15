# Implementation Plan — KopiKu

## 1. Identitas dan batas pekerjaan

- Pemilik: **Yudistira Syaputra**.
- Root proyek: `UTS_YUDIS/uts-yudistira_syaputra/`.
- Nama package yang direncanakan: `uts-yudistira_syaputra` — mengikuti format `uts-namaKalian`.
- Acuan: `../Ketentuan_UTS_KopiKu.pdf` → [prd.md](prd.md) → [design.md](design.md).
- Status saat dokumen dibuat: **perencanaan selesai ditulis, implementasi belum dimulai**.
- Status per 15 November 2026: **delapan tahap selesai dieksekusi**; bukti perintah ada di bagian 8.
- Legenda: `[x]` selesai dan diverifikasi; `[~]` selesai dengan batas yang dicatat.
- Tidak ada operasi pemindahan, penghapusan, atau penimpaan proyek lama pada tugas ini. Folder `../UTS_YUDISTIRA_SYAPUTRA/` dari konteks sebelumnya tidak ditemukan saat pemeriksaan akhir; jangan mengasumsikan folder itu tersedia untuk disalin.

Ketiga dokumen ini adalah keluaran tahap sekarang. Semua checkbox implementasi dibiarkan belum selesai sampai ada bukti. Asumsi promo, pajak, stok, rating, reset, dan feedback mengikuti PRD, bukan diklaim sebagai aturan rinci dari PDF.

## 2. Target struktur akhir

Struktur di bawah adalah target implementasi; file sumber belum dibuat pada tahap dokumentasi.

    uts-yudistira_syaputra/
    ├── plan.md
    ├── design.md
    ├── prd.md
    ├── README.md
    ├── package.json
    ├── pnpm-lock.yaml
    ├── index.html
    ├── vite.config.js
    ├── .gitignore
    ├── public/
    │   └── images/
    │       ├── SOURCES.md
    │       └── 15 foto menu .jpg
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── MainContent.jsx
    │   │   ├── MenuCard.jsx
    │   │   ├── Modal.jsx
    │   │   ├── InfoModal.jsx
    │   │   ├── CommentModal.jsx
    │   │   ├── CartDrawer.jsx
    │   │   ├── HistoryModal.jsx
    │   │   ├── ReceiptModal.jsx
    │   │   ├── ConfirmModal.jsx
    │   │   ├── NotificationsModal.jsx
    │   │   ├── StarRating.jsx
    │   │   └── ToastViewport.jsx
    │   ├── context/
    │   │   ├── CartContext.jsx
    │   │   ├── ToastContext.jsx
    │   │   └── NotificationContext.jsx
    │   ├── hooks/useLocalStorage.js
    │   ├── data/menu.js
    │   ├── utils/pricing.js
    │   ├── index.css
    │   ├── App.jsx
    │   └── main.jsx
    └── tests/
        └── pricing dan state sesuai test runner yang dipilih

Tidak membuat folder kosong hanya untuk tampilan struktur; direktori pendukung dibuat saat implementasinya dibutuhkan. Seluruh CSS tetap dalam index.css, bukan file per komponen.

## 3. Urutan pelaksanaan dan gerbang selesai

### Tahap 1 — Setup yang patuh PDF

- [x] Verifikasi dokumentasi dan kompatibilitas React 19, Vite 5.x, plugin React, Node, pnpm, lucide-react sebelum menentukan versi patch.
- [x] Siapkan proyek baru menggunakan pnpm dan Vite 5; jangan memakai generator terbaru tanpa mengunci mayor Vite.
- [x] Karena root sudah berisi dokumen, gunakan staging atau setup yang tidak menghapus ketiga dokumen.
- [x] Set package name `uts-yudistira_syaputra`, title KopiKu, lang=id, viewport mobile.
- [x] Instal react, react-dom, lucide-react dan dependency development yang diperlukan saja; simpan pnpm-lock.yaml.
- [x] Hapus template Vite yang tidak diperlukan di proyek baru saja; jangan menyalin node_modules/.git proyek lama.
- [x] Pastikan script dev, build, preview; tambah script uji/lint bila tooling dipasang.
- [x] Catat dependency versi dan hasil development/build awal.

**Gate:** proyek minimal berjalan dan build berhasil; tidak ada perubahan pada proyek lama.

### Tahap 2 — Data katalog dan 15 foto asli

- [x] Tetapkan 15 menu (5 Kopi, 4 Non-Kopi, 3 Makanan, 3 Snack) sesuai PRD.
- [x] Isi persis 8 properti dasar tiap menu dengan id unik, harga numerik positif, stok integer nonnegatif, rating 1–5.
- [~] Unduh 15 foto relevan dari Unsplash; kecocokan isi foto diverifikasi lewat contact sheet. Halaman lisensi/pembuat menolak akses (HTTP 429/401), sehingga atribusi individual dicatat `unknown` di SOURCES.md, bukan dikarang.
- [x] Simpan JPG teroptimasi di public/images, gunakan path lokal `/images/nama-menu.jpg`.
- [x] Catat sumber dalam SOURCES.md. Periksa file benar-benar gambar, bukan halaman error dari URL unduhan.
- [x] Validasi semua foto bisa ditampilkan dan tidak ada hotlink/API menu runtime.

**Gate:** 15 data dan 15 foto lengkap, tidak ada emoji/kotak warna sebagai pengganti foto hasil akhir.

### Tahap 3 — Logika harga, stok, dan persistensi

- [x] Implementasikan pricing.js: normalisasi promo, subtotal, diskon, pajak, total, format Rupiah.
- [x] Pusatkan UTS25=25%, HEMAT10=10%, KOPI15=15%, satu promo, pajak setelah diskon; tandai sebagai asumsi pada README.
- [x] Tulis useLocalStorage dengan initial value, lazy read, persist update, versi schema, validasi, dan fallback saat JSON/storage gagal.
- [x] Implementasikan CartContext dengan reducer murni untuk add, increment, decrement, remove, apply/remove promo, checkout, reset.
- [x] Kelola cart, stok, orders, promo sebagai snapshot terpadu agar persistensi konsisten.
- [x] Validasi stok saat add dan checkout; checkout kosong/stok kurang ditolak, pembayaran ganda dicegah.
- [x] Simpan receipt snapshot agar riwayat tidak berubah ketika harga/katalog kemudian berubah.
- [x] Uji harga, rounding, transisi stok, restore data, dan reset sebelum membangun UI kompleks.

**Gate:** perhitungan bisa diuji terpisah dari UI; tidak ada saldo stok negatif atau qty melebihi stok.

### Tahap 4 — Kerangka UI dan katalog

- [x] Buat Header, Footer, MainContent, MenuCard sebagai komponen terpisah.
- [x] Kirim data menu melalui props ke MainContent dan MenuCard; nama komponen kapital, key menggunakan id.
- [x] Terapkan token design.md di index.css.
- [x] Tampilkan seluruh properti relevan dan empat tombol lucide-react pada tiap kartu.
- [x] Implementasikan query nama, kategori/count, sort harga/rating/nama dan empty states.
- [x] Bangun layout responsif tanpa hero yang mendominasi katalog.

**Gate:** katalog lengkap dan pencarian/filter/sortir dapat dipakai di desktop dan mobile.

### Tahap 5 — Sistem popup, toast, dan notifikasi

- [x] Implementasikan Modal aksesibel, single-overlay state, focus trap, Escape, focus restore, scroll lock.
- [x] Implementasikan ToastContext dan ToastViewport; toast bukan alert browser.
- [x] Implementasikan NotificationContext, unread badge dan NotificationsModal.
- [x] Sediakan satu jalur feedback untuk toast sekaligus notifikasi; hindari efek samping reducer atau duplicate firing di StrictMode.
- [x] Tetapkan aksi UI non-mutasi sesuai PRD agar tidak membuat spam notifikasi.
- [x] Uji membuka notifikasi menandai entri yang tampil terbaca tanpa menghasilkan notifikasi baru.

**Gate:** semua feedback dasar tersedia sebelum fitur transaksi disambungkan.

### Tahap 6 — Detail, favorit, dan komentar

- [x] InfoModal menampilkan seluruh data dan ulasan, termasuk empty state.
- [x] Favorit toggle merah, persistensi, timestamp, tab Favorit, sortir terbaru/terlama.
- [x] CommentModal + StarRating: rating wajib 1–5, komentar trim minimal 5 karakter.
- [x] Kiriman valid langsung di atas, popup tidak tertutup, form reset; kiriman invalid tidak disimpan.
- [x] Rating rata-rata komentar lokal konsisten antara kartu, detail, dan sortir.
- [x] Setiap aksi favorit/komentar sukses atau ditolak menghasilkan feedback sesuai PRD.

**Gate:** empat aksi kartu tersambung secara fungsional; Add menggunakan reducer yang sudah diuji.

### Tahap 7 — Keranjang, pembayaran simulasi, dan riwayat

- [x] Drawer: stepper, hapus, qty badge total unit, batas stok, empty state.
- [x] Promo valid/invalid/hapus dengan rincian harga eksplisit.
- [x] Checkout simulasi: validasi, pembaruan stok/order, cart/promo kosong, struk, notifikasi.
- [x] HistoryModal: daftar transaksi, total belanja, buka kembali struk snapshot.
- [x] ConfirmModal untuk reset stok + riwayat; jelaskan dampak pada keranjang/promo sebelum konfirmasi.
- [x] Batal reset tidak mengubah apa pun; konfirmasi tidak menghapus favorit/komentar/notifikasi.
- [x] Reload mempertahankan cart, stok dan orders secara konsisten.

**Gate:** satu transaksi penuh dari katalog sampai riwayat/reset berhasil tanpa dialog browser bawaan.

### Tahap 8 — QA, kepatuhan, dan penyerahan

- [x] Uji unit logika murni dan transisi state; uji interaksi manual sesuai matriks di bawah.
- [x] Audit sumber: tidak memakai alert/prompt/confirm, Bootstrap, ikon manual, API menu runtime, CSS di luar index.css.
- [x] Review desktop/mobile satu putaran, perbaiki temuan bersama, lalu konfirmasi ulang.
- [x] Uji keyboard, focus, contrast, reduced motion, teks panjang, scroll overlay.
- [x] Jalankan pnpm install, pnpm dev, pnpm build dan pnpm preview; simpan hasil nyata, bukan asumsi.
- [x] Periksa semua assets di build preview dan console browser.
- [x] Tulis README: identitas, cara menjalankan, fitur, versi, asumsi promo/pajak/rating, simulasi pembayaran, sumber foto.
- [x] Bersihkan kode mati/template, jangan sertakan node_modules dalam paket pengumpulan; sertakan lockfile dan foto lokal.

**Gate akhir:** semua kebutuhan wajib dan nilai plus pada PRD terverifikasi; tidak ada blocker terbuka.

## 4. Matriks pengujian penerimaan

| ID | Skenario | Hasil yang diharapkan |
|---|---|---|
| T01 | Render awal | 15 kartu, semua 8 properti ada pada data, 15 foto lokal valid |
| T02 | Cari ` latte ` dan ubah kapitalisasi | Hasil sesuai nama tanpa sensitif kapital/spasi luar |
| T03 | Kombinasikan pencarian + kategori | Hasil/count mengikuti aturan PRD; hasil kosong memiliki reset |
| T04 | Favoritkan A lalu B | Heart merah, tab bertambah; terbaru B–A, terlama A–B |
| T05 | Batalkan favorit di tab Favorit | Item keluar, count diperbarui, feedback tercatat |
| T06 | Sort harga/rating/nama | Urutan benar, tie stabil; sort khusus favorit tidak bocor ke tab lain |
| T07 | Buka Info | Data lengkap dan ulasan/empty state tersedia |
| T08 | Kirim rating kosong/0/6 atau komentar 4 karakter setelah trim | Ditolak tanpa menambah data; pesan validasi jelas |
| T09 | Kirim rating 5 dan komentar valid | Komentar teratas, modal tetap terbuka, rating terbarui, satu toast + notifikasi |
| T10 | Add 3 kali saat stok 3, lalu tambah lagi | Qty dan badge 3; aksi ke-4 tidak menaikkan qty |
| T11 | Kurangi/hapus item terakhir | Cart kosong, total nol, checkout disabled |
| T12 | Subtotal 100.000 tanpa promo | Pajak 10.000, total 110.000 |
| T13 | Subtotal 100.000 + UTS25 | Diskon 25.000, pajak 7.500, total 82.500 |
| T14 | Subtotal 100.000 + HEMAT10 | Diskon 10.000, pajak 9.000, total 99.000 |
| T15 | Subtotal 100.000 + KOPI15 | Diskon 15.000, pajak 8.500, total 93.500 |
| T16 | Kode promo salah / ganti kode / input lowercase | Salah ditolak; kode valid ternormalisasi; promo tidak bertumpuk |
| T17 | Subtotal 10.001 + UTS25 | Diskon 2.500, dasar pajak 7.501, pajak 750, total 8.251 |
| T18 | Checkout valid dua unit | Stok turun dua, satu order, receipt benar, cart/promo kosong |
| T19 | Klik bayar cepat dua kali / saldo stok berubah sebelum bayar | Tidak ada transaksi ganda/oversell; error sesuai jika tidak valid |
| T20 | Buka riwayat dan struk lama | Snapshot harga tetap, total riwayat = jumlah total transaksi |
| T21 | Batal reset, kemudian konfirmasi reset | Batal tanpa perubahan; konfirmasi reset stok/order/cart/promo saja |
| T22 | Aksi favorit/komentar/cart/promo/order/reset | Toast dan tepat satu catatan per aksi; unread bertambah |
| T23 | Buka daftar notifikasi | Entri yang tampil terbaca; entri baru setelahnya masih unread |
| T24 | Reload | Favorit, komentar, cart, notifikasi serta stok/order tetap konsisten |
| T25 | JSON storage rusak / storage diblokir | Tidak crash; fallback memori dan feedback kegagalan persistensi |
| T26 | Keyboard modal/drawer | Fokus terkunci, Escape menutup, fokus kembali ke pemicu |
| T27 | 360/390/768/1440px dan teks panjang | Tidak overflow halaman; kontrol, gambar, footer drawer terlihat |
| T28 | Build dan preview | Sukses tanpa error; foto dan ikon tampil, tidak ada API menu runtime |

## 5. Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| Vite generator terbaru tidak sesuai Vite 5 | Verifikasi dan pin versi mayor sebelum scaffold |
| Folder target sudah berisi dokumen | Setup di staging; hanya salin file aplikasi yang diperlukan tanpa overwrite docs |
| Foto gagal diunduh/lisensi tidak jelas | Pilih sumber alternatif di Unsplash/Wikimedia, catat atribusi; jangan ganti dengan emoji |
| Interpretasi promo/pajak belum dijelaskan PDF | Pusatkan konfigurasi, tandai asumsi eksplisit pada PRD/README |
| Materi Context/useReducer melebihi pertemuan 7 | Implementasikan sesuai PDF dan siapkan penjelasan aliran state untuk presentasi |
| State cart dan stok berbeda setelah reload | Persist satu snapshot reducer berversi dengan validasi |
| Toast/notifikasi muncul dua kali | Side effect di handler, reducer murni, uji StrictMode |
| Waktu habis untuk dekorasi | Prioritaskan fungsi wajib, popup/notifikasi, struktur, transaksi; styling dan aksesibilitas tetap bagian QA |

## 6. Pemetaan penilaian dan bukti

- **Struktur 20%:** Tahap 1/4, tree komponen, props App → MainContent → MenuCard.
- **Fungsi 30%:** Tahap 6, T04–T11.
- **Popup & notifikasi 20%:** Tahap 5, T07–T09, T21–T23, T26.
- **Keranjang & transaksi 15%:** Tahap 3/7, T10–T21.
- **Estetika & kerapian 15%:** design.md, Tahap 4/8, T27–T28.

## 7. Catatan progres

| Pekerjaan | Status |
|---|---|
| Telaah ketentuan PDF | Selesai sebagai dasar dokumen |
| Menulis prd.md, design.md, plan.md | Selesai |
| Membuat aplikasi React | Selesai — 26 berkas sumber, React 19.3.1, Vite 5.4.21 |
| Mengunduh foto dan memasang dependency | Selesai — 15 JPG lokal, lucide-react 0.468.0 |
| Build, pengujian, dan screenshot aplikasi | Selesai — lihat bagian 8 |

## 8. Hasil eksekusi (15 November 2026)

### Perintah dan keluaran nyata

| Perintah | Hasil |
|---|---|
| `pnpm install` | Sukses; react 19.3.1, react-dom 19.3.1, lucide-react 0.468.0, vite 5.4.21, @vitejs/plugin-react 4.7.0 |
| `pnpm test` | 18 uji `node:test` lulus, 0 gagal (pricing, rounding, transisi, restore, storage gagal) |
| `pnpm test:e2e` | 8 skenario Playwright lulus, 0 gagal |
| `pnpm build` | Sukses; 1606 modul, CSS 24,89 kB, JS 269,65 kB |
| `pnpm preview` | Sukses pada `http://127.0.0.1:5181`; aset lokal termuat, console bersih |
| `pnpm dev` | `http://127.0.0.1:5180` (port 5173 dipakai proyek lain) |

### Cakupan uji otomatis

- **Unit:** promo dan normalisasi, contoh Rp100.000 (T12–T15), pembulatan subtotal ganjil Rp10.001 (T17), validasi input, transisi keranjang immutability, batas stok, checkout ganda, restore snapshot rusak, kegagalan storage.
- **E2E:** katalog 15 kartu + 15 foto lokal + nol request eksternal + nol console error + nol overflow (T01, T28); pencarian ` LATTE `, count kategori, favorit dan sortir favorit (T02–T06); popup info, validasi ulasan, kiriman valid tanpa menutup popup (T07–T09); keranjang, promo HEMAT10, struk, riwayat, batal reset, reset (T10–T21); stok tersisa satu membuat tombol menjadi "Batas stok" dan nonaktif (T10); reload memulihkan cart/favorit/ulasan/notifikasi (T24); notifikasi terbaca saat dibuka (T23); layout mobile 390 px tanpa overflow (T27).

### Batasan yang tetap terbuka

1. **Atribusi foto:** 15 foto diunduh dari CDN Unsplash dan isinya cocok, tetapi halaman pembuat/lisensi individual tidak dapat diakses saat pengunduhan (HTTP 429/401). Kolom pembuat dan lisensi di `public/images/SOURCES.md` ditandai `unknown`. Ini batas dokumentasi, bukan bug aplikasi.
2. **Uji keyboard dan focus trap** diverifikasi manual (Escape, focus restore, scroll lock) dan lewat E2E Escape; tidak ada uji axe otomatis.
3. **Rating awal** adalah data demo, bukan ulasan pelanggan nyata. Setelah ada ulasan lokal, rating dihitung dari rata-rata ulasan tersebut.
4. **Uji perangkat fisik** (iOS Safari/Android Chrome asli) tidak dijalankan; verifikasi memakai Chromium 147 dengan emulasi viewport 360/390/768/1440.

