-- ── Demografi penduduk per RT ────────────────────────────────────────────────
-- Data kependudukan terstruktur per RT untuk section "Demografi" di halaman
-- Profil: grafik persebaran penduduk antar-RT, komposisi jenis kelamin, dan
-- jumlah kepala keluarga. Total penduduk TIDAK disimpan — dihitung dari
-- laki_laki + perempuan di sisi aplikasi agar tidak pernah tidak konsisten.
--
-- Dikelola lewat panel admin (/admin/demografi), mengikuti pola perangkat_desa.
-- Kelompok usia sengaja belum dimasukkan; bisa ditambah lewat migrasi berikutnya
-- bila datanya tersedia.

CREATE TABLE IF NOT EXISTS demografi_rt (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  dusun      TEXT    NOT NULL DEFAULT '',
  rw         TEXT    NOT NULL DEFAULT '',
  rt         TEXT    NOT NULL DEFAULT '',
  laki_laki  INTEGER NOT NULL DEFAULT 0,
  perempuan  INTEGER NOT NULL DEFAULT 0,
  jumlah_kk  INTEGER NOT NULL DEFAULT 0,
  urutan     INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Urutan tampil adalah kunci pengurutan utama di daftar & grafik.
CREATE INDEX IF NOT EXISTS idx_demografi_urutan ON demografi_rt (urutan);
