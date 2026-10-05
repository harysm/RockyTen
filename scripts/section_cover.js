'use strict';

const {
  Paragraph, TextRun, AlignmentType, PageBreak, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, VerticalAlign, LineRuleType, TabStopType,
  ImageRun
} = require('docx');
const fs = require('fs');
const path = require('path');

const {
  CM, FONT, SIZE_BODY, SIZE_HEADING1, SIZE_SUBHEADING, SIZE_TABLE,
  SPACING_15, SPACING_10, INDENT_ALINEA,
  T, TBold, TItalic, TBoldItalic,
  P, PIndent, PCenter, PLeft, PSingle, PEmpty,
  BabTitle, ListItem, createStyledTable, TocItem
} = require('./helpers');

const LOGO_POLGAN_PATH = path.join(__dirname, '..', 'laporan', 'logo_polgan.jpg');

function getLogoPolganImage() {
  if (fs.existsSync(LOGO_POLGAN_PATH)) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: fs.readFileSync(LOGO_POLGAN_PATH),
          transformation: { width: 270, height: 82 },
          type: 'jpg',
        }),
      ],
      spacing: { before: 180, after: 240, line: 240, lineRule: LineRuleType.AUTO },
    });
  }
  return PEmpty();
}

function getCoverLuarChildren() {
  return [
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({
          text: 'RANCANG BANGUN APLIKASI ROCKYTEN BERBASIS WEB\nDENGAN KEAMANAN RBAC PADA\nPT GARCIAFOOD NUSANTARA GEMILANG',
          font: FONT,
          size: 28, // 14pt
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 360, line: 260, lineRule: LineRuleType.AUTO },
    }),
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({
          text: 'LAPORAN PRAKTIK KERJA LAPANGAN (PKL)',
          font: FONT,
          size: 26, // 13pt
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Diajukan Dalam Rangka Menyelesaikan Jenjang Pendidikan Diploma III\nProgram Studi Teknik Informatika di Politeknik Ganesha Medan',
          font: FONT,
          size: SIZE_BODY,
          italics: false,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 400, line: 260, lineRule: LineRuleType.AUTO },
    }),
    getLogoPolganImage(),
    new Paragraph({
      children: [
        new TextRun({ text: 'Disusun oleh :', font: FONT, size: SIZE_BODY }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 60, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'M HARYS RUSTY WIBAWA', font: FONT, size: 26, bold: true }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 40, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'NIM : 24012228', font: FONT, size: SIZE_BODY, bold: true }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 360, line: 240, lineRule: LineRuleType.AUTO },
    }),
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({
          text: 'PROGRAM STUDI TEKNIK INFORMATIKA\nPOLITEKNIK GANESHA MEDAN\nMEDAN\n2026',
          font: FONT,
          size: 26,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 0, line: 260, lineRule: LineRuleType.AUTO },
    }),
  ];
}

