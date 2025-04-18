-- Add new columns to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_size TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS background TEXT;
