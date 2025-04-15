"use server"

import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"

export async function seedSampleData() {
  try {
    const supabase = getSupabaseAdmin()
    console.log("[SERVER] Starting database seeding...")

    // Check connection first
    const { data: connectionTest, error: connectionError } = await supabase
      .from("companies")
      .select("count()", { count: "exact" })

    if (connectionError) {
      console.error("[SERVER] Database connection error:", connectionError)
      return {
        success: false,
        message: `Database connection error: ${connectionError.message}`,
      }
    }

    console.log("[SERVER] Database connection successful")

    // Sample categories
    const categories = [
      { name: "Teknologi Informasi", icon: "💻" },
      { name: "Keuangan", icon: "💰" },
      { name: "Marketing", icon: "📊" },
      { name: "Desain", icon: "🎨" },
      { name: "Pendidikan", icon: "📚" },
      { name: "Kesehatan", icon: "🏥" },
      { name: "Retail", icon: "🛒" },
      { name: "Media", icon: "📝" },
    ]

    // Sample companies
    const companies = [
      { name: "Tech Innovators", location: "Jakarta" },
      { name: "Finance Solutions", location: "Surabaya" },
      { name: "Creative Agency", location: "Bandung" },
      { name: "Health Services", location: "Yogyakarta" },
      { name: "Education Center", location: "Medan" },
      { name: "Retail Group", location: "Bali" },
      { name: "Media Productions", location: "Jakarta" },
      { name: "Food & Beverage Corp", location: "Makassar" },
    ]

    console.log("[SERVER] Inserting categories...")
    // Insert categories
    for (const category of categories) {
      const { error } = await supabase.from("job_categories").upsert(
        {
          name: category.name,
          slug: slugify(category.name),
          icon: category.icon,
          job_count: 0,
        },
        { onConflict: "slug" },
      )

      if (error) {
        console.error(`[SERVER] Error inserting category ${category.name}:`, error)
      } else {
        console.log(`[SERVER] Inserted category: ${category.name}`)
      }
    }

    console.log("[SERVER] Inserting companies...")
    // Insert companies
    for (const company of companies) {
      const { error } = await supabase.from("companies").upsert(
        {
          name: company.name,
          slug: slugify(company.name),
          location: company.location,
        },
        { onConflict: "slug" },
      )

      if (error) {
        console.error(`[SERVER] Error inserting company ${company.name}:`, error)
      } else {
        console.log(`[SERVER] Inserted company: ${company.name}`)
      }
    }

    // Get inserted categories and companies
    console.log("[SERVER] Retrieving inserted categories and companies...")
    const { data: insertedCategories, error: categoriesError } = await supabase.from("job_categories").select("*")
    if (categoriesError) {
      console.error("[SERVER] Error retrieving categories:", categoriesError)
      return { success: false, message: `Error retrieving categories: ${categoriesError.message}` }
    }

    const { data: insertedCompanies, error: companiesError } = await supabase.from("companies").select("*")
    if (companiesError) {
      console.error("[SERVER] Error retrieving companies:", companiesError)
      return { success: false, message: `Error retrieving companies: ${companiesError.message}` }
    }

    console.log(
      `[SERVER] Retrieved ${insertedCategories?.length || 0} categories and ${insertedCompanies?.length || 0} companies`,
    )

    if (
      !insertedCategories ||
      !insertedCompanies ||
      insertedCategories.length === 0 ||
      insertedCompanies.length === 0
    ) {
      console.error("[SERVER] Failed to retrieve inserted categories or companies or they are empty")
      return {
        success: false,
        message: "Failed to retrieve inserted categories or companies. Check database connection.",
      }
    }

    // Sample jobs
    const jobTypes = ["full-time", "part-time", "contract", "freelance", "remote"]
    const sampleJobs = [
      {
        title: "Senior Frontend Developer",
        company: "Tech Innovators",
        location: "Jakarta",
        jobType: "full-time",
        salaryDisplay: "Rp 15-25 juta/bulan",
        category: "Teknologi Informasi",
        description:
          "Kami mencari Senior Frontend Developer yang berpengalaman dalam React dan Next.js untuk bergabung dengan tim kami.",
        requirements:
          "- Minimal 3 tahun pengalaman dengan React\n- Familiar dengan Next.js dan TypeScript\n- Memahami state management seperti Redux atau Context API\n- Pengalaman dengan CSS-in-JS seperti Styled Components atau Emotion",
        responsibilities:
          "- Mengembangkan dan memelihara aplikasi web yang responsif\n- Berkolaborasi dengan tim desain dan backend\n- Mengoptimalkan aplikasi untuk kinerja maksimal\n- Menulis kode yang bersih, terstruktur, dan dapat diuji",
        isFeatured: true,
      },
      {
        title: "Financial Analyst",
        company: "Finance Solutions",
        location: "Surabaya",
        jobType: "full-time",
        salaryDisplay: "Rp 10-15 juta/bulan",
        category: "Keuangan",
        description:
          "Finance Solutions mencari Financial Analyst untuk menganalisis data keuangan dan memberikan rekomendasi strategis.",
        requirements:
          "- Gelar S1 di bidang Keuangan, Akuntansi, atau bidang terkait\n- Minimal 2 tahun pengalaman sebagai Financial Analyst\n- Kemampuan analitis yang kuat\n- Mahir menggunakan Excel dan tools analisis keuangan",
        responsibilities:
          "- Menganalisis data keuangan dan tren pasar\n- Menyiapkan laporan keuangan bulanan dan tahunan\n- Mengembangkan model keuangan untuk proyeksi\n- Memberikan rekomendasi untuk pengambilan keputusan",
        isFeatured: false,
      },
      {
        title: "Digital Marketing Specialist",
        company: "Creative Agency",
        location: "Bandung",
        jobType: "full-time",
        salaryDisplay: "Rp 8-12 juta/bulan",
        category: "Marketing",
        description:
          "Creative Agency mencari Digital Marketing Specialist untuk mengelola kampanye pemasaran digital klien kami.",
        requirements:
          "- Pengalaman minimal 2 tahun di bidang digital marketing\n- Pemahaman yang kuat tentang SEO, SEM, dan media sosial\n- Pengalaman dengan Google Analytics dan Google Ads\n- Kemampuan analitis dan kreativitas yang tinggi",
        responsibilities:
          "- Merencanakan dan mengelola kampanye pemasaran digital\n- Mengoptimalkan strategi SEO dan SEM\n- Mengelola akun media sosial klien\n- Menganalisis metrik kampanye dan memberikan laporan",
        isFeatured: true,
      },
      {
        title: "UI/UX Designer",
        company: "Tech Innovators",
        location: "Jakarta",
        jobType: "full-time",
        salaryDisplay: "Rp 12-18 juta/bulan",
        category: "Desain",
        description:
          "Kami mencari UI/UX Designer yang kreatif untuk merancang antarmuka pengguna yang intuitif dan menarik.",
        requirements:
          "- Minimal 3 tahun pengalaman sebagai UI/UX Designer\n- Portofolio yang menunjukkan karya desain UI/UX\n- Mahir menggunakan Figma, Adobe XD, atau Sketch\n- Pemahaman tentang prinsip desain dan pengalaman pengguna",
        responsibilities:
          "- Merancang antarmuka pengguna untuk aplikasi web dan mobile\n- Membuat wireframe, prototype, dan mockup\n- Melakukan riset pengguna dan usability testing\n- Berkolaborasi dengan tim pengembang untuk implementasi desain",
        isFeatured: false,
      },
      {
        title: "Backend Developer",
        company: "Tech Innovators",
        location: "Remote",
        jobType: "full-time",
        salaryDisplay: "Rp 15-22 juta/bulan",
        category: "Teknologi Informasi",
        description:
          "Tech Innovators mencari Backend Developer yang berpengalaman untuk mengembangkan API dan layanan backend.",
        requirements:
          "- Minimal 3 tahun pengalaman sebagai Backend Developer\n- Keahlian dalam Node.js, Python, atau Java\n- Pengalaman dengan database SQL dan NoSQL\n- Pemahaman tentang arsitektur microservices",
        responsibilities:
          "- Mengembangkan dan memelihara API dan layanan backend\n- Merancang dan mengoptimalkan database\n- Mengimplementasikan fitur keamanan\n- Menulis dokumentasi teknis",
        isFeatured: true,
      },
    ]

    console.log("[SERVER] Inserting jobs...")
    // Insert jobs
    for (const job of sampleJobs) {
      // Find company
      const company = insertedCompanies.find((c) => c.name === job.company)
      if (!company) {
        console.error(`[SERVER] Company ${job.company} not found`)
        continue
      }

      // Find category
      const category = insertedCategories.find((c) => c.name === job.category)
      if (!category) {
        console.error(`[SERVER] Category ${job.category} not found`)
        continue
      }

      // Generate random dates
      const now = new Date()
      const postedAt = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in the last 30 days
      const expiresAt = new Date(postedAt.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days after posted date

      const { error } = await supabase.from("jobs").upsert(
        {
          title: job.title,
          slug: slugify(job.title),
          company_id: company.id,
          location: job.location,
          job_type: job.jobType,
          salary_display: job.salaryDisplay,
          description: job.description,
          requirements: job.requirements,
          responsibilities: job.responsibilities,
          category_id: category.id,
          is_featured: job.isFeatured,
          status: "active",
          posted_at: postedAt.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "slug" },
      )

      if (error) {
        console.error(`[SERVER] Error inserting job ${job.title}:`, error)
      } else {
        console.log(`[SERVER] Inserted job: ${job.title}`)

        // Update category job count
        const { data: updatedCategory } = await supabase
          .from("job_categories")
          .select("job_count")
          .eq("id", category.id)
          .single()

        if (updatedCategory) {
          await supabase
            .from("job_categories")
            .update({ job_count: updatedCategory.job_count + 1 })
            .eq("id", category.id)
        }
      }
    }

    // Verify data was inserted
    console.log("[SERVER] Verifying data insertion...")
    const { count: companiesCount, error: companiesCountError } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true })

    if (companiesCountError) {
      console.error("[SERVER] Error counting companies:", companiesCountError)
    } else {
      console.log(`[SERVER] Companies count: ${companiesCount}`)
    }

    const { count: categoriesCount, error: categoriesCountError } = await supabase
      .from("job_categories")
      .select("*", { count: "exact", head: true })

    if (categoriesCountError) {
      console.error("[SERVER] Error counting categories:", categoriesCountError)
    } else {
      console.log(`[SERVER] Categories count: ${categoriesCount}`)
    }

    const { count: jobsCount, error: jobsCountError } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })

    if (jobsCountError) {
      console.error("[SERVER] Error counting jobs:", jobsCountError)
    } else {
      console.log(`[SERVER] Jobs count: ${jobsCount}`)
    }

    console.log("[SERVER] Database seeding completed successfully")
    return {
      success: true,
      message: "Data sampel berhasil ditambahkan",
    }
  } catch (error) {
    console.error("[SERVER] Error seeding database:", error)
    return {
      success: false,
      message: "Gagal menambahkan data sampel. Periksa koneksi database Anda.",
    }
  }
}
