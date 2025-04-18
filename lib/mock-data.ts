import { slugify } from "./utils"
import type { JobWithRelations, JobCategory, Company } from "@/types/job"
import type { Article } from "@/types/article"

// Mock categories
export const mockCategories: JobCategory[] = [
  {
    id: 1,
    name: "Teknologi Informasi",
    slug: "teknologi-informasi",
    icon: "💻",
    job_count: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Keuangan",
    slug: "keuangan",
    icon: "💰",
    job_count: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Marketing",
    slug: "marketing",
    icon: "📊",
    job_count: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Desain",
    slug: "desain",
    icon: "🎨",
    job_count: 1,
    created_at: new Date().toISOString(),
  },
]

// Mock companies
export const mockCompanies: Company[] = [
  {
    id: 1,
    name: "Tech Innovators",
    slug: "tech-innovators",
    logo_url: "/placeholder.svg?height=56&width=56",
    location: "Jakarta",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Finance Solutions",
    slug: "finance-solutions",
    logo_url: "/placeholder.svg?height=56&width=56",
    location: "Surabaya",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Creative Agency",
    slug: "creative-agency",
    logo_url: "/placeholder.svg?height=56&width=56",
    location: "Bandung",
    created_at: new Date().toISOString(),
  },
]

// Mock jobs
export const mockJobs: JobWithRelations[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    slug: "senior-frontend-developer",
    company_id: 1,
    location: "Jakarta",
    job_type: "full-time",
    salary_display: "Rp 15-25 juta/bulan",
    description:
      "Kami mencari Senior Frontend Developer yang berpengalaman dalam React dan Next.js untuk bergabung dengan tim kami.",
    requirements:
      "- Minimal 3 tahun pengalaman dengan React\n- Familiar dengan Next.js dan TypeScript\n- Memahami state management seperti Redux atau Context API\n- Pengalaman dengan CSS-in-JS seperti Styled Components atau Emotion",
    responsibilities:
      "- Mengembangkan dan memelihara aplikasi web yang responsif\n- Berkolaborasi dengan tim desain dan backend\n- Mengoptimalkan aplikasi untuk kinerja maksimal\n- Menulis kode yang bersih, terstruktur, dan dapat diuji",
    category_id: 1,
    is_featured: true,
    status: "active",
    posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    company: mockCompanies[0],
    category: mockCategories[0],
  },
  {
    id: 2,
    title: "Financial Analyst",
    slug: "financial-analyst",
    company_id: 2,
    location: "Surabaya",
    job_type: "full-time",
    salary_display: "Rp 10-15 juta/bulan",
    description:
      "Finance Solutions mencari Financial Analyst untuk menganalisis data keuangan dan memberikan rekomendasi strategis.",
    requirements:
      "- Gelar S1 di bidang Keuangan, Akuntansi, atau bidang terkait\n- Minimal 2 tahun pengalaman sebagai Financial Analyst\n- Kemampuan analitis yang kuat\n- Mahir menggunakan Excel dan tools analisis keuangan",
    responsibilities:
      "- Menganalisis data keuangan dan tren pasar\n- Menyiapkan laporan keuangan bulanan dan tahunan\n- Mengembangkan model keuangan untuk proyeksi\n- Memberikan rekomendasi untuk pengambilan keputusan",
    category_id: 2,
    is_featured: false,
    status: "active",
    posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    company: mockCompanies[1],
    category: mockCategories[1],
  },
  {
    id: 3,
    title: "Digital Marketing Specialist",
    slug: "digital-marketing-specialist",
    company_id: 3,
    location: "Bandung",
    job_type: "full-time",
    salary_display: "Rp 8-12 juta/bulan",
    description:
      "Creative Agency mencari Digital Marketing Specialist untuk mengelola kampanye pemasaran digital klien kami.",
    requirements:
      "- Pengalaman minimal 2 tahun di bidang digital marketing\n- Pemahaman yang kuat tentang SEO, SEM, dan media sosial\n- Pengalaman dengan Google Analytics dan Google Ads\n- Kemampuan analitis dan kreativitas yang tinggi",
    responsibilities:
      "- Merencanakan dan mengelola kampanye pemasaran digital\n- Mengoptimalkan strategi SEO dan SEM\n- Mengelola akun media sosial klien\n- Menganalisis metrik kampanye dan memberikan laporan",
    category_id: 3,
    is_featured: true,
    status: "active",
    posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    company: mockCompanies[2],
    category: mockCategories[2],
  },
  {
    id: 4,
    title: "UI/UX Designer",
    slug: "ui-ux-designer",
    company_id: 1,
    location: "Jakarta",
    job_type: "full-time",
    salary_display: "Rp 12-18 juta/bulan",
    description:
      "Kami mencari UI/UX Designer yang kreatif untuk merancang antarmuka pengguna yang intuitif dan menarik.",
    requirements:
      "- Minimal 3 tahun pengalaman sebagai UI/UX Designer\n- Portofolio yang menunjukkan karya desain UI/UX\n- Mahir menggunakan Figma, Adobe XD, atau Sketch\n- Pemahaman tentang prinsip desain dan pengalaman pengguna",
    responsibilities:
      "- Merancang antarmuka pengguna untuk aplikasi web dan mobile\n- Membuat wireframe, prototype, dan mockup\n- Melakukan riset pengguna dan usability testing\n- Berkolaborasi dengan tim pengembang untuk implementasi desain",
    category_id: 4,
    is_featured: false,
    status: "active",
    posted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString(),
    company: mockCompanies[0],
    category: mockCategories[3],
  },
  {
    id: 5,
    title: "Backend Developer",
    slug: "backend-developer",
    company_id: 1,
    location: "Remote",
    job_type: "full-time",
    salary_display: "Rp 15-22 juta/bulan",
    description:
      "Tech Innovators mencari Backend Developer yang berpengalaman untuk mengembangkan API dan layanan backend.",
    requirements:
      "- Minimal 3 tahun pengalaman sebagai Backend Developer\n- Keahlian dalam Node.js, Python, atau Java\n- Pengalaman dengan database SQL dan NoSQL\n- Pemahaman tentang arsitektur microservices",
    responsibilities:
      "- Mengembangkan dan memelihara API dan layanan backend\n- Merancang dan mengoptimalkan database\n- Mengimplementasikan fitur keamanan\n- Menulis dokumentasi teknis",
    category_id: 1,
    is_featured: true,
    status: "active",
    posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    company: mockCompanies[0],
    category: mockCategories[0],
  },
]

