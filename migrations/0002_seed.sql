-- ── Page section seed (konten Desa Sindangsari, Kec. Kasomalang, Kab. Subang) ──
INSERT OR IGNORE INTO page_section (slug, title, content_html, cover_alt) VALUES
  ('beranda-hero',        'Selamat Datang di Desa Sindangsari',      '<p>Desa Sindangsari adalah desa yang asri dan sejuk di dataran tinggi Kecamatan Kasomalang, Kabupaten Subang, Jawa Barat. Dikelilingi perbukitan hijau dan lahan pertanian yang subur.</p>', 'Panorama Desa Sindangsari'),
  ('beranda-sekilas',     'Sekilas Desa Sindangsari',                '<p>Desa Sindangsari merupakan hasil pemekaran dari Desa Darmaga pada tahun 1982. Terletak di ketinggian 500–600 mdpl, desa ini memiliki luas wilayah sekitar 305 hektar yang terdiri dari 3 dusun, 7 RW, dan 24 RT, dihuni sekitar 7.600 jiwa. Masyarakatnya hidup harmonis dengan mata pencaharian utama di bidang pertanian.</p>', NULL),
  ('profil-umum',         'Profil Umum',                      '<p>Desa Sindangsari terletak di kawasan dataran tinggi Kecamatan Kasomalang, Kabupaten Subang, Jawa Barat. Dengan ketinggian 500–600 mdpl dan suhu udara sejuk (15–25°C), desa ini dikenal sebagai kawasan pertanian yang subur dan berpotensi wisata alam.</p>', NULL),
  ('profil-geografis',    'Kondisi Geografis',                '<p>Desa Sindangsari berada pada ketinggian 500–600 meter di atas permukaan laut dengan topografi berbukit dan lembah. Dari luas wilayah 305 hektar, sekitar 161 ha berupa sawah, 60 ha pemukiman, dan 46 ha perkebunan. Desa berbatasan dengan Desa Bojongloa di utara, Desa Pasanggrahan di selatan, Desa Darmaga (Kec. Cisalak) di timur, dan Desa Kasomalang Wetan di barat. Suhu udara relatif sejuk berkisar antara 15–25°C sepanjang tahun.</p>', NULL),
  ('profil-sejarah',      'Sejarah Desa',                     '<p>Nama "Sindangsari" berasal dari bahasa Sunda: <em>Sindang</em> yang berarti "singgah" dan <em>Sari</em> yang berarti "indah/menarik", sehingga bermakna tempat persinggahan yang nyaman dan asri. Desa Sindangsari resmi terbentuk pada tahun 1982 sebagai hasil pemekaran dari Desa Darmaga, Kecamatan Cisalak, karena pertimbangan kepadatan penduduk dan luas wilayah.</p>', NULL),
  ('potensi',             'Potensi Desa Sindangsari',                '<h2>Pertanian</h2><p>Lahan pertanian yang subur menghasilkan komoditas unggulan seperti padi, jagung, singkong, serta beragam buah-buahan seperti alpukat, durian, jeruk bali, dan nangka.</p><h2>Pariwisata</h2><p>Potensi ekowisata yang besar dengan keindahan alam pegunungan, curug (air terjun), dan panorama perbukitan hijau.</p><h2>Ekonomi Kreatif</h2><p>Industri rumah tangga yang menghasilkan makanan ringan tradisional seperti kerupuk, opak, ranginang, serta kopi aren khas Kasomalang.</p>', NULL),
  ('pemerintahan-visi-misi', 'Visi & Misi Pemerintahan Desa', '<h2>Visi</h2><p>"Terwujudnya Desa Sindangsari yang Maju, Mandiri, dan Sejahtera Berbasis Potensi Lokal dan Kearifan Budaya Sunda"</p><h2>Misi</h2><ol><li>Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel.</li><li>Mengembangkan potensi pertanian, pariwisata, dan UMKM lokal secara berkelanjutan.</li><li>Memperkuat infrastruktur desa dan kelestarian lingkungan.</li><li>Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pemberdayaan masyarakat.</li></ol>', NULL),
  ('pemerintahan-ruang-lingkup', 'Ruang Lingkup Pemerintahan', '<p>Pemerintah Desa Sindangsari mengelola wilayah seluas ±305 hektar yang mencakup 3 dusun, 7 RW, dan 24 RT. Desa ini mencakup kampung-kampung: Limaratus, Sindangsari, Cimalingping, Cipunagara, Kalapa Beureum, Babakan Muncang, Sukamaju, dan Sukamaju Girang.</p>', NULL),
  ('pemerintahan-tugas-fungsi', 'Tugas & Fungsi', '<p>Pemerintah Desa Sindangsari bertugas menyelenggarakan pemerintahan desa, melaksanakan pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat sesuai dengan Undang-Undang Desa No. 6 Tahun 2014.</p>', NULL);

