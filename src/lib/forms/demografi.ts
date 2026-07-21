import type { DemografiInput } from '../db/demografi';

export interface ParseResult {
  ok: boolean;
  data?: DemografiInput;
  /** Nama field yang gagal validasi — dipakai untuk flag ?error= */
  errors: string[];
}

const str = (fd: FormData, key: string): string => ((fd.get(key) as string) ?? '').trim();

/** Angka penduduk/KK: bilangan bulat ≥ 0. Nilai kosong/aneh → 0. */
const nonNegInt = (fd: FormData, key: string): number => {
  const n = Number(str(fd, key));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.trunc(n);
};

/**
 * FormData (dari form Demografi) → DemografiInput tervalidasi.
 *
 * Route tambah dan sunting sama-sama lewat sini, jadi bentuk form dan bentuk
 * record tidak pernah menyimpang.
 */
export function parseDemografiForm(fd: FormData): ParseResult {
  const errors: string[] = [];

  const dusun = str(fd, 'dusun');
  const rw = str(fd, 'rw');
  const rt = str(fd, 'rt');

  // Baris harus punya identitas — minimal salah satu dari dusun/RW/RT terisi,
  // kalau tidak baris jadi tak bermakna di tabel & grafik.
  if (!dusun && !rw && !rt) errors.push('identitas');

  const laki_laki = nonNegInt(fd, 'laki_laki');
  const perempuan = nonNegInt(fd, 'perempuan');
  const jumlah_kk = nonNegInt(fd, 'jumlah_kk');

  const urutanRaw = Number(str(fd, 'urutan'));
  const urutan = Number.isFinite(urutanRaw) ? Math.trunc(urutanRaw) : 0;

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors: [],
    data: { dusun, rw, rt, laki_laki, perempuan, jumlah_kk, urutan },
  };
}
