-- ── Poster / pamflet per layanan ─────────────────────────────────────────────
-- Layanan awalnya tidak punya media sama sekali. Migrasi ini menambah SATU
-- gambar poster/pamflet per layanan lewat kolom cover_media_id → media.id,
-- memakai mekanisme sampul yang sama seperti wisata/umkm/berita (lihat 0004).
-- media_link (galeri banyak foto) sengaja tidak dipakai di sini.

ALTER TABLE layanan ADD COLUMN cover_media_id INTEGER;

-- Mempercepat join poster pada halaman daftar & detail publik.
CREATE INDEX IF NOT EXISTS idx_layanan_cover ON layanan (cover_media_id);
