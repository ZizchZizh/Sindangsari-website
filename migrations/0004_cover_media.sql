-- ── Foto sampul per entitas ──────────────────────────────────────────────────
-- `berita` sudah punya `cover_media_id` sejak 0001 (tapi tidak pernah terisi
-- karena route unggah tidak ada). `wisata` dan `umkm` belum punya sama sekali.
-- Migrasi ini menyeragamkan ketiganya ke satu mekanisme: kolom cover_media_id
-- yang menunjuk ke media.id.
--
-- CATATAN: skema ini punya DUA mekanisme sampul yang bersaing — kolom
-- cover_media_id, dan konvensi "sort terkecil di media_link = sampul" yang
-- dipakai kode upstream. Kita memilih SATU: cover_media_id. media_link tetap
-- ada untuk galeri (banyak foto), bukan untuk sampul.

ALTER TABLE wisata ADD COLUMN cover_media_id INTEGER;
ALTER TABLE umkm   ADD COLUMN cover_media_id INTEGER;

-- Mempercepat join sampul pada halaman daftar publik.
CREATE INDEX IF NOT EXISTS idx_wisata_cover ON wisata (cover_media_id);
CREATE INDEX IF NOT EXISTS idx_umkm_cover   ON umkm (cover_media_id);
CREATE INDEX IF NOT EXISTS idx_berita_cover ON berita (cover_media_id);
