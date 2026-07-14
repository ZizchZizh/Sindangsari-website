import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { saveMedia } from '../../../../lib/media/upload';

/** Batas per-blob SETELAH resize di browser. Gambar 1600px WebP normalnya < 500 KB. */
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Pastikan buffer benar-benar WebP, bukan sekadar diberi nama .webp.
 *
 * Klien sudah mengubah gambar ke WebP lewat canvas, tapi klien tidak boleh
 * dipercaya: siapa pun yang punya sesi admin bisa mem-POST byte apa pun
 * langsung ke endpoint ini. Tanpa cek ini, R2 bisa dipakai menyimpan berkas
 * sembarang yang lalu disajikan publik lewat /api/media/*.
 *
 * Format: "RIFF" (0-3) + ukuran (4-7) + "WEBP" (8-11).
 */
function isWebp(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 12) return false;
  const b = new Uint8Array(buf, 0, 12);
  const tag = (o: number) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);
  return tag(0) === 'RIFF' && tag(8) === 'WEBP';
}

export const POST: APIRoute = async ({ request }) => {
  const env = getEnv();
  if (!env) return new Response('Layanan tidak tersedia.', { status: 503 });

  const fd = await request.formData();
  const display = fd.get('display');
  const thumb = fd.get('thumb');
  const alt = ((fd.get('alt') as string) ?? '').trim().slice(0, 200);

  if (!(display instanceof Blob) || !(thumb instanceof Blob)) {
    return new Response('Berkas gambar tidak lengkap.', { status: 400 });
  }
  if (display.size > MAX_BYTES || thumb.size > MAX_BYTES) {
    return new Response('Ukuran gambar terlalu besar.', { status: 413 });
  }

  const [displayBuf, thumbBuf] = await Promise.all([display.arrayBuffer(), thumb.arrayBuffer()]);
  if (!isWebp(displayBuf) || !isWebp(thumbBuf)) {
    return new Response('Berkas bukan gambar WebP yang sah.', { status: 415 });
  }

  const { id, displayKey, thumbKey } = await saveMedia(
    new Blob([displayBuf], { type: 'image/webp' }),
    new Blob([thumbBuf], { type: 'image/webp' }),
    alt,
    env.DB,
    env.MEDIA_BUCKET
  );

  return new Response(
    JSON.stringify({
      id,
      url: `/api/media/${encodeURIComponent(displayKey)}`,
      thumbUrl: `/api/media/${encodeURIComponent(thumbKey)}`,
      alt,
    }),
    { status: 201, headers: { 'Content-Type': 'application/json' } }
  );
};
