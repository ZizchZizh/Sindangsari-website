/**
 * Unggah gambar dari browser.
 *
 * KENAPA resize di klien: Cloudflare Workers tidak bisa menjalankan `sharp`
 * atau pustaka pemroses gambar lain. Jadi gambar dikecilkan dan dikonversi ke
 * WebP di browser memakai canvas, baru dikirim ke server. Ini juga menghemat
 * kuota R2 gratis dan mempercepat unggah di sinyal desa yang lemah.
 */

const MAX_DISPLAY = 1600; // lebar maks gambar tampil
const MAX_THUMB = 480;    // lebar maks thumbnail
const QUALITY = 0.82;

/** Batas ukuran berkas ASLI sebelum diproses — mencegah browser hang di HP kentang. */
const MAX_SOURCE_BYTES = 15 * 1024 * 1024; // 15 MB

export interface UploadedMedia {
  id: number;
  url: string;
  thumbUrl: string;
  alt: string;
}

/** Turunkan alt text yang masuk akal dari nama berkas. */
function altFromFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  return base || 'Gambar';
}

/** Kecilkan bitmap ke lebar maksimum tertentu (tidak pernah memperbesar). */
async function toWebpBlob(bitmap: ImageBitmap, maxWidth: number): Promise<Blob> {
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas tidak tersedia di peramban ini.');
  ctx.drawImage(bitmap, 0, 0, w, h);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Gagal mengubah gambar ke WebP.'))),
      'image/webp',
      QUALITY
    );
  });
}

/**
 * Proses satu File dari <input type="file"> lalu unggah ke /api/admin/media.
 *
 * Melempar Error berbahasa Indonesia agar bisa langsung ditampilkan ke operator desa.
 */
export async function uploadImage(file: File, altOverride?: string): Promise<UploadedMedia> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Berkas harus berupa gambar (JPG, PNG, atau WebP).');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Ukuran gambar terlalu besar (maksimal 15 MB).');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('Gambar tidak dapat dibaca. Coba berkas lain.');
  }

  const [display, thumb] = await Promise.all([
    toWebpBlob(bitmap, MAX_DISPLAY),
    toWebpBlob(bitmap, MAX_THUMB),
  ]);
  bitmap.close();

  const alt = (altOverride ?? '').trim() || altFromFilename(file.name);

  const fd = new FormData();
  fd.append('display', display, 'display.webp');
  fd.append('thumb', thumb, 'thumb.webp');
  fd.append('alt', alt);

  const res = await fetch('/api/admin/media', { method: 'POST', body: fd });

  if (res.status === 401) {
    throw new Error('Sesi Anda sudah berakhir. Muat ulang halaman lalu masuk kembali.');
  }
  if (!res.ok) {
    const pesan = await res.text().catch(() => '');
    throw new Error(pesan || 'Gagal mengunggah gambar. Coba lagi.');
  }

  return (await res.json()) as UploadedMedia;
}
