'use strict';

const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

// Simple, clean, classic academic Kerangka Pemikiran flowchart
// Font: Times New Roman, pure white background, crisp 1.5px black outlines, vertical flow
const width = 760;
const height = 890;

const boxW = 560;
const boxX = (width - boxW) / 2; // 100
const cx = width / 2; // 380

// Box Y positions & heights
const b1_y = 35;
const b1_h = 115;

const b2_y = 195;
const b2_h = 95;

const b3_y = 335;
const b3_h = 95;

const b4_y = 475;
const b4_h = 105;

const b5_y = 625;
const b5_h = 115;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
    </marker>
    <style>
      text { font-family: 'Times New Roman', Times, serif; }
      .box-title { font-size: 14.5px; font-weight: bold; fill: #000000; text-anchor: middle; letter-spacing: 0.5px; }
      .bullet-title { font-size: 12.5px; font-weight: bold; fill: #000000; }
      .bullet-text { font-size: 12.5px; fill: #111111; }
    </style>
  </defs>

  <!-- Pure White Background -->
  <rect width="${width}" height="${height}" fill="#FFFFFF" />

  <!-- Connecting Arrows -->
  <line x1="${cx}" y1="${b1_y + b1_h}" x2="${cx}" y2="${b2_y - 2}" stroke="#000000" stroke-width="1.5" marker-end="url(#arrow)" />
  <line x1="${cx}" y1="${b2_y + b2_h}" x2="${cx}" y2="${b3_y - 2}" stroke="#000000" stroke-width="1.5" marker-end="url(#arrow)" />
  <line x1="${cx}" y1="${b3_y + b3_h}" x2="${cx}" y2="${b4_y - 2}" stroke="#000000" stroke-width="1.5" marker-end="url(#arrow)" />
  <line x1="${cx}" y1="${b4_y + b4_h}" x2="${cx}" y2="${b5_y - 2}" stroke="#000000" stroke-width="1.5" marker-end="url(#arrow)" />

  <!-- ========================================================================= -->
  <!-- KOTAK 1: IDENTIFIKASI MASALAH -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${b1_y})">
    <rect width="${boxW}" height="${b1_h}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="28" class="box-title">IDENTIFIKASI MASALAH (OPERASIONAL BISNIS)</text>
    <line x1="20" y1="38" x2="${boxW - 20}" y2="38" stroke="#000000" stroke-width="0.8" />
    
    <text x="25" y="58" class="bullet-text">• Koordinasi kinerja antar 5 divisi masih manual (grup WhatsApp &amp; catatan kertas).</text>
    <text x="25" y="78" class="bullet-text">• Pelaksanaan rapat mingguan tidak terstruktur &amp; pelacakan target 90 hari minim.</text>
    <text x="25" y="98" class="bullet-text">• Belum adanya kontrol hak akses privasi data operasional dan keuangan antar divisi.</text>
  </g>

  <!-- ========================================================================= -->
  <!-- KOTAK 2: PENDEKATAN TEORITIS & METODOLOGI -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${b2_y})">
    <rect width="${boxW}" height="${b2_h}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="26" class="box-title">PENDEKATAN TEORITIS &amp; KONSEPTUAL</text>
    <line x1="20" y1="36" x2="${boxW - 20}" y2="36" stroke="#000000" stroke-width="0.8" />
    
    <text x="25" y="56" class="bullet-text">• Metodologi Traction: Level 10 Meeting (EOS Gino Wickman, 2011).</text>
    <text x="25" y="76" class="bullet-text">• Model Keamanan Role-Based Access Control / RBAC (Standar NIST, Sandhu et al., 1996).</text>
  </g>

  <!-- ========================================================================= -->
  <!-- KOTAK 3: METODE PENGEMBANGAN SISTEM -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${b3_y})">
    <rect width="${boxW}" height="${b3_h}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="26" class="box-title">METODE PENGEMBANGAN SISTEM (SDLC)</text>
    <line x1="20" y1="36" x2="${boxW - 20}" y2="36" stroke="#000000" stroke-width="0.8" />
    
    <text x="25" y="56" class="bullet-text">• Metode Waterfall (Pressman, 2015):</text>
    <text x="35" y="76" class="bullet-text">Analisis Kebutuhan → Perancangan → Implementasi → Pengujian → Evaluasi Akhir</text>
  </g>

  <!-- ========================================================================= -->
  <!-- KOTAK 4: TEKNOLOGI PENGEMBANGAN -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${b4_y})">
    <rect width="${boxW}" height="${b4_h}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="26" class="box-title">LINGKUNGAN &amp; TEKNOLOGI IMPLEMENTASI</text>
    <line x1="20" y1="36" x2="${boxW - 20}" y2="36" stroke="#000000" stroke-width="0.8" />
    
    <text x="25" y="54" class="bullet-text">• Frontend &amp; Antarmuka: Next.js 16 (App Router), Tailwind CSS v3, TypeScript.</text>
    <text x="25" y="73" class="bullet-text">• Backend &amp; Basis Data: Supabase Cloud Platform (PostgreSQL Relasional &amp; Realtime).</text>
    <text x="25" y="92" class="bullet-text">• Deployment &amp; Pengujian: Vercel Cloud Platform &amp; Black Box Testing.</text>
  </g>

  <!-- ========================================================================= -->
  <!-- KOTAK 5: HASIL YANG DICAPAI (OUTPUT) -->
  <!-- ========================================================================= -->
  <g transform="translate(${boxX}, ${b5_y})">
    <rect width="${boxW}" height="${b5_h}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <text x="${boxW / 2}" y="28" class="box-title">HASIL YANG DICAPAI (OUTPUT SISTEM)</text>
    <line x1="20" y1="38" x2="${boxW - 20}" y2="38" stroke="#000000" stroke-width="0.8" />
    
    <text x="25" y="58" class="bullet-text">• Aplikasi RockyTen Berbasis Web siap guna di PT Garciafood Nusantara Gemilang.</text>
    <text x="25" y="78" class="bullet-text">• 5 Modul Terintegrasi: Scoreboard, Rocks 90 Hari, Headlines, To-Do List, Issues IDS.</text>
    <text x="25" y="98" class="bullet-text">• Keamanan Otorisasi RBAC 3 Peran: Developer, Owner, dan PIC 5 Divisi.</text>
  </g>
</svg>
`;

async function render() {
  console.log('Rendering clean academic kerangka pemikiran diagram...');
  
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1520 }, // 2x high resolution
  });
  
  const pngBuffer = resvg.render().asPng();

  const outPath1 = path.join(__dirname, '..', 'laporan', 'diagram_kerangka_pemikiran.png');
  fs.writeFileSync(outPath1, pngBuffer);

  const artifactPath = path.join('C:', 'Users', 'Haxxs', '.gemini', 'antigravity', 'brain', '8b3d4162-111c-43c7-829d-ad8f71546ffa', 'diagram_kerangka_pemikiran.png');
  fs.writeFileSync(artifactPath, pngBuffer);

  console.log('✅ Diagram Kerangka Pemikiran rendered successfully:');
  console.log('📍', outPath1);
  console.log('📍', artifactPath);
}

render().catch(console.error);
