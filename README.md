# JenjangKarir - Platform Pencarian Lowongan Kerja

## 🚀 Tentang Proyek

JenjangKarir adalah platform pencarian lowongan kerja modern yang dibangun dengan teknologi terkini. Platform ini memungkinkan pencari kerja untuk menemukan lowongan yang sesuai, sementara perusahaan dapat mempromosikan posisi yang mereka tawarkan.

![image](https://github.com/user-attachments/assets/8799b8c2-d172-4cc2-b5ee-fb948d9dc3f7)
![image](https://github.com/user-attachments/assets/6dc624ca-6547-4142-9625-7496c10a7593)
![image](https://github.com/user-attachments/assets/05f19982-dfb7-45fd-acfe-21f1b295231c)
![image](https://github.com/user-attachments/assets/bbcf2478-a2b8-4117-8363-f5740d1c275d)
![Screenshot 2025-04-26 150536](https://github.com/user-attachments/assets/957dcb48-8875-45a9-a508-66d295e346d2)
![Screenshot 2025-04-26 150400](https://github.com/user-attachments/assets/1159e015-8bbe-4748-99ec-2a426d1bdbfa)
![Screenshot 2025-04-26 150508](https://github.com/user-attachments/assets/5415899e-b7ad-4182-89b5-a08a3e79fda6)
![image](https://github.com/user-attachments/assets/54ee8e41-63c8-40dd-91ad-f006bfc64869)

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


