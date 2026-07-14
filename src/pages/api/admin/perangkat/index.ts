import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { createPerangkat, perangkatCachePaths } from '../../../../lib/db/perangkat-desa';
import { parsePerangkatForm } from '../../../../lib/forms/perangkat-desa';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/perangkat?error=1');

  const parsed = parsePerangkatForm(await request.formData());
  if (!parsed.ok) return redirect(`/admin/perangkat?error=${parsed.errors.join(',')}`);

  await createPerangkat(parsed.data!, env.DB);
  await purgeCache(perangkatCachePaths());
  return redirect('/admin/perangkat?saved=1');
};
