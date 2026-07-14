-- ── Story 5.x / Epic E5: Layanan Administrasi Desa ──
-- Informational service catalogue: each row is one administrative service the
-- village office provides, with its requirements (persyaratan) and procedure
-- flow (alur). Not a submission engine — residents are routed to WhatsApp/office.
--
-- persyaratan_json : JSON array of strings   -> ["Fotokopi KTP", "Fotokopi KK"]
-- alur_json        : JSON array of objects   -> [{"judul":"...","keterangan":"..."}]
CREATE TABLE IF NOT EXISTS layanan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  kategori TEXT NOT NULL,
  ringkasan TEXT DEFAULT '',
  persyaratan_json TEXT NOT NULL DEFAULT '[]',
  alur_json TEXT NOT NULL DEFAULT '[]',
  biaya TEXT DEFAULT 'Gratis',
  estimasi_waktu TEXT DEFAULT '1–2 hari kerja',
  dasar_hukum TEXT,
  penanggung_jawab TEXT,
  wa_number TEXT,
  form_url TEXT,
  urutan INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_layanan_status_urutan ON layanan (status, urutan);

-- ── Seed: layanan administrasi paling umum di kantor desa ──
INSERT OR IGNORE INTO layanan
  (slug, nama, kategori, ringkasan, persyaratan_json, alur_json, biaya, estimasi_waktu, dasar_hukum, penanggung_jawab, urutan, status)
