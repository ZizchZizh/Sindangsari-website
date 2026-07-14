# Website Desa Sindangsari

Website resmi Desa Sindangsari — dibangun sebagai bagian dari program **KKN-T Inovasi IPB University 2026** di Desa Sindangsari, Kecamatan Kasomalang, Kabupaten Subang, Jawa Barat. Situs ini menampilkan profil desa, potensi (pertanian, pariwisata, ekonomi kreatif), direktori UMKM, peta interaktif, dan berita desa, lengkap dengan panel admin agar perangkat desa dapat mengelola konten sendiri tanpa bantuan teknis.

## Tentang Desa Sindangsari

Desa Sindangsari terletak di dataran tinggi Subang selatan (500–600 mdpl) dengan luas ±305 ha (3 dusun, 7 RW, 24 RT) dan penduduk sekitar 7.600 jiwa. Desa ini merupakan hasil pemekaran Desa Darmaga (Kec. Cisalak) pada tahun 1982. Mata pencaharian utama warganya adalah pertanian (padi, palawija, buah-buahan), ditopang ekonomi kreatif rumah tangga (opak, ranginang, kerupuk, kopi aren) dan potensi ekowisata alam Kasomalang seperti Curug Masigit.

## Tumpukan Teknologi (Tech Stack)

| Lapisan | Teknologi |
|---------|-----------|
| Framework | [Astro 7](https://astro.build) (mode `server` / SSR) |
| Hosting & Runtime | [Cloudflare Workers](https://workers.cloudflare.com) (via `@astrojs/cloudflare`) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) |
| Penyimpanan media | [Cloudflare R2](https://developers.cloudflare.com/r2/) (objek/gambar) |
| Sesi login | [Cloudflare KV](https://developers.cloudflare.com/kv/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Peta | [Leaflet](https://leafletjs.com) + OpenStreetMap |

Pilihan ini menjaga biaya operasional tetap rendah (target ~Rp300 ribu/tahun) dengan memanfaatkan tier gratis Cloudflare.

## Struktur Proyek

```
src/
├── components/      Komponen UI (Layout, Nav, Footer, Button, Card, dll.)
├── lib/
│   ├── auth/        Hashing kata sandi (PBKDF2) & sesi KV
│   ├── db/          Akses data D1 per entitas (wisata, umkm, berita, dll.)
│   ├── cache/       Purge cache halaman publik
│   ├── media/       Pipeline unggah gambar ke R2
│   └── env.ts       Akses binding Cloudflare
├── pages/
│   ├── (publik)     index, profil, potensi, wisata, umkm, peta, berita, kontak
│   ├── admin/       Panel admin (dasbor + kelola konten)
│   └── api/         Endpoint form admin, media, dan cron
└── middleware.ts    Penjaga rute /admin dan /api/admin
migrations/          Skema D1 (0001) + data awal (0002)
public/images/       Aset gambar statis
```

## Model Data

Tabel utama di D1: `admin_user`, `page_section`, `wisata`, `umkm`, `berita`, `media`, `media_link` (relasi media polimorfik), `titik_peta` (pin peta), dan `perangkat_desa` (struktur organisasi). Lihat [`migrations/0001_schema.sql`](migrations/0001_schema.sql) untuk detail lengkap.

## Menjalankan di Lokal

**Prasyarat:** Node.js 20+ dan npm.

```bash
# 1. Pasang dependensi
npm install

# 2. Siapkan database D1 lokal (skema + data awal)
npm run db:setup

# 3. Jalankan server pengembangan (build Astro lalu Wrangler)
npm run dev
```

Situs akan tersedia di `http://localhost:4321`.

> **Catatan login lokal:** tanpa runtime Cloudflare, panel admin menerima `admin` / `admin` hanya untuk pengujian. Kredensial ini **tidak** berlaku di produksi.

## Konfigurasi & Rahasia

- Salin `.dev.vars.example` menjadi `.dev.vars` untuk variabel lingkungan lokal. File `.dev.vars` **tidak boleh** di-commit (sudah ada di `.gitignore`).
- `wrangler.toml` memuat ID resource — pastikan `database_id` (D1) dan `id` (KV) sesuai resource di akun Cloudflare milik desa.
- Rahasia produksi diatur lewat `wrangler secret put NAMA_SECRET`.

## Deploy ke Produksi

```bash
npm run deploy   # astro build && wrangler deploy
```

Sebelum deploy pertama, buat resource Cloudflare berikut dan tempel ID-nya ke `wrangler.toml`:

```bash
wrangler d1 create web-desa-sindangsari-db
wrangler r2 bucket create web-desa-sindangsari-media
wrangler kv namespace create SESSION_KV
```

Situs diarahkan ke domain `sindangsari.web.id` (lihat `routes` di `wrangler.toml`). Backup mingguan otomatis (cron) saat ini **dinonaktifkan** — backup dilakukan manual lewat tombol ekspor di panel admin. Untuk mengaktifkan kembali, isi `crons = ["0 0 * * 0"]` di `wrangler.toml`.

## Panel Admin

- Halaman setup pertama (`/admin/setup`) membuat akun admin awal — hanya bisa dipakai sekali (saat belum ada admin).
- Login di `/admin/login`, lalu kelola konten dari `/admin/dasbor`.
- Kata sandi disimpan sebagai hash PBKDF2 (SHA-256, 100.000 iterasi) dengan salt acak.
- Middleware (`src/middleware.ts`) melindungi seluruh rute `/admin/*` dan `/api/admin/*` dengan sesi KV; percobaan login dibatasi 5 kali per IP per 15 menit.

## Status Pengembangan

Dibangun mengikuti alur perencanaan terstruktur (brief → PRD → UX → arsitektur → epics & stories). Seluruh 30 story implementasi (Epic 1–7) telah dikerjakan; pengamanan API admin (guard sesi, rate limiting login, proteksi kebocoran media) sudah diterapkan.

---

*Dikembangkan oleh tim KKN-T Inovasi IPB University 2026 — Desa Sindangsari, Kecamatan Kasomalang, Kabupaten Subang.*
