const {
  Paragraph, TextRun, AlignmentType, convertMillimetersToTwip,
  TabStopType, LeaderType, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, VerticalAlign, LineRuleType,
  PageBreak, ImageRun
} = require('docx');
const fs = require('fs');
const path = require('path');


const CM = (cm) => convertMillimetersToTwip(cm * 10);
const FONT = 'Times New Roman';
const SIZE_BODY = 24;      // 12pt
const SIZE_HEADING1 = 28;  // 14pt
const SIZE_SUBHEADING = 24;// 12pt
const SIZE_TABLE = 22;     // 11pt
const SIZE_FOOTNOTE = 20;  // 10pt

const SPACING_15 = { line: 360, lineRule: LineRuleType.AUTO }; // 1.5 spasi
const SPACING_10 = { line: 240, lineRule: LineRuleType.AUTO }; // 1.0 spasi
const INDENT_ALINEA = { firstLine: CM(1.27) };

// Text helpers
const T = (text, opts = {}) => new TextRun({ text, font: FONT, size: SIZE_BODY, ...opts });
const TBold = (text, opts = {}) => T(text, { bold: true, ...opts });
const TItalic = (text, opts = {}) => T(text, { italics: true, ...opts });
const TBoldItalic = (text, opts = {}) => T(text, { bold: true, italics: true, ...opts });
const TSize = (text, size, opts = {}) => T(text, { size, ...opts });

// Paragraph helpers
const P = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [typeof children === 'string' ? T(children) : children],
  spacing: SPACING_15,
  alignment: AlignmentType.JUSTIFIED,
  ...opts,
});

const PIndent = (children, opts = {}) => P(children, { indent: INDENT_ALINEA, ...opts });

const PCenter = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [typeof children === 'string' ? T(children) : children],
  spacing: SPACING_15,
  alignment: AlignmentType.CENTER,
  ...opts,
});

const PLeft = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [typeof children === 'string' ? T(children) : children],
  spacing: SPACING_15,
  alignment: AlignmentType.LEFT,
  ...opts,
});

const PSingle = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [typeof children === 'string' ? T(children) : children],
  spacing: SPACING_10,
  alignment: AlignmentType.JUSTIFIED,
  ...opts,
});

const PEmpty = () => new Paragraph({
  children: [T('')],
  spacing: SPACING_10,
});

// Headings
const BabTitle = (babNum, babName) => [
  new Paragraph({
    children: [new TextRun({ text: babNum.toUpperCase(), font: FONT, size: SIZE_HEADING1, bold: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120, line: 240, lineRule: LineRuleType.AUTO },
  }),
  new Paragraph({
    children: [new TextRun({ text: babName.toUpperCase(), font: FONT, size: SIZE_HEADING1, bold: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 360, line: 240, lineRule: LineRuleType.AUTO },
  }),
];

const SubBab = (code, title) => new Paragraph({
  children: [new TextRun({ text: `${code} ${title}`, font: FONT, size: SIZE_SUBHEADING, bold: true })],
  alignment: AlignmentType.LEFT,
  spacing: { before: 280, after: 120, line: 360, lineRule: LineRuleType.AUTO },
});

const SubSubBab = (code, title) => new Paragraph({
  children: [new TextRun({ text: `${code} ${title}`, font: FONT, size: SIZE_SUBHEADING, bold: true })],
  alignment: AlignmentType.LEFT,
  spacing: { before: 200, after: 100, line: 360, lineRule: LineRuleType.AUTO },
});

// Numbered & lettered lists (compliant with Polgan: No bullet '-')
const ListItem = (num, content) => new Paragraph({
  children: [
    new TextRun({ text: `${num}. `, font: FONT, size: SIZE_BODY, bold: false }),
    ...(Array.isArray(content) ? content : [typeof content === 'string' ? T(content) : content]),
  ],
  spacing: SPACING_15,
  alignment: AlignmentType.JUSTIFIED,
  indent: { left: CM(1.27), hanging: CM(0.75) },
});

const ListAlpha = (alpha, content) => new Paragraph({
  children: [
    new TextRun({ text: `${alpha}. `, font: FONT, size: SIZE_BODY, bold: false }),
    ...(Array.isArray(content) ? content : [typeof content === 'string' ? T(content) : content]),
  ],
  spacing: SPACING_15,
  alignment: AlignmentType.JUSTIFIED,
  indent: { left: CM(2.0), hanging: CM(0.75) },
});

// Table & Figure captions
const CaptionTabel = (tabelCode, judul) => new Paragraph({
  children: [
    new TextRun({ text: `${tabelCode} `, font: FONT, size: SIZE_SUBHEADING, bold: true }),
    new TextRun({ text: judul, font: FONT, size: SIZE_SUBHEADING, bold: false }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { before: 240, after: 120, line: 240, lineRule: LineRuleType.AUTO },
});

const CaptionGambar = (gambarCode, judul) => new Paragraph({
  children: [
    new TextRun({ text: `${gambarCode} `, font: FONT, size: SIZE_SUBHEADING, bold: true }),
    new TextRun({ text: judul, font: FONT, size: SIZE_SUBHEADING, bold: false }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { before: 120, after: 240, line: 240, lineRule: LineRuleType.AUTO },
});

// Visual Box for Figure / Mockup Container
const FigureBox = (title, subtext) => {
  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: `[ ${title.toUpperCase()} ]`, font: FONT, size: SIZE_BODY, bold: true, color: '1E293B' })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 240, after: 80, line: 240, lineRule: LineRuleType.AUTO },
              }),
              new Paragraph({
                children: [new TextRun({ text: subtext || 'Resolusi 150–300 DPI, tata letak simetris di tengah pengetikan', font: FONT, size: SIZE_TABLE, italics: true, color: '64748B' })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 240, line: 240, lineRule: LineRuleType.AUTO },
              }),
            ],
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.DASHED, size: 6, color: '94A3B8' },
              bottom: { style: BorderStyle.DASHED, size: 6, color: '94A3B8' },
              left: { style: BorderStyle.DASHED, size: 6, color: '94A3B8' },
              right: { style: BorderStyle.DASHED, size: 6, color: '94A3B8' },
            },
            margins: { top: 200, bottom: 200, left: 300, right: 300 },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
};

