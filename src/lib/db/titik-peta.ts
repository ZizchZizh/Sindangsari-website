export type JenisTitik =
  | 'wisata'
  | 'umkm'
  | 'potensi'
  | 'ibadah'
  | 'pendidikan'
  | 'kesehatan'
  | 'pemerintahan'
  | 'makam';

export interface JenisTitikConfig {
  /** Label manusiawi untuk legenda peta & subjudul popup. */
  label: string;
  /** Warna penanda di peta. */
  color: string;
  /** Ikon Lucide untuk panel filter. */
  icon: string;
  /**
   * Basis tautan detail:
   *   - berakhiran '/'  → prefix, slug ditempel di belakang (mis. '/wisata/')
   *   - tanpa '/' akhir → tautan datar, slug diabaikan (mis. '/potensi')
   *   - string kosong   → tidak punya halaman detail (fasilitas umum)
   */
  link: string;
}

/**
 * Sumber kebenaran tunggal untuk jenis titik peta — dipakai halaman publik
 * (`peta.astro`), form admin (`admin/peta`), dan validasi route API.
 * `jenis` di DB hanyalah TEXT tanpa CHECK, jadi daftar inilah penegaknya.
 */
export const JENIS_TITIK: Record<JenisTitik, JenisTitikConfig> = {
  wisata:       { label: 'Wisata',        color: '#0D9488', icon: 'palmtree',       link: '/wisata/' },
  umkm:         { label: 'UMKM',          color: '#15803D', icon: 'store',          link: '/umkm/' },
  potensi:      { label: 'Potensi',       color: '#B45309', icon: 'sprout',         link: '/potensi' },
  ibadah:       { label: 'Tempat Ibadah', color: '#059669', icon: 'moon-star',      link: '' },
  pendidikan:   { label: 'Pendidikan',    color: '#2563EB', icon: 'graduation-cap', link: '' },
  kesehatan:    { label: 'Kesehatan',     color: '#DC2626', icon: 'heart-pulse',    link: '' },
  pemerintahan: { label: 'Pemerintahan',  color: '#7C3AED', icon: 'landmark',       link: '' },
  makam:        { label: 'Makam',         color: '#64748B', icon: 'flower',         link: '' },
};

/** Daftar jenis yang dikenali — untuk validasi allowlist di server. */
export const JENIS_TITIK_KEYS = Object.keys(JENIS_TITIK) as JenisTitik[];

import type { WithCover } from './media';

export interface TitikPeta extends WithCover {
  id: number;
  lat: number;
  lng: number;
  jenis: JenisTitik;
  linked_slug: string;
  label: string | null;
  deskripsi: string | null;
}

/**
 * Field yang dikirim admin. `cover_key`/`cover_thumb_key`/`cover_alt` hanya
 * hasil JOIN media (baca-saja); hanya `cover_media_id` yang bisa di-set.
 */
export type TitikPetaInput = Omit<
  TitikPeta,
  'id' | 'cover_key' | 'cover_thumb_key' | 'cover_alt'
>;

// Foto sampul di-JOIN dalam query yang sama agar peta tidak N+1.
const SEL = `SELECT t.*, m.r2_key_display AS cover_key, m.r2_key_thumb AS cover_thumb_key, m.alt AS cover_alt
             FROM titik_peta t LEFT JOIN media m ON m.id = t.cover_media_id`;

export async function getAllTitikPeta(db: D1Database): Promise<TitikPeta[]> {
  const r = await db.prepare(`${SEL} ORDER BY t.id`).all<TitikPeta>();
  return r.results;
}

export async function getTitikById(id: number, db: D1Database): Promise<TitikPeta | null> {
  return db.prepare(`${SEL} WHERE t.id=?`).bind(id).first<TitikPeta>();
}

export async function createTitikPeta(
  data: TitikPetaInput,
  db: D1Database
): Promise<number> {
  const r = await db.prepare(
    `INSERT INTO titik_peta (lat, lng, jenis, linked_slug, label, deskripsi, cover_media_id)
     VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(
    data.lat, data.lng, data.jenis, data.linked_slug, data.label,
    data.deskripsi, data.cover_media_id
  ).first<{ id: number }>();
  return r!.id;
}

export async function updateTitikPeta(
  id: number,
  data: TitikPetaInput,
  db: D1Database
): Promise<void> {
  await db.prepare(
    `UPDATE titik_peta
       SET lat=?, lng=?, jenis=?, linked_slug=?, label=?, deskripsi=?, cover_media_id=?
     WHERE id=?`
  ).bind(
    data.lat, data.lng, data.jenis, data.linked_slug, data.label,
    data.deskripsi, data.cover_media_id, id
  ).run();
}

export async function deleteTitikPeta(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM titik_peta WHERE id=?').bind(id).run();
}
