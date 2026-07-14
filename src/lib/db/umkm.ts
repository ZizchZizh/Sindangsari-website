import { toSlug } from './wisata';
import type { WithCover } from './media';

export interface Umkm extends WithCover {
  id: number;
  slug: string;
  nama: string;
  kategori: string;
  deskripsi_html: string;
  lokasi: string | null;
  wa_number: string | null;
  telepon: string | null;
  google_maps_url: string | null;
  qris_r2_key: string | null;
  toko_online_url: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// Sampul di-JOIN dalam query yang sama agar halaman daftar tidak N+1.
const SEL = `SELECT u.*, m.r2_key_display AS cover_key, m.r2_key_thumb AS cover_thumb_key, m.alt AS cover_alt
             FROM umkm u LEFT JOIN media m ON m.id = u.cover_media_id`;

export async function getPublishedUmkm(db: D1Database): Promise<Umkm[]> {
  const r = await db.prepare(`${SEL} WHERE u.status='published' ORDER BY u.nama`).all<Umkm>();
  return r.results;
}

export async function getUmkmBySlug(slug: string, db: D1Database): Promise<Umkm | null> {
  return db.prepare(`${SEL} WHERE u.slug=? AND u.status='published'`).bind(slug).first<Umkm>();
}

export async function getAllUmkm(db: D1Database): Promise<Umkm[]> {
  const r = await db.prepare(`${SEL} ORDER BY u.updated_at DESC`).all<Umkm>();
  return r.results;
}

export async function getUmkmById(id: number, db: D1Database): Promise<Umkm | null> {
  return db.prepare(`${SEL} WHERE u.id=?`).bind(id).first<Umkm>();
}

export async function createUmkm(
  data: Omit<Umkm, 'id' | 'slug' | 'created_at' | 'updated_at'>,
  db: D1Database
): Promise<{ id: number; slug: string }> {
  const baseSlug = toSlug(data.nama);
  let slug = baseSlug;
  let i = 1;
  while (await db.prepare('SELECT id FROM umkm WHERE slug=?').bind(slug).first()) {
    slug = `${baseSlug}-${i++}`;
  }
  const r = await db.prepare(
    `INSERT INTO umkm (slug,nama,kategori,deskripsi_html,lokasi,wa_number,telepon,google_maps_url,qris_r2_key,toko_online_url,status,cover_media_id)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id`
  ).bind(slug, data.nama, data.kategori, data.deskripsi_html, data.lokasi, data.wa_number,
         data.telepon, data.google_maps_url, data.qris_r2_key, data.toko_online_url, data.status,
         data.cover_media_id)
   .first<{ id: number }>();
  return { id: r!.id, slug };
}

export async function updateUmkm(
  id: number,
  data: Omit<Umkm, 'id' | 'slug' | 'created_at' | 'updated_at'>,
  db: D1Database
): Promise<void> {
  await db.prepare(
    `UPDATE umkm SET nama=?,kategori=?,deskripsi_html=?,lokasi=?,wa_number=?,telepon=?,
     google_maps_url=?,qris_r2_key=?,toko_online_url=?,status=?,cover_media_id=?,
     updated_at=datetime('now')
     WHERE id=?`
  ).bind(data.nama, data.kategori, data.deskripsi_html, data.lokasi, data.wa_number,
         data.telepon, data.google_maps_url, data.qris_r2_key, data.toko_online_url,
         data.status, data.cover_media_id, id).run();
}

export async function deleteUmkm(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM media_link WHERE owner_type=? AND owner_id=?').bind('umkm', id).run();
  await db.prepare('DELETE FROM umkm WHERE id=?').bind(id).run();
}