function getBagianAwalChildren() {
  return [
    // ----------------------------------------------------
    // HALAMAN JUDUL DALAM (Halaman ii)
    // ----------------------------------------------------
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({
          text: 'RANCANG BANGUN APLIKASI ROCKYTEN BERBASIS WEB\nDENGAN KEAMANAN RBAC PADA\nPT GARCIAFOOD NUSANTARA GEMILANG',
          font: FONT,
          size: 28,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 360, line: 260, lineRule: LineRuleType.AUTO },
    }),
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({
          text: 'LAPORAN PRAKTIK KERJA LAPANGAN (PKL)',
          font: FONT,
          size: 26,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Diajukan Dalam Rangka Menyelesaikan Jenjang Pendidikan Diploma III\nProgram Studi Teknik Informatika di Politeknik Ganesha Medan',
          font: FONT,
          size: SIZE_BODY,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 400, line: 260, lineRule: LineRuleType.AUTO },
    }),
    getLogoPolganImage(),
    new Paragraph({
      children: [new TextRun({ text: 'Disusun oleh :', font: FONT, size: SIZE_BODY })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 60, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'M HARYS RUSTY WIBAWA', font: FONT, size: 26, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 40, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'NIM : 24012228', font: FONT, size: SIZE_BODY, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 360, line: 240, lineRule: LineRuleType.AUTO },
    }),
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({
          text: 'PROGRAM STUDI TEKNIK INFORMATIKA\nPOLITEKNIK GANESHA MEDAN\nMEDAN\n2026',
          font: FONT,
          size: 26,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 0, line: 260, lineRule: LineRuleType.AUTO },
    }),

    // ----------------------------------------------------
    // LEMBAR PENGESAHAN (Halaman iii)
    // ----------------------------------------------------
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      children: [new TextRun({ text: 'POLITEKNIK GANESHA MEDAN', font: FONT, size: SIZE_HEADING1, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'LEMBAR PENGESAHAN PRAKTIK KERJA LAPANGAN (PKL)', font: FONT, size: SIZE_HEADING1, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240, line: 240, lineRule: LineRuleType.AUTO },
    }),
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({ text: 'JUDUL\t: ', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({
          text: 'RANCANG BANGUN APLIKASI ROCKYTEN BERBASIS WEB DENGAN KEAMANAN RBAC PADA PT GARCIAFOOD NUSANTARA GEMILANG',
          font: FONT,
          size: SIZE_BODY,
          bold: true,
        }),
      ],
      tabStops: [{ type: TabStopType.LEFT, position: CM(2.5) }],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 100, after: 80, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'NAMA\t: M HARYS RUSTY WIBAWA', font: FONT, size: SIZE_BODY, bold: true }),
      ],
      tabStops: [{ type: TabStopType.LEFT, position: CM(2.5) }],
      spacing: { before: 60, after: 60, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'NIM\t: 24012228', font: FONT, size: SIZE_BODY, bold: true }),
      ],
      tabStops: [{ type: TabStopType.LEFT, position: CM(2.5) }],
      spacing: { before: 60, after: 200, line: 240, lineRule: LineRuleType.AUTO },
    }),
    PIndent([
      T('Laporan Praktik Kerja Lapangan (PKL) ini telah diperiksa, disetujui, dan disahkan sebagai salah satu syarat kelulusan Praktik Kerja Lapangan pada Program Studi Teknik Informatika Jenjang Diploma III di Politeknik Ganesha Medan.'),
    ]),
    PEmpty(),
    PCenter([T('Medan, 30 November 2026')]),
    PEmpty(),
    // Tabel Tanda Tangan 2 Kolom (Dospem & Pembimbing Lapangan)
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Dosen Pembimbing PKL,', font: FONT, size: SIZE_BODY, bold: true })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
                PEmpty(), PEmpty(), PEmpty(),
                new Paragraph({ children: [new TextRun({ text: 'Supardi, S.Kom., M.Kom.', font: FONT, size: SIZE_BODY, bold: true, underline: {} })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
                new Paragraph({ children: [new TextRun({ text: 'NIDN: 0105037301', font: FONT, size: SIZE_BODY })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
              ],
              width: { size: 4500, type: WidthType.DXA },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Pembimbing Lapangan / Teknis,', font: FONT, size: SIZE_BODY, bold: true })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
                PEmpty(), PEmpty(), PEmpty(),
                new Paragraph({ children: [new TextRun({ text: 'Annisa', font: FONT, size: SIZE_BODY, bold: true, underline: {} })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
                new Paragraph({ children: [new TextRun({ text: 'PT Garciafood Nusantara Gemilang', font: FONT, size: SIZE_BODY })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
              ],
              width: { size: 4500, type: WidthType.DXA },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
    }),
    PEmpty(),
    PCenter([TBold('Mengetahui,')]),
    PCenter([TBold('Ketua Program Studi Teknik Informatika')]),
    PCenter([TBold('Politeknik Ganesha Medan')]),
    PEmpty(), PEmpty(), PEmpty(),
    new Paragraph({
      children: [new TextRun({ text: 'Supardi, S.Kom., M.Kom.', font: FONT, size: SIZE_BODY, bold: true, underline: {} })],
      alignment: AlignmentType.CENTER,
      spacing: SPACING_10,
    }),
    PCenter([T('NIDN: 0105037301')]),

    // ----------------------------------------------------
    // LEMBAR PERNYATAAN PENULIS (Halaman iv)
    // ----------------------------------------------------
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      children: [new TextRun({ text: 'POLITEKNIK GANESHA MEDAN', font: FONT, size: SIZE_HEADING1, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'PERNYATAAN PENULIS', font: FONT, size: SIZE_HEADING1, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 300, line: 240, lineRule: LineRuleType.AUTO },
    }),
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({ text: 'JUDUL\t: ', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({
          text: 'RANCANG BANGUN APLIKASI ROCKYTEN BERBASIS WEB DENGAN KEAMANAN RBAC PADA PT GARCIAFOOD NUSANTARA GEMILANG',
          font: FONT,
          size: SIZE_BODY,
          bold: true,
        }),
      ],
      tabStops: [{ type: TabStopType.LEFT, position: CM(2.5) }],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 80, after: 80, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'NAMA\t: M HARYS RUSTY WIBAWA', font: FONT, size: SIZE_BODY, bold: true })],
      tabStops: [{ type: TabStopType.LEFT, position: CM(2.5) }],
      spacing: { before: 60, after: 60, line: 240, lineRule: LineRuleType.AUTO },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'NIM\t: 24012228', font: FONT, size: SIZE_BODY, bold: true })],
      tabStops: [{ type: TabStopType.LEFT, position: CM(2.5) }],
      spacing: { before: 60, after: 240, line: 240, lineRule: LineRuleType.AUTO },
    }),
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({
          text: '“Saya menyatakan dan bertanggung jawab sepenuhnya bahwa Praktik Kerja Lapangan (PKL) ini adalah hasil karya saya sendiri kecuali cuplikan dan ringkasan yang masing-masing telah saya cantumkan sumber-sumber informasinya dengan benar. Jika pada waktu selanjutnya ada pihak lain yang mengklaim bahwa Praktik Kerja Lapangan (PKL) ini sebagai karyanya dan disertai dengan bukti yang cukup dan akurat, maka saya bersedia dibatalkan Nilai Praktik Kerja Lapangan saya serta hak dan kewajiban saya yang melekat pada gelar tersebut.”',
          font: FONT,
          size: SIZE_BODY,
          italics: true,
        }),
      ],
      alignment: AlignmentType.JUSTIFIED,
      indent: INDENT_ALINEA,
      spacing: SPACING_15,
    }),
    PEmpty(),
    PEmpty(),
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: '[Tempat e-Meterai', font: FONT, size: SIZE_TABLE, bold: true, color: '0284C7' })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
                new Paragraph({ children: [new TextRun({ text: 'Digital Rp 10.000]', font: FONT, size: SIZE_TABLE, bold: true, color: '0284C7' })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
              ],
              width: { size: 2800, type: WidthType.DXA },
              shading: { fill: 'F0F9FF', type: ShadingType.CLEAR },
              borders: {
                top: { style: BorderStyle.DASHED, size: 4, color: '38BDF8' },
                bottom: { style: BorderStyle.DASHED, size: 4, color: '38BDF8' },
                left: { style: BorderStyle.DASHED, size: 4, color: '38BDF8' },
                right: { style: BorderStyle.DASHED, size: 4, color: '38BDF8' },
              },
              margins: { top: 160, bottom: 160, left: 180, right: 180 },
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Medan, 30 November 2026', font: FONT, size: SIZE_BODY })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
                new Paragraph({ children: [new TextRun({ text: 'Penulis / Yang Menyatakan,', font: FONT, size: SIZE_BODY, bold: true })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
                PEmpty(), PEmpty(), PEmpty(),
                new Paragraph({ children: [new TextRun({ text: 'M HARYS RUSTY WIBAWA', font: FONT, size: SIZE_BODY, bold: true, underline: {} })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
                new Paragraph({ children: [new TextRun({ text: 'NIM: 24012228', font: FONT, size: SIZE_BODY })], alignment: AlignmentType.CENTER, spacing: SPACING_10 }),
              ],
              width: { size: 5200, type: WidthType.DXA },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
    }),

    // ----------------------------------------------------
    // KATA PENGANTAR (Halaman v)
    // ----------------------------------------------------
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      children: [new TextRun({ text: 'KATA PENGANTAR', font: FONT, size: SIZE_HEADING1, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240, line: 240, lineRule: LineRuleType.AUTO },
    }),
    PSingle([
      T('Puji dan syukur penulis panjatkan ke hadirat Tuhan Yang Maha Esa atas segala rahmat, taufik, serta karunia-Nya yang melimpah, sehingga penulis dapat menyelesaikan Praktik Kerja Lapangan (PKL) serta menyusun laporan yang berjudul '),
      TBoldItalic('“Rancang Bangun Aplikasi RockyTen Berbasis Web Dengan Keamanan RBAC Pada PT Garciafood Nusantara Gemilang”'),
      T(' tepat pada waktunya sesuai dengan kurikulum pendidikan vokasi Diploma III Program Studi Teknik Informatika di Politeknik Ganesha Medan.'),
    ], { indent: INDENT_ALINEA }),
    PEmpty(),
    PSingle([
      T('Laporan Praktik Kerja Lapangan ini disusun sebagai bukti pelaksanaan kegiatan magang industri yang berlangsung selama tiga bulan, terhitung sejak tanggal 1 September 2026 hingga 30 November 2026 di PT Garciafood Nusantara Gemilang, Kota Medan. Selama pelaksanaan magang, penulis memperoleh kesempatan langsung untuk mengidentifikasi permasalahan manajerial riil pada sektor usaha kuliner nusantara, merancang arsitektur sistem informasi berbasis web, serta mengimplementasikan metodologi manajemen modern '),
      TItalic('Traction Level 10 Meeting'),
      T(' dengan pengamanan kontrol akses berbasis peran ('),
      TItalic('Role-Based Access Control'),
      T('/RBAC).'),
    ], { indent: INDENT_ALINEA }),
    PEmpty(),
    PSingle([
      T('Keberhasilan pelaksanaan magang dan penyusunan laporan ini tidak lepas dari bimbingan, doa, bantuan, dan dukungan moral maupun materil dari berbagai pihak. Oleh karena itu, pada kesempatan yang penuh rasa hormat ini, penulis ingin menyampaikan ucapan terima kasih yang sebesar-besarnya kepada:'),
    ], { indent: INDENT_ALINEA }),
    PEmpty(),
    new Paragraph({
      children: [
        new TextRun({ text: '1. ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Bapak Supardi, S.Kom., M.Kom.', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: ', selaku Dosen Pembimbing sekaligus Ketua Program Studi Teknik Informatika Politeknik Ganesha Medan, yang telah memberikan bimbingan teknis, arahan akademis, dan motivasi berharga sejak penyusunan proposal hingga rampungnya laporan ini.', font: FONT, size: SIZE_BODY }),
      ],
      spacing: SPACING_10,
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: CM(1.27), hanging: CM(0.75) },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '2. ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Ibu Annisa', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: ', selaku Pembimbing Lapangan di PT Garciafood Nusantara Gemilang, yang telah menerima penulis dengan sangat hangat, memberikan arahan operasional lapangan, memfasilitasi kebutuhan data, dan membimbing penulis selama tiga bulan pelaksanaan magang.', font: FONT, size: SIZE_BODY }),
      ],
      spacing: SPACING_10,
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: CM(1.27), hanging: CM(0.75) },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '3. ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Bapak Richard dan Bapak Kim', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: ', selaku jajaran Owner / Direksi PT Garciafood Nusantara Gemilang yang telah memberikan izin tempat penelitian serta mendukung penuh digitalisasi koordinasi kinerja perusahaan melalui aplikasi RockyTen.', font: FONT, size: SIZE_BODY }),
      ],
      spacing: SPACING_10,
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: CM(1.27), hanging: CM(0.75) },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '4. ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Seluruh Pimpinan dan Staf PIC Divisi PT Garciafood Nusantara Gemilang', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: ' (Divisi IT, Finance, Kitchen, Service, dan Marketing) yang telah meluangkan waktu berharga untuk wawancara, observasi kebutuhan sistem, serta membantu pengujian antarmuka aplikasi.', font: FONT, size: SIZE_BODY }),
      ],
      spacing: SPACING_10,
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: CM(1.27), hanging: CM(0.75) },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '5. ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Orang Tua dan Keluarga Tercinta', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: ', yang tiada hentinya memanjatkan doa, mencurahkan kasih sayang, memberikan dukungan moril dan materiil yang tak terhingga sepanjang perjalanan studi penulis.', font: FONT, size: SIZE_BODY }),
      ],
      spacing: SPACING_10,
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: CM(1.27), hanging: CM(0.75) },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '6. ', font: FONT, size: SIZE_BODY }),
        new TextRun({ text: 'Rekan-rekan Mahasiswa Program Studi Teknik Informatika Angkatan 2024', font: FONT, size: SIZE_BODY, bold: true }),
        new TextRun({ text: ' Politeknik Ganesha Medan atas kebersamaan, diskusi pemecahan masalah, dan solidaritas selama menempuh pendidikan vokasi.', font: FONT, size: SIZE_BODY }),
      ],
      spacing: SPACING_10,
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: CM(1.27), hanging: CM(0.75) },
    }),
    PEmpty(),
    PSingle([
      T('Penulis menyadari sepenuhnya bahwa laporan ini masih memiliki keterbatasan dan ruang untuk penyempurnaan. Oleh karena itu, segala kritik dan saran yang konstruktif dari pembaca sangat penulis harapkan demi perbaikan karya-karya ilmiah di masa yang akan datang. Akhir kata, semoga laporan Praktik Kerja Lapangan ini dapat memberikan manfaat nyata, menambah wawasan keilmuan, serta menjadi referensi yang berguna bagi civitas akademika dan pembaca budiman.'),
    ], { indent: INDENT_ALINEA }),
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

    // ----------------------------------------------------
    // ----------------------------------------------------
    // DAFTAR ISI (Halaman vii - viii)
    // ----------------------------------------------------
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      children: [new TextRun({ text: 'DAFTAR ISI', font: FONT, size: SIZE_HEADING1, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240, line: 240, lineRule: LineRuleType.AUTO },
    }),
    TocItem('HALAMAN SAMPUL / COVER LUAR', '', 0, true),
    TocItem('HALAMAN JUDUL DALAM', 'ii', 0, true),
    TocItem('LEMBAR PENGESAHAN PRAKTIK KERJA LAPANGAN', 'iii', 0, true),
    TocItem('PERNYATAAN PENULIS (KEASLIAN KARYA)', 'iv', 0, true),
    TocItem('KATA PENGANTAR', 'v', 0, true),
    TocItem('DAFTAR ISI', 'vii', 0, true),
    TocItem('DAFTAR GAMBAR', 'ix', 0, true),
    TocItem('DAFTAR TABEL', 'x', 0, true),
    PEmpty(),
    TocItem('BAB I PENDAHULUAN', '1', 0, true),
    TocItem('1.1 Latar Belakang', '1', 1),
    TocItem('1.2 Rumusan Masalah', '3', 1),
    TocItem('1.3 Batasan Masalah', '3', 1),
    TocItem('1.4 Tujuan Praktik Kerja Lapangan', '4', 1),
    TocItem('1.5 Manfaat Praktik Kerja Lapangan', '5', 1),
    PEmpty(),
    TocItem('BAB II LANDASAN TEORI', '7', 0, true),
    TocItem('2.1 Tinjauan Pustaka', '7', 1),
    TocItem('2.1.1 Rancang Bangun Sistem Informasi', '7', 2),
    TocItem('2.1.2 Aplikasi Berbasis Web', '7', 2),
    TocItem('2.1.3 Role-Based Access Control (RBAC)', '9', 2),
    TocItem('2.1.4 Metodologi Traction — Level 10 Meeting', '10', 2),
    TocItem('2.1.5 Metode Waterfall', '12', 2),
    TocItem('2.2 Penelitian Terkait', '13', 1),
    TocItem('2.3 Kerangka Pemikiran', '15', 1),
    PEmpty(),
    TocItem('BAB III METODE PENELITIAN', '17', 0, true),
    TocItem('3.1 Gambaran Umum Perusahaan', '17', 1),
    TocItem('3.1.1 Sejarah Perusahaan PT Garciafood Nusantara Gemilang', '17', 2),
    TocItem('3.1.2 Visi Perusahaan', '17', 2),
    TocItem('3.1.3 Misi Perusahaan', '18', 2),
    TocItem('3.1.4 Struktur Organisasi dan Uraian Tugas', '18', 2),
    TocItem('3.1.5 Logo Perusahaan dan Makna Filosofis', '20', 2),
    TocItem('3.2 Tempat dan Waktu Penelitian', '20', 1),
    TocItem('3.3 Jenis dan Sumber Data', '21', 1),
    TocItem('3.3.1 Jenis Data', '21', 2),
    TocItem('3.3.2 Sumber Data', '22', 2),
    TocItem('3.4 Metode Pengumpulan Data', '22', 1),
    TocItem('3.5 Analisa Sistem yang Sedang Berjalan', '23', 1),
    TocItem('3.5.1 Prosedur Pengolahan Data Saat Ini', '23', 2),
    TocItem('3.5.2 Data Flow Diagram (DFD) Sistem yang Sedang Berjalan', '24', 2),
    TocItem('3.5.3 Evaluasi Kelemahan Sistem Berjalan (Matriks PIECES)', '24', 2),
    TocItem('3.6 Langkah-Langkah Rancang Bangun Aplikasi RockyTen', '25', 1),
    TocItem('3.6.1 Analisis Kebutuhan Sistem (Fungsional dan Non-Fungsional)', '25', 2),
    TocItem('3.6.2 Perancangan Sistem (Arsitektur, DFD, ERD, Matriks RBAC)', '28', 2),
    TocItem('3.6.3 Implementasi Sistem dan Antarmuka Modul RockyTen', '31', 2),
    TocItem('3.6.4 Pengujian Sistem (Black Box Testing dan Uji RBAC)', '34', 2),
    TocItem('3.6.5 Evaluasi Akhir dan Deployment Cloud', '36', 2),
    TocItem('3.7 Kesimpulan dan Saran', '37', 1),
    TocItem('3.7.1 Kesimpulan', '37', 2),
    TocItem('3.7.2 Saran', '38', 2),
    PEmpty(),
    TocItem('DAFTAR PUSTAKA', '39', 0, true),
    TocItem('LAMPIRAN', '40', 0, true),
    TocItem('Lampiran 1: Log Book (Catatan Kerja Harian Magang)', '40', 1),
    TocItem('Lampiran 2: Dokumentasi Kegiatan dan Tampilan Sistem', '43', 1),
    TocItem('BIOGRAFI PENULIS (RIWAYAT HIDUP)', '43', 0, true),

    // ----------------------------------------------------
    // DAFTAR GAMBAR (Halaman ix)
    // ----------------------------------------------------
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      children: [new TextRun({ text: 'DAFTAR GAMBAR', font: FONT, size: SIZE_HEADING1, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240, line: 240, lineRule: LineRuleType.AUTO },
    }),
    TocItem('Gambar 2.1 Alur Metode Pengembangan Perangkat Lunak Waterfall', '13', 0),
    TocItem('Gambar 2.2 Diagram Alir Kerangka Pemikiran Metodologis Penelitian', '15', 0),
    TocItem('Gambar 3.1 Struktur Organisasi PT Garciafood Nusantara Gemilang', '18', 0),
    TocItem('Gambar 3.2 Logo Resmi PT Garciafood Nusantara Gemilang / Nasi Gerilya', '20', 0),
    TocItem('Gambar 3.3 Diagram Konteks (Level 0) Sistem Koordinasi Kinerja Manual', '24', 0),
    TocItem('Gambar 3.4 Data Flow Diagram (DFD) Level 1 Sistem Koordinasi Manual', '24', 0),
    TocItem('Gambar 3.5 Diagram Konteks (Level 0) Sistem Baru Aplikasi RockyTen', '28', 0),
    TocItem('Gambar 3.6 Data Flow Diagram (DFD) Level 1 Aplikasi RockyTen', '29', 0),
    TocItem('Gambar 3.7 Entity Relationship Diagram (ERD) Basis Data Supabase', '30', 0),
    TocItem('Gambar 3.8 Tampilan Antarmuka Halaman Dashboard Eksekutif RockyTen', '31', 0),
    TocItem('Gambar 3.9 Tampilan Halaman Scoreboard (Metrik Sub-Rocks dan Mandiri)', '32', 0),
    TocItem('Gambar 3.10 Tampilan Halaman Rocks (Target 90 Hari dan Tombol Eskalasi IDS)', '32', 0),
    TocItem('Gambar 3.11 Tampilan Halaman Headlines (Papan Pengumuman Berprioritas)', '33', 0),
    TocItem('Gambar 3.12 Tampilan Halaman To-Do List (Manajemen Tugas Akuntabilitas Rapat)', '33', 0),
    TocItem('Gambar 3.13 Tampilan Halaman Issues List (Penyelesaian Masalah Metode IDS)', '33', 0),
    TocItem('Gambar 3.14 Tampilan Halaman Settings dan Panel Role Switcher RBAC', '34', 0),

    // ----------------------------------------------------
    // DAFTAR TABEL (Halaman x)
    // ----------------------------------------------------
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      children: [new TextRun({ text: 'DAFTAR TABEL', font: FONT, size: SIZE_HEADING1, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240, line: 240, lineRule: LineRuleType.AUTO },
    }),
    TocItem('Tabel 2.1 Perbandingan Hasil Penelitian Terkait', '13', 0),
    TocItem('Tabel 3.1 Matriks Jadwal Rencana dan Realisasi Kegiatan Magang PKL', '21', 0),
    TocItem('Tabel 3.2 Analisis Kelemahan Sistem Manual Menggunakan Kerangka PIECES', '24', 0),
    TocItem('Tabel 3.3 Spesifikasi Kebutuhan Fungsional (Functional Requirements)', '26', 0),
    TocItem('Tabel 3.4 Spesifikasi Kebutuhan Non-Fungsional (Non-Functional Requirements)', '27', 0),
    TocItem('Tabel 3.5 Spesifikasi Struktur Basis Data Relasional PostgreSQL Supabase', '29', 0),
    TocItem('Tabel 3.6 Matriks Otorisasi Hak Akses Role-Based Access Control (RBAC)', '30', 0),
    TocItem('Tabel 3.7 Rencana dan Hasil Pengujian Fungsional Modul (Black Box Testing)', '34', 0),
    TocItem('Tabel 3.8 Hasil Pengujian Keamanan Hak Akses Peran RBAC RockyTen', '35', 0),
    TocItem('Tabel L.1 Catatan Kerja Harian (Log Book) Magang 13 Minggu', '40', 0),
  ];
}

module.exports = {
  getCoverLuarChildren,
  getBagianAwalChildren,
};