VALUES
  (
    'surat-keterangan-domisili',
    'Surat Keterangan Domisili',
    'Kependudukan',
    'Surat yang menerangkan bahwa pemohon benar berdomisili di wilayah Desa Sindangsari. Umumnya dipakai untuk syarat sekolah, kerja, bank, atau pengurusan dokumen lain.',
    '["Surat pengantar RT/RW","Fotokopi KTP pemohon (1 lembar)","Fotokopi Kartu Keluarga (1 lembar)","Mengisi formulir permohonan di kantor desa"]',
    '[{"judul":"Minta pengantar RT/RW","keterangan":"Datangi Ketua RT lalu RW setempat untuk mendapatkan surat pengantar."},{"judul":"Datang ke Kantor Desa","keterangan":"Bawa surat pengantar dan berkas persyaratan (asli + fotokopi)."},{"judul":"Verifikasi berkas","keterangan":"Petugas pelayanan memeriksa kelengkapan dan keabsahan berkas Anda."},{"judul":"Penerbitan surat","keterangan":"Kasi Pelayanan mencetak surat, lalu ditandatangani dan distempel Kepala Desa."},{"judul":"Surat diserahkan","keterangan":"Surat dapat langsung diambil di loket pelayanan Kantor Desa."}]',
    'Gratis',
    '1 hari kerja',
    'Permendagri No. 2 Tahun 2017 tentang Standar Pelayanan Minimal Desa',
    'Kasi Pelayanan',
    1,
    'published'
  ),
  (
    'surat-pengantar-ktp',
    'Surat Pengantar KTP Elektronik',
    'Kependudukan',
    'Surat pengantar dari desa untuk pembuatan KTP-el baru, perpanjangan, atau penggantian KTP yang hilang/rusak. Proses cetak KTP dilanjutkan di Kecamatan/Disdukcapil.',
    '["Surat pengantar RT/RW","Fotokopi Kartu Keluarga (1 lembar)","Fotokopi akta kelahiran / ijazah","Surat kehilangan dari kepolisian (khusus KTP hilang)","KTP lama (khusus perpanjangan atau KTP rusak)"]',
    '[{"judul":"Minta pengantar RT/RW","keterangan":"Ambil surat pengantar dari Ketua RT dan RW setempat."},{"judul":"Datang ke Kantor Desa","keterangan":"Serahkan berkas persyaratan kepada petugas pelayanan."},{"judul":"Verifikasi & penerbitan pengantar","keterangan":"Petugas memeriksa berkas dan menerbitkan surat pengantar bertanda tangan Kepala Desa."},{"judul":"Lanjut ke Kecamatan","keterangan":"Bawa surat pengantar ke Kantor Kecamatan Kasomalang untuk perekaman/pencetakan KTP-el."}]',
    'Gratis',
    '1 hari kerja (di desa)',
    'UU No. 24 Tahun 2013 tentang Administrasi Kependudukan',
    'Kasi Pemerintahan',
    2,
    'published'
  ),
  (
    'kartu-keluarga',
    'Pengurusan Kartu Keluarga (KK)',
    'Kependudukan',
    'Pembuatan KK baru, penambahan anggota keluarga (kelahiran/pindah datang), atau perubahan data pada Kartu Keluarga.',
    '["Surat pengantar RT/RW","Kartu Keluarga lama (asli)","Fotokopi buku nikah / akta perkawinan","Fotokopi akta kelahiran anggota keluarga baru","Surat keterangan pindah (bila pindah datang)"]',
    '[{"judul":"Minta pengantar RT/RW","keterangan":"Ambil surat pengantar dari Ketua RT dan RW setempat."},{"judul":"Datang ke Kantor Desa","keterangan":"Bawa KK lama asli beserta seluruh berkas pendukung."},{"judul":"Pengisian formulir F-1.01","keterangan":"Petugas membantu pengisian formulir permohonan KK."},{"judul":"Verifikasi & tanda tangan","keterangan":"Berkas diverifikasi lalu ditandatangani Kepala Desa."},{"judul":"Lanjut ke Disdukcapil","keterangan":"Berkas diteruskan ke Kecamatan dan Disdukcapil Kabupaten Subang untuk pencetakan KK."}]',
    'Gratis',
    '3–7 hari kerja',
    'UU No. 24 Tahun 2013 tentang Administrasi Kependudukan',
    'Kasi Pemerintahan',
    3,
    'published'
  ),
  (
    'surat-keterangan-tidak-mampu',
    'Surat Keterangan Tidak Mampu (SKTM)',
    'Sosial & Bantuan',
    'Surat keterangan kondisi ekonomi kurang mampu, dipakai untuk syarat beasiswa, keringanan biaya sekolah, BPJS/KIS, atau bantuan sosial lainnya.',
    '["Surat pengantar RT/RW","Fotokopi KTP pemohon","Fotokopi Kartu Keluarga","Fotokopi kartu BPJS/KIS (bila ada)","Keterangan penggunaan surat (sekolah, rumah sakit, dll.)"]',
    '[{"judul":"Minta pengantar RT/RW","keterangan":"RT/RW menerangkan kondisi ekonomi pemohon."},{"judul":"Datang ke Kantor Desa","keterangan":"Serahkan berkas dan sampaikan keperluan penggunaan SKTM."},{"judul":"Verifikasi data","keterangan":"Kasi Kesejahteraan memeriksa data pemohon terhadap data kesejahteraan desa."},{"judul":"Penerbitan surat","keterangan":"Surat dicetak, ditandatangani, dan distempel Kepala Desa."},{"judul":"Surat diserahkan","keterangan":"SKTM dapat diambil di loket pelayanan Kantor Desa."}]',
    'Gratis',
    '1–2 hari kerja',
    'Permendagri No. 2 Tahun 2017 tentang Standar Pelayanan Minimal Desa',
    'Kasi Kesejahteraan',
    4,
    'published'
  ),
  (
    'surat-keterangan-usaha',
    'Surat Keterangan Usaha (SKU)',
    'Usaha & Ekonomi',
    'Surat keterangan bahwa pemohon menjalankan usaha di Desa Sindangsari. Dibutuhkan untuk pengajuan kredit usaha, NIB, atau bantuan UMKM.',
    '["Surat pengantar RT/RW","Fotokopi KTP pemilik usaha","Fotokopi Kartu Keluarga","Keterangan jenis dan lokasi usaha","Foto tempat usaha (bila diminta)"]',
    '[{"judul":"Minta pengantar RT/RW","keterangan":"RT/RW menerangkan keberadaan usaha Anda."},{"judul":"Datang ke Kantor Desa","keterangan":"Sampaikan jenis usaha, lama usaha, dan lokasi usaha kepada petugas."},{"judul":"Verifikasi usaha","keterangan":"Petugas memverifikasi keberadaan usaha, bila perlu dengan peninjauan lapangan."},{"judul":"Penerbitan surat","keterangan":"SKU dicetak dan ditandatangani Kepala Desa."},{"judul":"Surat diserahkan","keterangan":"SKU dapat diambil di loket pelayanan Kantor Desa."}]',
    'Gratis',
    '1–2 hari kerja',
    'Permendagri No. 2 Tahun 2017 tentang Standar Pelayanan Minimal Desa',
    'Kasi Pelayanan',
    5,
    'published'
  ),
  (
    'surat-pengantar-nikah',
    'Surat Pengantar Nikah (N1–N4)',
    'Surat Keterangan',
    'Berkas pengantar nikah dari desa (formulir N1, N2, N3, N4) sebagai syarat pendaftaran pernikahan di KUA Kecamatan Kasomalang.',
    '["Surat pengantar RT/RW","Fotokopi KTP calon pengantin","Fotokopi Kartu Keluarga","Fotokopi akta kelahiran","Pas foto 2x3 dan 4x6 (masing-masing 4 lembar)","Akta cerai / surat kematian pasangan (bila berstatus duda/janda)"]',
    '[{"judul":"Minta pengantar RT/RW","keterangan":"Ambil surat pengantar dari Ketua RT dan RW setempat."},{"judul":"Datang ke Kantor Desa","keterangan":"Bawa seluruh berkas calon pengantin ke loket pelayanan."},{"judul":"Pengisian formulir N1–N4","keterangan":"Petugas mengisi dan mencetak formulir model N1, N2, N3, dan N4."},{"judul":"Tanda tangan Kepala Desa","keterangan":"Seluruh formulir ditandatangani dan distempel Kepala Desa."},{"judul":"Lanjut ke KUA","keterangan":"Bawa berkas ke KUA Kecamatan Kasomalang untuk pendaftaran nikah."}]',
    'Gratis',
    '1–2 hari kerja',
    'PMA No. 20 Tahun 2019 tentang Pencatatan Pernikahan',
    'Kasi Pelayanan',
    6,
    'published'
  ),
  (
    'surat-keterangan-ahli-waris',
    'Surat Keterangan Ahli Waris',
    'Pertanahan',
    'Surat keterangan yang menjelaskan susunan ahli waris yang sah dari almarhum/almarhumah. Umum dipakai untuk pengurusan tanah, tabungan, atau warisan lainnya.',
    '["Surat pengantar RT/RW","Fotokopi KTP seluruh ahli waris","Fotokopi Kartu Keluarga","Surat keterangan kematian pewaris","Fotokopi buku nikah pewaris","Kehadiran 2 orang saksi ber-KTP Desa Sindangsari"]',
    '[{"judul":"Minta pengantar RT/RW","keterangan":"Ambil surat pengantar dari Ketua RT dan RW setempat."},{"judul":"Datang ke Kantor Desa","keterangan":"Seluruh ahli waris dan 2 orang saksi hadir bersama membawa berkas."},{"judul":"Pendataan ahli waris","keterangan":"Petugas mendata susunan ahli waris dan meminta tanda tangan seluruh pihak."},{"judul":"Penerbitan surat","keterangan":"Surat ditandatangani ahli waris, saksi, dan disahkan Kepala Desa."},{"judul":"Pengesahan Kecamatan","keterangan":"Surat dibawa ke Kantor Kecamatan Kasomalang untuk pengesahan (bila diperlukan)."}]',
    'Gratis',
    '2–3 hari kerja',
    'Permendagri No. 2 Tahun 2017 tentang Standar Pelayanan Minimal Desa',
    'Kasi Pemerintahan',
    7,
    'published'
  );
