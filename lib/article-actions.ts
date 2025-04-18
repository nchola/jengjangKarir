"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"
import { getMockArticles, getMockArticleBySlug, getMockFeaturedArticles } from "./mock-data"

// Get all articles
export async function getArticles(limit?: number) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Fetching articles")

    let query = supabase.from("articles").select("*").order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching articles:", error)
      // Fallback to mock data
      return getMockArticles(limit)
    }

    return data || []
  } catch (error) {
    console.error("Error fetching articles:", error)
    // Fallback to mock data
    return getMockArticles(limit)
  }
}

// Get article by slug
export async function getArticleBySlug(slug: string) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching article:", error)
      // Fallback to mock data
      return getMockArticleBySlug(slug)
    }

    return data
  } catch (error) {
    console.error("Error fetching article by slug:", error)
    // Fallback to mock data
    return getMockArticleBySlug(slug)
  }
}

// Create article
export async function createArticle(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const author = formData.get("author") as string
    const imageFile = formData.get("image") as File
    const resetImage = formData.get("reset_image") === "true"

    if (!title || !content) {
      return { success: false, message: "Judul dan konten wajib diisi" }
    }

    // Generate slug from title
    const slug = slugify(title)

    // Default image if none provided
    let imageUrl = "/placeholder.svg?height=192&width=384"

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      try {
        // Check if bucket exists, if not create it
        const { data: buckets } = await supabase.storage.listBuckets()
        const bucketExists = buckets?.some((bucket) => bucket.name === "article-images")

        if (!bucketExists) {
          const { error: createBucketError } = await supabase.storage.createBucket("article-images", {
            public: true,
          })
          if (createBucketError) {
            console.error("Error creating bucket:", createBucketError)
          }
        }

        // Upload file
        const fileName = `${slug}-${Date.now()}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(fileName, imageFile, {
            cacheControl: "3600",
            upsert: true,
          })

        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          // If upload fails, use a placeholder image
          imageUrl = `/placeholder.svg?height=192&width=384&text=${encodeURIComponent(title.charAt(0))}`
        } else {
          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("article-images").getPublicUrl(uploadData.path)

          imageUrl = publicUrl
        }
      } catch (uploadErr) {
        console.error("Upload error:", uploadErr)
        // Fallback to placeholder
        imageUrl = `/placeholder.svg?height=192&width=384&text=${encodeURIComponent(title.charAt(0))}`
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
        author,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error creating article:", error)
      return { success: false, message: `Gagal membuat artikel: ${error.message}` }
    }

    revalidatePath("/admin/articles")
    revalidatePath("/articles")
    revalidatePath("/")
    return { success: true, message: "Artikel berhasil dibuat", data: data[0] }
  } catch (error: any) {
    console.error("Error creating article:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Update article
export async function updateArticle(id: number, formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const author = formData.get("author") as string
    const imageFile = formData.get("image") as File
    const resetImage = formData.get("reset_image") === "true"

    if (!title || !content) {
      return { success: false, message: "Judul dan konten wajib diisi" }
    }

    // Generate slug from title
    const slug = slugify(title)

    // Get current article data
    const { data: currentArticle } = await supabase.from("articles").select("image_url").eq("id", id).single()

    // Prepare update data
    const updateData: any = {
      title,
      slug,
      content,
      excerpt,
      author,
    }

    // Handle image
    if (resetImage) {
      updateData.image_url = "/placeholder.svg?height=192&width=384"
    } else if (imageFile && imageFile.size > 0) {
      try {
        // Check if bucket exists, if not create it
        const { data: buckets } = await supabase.storage.listBuckets()
        const bucketExists = buckets?.some((bucket) => bucket.name === "article-images")

        if (!bucketExists) {
          const { error: createBucketError } = await supabase.storage.createBucket("article-images", {
            public: true,
          })
          if (createBucketError) {
            console.error("Error creating bucket:", createBucketError)
          }
        }

        // Upload file
        const fileName = `${slug}-${Date.now()}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(fileName, imageFile, {
            cacheControl: "3600",
            upsert: true,
          })

        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          // If upload fails, keep existing image or use placeholder
          updateData.image_url =
            currentArticle?.image_url ||
            `/placeholder.svg?height=192&width=384&text=${encodeURIComponent(title.charAt(0))}`
        } else {
          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("article-images").getPublicUrl(uploadData.path)

          updateData.image_url = publicUrl
        }
      } catch (uploadErr) {
        console.error("Upload error:", uploadErr)
        // Fallback to existing image or placeholder
        updateData.image_url =
          currentArticle?.image_url ||
          `/placeholder.svg?height=192&width=384&text=${encodeURIComponent(title.charAt(0))}`
      }
    }

    // Update article data
    const { data, error } = await supabase.from("articles").update(updateData).eq("id", id).select()

    if (error) {
      console.error("Error updating article:", error)
      return { success: false, message: `Gagal mengupdate artikel: ${error.message}` }
    }

    revalidatePath("/admin/articles")
    revalidatePath(`/articles/${slug}`)
    revalidatePath("/articles")
    revalidatePath("/")
    return { success: true, message: "Artikel berhasil diupdate", data: data[0] }
  } catch (error: any) {
    console.error("Error updating article:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Delete article
export async function deleteArticle(id: number) {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from("articles").delete().eq("id", id)

    if (error) {
      console.error("Error deleting article:", error)
      return { success: false, message: `Gagal menghapus artikel: ${error.message}` }
    }

    revalidatePath("/admin/articles")
    revalidatePath("/articles")
    revalidatePath("/")
    return { success: true, message: "Artikel berhasil dihapus" }
  } catch (error: any) {
    console.error("Error deleting article:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Get featured articles
export async function getFeaturedArticles(limit = 3) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Fetching featured articles")

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching featured articles:", error)
      return getMockFeaturedArticles(limit)
    }

    return data || []
  } catch (error) {
    console.error("Error fetching featured articles:", error)
    return getMockFeaturedArticles(limit)
  }
}
