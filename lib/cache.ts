// Implementasi caching sederhana untuk query yang sering digunakan
type CacheEntry = {
  data: any
  timestamp: number
  expiry: number // dalam milidetik
}

const cache: Record<string, CacheEntry> = {}

export function getCachedData(key: string) {
  const entry = cache[key]
  if (!entry) return null

  const now = Date.now()
  if (now - entry.timestamp > entry.expiry) {
    // Cache expired
    delete cache[key]
    return null
  }

  return entry.data
}

export function setCachedData(key: string, data: any, expiry = 5 * 60 * 1000) {
  // Default 5 menit
  cache[key] = {
    data,
    timestamp: Date.now(),
    expiry,
  }
}

// Contoh penggunaan dalam action:
// const cacheKey = `jobs-featured-${limit}`;
// const cachedData = getCachedData(cacheKey);
// if (cachedData) return cachedData;
//
// const data = await supabase.from("jobs")...
// setCachedData(cacheKey, data);
// return data;
