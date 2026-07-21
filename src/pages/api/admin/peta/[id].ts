import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { updateTitikPeta, getTitikById, JENIS_TITIK_KEYS } from '../../../../lib/db/titik-peta';
import type { JenisTitik } from '../../../../lib/db/titik-peta';
import { parseCoverId } from '../../../../lib/forms/cover';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const env = getEnv();
  const id = Number(params.id);
  if (!env || !id) return redirect('/admin/peta');

  const fd = await request.formData();
  const lat = parseFloat(fd.get('lat') as string);
  const lng = parseFloat(fd.get('lng') as string);
  const jenis = (fd.get('jenis') as string)?.trim() as JenisTitik;
  const linked_slug = (fd.get('linked_slug') as string)?.trim() || '';
  const label = (fd.get('label') as string)?.trim() || null;
  const deskripsi = (fd.get('deskripsi') as string)?.trim() || null;
  const cover_media_id = parseCoverId(fd);

  if (isNaN(lat) || isNaN(lng) || !JENIS_TITIK_KEYS.includes(jenis)) {
    return redirect(`/admin/peta/${id}?error=1`);
  }

  const existing = await getTitikById(id, env.DB);
  if (!existing) return redirect('/admin/peta');

  await updateTitikPeta(id, { lat, lng, jenis, linked_slug, label, deskripsi, cover_media_id }, env.DB);
  await purgeCache(['/peta', '/']);
  return redirect(`/admin/peta/${id}?saved=1`);
};
