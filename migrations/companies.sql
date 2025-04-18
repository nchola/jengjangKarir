-- Menambahkan kolom baru ke tabel companies
ALTER TABLE companies
ADD COLUMN description TEXT,
ADD COLUMN website VARCHAR(255),
ADD COLUMN industry VARCHAR(100),
ADD COLUMN company_size VARCHAR(50),
ADD COLUMN company_background TEXT;

-- Menambahkan komentar pada kolom-kolom baru
COMMENT ON COLUMN companies.description IS 'Deskripsi singkat tentang perusahaan';
COMMENT ON COLUMN companies.website IS 'Website resmi perusahaan';
COMMENT ON COLUMN companies.industry IS 'Bidang industri perusahaan';
COMMENT ON COLUMN companies.company_size IS 'Ukuran perusahaan (jumlah karyawan)';
COMMENT ON COLUMN companies.company_background IS 'Latar belakang dan sejarah perusahaan';

-- Mengupdate kolom yang sudah ada untuk memastikan nullable
ALTER TABLE companies
ALTER COLUMN logo_url DROP NOT NULL,
ALTER COLUMN location DROP NOT NULL; 