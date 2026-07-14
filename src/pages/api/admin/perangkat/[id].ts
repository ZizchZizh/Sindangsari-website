import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { updatePerangkat, getPerangkatById, perangkatCachePaths } from '../../../../lib/db/perangkat-desa';
import { parsePerangkatForm } from '../../../../lib/forms/perangkat-desa';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const env = getEnv();
  const id = Number(params.id);
  if (!env || !id) return redirect('/admin/perangkat');

  const parsed = parsePerangkatForm(await request.formData());
  if (!parsed.ok) return redirect(`/admin/perangkat/${id}?error=${parsed.errors.join(',')}`);

  const existing = await getPerangkatById(id, env.DB);
  if (!existing) return redirect('/admin/perangkat');

  await updatePerangkat(id, parsed.data!, env.DB);
  await purgeCache(perangkatCachePaths());
  return redirect(`/admin/perangkat/${id}?saved=1`);
};
