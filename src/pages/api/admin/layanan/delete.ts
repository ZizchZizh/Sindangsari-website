import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { deleteLayanan, getLayananById, layananCachePaths } from '../../../../lib/db/layanan';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  const fd = await request.formData();
  const id = Number(fd.get('id'));
  if (!env || !id) return redirect('/admin/layanan');

  const existing = await getLayananById(id, env.DB);
  await deleteLayanan(id, env.DB);
  await purgeCache(layananCachePaths(existing?.slug));
  return redirect('/admin/layanan?deleted=1');
};
