"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"
import {
  getMockArticles,
  getMockFeaturedArticles,
  getMockArticleBySlug,
  getMockArticleCategories,
  createMockArticle,
  updateMockArticle,
  deleteMockArticle,
} from "./mock-data"

// Get all articles
export async function getArticles(limit?: number) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Server action: Fetching articles")

    let query = supabase.from("articles").select("*").order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching articles:", error)
      console.log("Falling back to mock data")
      return getMockArticles(limit)
    }

    console.log(`Server action: Found ${data?.length || 0} articles`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching articles:", error)
    console.log("Falling back to mock data")
    return getMockArticles(limit)
  }
}

// Get featured articles
export async function getFeaturedArticles(limit = 3) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Server action: Fetching featured articles")

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching featured articles:", error)
      console.log("Falling back to mock data")
      return getMockFeaturedArticles(limit)
    }

    console.log(`Server action: Found ${data?.length || 0} featured articles`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching featured articles:", error)
    console.log("Falling back to mock data")
    return getMockFeaturedArticles(limit)
  }
}

// Get article by slug
export async function getArticleBySlug(slug: string) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching article:", error)
      console.log("Falling back to mock data")
      return getMockArticleBySlug(slug)
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching article by slug:", error)
    console.log("Falling back to mock data")
    return getMockArticleBySlug(slug)
  }
}

// Get all article categories
export async function getArticleCategories() {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from("article_categories").select("*")

    if (error) {
      console.error("Error fetching article categories:", error)
      console.log("Falling back to mock data")
      return getMockArticleCategories()
    }

    // Extract unique categories
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching article categories:", error)
    console.log("Falling back to mock data")
    return getMockArticleCategories()
  }
}

// Create article
export async function createArticle(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const category = formData.get("category") as string
    const author = formData.get("author") as string
    const published = formData.get("published") === "on"
    const featured = formData.get("featured") === "on"
    const imageFile = formData.get("image") as File

    if (!title || !content) {
      return { success: false, message: "Judul dan konten wajib diisi" }
    }

    // Generate slug from title
    const slug = slugify(title)

    // Default image if none provided
    let imageUrl = "/placeholder.svg?height=192&width=384"

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(`${slug}-${Date.now()}`, imageFile)

      if (uploadError) {
        console.error("Error uploading image:", uploadError)
      } else {
        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("article-images").getPublicUrl(uploadData.path)

        imageUrl = publicUrl
      }
    }

    // Save article data
    const { data, error } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        content,
        excerpt,
        image_url: imageUrl,
        category,
        author,
        created_at: new Date().toISOString(),
        is_published: published,
        is_featured: featured,
        published_at: published ? new Date().toISOString() : null,
      })
      .select()

    if (error) {
      console.error("Error creating article:", error)
      console.log("Falling back to mock data")
      return createMockArticle(formData)
    }

    revalidatePath("/admin/articles")
    revalidatePath("/articles")
    revalidatePath("/")
    return { success: true, message: "Artikel berhasil dibuat", data: data[0] }
  } catch (error) {
    console.error("Unexpected error creating article:", error)
    console.log("Falling back to mock data")
    return createMockArticle(formData)
  }
}

// Update article
export async function updateArticle(id: number, formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const category = formData.get("category") as string
    const author = formData.get("author") as string
    const published = formData.get("published") === "on"
    const featured = formData.get("featured") === "on"
    const imageFile = formData.get("image") as File

    if (!title || !content) {
      return { success: false, message: "Judul dan konten wajib diisi" }
    }

    // Generate slug from title
    const slug = slugify(title)

    // Get current article data
    const { data: currentArticle } = await supabase.from("articles").select("image_url").eq("id", id).single()

    let imageUrl = currentArticle?.image_url || "/placeholder.svg?height=192&width=384"

    // Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(`${slug}-${Date.now()}`, imageFile)

      if (uploadError) {
        console.error("Error uploading image:", uploadError)
      } else {
        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("article-images").getPublicUrl(uploadData.path)

        imageUrl = publicUrl
      }
    }

    // Update article data
    const { data, error } = await supabase
      .from("articles")
      .update({
        title,
        slug,
        content,
        excerpt,
        image_url: imageUrl,
        category,
        author,
        is_published: published,
        is_featured: featured,
        published_at: published ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating article:", error)
      console.log("Falling back to mock data")
      return updateMockArticle(id, formData)
    }

    revalidatePath("/admin/articles")
    revalidatePath(`/articles/${slug}`)
    revalidatePath("/articles")
    revalidatePath("/")
    return { success: true, message: "Artikel berhasil diupdate", data: data[0] }
  } catch (error) {
    console.error("Unexpected error updating article:", error)
    console.log("Falling back to mock data")
    return updateMockArticle(id, formData)
  }
}

// Delete article
export async function deleteArticle(id: number) {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from("articles").delete().eq("id", id)

    if (error) {
      console.error("Error deleting article:", error)
      console.log("Falling back to mock data")
      return deleteMockArticle(id)
    }

    revalidatePath("/admin/articles")
    revalidatePath("/articles")
    revalidatePath("/")
    return { success: true, message: "Artikel berhasil dihapus" }
  } catch (error) {
    console.error("Unexpected error deleting article:", error)
    console.log("Falling back to mock data")
    return deleteMockArticle(id)
  }
}
