-- ── Seed titik fasilitas umum (dari survei lapangan KKN-T, file KML) ──────────
-- 26 titik fasilitas umum Desa Sindangsari hasil pemetaan lapangan: tempat
-- ibadah, pendidikan, kesehatan, makam, dan kantor pemerintahan.
--
-- `jenis` memakai kategori fasilitas baru (lihat JENIS_TITIK di
-- src/lib/db/titik-peta.ts). `linked_slug` sengaja kosong ('') karena fasilitas
-- umum tidak punya halaman detail — kolomnya NOT NULL, jadi bukan NULL.
-- Koordinat KML aslinya urut (bujur, lintang); di sini sudah dibalik ke (lat, lng).

INSERT INTO titik_peta (lat, lng, jenis, linked_slug, label) VALUES
  -- Tempat ibadah
  (-6.70002759420958, 107.742708822696,  'ibadah', '', 'Masjid'),
  (-6.704373,         107.735592,        'ibadah', '', 'Masjid 1'),
  (-6.7049725332482,  107.734546552655,  'ibadah', '', 'Masjid 3'),
  (-6.706749,         107.729062,        'ibadah', '', 'Masjid Al Aqsho'),
  (-6.70053412746071, 107.743488381119,  'ibadah', '', 'Masjid Al Baroqah'),
  (-6.70147739910279, 107.749026019764,  'ibadah', '', 'Masjid Jami Nurul Huda'),
  -- Pendidikan
  (-6.701142,         107.740982,        'pendidikan', '', 'MI MQ An Nuur'),
  (-6.702976,         107.742565,        'pendidikan', '', 'SDN Darmaga 2'),
  (-6.70110415774974, 107.747601949483,  'pendidikan', '', 'SDN Darmaga 3'),
  (-6.70052886991667, 107.738905987592,  'pendidikan', '', 'SDN Darmaga 4'),
  (-6.70358712747619, 107.731967271658,  'pendidikan', '', 'SDN Sukamaju'),
  (-6.70355804696779, 107.744559674534,  'pendidikan', '', 'SMA Nurul Gina'),
  (-6.700095,         107.739269,        'pendidikan', '', 'SMP-SMK Citra Tri Tunggal'),
  -- Kesehatan
  (-6.70306718816583, 107.732639664496,  'kesehatan', '', 'Klinik Bima Medika'),
  (-6.704455,         107.735482,        'kesehatan', '', 'Posyandu'),
  (-6.70074569732947, 107.742360730088,  'kesehatan', '', 'Posyandu'),
  (-6.70707347766239, 107.729901103333,  'kesehatan', '', 'Posyandu Bayam 1'),
  (-6.70445638317336, 107.731276216894,  'kesehatan', '', 'Posyandu Bayam 2'),
  (-6.70164974061416, 107.750313150364,  'kesehatan', '', 'Posyandu Bayam 5'),
  (-6.7048058196361,  107.741556531912,  'kesehatan', '', 'Posyandu Bayam 7'),
  (-6.70630000000002, 107.746076666667,  'kesehatan', '', 'Posyandu Bayam 8'),
  (-6.70196621751179, 107.751903315976,  'kesehatan', '', 'Posyandu Bayam VI'),
  -- Makam
  (-6.70537520624792, 107.734005403697,  'makam', '', 'Makam 1'),
  (-6.70010753401841, 107.739759190426,  'makam', '', 'Makam 3'),
  (-6.70331248449344, 107.746905481685,  'makam', '', 'Makam Pasir'),
  -- Pemerintahan
  (-6.70055700183768, 107.743245977073,  'pemerintahan', '', 'Kantor Desa');
