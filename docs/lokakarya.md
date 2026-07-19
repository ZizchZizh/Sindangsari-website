# Website Resmi Desa Sindangsari

**Dokumen Lokakarya — KKN-T Inovasi IPB University 2026**

Desa Sindangsari, Kecamatan Kasomalang, Kabupaten Subang, Jawa Barat

🌐 **https://sindangsarikasomalang.web.id**

---

## 1. Deskripsi Proyek

### 1.1 Latar Belakang

Desa Sindangsari merupakan desa hasil pemekaran Desa Darmaga (Kecamatan Cisalak) pada tahun 1982, terletak di dataran tinggi Subang selatan (500–600 mdpl) dengan luas ±305 ha yang mencakup 3 dusun, 7 RW, dan 24 RT, serta dihuni sekitar 7.600 jiwa. Desa ini memiliki potensi yang beragam — pertanian (padi, palawija, buah-buahan), ekonomi kreatif rumah tangga (opak, ranginang, kerupuk, kopi aren), dan kedekatan dengan kawasan ekowisata alam Kasomalang.

Namun, hingga sebelum program KKN-T ini berjalan, **Desa Sindangsari belum memiliki kehadiran digital resmi**:

- Informasi profil, pemerintahan, dan layanan desa tidak tersedia secara daring.
- Pelaku UMKM aktif di desa tidak dapat ditemukan calon pembeli melalui internet.
- Potensi pertanian, wisata, dan ekonomi kreatif desa belum terpublikasikan.
- Penyebaran informasi kepada warga masih bergantung pada kanal konvensional (papan pengumuman, mulut ke mulut, grup WhatsApp tidak resmi).

### 1.2 Mengapa Desa Membutuhkan Website

- **Identitas digital resmi** — website menjadi rujukan tunggal dan tepercaya atas informasi desa, membedakan informasi resmi dari kabar tidak terverifikasi.
- **Jangkauan tanpa batas jam kantor** — warga dan perantau dapat mengakses informasi desa kapan saja, dari mana saja.
- **Pintu promosi ekonomi lokal** — direktori UMKM dengan tautan langsung ke WhatsApp, Instagram, dan marketplace membuka akses pasar baru bagi pelaku usaha desa.
- **Transparansi pemerintahan** — struktur perangkat desa, berita kegiatan, dan informasi layanan dipublikasikan terbuka.
- **Daya saing desa** — desa-desa lain telah bergerak menuju digitalisasi; kehadiran digital menjadi prasyarat program desa digital dan pengembangan desa wisata.

### 1.3 Peran Digitalisasi bagi Administrasi Desa dan Informasi Publik

Digitalisasi bukan sekadar memindahkan informasi ke internet, melainkan mengubah cara desa melayani dan berkomunikasi:

- **Administrasi lebih efisien** — informasi persyaratan layanan tersedia daring sehingga warga datang ke kantor desa dengan berkas yang sudah lengkap.
- **Informasi publik satu pintu** — berita, pengumuman, dan agenda desa dikelola perangkat desa melalui satu panel admin dan langsung tayang tanpa perantara teknis.
- **Data potensi terdokumentasi** — potensi pertanian, wisata, dan UMKM terpetakan dan terarsip secara digital, menjadi modal perencanaan pembangunan desa.
- **Kemandirian pengelolaan** — sistem dirancang agar dapat dioperasikan sepenuhnya oleh perangkat desa tanpa pengetahuan pemrograman, sehingga tetap hidup setelah program KKN berakhir.

---

## 2. Tujuan Proyek

1. **Meningkatkan akses publik terhadap informasi desa** — profil, pemerintahan, berita, dan kontak desa tersedia 24 jam melalui satu alamat resmi yang mudah diingat.
2. **Mendukung tata kelola desa berbasis digital** — perangkat desa dapat menambah, mengubah, dan menerbitkan konten secara mandiri melalui panel admin yang sederhana, tanpa bantuan pengembang dan tanpa proses deploy ulang.
3. **Mempromosikan profil, wisata, dan potensi lokal desa** — potensi pertanian, pariwisata, dan ekonomi kreatif Sindangsari terpublikasikan dengan narasi dan foto yang layak, terindeks mesin pencari.
4. **Menyediakan platform informasi bagi warga dan pengunjung** — warga memperoleh berita dan informasi layanan; pengunjung dan calon pembeli memperoleh peta interaktif, destinasi wisata, dan direktori UMKM dengan kontak langsung.

