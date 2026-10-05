'use strict';

const {
  Paragraph, TextRun, AlignmentType, LineRuleType
} = require('docx');

const {
  CM, FONT, SIZE_BODY, SIZE_HEADING1, SIZE_SUBHEADING,
  SPACING_15, SPACING_10, INDENT_ALINEA,
  T, TBold, TItalic, TBoldItalic,
  P, PIndent, PCenter, PLeft, PSingle, PEmpty,
  BabTitle, SubBab, SubSubBab,
  ListItem, ListAlpha
} = require('./helpers');

function getBab1Children() {
  return [
    ...BabTitle('BAB I', 'PENDAHULUAN'),

    SubBab('1.1', 'Latar Belakang'),
    PIndent([
      T('Perkembangan teknologi informasi yang terakselerasi dengan pesat pada era transformasi digital saat ini telah merombak lanskap operasional berbagai sektor industri secara fundamental, termasuk sektor usaha mikro, kecil, dan menengah (UMKM). Di sektor industri makanan dan minuman ('),
      TItalic('food and beverage'),
      T('), dinamika pasar yang serba cepat dan persaingan bisnis yang ketat menuntut pengelolaan organisasi yang adaptif, akuntabel, dan berbasis data real-time. Namun demikian, kenyataan di lapangan menunjukkan bahwa mayoritas UMKM kuliner masih mengandalkan pola koordinasi konvensional berbasis instruksi lisan, pencatatan manual di buku kasir, serta komunikasi acak melalui aplikasi pesan instan (seperti grup WhatsApp). Ketiadaan sistem informasi manajemen terintegrasi ini menimbulkan sejumlah kendala serius, antara lain terfragmentasinya data kinerja ('),
      TItalic('information silos'),
      T('), keterlambatan identifikasi kendala operasional harian, minimnya transparansi pencapaian target kerja antar divisi, serta pelaksanaan rapat evaluasi mingguan yang tidak terarah dan menyita banyak waktu produktif tanpa menghasilkan tindak lanjut yang terukur. Dalam mengatasi inefisiensi manajerial ini, konsep '),
      TItalic('Entrepreneurial Operating System'),
      T(' (EOS) yang diperkenalkan oleh Gino Wickman dalam karya monumentalnya '),
      TItalic('Traction: Get a Grip on Your Business'),
      T(' (2011) menawarkan kerangka operasional terbukti, khususnya melalui format '),
      TItalic('Level 10 Meeting'),
      T(' (L10) yang mengintegrasikan pemantauan metrik mingguan ('),
      TItalic('Scorecard/Scoreboard'),
      T('), penetapan target prioritas kuartalan 90 hari ('),
      TItalic('Rocks'),
      T('), papan informasi strategis ('),
      TItalic('Headlines'),
      T('), daftar akuntabilitas tugas ('),
      TItalic('To-Do List'),
      T('), serta penyelesaian akar permasalahan secara tuntas melalui metode '),
      TItalic('Identify, Discuss, Solve'),
      T(' (IDS) [5].'),
    ]),
    PEmpty(),
    PIndent([
      T('Berbagai penelitian akademis terdahulu telah berupaya mengembangkan sistem informasi berbasis web guna mendukung operasional dan daya saing UMKM. Sebagai contoh, Akmal dan Saputra (2024) mengembangkan sistem profil perusahaan berbasis PHP dan MySQL menggunakan metode Waterfall yang terbukti efektif meningkatkan eksposur informasi dan kredibilitas bisnis di ranah digital [1]. Di sisi lain, Supriyadi et al. (2024) merancang bangun aplikasi web profil perusahaan bagi UMKM makanan beku APM Frozen Food untuk mempermudah katalogisasi produk dan interaksi pelanggan [4], serta Arianto et al. (2022) yang memanfaatkan teknologi web untuk penyajian profil perusahaan interaktif [2]. Kendati demikian, seluruh penelitian tersebut memiliki batasan signifikan karena hanya berfokus pada penyajian informasi statis satu arah dan belum menyentuh ranah manajemen kinerja internal organisasi yang dinamis. Penelitian-penelitian tersebut belum mengakomodasi pelacakan indikator kinerja kunci (KPI), hierarki target kerja terstruktur, maupun sistem otorisasi keamanan berbasis peran ('),
      TItalic('Role-Based Access Control'),
      T('/RBAC) berstandar industri sebagaimana didefinisikan oleh Sandhu et al. [3]. Oleh sebab itu, penelitian ini hadir dengan kebaruan ('),
      TItalic('novelty'),
      T(') yang nyata, yakni merancang bangun sistem manajemen kinerja operasional berbasis web terpadu yang memadukan filosofi manajemen '),
      TItalic('Traction'),
      T(' L10 '),
      TItalic('Meeting'),
      T(' dengan arsitektur keamanan RBAC berlapis guna menjawab kebutuhan kolaborasi lintas divisi yang aman dan terstruktur.'),
    ]),
    PEmpty(),
    PIndent([
      T('PT Garciafood Nusantara Gemilang merupakan entitas bisnis kuliner terkemuka di Kota Medan yang menaungi merek dagang kuliner khas nusantara "Nasi Gerilya", berlokasi operasional di Gg. Rukun No.1, Kelurahan Bantan, Kecamatan Medan Tembung, Kota Medan, Sumatera Utara 20223. Dalam menjalankan aktivitas bisnisnya, PT Garciafood memiliki lima pilar divisi operasional yang saling berkaitan, yaitu Divisi IT, Divisi Keuangan ('),
      TItalic('Finance'),
      T('), Divisi Dapur ('),
      TItalic('Kitchen'),
      T('), Divisi Layanan Lantai ('),
      TItalic('Service/Floor'),
      T('), dan Divisi Pemasaran ('),
      TItalic('Marketing'),
      T('). Berdasarkan observasi langsung selama pelaksanaan Praktik Kerja Lapangan, ditemukan bahwa sinkronisasi data antar divisi masih sangat rentan terhadap kendala miskomunikasi dan kebocoran informasi finansial sensitif akibat belum adanya kontrol hak akses yang tegas. Selain itu, pimpinan puncak ('),
      TItalic('Owner'),
      T(') dan para penanggung jawab divisi (PIC) mengalami kesulitan dalam memantau deviasi capaian target mingguan dan kuartalan secara objektif. Mengacu pada urgensi permasalahan tersebut, penulis mengangkat judul laporan: '),
      TBoldItalic('“Rancang Bangun Aplikasi RockyTen Berbasis Web Dengan Keamanan RBAC Pada PT Garciafood Nusantara Gemilang”'),
      T('. Aplikasi '),
      TItalic('RockyTen'),
      T(' dirancang sebagai solusi perangkat lunak komprehensif berbasis arsitektur modern (Next.js, Supabase PostgreSQL, dan Tailwind CSS) yang memuat modul '),
      TItalic('Scoreboard, Rocks, Headlines, To-Do List,'),
      T(' dan '),
      TItalic('Issues'),
      T(', dengan proteksi keamanan RBAC tiga tingkat ('),
      TItalic('Developer, Owner,'),
      T(' dan PIC Divisi) guna meningkatkan produktivitas, integritas data, dan akuntabilitas kerja secara berkelanjutan.'),
    ]),
    PEmpty(),

    SubBab('1.2', 'Rumusan Masalah'),
    PIndent([
      T('Berdasarkan latar belakang permasalahan yang telah diuraikan secara mendalam di atas, maka rumusan masalah yang menjadi fokus utama dalam pelaksanaan penelitian dan perancangan sistem ini adalah sebagai berikut:'),
    ]),
    ListItem('1', [
      T('Bagaimana merancang dan membangun arsitektur aplikasi '),
      TItalic('RockyTen'),
      T(' berbasis web yang mampu mengintegrasikan kelima instrumen metodologi '),
      TItalic('Traction'),
      T(' L10 '),
      TItalic('Meeting'),
      T(' ('),
      TItalic('Scoreboard, Rocks, Headlines, To-Do List,'),
      T(' dan '),
      TItalic('Issues'),
      T(') secara terpadu dan real-time untuk kebutuhan operasional PT Garciafood Nusantara Gemilang?'),
    ]),
    ListItem('2', [
      T('Bagaimana menerapkan model keamanan '),
      TItalic('Role-Based Access Control'),
      T(' (RBAC) pada aplikasi '),
      TItalic('RockyTen'),
      T(' guna menjamin segregasi wewenang dan privasi data antar divisi (IT, '),
      TItalic('Finance, Kitchen, Service,'),
      T(' dan '),
      TItalic('Marketing'),
      T(') sehingga mencegah kebocoran informasi strategis internal?'),
    ]),
    ListItem('3', [
      T('Bagaimana hasil pengujian fungsionalitas antarmuka dan efektivitas pembatasan hak akses sistem '),
      TItalic('RockyTen'),
      T(' menggunakan metode pengujian '),
      TItalic('Black Box Testing'),
      T(' dalam mendukung efisiensi pelaksanaan rapat mingguan serta evaluasi kinerja di PT Garciafood Nusantara Gemilang?'),
    ]),
    PEmpty(),

    SubBab('1.3', 'Batasan Masalah'),
    PIndent([
      T('Agar pembahasan dalam laporan Praktik Kerja Lapangan ini tetap terarah, mendalam, dan sesuai dengan kapasitas sumber daya serta waktu pelaksanaan yang tersedia, penulis menetapkan batasan masalah penelitian sebagai berikut:'),
    ]),
    ListItem('1', [
      T('Sistem yang dibangun, yaitu aplikasi '),
      TItalic('RockyTen'),
      T(', dikembangkan secara khusus untuk memenuhi spesifikasi kebutuhan manajerial internal PT Garciafood Nusantara Gemilang (Nasi Gerilya), Medan.'),
    ]),
    ListItem('2', [
      T('Model keamanan RBAC yang diimplementasikan dibatasi pada tiga kategori peran ('),
      TItalic('roles'),
      T('), yaitu: peran '),
      TItalic('Developer'),
      T(' (akses penuh dan panel pengujian debug), peran '),
      TItalic('Owner'),
      T(' (akses pemantauan menyeluruh seluruh divisi tanpa fitur debugging), dan peran PIC ('),
      TItalic('Person In Charge'),
      T(') yang terisolasi hanya pada ruang lingkup divisinya masing-masing.'),
    ]),
    ListItem('3', [
      T('Cakupan divisi bisnis yang dikelola secara eksklusif meliputi 5 unit kerja: Divisi IT, Divisi '),
      TItalic('Finance'),
      T(', Divisi '),
      TItalic('Kitchen'),
      T(', Divisi '),
      TItalic('Service'),
      T(', dan Divisi '),
      TItalic('Marketing'),
      T('.'),
    ]),
    ListItem('4', [
      T('Metodologi rekayasa perangkat lunak yang diterapkan mengacu pada model sekuensial linier '),
      TItalic('Waterfall'),
      T(', yang mencakup tahap analisis kebutuhan, perancangan sistem, konstruksi pengodean, pengujian fungsional, dan evaluasi akhir.'),
    ]),
    ListItem('5', [
      T('Pengujian fungsionalitas dan ketahanan otorisasi hak akses sistem dilaksanakan menggunakan teknik '),
      TItalic('Black Box Testing'),
      T(' pada peramban web Google Chrome versi desktop.'),
    ]),
    ListItem('6', [
      T('Aplikasi tidak mencakup transaksi penjualan kasir langsung ('),
      TItalic('Point of Sale/POS'),
      T('), penggajian karyawan ('),
      TItalic('payroll'),
      T('), pencatatan absensi biometrik, maupun integrasi pembayaran '),
      TItalic('payment gateway'),
      T(' pihak ketiga.'),
    ]),
    PEmpty(),

    SubBab('1.4', 'Tujuan Praktik Kerja Lapangan'),
    PIndent([
      T('Pelaksanaan Praktik Kerja Lapangan dan penyusunan laporan ilmiah ini bertujuan untuk:'),
    ]),
    ListItem('1', [
      T('Menganalisis, merancang, dan mengimplementasikan aplikasi manajemen kinerja berbasis web bernama '),
      TItalic('RockyTen'),
      T(' yang mengadopsi instrumen '),
      TItalic('Traction Level 10 Meeting'),
      T(' guna mentransformasi sistem koordinasi manual menjadi sistem digital yang terstruktur, transparan, dan akuntabel di PT Garciafood Nusantara Gemilang.'),
    ]),
    ListItem('2', [
      T('Menerapkan arsitektur keamanan '),
      TItalic('Role-Based Access Control'),
      T(' (RBAC) pada seluruh modul aplikasi guna melindungi kerahasiaan data operasional dan keuangan antar divisi, serta memberikan kemudahan pengawasan bagi jajaran Direksi ('),
      TItalic('Owner'),
      T(').'),
    ]),
    ListItem('3', [
      T('Menguji kelayakan operasional, keandalan sistem, dan kesesuaian antarmuka pengguna aplikasi '),
      TItalic('RockyTen'),
      T(' sehingga menghasilkan sistem informasi yang siap diimplementasikan secara riil di lingkungan PT Garciafood Nusantara Gemilang.'),
    ]),
    PEmpty(),

    SubBab('1.5', 'Manfaat Praktik Kerja Lapangan'),
    PIndent([
      T('Hasil dari pelaksanaan Praktik Kerja Lapangan ini diharapkan dapat memberikan kontribusi nyata yang bermanfaat bagi berbagai pihak yang berkepentingan, antara lain:'),
    ]),
    new Paragraph({
      children: [new TextRun({ text: '1. Manfaat Bagi PT Garciafood Nusantara Gemilang', font: FONT, size: SIZE_BODY, bold: true })],
      spacing: SPACING_15,
      indent: { left: CM(1.27) },
    }),
    ListAlpha('a', [
      T('Tersedianya sistem informasi manajemen kinerja digital yang memungkinkan pemantauan metrik operasional ('),
      TItalic('Scoreboard'),
      T(') dan target kuartalan 90 hari ('),
      TItalic('Rocks'),
      T(') secara real-time dan terpusat.'),
    ]),
    ListAlpha('b', [
      T('Meningkatnya efektivitas dan produktivitas pelaksanaan rapat mingguan manajemen melalui alur L10 '),
      TItalic('Meeting'),
      T(' yang terstruktur, sehingga setiap kendala dapat diatasi melalui pendekatan IDS ('),
      TItalic('Identify, Discuss, Solve'),
      T(') secara tuntas.'),
    ]),
    ListAlpha('c', [
      T('Terjaminnya kerahasiaan dan integritas data bisnis melalui pemisahan hak akses (RBAC) antar divisi yang mencegah terjadinya akses data tanpa wewenang.'),
    ]),
    PEmpty(),
    new Paragraph({
      children: [new TextRun({ text: '2. Manfaat Bagi Mahasiswa', font: FONT, size: SIZE_BODY, bold: true })],
      spacing: SPACING_15,
      indent: { left: CM(1.27) },
    }),
    ListAlpha('a', [
      T('Memperoleh pengalaman kerja praktis di industri secara nyata dalam merancang, mengembangkan, dan menerapkan solusi perangkat lunak pada lingkungan korporasi kuliner profesional.'),
    ]),
    ListAlpha('b', [
      T('Mengasah keahlian teknis tingkat lanjut dalam rekayasa perangkat lunak modern, khususnya penguasaan ekosistem Next.js 16 (App Router), Supabase PostgreSQL, Tailwind CSS, TypeScript, serta implementasi konsep keamanan data RBAC skala produksi.'),
    ]),
    ListAlpha('c', [
      T('Mengembangkan kompetensi non-teknis ('),
      TItalic('soft skills'),
      T('), seperti komunikasi profesional, manajemen waktu proyek, analisis pemecahan masalah bisnis, serta kolaborasi lintas disiplin ilmu.'),
    ]),
    PEmpty(),
    new Paragraph({
      children: [new TextRun({ text: '3. Manfaat Bagi Politeknik Ganesha Medan', font: FONT, size: SIZE_BODY, bold: true })],
      spacing: SPACING_15,
      indent: { left: CM(1.27) },
    }),
    ListAlpha('a', [
      T('Menjadi tolok ukur implementasi kurikulum pendidikan vokasi yang relevan, selaras, dan aplikatif terhadap kebutuhan nyata dunia usaha dan dunia industri (DUDI).'),
    ]),
    ListAlpha('b', [
      T('Memperluas dan mempererat hubungan kemitraan strategis antara Politeknik Ganesha Medan dengan PT Garciafood Nusantara Gemilang dalam pengembangan teknologi dan penyerapan lulusan.'),
    ]),
    ListAlpha('c', [
      T('Menambah perbendaharaan karya ilmiah dan dokumentasi studi kasus terapan di bidang Teknik Informatika yang dapat dijadikan rujukan berharga bagi penelitian mahasiswa pada periode berikutnya.'),
    ]),
  ];
}

module.exports = {
  getBab1Children,
};
