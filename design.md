# Design Specification — KopiKu

## 1. Konteks dan arah desain

Pemilik: **Yudistira Syaputra**. Project: **uts-yudistira_syaputra**.
Acuan fungsi: [prd.md](prd.md), bersumber pada Ketentuan_UTS_KopiKu.pdf. Status: rancangan, belum implementasi atau desain FigCraft.

Mode antarmuka: **Operate** — pengunjung harus cepat menemukan menu, memahami stok dan harga, lalu memesan. Identitas visual yang diusulkan: kedai kopi hangat dengan latar krem, tipografi gelap, aksen hijau pekat, dan fotografi produk asli. Ini keputusan desain proyek, bukan warna yang diwajibkan PDF.

Tidak menggunakan hero besar yang mendorong katalog ke bawah, gradient dekoratif, glassmorphism, atau terlalu banyak kartu bertingkat. Foto dan nama menu menjadi fokus; aksi tetap mudah ditemukan tanpa hover.

## 2. Hierarki halaman

1. **Header**: wordmark KopiKu, pencarian nama menu, ikon notifikasi, riwayat, dan keranjang beserta badge.
2. **Judul katalog**: “Temukan menu favoritmu” dan kalimat singkat; tidak menambahkan klaim rating/penjualan fiktif.
3. **Toolbar**: tab Semua / Kopi / Non-Kopi / Makanan / Snack / Favorit dengan count, jumlah hasil, dropdown sortir.
4. **MainContent**: grid MenuCard, atau empty state yang sesuai pencarian/favorit.
5. **Footer**: identitas KopiKu, “Proyek UTS React Fundamental — Yudistira Syaputra”, penanda simulasi transaksi.
6. **Overlay layer**: satu modal/drawer utama pada satu waktu; toast muncul terpisah tanpa menutupi kontrol penting.

### Sketsa desktop

    KopiKu     [Cari nama menu........................]     Lonceng  Riwayat  Keranjang (3)
    Temukan menu favoritmu
    [Semua 15] [Kopi 5] [Non-Kopi 4] [Makanan 3] [Snack 3] [Favorit 0]
    15 menu tersedia                                              [Urutkan: Pilihan menu]
    [Foto menu]       [Foto menu]       [Foto menu]       [Foto menu]
    [Kategori]        [Kategori]        [Kategori]        [Kategori]
    [Nama / rating]   [Nama / rating]   [Nama / rating]   [Nama / rating]
    [Deskripsi]       [Deskripsi]       [Deskripsi]       [Deskripsi]
    [Harga / stok]    [Harga / stok]    [Harga / stok]    [Harga / stok]
    [Info ♥ Chat Add] [Info ♥ Chat Add] [Info ♥ Chat Add] [Info ♥ Chat Add]
    Footer

### Sketsa ponsel

    KopiKu                         Lonceng Riwayat Keranjang
    [Cari nama menu......................................]
    Temukan menu favoritmu
    [Semua] [Kopi] [Non-Kopi] ... (scroll tab horizontal)
    15 hasil                       [Urutkan]
    [Foto menu 4:3]
    Kategori                Rating
    Nama menu
    Deskripsi ringkas
    Harga                   Stok
    [Info] [Favorit] [Komentar] [Tambah]

## 3. Token visual

Seluruh implementasi styling berada di **src/index.css**, menggunakan CSS custom properties. Tidak membuat App.css, CSS Modules, atau stylesheet komponen terpisah pada proyek ini.

| Token | Nilai awal | Peran |
|---|---|---|
| --color-bg | #F7F3EC | Latar halaman krem |
| --color-surface | #FFFFFF | Kartu, modal, drawer |
| --color-text | #25221E | Teks utama |
| --color-muted | #625C53 | Teks pendukung |
| --color-primary | #245747 | CTA dan tab aktif |
| --color-primary-hover | #194335 | Hover CTA |
| --color-border | #DDD5C8 | Batas kartu/input |
| --color-favorite | #B42332 | Heart aktif |
| --color-error | #B42318 | Error dan aksi destruktif |
| --color-success | #236044 | Sukses |
| --color-warning | #8A4B0B | Stok sedikit/peringatan |
| --color-star | #8B600A | Bintang/rating |
| --radius-control | 10px | Tombol dan input |
| --radius-card | 16px | Kartu menu |
| --radius-dialog | 20px | Dialog |
| --content-max | 1240px | Lebar isi halaman |

Warna adalah kandidat token, bukan hasil audit kontras. Verifikasi pasangan teks minimal 4.5:1, teks besar dan komponen nonteks 3:1. Border input dan focus ring perlu cukup kontras, tidak hanya mengandalkan border dekoratif kartu.

- Font body: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; tidak perlu request font eksternal.
- Wordmark: Georgia/serif lokal, bukan gambar logo.
- Ukuran: body 16px, pendukung 14px, label kecil 12px, judul kartu 18px, judul halaman 28–36px responsif.
- Line-height body 1.5; harga memakai tabular numerals bila tersedia.
- Spacing: 4, 8, 12, 16, 24, 32, 48px; padding kartu 16px, gap grid 20–24px.
- Shadow ringan hanya untuk elevasi modal/drawer dan toast. Kartu memakai border halus.
- Target sentuh minimal 44×44px; focus ring 2–3px terlihat jelas.