### Prinsip Utama: Keberlanjutan di Atas Kecanggihan

Setiap fitur diuji dengan satu pertanyaan: *"Siapa yang mengelola ini setelah tim KKN pulang?"* Sistem sengaja dibuat sederhana, murah (memanfaatkan tier gratis, target biaya operasional ±Rp300 ribu/tahun), dan dimiliki penuh oleh desa.

---

## 3. Luaran (Output) Proyek

### 3.1 Website Resmi Desa

Website resmi Desa Sindangsari yang telah tayang (live) di domain **sindangsarikasomalang.web.id** — responsif (mobile-first), cepat diakses pada sinyal lemah dan ponsel kelas bawah, serta ramah mesin pencari (server-side rendering).

### 3.2 Fitur yang Diimplementasikan

| Fitur | Deskripsi |
|-------|-----------|
| **Beranda** | Sambutan, tautan cepat, berita terbaru, dan sorotan potensi desa |
| **Profil Desa** | Sejarah, visi & misi, letak geografis, dan data umum desa |
| **Pemerintahan** | Struktur organisasi dan susunan perangkat desa |
| **Potensi Desa** | Halaman khusus pertanian, pariwisata, dan ekonomi kreatif |
| **Wisata** | Katalog destinasi wisata kawasan dengan halaman detail per destinasi |
| **Direktori UMKM** | Daftar UMKM desa yang dapat dicari, dengan halaman detail dan tautan langsung ke WhatsApp/media sosial pelaku usaha |
| **Berita Desa** | Artikel berita dan pengumuman kegiatan desa |
| **Peta Interaktif** | Peta desa berbasis Leaflet/OpenStreetMap dengan titik-titik penting (kantor desa, wisata, UMKM) |
| **Kontak** | Alamat, kontak resmi, dan peta lokasi kantor desa |
| **Panel Admin** | Dasbor pengelolaan seluruh konten (berita, UMKM, wisata, peta, media, statistik, blok konten halaman) dengan login aman |

**Keamanan yang diterapkan:** kata sandi ter-hash (PBKDF2 SHA-256, 100.000 iterasi), sesi login terkelola, pembatasan percobaan login (5 kali per IP per 15 menit), dan seluruh rute admin terlindungi middleware.

### 3.3 Teknologi

| Lapisan | Teknologi |
|---------|-----------|
| Framework | Astro (SSR) |
| Hosting & runtime | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Penyimpanan media | Cloudflare R2 |
| Sesi login | Cloudflare KV |
| Tampilan | Tailwind CSS |
| Peta | Leaflet + OpenStreetMap |

Seluruh infrastruktur berjalan pada tier gratis Cloudflare; satu-satunya biaya rutin adalah perpanjangan domain.

### 3.4 Dokumentasi dan Hasil Deployment

- **Website live** di https://sindangsarikasomalang.web.id di atas infrastruktur Cloudflare.
- **Dokumentasi teknis (README)** — panduan menjalankan, mengonfigurasi, dan men-deploy ulang situs.
- **Panel admin siap serah terima** — perangkat desa dapat mengelola seluruh konten dinamis (berita, UMKM, wisata, peta, media, konten halaman) tanpa menyentuh kode.
- **Fitur ekspor/backup data** — cadangan data dapat diunduh langsung dari panel admin.
- **Kepemilikan penuh oleh desa** — seluruh akun (hosting, database, domain) diserahterimakan atas nama desa, bukan mahasiswa, untuk menjamin keberlanjutan.

---

## 4. Penutup

Website Desa Sindangsari adalah langkah awal transformasi digital desa: dari desa tanpa jejak digital menjadi desa dengan identitas resmi daring, kanal informasi publik yang terkelola, dan etalase ekonomi lokal yang dapat dijangkau siapa pun. Keberlanjutannya kini berada di tangan perangkat desa — dan sistem ini dirancang agar tugas itu ringan.

---

*Disusun oleh Tim KKN-T Inovasi IPB University 2026 — Desa Sindangsari, Kecamatan Kasomalang, Kabupaten Subang.*
