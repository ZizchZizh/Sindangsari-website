import type { PerangkatDesaInput } from '../db/perangkat-desa';

export interface ParseResult {
  ok: boolean;
  data?: PerangkatDesaInput;
  /** Nama field yang gagal validasi — dipakai untuk flag ?error= */
  errors: string[];
}

const str = (fd: FormData, key: string): string => ((fd.get(key) as string) ?? '').trim();

/**
 * FormData (dari form Perangkat Desa) → PerangkatDesaInput tervalidasi.
 *
 * Route tambah dan sunting sama-sama lewat sini, jadi bentuk form dan bentuk
 * record tidak pernah menyimpang.
 */
export function parsePerangkatForm(fd: FormData): ParseResult {
  const errors: string[] = [];

  const nama = str(fd, 'nama');
  if (!nama) errors.push('nama');

  // Jabatan bebas diketik (agar desa bisa memakai nomenklatur sendiri, mis.
  // "Kepala Dusun Ciawi"), tapi tetap wajib diisi — halaman publik memakainya
  // untuk menentukan tingkat bagan struktur.
  const jabatan = str(fd, 'jabatan');
  if (!jabatan) errors.push('jabatan');

  const urutanRaw = Number(str(fd, 'urutan'));
  const urutan = Number.isFinite(urutanRaw) ? Math.trunc(urutanRaw) : 0;

  if (errors.length > 0) return { ok: false, errors };

  return { ok: true, errors: [], data: { nama, jabatan, urutan } };
}