// Mock articles with AI-generated images
export const mockArticles: Article[] = [
  {
    id: 1,
    title: "Tips Membuat CV yang Menarik Perhatian Recruiter",
    slug: "tips-membuat-cv-yang-menarik-perhatian-recruiter",
    content: `
# Tips Membuat CV yang Menarik Perhatian Recruiter

Curriculum Vitae (CV) adalah dokumen penting yang menjadi pintu pertama Anda untuk mendapatkan pekerjaan impian. Recruiter biasanya hanya menghabiskan waktu sekitar 6-7 detik untuk melihat sebuah CV, jadi penting untuk membuat CV Anda menonjol dan menarik perhatian.

## 1. Sesuaikan CV dengan Posisi yang Dilamar

Jangan gunakan CV yang sama untuk semua lamaran. Sesuaikan CV Anda dengan posisi yang Anda lamar dengan menekankan pengalaman dan keterampilan yang relevan dengan posisi tersebut.

## 2. Gunakan Format yang Bersih dan Mudah Dibaca

* Pilih font yang profesional seperti Arial, Calibri, atau Garamond
* Gunakan ukuran font 10-12 pt untuk teks utama
* Berikan jarak antar bagian untuk memudahkan pembacaan
* Gunakan bullet points untuk informasi penting

## 3. Mulai dengan Ringkasan Profesional yang Kuat

Tambahkan ringkasan profesional singkat (3-5 kalimat) di bagian atas CV yang menjelaskan kualifikasi dan pengalaman Anda secara singkat.

## 4. Tonjolkan Pencapaian, Bukan Hanya Tanggung Jawab

Alih-alih hanya mencantumkan tanggung jawab pekerjaan, fokus pada pencapaian konkret Anda. Gunakan angka dan data jika memungkinkan.

Contoh:
* Buruk: "Bertanggung jawab untuk kampanye pemasaran digital"
* Baik: "Meningkatkan traffic website sebesar 45% melalui kampanye pemasaran digital yang dioptimalkan"

## 5. Sertakan Kata Kunci yang Relevan

Banyak perusahaan menggunakan Applicant Tracking System (ATS) untuk menyaring CV. Pastikan Anda menyertakan kata kunci yang relevan dengan posisi yang Anda lamar.

## 6. Perhatikan Panjang CV

Untuk sebagian besar posisi, CV sebaiknya tidak lebih dari 2 halaman. Fokus pada informasi yang paling relevan dan terkini.

## 7. Periksa Kembali untuk Kesalahan

Kesalahan ejaan atau tata bahasa dapat memberikan kesan buruk. Periksa CV Anda beberapa kali dan minta orang lain untuk meninjau juga.

Dengan mengikuti tips di atas, CV Anda akan lebih menarik perhatian recruiter dan meningkatkan peluang Anda untuk dipanggil wawancara.
    `,
    excerpt:
      "Pelajari cara membuat CV yang efektif dan menonjol di antara ratusan lamaran lainnya dengan tips dari para HR profesional.",
    image: "/placeholder.svg?height=192&width=384",
    author: "Budi Santoso",
    date: "10 Apr 2023",
    published: true,
    featured: true,
  },
  {
    id: 2,
    title: "Skill yang Paling Dicari di Industri Teknologi 2023",
    slug: "skill-yang-paling-dicari-di-industri-teknologi-2023",
    content: `
# Skill yang Paling Dicari di Industri Teknologi 2023

Industri teknologi terus berkembang dengan cepat, dan kebutuhan akan talenta dengan keterampilan yang relevan juga terus meningkat. Berikut adalah beberapa keterampilan yang paling dicari di industri teknologi pada tahun 2023.

## 1. Artificial Intelligence dan Machine Learning

Kecerdasan buatan (AI) dan machine learning terus menjadi bidang yang berkembang pesat. Perusahaan mencari profesional yang memahami:

* Algoritma machine learning
* Deep learning
* Natural Language Processing (NLP)
* Computer vision
* TensorFlow, PyTorch, dan framework AI lainnya

## 2. Cybersecurity

Dengan meningkatnya serangan cyber, keamanan siber menjadi prioritas utama bagi banyak organisasi. Keterampilan yang dicari meliputi:

* Keamanan cloud
* Analisis kerentanan
* Respons insiden
* Keamanan aplikasi
* Forensik digital

## 3. Cloud Computing

Cloud computing telah menjadi fondasi infrastruktur IT modern. Keterampilan yang dicari meliputi:

* AWS, Azure, atau Google Cloud Platform
* Arsitektur cloud
* Containerization (Docker, Kubernetes)
* Infrastructure as Code (Terraform, CloudFormation)
* Serverless computing

## 4. Data Science dan Analytics

Data telah menjadi aset berharga bagi perusahaan. Profesional dengan keterampilan berikut sangat dicari:

* Analisis data
* Visualisasi data
* SQL dan NoSQL
* Python, R, atau Scala
* Big data technologies (Hadoop, Spark)

## 5. DevOps dan SRE

DevOps dan Site Reliability Engineering (SRE) terus menjadi penting untuk pengembangan dan operasi yang efisien:

* CI/CD pipelines
* Automation
* Monitoring dan logging
* Manajemen konfigurasi
* Microservices architecture

## 6. Full-Stack Development

Developer yang menguasai front-end dan back-end development sangat dicari:

* JavaScript/TypeScript
* React, Angular, atau Vue.js
* Node.js, Django, atau Ruby on Rails
* RESTful APIs dan GraphQL
* Responsive design

## 7. Blockchain

Meskipun pasar cryptocurrency fluktuatif, teknologi blockchain terus berkembang:

* Smart contracts
* Solidity
* Distributed ledger technology
* Cryptocurrency
* Web3 development

## Cara Mengembangkan Keterampilan Ini

* Kursus online (Coursera, Udemy, edX)
* Bootcamp teknologi
* Proyek open-source
* Hackathons
* Sertifikasi industri

Dengan mengembangkan keterampilan yang dicari ini, Anda dapat meningkatkan daya saing Anda di pasar kerja teknologi yang kompetitif.
    `,
    excerpt:
      "Mengenal berbagai keterampilan yang sedang tinggi permintaannya di industri teknologi dan bagaimana cara mempelajarinya.",
    image: "/placeholder.svg?height=192&width=384",
    author: "Dewi Lestari",
    date: "5 Apr 2023",
    published: true,
    featured: false,
  },
  {
    id: 3,
    title: "Cara Menjawab Pertanyaan Interview dengan Percaya Diri",
    slug: "cara-menjawab-pertanyaan-interview-dengan-percaya-diri",
    content: `
# Cara Menjawab Pertanyaan Interview dengan Percaya Diri

Wawancara kerja bisa menjadi pengalaman yang menegangkan, tetapi dengan persiapan yang tepat, Anda dapat menjawab pertanyaan dengan percaya diri dan meninggalkan kesan yang baik pada pewawancara.

## Persiapan Sebelum Interview

### 1. Riset Perusahaan
Pelajari tentang perusahaan, produk atau layanannya, budaya, dan nilai-nilainya. Ini akan membantu Anda menyesuaikan jawaban Anda dengan apa yang dicari perusahaan.

### 2. Pelajari Deskripsi Pekerjaan
Identifikasi keterampilan dan pengalaman kunci yang dicari untuk posisi tersebut, dan siapkan contoh dari pengalaman Anda yang menunjukkan keterampilan tersebut.

### 3. Latih Jawaban Anda
Latih jawaban untuk pertanyaan umum wawancara, tetapi hindari menghafalnya kata per kata. Fokus pada poin-poin kunci yang ingin Anda sampaikan.

## Pertanyaan Umum dan Cara Menjawabnya

### 1. "Ceritakan tentang diri Anda."
Berikan ringkasan singkat tentang latar belakang profesional Anda, fokus pada pengalaman yang relevan dengan posisi yang Anda lamar, dan akhiri dengan mengapa Anda tertarik dengan posisi tersebut.

### 2. "Apa kelemahan Anda?"
Pilih kelemahan yang jujur tetapi tidak kritis untuk posisi tersebut, dan jelaskan langkah-langkah yang Anda ambil untuk mengatasinya.

Contoh: "Saya terkadang terlalu detail-oriented, yang bisa memperlambat proses. Saya telah belajar untuk menetapkan batas waktu untuk tugas-tugas dan fokus pada prioritas utama."

### 3. "Mengapa Anda ingin bekerja di perusahaan kami?"
Tunjukkan bahwa Anda telah melakukan riset dengan menyebutkan aspek spesifik dari perusahaan yang Anda kagumi dan bagaimana nilai-nilai Anda selaras dengan nilai-nilai perusahaan.

### 4. "Ceritakan tentang situasi ketika Anda menghadapi tantangan di tempat kerja."
Gunakan metode STAR (Situation, Task, Action, Result) untuk menjawab pertanyaan berbasis perilaku:
* Situation: Jelaskan konteksnya
* Task: Apa yang perlu Anda lakukan
* Action: Langkah-langkah yang Anda ambil
* Result: Hasil positif dari tindakan Anda

### 5. "Di mana Anda melihat diri Anda dalam 5 tahun?"
Tunjukkan ambisi yang realistis dan keinginan untuk berkembang dalam perusahaan. Fokus pada pengembangan keterampilan dan kontribusi jangka panjang.

## Tips Selama Interview

### 1. Bahasa Tubuh
* Jaga kontak mata
* Duduk dengan postur tegak
* Berikan jabat tangan yang kuat (jika wawancara tatap muka)
* Tersenyum dan tunjukkan antusiasme

### 2. Cara Berbicara
* Bicara dengan jelas dan pada kecepatan sedang
* Hindari pengisi kata seperti "um" dan "seperti"
* Jangan terburu-buru menjawab; ambil waktu sejenak untuk memikirkan jawaban Anda

### 3. Tunjukkan Antusiasme
Tunjukkan ketertarikan dan semangat Anda untuk posisi tersebut dan perusahaan. Antusiasme dapat membedakan Anda dari kandidat lain dengan kualifikasi serupa.

### 4. Siapkan Pertanyaan
Siapkan beberapa pertanyaan cerdas untuk ditanyakan kepada pewawancara. Ini menunjukkan minat Anda dan membantu Anda menentukan apakah perusahaan cocok untuk Anda.

Dengan persiapan yang tepat dan pendekatan yang percaya diri, Anda dapat menavigasi wawancara kerja dengan sukses dan meningkatkan peluang Anda untuk mendapatkan pekerjaan yang Anda inginkan.
    `,
    excerpt:
      "Panduan lengkap menghadapi berbagai pertanyaan interview yang sering diajukan beserta contoh jawaban terbaiknya.",
    image: "/placeholder.svg?height=192&width=384",
    author: "Andi Wijaya",
    date: "28 Mar 2023",
    published: true,
    featured: true,
  },
  {
    id: 4,
    title: "Membangun Personal Branding untuk Karir yang Sukses",
    slug: "membangun-personal-branding-untuk-karir-yang-sukses",
    content: `
# Membangun Personal Branding untuk Karir yang Sukses

Personal branding adalah cara Anda mempresentasikan diri secara profesional kepada dunia. Di era digital ini, memiliki personal branding yang kuat dapat membuka pintu peluang karir dan membantu Anda menonjol di pasar kerja yang kompetitif.

## Apa itu Personal Branding?

Personal branding adalah proses menciptakan dan memelihara identitas profesional yang konsisten. Ini melibatkan menentukan:

* Nilai-nilai inti Anda
* Keahlian dan keterampilan unik Anda
* Bagaimana Anda ingin dikenal oleh orang lain
* Apa yang membedakan Anda dari profesional lain di bidang Anda

## Mengapa Personal Branding Penting?

* **Menonjol dari Kompetisi**: Membantu Anda membedakan diri dari kandidat lain dengan kualifikasi serupa
* **Membangun Kredibilitas**: Membangun kepercayaan dan otoritas di bidang Anda
* **Menarik Peluang**: Membuat Anda lebih mudah ditemukan oleh recruiter dan pemberi kerja potensial
* **Membangun Jaringan**: Memfasilitasi koneksi dengan profesional lain di industri Anda

## Langkah-langkah Membangun Personal Branding

### 1. Tentukan Nilai Unik Anda

Mulailah dengan introspeksi:
* Apa kekuatan dan keahlian utama Anda?
* Apa yang membuat Anda unik di bidang Anda?
* Apa nilai-nilai yang Anda pegang teguh?
* Apa passion Anda?

### 2. Tentukan Audiens Target Anda

Identifikasi siapa yang ingin Anda jangkau:
* Recruiter di industri spesifik
* Profesional di bidang Anda
* Calon klien atau pelanggan
* Pemimpin industri dan influencer

### 3. Buat Pesan yang Konsisten

Kembangkan "elevator pitch" yang jelas dan ringkas tentang siapa Anda dan apa yang Anda tawarkan. Pesan ini harus:
* Autentik dan mencerminkan siapa Anda sebenarnya
* Relevan dengan audiens target Anda
* Konsisten di semua platform dan interaksi

### 4. Optimalkan Kehadiran Online Anda

#### LinkedIn
* Buat profil yang lengkap dengan foto profesional
* Tulis headline yang menarik dan ringkasan yang komprehensif
* Minta rekomendasi dari kolega dan atasan
* Bagikan konten yang relevan dan bermanfaat secara teratur

#### Media Sosial Profesional Lainnya
* Sesuaikan profil Anda di platform yang relevan dengan industri Anda
* Pastikan username dan bio Anda konsisten di semua platform
* Bagikan pemikiran, proyek, dan pencapaian Anda

#### Website atau Blog Pribadi
* Buat portofolio online yang menampilkan karya Anda
* Tulis blog tentang topik di bidang keahlian Anda
* Sertakan testimonial dan studi kasus

### 5. Bangun Jaringan yang Kuat

* Hadiri acara industri dan konferensi
* Bergabunglah dengan grup profesional online dan offline
* Tawarkan bantuan dan nilai kepada koneksi Anda
* Lakukan pertemuan one-on-one dengan profesional yang Anda kagumi

### 6. Bagikan Pengetahuan dan Keahlian Anda

* Tulis artikel di platform seperti LinkedIn atau Medium
* Berbicara di acara industri atau webinar
* Menjadi mentor bagi profesional junior
* Berkontribusi pada proyek open-source atau inisiatif komunitas

### 7. Tetap Otentik

* Jangan mencoba menjadi orang lain
* Akui ketika Anda tidak tahu sesuatu
* Tunjukkan kepribadian Anda yang sebenarnya
* Jadilah konsisten dalam nilai-nilai dan pesan Anda

## Mengukur Efektivitas Personal Branding Anda

* Peningkatan jumlah koneksi profesional
* Lebih banyak peluang karir yang datang kepada Anda
* Pengakuan industri (penghargaan, undangan berbicara, dll.)
* Umpan balik positif dari rekan kerja dan atasan

## Kesimpulan

Membangun personal branding yang kuat adalah investasi jangka panjang dalam karir Anda. Dengan mendefinisikan nilai unik Anda, menciptakan kehadiran online yang kuat, dan secara konsisten menunjukkan keahlian Anda, Anda dapat membedakan diri dari kompetisi dan membuka pintu untuk peluang karir yang lebih besar.
    `,
    excerpt:
      "Pelajari cara membangun dan memelihara personal branding yang kuat untuk membuka lebih banyak peluang karir.",
    image: "/placeholder.svg?height=192&width=384",
    author: "Siti Rahayu",
    date: "15 Mar 2023",
    published: true,
    featured: false,
  },
  {
    id: 5,
    title: "Tren Rekrutmen dan Hiring yang Perlu Diketahui di 2023",
    slug: "tren-rekrutmen-dan-hiring-yang-perlu-diketahui-di-2023",
    content: `
# Tren Rekrutmen dan Hiring yang Perlu Diketahui di 2023

Dunia rekrutmen terus berevolusi, didorong oleh perubahan teknologi, ekspektasi kandidat, dan dinamika pasar kerja. Berikut adalah beberapa tren rekrutmen dan hiring terkini yang perlu diketahui oleh pencari kerja dan profesional HR di tahun 2023.

## 1. Rekrutmen Berbasis AI dan Otomatisasi

Artificial Intelligence (AI) dan otomatisasi semakin banyak digunakan dalam proses rekrutmen:

* **Screening CV otomatis**: Sistem ATS (Applicant Tracking System) yang lebih canggih dapat menganalisis CV dengan lebih akurat
* **Chatbot untuk kandidat**: Memberikan respons instan untuk pertanyaan umum dan memandu kandidat melalui proses aplikasi
* **Analisis prediktif**: Mengidentifikasi kandidat yang kemungkinan besar akan berhasil berdasarkan data historis
* **Wawancara berbasis AI**: Penilaian awal melalui wawancara video yang dianalisis oleh AI

**Tip untuk kandidat**: Optimalkan CV Anda dengan kata kunci yang relevan dan format yang ATS-friendly.

## 2. Remote dan Hybrid Work Menjadi Norma

Pandemi COVID-19 telah mengubah ekspektasi tentang tempat kerja secara permanen:

* **Posisi remote global**: Perusahaan semakin mencari talenta di luar batas geografis
* **Onboarding virtual**: Proses orientasi dan integrasi karyawan baru secara online
* **Fleksibilitas sebagai benefit utama**: Kandidat memprioritaskan fleksibilitas dalam pilihan karir mereka
* **Infrastruktur hybrid**: Perusahaan berinvestasi dalam teknologi dan ruang untuk mendukung model kerja hybrid

**Tip untuk kandidat**: Tunjukkan kemampuan Anda untuk bekerja secara mandiri dan berkolaborasi secara virtual.

## 3. Fokus pada Diversity, Equity, and Inclusion (DEI)

DEI telah menjadi prioritas strategis, bukan hanya inisiatif HR:

* **Rekrutmen blind**: Menghilangkan informasi yang dapat memicu bias (seperti nama, usia, gender) dari aplikasi
* **Bahasa inklusif**: Deskripsi pekerjaan yang ditulis ulang untuk menarik kandidat yang lebih beragam
* **Target keberagaman**: Tujuan yang terukur untuk meningkatkan representasi di semua level
* **Pelatihan bias**: Melatih recruiter dan hiring manager tentang bias tidak sadar

**Tip untuk kandidat**: Cari perusahaan yang memiliki komitmen nyata terhadap DEI, bukan hanya pernyataan kosong.

## 4. Skills-Based Hiring vs. Credential-Based Hiring

Fokus bergeser dari gelar dan kredensial formal ke keterampilan yang dapat didemonstrasikan:

* **Penilaian berbasis keterampilan**: Tes praktis dan proyek untuk mengevaluasi kemampuan kandidat
* **Micro-credentials**: Sertifikasi khusus industri dan kursus online yang diakui
* **Bootcamp dan jalur alternatif**: Penerimaan jalur non-tradisional ke dalam industri
* **Pembelajaran berkelanjutan**: Penekanan pada kemampuan beradaptasi dan keinginan untuk terus belajar

**Tip untuk kandidat**: Tunjukkan keterampilan Anda melalui portofolio, proyek, dan contoh kerja nyata.

## 5. Pengalaman Kandidat yang Ditingkatkan

Perusahaan memperlakukan kandidat seperti pelanggan:

* **Proses aplikasi yang disederhanakan**: Formulir yang lebih pendek dan lebih mudah diakses
* **Komunikasi yang transparan**: Pembaruan status yang jelas dan umpan balik yang konstruktif
* **Personalisasi**: Interaksi yang disesuaikan berdasarkan minat dan keterampilan kandidat
* **Kecepatan**: Siklus rekrutmen yang lebih cepat untuk menghindari kehilangan talenta terbaik

**Tip untuk kandidat**: Evaluasi pengalaman rekrutmen sebagai indikator budaya perusahaan.

## Kesimpulan

Memahami tren rekrutmen ini dapat membantu kandidat menavigasi pasar kerja dengan lebih efektif dan mempersiapkan diri untuk proses hiring modern. Bagi profesional HR dan recruiter, mengadopsi praktik-praktik ini dapat membantu menarik dan mempertahankan talenta terbaik di pasar yang kompetitif.
    `,
    excerpt:
      "Pelajari tren terbaru dalam rekrutmen dan hiring yang mempengaruhi cara perusahaan mencari talenta di tahun 2023.",
    image: "/placeholder.svg?height=192&width=384",
    author: "Ahmad Fauzi",
    date: "2 Mar 2023",
    published: true,
    featured: false,
  },
]

