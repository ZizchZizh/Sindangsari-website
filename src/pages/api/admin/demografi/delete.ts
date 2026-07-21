import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { deleteDemografi, demografiCachePaths } from '../../../../lib/db/demografi';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  const fd = await request.formData();
  const id = Number(fd.get('id'));
  if (!env || !id) return redirect('/admin/demografi');

  await deleteDemografi(id, env.DB);
  await purgeCache(demografiCachePaths());
  return redirect('/admin/demografi?deleted=1');
};