## 4. Spesifikasi komponen

### Header

- Pencarian memiliki label aksesibel “Cari menu”, placeholder “Cari kopi, makanan, atau snack”.
- Tombol hapus pencarian memakai ikon X dari lucide-react.
- Bell menampilkan jumlah belum dibaca; ShoppingCart menampilkan total unit. Angka visual dapat dibatasi 99+, accessible label tetap menyebut jumlah asli.
- Riwayat memakai History. Semua tombol icon-only mempunyai aria-label dan petunjuk visual saat fokus.
- Sticky header boleh dipakai selama tidak memakan ruang berlebihan di mobile atau menghalangi fokus.

### Toolbar katalog

- Tab berupa tombol filter dengan aria-pressed; tidak menggunakan role tab tanpa implementasi keyboard tablist yang benar.
- Active tab memakai latar hijau pekat dan teks putih, bukan warna saja sebagai penanda.
- Dropdown sortir berlabel; opsi terbaru/terlama hanya muncul di Favorit.
- Count mengikuti aturan PRD; jumlah hasil dibaca melalui live region ringkas.
- Pada layar sempit, filter dapat digeser dalam area sendiri; halaman tidak ikut overflow horizontal.

### MenuCard

Urutan: foto → kategori/rating → nama → deskripsi → harga/stok → empat aksi.

- Foto asli 4:3, object-fit cover, alt menjelaskan menu; dimensi tetap untuk mencegah layout shift.
- Nama tidak dipotong hingga tidak bisa dipahami; deskripsi maksimal dua baris, versi lengkap tersedia di Info.
- Stock “Tersisa 5” atau “Stok habis”; bila ada qty keranjang, informasi sisa yang dapat ditambah konsisten dengan PRD.
- Info (`Info`), favorit (`Heart`), komentar (`MessageCircle`), tambah (`ShoppingCart` atau `Plus`). Tidak memakai emoji atau ikon SVG manual.
- Heart aktif merah dan terisi; aria-pressed menyampaikan status tanpa bergantung pada warna.
- Add berlabel “Tambah”; saat qty mencapai stok, kontrol menunjukkan “Batas stok” dan disabled. Jika aksi tidak valid tetap terpicu lewat state lama, tampilkan toast penolakan.
- Stok habis menonaktifkan Add, tetapi Info/Favorit/Komentar tetap tersedia.
- Gambar gagal dimuat menampilkan teks error yang jujur dan usaha ulang bila sesuai; placeholder bukan pengganti 15 foto pada hasil akhir.

### Modal dasar

- Ukuran umum maksimal 640px; modal detail dapat sampai 760px.
- role dialog, aria-modal, judul terhubung, tombol tutup X dengan label.
- Focus masuk ke elemen tepat, trap fokus, Escape untuk menutup, restore ke pemicu, body scroll lock.
- Klik backdrop dapat menutup dialog non-destruktif; konfirmasi reset membutuhkan pilihan eksplisit, default fokus pada Batal.
- Konten panjang scroll di body modal, judul/tombol penting tetap terlihat. Atur max-height berbasis viewport/dvh dan safe-area mobile.

### InfoModal

Foto, nama, kategori, harga, saldo stok, rating beserta penjelasan sumbernya, deskripsi penuh, daftar ulasan. Jika belum ada ulasan: “Belum ada ulasan untuk menu ini.” Tombol “Tulis ulasan” mengganti overlay menjadi CommentModal, bukan menumpuk modal baru.

### CommentModal dan StarRating

- Judul menyebut menu; rating 1–5 memakai ikon Star lucide-react dengan kontrol radio berlabel “1 bintang” hingga “5 bintang”.
- Textarea berlabel “Komentar”; helper “Minimal 5 karakter”.
- Validasi dekat input, error dihubungkan lewat aria-describedby.
- Tombol “Kirim ulasan”; kiriman berhasil muncul teratas, popup tetap terbuka, form dikosongkan, toast muncul.
- Daftar panjang scroll; teks panjang wrap, tidak memakai dangerouslySetInnerHTML.

### CartDrawer

- Desktop dari kanan, lebar sekitar 420–460px; mobile selebar layar.
- Judul “Keranjangmu”, tombol tutup, daftar item scroll, footer ringkasan tetap dapat dijangkau.
- Setiap baris: thumbnail, nama, harga satuan, stepper minus/qty/plus, subtotal baris, hapus.
- Minus pada qty 1 menghapus item dengan feedback; tombol hapus menyediakan aksi eksplisit yang sama.
- Promo: input kode, Terapkan, status kode aktif dan Hapus promo; kode valid ditampilkan jelas.
- Ringkasan selalu memisahkan Subtotal, Diskon, Pajak 10%, Total.
- CTA “Bayar (simulasi)” disabled saat kosong; checkout sukses menutup drawer dan membuka ReceiptModal.
- Empty state: “Keranjangmu masih kosong” dengan tombol “Lihat menu”.

