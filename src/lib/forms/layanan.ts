import {
  parsePersyaratanText,
  parseAlurText,
  LAYANAN_KATEGORI,
  type LayananInput,
} from '../db/layanan';
import { parseCoverId } from './cover';

export interface ParseResult {
  ok: boolean;
  data?: LayananInput;
  /** Field names that failed validation — used to drive the ?error= flag. */
  errors: string[];
}

const str = (fd: FormData, key: string): string => ((fd.get(key) as string) ?? '').trim();
const nullable = (fd: FormData, key: string): string | null => str(fd, key) || null;

/**
 * FormData (from the admin Layanan form) → validated LayananInput.
 *
 * Both the create and the update route go through here, so the shape of the
 * form and the shape of the record can never drift apart.
 */
export function parseLayananForm(fd: FormData): ParseResult {
  const errors: string[] = [];

  const nama = str(fd, 'nama');
  if (!nama) errors.push('nama');

  const kategori = str(fd, 'kategori');
  if (!kategori || !LAYANAN_KATEGORI.includes(kategori as (typeof LAYANAN_KATEGORI)[number])) {
    errors.push('kategori');
  }

  const persyaratan = parsePersyaratanText(str(fd, 'persyaratan'));
  if (persyaratan.length === 0) errors.push('persyaratan');

  const alur = parseAlurText(str(fd, 'alur'));
  if (alur.length === 0) errors.push('alur');

  const status = str(fd, 'status') === 'published' ? 'published' : 'draft';

  const urutanRaw = Number(str(fd, 'urutan'));
  const urutan = Number.isFinite(urutanRaw) ? Math.trunc(urutanRaw) : 0;

  // WhatsApp numbers are stored digits-only so wa.me links always build cleanly.
  const waRaw = nullable(fd, 'wa_number');
  const wa_number = waRaw ? waRaw.replace(/[^0-9]/g, '') || null : null;

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors: [],
    data: {
      nama,
      kategori,
      ringkasan: str(fd, 'ringkasan'),
      persyaratan,
      alur,
      biaya: str(fd, 'biaya') || 'Gratis',
      estimasi_waktu: str(fd, 'estimasi_waktu') || '1–2 hari kerja',
      dasar_hukum: nullable(fd, 'dasar_hukum'),
      penanggung_jawab: nullable(fd, 'penanggung_jawab'),
      wa_number,
      form_url: nullable(fd, 'form_url'),
      cover_media_id: parseCoverId(fd),
      urutan,
      status,
    },
  };
}
