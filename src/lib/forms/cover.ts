/**
 * Ambil `cover_media_id` dari FormData admin.
 *
 * Komponen `MediaInput.astro` mengirim hidden input bernama `cover_media_id`:
 * berisi angka bila ada foto, atau string kosong bila operator melepas fotonya.
 * String kosong → null, artinya sampul dilepas (bukan "biarkan seperti semula").
 */
export function parseCoverId(fd: FormData): number | null {
  const raw = ((fd.get('cover_media_id') as string) ?? '').trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}
