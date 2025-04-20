import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tentang Kami | JenjangKarir",
  description: "Tentang JenjangKarir - Platform pencarian kerja dan pengembangan karir profesional di Indonesia",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tentang JenjangKarir</h1>
        
        <div className="space-y-8">
          <section className="prose prose-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Visi Kami</h2>
            <p className="text-gray-600 leading-relaxed">
              JenjangKarir hadir sebagai solusi digital untuk mengatasi tantangan pencarian kerja dan pengembangan karir di Indonesia. Kami berkomitmen untuk menjadi jembatan yang menghubungkan talenta-talenta berkualitas dengan peluang karir yang sesuai.
            </p>
          </section>

          <section className="prose prose-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Misi Kami</h2>
            <ul className="list-disc pl-6 space-y-4 text-gray-600">
              <li>Menyediakan platform yang mudah diakses untuk pencarian kerja dan pengembangan karir</li>
              <li>Memberikan informasi dan sumber daya yang relevan untuk membantu pengguna dalam perjalanan karir mereka</li>
              <li>Membangun komunitas profesional yang saling mendukung dan berbagi pengetahuan</li>
              <li>Mendorong pertumbuhan ekonomi melalui optimalisasi penempatan SDM berkualitas</li>
            </ul>
          </section>

          <section className="prose prose-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Layanan Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pencarian Lowongan</h3>
                <p className="text-gray-600">
                  Platform terintegrasi yang menghubungkan pencari kerja dengan berbagai peluang karir dari perusahaan terpercaya.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pengembangan Karir</h3>
                <p className="text-gray-600">
                  Artikel dan sumber daya untuk membantu pengembangan keterampilan dan pengetahuan profesional.
                </p>
              </div>
            </div>
          </section>

          <section className="prose prose-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Komitmen Kami</h2>
            <p className="text-gray-600 leading-relaxed">
              Kami berdedikasi untuk menyajikan informasi yang akurat dan terpercaya. Setiap konten yang kami publikasikan melalui proses validasi yang ketat untuk memastikan kualitas dan relevansinya. Kami juga terbuka untuk masukan dan koreksi dari pengguna melalui halaman kontak kami.
            </p>
          </section>

          <section className="prose prose-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bergabung Bersama Kami</h2>
            <p className="text-gray-600 leading-relaxed">
              Mari bersama-sama membangun ekosistem karir yang lebih baik di Indonesia. Baik Anda sebagai pencari kerja, profesional yang ingin berkembang, atau perusahaan yang mencari talenta terbaik, JenjangKarir siap menjadi mitra Anda dalam perjalanan karir.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 