'use strict';

const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

// Simple, clean, vertical top-to-bottom academic Waterfall flowchart
// Font: Times New Roman, pure white background, crisp 1.5px black outlines, centered vertical flow
const width = 640;
const height = 760;

const boxW = 340;
const boxH = 75;
const boxX = (width - boxW) / 2; // 150

const y1 = 45;
const y2 = 185;
const y3 = 325;
const y4 = 465;
const y5 = 605;

const cx = width / 2; // 320

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
    </marker>
    <style>
      text { font-family: 'Times New Roman', Times, serif; }
      .box-title { font-size: 15px; font-weight: bold; fill: #000000; text-anchor: middle; letter-spacing: 0.5px; }
      .box-sub { font-size: 13px; font-style: italic; fill: #333333; text-anchor: middle; }
    </style>
  </defs>

  <!-- Pure White Background -->
  <rect width="${width}" height="${height}" fill="#FFFFFF" />

  <!-- Straight Vertical Connecting Arrows -->
  <!-- Box 1 to Box 2 -->
  <line x1="${cx}" y1="${y1 + boxH}" x2="${cx}" y2="${y2 - 2}" stroke="#000000" stroke-width="1.5" marker-end="url(#arrow)" />

  <!-- Box 2 to Box 3 -->
  <line x1="${cx}" y1="${y2 + boxH}" x2="${cx}" y2="${y3 - 2}" stroke="#000000" stroke-width="1.5" marker-end="url(#arrow)" />

  <!-- Box 3 to Box 4 -->
  <line x1="${cx}" y1="${y3 + boxH}" x2="${cx}" y2="${y4 - 2}" stroke="#000000" stroke-width="1.5" marker-end="url(#arrow)" />

  <!-- Box 4 to Box 5 -->
  <line x1="${cx}" y1="${y4 + boxH}" x2="${cx}" y2="${y5 - 2}" stroke="#000000" stroke-width="1.5" marker-end="url(#arrow)" />

  <!-- ========================================================================= -->
  <!-- BOX 1: ANALISIS KEBUTUHAN -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${y1})">
    <rect width="${boxW}" height="${boxH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="35" class="box-title">ANALISIS KEBUTUHAN</text>
    <text x="${boxW / 2}" y="55" class="box-sub">(Requirements Analysis)</text>
  </g>

  <!-- ========================================================================= -->
  <!-- BOX 2: PERANCANGAN SISTEM -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${y2})">
    <rect width="${boxW}" height="${boxH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="35" class="box-title">PERANCANGAN SISTEM</text>
    <text x="${boxW / 2}" y="55" class="box-sub">(System Design)</text>
  </g>

  <!-- ========================================================================= -->
  <!-- BOX 3: IMPLEMENTASI -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${y3})">
    <rect width="${boxW}" height="${boxH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="35" class="box-title">IMPLEMENTASI SISTEM</text>
    <text x="${boxW / 2}" y="55" class="box-sub">(Implementation / Coding)</text>
  </g>

  <!-- ========================================================================= -->
  <!-- BOX 4: PENGUJIAN SISTEM -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${y4})">
    <rect width="${boxW}" height="${boxH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="35" class="box-title">PENGUJIAN SISTEM</text>
    <text x="${boxW / 2}" y="55" class="box-sub">(Testing &amp; Verification)</text>
  </g>

  <!-- ========================================================================= -->
  <!-- BOX 5: PEMELIHARAAN / PENERAPAN -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${y5})">
    <rect width="${boxW}" height="${boxH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="35" class="box-title">PEMELIHARAAN</text>
    <text x="${boxW / 2}" y="55" class="box-sub">(Maintenance / Deployment)</text>
  </g>
</svg>
`;

async function renderVertical() {
  console.log('Rendering vertical academic waterfall flowchart...');
  
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1280 }, // crisp 2x resolution
  });
  
  const pngBuffer = resvg.render().asPng();

  // Save to laporan folder
  const outPathMain = path.join(__dirname, '..', 'laporan', 'diagram_waterfall.png');
  fs.writeFileSync(outPathMain, pngBuffer);

  const outPathVert = path.join(__dirname, '..', 'laporan', 'diagram_waterfall_vertikal.png');
  fs.writeFileSync(outPathVert, pngBuffer);

  // Save to brain artifacts directory so user can view it directly in chat
  const artifactPath = path.join('C:', 'Users', 'Haxxs', '.gemini', 'antigravity', 'brain', '8b3d4162-111c-43c7-829d-ad8f71546ffa', 'diagram_waterfall.png');
  fs.writeFileSync(artifactPath, pngBuffer);

  console.log('✅ Vertical diagram rendered successfully:');
  console.log('📍', outPathMain);
  console.log('📍', artifactPath);
}

renderVertical().catch(console.error);