// Mock data provider functions
export function getMockJobs(): JobWithRelations[] {
  return mockJobs
}

export function getMockFeaturedJobs(limit = 4): JobWithRelations[] {
  return mockJobs.filter((job) => job.is_featured).slice(0, limit)
}

export function getMockJobBySlug(slug: string): JobWithRelations | null {
  return mockJobs.find((job) => job.slug === slug) || null
}

export function getMockCategories(): JobCategory[] {
  return mockCategories
}

export function getMockCompanies(): Company[] {
  return mockCompanies
}

// Article mock functions
export function getMockArticles(limit?: number): Article[] {
  const articles = mockArticles
  return limit ? articles.slice(0, limit) : articles
}

export function getMockFeaturedArticles(limit = 3): Article[] {
  return mockArticles.slice(0, limit)
}

export function getMockArticleBySlug(slug: string): Article | null {
  return mockArticles.find((article) => article.slug === slug) || null
}

// Mock CRUD operations
export function createMockJob(formData: FormData) {
  const title = formData.get("title") as string
  const slug = slugify(title)

  // Create a new job with mock data
  const newJob: JobWithRelations = {
    id: mockJobs.length + 1,
    title,
    slug,
    company_id: Number(formData.get("company_id")) || 1,
    location: (formData.get("location") as string) || "Jakarta",
    job_type: (formData.get("job_type") as string) || "full-time",
    salary_display: (formData.get("salary_display") as string) || "",
    description: (formData.get("description") as string) || "",
    requirements: (formData.get("requirements") as string) || "",
    responsibilities: (formData.get("responsibilities") as string) || "",
    category_id: Number(formData.get("category_id")) || null,
    is_featured: formData.get("is_featured") === "on",
    status: "active",
    posted_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: mockCompanies.find((c) => c.id === Number(formData.get("company_id"))) || mockCompanies[0],
    category: mockCategories.find((c) => c.id === Number(formData.get("category_id"))) || null,
  }

  // Add to mock jobs
  mockJobs.push(newJob)

  return {
    success: true,
    message: "Lowongan berhasil dibuat",
    data: newJob,
  }
}

