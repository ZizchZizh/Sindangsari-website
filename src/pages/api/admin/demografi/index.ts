import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { createDemografi, demografiCachePaths } from '../../../../lib/db/demografi';
import { parseDemografiForm } from '../../../../lib/forms/demografi';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/demografi?error=1');

  const parsed = parseDemografiForm(await request.formData());
  if (!parsed.ok) return redirect(`/admin/demografi?error=${parsed.errors.join(',')}`);

  await createDemografi(parsed.data!, env.DB);
  await purgeCache(demografiCachePaths());
  return redirect('/admin/demografi?saved=1');
};
