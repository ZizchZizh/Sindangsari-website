export interface PageSection {
  slug: string;
  title: string;
  content_html: string;
  cover_r2_key: string | null;
  cover_alt: string | null;
  updated_at: string;
}

/**
 * Halaman publik yang membaca sebuah section, diturunkan dari slug-nya.
 *
 * Beranda ('/') selalu ikut karena ia menampilkan ringkasan lintas-konten.
 *
 * CATATAN: `beranda-hero`, `beranda-sekilas`, dan `potensi` saat ini TIDAK
 * dibaca halaman manapun (index.astro & potensi.astro masih hardcode), jadi
 * menyuntingnya belum mengubah apa pun di situs. Path-nya tetap di-purge di
 * sini agar begitu halaman itu disambungkan ke DB, cache-nya sudah benar.
 */
export function kontenCachePaths(slug: string): string[] {
  const paths = new Set<string>(['/']);

  if (slug.startsWith('profil-')) paths.add('/profil');
  else if (slug.startsWith('pemerintahan-')) paths.add('/pemerintahan');
  else if (slug.startsWith('potensi')) paths.add('/potensi');

  return [...paths];
}

export async function getSection(slug: string, db: D1Database): Promise<PageSection | null> {
  return db.prepare('SELECT * FROM page_section WHERE slug = ?').bind(slug).first<PageSection>();
}

export async function getAllSections(db: D1Database): Promise<PageSection[]> {
  const result = await db.prepare('SELECT * FROM page_section ORDER BY slug').all<PageSection>();
  return result.results;
}

export async function upsertSection(
  slug: string,
  data: { title: string; content_html: string; cover_r2_key?: string | null; cover_alt?: string | null },
  db: D1Database
): Promise<void> {
  await db.prepare(`
    INSERT INTO page_section (slug, title, content_html, cover_r2_key, cover_alt, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      content_html = excluded.content_html,
      cover_r2_key = COALESCE(excluded.cover_r2_key, cover_r2_key),
      cover_alt = COALESCE(excluded.cover_alt, cover_alt),
      updated_at = datetime('now')
  `).bind(slug, data.title, data.content_html, data.cover_r2_key ?? null, data.cover_alt ?? null).run();
}
