import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fungsi untuk mengubah string menjadi slug
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^\w-]+/g, "") // Hapus karakter non-word
    .replace(/--+/g, "-") // Ganti multiple - dengan single -
    .replace(/^-+/, "") // Trim - dari awal
    .replace(/-+$/, "") // Trim - dari akhir
}

// Fungsi untuk memformat tanggal
export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

// Fungsi untuk menghitung waktu yang telah berlalu
export function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000 // tahun
  if (interval > 1) {
    return `${Math.floor(interval)} tahun yang lalu`
  }

  interval = seconds / 2592000 // bulan
  if (interval > 1) {
    return `${Math.floor(interval)} bulan yang lalu`
  }

  interval = seconds / 86400 // hari
  if (interval > 1) {
    return `${Math.floor(interval)} hari yang lalu`
  }

  interval = seconds / 3600 // jam
  if (interval > 1) {
    return `${Math.floor(interval)} jam yang lalu`
  }

  interval = seconds / 60 // menit
  if (interval > 1) {
    return `${Math.floor(interval)} menit yang lalu`
  }

  return `${Math.floor(seconds)} detik yang lalu`
}
