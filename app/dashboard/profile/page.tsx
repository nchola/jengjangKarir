import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/user-actions"
import ProfileForm from "@/components/dashboard/profile-form"

export const metadata: Metadata = {
  title: "Profil - JenjangKarir",
  description: "Kelola profil Anda",
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-gray-500">Kelola informasi profil Anda</p>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}