### ReceiptModal dan HistoryModal

- Struk menggunakan layout sederhana seperti kuitansi, angka rata kanan, semua rincian harga berasal dari snapshot transaksi.
- Label Dibayar (simulasi), nomor transaksi dan waktu; tidak menampilkan konfirmasi pembayaran bank nyata.
- Riwayat menampilkan transaksi terbaru terlebih dahulu, total belanja seluruh transaksi, dan akses lihat struk.
- Reset stok + riwayat menggunakan tombol sekunder destruktif, bukan CTA dominan.
- Konfirmasi reset menyebut penghapusan riwayat, pengembalian stok, dan pengosongan keranjang/promo. Tombol Batal tidak mengubah data.

### NotificationsModal dan toast

- Notifikasi terbaru di atas; status belum dibaca ditandai teks/indikator, bukan warna saja.
- Membuka popup menandai snapshot entri yang tampil sebagai terbaca; notifikasi baru tetap unread.
- Empty state “Belum ada notifikasi”.
- Toast sukses/info sekitar 4–5 detik dengan tombol tutup; error lebih lama. Maksimal tiga toast terlihat, sisanya mengantre.
- Toast tidak mencuri fokus dan tidak menutupi CTA drawer. aria-live polite untuk status biasa; error penting diumumkan sesuai konteks.
- Semua aksi perubahan data mengikuti pasangan toast + notifikasi di PRD. Tidak membuat loop notifikasi saat membaca notifikasi.

### Footer

Identitas pemilik dan tugas, tahun proyek, penjelasan transaksi simulasi, serta atribusi foto jika lisensi sumber mengharuskannya. Tidak memakai identitas bisnis nyata yang tidak diberikan.

## 5. Perilaku responsif

| Viewport | Grid dan tata letak |
|---|---|
| 360–599px | 1 kolom; header dua baris; input lebar penuh; modal/drawer hampir atau sepenuh layar |
| 600–899px | 2 kolom; toolbar wrap; drawer maksimal 460px |
| 900–1199px | 3 kolom; search dan aksi header sebaris bila cukup |
| ≥1200px | 4 kolom; container maksimal 1240px, margin otomatis |

Uji juga 320px sebagai stress test. Tombol aksi boleh wrap alih-alih diperkecil. Dialog tidak melebihi viewport; keyboard layar tidak menghalangi textarea dan tombol kirim. Konten ekstrem (nama panjang, 0 hasil, banyak ulasan/notifikasi, harga besar) masuk skenario uji.

## 6. State dan alur penting

| Keadaan | Feedback |
|---|---|
| Katalog awal | 15 menu; seluruh foto lokal |
| Pencarian kosong hasil | Pesan tidak ditemukan dan tombol reset filter |
| Favorit kosong | Pesan untuk menekan Heart pada menu |
| Favorit dibatalkan | Heart nonaktif, item keluar dari tab Favorit, toast dan notifikasi |
| Komentar invalid | Error inline; popup tetap terbuka; data tidak berubah |
| Batas stok | Add/plus disabled, label batas; validasi ulang saat transaksi |
| Promo invalid | Error spesifik, nilai transaksi tidak berubah |
| Checkout sukses | Keranjang kosong, stok berkurang, struk tampil, riwayat bertambah |
| Reset dibatalkan | Tidak ada perubahan |
| Storage gagal | Aplikasi tetap berjalan di memori, toast menjelaskan data mungkin tidak bertahan |

Alur utama: Header cari/filter → MenuCard → Add → CartDrawer → Promo → Bayar simulasi → ReceiptModal → HistoryModal.
Alur ulasan: MenuCard komentar → pilih rating → tulis → kirim → ulasan muncul tanpa menutup dialog.

## 7. Motion dan performa visual

Durasi hover/focus 120–180ms; drawer 180–220ms dengan transform, backdrop dengan opacity. Tidak menganimasikan layout grid saat setiap ketikan. Hormati prefers-reduced-motion. Foto bawah fold lazy-load, foto awal tidak semuanya ditunda. Asset dioptimalkan tanpa merusak detail makanan/minuman; target ukuran sekitar 80–200KB per foto bila kualitas memungkinkan.

## 8. Validasi desain sebelum dinyatakan selesai

- Review desktop dan mobile sekaligus: hierarki, kontras, overflow, tab, modal/drawer, toast.
- Uji keyboard lengkap, Escape, focus restore, radio bintang, input error, dan scroll lock.
- Pastikan empat aksi terlihat dan dapat dipakai tanpa hover.
- Pastikan menu/ulasan/notifikasi kosong, stok habis, serta error promo memiliki tampilan.
- Lakukan satu batch perbaikan setelah review, lalu konfirmasi ulang; hasil dicatat di plan.md.
- Dokumentasi ini tidak mengubah atau mengklaim adanya mockup FigCraft.
