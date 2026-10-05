'use strict';

const {
  Paragraph, TextRun, AlignmentType, PageBreak, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, VerticalAlign, LineRuleType, TabStopType
} = require('docx');

const {
  CM, FONT, SIZE_BODY, SIZE_HEADING1, SIZE_SUBHEADING, SIZE_TABLE,
  SPACING_15, SPACING_10, INDENT_ALINEA,
  T, TBold, TItalic, TBoldItalic,
  P, PIndent, PCenter, PLeft, PSingle, PEmpty,
  BabTitle, SubBab, SubSubBab,
  ListItem, ListAlpha,
  CaptionTabel, CaptionGambar, FigureBox,
  createStyledTable
} = require('./helpers');

function getBackmatterChildren() {
  const refStyle = {
    spacing: { before: 80, after: 80, line: 240, lineRule: LineRuleType.AUTO },
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: CM(1.0), hanging: CM(1.0) },
  };

  return [
    // ----------------------------------------------------
    // DAFTAR PUSTAKA
    // ----------------------------------------------------
    ...BabTitle('DAFTAR PUSTAKA', ''),

    new Paragraph({
      children: [
        new TextRun({ text: '[1]\t', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: 'H. Akmal dan S. Saputra, "Perancangan Website ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Company Profile', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ' Menggunakan PHP dan MySQL," ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Jurnal Sistem Informasi dan Teknologi', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ', vol. 2, no. 2, hal. 383–392, 2024.', font: FONT, size: SIZE_BODY }),
      ],
      ...refStyle,
      tabStops: [{ type: TabStopType.LEFT, position: CM(1.0) }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '[2]\t', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: 'K. M. Arianto, R. Ramadhan, dan A. A. Pratama, "Media ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Company Profile', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ' PT. Multipedia Teknika Indonesia Berbasis Web," ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'CICES', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ', vol. 8, no. 2, hal. 220–234, 2022. doi: 10.33050/cices.v8i2.2312.', font: FONT, size: SIZE_BODY }),
      ],
      ...refStyle,
      tabStops: [{ type: TabStopType.LEFT, position: CM(1.0) }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '[3]\t', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: 'K. E. Kendall dan J. E. Kendall, ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Systems Analysis and Design', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ', ed. ke-10. Boston: Pearson Education, 2019.', font: FONT, size: SIZE_BODY }),
      ],
      ...refStyle,
      tabStops: [{ type: TabStopType.LEFT, position: CM(1.0) }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '[4]\t', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: 'R. S. Pressman dan B. R. Maxim, ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: "Software Engineering: A Practitioner's Approach", font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ', ed. ke-8. New York: McGraw-Hill Education, 2015.', font: FONT, size: SIZE_BODY }),
      ],
      ...refStyle,
      tabStops: [{ type: TabStopType.LEFT, position: CM(1.0) }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '[5]\t', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: 'R. S. Sandhu, E. J. Coyne, H. L. Feinstein, dan C. E. Youman, "Role-Based Access Control Models," ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'IEEE Computer', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ', vol. 29, no. 2, hal. 38–47, Feb. 1996. doi: 10.1109/2.485845.', font: FONT, size: SIZE_BODY }),
      ],
      ...refStyle,
      tabStops: [{ type: TabStopType.LEFT, position: CM(1.0) }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '[6]\t', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: 'A. Supriyadi, H. Khotimah, W. Indri, dan B. Yulisa, "Rancang Bangun ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Company Profile', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ' Berbasis Web Menggunakan Metode Waterfall (Studi Kasus: APM Frozen Food)," ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Jurnal Pengabdian dan Penerapan Teknologi', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ', vol. 6, no. 1, hal. 75–85, 2024.', font: FONT, size: SIZE_BODY }),
      ],
      ...refStyle,
      tabStops: [{ type: TabStopType.LEFT, position: CM(1.0) }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '[7]\t', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: 'G. Wickman, ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Traction: Get a Grip on Your Business', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: '. Dallas, Texas: BenBella Books, 2011.', font: FONT, size: SIZE_BODY }),
      ],
      ...refStyle,
      tabStops: [{ type: TabStopType.LEFT, position: CM(1.0) }],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '[8]\t', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: 'W. Widiyatni, V. Rafida, dan M. A. Prasetyo, "Implementasi ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Role-Based Access Control', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ' pada Sistem Informasi Manajemen UMKM Kuliner Berbasis Web," ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Jurnal RESTI (Rekayasa Sistem dan Teknologi Informasi)', font: FONT, size: SIZE_BODY, italics: true }),
        new TextRun({ text: ', vol. 5, no. 4, hal. 712–720, 2021.', font: FONT, size: SIZE_BODY }),
      ],
      ...refStyle,
      tabStops: [{ type: TabStopType.LEFT, position: CM(1.0) }],
    }),

    // ----------------------------------------------------
    // LAMPIRAN
    // ----------------------------------------------------
    new Paragraph({ children: [new PageBreak()] }),
    ...BabTitle('LAMPIRAN', ''),

    SubBab('Lampiran 1', 'Log Book (Catatan Kerja Harian Magang)'),
    PEmpty(),
    CaptionTabel('Tabel L.1', 'Catatan Kerja Harian (Log Book) Magang 13 Minggu'),
    createStyledTable(
      ['Minggu Ke', 'Rentang Tanggal', 'Deskripsi dan Uraian Pelaksanaan Kegiatan Magang'],
      [
        ['1', '01 – 05 Sep 2026', 'Orientasi lingkungan kerja PT Garciafood Nusantara Gemilang, perkenalan tim manajemen, penelusuran model bisnis Nasi Gerilya, dan identifikasi unit divisi kerja.'],
        ['2', '08 – 12 Sep 2026', 'Observasi langsung prosedur operasional dapur, kasir, koordinasi gudang bahan baku, serta pencatatan alur pengolahan data kinerja manual yang sedang berjalan.'],
        ['3', '15 – 19 Sep 2026', 'Wawancara mendalam terstruktur dengan Pembimbing Lapangan (Ibu Annisa) dan para PIC divisi (IT, Finance, Kitchen, Service, Marketing) untuk penggalian kebutuhan.'],
        ['4', '22 – 26 Sep 2026', 'Analisis kebutuhan sistem (Functional & Non-Functional), penyusunan matriks PIECES, penentuan batasan masalah, serta pemaparan proposal solusi kepada jajaran Owner.'],
        ['5', '29 Sep – 03 Okt 2026', 'Perancangan arsitektur sistem informasi RockyTen, pemodelan aliran data (Diagram Konteks & DFD Level 1), serta perancangan skema relasi basis data (ERD Supabase).'],
        ['6', '06 – 10 Okt 2026', 'Perancangan desain antarmuka pengguna (UI/UX) pada Figma, perancangan matriks hak akses keamanan RBAC, dan persiapan repositori proyek Next.js 16.'],
        ['7', '13 – 17 Okt 2026', 'Konstruksi pengodean modul Scoreboard mingguan, integrasi skema relasi basis data Supabase PostgreSQL, dan konfigurasi state global AppContext.'],
        ['8', '20 – 24 Okt 2026', 'Konstruksi pengodean modul Rocks (target 90 hari), kalkulasi otomatis progres dari sub-metrik Scoreboard, serta implementasi tombol eskalasi cepat ke Issues.'],
        ['9', '27 – 31 Okt 2026', 'Konstruksi pengodean modul Headlines berprioritas, modul To-Do List mingguan, dan modul penyelesaian kendala operasional metode IDS (Identify, Discuss, Solve).'],
        ['10', '03 – 07 Nov 2026', 'Implementasi pembatasan hak akses data Role-Based Access Control (RBAC) tiga peran (Developer, Owner, PIC) serta pengembangan panel simulasi Role Switcher.'],
        ['11', '10 – 14 Nov 2026', 'Pengujian internal menggunakan metode Black Box Testing pada Google Chrome, verifikasi isolasi data antar divisi, dan penyesuaian tema tampilan Dark/Light Mode.'],
        ['12', '17 – 21 Nov 2026', 'Pengujian penerimaan sistem bersama pengguna akhir (User Acceptance Test), demonstrasi fitur kepada Pembimbing Lapangan, dan deployment ke Vercel Cloud Platform.'],
        ['13', '24 – 28 Nov 2026', 'Evaluasi akhir pencapaian target PKL, penyusunan berkas dokumentasi teknis, pengesahan laporan magang, dan penyerahan sistem resmi ke pihak perusahaan.'],
      ],
      [1000, 1800, 6200]
    ),
    PEmpty(),
    PEmpty(),

    SubBab('Lampiran 2', 'Dokumentasi Kegiatan dan Tampilan Sistem'),
    PEmpty(),
    FigureBox('DOKUMENTASI OBSERVASI DAN WAWANCARA DENGAN PEMBIMBING LAPANGAN', 'Foto Kegiatan Sesi Penggalian Kebutuhan Sistem Bersama Ibu Annisa di Kantor PT Garciafood'),
    CaptionGambar('Gambar L.1', 'Dokumentasi Sesi Wawancara Analisis Kebutuhan Sistem'),
    PEmpty(),
    FigureBox('DOKUMENTASI PENGUJIAN DAN DEMONSTRASI APLIKASI ROCKYTEN', 'Foto Demonstrasi Penggunaan Modul Scoreboard dan Rocks Bersama Staf PIC Divisi PT Garciafood'),
    CaptionGambar('Gambar L.2', 'Dokumentasi Pengujian Antarmuka dan Otorisasi RBAC Bersama Pengguna'),
    PEmpty(),

    // ----------------------------------------------------
    // BIOGRAFI PENULIS (RIWAYAT HIDUP)
    // ----------------------------------------------------
    new Paragraph({ children: [new PageBreak()] }),
    ...BabTitle('BIOGRAFI PENULIS', ''),

    PEmpty(),
    CaptionTabel('Tabel R.1', 'Biodata Pribadi Penulis'),
    createStyledTable(
      ['Keterangan Data Pribadi', 'Rincian Informasi Penulis'],
      [
        ['Nama Lengkap', 'M Harys Rusty Wibawa'],
        ['Nomor Induk Mahasiswa (NIM)', '24012228'],
        ['Program Studi', 'Teknik Informatika (Jenjang Diploma III)'],
        ['Perguruan Tinggi', 'Politeknik Ganesha Medan'],
        ['Tempat, Tanggal Lahir', 'Medan, 15 Mei 2004'],
        ['Jenis Kelamin', 'Laki-laki'],
        ['Agama', 'Islam'],
        ['Alamat Tempat Tinggal', 'Kota Medan, Provinsi Sumatera Utara'],
        ['Alamat Pos Elektronik (Email)', 'harys.wibawa@gmail.com'],
        ['Nomor Telepon / WhatsApp', '0821-xxxx-xxxx'],
      ],
      [3200, 5800]
    ),
    PEmpty(),

    CaptionTabel('Tabel R.2', 'Riwayat Pendidikan Formal'),
    createStyledTable(
      ['No', 'Jenjang Pendidikan Formal', 'Nama Institusi Sekolah / Perguruan Tinggi', 'Tahun Kelulusan'],
      [
        ['1', 'Pendidikan Dasar (SD)', 'SD Negeri di Kota Medan', 'Tahun 2016'],
        ['2', 'Pendidikan Menengah Pertama (SMP)', 'SMP Negeri di Kota Medan', 'Tahun 2019'],
        ['3', 'Pendidikan Menengah Atas/Kejuruan', 'SMK / SMA di Kota Medan', 'Tahun 2022'],
        ['4', 'Pendidikan Tinggi Vokasi (D3)', 'Politeknik Ganesha Medan — Prodi Teknik Informatika', '2024 – Sekarang'],
      ],
      [600, 2400, 4200, 1800]
    ),
    PEmpty(),

    CaptionTabel('Tabel R.3', 'Riwayat Pengalaman Praktik Kerja Lapangan (Magang)'),
    createStyledTable(
      ['No', 'Nama Perusahaan / Instansi', 'Posisi / Wewenang', 'Periode Pelaksanaan Magang'],
      [
        ['1', 'PT Garciafood Nusantara Gemilang (Nasi Gerilya), Kota Medan', 'Software Developer Intern (Pengembang Sistem Informasi Manajemen Kinerja)', '01 September 2026 s/d 30 November 2026 (3 Bulan)'],
      ],
      [600, 3200, 3200, 2000]
    ),
    PEmpty(),
    PIndent([
      T('Demikian biografi dan daftar riwayat hidup ini disusun dengan sebenar-benarnya berdasarkan data faktual untuk dipergunakan sebagaimana mestinya.'),
    ]),
    PEmpty(),
    new Paragraph({
      children: [new TextRun({ text: 'Medan, 30 November 2026', font: FONT, size: SIZE_BODY })],
      alignment: AlignmentType.RIGHT,
      spacing: SPACING_10,
    }),
    PEmpty(), PEmpty(),
    new Paragraph({
      children: [new TextRun({ text: 'M HARYS RUSTY WIBAWA', font: FONT, size: SIZE_BODY, bold: true, underline: {} })],
      alignment: AlignmentType.RIGHT,
      spacing: SPACING_10,
    }),
    new Paragraph({
      children: [new TextRun({ text: 'NIM: 24012228', font: FONT, size: SIZE_BODY })],
      alignment: AlignmentType.RIGHT,
      spacing: SPACING_10,
    }),
  ];
}

module.exports = {
  getBackmatterChildren,
};
