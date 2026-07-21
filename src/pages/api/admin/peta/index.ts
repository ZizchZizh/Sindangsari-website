import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { createTitikPeta, JENIS_TITIK_KEYS } from '../../../../lib/db/titik-peta';
import type { JenisTitik } from '../../../../lib/db/titik-peta';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  const fd = await request.formData();
  const lat = parseFloat(fd.get('lat') as string);
  const lng = parseFloat(fd.get('lng') as string);
  const jenis = (fd.get('jenis') as string)?.trim() as JenisTitik;
  // Slug hanya relevan untuk jenis yang punya halaman detail; fasilitas umum
  // menyimpan string kosong (kolom linked_slug NOT NULL, jadi bukan null).
  const linked_slug = (fd.get('linked_slug') as string)?.trim() || '';
  const label = (fd.get('label') as string)?.trim() || null;

  // Allowlist jenis — kolom `jenis` di DB tidak punya CHECK, jadi ini penegaknya.
  if (!env || isNaN(lat) || isNaN(lng) || !JENIS_TITIK_KEYS.includes(jenis)) {
    return redirect('/admin/peta?error=1');
  }

  await createTitikPeta({ lat, lng, jenis, linked_slug, label }, env.DB);
  await purgeCache(['/peta', '/']);
  return redirect('/admin/peta?saved=1');
};
