export interface PerangkatDesa {
  id: number;
  nama: string;
  jabatan: string;
  urutan: number;
}

/** Field yang dikirim admin; id dibuat DB, jadi tidak ikut. */
export type PerangkatDesaInput = Omit<PerangkatDesa, 'id'>;

/**
 * Jabatan yang dikenali halaman publik.
 *
 * PENTING: `src/pages/pemerintahan.astro` menentukan tingkat bagan struktur
 * dengan mencocokkan STRING pada `jabatan`:
 *   - mengandung 'kepala desa'  → puncak bagan
 *   - mengandung 'sekretaris'   → tingkat kedua
 *   - selain itu                → grid di bawahnya
 * Karena itu daftar ini bukan sekadar kenyamanan — mengetik jabatan bebas
 * berisiko membuat orang muncul di tingkat yang salah. "Kepala Dusun" aman
 * karena yang dicek adalah frasa lengkap 'kepala desa'.
 */
export const JABATAN_UMUM = [
  'Kepala Desa',
  'Sekretaris Desa',
  'Kaur Keuangan',
  'Kaur Umum & TU',
  'Kaur Perencanaan',
  'Kasi Pemerintahan',
  'Kasi Kesejahteraan',
  'Kasi Pelayanan',
  'Kepala Dusun',
  'Staf',
] as const;

/** Halaman publik yang perlu di-purge saat data perangkat berubah. */
export function perangkatCachePaths(): string[] {
  return ['/pemerintahan', '/'];
}

// ── Baca ────────────────────────────────────────────────────────────────────

export async function getPerangkatDesa(db: D1Database): Promise<PerangkatDesa[]> {
  const r = await db.prepare('SELECT * FROM perangkat_desa ORDER BY urutan').all<PerangkatDesa>();
  return r.results;
}

export async function getPerangkatById(id: number, db: D1Database): Promise<PerangkatDesa | null> {
  return db.prepare('SELECT * FROM perangkat_desa WHERE id=?').bind(id).first<PerangkatDesa>();
}

// ── Tulis ───────────────────────────────────────────────────────────────────

export async function createPerangkat(
  data: PerangkatDesaInput,
  db: D1Database
): Promise<{ id: number }> {
  const r = await db
    .prepare('INSERT INTO perangkat_desa (nama, jabatan, urutan) VALUES (?,?,?) RETURNING id')
    .bind(data.nama, data.jabatan, data.urutan)
    .first<{ id: number }>();
  return { id: r!.id };
}

export async function updatePerangkat(
  id: number,
  data: PerangkatDesaInput,
  db: D1Database
): Promise<void> {
  await db
    .prepare('UPDATE perangkat_desa SET nama=?, jabatan=?, urutan=? WHERE id=?')
    .bind(data.nama, data.jabatan, data.urutan, id)
    .run();
}

export async function deletePerangkat(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM perangkat_desa WHERE id=?').bind(id).run();
}