-- ── Perangkat desa seed ──
-- id eksplisit agar INSERT OR IGNORE idempoten saat db:setup dijalankan ulang
INSERT OR IGNORE INTO perangkat_desa (id, nama, jabatan, urutan) VALUES
  (1, 'Vovi Pathul Hidayat',     'Kepala Desa',          1),
  (2, '(Segera Diisi)',     'Sekretaris Desa',       2),
  (3, '(Segera Diisi)',     'Kaur Keuangan',         3),
  (4, '(Segera Diisi)',     'Kaur Umum',             4),
  (5, '(Segera Diisi)',     'Kasi Pemerintahan',     5),
  (6, '(Segera Diisi)',     'Kasi Kesejahteraan',    6),
  (7, '(Segera Diisi)',     'Kasi Pelayanan',        7);

-- ── Wisata seed ──
INSERT OR IGNORE INTO wisata (slug, nama, deskripsi_html, status) VALUES
  ('curug-masigit', 'Curug Masigit', '<p>Curug Masigit merupakan air terjun eksotis yang terletak di Desa Pasanggrahan, Kecamatan Kasomalang. Airnya sangat jernih berwarna hijau kebiruan, diapit oleh tebing batu yang megah. Tersedia area untuk berenang dan lokasi berkemah.</p>', 'published'),
  ('ekowisata-alam-kasomalang', 'Ekowisata Alam Kasomalang', '<p>Kawasan ekowisata terpadu di Kecamatan Kasomalang yang menawarkan keindahan alam pegunungan, udara sejuk, dan pemandangan perbukitan hijau. Cocok untuk hiking, agrowisata, dan menikmati keasrian alam pedesaan Sunda.</p>', 'published');

-- ── UMKM seed ──
INSERT OR IGNORE INTO umkm (slug, nama, kategori, deskripsi_html, lokasi, wa_number, status) VALUES
  ('kerupuk-opak-ranginang', 'Kerupuk, Opak & Ranginang', 'Makanan Tradisional', '<p>Produk olahan makanan ringan tradisional khas Sunda yang dibuat secara handmade oleh ibu-ibu Desa Sindangsari. Tersedia kerupuk, opak, dan ranginang dengan cita rasa autentik.</p>', 'Kampung Limaratus, Desa Sindangsari', '6281234567890', 'published'),
  ('kopi-aren-kasomalang', 'Kopi Aren Kasomalang', 'Kuliner', '<p>Kopi pilihan dari dataran tinggi Kasomalang yang disajikan dengan gula aren asli. Cita rasa khas yang menggabungkan pahit kopi dan manisnya aren alami.</p>', 'Kampung Sindangsari, Desa Sindangsari', '6282345678901', 'published'),
  ('keripik-bonggol-pisang', 'Keripik Bonggol Pisang', 'Makanan Olahan', '<p>Camilan unik dari bonggol pisang yang diolah menjadi keripik renyah dengan berbagai varian rasa. Inovasi produk lokal yang ramah lingkungan dan bernilai ekonomi tinggi.</p>', 'Kampung Sukamaju, Desa Sindangsari', NULL, 'published');

-- ── Titik peta seed ──
INSERT OR IGNORE INTO titik_peta (id, lat, lng, jenis, linked_slug, label) VALUES
  (1, -6.7150, 107.7350, 'wisata', 'curug-masigit', 'Curug Masigit'),
  (2, -6.7100, 107.7300, 'wisata', 'ekowisata-alam-kasomalang', 'Ekowisata Alam Kasomalang'),
  (3, -6.7010, 107.7420, 'umkm', 'kerupuk-opak-ranginang', 'Kerupuk, Opak & Ranginang');
