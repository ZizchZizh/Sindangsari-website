import { toSlug } from './wisata';
import type { WithCover } from './media';

export interface Berita extends WithCover {
  id: number;
  slug: string;
  judul: string;
  content_html: string;
  cover_media_id: number | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Sampul di-JOIN dalam query yang sama agar halaman daftar tidak N+1.
const SEL = `SELECT b.*, m.r2_key_display AS cover_key, m.r2_key_thumb AS cover_thumb_key, m.alt AS cover_alt
             FROM berita b LEFT JOIN media m ON m.id = b.cover_media_id`;

export async function getPublishedBerita(db: D1Database, limit = 100): Promise<Berita[]> {
  const r = await db
    .prepare(`${SEL} WHERE b.status='published' ORDER BY b.published_at DESC LIMIT ?`)
    .bind(limit).all<Berita>();
  return r.results;
}

export async function getBeritaBySlug(slug: string, db: D1Database): Promise<Berita | null> {
  return db.prepare(`${SEL} WHERE b.slug=? AND b.status='published'`).bind(slug).first<Berita>();
}

export async function getAllBerita(db: D1Database): Promise<Berita[]> {
  const r = await db.prepare(`${SEL} ORDER BY b.updated_at DESC`).all<Berita>();
  return r.results;
}

export async function getBeritaById(id: number, db: D1Database): Promise<Berita | null> {
  return db.prepare(`${SEL} WHERE b.id=?`).bind(id).first<Berita>();
}

export function formatTanggal(iso: string): string {
  const d = new Date(iso);
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function excerpt(html: string, len = 140): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > len ? text.slice(0, len) + '…' : text;
}

export async function createBerita(
  data: { judul: string; content_html: string; cover_media_id: number | null; status: string },
  db: D1Database
): Promise<{ id: number; slug: string }> {
  const baseSlug = toSlug(data.judul);
  let slug = baseSlug;
  let i = 1;
  while (await db.prepare('SELECT id FROM berita WHERE slug=?').bind(slug).first()) {
    slug = `${baseSlug}-${i++}`;
  }
  const published_at = data.status === 'published' ? new Date().toISOString() : null;
  const r = await db.prepare(
    'INSERT INTO berita (slug,judul,content_html,cover_media_id,status,published_at) VALUES (?,?,?,?,?,?) RETURNING id'
  ).bind(slug, data.judul, data.content_html, data.cover_media_id, data.status, published_at)
   .first<{ id: number }>();
  return { id: r!.id, slug };
}

export async function updateBerita(
  id: number,
  data: { judul: string; content_html: string; cover_media_id: number | null; status: string },
  db: D1Database
): Promise<void> {
  const existing = await db.prepare('SELECT status, published_at FROM berita WHERE id=?').bind(id).first<{ status: string; published_at: string | null }>();
  const published_at = data.status === 'published' && existing?.status !== 'published'
    ? new Date().toISOString()
    : existing?.published_at ?? null;
  await db.prepare(
    "UPDATE berita SET judul=?,content_html=?,cover_media_id=?,status=?,published_at=?,updated_at=datetime('now') WHERE id=?"
  ).bind(data.judul, data.content_html, data.cover_media_id, data.status, published_at, id).run();
}

export async function deleteBerita(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM berita WHERE id=?').bind(id).run();
}
