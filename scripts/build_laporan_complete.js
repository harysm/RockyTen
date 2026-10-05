'use strict';

const {
  Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType,
  PageNumber, NumberFormat, LineRuleType, convertMillimetersToTwip
} = require('docx');
const fs = require('fs');
const path = require('path');

const { CM, FONT, SIZE_BODY } = require('./helpers');
const { getCoverLuarChildren, getBagianAwalChildren } = require('./section_cover');
const { getBab1Children } = require('./section_bab1');
const { getBab2Children } = require('./section_bab2');
const { getBab3Children } = require('./section_bab3');
const { getBackmatterChildren } = require('./section_backmatter');

async function main() {
  console.log('🚀 Menyiapkan pembuatan naskah Word Laporan PKL RockyTen format Politeknik Ganesha Medan...');

  const MARGINS = {
    top: CM(3.0),
    right: CM(3.0),
    bottom: CM(3.0),
    left: CM(4.0),
  };

  // Helper for bottom-centered page numbering footer
  const createCenteredFooter = () => new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            font: FONT,
            size: SIZE_BODY,
          }),
        ],
        spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO },
      }),
    ],
  });

  // Helper for Chapter Section headers/footers (Header kosong, Footer nomor di bawah tengah)
  const createBabHeadersFooters = () => ({
    headers: {
      default: new Header({ children: [] }),
      first: new Header({ children: [] }),
    },
    footers: {
      default: createCenteredFooter(),
      first: createCenteredFooter(),
    },
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE_BODY },
          paragraph: { alignment: AlignmentType.JUSTIFIED },
        },
      },
    },
    sections: [
      // -----------------------------------------------------------------
      // SECTION 1: COVER LUAR (Tanpa Nomor Halaman)
      // -----------------------------------------------------------------
      {
        properties: {
          page: { margin: MARGINS },
        },
        headers: {
          default: new Header({ children: [] }),
          first: new Header({ children: [] }),
        },
        footers: {
          default: new Footer({ children: [] }),
          first: new Footer({ children: [] }),
        },
        children: getCoverLuarChildren(),
      },

      // -----------------------------------------------------------------
      // SECTION 2: BAGIAN AWAL (Halaman Judul Dalam, Pengesahan, dsb)
      // Penomoran Romawi kecil di Bawah Tengah (ii, iii, iv...)
      // -----------------------------------------------------------------
      {
        properties: {
          page: {
            margin: MARGINS,
            pageNumbers: { start: 2, formatType: NumberFormat.LOWER_ROMAN },
          },
        },
        headers: {
          default: new Header({ children: [] }),
          first: new Header({ children: [] }),
        },
        footers: {
          default: createCenteredFooter(),
          first: createCenteredFooter(),
        },
        children: getBagianAwalChildren(),
      },

      // -----------------------------------------------------------------
      // SECTION 3: BAB I PENDAHULUAN
      // Dimulai dari halaman 1 (Angka Arab/Desimal) di Bawah Tengah
      // -----------------------------------------------------------------
      {
        properties: {
          page: {
            margin: MARGINS,
            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
          },
        },
        ...createBabHeadersFooters(),
        children: getBab1Children(),
      },

      // -----------------------------------------------------------------
      // SECTION 4: BAB II LANDASAN TEORI
      // Melanjutkan nomor halaman sebelumnya di Bawah Tengah
      // -----------------------------------------------------------------
      {
        properties: {
          page: {
            margin: MARGINS,
            pageNumbers: { formatType: NumberFormat.DECIMAL },
          },
        },
        ...createBabHeadersFooters(),
        children: getBab2Children(),
      },

      // -----------------------------------------------------------------
      // SECTION 5: BAB III METODE PENELITIAN
      // Melanjutkan nomor halaman sebelumnya di Bawah Tengah
      // -----------------------------------------------------------------
      {
        properties: {
          page: {
            margin: MARGINS,
            pageNumbers: { formatType: NumberFormat.DECIMAL },
          },
        },
        ...createBabHeadersFooters(),
        children: getBab3Children(),
      },

      // -----------------------------------------------------------------
      // SECTION 6: BAGIAN AKHIR (Daftar Pustaka, Lampiran, Riwayat Hidup)
      // Melanjutkan nomor halaman sebelumnya di Bawah Tengah
      // -----------------------------------------------------------------
      {
        properties: {
          page: {
            margin: MARGINS,
            pageNumbers: { formatType: NumberFormat.DECIMAL },
          },
        },
        ...createBabHeadersFooters(),
        children: getBackmatterChildren(),
      },
    ],
  });

  console.log('📦 Mengemas dokumen ke dalam format DOCX...');
  const buffer = await Packer.toBuffer(doc);

  const outDir = path.join(__dirname, '..', 'laporan');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'LAPORAN_PKL_RockyTen_M_Harys_Rusty_Wibawa.docx');
  fs.writeFileSync(outPath, buffer);

  const sizeKb = (buffer.length / 1024).toFixed(1);
  console.log(`✅ SUKSES! File Word resmi telah berhasil diperbarui:`);
  console.log(`📍 Lokasi: ${outPath}`);
  console.log(`📊 Ukuran File: ${sizeKb} KB`);
}

main().catch((err) => {
  console.error('❌ Gagal menghasilkan dokumen:', err);
  process.exit(1);
});
