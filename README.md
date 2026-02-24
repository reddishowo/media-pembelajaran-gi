# Media Pembelajaran GI (Group Investigation)

Aplikasi web interaktif untuk pembelajaran Biologi berbasis model **Group Investigation (GI)**.
Project ini mendukung alur belajar kolaboratif dari pembentukan kelompok, eksplorasi materi, investigasi, presentasi, hingga evaluasi akhir dengan penyimpanan data ke MongoDB.

## Ringkasan Fitur

- **Dashboard pembuka** dengan capaian pembelajaran dan petunjuk alur GI.
- **Fase Identifikasi**: pembentukan kelompok, pemilihan topik, dan rumusan masalah.
- **Fase Materi**: konten per topik (virus, bakteri, jamur), referensi artikel, area video/infografis.
- **Fase Investigasi**:
  - Form LKPD (perencanaan, analisis, draft laporan).
  - Chat diskusi kelompok real-time sederhana (polling).
- **Fase Presentasi**:
  - Simulasi upload hasil investigasi.
  - Penilaian antar kelompok.
  - Forum kelas global (polling live).
- **Fase Evaluasi**:
  - Kuis pemahaman.
  - Studi kasus (HOTS) + refleksi.
  - Penyimpanan evaluasi individu ke database.

## Tujuan Pembelajaran

Project ini dirancang untuk membantu siswa:

- menganalisis karakteristik mikroorganisme secara ilmiah,
- menghubungkan konsep biologi dengan konteks kehidupan nyata,
- berkolaborasi dan berdiskusi berbasis data,
- melakukan refleksi terhadap proses dan hasil belajar.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS v4 + Lucide Icons
- **Database**: MongoDB (`mongodb` driver)
- **State/Flow**: Client Components + Next.js Server Actions

## Struktur Halaman

- `/` → Dashboard & pengantar modul
- `/identifikasi` → Fase 1: Identifikasi & organisasi kelompok
- `/materi` → Fase 2: Materi pembelajaran per topik
- `/investigasi` → Fase 3: LKPD + diskusi kelompok
- `/presentasi` → Fase 4/5: Presentasi hasil + forum kelas
- `/evaluasi` → Evaluasi kuis, studi kasus, refleksi

## Struktur Folder Inti

```text
src/
  app/
	 actions.ts               # Server actions (CRUD data belajar)
	 page.tsx                 # Landing/dashboard
	 identifikasi/page.tsx    # Form kelompok & topik
	 materi/page.tsx          # Materi per topik
	 investigasi/page.tsx     # LKPD + chat kelompok
	 presentasi/page.tsx      # Upload simulasi + forum kelas
	 evaluasi/page.tsx        # Kuis + refleksi
  lib/
	 mongodb.ts               # Koneksi MongoDB
```

## Kebutuhan Sistem

- Node.js **18.18+** (disarankan Node.js 20 LTS)
- npm / pnpm / yarn
- MongoDB Atlas atau MongoDB lokal

## Instalasi & Menjalankan Lokal

1. Clone repository
	```bash
	git clone <url-repo-anda>
	cd media-pembelajaran-gi
	```

2. Install dependencies
	```bash
	npm install
	```

3. Buat file `.env.local`
	```env
	MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
	```

4. Jalankan development server
	```bash
	npm run dev
	```

5. Buka aplikasi
	```
	http://localhost:3000
	```

## Environment Variables

Project ini membutuhkan:

- `MONGODB_URI` → URI koneksi MongoDB.

> Nama database yang dipakai di aplikasi saat ini: `media_pembelajaran_gi` (diatur di `src/app/actions.ts`).

## Script NPM

- `npm run dev` → Menjalankan mode development
- `npm run build` → Build production
- `npm run start` → Menjalankan hasil build production
- `npm run lint` → Menjalankan ESLint

## Data yang Disimpan ke MongoDB

Collection yang digunakan:

- `groups` → data kelompok + data LKPD
- `chats` → diskusi internal per kelompok
- `forum_kelas` → forum global lintas kelompok
- `evaluations` → hasil kuis + studi kasus + refleksi

## Alur Penggunaan Singkat

1. Siswa membuat data kelompok di halaman **Identifikasi**.
2. Siswa mempelajari konten topik pada halaman **Materi**.
3. Siswa mengisi LKPD dan berdiskusi pada halaman **Investigasi**.
4. Siswa melakukan presentasi dan diskusi kelas pada halaman **Presentasi**.
5. Siswa menyelesaikan kuis dan refleksi pada halaman **Evaluasi**.

## Catatan Pengembangan

- Banyak komponen menggunakan polling interval 2 detik untuk pembaruan chat/forum.
- Session belajar disimpan di browser melalui `localStorage` dengan key utama `gi_session`.
- Aplikasi menggunakan pendekatan client-heavy untuk interaktivitas kelas.

## Deployment

Project dapat di-deploy ke platform yang mendukung Next.js (contoh: Vercel).

Langkah umum:

1. Set environment variable `MONGODB_URI` di dashboard hosting.
2. Jalankan build command:
	```bash
	npm run build
	```
3. Jalankan app production:
	```bash
	npm run start
	```

## Author

- Farriel Arrianta
- Nafisa Syafaqoh
  
Dikembangkan untuk media pembelajaran Biologi berbasis GI.

