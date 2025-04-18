-- Indeks untuk pencarian lowongan
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs (title);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs (posted_at);
CREATE INDEX IF NOT EXISTS idx_jobs_category_id ON jobs (category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs (company_id);

-- Indeks untuk pencarian perusahaan
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies (name);
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies (location);

-- Indeks untuk slug (sering digunakan untuk lookup)
CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_slug ON jobs (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_slug ON companies (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON job_categories (slug);
