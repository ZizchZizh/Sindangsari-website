import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { updateLayanan, getLayananById, layananCachePaths } from '../../../../lib/db/layanan';
import { parseLayananForm } from '../../../../lib/forms/layanan';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const env = getEnv();
  const id = Number(params.id);
  if (!env || !id) return redirect('/admin/layanan');

  const parsed = parseLayananForm(await request.formData());
  if (!parsed.ok) return redirect(`/admin/layanan/${id}?error=${parsed.errors.join(',')}`);

  const existing = await getLayananById(id, env.DB);
  if (!existing) return redirect('/admin/layanan');

  await updateLayanan(id, parsed.data!, env.DB);
  await purgeCache(layananCachePaths(existing.slug));
  return redirect(`/admin/layanan/${id}?saved=1`);
};
