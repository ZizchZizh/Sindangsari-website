// ── Domain ───────────────────────────────────────────────────────────────────

export interface DemografiRT {
  id: number;
  dusun: string;
  rw: string;
  rt: string;
  laki_laki: number;
  perempuan: number;
  jumlah_kk: number;
  urutan: number;
  created_at: string;
  updated_at: string;
}

/** Field yang dikirim admin; id & timestamp dibuat DB, jadi tidak ikut. */
export type DemografiInput = Omit<DemografiRT, 'id' | 'created_at' | 'updated_at'>;

/** Total penduduk selalu diturunkan dari L+P, tidak pernah disimpan. */
export function totalPenduduk(d: Pick<DemografiRT, 'laki_laki' | 'perempuan'>): number {
  return d.laki_laki + d.perempuan;
}

/** Ringkasan agregat untuk kartu statistik & grafik komposisi di halaman publik. */
export interface DemografiRingkasan {
  totalPenduduk: number;
  totalLaki: number;
  totalPerempuan: number;
  totalKK: number;
  jumlahRT: number;
}

export function ringkasDemografi(rows: DemografiRT[]): DemografiRingkasan {
  return rows.reduce<DemografiRingkasan>(
    (acc, r) => ({
      totalPenduduk: acc.totalPenduduk + totalPenduduk(r),
      totalLaki: acc.totalLaki + r.laki_laki,
      totalPerempuan: acc.totalPerempuan + r.perempuan,
      totalKK: acc.totalKK + r.jumlah_kk,
      jumlahRT: acc.jumlahRT + 1,
    }),
    { totalPenduduk: 0, totalLaki: 0, totalPerempuan: 0, totalKK: 0, jumlahRT: 0 }
  );
}

/** Halaman publik yang perlu di-purge saat data demografi berubah. */
export function demografiCachePaths(): string[] {
  return ['/profil', '/'];
}

// ── Baca ────────────────────────────────────────────────────────────────────

export async function getAllDemografi(db: D1Database): Promise<DemografiRT[]> {
  const r = await db
    .prepare('SELECT * FROM demografi_rt ORDER BY urutan, dusun, rw, rt')
    .all<DemografiRT>();
  return r.results;
}

export async function getDemografiById(id: number, db: D1Database): Promise<DemografiRT | null> {
  return db.prepare('SELECT * FROM demografi_rt WHERE id=?').bind(id).first<DemografiRT>();
}

// ── Tulis ───────────────────────────────────────────────────────────────────

export async function createDemografi(
  data: DemografiInput,
  db: D1Database
): Promise<{ id: number }> {
  const r = await db
    .prepare(
      `INSERT INTO demografi_rt (dusun, rw, rt, laki_laki, perempuan, jumlah_kk, urutan)
       VALUES (?,?,?,?,?,?,?) RETURNING id`
    )
    .bind(data.dusun, data.rw, data.rt, data.laki_laki, data.perempuan, data.jumlah_kk, data.urutan)
    .first<{ id: number }>();
  return { id: r!.id };
}

export async function updateDemografi(
  id: number,
  data: DemografiInput,
  db: D1Database
): Promise<void> {
  await db
    .prepare(
      `UPDATE demografi_rt
         SET dusun=?, rw=?, rt=?, laki_laki=?, perempuan=?, jumlah_kk=?, urutan=?,
             updated_at=datetime('now')
       WHERE id=?`
    )
    .bind(data.dusun, data.rw, data.rt, data.laki_laki, data.perempuan, data.jumlah_kk, data.urutan, id)
    .run();
}

export async function deleteDemografi(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM demografi_rt WHERE id=?').bind(id).run();
}
