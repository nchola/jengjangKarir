# JenjangKarir - Platform Pencarian Lowongan Kerja

## 🚀 Tentang Proyek

JenjangKarir adalah platform pencarian lowongan kerja modern yang dibangun dengan teknologi terkini. Platform ini memungkinkan pencari kerja untuk menemukan lowongan yang sesuai, sementara perusahaan dapat mempromosikan posisi yang mereka tawarkan.

## 🛠 Teknologi yang Digunakan

### Frontend
- **Next.js 15** - Framework React untuk aplikasi web modern
- **React 19** - Library JavaScript untuk membangun antarmuka pengguna
- **TypeScript** - Superset JavaScript dengan pengetikan statis
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Komponen UI yang dapat diakses
- **Framer Motion** - Library animasi
- **React Hook Form** - Manajemen form
- **Zod** - Validasi schema

### Backend & Database
- **Supabase** - Backend-as-a-Service dengan PostgreSQL
- **PostgreSQL** - Database relasional
- **Prisma** - ORM untuk TypeScript

### Fitur Keamanan
- **bcryptjs** - Enkripsi password
- **NextAuth.js** - Autentikasi
- **CORS** - Keamanan lintas domain

## 🏗 Arsitektur & Teknik Implementasi

### 1. Database & Query Optimization
- **Indexing**: Implementasi indeks untuk optimasi pencarian
  ```sql
  CREATE INDEX idx_jobs_title ON jobs (title);
  CREATE INDEX idx_jobs_location ON jobs (location);
  ```
- **Query Builder Pattern**: Implementasi pattern untuk membangun query yang fleksibel
- **Relasi Database**: Struktur relasi yang terorganisir antara tabel jobs, companies, dan categories

### 2. Caching & Performa
- **Server-Side Rendering (SSR)**: Implementasi Next.js untuk rendering di server
- **Static Site Generation (SSG)**: Untuk halaman yang jarang berubah
- **Incremental Static Regeneration (ISR)**: Untuk konten yang perlu diperbarui secara berkala

### 3. Keamanan
- **Environment Variables**: Pengelolaan konfigurasi sensitif
- **Role-Based Access Control**: Pembagian akses berdasarkan peran
- **Data Validation**: Validasi input dengan Zod

### 4. UX/UI
- **Responsive Design**: Tampilan yang responsif untuk semua perangkat
- **Dark Mode**: Dukungan tema gelap
- **Accessibility**: Komponen yang dapat diakses dengan Radix UI
- **Animasi**: Transisi dan animasi dengan Framer Motion

## 📁 Struktur Proyek

```
jengjangkarir/
├── app/                    # Halaman aplikasi Next.js
│   ├── admin/             # Panel admin
│   ├── jobs/              # Halaman lowongan
│   └── companies/         # Halaman perusahaan
├── components/            # Komponen UI
├── lib/                   # Utilitas dan helpers
├── types/                 # TypeScript types
├── public/               # Aset statis
└── sql/                  # Skrip SQL
```

## 🚀 Fitur Utama

1. **Pencarian Lowongan**
   - Filter berdasarkan kategori, lokasi, dan tipe pekerjaan
   - Pencarian teks bebas
   - Paginasi hasil pencarian

2. **Manajemen Perusahaan**
   - Profil perusahaan
   - Posting lowongan
   - Manajemen aplikasi

3. **Panel Admin**
   - Manajemen lowongan
   - Manajemen perusahaan
   - Manajemen kategori
   - Diagnostik sistem

4. **Fitur Pengguna**
   - Simpan lowongan favorit
   - Lamaran pekerjaan
   - Notifikasi

## �� Instalasi & Setup

1. Clone repositori
```bash
git clone https://github.com/username/jengjangkarir.git
cd jengjangkarir
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Jalankan development server
```bash
npm run dev
```

## 📝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk diskusi.

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## 📞 Kontak

[Your Name] - [your.email@example.com]

Project Link: [https://github.com/yourusername/jengjangkarir](https://github.com/yourusername/jengjangkarir) 
