import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disclaimer | JenjangKarir",
  description: "Disclaimer dan informasi penting mengenai penggunaan platform JenjangKarir",
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Disclaimer</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informasi Umum</h2>
            <p className="text-gray-600 mb-4">
              Informasi yang tersedia di JenjangKarir ("Platform") disediakan "sebagaimana adanya" dan hanya untuk tujuan informasi umum. 
              Meskipun kami berusaha untuk menjaga informasi tetap akurat dan terkini, kami tidak membuat pernyataan atau jaminan dalam bentuk apa pun, 
              tersurat maupun tersirat, tentang kelengkapan, keakuratan, keandalan, kesesuaian, atau ketersediaan sehubungan dengan Platform atau informasi, 
              produk, layanan, atau grafik terkait yang terdapat di Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Batasan Tanggung Jawab</h2>
            <p className="text-gray-600 mb-4">
              Sejauh diizinkan oleh hukum yang berlaku, kami tidak akan bertanggung jawab atas:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Kerugian atau kerusakan langsung, tidak langsung, insidental, konsekuensial, atau punitif</li>
              <li>Kehilangan keuntungan, pendapatan, data, atau penggunaan</li>
              <li>Kerusakan properti atau klaim pihak ketiga</li>
              <li>Kesalahan atau kelalaian dalam konten</li>
              <li>Kerugian atau kerusakan yang timbul dari penggunaan atau ketidakmampuan menggunakan Platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informasi Lowongan Kerja</h2>
            <p className="text-gray-600 mb-4">
              Meskipun kami berusaha memverifikasi semua informasi lowongan kerja yang dipublikasikan, kami tidak dapat menjamin:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Keakuratan informasi yang diberikan oleh perusahaan</li>
              <li>Ketersediaan posisi yang diiklankan</li>
              <li>Hasil dari proses lamaran kerja</li>
              <li>Kondisi kerja atau kompensasi yang ditawarkan</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tautan Eksternal</h2>
            <p className="text-gray-600 mb-4">
              Platform mungkin berisi tautan ke situs web eksternal. Kami tidak memiliki kendali atas konten dan sifat situs web tersebut 
              dan tidak bertanggung jawab atas konten atau praktik privasi mereka.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Perubahan</h2>
            <p className="text-gray-600 mb-4">
              Kami berhak untuk mengubah disclaimer ini setiap saat. Perubahan akan berlaku segera setelah dipublikasikan di Platform. 
              Penggunaan berkelanjutan atas Platform setelah perubahan tersebut merupakan persetujuan Anda terhadap perubahan yang dilakukan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hubungi Kami</h2>
            <p className="text-gray-600">
              Jika Anda memiliki pertanyaan tentang disclaimer ini, silakan hubungi kami melalui halaman kontak kami.
            </p>
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