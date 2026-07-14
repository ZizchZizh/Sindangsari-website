import type { WithCover } from './media';

export interface Wisata extends WithCover {
  id: number;
  slug: string;
  nama: string;
  deskripsi_html: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// Sampul di-JOIN dalam query yang sama agar halaman daftar tidak N+1.
const SEL = `SELECT w.*, m.r2_key_display AS cover_key, m.r2_key_thumb AS cover_thumb_key, m.alt AS cover_alt
             FROM wisata w LEFT JOIN media m ON m.id = w.cover_media_id`;

export async function getPublishedWisata(db: D1Database): Promise<Wisata[]> {
  const r = await db.prepare(`${SEL} WHERE w.status='published' ORDER BY w.nama`).all<Wisata>();
  return r.results;
}

export async function getWisataBySlug(slug: string, db: D1Database): Promise<Wisata | null> {
  return db.prepare(`${SEL} WHERE w.slug = ? AND w.status = 'published'`).bind(slug).first<Wisata>();
}

export async function getAllWisata(db: D1Database): Promise<Wisata[]> {
  const r = await db.prepare(`${SEL} ORDER BY w.updated_at DESC`).all<Wisata>();
  return r.results;
}

export async function getWisataById(id: number, db: D1Database): Promise<Wisata | null> {
  return db.prepare(`${SEL} WHERE w.id = ?`).bind(id).first<Wisata>();
}

export function toSlug(nama: string): string {
  return nama.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createWisata(
  data: { nama: string; deskripsi_html: string; status: string; cover_media_id: number | null },
  db: D1Database
): Promise<{ id: number; slug: string }> {
  const baseSlug = toSlug(data.nama);
  let slug = baseSlug;
  let i = 1;
  while (await db.prepare('SELECT id FROM wisata WHERE slug = ?').bind(slug).first()) {
    slug = `${baseSlug}-${i++}`;
  }
  const r = await db.prepare(
    "INSERT INTO wisata (slug, nama, deskripsi_html, status, cover_media_id) VALUES (?, ?, ?, ?, ?) RETURNING id"
  ).bind(slug, data.nama, data.deskripsi_html, data.status, data.cover_media_id)
   .first<{ id: number }>();
  return { id: r!.id, slug };
}

export async function updateWisata(
  id: number,
  data: { nama: string; deskripsi_html: string; status: string; cover_media_id: number | null },
  db: D1Database
): Promise<void> {
  await db.prepare(
    "UPDATE wisata SET nama=?, deskripsi_html=?, status=?, cover_media_id=?, updated_at=datetime('now') WHERE id=?"
  ).bind(data.nama, data.deskripsi_html, data.status, data.cover_media_id, id).run();
}

export async function deleteWisata(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM media_link WHERE owner_type=? AND owner_id=?').bind('wisata', id).run();
  await db.prepare('DELETE FROM wisata WHERE id=?').bind(id).run();
}
