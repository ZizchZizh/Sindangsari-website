// Must match the domain the Worker serves (see routes in wrangler.toml) —
// cache.delete() only purges entries for this exact origin.
const SITE_ORIGIN = 'https://sindangsari.web.id';

export async function purgeCache(paths: string[]): Promise<void> {
  try {
    const cache = (caches as any).default as Cache | undefined;
    if (!cache) return;
    await Promise.all(
      paths.map(p => cache.delete(new Request(`${SITE_ORIGIN}${p}`)))
    );
  } catch {
    // Cache API not available in local dev — safe to ignore
  }
}
