# Sumber foto menu KopiKu

Seluruh 15 JPG di folder ini diunduh dari CDN foto **Unsplash** pada 15 November 2026. Tidak ada gambar yang digenerasikan. URL di bawah adalah URL sumber berkas yang benar-benar berhasil diunduh, bukan URL pencarian atau hotlink runtime. Berkas lokal mempertahankan byte respons JPEG CDN, tanpa mengganti format dari HTML atau placeholder.

**Batas verifikasi atribusi:** halaman Unsplash mengembalikan HTTP 429/401 di lingkungan pengunduhan. Nama fotografer, halaman detail foto, dan lisensi spesifik setiap foto tidak dapat diverifikasi; semuanya ditandai **unknown**, bukan ditebak. Referensi kebijakan umum platform: <https://unsplash.com/license> (halaman ini juga tidak dapat diakses saat pemeriksaan). Keberadaan berkas pada CDN bukan bukti lisensi spesifik. Periksa halaman foto dan hak penggunaan kembali sebelum distribusi komersial; catatan ini tidak mengklaim verifikasi hukum/atribusi selesai.

| Berkas lokal | Sumber unduhan aktual | Pembuat | Lisensi spesifik / halaman foto | Hasil pemeriksaan visual |
|---|---|---|---|---|
| `espresso.jpg` | https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Cangkir kopi hitam dengan lapisan crema/busa tipis; detail metode seduh tidak dapat dipastikan dari foto. |
| `pour-over.jpg` | https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Proses menyeduh kopi dengan filter pour-over; nama rencana Americano diganti agar relevan. |
| `cappuccino.jpg` | https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Cangkir kopi susu dengan latte art; rasio susu/busa tidak dapat dipastikan hanya dari foto. |
| `caffe-latte.jpg` | https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Beberapa cangkir kopi, termasuk dua kopi susu dengan latte art. |
| `iced-latte.jpg` | https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Gelas es kopi dengan susu; tidak mengklaim adanya gula aren yang tidak terlihat. |
| `matcha-latte.jpg` | https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Minuman matcha hijau dengan latte art putih dalam cangkir. |
| `chocolate-milkshake.jpg` | https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Milkshake cokelat dengan krim, biskuit, dan saus cokelat. |
| `milk-tea.jpg` | https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Cangkir minuman susu berwarna teh dengan biskuit; tidak memakai nama Lemon Tea karena tidak ada lemon. |
| `orange-juice.jpg` | https://images.unsplash.com/photo-1613478223719-2ab802602423?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Gelas jus berwarna jingga dengan buah dan irisan jeruk. |
| `creamy-pasta.jpg` | https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Pasta pita bersaus dengan sayuran hijau. |
| `salad-bowl.jpg` | https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Semangkuk salad berwarna dengan potongan tahu, jagung, dan sayuran. |
| `ramen.jpg` | https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Mi berkuah dengan telur belah, sayuran, dan sumpit. |
| `croissant.jpg` | https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Croissant keemasan di atas latar gelap. |
| `french-fries.jpg` | https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Kentang goreng dengan taburan keju dan herba. |
| `chocolate-cake.jpg` | https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&q=85&fit=crop&fm=jpg | unknown | unknown / unknown | Sepotong cake cokelat berlapis; nama rencana Brownie diganti agar cocok dengan foto. |

## Bukti pemeriksaan

- Semua berkas memiliki signature JPEG `FF D8 FF` dan berhasil dibaca oleh ImageMagick sebagai JPEG sRGB 8-bit.
- Lebar setiap foto 900 px; tinggi 600–1350 px. Tidak ada unduhan HTML yang disimpan sebagai JPG.
- Ukuran foto 58.569–229.333 byte; total 2.060.704 byte untuk 15 foto.
- `contact-sheet.png` adalah lembar kontak 5 kolom dari foto-foto unduhan asli, diberi label id menu untuk pemeriksaan visual; **bukan gambar generatif** dan tidak dirujuk oleh katalog.
- Nama menu disesuaikan dengan isi foto. Harga, stok, deskripsi resep, dan rating awal adalah data demo, bukan metadata fotografer atau ulasan pelanggan nyata. Foto bersifat ilustrasi penyajian; bahan/metode seduh yang tak terlihat tidak dapat dibuktikan dari piksel saja.
- Distribusi katalog tetap: 5 Kopi, 4 Non-Kopi, 3 Makanan, 3 Snack.
