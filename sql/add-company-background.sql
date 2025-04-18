-- Add company_background column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_background TEXT;
