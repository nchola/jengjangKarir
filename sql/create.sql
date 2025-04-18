company-logos
article-images
profile-images
resumes

CREATE TABLE IF NOT EXISTS public.admins (
  id serial NOT NULL,
  email character varying(255) NOT NULL,
  password_hash character varying(255) NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (id),
  CONSTRAINT admins_email_key UNIQUE (email)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.articles (
  id serial NOT NULL,
  title character varying(255) NOT NULL,
  slug character varying(255) NOT NULL,
  content text NOT NULL,
  excerpt text NULL,
  image_url text NULL,
  category character varying(255) NULL,
  author character varying(255) NULL,
  is_published boolean NULL DEFAULT true,
  is_featured boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  published_at timestamp with time zone NULL,
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_slug_key UNIQUE (slug)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.companies (
  id serial NOT NULL,
  name character varying(255) NOT NULL,
  slug character varying(255) NOT NULL,
  logo_url text NULL,
  description text,
  website VARCHAR(255),
  company_size VARCHAR(50),
  industry VARCHAR(100),
  company_background TEXT,
  location VARCHAR(255),
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id),
  CONSTRAINT companies_slug_key UNIQUE (slug)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.job_applications (
  id serial NOT NULL,
  job_id integer NULL,
  user_id integer NULL,
  full_name character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  phone character varying(50) NULL,
  resume_url text NULL,
  cover_letter text NULL,
  status character varying(50) NULL DEFAULT 'pending'::character varying,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT job_applications_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.job_categories (
  id serial NOT NULL,
  name character varying(255) NOT NULL,
  slug character varying(255) NOT NULL,
  icon character varying(50) NULL,
  job_count integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT job_categories_pkey PRIMARY KEY (id),
  CONSTRAINT job_categories_slug_key UNIQUE (slug)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.jobs (
  id serial NOT NULL,
  title character varying(255) NOT NULL,
  slug character varying(255) NOT NULL,
  company_id integer NULL,
  location character varying(255) NOT NULL,
  job_type character varying(50) NOT NULL,
  salary_display character varying(255) NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  responsibilities text NOT NULL,
  category_id integer NULL,
  is_featured boolean NULL DEFAULT false,
  status character varying(50) NULL DEFAULT 'active'::character varying,
  posted_at timestamp with time zone NULL DEFAULT now(),
  expires_at timestamp with time zone NULL,
  company_background text NULL,
  show_salary boolean NULL DEFAULT true,
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_slug_key UNIQUE (slug),
  CONSTRAINT jobs_category_id_fkey FOREIGN KEY (category_id) REFERENCES job_categories(id),
  CONSTRAINT jobs_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id serial NOT NULL,
  user_id integer NULL,
  job_id integer NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT saved_jobs_pkey PRIMARY KEY (id),
  CONSTRAINT saved_jobs_user_id_job_id_key UNIQUE (user_id, job_id),
  CONSTRAINT saved_jobs_job_id_fkey FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT saved_jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.simple_admins (
  id serial NOT NULL,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT simple_admins_pkey PRIMARY KEY (id),
  CONSTRAINT simple_admins_username_key UNIQUE (username)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.users (
  id serial NOT NULL,
  email character varying(255) NOT NULL,
  password_hash character varying(255) NOT NULL,
  full_name character varying(255) NOT NULL,
  phone character varying(50) NULL,
  profile_image_url text NULL,
  resume_url text NULL,
  headline character varying(255) NULL,
  bio text NULL,
  location character varying(255) NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  last_login timestamp with time zone NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
) TABLESPACE pg_default;