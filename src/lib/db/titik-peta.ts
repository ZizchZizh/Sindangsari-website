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

export interface TitikPeta {
  id: number;
  lat: number;
  lng: number;
  jenis: JenisTitik;
  linked_slug: string;
  label: string | null;
}

export async function getAllTitikPeta(db: D1Database): Promise<TitikPeta[]> {
  const r = await db.prepare('SELECT * FROM titik_peta ORDER BY id').all<TitikPeta>();
  return r.results;
}

export async function createTitikPeta(
  data: Omit<TitikPeta, 'id'>,
  db: D1Database
): Promise<number> {
  const r = await db.prepare(
    'INSERT INTO titik_peta (lat, lng, jenis, linked_slug, label) VALUES (?, ?, ?, ?, ?) RETURNING id'
  ).bind(data.lat, data.lng, data.jenis, data.linked_slug, data.label).first<{ id: number }>();
  return r!.id;
}

export async function updateTitikPeta(
  id: number,
  data: Omit<TitikPeta, 'id'>,
  db: D1Database
): Promise<void> {
  await db.prepare(
    'UPDATE titik_peta SET lat=?, lng=?, jenis=?, linked_slug=?, label=? WHERE id=?'
  ).bind(data.lat, data.lng, data.jenis, data.linked_slug, data.label, id).run();
}

export async function deleteTitikPeta(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM titik_peta WHERE id=?').bind(id).run();
}
