export interface Media {
  id: number;
  r2_key_display: string;
  r2_key_thumb: string;
  alt: string;
  uploaded_at: string;
}

/**
 * URL publik sebuah objek R2. Endpoint /api/media/[...key] hanya menyajikan
 * kunci berawalan `media/` (lihat skill media-r2 — ini perbaikan kebocoran).
 */
export function mediaUrl(key: string): string {
  return `/api/media/${encodeURIComponent(key)}`;
}

export async function getMediaById(id: number, db: D1Database): Promise<Media | null> {
  return db.prepare('SELECT * FROM media WHERE id=?').bind(id).first<Media>();
}

/**
 * Baris entitas yang sudah di-LEFT JOIN ke media untuk sampulnya.
 * Kolomnya null bila entitas belum punya foto sampul.
 */
export interface WithCover {
  cover_media_id: number | null;
  cover_key: string | null;
  cover_thumb_key: string | null;
  cover_alt: string | null;
}

/** Potongan SELECT + JOIN untuk mengambil sampul dalam satu query (hindari N+1). */
export const COVER_SELECT =
  'm.r2_key_display AS cover_key, m.r2_key_thumb AS cover_thumb_key, m.alt AS cover_alt';
export const COVER_JOIN = 'LEFT JOIN media m ON m.id = %TABLE%.cover_media_id';

/** URL sampul, atau null bila belum ada foto — pemanggil menyediakan fallback. */
export function coverUrl(row: Pick<WithCover, 'cover_key'>): string | null {
  return row.cover_key ? mediaUrl(row.cover_key) : null;
}

export async function getMediaForEntity(
  ownerType: string,
  ownerId: number,
  db: D1Database
): Promise<Media[]> {
  const r = await db.prepare(
    `SELECT m.* FROM media m
     JOIN media_link ml ON ml.media_id = m.id
     WHERE ml.owner_type = ? AND ml.owner_id = ?
     ORDER BY ml.sort`
  ).bind(ownerType, ownerId).all<Media>();
  return r.results;
}

export async function linkMedia(
  mediaId: number,
  ownerType: string,
  ownerId: number,
  role: string,
  sort: number,
  db: D1Database
): Promise<void> {
  await db.prepare(
    'INSERT OR IGNORE INTO media_link (media_id, owner_type, owner_id, role, sort) VALUES (?, ?, ?, ?, ?)'
  ).bind(mediaId, ownerType, ownerId, role, sort).run();
}

export async function getAllMedia(db: D1Database): Promise<Media[]> {
  const r = await db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all<Media>();
  return r.results;
}