export function createMockCompany(formData: FormData) {
  const name = formData.get("name") as string
  const slug = slugify(name)

  const newCompany: Company = {
    id: mockCompanies.length + 1,
    name,
    slug,
    location: (formData.get("location") as string) || "",
    logo_url: "/placeholder.svg?height=56&width=56",
    created_at: new Date().toISOString(),
  }

  mockCompanies.push(newCompany)

  return {
    success: true,
    message: "Perusahaan berhasil dibuat",
    data: newCompany,
  }
}

export function createMockCategory(formData: FormData) {
  const name = formData.get("name") as string
  const slug = slugify(name)

  const newCategory: JobCategory = {
    id: mockCategories.length + 1,
    name,
    slug,
    icon: (formData.get("icon") as string) || "🔍",
    job_count: 0,
    created_at: new Date().toISOString(),
  }

  mockCategories.push(newCategory)

  return {
    success: true,
    message: "Kategori berhasil dibuat",
    data: newCategory,
  }
}

// Article CRUD operations
export function createMockArticle(formData: FormData) {
  const title = formData.get("title") as string
  const slug = slugify(title)

  const newArticle: Article = {
    id: mockArticles.length + 1,
    title,
    slug,
    content: (formData.get("content") as string) || "",
    excerpt: (formData.get("excerpt") as string) || "",
    image_url: "/placeholder.svg?height=192&width=384",
    author: (formData.get("author") as string) || "Admin",
    created_at: new Date().toISOString(),
  }

  mockArticles.push(newArticle)

  return {
    success: true,
    message: "Artikel berhasil dibuat",
    data: newArticle,
  }
}

export function updateMockArticle(id: number, formData: FormData) {
  const articleIndex = mockArticles.findIndex((article) => article.id === id)

  if (articleIndex === -1) {
    return {
      success: false,
      message: "Artikel tidak ditemukan",
    }
  }

  const title = formData.get("title") as string
  const slug = slugify(title)

  mockArticles[articleIndex] = {
    ...mockArticles[articleIndex],
    title,
    slug,
    content: (formData.get("content") as string) || mockArticles[articleIndex].content,
    excerpt: (formData.get("excerpt") as string) || mockArticles[articleIndex].excerpt,
    author: (formData.get("author") as string) || mockArticles[articleIndex].author,
  }

  return {
    success: true,
    message: "Artikel berhasil diupdate",
    data: mockArticles[articleIndex],
  }
}

export function deleteMockArticle(id: number) {
  const articleIndex = mockArticles.findIndex((article) => article.id === id)

  if (articleIndex === -1) {
    return {
      success: false,
      message: "Artikel tidak ditemukan",
    }
  }

  mockArticles.splice(articleIndex, 1)

  return {
    success: true,
    message: "Artikel berhasil dihapus",
  }
}
