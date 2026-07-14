import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { createLayanan, layananCachePaths } from '../../../../lib/db/layanan';
import { parseLayananForm } from '../../../../lib/forms/layanan';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/layanan/new?error=1');

  const parsed = parseLayananForm(await request.formData());
  if (!parsed.ok) return redirect(`/admin/layanan/new?error=${parsed.errors.join(',')}`);

  const { id, slug } = await createLayanan(parsed.data!, env.DB);
  await purgeCache(layananCachePaths(slug));
  return redirect(`/admin/layanan/${id}?saved=1`);
};
