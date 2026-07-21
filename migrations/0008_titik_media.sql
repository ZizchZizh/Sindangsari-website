-- ── Foto & deskripsi singkat per titik peta ──────────────────────────────────
-- Panel detail di /peta menampilkan foto + deskripsi singkat saat sebuah pin
-- diklik. Foto memakai mekanisme sampul yang sama seperti wisata/umkm/berita/
-- layanan (kolom cover_media_id → media.id). deskripsi adalah teks bebas singkat.

ALTER TABLE titik_peta ADD COLUMN deskripsi TEXT;
ALTER TABLE titik_peta ADD COLUMN cover_media_id INTEGER;

-- Mempercepat join foto pada peta publik.
CREATE INDEX IF NOT EXISTS idx_titik_cover ON titik_peta (cover_media_id);