// Generic Styled Table
const createStyledTable = (headers, rows, colWidthsDxa) => {
  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: h, font: FONT, size: SIZE_TABLE, bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 100, line: 240, lineRule: LineRuleType.AUTO },
        }),
      ],
      width: { size: colWidthsDxa[i], type: WidthType.DXA },
      shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
    })),
    tableHeader: true,
  });

  const bodyRows = rows.map((r) => new TableRow({
    children: r.map((c, i) => new TableCell({
      children: [
        new Paragraph({
          children: Array.isArray(c) ? c : [new TextRun({ text: String(c), font: FONT, size: SIZE_TABLE })],
          alignment: i === 0 && r.length > 2 && String(c).length <= 4 ? AlignmentType.CENTER : AlignmentType.LEFT,
          spacing: { before: 80, after: 80, line: 240, lineRule: LineRuleType.AUTO },
        }),
      ],
      width: { size: colWidthsDxa[i], type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
    })),
  }));

  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
    },
  });
};

// TOC Item with dotted tab leader
const TocItem = (label, pageNum, level = 0, bold = false) => {
  const indentCm = level === 0 ? 0 : level === 1 ? 0.6 : 1.2;
  return new Paragraph({
    children: [
      new TextRun({ text: label, font: FONT, size: SIZE_BODY, bold }),
      new TextRun({ text: `\t${pageNum}`, font: FONT, size: SIZE_BODY, bold }),
    ],
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: CM(14.0),
        leader: LeaderType.DOT,
      },
    ],
    spacing: level === 0 ? { before: 100, after: 40, line: 240, lineRule: LineRuleType.AUTO } : { before: 30, after: 30, line: 240, lineRule: LineRuleType.AUTO },
    alignment: AlignmentType.LEFT,
    indent: { left: CM(indentCm) },
  });
};

// Image Figure with real embedded image file
const ImageFigure = (imagePath, widthPt = 520, heightPt = 374) => {
  if (fs.existsSync(imagePath)) {
    const ext = path.extname(imagePath).replace('.', '').toLowerCase();
    const type = ext === 'jpeg' ? 'jpg' : ext;
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: fs.readFileSync(imagePath),
          transformation: { width: widthPt, height: heightPt },
          type: type || 'png',
        }),
      ],
      spacing: { before: 140, after: 120, line: 240, lineRule: LineRuleType.AUTO },
    });
  } else {
    return FigureBox('GAMBAR TIDAK DITEMUKAN', imagePath);
  }
};

module.exports = {
  CM, FONT, SIZE_BODY, SIZE_HEADING1, SIZE_SUBHEADING, SIZE_TABLE, SIZE_FOOTNOTE,
  SPACING_15, SPACING_10, INDENT_ALINEA,
  T, TBold, TItalic, TBoldItalic, TSize,
  P, PIndent, PCenter, PLeft, PSingle, PEmpty,
  BabTitle, SubBab, SubSubBab,
  ListItem, ListAlpha,
  CaptionTabel, CaptionGambar, FigureBox, ImageFigure,
  createStyledTable, TocItem,
};

