import { toSlug } from './wisata';
import type { WithCover } from './media';

// ── Domain ───────────────────────────────────────────────────────────────────

export const LAYANAN_KATEGORI = [
  'Kependudukan',
  'Surat Keterangan',
  'Pertanahan',
  'Usaha & Ekonomi',
  'Sosial & Bantuan',
  'Lainnya',
] as const;

export type LayananKategori = (typeof LAYANAN_KATEGORI)[number];

/**
 * Ikon Lucide per kategori, dipakai kartu dan halaman detail publik supaya
 * warga mengenali jenis layanan dari bentuknya tanpa harus membaca dulu.
 */
const KATEGORI_ICON: Record<LayananKategori, string> = {
  Kependudukan: 'users',
  'Surat Keterangan': 'file-text',
  Pertanahan: 'map',
  'Usaha & Ekonomi': 'store',
  'Sosial & Bantuan': 'heart-handshake',
  Lainnya: 'folder',
};

/** `kategori` tersimpan sebagai TEXT bebas, jadi baris lama bisa saja di luar allowlist. */
export function kategoriIcon(kategori: string): string {
  return KATEGORI_ICON[kategori as LayananKategori] ?? 'file-text';
}

/** Layanan gratis adalah kabar baik — halaman publik menonjolkannya, bukan menyembunyikannya di teks kecil. */
export function isGratis(biaya: string): boolean {
  return /^\s*(gratis|rp\.?\s*0|0)\s*$/i.test(biaya);
}

/** One step in the procedure a resident follows to obtain the service. */
export interface AlurLangkah {
  judul: string;
  keterangan: string;
}

export interface Layanan extends WithCover {
  id: number;
  slug: string;
  nama: string;
  kategori: string;
  ringkasan: string;
  persyaratan: string[];
  alur: AlurLangkah[];
  biaya: string;
  estimasi_waktu: string;
  dasar_hukum: string | null;
  penanggung_jawab: string | null;
  wa_number: string | null;
  form_url: string | null;
  cover_media_id: number | null;
  urutan: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

/**
 * Everything the caller supplies on create/update — slug and timestamps are
 * derived, and cover_key/thumb/alt are read-only fields that come from the
 * media JOIN (only cover_media_id is settable).
 */
export type LayananInput = Omit<
  Layanan,
  'id' | 'slug' | 'created_at' | 'updated_at' | 'cover_key' | 'cover_thumb_key' | 'cover_alt'
>;

/** Row shape as it actually lives in D1: the two list columns are TEXT holding JSON. */
interface LayananRow extends Omit<Layanan, 'persyaratan' | 'alur'> {
  persyaratan_json: string;
  alur_json: string;
}

// ── Serialization helpers ────────────────────────────────────────────────────
// D1 has no JSON column type, so persyaratan/alur round-trip through TEXT.
// Every parse is defensive: a malformed row must not take the public page down.

function parsePersyaratan(json: string | null): string[] {
  try {
    const v = JSON.parse(json ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '') : [];
  } catch {
    return [];
  }
}

function parseAlur(json: string | null): AlurLangkah[] {
  try {
    const v = JSON.parse(json ?? '[]');
    if (!Array.isArray(v)) return [];
    return v
      .filter((x) => x && typeof x === 'object' && typeof x.judul === 'string' && x.judul.trim() !== '')
      .map((x) => ({ judul: String(x.judul).trim(), keterangan: String(x.keterangan ?? '').trim() }));
  } catch {
    return [];
  }
}

/** DB row → domain object. */
function hydrate(row: LayananRow): Layanan {
  const { persyaratan_json, alur_json, ...rest } = row;
  return {
    ...rest,
    persyaratan: parsePersyaratan(persyaratan_json),
    alur: parseAlur(alur_json),
  };
}

// ── Admin form <-> domain helpers ────────────────────────────────────────────
// The admin edits both lists as plain textareas (one item per line). These four
// functions are the only place that format is defined.

/** Textarea (one requirement per line) → string[]. */
export function parsePersyaratanText(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

/** string[] → textarea value. */
export function formatPersyaratanText(list: string[]): string {
  return list.join('\n');
}

/** Separator between a step's title and its explanation in the admin textarea. */
export const ALUR_SEPARATOR = '::';

/** Textarea (one step per line, `Judul :: Keterangan`) → AlurLangkah[]. */
export function parseAlurText(text: string): AlurLangkah[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^\d+[.)]\s*/, '').replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(ALUR_SEPARATOR);
      if (i === -1) return { judul: line, keterangan: '' };
      return {
        judul: line.slice(0, i).trim(),
        keterangan: line.slice(i + ALUR_SEPARATOR.length).trim(),
      };
    })
    .filter((s) => s.judul !== '');
}

