import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export class JobQueryBuilder {
  private query: any

  constructor(supabase: SupabaseClient<Database>) {
    this.query = supabase.from("jobs").select(`
      *,
      company:companies(*),
      category:job_categories(*)
    `)
  }

  withStatus(status: string) {
    this.query = this.query.eq("status", status)
    return this
  }

  withCategory(categoryId: number | null) {
    if (categoryId) {
      this.query = this.query.eq("category_id", categoryId)
    }
    return this
  }

  withSearch(term: string) {
    if (term) {
      this.query = this.query.or(`title.ilike.%${term}%,companies.name.ilike.%${term}%`)
    }
    return this
  }

  withLocation(location: string) {
    if (location) {
      this.query = this.query.ilike("location", `%${location}%`)
    }
    return this
  }

  withJobType(jobType: string) {
    if (jobType && jobType !== "all") {
      this.query = this.query.eq("job_type", jobType)
    }
    return this
  }

  orderByDate(ascending = false) {
    this.query = this.query.order("posted_at", { ascending })
    return this
  }

  limit(count: number) {
    this.query = this.query.limit(count)
    return this
  }

  async execute() {
    return await this.query
  }
}

// Contoh penggunaan:
// const jobs = await new JobQueryBuilder(supabase)
//   .withStatus("active")
//   .withSearch("developer")
//   .withLocation("jakarta")
//   .orderByDate()
//   .limit(10)
//   .execute();
