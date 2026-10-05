/**
 * Generator Laporan PKL RockyTen — Word (.docx)
 * Format: Politeknik Ganesha Medan 2025
 * Font: Times New Roman 12pt
 * Margin: Kiri 4cm, Atas 3cm, Kanan 3cm, Bawah 3cm
 * Spasi: 1.5 (276 twips), Daftar Pustaka: 1 spasi
 * Sitasi: IEEE 2006
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageOrientation, SectionType,
  TabStopPosition, TabStopType, LeaderType,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  Header, Footer, PageNumber, NumberFormat,
  convertInchesToTwip, convertMillimetersToTwip,
  PageBreak, LevelFormat, UnderlineType,
  LineRuleType, TableLayoutType, TableBorders,
  VerticalAlign, ShadingType,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── KONSTANTA FORMAT ──────────────────────────────────────────────────────────
const CM = (cm) => convertMillimetersToTwip(cm * 10);
const FONT = 'Times New Roman';
const SIZE = 24; // 12pt = 24 half-points
const SIZE_COVER = 28; // 14pt untuk cover
const SPACING_15 = { line: 360, lineRule: LineRuleType.AUTO }; // 1.5 spasi
const SPACING_1 = { line: 240, lineRule: LineRuleType.AUTO };  // 1 spasi
const INDENT_ALINEA = { firstLine: CM(1.27) };
const MARGINS = { top: CM(3), right: CM(3), bottom: CM(3), left: CM(4) };

// ─── HELPER: TextRun standar ───────────────────────────────────────────────────
const T = (text, opts = {}) => new TextRun({ text, font: FONT, size: SIZE, ...opts });
const TBold = (text, opts = {}) => T(text, { bold: true, ...opts });
const TItalic = (text, opts = {}) => T(text, { italics: true, ...opts });
const TBoldItalic = (text, opts = {}) => T(text, { bold: true, italics: true, ...opts });

// ─── HELPER: Paragraf standar ─────────────────────────────────────────────────
const P = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [typeof children === 'string' ? T(children) : children],
  spacing: SPACING_15,
  alignment: AlignmentType.JUSTIFIED,
  ...opts,
});

const PCenter = (children, opts = {}) => P(children, { alignment: AlignmentType.CENTER, ...opts });
const PLeft = (children, opts = {}) => P(children, { alignment: AlignmentType.LEFT, ...opts });

// Paragraf kosong
const EMPTY = () => P([T('')], { spacing: SPACING_1 });

// ─── HELPER: Heading BAB ───────────────────────────────────────────────────────
const BabHeading = (text) => new Paragraph({
  children: [TBold(text.toUpperCase())],
  alignment: AlignmentType.CENTER,
  spacing: { ...SPACING_1, before: 0, after: 240 },
  style: 'Heading1',
});

const SubBab = (num, title) => new Paragraph({
  children: [TBold(`${num} ${title}`)],
  alignment: AlignmentType.LEFT,
  spacing: { ...SPACING_15, before: 240, after: 120 },
  indent: INDENT_ALINEA,
});

const SubSubBab = (num, title) => new Paragraph({
  children: [TBold(`${num} ${title}`)],
  alignment: AlignmentType.LEFT,
  spacing: { ...SPACING_15, before: 120, after: 60 },
  indent: INDENT_ALINEA,
});

// ─── HELPER: List item (nomor, bukan bullet) ──────────────────────────────────
const ListItem = (num, content) => new Paragraph({
  children: [T(`${num}. `), ...(Array.isArray(content) ? content : [T(content)])],
  spacing: SPACING_15,
  alignment: AlignmentType.JUSTIFIED,
  indent: { left: CM(1.27), hanging: CM(0.75) },
});

const ListAlpha = (alpha, content) => new Paragraph({
  children: [T(`${alpha}. `), ...(Array.isArray(content) ? content : [T(content)])],
  spacing: SPACING_15,
  alignment: AlignmentType.JUSTIFIED,
  indent: { left: CM(2.0), hanging: CM(0.75) },
});

// ─── HELPER: Caption gambar (bawah, center, bold) ────────────────────────────
const Caption = (text) => new Paragraph({
  children: [TBold(text)],
  alignment: AlignmentType.CENTER,
  spacing: { ...SPACING_1, before: 60, after: 240 },
});

// ─── HELPER: Tabel sederhana ──────────────────────────────────────────────────
const makeTable = (headers, rows, widths = null) => {
  const colCount = headers.length;
  const defaultWidth = Math.floor(9000 / colCount);
  const colWidths = widths || headers.map(() => defaultWidth);

  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      children: [new Paragraph({ children: [TBold(h)], alignment: AlignmentType.CENTER, spacing: SPACING_1 })],
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: 'D9D9D9', type: ShadingType.CLEAR },
      verticalAlign: VerticalAlign.CENTER,
    })),
    tableHeader: true,
  });

  const dataRows = rows.map(row => new TableRow({
    children: row.map((cell, i) => new TableCell({
      children: [new Paragraph({ children: Array.isArray(cell) ? cell : [T(cell)], alignment: AlignmentType.JUSTIFIED, spacing: SPACING_1 })],
      width: { size: colWidths[i], type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
    })),
  }));

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
  });
};

// ─── HALAMAN JUDUL ────────────────────────────────────────────────────────────
const halamanJudul = (halaman) => ({
  properties: {
    page: {
      margin: MARGINS,
      pageNumbers: { start: halaman, formatType: NumberFormat.LOWER_ROMAN },
    },
  },
  children: [
    new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
    // Logo placeholder
    PCenter([TBold('POLITEKNIK GANESHA MEDAN', { size: SIZE_COVER })]),
    EMPTY(),
    EMPTY(),
    // Judul
    PCenter([TBold(
      'RANCANG BANGUN APLIKASI ROCKYTEN BERBASIS WEB\nDENGAN KEAMANAN RBAC PADA\nPT GARCIAFOOD NUSANTARA GEMILANG',
      { size: SIZE_COVER }
    )]),
    EMPTY(),
    EMPTY(),
    PCenter([TBold('LAPORAN MAGANG', { size: SIZE_COVER })]),
    EMPTY(),
    EMPTY(),
    PCenter([T('Disusun Oleh:')]),
    PCenter([TBold('M Harys Rusty Wibawa', { size: SIZE_COVER })]),
    PCenter([T('NIM: 24012228')]),
    EMPTY(),
    EMPTY(),
    PCenter([TBold('PROGRAM STUDI TEKNIK INFORMATIKA', { size: SIZE_COVER })]),
    PCenter([TBold('POLITEKNIK GANESHA MEDAN', { size: SIZE_COVER })]),
    PCenter([TBold('MEDAN', { size: SIZE_COVER })]),
    PCenter([TBold('2026', { size: SIZE_COVER })]),
  ],
});

// ─── LEMBAR PERSETUJUAN ───────────────────────────────────────────────────────
const lembarPersetujuan = () => [
  PCenter([TBold('LEMBAR PERSETUJUAN LAPORAN MAGANG', { size: SIZE_COVER })]),
  EMPTY(),
  P([T('Laporan Magang dengan judul '),
    TBold('"Rancang Bangun Aplikasi RockyTen Berbasis Web Dengan Keamanan RBAC Pada PT Garciafood Nusantara Gemilang"'),
    T(' yang disusun oleh M Harys Rusty Wibawa (NIM: 24012228) telah diperiksa dan disetujui untuk diajukan sebagai syarat menyelesaikan jenjang pendidikan Diploma III Program Studi Teknik Informatika di Politeknik Ganesha Medan.')
  ], { indent: INDENT_ALINEA }),
  EMPTY(),
  PCenter([T('Medan, November 2026')]),
  EMPTY(),
  EMPTY(),
  // Tabel tanda tangan 2 kolom
  makeTable(
    ['Dosen Pembimbing', 'Pembimbing Lapangan'],
    [
      ['', ''],
      ['', ''],
      ['', ''],
      ['Supardi, S.Kom., M.Kom.\nNIDN: 0105037301', 'Annisa\nPT Garciafood Nusantara Gemilang'],
    ],
    [4500, 4500]
  ),
  EMPTY(),
  PCenter([T('Diketahui Oleh,')]),
  PCenter([T('Ketua Program Studi Teknik Informatika')]),
  EMPTY(),
  EMPTY(),
  EMPTY(),
  PCenter([TBold('Supardi, S.Kom., M.Kom.')]),
  PCenter([T('NIDN: 0105037301')]),
];

// ─── PERNYATAAN KEASLIAN ──────────────────────────────────────────────────────
const pernyataanKeaslian = () => [
  PCenter([TBold('PERNYATAAN KEASLIAN', { size: SIZE_COVER })]),
  EMPTY(),
  P([T('Saya yang bertanda tangan di bawah ini:')], { indent: INDENT_ALINEA }),
  new Paragraph({ children: [T('Nama\t: M Harys Rusty Wibawa')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(3) }] }),
  new Paragraph({ children: [T('NIM\t: 24012228')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(3) }] }),
  new Paragraph({ children: [T('Prodi\t: Teknik Informatika')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(3) }] }),
  EMPTY(),
  P([T('menyatakan dengan sesungguhnya bahwa laporan magang yang berjudul '),
    TBold('"Rancang Bangun Aplikasi RockyTen Berbasis Web Dengan Keamanan RBAC Pada PT Garciafood Nusantara Gemilang"'),
    T(' merupakan hasil karya saya sendiri dan bukan merupakan hasil jiplakan ataupun plagiat dari karya orang lain. Semua sumber informasi yang digunakan telah saya cantumkan dalam daftar pustaka.')
  ], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Apabila di kemudian hari terbukti pernyataan ini tidak benar, maka saya bersedia menerima segala konsekuensi hukum yang berlaku.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  PCenter([T('Medan, November 2026')]),
  EMPTY(),
  PCenter([T('[e-Meterai Digital Rp10.000]')]),
  EMPTY(),
  EMPTY(),
  EMPTY(),
  PCenter([TBold('M Harys Rusty Wibawa')]),
];

// ─── KATA PENGANTAR ───────────────────────────────────────────────────────────
const katapengantar = () => [
  PCenter([TBold('KATA PENGANTAR', { size: SIZE_COVER })]),
  EMPTY(),
  P([T('Puji syukur penulis panjatkan kepada Tuhan Yang Maha Esa atas segala rahmat dan karunia-Nya sehingga penulis dapat menyelesaikan laporan magang ini dengan baik. Laporan magang yang berjudul '),
    TItalic('"Rancang Bangun Aplikasi RockyTen Berbasis Web Dengan Keamanan RBAC Pada PT Garciafood Nusantara Gemilang"'),
    T(' ini disusun sebagai salah satu syarat untuk menyelesaikan program pendidikan Diploma III di Politeknik Ganesha Medan.')
  ], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Selama pelaksanaan magang, penulis mendapatkan pengalaman berharga dalam merancang dan membangun sistem informasi manajemen berbasis web yang diterapkan secara nyata di lingkungan UMKM. Proses ini tidak hanya memperkuat kompetensi teknis penulis, tetapi juga memberikan pemahaman mendalam tentang kebutuhan nyata sebuah bisnis kuliner dalam mengelola kinerja tim secara digital dan terstruktur.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Dalam kesempatan ini, penulis mengucapkan terima kasih yang sebesar-besarnya kepada:')], { indent: INDENT_ALINEA }),
  ListItem('1', [T('Bapak '), TBold('Supardi, S.Kom., M.Kom.'), T(' selaku Dosen Pembimbing sekaligus Ketua Program Studi Teknik Informatika Politeknik Ganesha Medan yang telah memberikan bimbingan, arahan, dan motivasi selama pelaksanaan magang dan penulisan laporan ini.')]),
  ListItem('2', [T('Ibu '), TBold('Annisa'), T(' selaku Pembimbing Lapangan di PT Garciafood Nusantara Gemilang yang telah menerima, membimbing, dan memberikan kesempatan kepada penulis untuk berkontribusi langsung dalam pengembangan sistem digital di perusahaan.')]),
  ListItem('3', 'Seluruh pimpinan dan karyawan PT Garciafood Nusantara Gemilang yang telah bersedia meluangkan waktu untuk wawancara, memberikan data, dan memberikan masukan selama proses perancangan sistem.'),
  ListItem('4', 'Orang tua dan keluarga penulis yang senantiasa memberikan doa, dukungan moral, dan semangat tanpa henti.'),
  ListItem('5', 'Seluruh rekan mahasiswa Program Studi Teknik Informatika Politeknik Ganesha Medan angkatan 2024 yang telah memberikan dukungan dan masukan selama proses penulisan laporan ini.'),
  EMPTY(),
  P([T('Penulis menyadari bahwa laporan ini masih memiliki kekurangan dan jauh dari sempurna. Oleh karena itu, penulis sangat mengharapkan kritik dan saran yang membangun dari semua pihak demi penyempurnaan laporan ini. Semoga laporan ini dapat bermanfaat bagi semua pihak yang membutuhkan.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  PCenter([T('Medan, November 2026')]),
  EMPTY(),
  EMPTY(),
  PCenter([TBold('M Harys Rusty Wibawa')]),
];

// ─── BAB I ─────────────────────────────────────────────────────────────────────
const bab1 = () => [
  BabHeading('BAB I\nPENDAHULUAN'),
  SubBab('1.1', 'Latar Belakang'),
  P([
    T('Perkembangan teknologi informasi yang pesat pada era digital saat ini telah memberikan dampak yang signifikan terhadap berbagai sektor industri, termasuk sektor usaha mikro, kecil, dan menengah (UMKM). UMKM di bidang kuliner ('),
    TItalic('food and beverage'),
    T(') menghadapi tantangan utama dalam hal pengelolaan kinerja tim, koordinasi antar divisi, dan pelaksanaan rapat yang terstruktur. Ketidakhadiran sistem digital yang terpadu menyebabkan proses pemantauan target kerja menjadi tidak efisien dan sulit dipantau secara '),
    TItalic('real-time'),
    T(', yang berdampak langsung pada produktivitas dan konsistensi kinerja bisnis. Sebagai respons terhadap kebutuhan ini, Gino Wickman dalam '),
    TItalic('Traction: Get a Grip on Your Business'),
    T(' (2011) memperkenalkan '),
    TItalic('Entrepreneurial Operating System'),
    T(' (EOS) dengan komponen utama '),
    TItalic('Level 10 Meeting'),
    T(' (L10) yang mencakup '),
    TItalic('Scorecard'),
    T(', '),
    TItalic('Rocks'),
    T(', '),
    TItalic('Headlines'),
    T(', '),
    TItalic('To-Do List'),
    T(', dan '),
    TItalic('Issues'),
    T(' sebagai kerangka manajemen bisnis yang terstruktur dan terukur [5].'),
  ], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([
    T('Beberapa penelitian sebelumnya telah membahas rancang bangun sistem informasi berbasis web untuk mendukung operasional UMKM. Akmal dan Saputra (2024) membangun '),
    TItalic('website company profile'),
    T(' menggunakan PHP dan MySQL dengan metode '),
    TItalic('Waterfall'),
    T(' yang berhasil meningkatkan visibilitas digital perusahaan [1]. Supriyadi et al. (2024) merancang dan membangun '),
    TItalic('company profile'),
    T(' berbasis web untuk UMKM makanan beku menggunakan pendekatan yang sama [4]. Namun, penelitian-penelitian tersebut hanya berfokus pada sistem informasi statis dan belum mengintegrasikan fitur manajemen kinerja dinamis seperti pemantauan KPI, pengelolaan target, maupun mekanisme keamanan berbasis peran ('),
    TItalic('Role-Based Access Control'),
    T('/RBAC). Penelitian ini berbeda karena berfokus pada pembangunan sistem manajemen kinerja interaktif yang mengadopsi metodologi '),
    TItalic('Traction'),
    T(' L10 '),
    TItalic('Meeting'),
    T(' dengan mekanisme RBAC yang memastikan keamanan akses data antar divisi.'),
  ], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([
    T('PT Garciafood Nusantara Gemilang adalah perusahaan '),
    TItalic('food and beverage'),
    T(' di Medan yang memiliki lima divisi operasional: IT, '),
    TItalic('Finance'),
    T(', '),
    TItalic('Kitchen'),
    T(', '),
    TItalic('Service'),
    T(', dan '),
    TItalic('Marketing'),
    T('. Saat ini, koordinasi antar divisi masih dilakukan secara manual tanpa sistem digital terpusat, tidak ada mekanisme pemantauan target yang terstruktur, dan belum ada kontrol akses yang menjamin privasi data antar divisi. Kondisi ini mendorong perlunya pengembangan sistem manajemen digital terintegrasi. Oleh karena itu, penulis merancang dan membangun aplikasi '),
    TItalic('RockyTen'),
    T(' berbasis web yang mengadopsi metodologi '),
    TItalic('Traction'),
    T(' L10 '),
    TItalic('Meeting'),
    T(' dengan mengintegrasikan fitur '),
    TItalic('Scoreboard'),
    T(', '),
    TItalic('Rocks'),
    T(', '),
    TItalic('Headline'),
    T(', '),
    TItalic('To-Do List'),
    T(', dan '),
    TItalic('Issues'),
    T(' dalam satu platform terpadu, disertai implementasi RBAC dengan tiga peran pengguna: '),
    TItalic('Developer'),
    T(', '),
    TItalic('Owner'),
    T(', dan PIC ('),
    TItalic('Person In Charge'),
    T(') per divisi.'),
  ], { indent: INDENT_ALINEA }),
  EMPTY(),
  SubBab('1.2', 'Rumusan Masalah'),
  P([T('Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam penelitian ini adalah sebagai berikut:')], { indent: INDENT_ALINEA }),
  ListItem('1', [T('Bagaimana merancang dan membangun aplikasi '), TItalic('RockyTen'), T(' berbasis web yang mengintegrasikan fitur '), TItalic('Scoreboard'), T(', '), TItalic('Rocks'), T(', '), TItalic('Headline'), T(', '), TItalic('To-Do List'), T(', dan '), TItalic('Issues'), T(' berdasarkan metodologi '), TItalic('Traction'), T(' L10 '), TItalic('Meeting'), T('?')]),
  ListItem('2', [T('Bagaimana menerapkan mekanisme '), TItalic('Role-Based Access Control'), T(' (RBAC) pada aplikasi '), TItalic('RockyTen'), T(' untuk PT Garciafood Nusantara Gemilang guna memastikan keamanan dan privasi data antar divisi?')]),
  ListItem('3', [T('Bagaimana hasil pengujian fungsionalitas aplikasi '), TItalic('RockyTen'), T(' dalam mendukung manajemen kinerja dan koordinasi antar divisi di PT Garciafood Nusantara Gemilang?')]),
  EMPTY(),
  SubBab('1.3', 'Batasan Masalah'),
  P([T('Untuk menjaga fokus dan cakupan penelitian, penulis membatasi permasalahan dalam penelitian ini sebagai berikut:')], { indent: INDENT_ALINEA }),
  ListItem('1', [T('Aplikasi '), TItalic('RockyTen'), T(' dirancang dan dikembangkan khusus untuk kebutuhan operasional PT Garciafood Nusantara Gemilang.')]),
  ListItem('2', [T('Sistem RBAC yang diimplementasikan mencakup tiga peran pengguna: '), TItalic('Developer'), T(', '), TItalic('Owner'), T(', dan PIC ('), TItalic('Person In Charge'), T(') per divisi.')]),
  ListItem('3', [T('Divisi yang dikelola dalam sistem meliputi: IT, '), TItalic('Finance'), T(', '), TItalic('Kitchen'), T(', '), TItalic('Service'), T(', dan '), TItalic('Marketing'), T('.')]),
  ListItem('4', [T('Pembangunan aplikasi menggunakan metode pengembangan perangkat lunak '), TItalic('Waterfall'), T('.')]),
  ListItem('5', [T('Pengujian sistem dilakukan secara fungsional menggunakan peramban ('), TItalic('browser'), T(') Google Chrome.')]),
  ListItem('6', 'Aplikasi tidak mencakup fitur penggajian, absensi, maupun integrasi dengan sistem keuangan eksternal.'),
  EMPTY(),
  SubBab('1.4', 'Tujuan Penelitian'),
  P([T('Tujuan dari pelaksanaan magang dan penelitian ini adalah:')], { indent: INDENT_ALINEA }),
  ListItem('1', [T('Merancang dan membangun aplikasi '), TItalic('RockyTen'), T(' berbasis web yang mengintegrasikan metodologi '), TItalic('Traction'), T(' L10 '), TItalic('Meeting'), T(' untuk mendukung manajemen kinerja di PT Garciafood Nusantara Gemilang.')]),
  ListItem('2', [T('Menerapkan mekanisme '), TItalic('Role-Based Access Control'), T(' (RBAC) sebagai sistem keamanan yang memastikan setiap pengguna hanya dapat mengakses data dan fitur sesuai perannya.')]),
  ListItem('3', 'Menghasilkan sistem yang siap digunakan oleh lima divisi operasional PT Garciafood Nusantara Gemilang secara terpusat dan terintegrasi.'),
  EMPTY(),
  SubBab('1.5', 'Manfaat Penelitian'),
  P([TBold('Bagi PT Garciafood Nusantara Gemilang:')], { indent: INDENT_ALINEA }),
  ListItem('1', [T('Tersedianya sistem manajemen digital yang membantu pemantauan kinerja seluruh divisi secara '), TItalic('real-time'), T(' dan terstruktur.')]),
  ListItem('2', [T('Meningkatnya efisiensi rapat dan koordinasi antar tim melalui implementasi format L10 '), TItalic('Meeting'), T(' dalam platform digital.')]),
  ListItem('3', 'Terjaminnya keamanan dan privasi data antar divisi melalui mekanisme RBAC yang terstruktur.'),
  EMPTY(),
  P([TBold('Bagi Mahasiswa:')], { indent: INDENT_ALINEA }),
  ListItem('1', 'Diperolehnya pengalaman nyata dalam merancang dan membangun aplikasi berbasis web yang langsung diterapkan di lingkungan industri.'),
  ListItem('2', [T('Meningkatnya pemahaman dan keterampilan teknis dalam penggunaan '), TItalic('framework'), T(' Next.js, Supabase, Tailwind CSS, serta konsep RBAC dan manajemen '), TItalic('state'), T(' pada aplikasi skala produksi.')]),
  ListItem('3', 'Terbangunnya kemampuan komunikasi dan adaptasi dalam lingkungan kerja profesional.'),
  EMPTY(),
  P([TBold('Bagi Akademik:')], { indent: INDENT_ALINEA }),
  ListItem('1', 'Menjadi referensi dan dokumentasi ilmiah bagi penelitian selanjutnya di bidang pengembangan sistem informasi manajemen berbasis web.'),
  ListItem('2', 'Memperkuat kemitraan antara Politeknik Ganesha Medan dengan dunia industri melalui kontribusi nyata mahasiswa dalam pemecahan masalah bisnis.'),
  ListItem('3', 'Memberikan kontribusi pada pengembangan kurikulum praktis di bidang Teknik Informatika, khususnya terkait penerapan RBAC dan metodologi manajemen modern.'),
];

// ─── BAB II ────────────────────────────────────────────────────────────────────
const bab2 = () => [
  BabHeading('BAB II\nLANDASAN TEORI'),
  SubBab('2.1', 'Tinjauan Pustaka'),
  SubSubBab('2.1.1', 'Rancang Bangun Sistem Informasi'),
  P([T('Rancang bangun sistem informasi merupakan proses yang mencakup perancangan ('), TItalic('design'), T(') dan pembangunan ('), TItalic('development'), T(') dari sebuah sistem yang bertujuan untuk mengumpulkan, mengolah, menyimpan, dan mendistribusikan informasi guna mendukung pengambilan keputusan dalam suatu organisasi. Menurut Supriyadi et al. [4], rancang bangun sistem informasi berbasis web adalah kegiatan sistematis yang mencakup analisis kebutuhan pengguna, perancangan arsitektur sistem, implementasi kode program, hingga pengujian dan evaluasi sistem secara menyeluruh.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Sistem informasi yang dibangun secara terstruktur dan metodis akan menghasilkan perangkat lunak yang tidak hanya berfungsi dengan baik secara teknis, tetapi juga mampu menjawab kebutuhan nyata penggunanya. Dalam konteks UMKM, rancang bangun sistem informasi menjadi krusial karena sumber daya yang terbatas menuntut efisiensi tinggi dalam setiap proses bisnis. Dengan adanya sistem informasi yang tepat, UMKM dapat meningkatkan produktivitas, akurasi data, dan kemampuan pengambilan keputusan berbasis data ('), TItalic('data-driven decision making'), T(').')], { indent: INDENT_ALINEA }),

  SubSubBab('2.1.2', 'Aplikasi Berbasis Web'),
  P([T('Aplikasi berbasis web adalah perangkat lunak yang diakses melalui peramban ('), TItalic('web browser'), T(') dengan memanfaatkan jaringan internet atau intranet. Berbeda dengan aplikasi '), TItalic('desktop'), T(' yang harus diinstal pada setiap komputer, aplikasi web bersifat '), TItalic('platform-independent'), T(' sehingga dapat diakses dari berbagai perangkat tanpa instalasi tambahan. Menurut Akmal dan Saputra [1], aplikasi berbasis web menawarkan kemudahan pemeliharaan, distribusi pembaruan yang terpusat, serta aksesibilitas yang tinggi.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Dalam pembangunan aplikasi '), TItalic('RockyTen'), T(', digunakan beberapa teknologi utama sebagai berikut:')], { indent: INDENT_ALINEA }),
  ListItem('1', [TItalic('Next.js'), T(' — '), TItalic('framework'), T(' React berbasis JavaScript yang mendukung '), TItalic('Server-Side Rendering'), T(' (SSR) dan '), TItalic('Static Site Generation'), T(' (SSG), memberikan performa tinggi dan struktur kode terorganisir.')]),
  ListItem('2', [TItalic('Tailwind CSS'), T(' — '), TItalic('framework'), T(' CSS berbasis '), TItalic('utility-first'), T(' yang memungkinkan perancangan antarmuka yang responsif dan konsisten.')]),
  ListItem('3', [TItalic('Supabase'), T(' — platform '), TItalic('Backend-as-a-Service'), T(' (BaaS) berbasis PostgreSQL yang menyediakan autentikasi, basis data relasional, dan '), TItalic('realtime subscription'), T('.')]),
  ListItem('4', [TItalic('TypeScript'), T(' — superset dari JavaScript yang menambahkan sistem tipe statis, meningkatkan keandalan dan keterbacaan kode.')]),

  SubSubBab('2.1.3', 'Role-Based Access Control (RBAC)'),
  P([TItalic('Role-Based Access Control'), T(' (RBAC) adalah model keamanan sistem informasi di mana hak akses pengguna terhadap sumber daya sistem ditentukan berdasarkan peran ('), TItalic('role'), T(') yang dimiliki oleh pengguna tersebut, bukan berdasarkan identitas individu secara langsung. RBAC pertama kali distandarisasi oleh NIST ('), TItalic('National Institute of Standards and Technology'), T(') dan telah menjadi pendekatan dominan dalam manajemen akses sistem informasi modern [3].')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Terdapat tiga komponen utama dalam RBAC, yaitu:')], { indent: INDENT_ALINEA }),
  ListAlpha('a', [TItalic('User'), T(' (Pengguna) — individu yang berinteraksi dengan sistem dan ditetapkan ke dalam satu atau lebih peran.')]),
  ListAlpha('b', [TItalic('Role'), T(' (Peran) — kumpulan izin yang didefinisikan berdasarkan tanggung jawab pekerjaan dalam organisasi.')]),
  ListAlpha('c', [TItalic('Permission'), T(' (Izin) — hak untuk melakukan operasi tertentu terhadap sumber daya tertentu dalam sistem.')]),
  EMPTY(),
  P([T('Dalam aplikasi '), TItalic('RockyTen'), T(', RBAC diimplementasikan dengan tiga peran: (1) '), TItalic('Developer'), T(' — akses penuh termasuk '), TItalic('debug panel'), T('; (2) '), TItalic('Owner'), T(' — akses seluruh divisi tanpa kemampuan '), TItalic('debugging'), T('; (3) PIC ('), TItalic('Person In Charge'), T(') — akses terbatas hanya pada data divisi yang menjadi tanggung jawabnya.')], { indent: INDENT_ALINEA }),

  SubSubBab('2.1.4', 'Metodologi Traction — Level 10 Meeting'),
  P([TItalic('Traction: Get a Grip on Your Business'), T(' adalah buku karya Gino Wickman yang diterbitkan pada tahun 2011. Buku ini memperkenalkan '), TItalic('Entrepreneurial Operating System'), T(' (EOS), sebuah sistem manajemen bisnis komprehensif yang dirancang untuk membantu para wirausahawan mendapatkan kontrol penuh atas bisnis mereka melalui disiplin, akuntabilitas, dan eksekusi yang terstruktur [5].')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Salah satu komponen paling aplikatif dari EOS adalah '), TItalic('Level 10 Meeting'), T(' (L10), yakni format rapat mingguan terstruktur yang dirancang untuk memaksimalkan produktivitas dan fokus tim. L10 '), TItalic('Meeting'), T(' terdiri dari lima elemen utama:')], { indent: INDENT_ALINEA }),
  ListItem('1', [TItalic('Scorecard'), T(' (Scoreboard) — tinjauan mingguan terhadap metrik-metrik kunci yang menunjukkan kesehatan bisnis dengan target yang dilacak secara konsisten dari minggu ke minggu.')]),
  ListItem('2', [TItalic('Rocks'), T(' — target-target prioritas jangka menengah dengan rentang waktu 90 hari, merepresentasikan inisiatif strategis yang harus diselesaikan oleh PIC dalam satu kuartal.')]),
  ListItem('3', [TItalic('Headlines'), T(' — informasi penting, pengumuman, atau berita yang perlu diketahui oleh seluruh tim sebelum membahas isu-isu spesifik.')]),
  ListItem('4', [TItalic('To-Do List'), T(' — daftar tugas singkat yang disepakati di akhir rapat dan ditinjau kembali di rapat berikutnya untuk memastikan akuntabilitas.')]),
  ListItem('5', [TItalic('Issues'), T(' (IDS) — daftar permasalahan yang diselesaikan melalui metode '), TItalic('Identify, Discuss, Solve'), T(' (IDS) secara tuntas dalam satu sesi rapat.')]),

  SubSubBab('2.1.5', 'Metode Waterfall'),
  P([T('Metode '), TItalic('Waterfall'), T(' adalah pendekatan pengembangan perangkat lunak yang bersifat sekuensial dan linier, di mana setiap tahapan harus diselesaikan sepenuhnya sebelum tahap berikutnya dimulai. Metode ini diperkenalkan oleh Winston Royce pada tahun 1970 dan menjadi salah satu metodologi pengembangan perangkat lunak yang paling banyak digunakan, khususnya untuk proyek dengan ruang lingkup yang jelas dan kebutuhan yang tidak banyak berubah selama proses pengembangan.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Metode '), TItalic('Waterfall'), T(' terdiri dari lima tahap: (1) Analisis Kebutuhan, (2) Perancangan Sistem, (3) Implementasi, (4) Pengujian, dan (5) Pemeliharaan. Setiap tahap menghasilkan dokumentasi yang menjadi masukan bagi tahap berikutnya, sehingga proses pengembangan dapat terkontrol dan terukur.')], { indent: INDENT_ALINEA }),

  SubBab('2.2', 'Penelitian Terkait'),
  P([T('Berikut adalah penelitian-penelitian terdahulu yang relevan dengan topik penelitian ini:')], { indent: INDENT_ALINEA }),
  EMPTY(),
  new Paragraph({ children: [TBold('Tabel 2.1 Penelitian Terkait')], alignment: AlignmentType.CENTER, spacing: SPACING_1 }),
  makeTable(
    ['No', 'Peneliti', 'Tahun', 'Judul', 'Metode', 'Hasil'],
    [
      ['1', 'Akmal & Saputra', '2024', 'Perancangan Website Company Profile Menggunakan PHP dan MySQL', 'Waterfall', 'Website responsif PHP/MySQL meningkatkan visibilitas perusahaan secara digital'],
      ['2', 'Arianto et al.', '2022', 'Media Company Profile PT. Multipedia Teknika Indonesia Berbasis Web', 'Waterfall', 'Sistem web interaktif berbasis HTML, CSS, dan PHP'],
      ['3', 'Supriyadi et al.', '2024', 'Rancang Bangun Company Profile Berbasis Web (APM Frozen Food)', 'Waterfall', 'Aplikasi web UMKM meningkatkan keterjangkauan informasi bisnis'],
      ['4', 'Sandhu et al.', '1996', 'Role-Based Access Control Models', '—', 'Definisi standar RBAC yang diadopsi NIST sebagai dasar kontrol akses modern'],
      ['5 *', '[ISIAN USER]', '', '[Jurnal tentang sistem informasi manajemen UMKM/KPI]', '', ''],
    ],
    [500, 1500, 600, 2500, 1200, 2700]
  ),
  EMPTY(),

  SubBab('2.3', 'Kerangka Pemikiran'),
  P([T('Kerangka pemikiran penelitian ini dapat diuraikan melalui alur berikut:')], { indent: INDENT_ALINEA }),
  EMPTY(),
  PCenter([TBold('Permasalahan yang ditemukan:')]),
  PCenter([T('PT Garciafood Nusantara Gemilang belum memiliki sistem manajemen kinerja digital yang terpadu;')]),
  PCenter([T('pengelolaan target, rapat, dan koordinasi antar divisi masih dilakukan secara manual.')]),
  PCenter([TBold('↓')]),
  PCenter([TBold('Solusi yang diusulkan:')]),
  PCenter([T('Merancang dan membangun aplikasi RockyTen berbasis web yang mengadopsi metodologi Traction L10 Meeting')]),
  PCenter([T('disertai mekanisme Role-Based Access Control (RBAC) untuk keamanan akses data antar divisi.')]),
  PCenter([TBold('↓')]),
  PCenter([TBold('Proses pengembangan:')]),
  PCenter([T('Metode Waterfall: Analisis Kebutuhan → Perancangan → Implementasi → Pengujian → Evaluasi')]),
  PCenter([TBold('↓')]),
  PCenter([TBold('Teknologi yang digunakan:')]),
  PCenter([T('Next.js | Supabase | Tailwind CSS | TypeScript')]),
  PCenter([TBold('↓')]),
  PCenter([TBold('Hasil yang diharapkan:')]),
  PCenter([T('Aplikasi RockyTen dengan 5 modul utama dan sistem RBAC 3 peran pengguna')]),
  PCenter([T('siap diimplementasikan di PT Garciafood Nusantara Gemilang.')]),
];

// ─── BAB III ───────────────────────────────────────────────────────────────────
const bab3 = () => [
  BabHeading('BAB III\nMETODE PENELITIAN'),

  SubBab('3.1', 'Gambaran Umum Perusahaan'),
  SubSubBab('3.1.1', 'Sejarah Perusahaan'),
  P([TBold('[ISIAN USER — Sejarah PT Garciafood Nusantara Gemilang]')], { indent: INDENT_ALINEA }),
  P([T('Isikan narasi singkat: kapan berdiri, pendiri, jenis usaha, perkembangan hingga kini.')], { indent: INDENT_ALINEA }),

  SubSubBab('3.1.2', 'Visi Perusahaan'),
  P([TBold('[ISIAN USER — Visi resmi PT Garciafood Nusantara Gemilang]')], { indent: INDENT_ALINEA }),

  SubSubBab('3.1.3', 'Misi Perusahaan'),
  P([TBold('[ISIAN USER — Misi resmi PT Garciafood dalam numbered list]')], { indent: INDENT_ALINEA }),

  SubSubBab('3.1.4', 'Struktur Organisasi'),
  Caption('Gambar 3.1 Struktur Organisasi PT Garciafood Nusantara Gemilang'),
  P([TBold('[ISIAN USER — Masukkan bagan struktur organisasi di sini]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('PT Garciafood Nusantara Gemilang memiliki struktur organisasi yang terdiri dari beberapa jabatan:')], { indent: INDENT_ALINEA }),
  P([TBold('Owner — [ISIAN USER: Nama Owner]')], { indent: INDENT_ALINEA }),
  P([T('Bertanggung jawab atas seluruh kegiatan operasional perusahaan, menentukan arah strategis bisnis, serta mengawasi kinerja seluruh divisi.')], { indent: INDENT_ALINEA }),
  P([TBold('Pembimbing Lapangan — Annisa')], { indent: INDENT_ALINEA }),
  P([T('Bertanggung jawab atas koordinasi kegiatan magang mahasiswa, memberikan arahan teknis, serta menjadi penghubung antara mahasiswa dengan pihak manajemen perusahaan.')], { indent: INDENT_ALINEA }),
  P([TBold('PIC Divisi IT — [ISIAN USER: Nama]')], { indent: INDENT_ALINEA }),
  P([T('Bertanggung jawab atas pengelolaan infrastruktur teknologi informasi, pengembangan dan pemeliharaan sistem digital, serta keamanan data.')], { indent: INDENT_ALINEA }),
  P([TBold('PIC Divisi Finance — [ISIAN USER: Nama]')], { indent: INDENT_ALINEA }),
  P([T('Bertanggung jawab atas pengelolaan keuangan perusahaan, pelaporan keuangan, dan pengendalian anggaran operasional.')], { indent: INDENT_ALINEA }),
  P([TBold('PIC Divisi Kitchen — [ISIAN USER: Nama]')], { indent: INDENT_ALINEA }),
  P([T('Bertanggung jawab atas seluruh proses produksi makanan, pengendalian kualitas produk, dan manajemen bahan baku.')], { indent: INDENT_ALINEA }),
  P([TBold('PIC Divisi Service — [ISIAN USER: Nama]')], { indent: INDENT_ALINEA }),
  P([T('Bertanggung jawab atas pelayanan pelanggan, standar operasional layanan, dan kepuasan pelanggan.')], { indent: INDENT_ALINEA }),
  P([TBold('PIC Divisi Marketing — [ISIAN USER: Nama]')], { indent: INDENT_ALINEA }),
  P([T('Bertanggung jawab atas strategi pemasaran, promosi produk, dan pengembangan pangsa pasar perusahaan.')], { indent: INDENT_ALINEA }),

  SubSubBab('3.1.5', 'Logo dan Makna Logo'),
  Caption('Gambar 3.2 Logo PT Garciafood Nusantara Gemilang'),
  P([TBold('[ISIAN USER — Masukkan gambar logo PT Garciafood di sini]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Logo PT Garciafood Nusantara Gemilang terdiri dari beberapa elemen yang memiliki makna tersendiri:')], { indent: INDENT_ALINEA }),
  ListItem('1', '[ISIAN USER: Elemen 1 logo dan maknanya]'),
  ListItem('2', '[ISIAN USER: Elemen 2 logo dan maknanya]'),
  ListItem('3', '[ISIAN USER: Tipografi/nama dan maknanya]'),

  SubBab('3.2', 'Tempat dan Waktu Penelitian'),
  P([T('Penelitian ini dilaksanakan di PT Garciafood Nusantara Gemilang yang beralamat di Gg. Rukun No.1, Bantan, Kec. Medan Tembung, Kota Medan, Sumatera Utara 20223. Pelaksanaan magang berlangsung selama tiga bulan, yaitu pada tanggal 1 September 2026 sampai dengan 30 November 2026.')], { indent: INDENT_ALINEA }),

  SubBab('3.3', 'Jenis dan Sumber Data'),
  SubSubBab('3.3.1', 'Jenis Data'),
  P([T('Dalam penelitian ini, penulis menggunakan dua jenis data, yaitu:')], { indent: INDENT_ALINEA }),
  ListItem('1', [TBold('Data Kualitatif'), T(' — data yang bersifat deskriptif, meliputi informasi proses bisnis PT Garciafood, kebutuhan pengguna sistem, alur kerja antar divisi, serta masukan dari pembimbing lapangan terkait antarmuka dan fungsionalitas aplikasi RockyTen.')]),
  ListItem('2', [TBold('Data Kuantitatif'), T(' — data yang dapat diukur secara numerik, meliputi jumlah pengguna sistem, jumlah metrik Scoreboard, target Rocks per kuartal, dan hasil pengujian fungsionalitas sistem.')]),

  SubSubBab('3.3.2', 'Sumber Data'),
  P([T('Sumber data yang digunakan dalam penelitian ini meliputi:')], { indent: INDENT_ALINEA }),
  ListItem('1', [TBold('Data Internal'), T(' — data yang diperoleh langsung dari dalam PT Garciafood Nusantara Gemilang melalui observasi dan wawancara dengan Ibu Annisa selaku Pembimbing Lapangan dan perwakilan tiap divisi.')]),
  ListItem('2', [TBold('Data Eksternal'), T(' — data dari luar perusahaan berupa referensi ilmiah: buku '), TItalic('Traction'), T(' oleh Gino Wickman, jurnal-jurnal penelitian tentang RBAC dan sistem informasi berbasis web, serta dokumentasi resmi teknologi Next.js, Supabase, dan Tailwind CSS.')]),

  SubBab('3.4', 'Metode Pengumpulan Data'),
  SubSubBab('3.4.1', 'Penelitian Lapangan (Field Research)'),
  P([T('Pengumpulan data secara langsung di lingkungan PT Garciafood Nusantara Gemilang dilakukan melalui:')], { indent: INDENT_ALINEA }),
  ListAlpha('a', [TBold('Observasi'), T(' — pengamatan langsung terhadap proses koordinasi antar divisi, mekanisme pelaporan kinerja, dan pelaksanaan rapat internal untuk mengidentifikasi permasalahan nyata.')]),
  ListAlpha('b', [TBold('Wawancara'), T(' — wawancara terstruktur dengan Ibu Annisa dan perwakilan divisi IT, Finance, Kitchen, Service, dan Marketing untuk menggali kebutuhan spesifik tiap divisi.')]),

  SubSubBab('3.4.2', 'Penelitian Kepustakaan (Library Research)'),
  P([T('Mengumpulkan data melalui berbagai referensi yang relevan, meliputi buku teks, jurnal penelitian, dan dokumentasi teknologi yang digunakan dalam pembangunan aplikasi '), TItalic('RockyTen'), T('.')], { indent: INDENT_ALINEA }),

  SubBab('3.5', 'Analisa Sistem yang Sedang Berjalan'),
  SubSubBab('3.5.1', 'Prosedur Pengolahan Data'),
  P([T('Sebelum sistem '), TItalic('RockyTen'), T(' dibangun, penulis mengidentifikasi prosedur pengolahan data yang sedang berjalan di PT Garciafood Nusantara Gemilang. Saat ini, pemantauan kinerja dilakukan melalui catatan manual dan pesan di aplikasi chat, tanpa format yang terstandarisasi. Koordinasi target antar divisi dilakukan secara lisan dalam rapat tanpa sistem pencatatan yang tersimpan secara terstruktur, sehingga sulit untuk dilacak dan dievaluasi.')], { indent: INDENT_ALINEA }),

  SubSubBab('3.5.2', 'Data Flow Diagram Sistem yang Sedang Berjalan'),
  Caption('Gambar 3.3 Data Flow Diagram Sistem yang Sedang Berjalan'),
  P([TBold('[ISIAN USER — Masukkan DFD sistem lama (manual) di sini]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Berdasarkan analisis sistem yang sedang berjalan, ditemukan beberapa kelemahan utama: (1) tidak ada sistem terpusat untuk memantau KPI tiap divisi; (2) tidak ada mekanisme pengelolaan target 90 hari yang terstruktur; (3) tidak ada kontrol akses yang membatasi visibilitas data antar divisi; dan (4) pencatatan isu dan tugas dilakukan secara terpisah tanpa integrasi.')], { indent: INDENT_ALINEA }),

  SubBab('3.6', 'Langkah-Langkah Rancang Bangun'),
  P([T('Pembangunan aplikasi '), TItalic('RockyTen'), T(' menggunakan metode '), TItalic('Waterfall'), T(' yang terdiri dari lima tahap yang dilaksanakan secara sekuensial.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar 3.4 Langkah-Langkah Rancang Bangun Aplikasi RockyTen (Waterfall)'),
  P([TBold('[ISIAN USER — Masukkan diagram Waterfall di sini]')], { indent: INDENT_ALINEA }),
  EMPTY(),

  P([T('Tahap 1 adalah '), TBold('Analisis Kebutuhan')], { indent: INDENT_ALINEA }),
  P([T('Tahap analisis kebutuhan bertujuan untuk mengidentifikasi dan mendokumentasikan seluruh kebutuhan sistem secara komprehensif. Hasil analisis mengidentifikasi: (1) kebutuhan sistem pemantauan metrik kinerja ('), TItalic('Scoreboard'), T(') yang dapat diakses secara '), TItalic('real-time'), T('; (2) sistem pengelolaan target 90 hari ('), TItalic('Rocks'), T('); (3) fitur manajemen informasi, tugas, dan permasalahan terintegrasi; (4) mekanisme RBAC dengan tiga peran pengguna; dan (5) antarmuka responsif dengan dukungan '), TItalic('dark mode'), T('.')], { indent: INDENT_ALINEA }),
  EMPTY(),

  P([T('Tahap 2 adalah '), TBold('Perancangan Sistem')], { indent: INDENT_ALINEA }),
  P([T('Berdasarkan hasil analisis kebutuhan, penulis merancang arsitektur sistem, alur data, skema basis data, dan antarmuka pengguna. Aplikasi '), TItalic('RockyTen'), T(' dibangun dengan arsitektur '), TItalic('full-stack'), T(' berbasis '), TItalic('Jamstack'), T(' menggunakan Next.js sebagai '), TItalic('frontend'), T(' sekaligus lapisan API, dan Supabase sebagai '), TItalic('backend'), T(' dan basis data. Manajemen '), TItalic('state'), T(' global dilakukan melalui React Context API yang menjadi sumber kebenaran tunggal bagi seluruh komponen aplikasi.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  new Paragraph({ children: [TBold('Tabel 3.1 Perancangan RBAC Aplikasi RockyTen')], alignment: AlignmentType.CENTER, spacing: SPACING_1 }),
  makeTable(
    ['Peran', 'Akses Data', 'Fitur Khusus'],
    [
      ['Developer', 'Semua divisi', 'Error log, debug panel'],
      ['Owner', 'Semua divisi', '—'],
      ['PIC', 'Hanya divisi sendiri', '—'],
    ],
    [2000, 4000, 3000]
  ),
  EMPTY(),

  P([T('Tahap 3 adalah '), TBold('Implementasi')], { indent: INDENT_ALINEA }),
  P([T('Pada tahap implementasi, seluruh modul aplikasi '), TItalic('RockyTen'), T(' dibangun menggunakan tools: Visual Studio Code, Next.js 16 (App Router, TypeScript), Tailwind CSS v3, Supabase (PostgreSQL), Git, dan Vercel untuk '), TItalic('deployment'), T('. Berikut adalah tampilan aplikasi yang telah berhasil diimplementasikan:')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar 3.5 Dashboard Aplikasi RockyTen'),
  P([TBold('[ISIAN USER — Screenshot Dashboard]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Halaman '), TItalic('Dashboard'), T(' menampilkan ringkasan kinerja terkini dalam bentuk lima kartu ('), TItalic('Rocks'), T(', '), TItalic('Scoreboard'), T(', '), TItalic('To-Do'), T(', '), TItalic('Issues'), T(', '), TItalic('Headlines'), T(') dilengkapi dengan '), TItalic('widget'), T(' progres '), TItalic('Rocks'), T(' yang menampilkan tiga '), TItalic('Rock'), T(' teratas beserta persentase penyelesaiannya.')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar 3.6 Halaman Scoreboard Aplikasi RockyTen'),
  P([TBold('[ISIAN USER — Screenshot Scoreboard]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  P([T('Halaman '), TItalic('Scoreboard'), T(' menampilkan seluruh metrik kinerja dalam format tabel yang dapat difilter berdasarkan divisi dan kategori (sub-metrik '), TItalic('Rocks'), T(' atau metrik mandiri).')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar 3.7 Halaman Rocks Aplikasi RockyTen'),
  P([TBold('[ISIAN USER — Screenshot Rocks]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar 3.8 Halaman Headline Aplikasi RockyTen'),
  P([TBold('[ISIAN USER — Screenshot Headlines]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar 3.9 Halaman To Do List Aplikasi RockyTen'),
  P([TBold('[ISIAN USER — Screenshot To-Do]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar 3.10 Halaman Issue List Aplikasi RockyTen'),
  P([TBold('[ISIAN USER — Screenshot Issues]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar 3.11 Halaman Settings dan Manajemen RBAC'),
  P([TBold('[ISIAN USER — Screenshot Settings/RBAC]')], { indent: INDENT_ALINEA }),
  EMPTY(),

  P([T('Tahap 4 adalah '), TBold('Pengujian Sistem')], { indent: INDENT_ALINEA }),
  P([T('Pengujian aplikasi '), TItalic('RockyTen'), T(' dilakukan secara fungsional menggunakan peramban Google Chrome, mencakup dua aspek utama:')], { indent: INDENT_ALINEA }),
  ListItem('1', [TBold('Pengujian Fungsionalitas Modul'), T(' — memastikan seluruh fitur pada setiap modul (Dashboard, Scoreboard, Rocks, Headlines, To-Do, Issues, Settings) berjalan sesuai spesifikasi kebutuhan.')]),
  ListItem('2', [TBold('Pengujian RBAC'), T(' — memverifikasi bahwa mekanisme pembatasan akses berjalan benar untuk ketiga peran pengguna. Hasil: Developer dapat mengakses semua data dan fitur debug; Owner dapat mengakses semua data divisi; PIC hanya dapat mengakses data divisinya sendiri.')]),
  EMPTY(),

  P([T('Tahap 5 adalah '), TBold('Implementasi dan Evaluasi Akhir')], { indent: INDENT_ALINEA }),
  P([T('Aplikasi '), TItalic('RockyTen'), T(' telah berhasil diimplementasikan dan didemonstrasikan kepada PT Garciafood Nusantara Gemilang. Pada tahap evaluasi, Ibu Annisa selaku Pembimbing Lapangan menyampaikan bahwa antarmuka aplikasi dinilai intuitif dan mudah dipahami oleh pengguna non-teknis, serta fitur RBAC dinilai telah menjawab kebutuhan privasi data antar divisi. Sistem telah di-'), TItalic('deploy'), T(' melalui platform Vercel dan dapat diakses melalui peramban web kapan saja dan di mana saja.')], { indent: INDENT_ALINEA }),

  SubBab('3.7', 'Kesimpulan dan Saran'),
  P([TBold('Kesimpulan')], { indent: INDENT_ALINEA }),
  P([T('Berdasarkan hasil perancangan, pembangunan, pengujian, dan evaluasi aplikasi '), TItalic('RockyTen'), T(', dapat ditarik kesimpulan sebagai berikut:')], { indent: INDENT_ALINEA }),
  ListItem('1', [T('Aplikasi '), TItalic('RockyTen'), T(' berbasis web telah berhasil dirancang dan dibangun menggunakan '), TItalic('framework'), T(' Next.js, Supabase, dan Tailwind CSS dengan mengintegrasikan lima modul utama ('), TItalic('Scoreboard, Rocks, Headlines, To-Do List,'), T(' dan '), TItalic('Issues'), T(') yang mengadopsi metodologi '), TItalic('Traction'), T(' L10 '), TItalic('Meeting'), T(' oleh Gino Wickman sebagai landasan konseptual manajemen kinerja berbasis digital.')]),
  ListItem('2', [T('Mekanisme RBAC telah berhasil diimplementasikan dengan tiga peran pengguna ('), TItalic('Developer'), T(', '), TItalic('Owner'), T(', dan PIC per divisi) yang secara efektif membatasi akses data sesuai tanggung jawab masing-masing pengguna, sehingga keamanan dan privasi data antar divisi di PT Garciafood Nusantara Gemilang terjaga dengan baik.')]),
  ListItem('3', 'Hasil pengujian fungsionalitas menunjukkan bahwa seluruh modul aplikasi berjalan sesuai spesifikasi kebutuhan, dan sistem RBAC berhasil memvalidasi pembatasan akses yang tepat untuk setiap peran pengguna tanpa terjadi kebocoran data lintas divisi.'),
  EMPTY(),
  P([TBold('Saran')], { indent: INDENT_ALINEA }),
  P([T('Beberapa saran untuk pengembangan aplikasi '), TItalic('RockyTen'), T(' ke depan:')], { indent: INDENT_ALINEA }),
  ListItem('1', 'Integrasi notifikasi otomatis melalui email atau aplikasi pesan instan untuk mengingatkan PIC tentang tenggat waktu Rocks dan To-Do yang akan segera jatuh tempo.'),
  ListItem('2', [T('Penambahan fitur pelaporan ('), TItalic('reporting'), T(') yang dapat mengekspor data Scoreboard dan Rocks ke format PDF atau Excel.')]),
  ListItem('3', [T('Pengembangan fitur riwayat perubahan ('), TItalic('audit log'), T(') yang lebih komprehensif untuk meningkatkan transparansi dan akuntabilitas.')]),
  ListItem('4', 'Penambahan autentikasi dua faktor (2FA) untuk memperkuat keamanan akses, khususnya untuk peran Owner dan Developer.'),
  ListItem('5', [T('Pengembangan aplikasi versi '), TItalic('mobile'), T(' (Android/iOS) untuk meningkatkan aksesibilitas bagi pengguna yang sering bekerja menggunakan perangkat ponsel pintar.')]),
];

// ─── DAFTAR PUSTAKA ───────────────────────────────────────────────────────────
const daftarPustaka = () => [
  BabHeading('DAFTAR PUSTAKA'),
  new Paragraph({ children: [T('[1] H. Akmal dan S. Saputra, "Perancangan Website '), TItalic('Company Profile'), T(' Menggunakan PHP dan MySQL," '), TItalic('Jurnal Sistem Informasi dan Teknologi'), T(', vol. 2, no. 2, hal. 383–392, 2024.')], spacing: { ...SPACING_1, before: 0, after: 120 }, alignment: AlignmentType.JUSTIFIED, indent: { left: CM(1.0), hanging: CM(1.0) } }),
  new Paragraph({ children: [T('[2] K. M. Arianto, R. Ramadhan, dan A. A. Pratama, "Media '), TItalic('Company Profile'), T(' PT. Multipedia Teknika Indonesia Berbasis Web," '), TItalic('CICES'), T(', vol. 8, no. 2, hal. 220–234, 2022. doi: 10.33050/cices.v8i2.2312.')], spacing: { ...SPACING_1, before: 0, after: 120 }, alignment: AlignmentType.JUSTIFIED, indent: { left: CM(1.0), hanging: CM(1.0) } }),
  new Paragraph({ children: [T('[3] R. S. Sandhu, E. J. Coyne, H. L. Feinstein, dan C. E. Youman, "'), TItalic('Role-Based Access Control Models'), T('," '), TItalic('IEEE Computer'), T(', vol. 29, no. 2, hal. 38–47, Feb. 1996. doi: 10.1109/2.485845.')], spacing: { ...SPACING_1, before: 0, after: 120 }, alignment: AlignmentType.JUSTIFIED, indent: { left: CM(1.0), hanging: CM(1.0) } }),
  new Paragraph({ children: [T('[4] A. Supriyadi, H. Khotimah, W. Indri, dan B. Yulisa, "Rancang Bangun '), TItalic('Company Profile'), T(' Berbasis Web Menggunakan Metode '), TItalic('Waterfall'), T(' (Studi Kasus: APM Frozen Food)," vol. 6, no. 1, hal. 75–85, 2024.')], spacing: { ...SPACING_1, before: 0, after: 120 }, alignment: AlignmentType.JUSTIFIED, indent: { left: CM(1.0), hanging: CM(1.0) } }),
  new Paragraph({ children: [T('[5] G. Wickman, '), TItalic('Traction: Get a Grip on Your Business'), T('. Dallas: BenBella Books, 2011.')], spacing: { ...SPACING_1, before: 0, after: 120 }, alignment: AlignmentType.JUSTIFIED, indent: { left: CM(1.0), hanging: CM(1.0) } }),
  new Paragraph({ children: [TBold('[6] [ISIAN USER: Referensi tambahan format IEEE]')], spacing: { ...SPACING_1, before: 0, after: 120 }, alignment: AlignmentType.JUSTIFIED, indent: { left: CM(1.0), hanging: CM(1.0) } }),
];

// ─── LAMPIRAN — LOG BOOK ──────────────────────────────────────────────────────
const lampiran = () => [
  BabHeading('LAMPIRAN'),
  PCenter([TBold('Log Book (Catatan Kerja Harian)')]),
  EMPTY(),
  makeTable(
    ['Minggu KE', 'Tanggal', 'Uraian Kegiatan'],
    [
      ['1', '1–5 Sep 2026', 'Orientasi lingkungan kerja, perkenalan dengan tim PT Garciafood, dan pemahaman awal proses bisnis perusahaan.'],
      ['2', '8–12 Sep 2026', 'Observasi langsung proses koordinasi antar divisi, identifikasi permasalahan manajemen, dan wawancara awal dengan Pembimbing Lapangan.'],
      ['3', '15–19 Sep 2026', 'Wawancara mendalam dengan PIC tiap divisi (IT, Finance, Kitchen, Service, Marketing) untuk penggalian kebutuhan sistem.'],
      ['4', '22–26 Sep 2026', 'Analisis kebutuhan sistem secara menyeluruh dan presentasi awal rancangan kepada Pembimbing Lapangan.'],
      ['5', '29 Sep–3 Okt 2026', 'Perancangan arsitektur sistem, skema basis data Supabase, dan desain antarmuka pengguna (UI/UX).'],
      ['6', '6–10 Okt 2026', 'Implementasi modul Scoreboard dan struktur dasar aplikasi RockyTen (routing, layout, AppContext, autentikasi).'],
      ['7', '13–17 Okt 2026', 'Implementasi modul Rocks dan integrasi hierarki Rocks–Scoreboard (sub-metrik dan metrik mandiri).'],
      ['8', '20–24 Okt 2026', 'Implementasi modul Headlines dan To-Do List beserta fitur prioritas dan filter per divisi.'],
      ['9', '27–31 Okt 2026', 'Implementasi modul Issues (IDS) dan Dashboard ringkasan eksekutif.'],
      ['10', '3–7 Nov 2026', 'Implementasi mekanisme RBAC (Developer, Owner, PIC) dan pengujian awal pembatasan akses antar divisi.'],
      ['11', '10–14 Nov 2026', 'Penambahan fitur dark mode, perbaikan UI/UX, dan pengujian lintas peran (RBAC testing).'],
      ['12', '17–21 Nov 2026', 'Pengujian fungsional menyeluruh, perbaikan bug, dan demonstrasi aplikasi kepada Pembimbing Lapangan.'],
      ['13', '24–28 Nov 2026', 'Evaluasi akhir bersama PT Garciafood, finalisasi aplikasi, dan penyusunan laporan magang.'],
    ],
    [1000, 1800, 6200]
  ),
  EMPTY(),
  PCenter([TBold('Dokumentasi')]),
  EMPTY(),
  P([TBold('[ISIAN USER — Screenshot/foto kegiatan PKL dan tampilan aplikasi RockyTen]')], { indent: INDENT_ALINEA }),
  EMPTY(),
  Caption('Gambar L.1 Tampilan Aplikasi RockyTen'),
];

// ─── RIWAYAT HIDUP ────────────────────────────────────────────────────────────
const riwayatHidup = () => [
  BabHeading('RIWAYAT HIDUP'),
  EMPTY(),
  new Paragraph({ children: [T('Nama\t\t\t: M Harys Rusty Wibawa')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(5) }] }),
  new Paragraph({ children: [T('NIM\t\t\t: 24012228')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(5) }] }),
  new Paragraph({ children: [T('Program Studi\t: Teknik Informatika')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(5) }] }),
  new Paragraph({ children: [T('Perguruan Tinggi\t: Politeknik Ganesha Medan')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(5) }] }),
  new Paragraph({ children: [TBold('Tempat, Tgl. Lahir\t: [ISIAN USER]')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(5) }] }),
  new Paragraph({ children: [TBold('Alamat\t\t: [ISIAN USER]')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(5) }] }),
  new Paragraph({ children: [TBold('Email\t\t\t: [ISIAN USER]')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(5) }] }),
  new Paragraph({ children: [TBold('No. HP\t\t\t: [ISIAN USER]')], spacing: SPACING_1, tabStops: [{ type: TabStopType.LEFT, position: CM(5) }] }),
  EMPTY(),
  P([TBold('Riwayat Pendidikan:')]),
  ListItem('1', '[ISIAN USER: SD]'),
  ListItem('2', '[ISIAN USER: SMP]'),
  ListItem('3', '[ISIAN USER: SMA/SMK]'),
  ListItem('4', 'Politeknik Ganesha Medan, Program Studi Teknik Informatika, 2024–sekarang'),
  EMPTY(),
  P([TBold('Pengalaman Magang:')]),
  ListItem('1', 'Magang di PT Garciafood Nusantara Gemilang, Medan (September–November 2026)'),
];

// ─── BUAT DOKUMEN ─────────────────────────────────────────────────────────────
async function generateDoc() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE },
          paragraph: { spacing: SPACING_15, alignment: AlignmentType.JUSTIFIED },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          run: { font: FONT, size: SIZE_COVER, bold: true },
          paragraph: { alignment: AlignmentType.CENTER, spacing: SPACING_1 },
        },
      ],
    },
    sections: [
      // ── Bagian Awal (Romawi) ───────────────────────────────────────────────
      {
        properties: {
          page: {
            margin: MARGINS,
            pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN },
          },
        },
        children: [
          // Halaman Judul
          PCenter([TBold('POLITEKNIK GANESHA MEDAN', { size: SIZE_COVER })]),
          EMPTY(),
          PCenter([TBold('RANCANG BANGUN APLIKASI ROCKYTEN BERBASIS WEB', { size: SIZE_COVER })]),
          PCenter([TBold('DENGAN KEAMANAN RBAC PADA', { size: SIZE_COVER })]),
          PCenter([TBold('PT GARCIAFOOD NUSANTARA GEMILANG', { size: SIZE_COVER })]),
          EMPTY(),
          PCenter([TBold('LAPORAN MAGANG', { size: SIZE_COVER })]),
          EMPTY(),
          PCenter([T('Disusun Oleh:')]),
          PCenter([TBold('M Harys Rusty Wibawa', { size: SIZE_COVER })]),
          PCenter([T('NIM: 24012228')]),
          EMPTY(),
          PCenter([TBold('PROGRAM STUDI TEKNIK INFORMATIKA', { size: SIZE_COVER })]),
          PCenter([TBold('POLITEKNIK GANESHA MEDAN', { size: SIZE_COVER })]),
          PCenter([TBold('MEDAN', { size: SIZE_COVER })]),
          PCenter([TBold('2026', { size: SIZE_COVER })]),
          // Lembar Persetujuan (hal iii)
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          ...lembarPersetujuan(),
          // Pernyataan Keaslian (hal iv)
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          ...pernyataanKeaslian(),
          // Kata Pengantar (hal v)
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          ...katapengantar(),
          // Daftar Isi placeholder
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          PCenter([TBold('DAFTAR ISI', { size: SIZE_COVER })]),
          EMPTY(),
          P([T('[Daftar Isi akan otomatis terbentuk di Word: Insert → Table of Contents]')]),
          // Daftar Gambar placeholder
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          PCenter([TBold('DAFTAR GAMBAR', { size: SIZE_COVER })]),
          EMPTY(),
          P([T('[Daftar Gambar: Insert → Table of Figures]')]),
          // Daftar Tabel placeholder
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          PCenter([TBold('DAFTAR TABEL', { size: SIZE_COVER })]),
          EMPTY(),
          P([T('[Daftar Tabel: Insert → Table of Figures → Pilih Tabel]')]),
        ],
      },
      // ── Bagian Isi (Arab) ─────────────────────────────────────────────────
      {
        properties: {
          page: {
            margin: MARGINS,
            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
          },
        },
        children: [
          // BAB I
          ...bab1(),
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          // BAB II
          ...bab2(),
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          // BAB III
          ...bab3(),
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          // Daftar Pustaka
          ...daftarPustaka(),
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          // Lampiran
          ...lampiran(),
          new Paragraph({ children: [new PageBreak()], spacing: SPACING_1 }),
          // Riwayat Hidup
          ...riwayatHidup(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join('D:/Kerjaan/RockyTen/laporan', 'LAPORAN_PKL_RockyTen_M_Harys_Rusty_Wibawa.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('✅ Word file berhasil dibuat:', outPath);
  console.log('📁 Ukuran file:', (buffer.length / 1024).toFixed(1), 'KB');
}

generateDoc().catch(console.error);
