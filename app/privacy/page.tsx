import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kebijakan Privasi | JenjangKarir",
  description: "Kebijakan privasi dan perlindungan data pengguna platform JenjangKarir",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kebijakan Privasi</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="text-gray-600 mb-6">
              JenjangKarir berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, 
              menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan platform kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informasi yang Kami Kumpulkan</h2>
            <p className="text-gray-600 mb-4">Kami mengumpulkan informasi berikut:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <span className="font-medium">Informasi Pribadi:</span> Nama, alamat email, nomor telepon, dan CV
              </li>
              <li>
                <span className="font-medium">Informasi Profil:</span> Riwayat pendidikan, pengalaman kerja, dan keterampilan
              </li>
              <li>
                <span className="font-medium">Informasi Penggunaan:</span> Data tentang bagaimana Anda menggunakan platform
              </li>
              <li>
                <span className="font-medium">Informasi Teknis:</span> Alamat IP, jenis browser, dan perangkat yang digunakan
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Penggunaan Informasi</h2>
            <p className="text-gray-600 mb-4">Kami menggunakan informasi Anda untuk:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Memfasilitasi proses pencarian kerja dan perekrutan</li>
              <li>Meningkatkan layanan dan pengalaman pengguna</li>
              <li>Mengirimkan informasi lowongan kerja yang relevan</li>
              <li>Berkomunikasi tentang pembaruan layanan</li>
              <li>Mencegah penipuan dan aktivitas ilegal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Perlindungan Data</h2>
            <p className="text-gray-600 mb-4">
              Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi Anda dari akses, 
              pengungkapan, perubahan, dan penghancuran yang tidak sah, termasuk:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Enkripsi data sensitif</li>
              <li>Akses terbatas ke informasi pribadi</li>
              <li>Pemantauan keamanan secara regular</li>
              <li>Prosedur keamanan fisik dan elektronik</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Berbagi Informasi</h2>
            <p className="text-gray-600 mb-4">
              Kami hanya membagikan informasi Anda dengan:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Perusahaan yang Anda lamar</li>
              <li>Penyedia layanan yang membantu operasional platform</li>
              <li>Pihak berwenang sesuai ketentuan hukum</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hak Pengguna</h2>
            <p className="text-gray-600 mb-4">
              Anda memiliki hak untuk:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Mengakses informasi pribadi Anda</li>
              <li>Memperbarui atau mengoreksi informasi Anda</li>
              <li>Meminta penghapusan data Anda</li>
              <li>Membatasi penggunaan data Anda</li>
              <li>Menarik persetujuan penggunaan data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookie dan Teknologi Pelacakan</h2>
            <p className="text-gray-600 mb-4">
              Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman pengguna dan menganalisis 
              penggunaan platform. Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Perubahan Kebijakan</h2>
            <p className="text-gray-600 mb-4">
              Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan 
              diberitahukan melalui email atau pemberitahuan di platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hubungi Kami</h2>
            <p className="text-gray-600">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau penanganan data Anda, 
              silakan hubungi kami melalui:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Email: privacy@jenjangkarir.com</p>
              <p className="text-gray-600">Telepon: (021) XXX-XXXX</p>
            </div>
          </section>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  )
} 