/** AlurLangkah[] → textarea value. */
export function formatAlurText(alur: AlurLangkah[]): string {
  return alur
    .map((s) => (s.keterangan ? `${s.judul} ${ALUR_SEPARATOR} ${s.keterangan}` : s.judul))
    .join('\n');
}

// ── Presentation helpers ─────────────────────────────────────────────────────

/**
 * Pre-filled WhatsApp link for requesting a service. Returns null when the
 * service has no number, so callers can fall back to the office address.
 */
export function waRequestLink(layanan: Pick<Layanan, 'nama' | 'wa_number'>): string | null {
  if (!layanan.wa_number) return null;
  const nomor = layanan.wa_number.replace(/[^0-9]/g, '');
  if (!nomor) return null;
  const pesan = `Halo Admin Desa Sindangsari, saya ingin mengajukan layanan "${layanan.nama}". Mohon informasi persyaratan dan jadwal pelayanannya. Terima kasih.`;
  return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
}

/** Cache paths to purge whenever a service changes. */
export function layananCachePaths(slug?: string | null): string[] {
  const paths = ['/layanan', '/'];
  if (slug) paths.push(`/layanan/${slug}`);
  return paths;
}

// ── Queries ──────────────────────────────────────────────────────────────────

// Poster/pamflet di-JOIN dalam query yang sama agar daftar tidak N+1.
const SEL = `SELECT l.*, m.r2_key_display AS cover_key, m.r2_key_thumb AS cover_thumb_key, m.alt AS cover_alt
             FROM layanan l LEFT JOIN media m ON m.id = l.cover_media_id`;

export async function getPublishedLayanan(db: D1Database): Promise<Layanan[]> {
  const r = await db
    .prepare(`${SEL} WHERE l.status='published' ORDER BY l.urutan, l.nama`)
    .all<LayananRow>();
  return r.results.map(hydrate);
}

export async function getLayananBySlug(slug: string, db: D1Database): Promise<Layanan | null> {
  const row = await db
    .prepare(`${SEL} WHERE l.slug=? AND l.status='published'`)
    .bind(slug)
    .first<LayananRow>();
  return row ? hydrate(row) : null;
}

export async function getAllLayanan(db: D1Database): Promise<Layanan[]> {
  const r = await db.prepare(`${SEL} ORDER BY l.urutan, l.nama`).all<LayananRow>();
  return r.results.map(hydrate);
}

export async function getLayananById(id: number, db: D1Database): Promise<Layanan | null> {
  const row = await db.prepare(`${SEL} WHERE l.id=?`).bind(id).first<LayananRow>();
  return row ? hydrate(row) : null;
}

export async function createLayanan(
  data: LayananInput,
  db: D1Database
): Promise<{ id: number; slug: string }> {
  const baseSlug = toSlug(data.nama);
  let slug = baseSlug;
  let i = 1;
  while (await db.prepare('SELECT id FROM layanan WHERE slug=?').bind(slug).first()) {
    slug = `${baseSlug}-${i++}`;
  }
  const r = await db
    .prepare(
      `INSERT INTO layanan
         (slug,nama,kategori,ringkasan,persyaratan_json,alur_json,biaya,estimasi_waktu,
          dasar_hukum,penanggung_jawab,wa_number,form_url,cover_media_id,urutan,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id`
    )
    .bind(
      slug,
      data.nama,
      data.kategori,
      data.ringkasan,
      JSON.stringify(data.persyaratan),
      JSON.stringify(data.alur),
      data.biaya,
      data.estimasi_waktu,
      data.dasar_hukum,
      data.penanggung_jawab,
      data.wa_number,
      data.form_url,
      data.cover_media_id,
      data.urutan,
      data.status
    )
    .first<{ id: number }>();
  return { id: r!.id, slug };
}

export async function updateLayanan(id: number, data: LayananInput, db: D1Database): Promise<void> {
  await db
    .prepare(
      `UPDATE layanan SET
         nama=?,kategori=?,ringkasan=?,persyaratan_json=?,alur_json=?,biaya=?,estimasi_waktu=?,
         dasar_hukum=?,penanggung_jawab=?,wa_number=?,form_url=?,cover_media_id=?,urutan=?,status=?,
         updated_at=datetime('now')
       WHERE id=?`
    )
    .bind(
      data.nama,
      data.kategori,
      data.ringkasan,
      JSON.stringify(data.persyaratan),
      JSON.stringify(data.alur),
      data.biaya,
      data.estimasi_waktu,
      data.dasar_hukum,
      data.penanggung_jawab,
      data.wa_number,
      data.form_url,
      data.cover_media_id,
      data.urutan,
      data.status,
      id
    )
    .run();
}

export async function deleteLayanan(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM layanan WHERE id=?').bind(id).run();
}
