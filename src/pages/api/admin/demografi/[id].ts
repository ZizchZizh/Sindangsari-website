import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { updateDemografi, getDemografiById, demografiCachePaths } from '../../../../lib/db/demografi';
import { parseDemografiForm } from '../../../../lib/forms/demografi';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const env = getEnv();
  const id = Number(params.id);
  if (!env || !id) return redirect('/admin/demografi');

  const parsed = parseDemografiForm(await request.formData());
  if (!parsed.ok) return redirect(`/admin/demografi/${id}?error=${parsed.errors.join(',')}`);

  const existing = await getDemografiById(id, env.DB);
  if (!existing) return redirect('/admin/demografi');

  await updateDemografi(id, parsed.data!, env.DB);
  await purgeCache(demografiCachePaths());
  return redirect(`/admin/demografi/${id}?saved=1`);
};
