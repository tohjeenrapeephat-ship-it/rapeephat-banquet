const fs = require('fs');
const path = require('path');
const QRCode = require('./frontend/node_modules/qrcode');

const REVIEW_URL = 'https://g.page/r/CX9Q5ttfJy6iEAE/review';
const OUTPUT_DIR = './frontend/public/images/reviews';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  // 1. Generate Raw Crisp High-Res PNG QR Code (1200x1200px)
  const rawQrPath = path.join(OUTPUT_DIR, 'QR_Code_Google_Review_Rapeephat_1200px.png');
  await QRCode.toFile(rawQrPath, REVIEW_URL, {
    width: 1200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });
  console.log('Generated:', rawQrPath);

  // 2. Generate Base64 Data URL for embedding in SVG & HTML
  const qrDataUrl = await QRCode.toDataURL(REVIEW_URL, {
    width: 800,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });

  // 3. Generate Table Stand / A4 Counter Tent SVG Card (1200 x 1600 px - Portrait)
  const a4StandSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7f1d1d"/>
      <stop offset="40%" stop-color="#991b1b"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fffbeb"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="1600" fill="url(#bgGrad)"/>
  
  <!-- Outer Gold Border -->
  <rect x="30" y="30" width="1140" height="1540" rx="36" fill="none" stroke="url(#goldGrad)" stroke-width="8"/>
  <rect x="44" y="44" width="1112" height="1512" rx="28" fill="none" stroke="#fef08a" stroke-width="2" stroke-dasharray="8,6"/>

  <!-- Top Header Badge -->
  <g transform="translate(600, 130)">
    <rect x="-320" y="-45" width="640" height="90" rx="45" fill="#fef3c7" stroke="url(#goldGrad)" stroke-width="4" filter="url(#shadow)"/>
    <text x="0" y="12" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="34" font-weight="900" fill="#78350f" text-anchor="middle">
      👑 โต๊ะจีน รพีพัฒน์ (นครปฐม) 👑
    </text>
  </g>

  <!-- Title & Subtitle -->
  <text x="600" y="270" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="52" font-weight="900" fill="#fef08a" text-anchor="middle">
    สแกนเพื่อรีวิว &amp; ให้คะแนน 5 ดาว
  </text>
  <text x="600" y="330" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="28" font-weight="600" fill="#fed7aa" text-anchor="middle">
    บน Google Maps &amp; Google Search
  </text>

  <!-- 5 Gold Stars Rating -->
  <g transform="translate(600, 395)">
    <text x="0" y="0" font-size="64" text-anchor="middle" fill="#fbbf24">
      ⭐ ⭐ ⭐ ⭐ ⭐
    </text>
  </g>

  <!-- Main White Center Card for QR Code -->
  <rect x="180" y="460" width="840" height="880" rx="48" fill="url(#cardBg)" stroke="url(#goldGrad)" stroke-width="8" filter="url(#shadow)"/>

  <!-- Inner QR Frame -->
  <rect x="250" y="520" width="700" height="700" rx="32" fill="#ffffff" stroke="#e5e7eb" stroke-width="4"/>

  <!-- Embedded Crisp QR Code Image -->
  <image x="280" y="550" width="640" height="640" href="${qrDataUrl}" />

  <!-- Scan Instruction under QR -->
  <text x="600" y="1285" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="32" font-weight="800" fill="#991b1b" text-anchor="middle">
    📷 ใช้กล้องมือถือส่องเพื่อเปิดหน้ารีวิวได้ทันที
  </text>

  <!-- Bottom Thank You Message & Contact -->
  <text x="600" y="1410" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="28" font-weight="700" fill="#fef08a" text-anchor="middle">
    ขอบพระคุณทุกท่านที่ไว้วางใจให้โต๊ะจีนรพีพัฒน์ดูแลมื้อสำคัญค่ะ
  </text>
  <text x="600" y="1460" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="24" font-weight="500" fill="#ffffff" text-anchor="middle">
    โทร: 081-331-1646  •  LINE: pang_baichaa  •  www.rapeephat-catering.com
  </text>
  <text x="600" y="1505" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="20" font-weight="400" fill="#fed7aa" text-anchor="middle">
    มาตรฐานภัตตาคาร 35+ ปี • ปรุงสดใหม่ทุกจาน • ทั่วราชอาณาจักร
  </text>
</svg>
`;

  const a4StandPath = path.join(OUTPUT_DIR, 'Table_Tent_Google_Review_A4.svg');
  fs.writeFileSync(a4StandPath, a4StandSvg, 'utf8');
  console.log('Generated:', a4StandPath);

  // 4. Generate Square Social Media Post SVG (1080 x 1080 px)
  const squarePostSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <linearGradient id="bgGradSq" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#991b1b"/>
      <stop offset="50%" stop-color="#7f1d1d"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </linearGradient>
    <linearGradient id="goldGradSq" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="shadowSq" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="1080" height="1080" fill="url(#bgGradSq)"/>
  <rect x="24" y="24" width="1032" height="1032" rx="36" fill="none" stroke="url(#goldGradSq)" stroke-width="6"/>

  <!-- Header -->
  <text x="540" y="100" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="44" font-weight="900" fill="#fef08a" text-anchor="middle">
    โต๊ะจีน รพีพัฒน์ (นครปฐม)
  </text>
  <text x="540" y="150" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">
    ชวนลูกค้าร่วมแบ่งปันความประทับใจ รีวิว 5 ดาว ⭐⭐⭐⭐⭐
  </text>

  <!-- Center QR Container -->
  <rect x="220" y="190" width="640" height="690" rx="36" fill="#ffffff" stroke="url(#goldGradSq)" stroke-width="6" filter="url(#shadowSq)"/>
  <image x="260" y="220" width="560" height="560" href="${qrDataUrl}" />
  <text x="540" y="835" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="26" font-weight="800" fill="#b91c1c" text-anchor="middle">
    สแกนด้วยกล้องมือถือ เพื่อรีวิวบน Google Maps
  </text>

  <!-- Footer -->
  <text x="540" y="940" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="26" font-weight="800" fill="#fef08a" text-anchor="middle">
    ทุกรีวิวคือกำลังใจอันล้ำค่าของทีมงานโต๊ะจีนรพีพัฒน์ค่ะ
  </text>
  <text x="540" y="990" font-family="'Sarabun', 'Prompt', 'Arial', sans-serif" font-size="22" font-weight="600" fill="#fed7aa" text-anchor="middle">
    📞 สายด่วนจองงาน: 081-331-1646  •  LINE: pang_baichaa
  </text>
</svg>
`;

  const squarePostPath = path.join(OUTPUT_DIR, 'Social_Post_Google_Review_Square.svg');
  fs.writeFileSync(squarePostPath, squarePostSvg, 'utf8');
  console.log('Generated:', squarePostPath);

  // 5. Generate Standalone Printable HTML Page (Ready for browser 1-click print / save to PDF)
  const printableHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ป้ายตั้งโต๊ะ สแกนรีวิว 5 ดาว Google Maps - โต๊ะจีนรพีพัฒน์</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Prompt', sans-serif; }
    body { background: #1e1e24; display: flex; flex-direction: column; align-items: center; padding: 30px 10px; min-height: 100vh; }
    .print-btn-bar { margin-bottom: 20px; display: flex; gap: 15px; }
    .btn { background: #b91c1c; color: white; border: none; padding: 12px 28px; border-radius: 12px; font-weight: 800; font-size: 16px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.3); transition: all 0.2s; }
    .btn:hover { background: #991b1b; transform: scale(1.03); }
    .btn-gold { background: #f59e0b; color: #78350f; }
    .btn-gold:hover { background: #d97706; }
    
    .card {
      width: 100%;
      max-width: 650px;
      background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #450a0a 100%);
      border-radius: 36px;
      padding: 40px 30px;
      border: 8px solid #fbbf24;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      text-align: center;
      color: white;
      position: relative;
    }
    .badge {
      display: inline-block;
      background: #fef3c7;
      color: #78350f;
      padding: 8px 24px;
      border-radius: 30px;
      font-size: 18px;
      font-weight: 900;
      border: 2px solid #fbbf24;
      margin-bottom: 15px;
    }
    h1 { font-size: 28px; font-weight: 900; color: #fef08a; line-height: 1.3; margin-bottom: 6px; }
    .sub { font-size: 17px; color: #fed7aa; margin-bottom: 15px; font-weight: 600; }
    .stars { font-size: 32px; color: #fbbf24; margin-bottom: 20px; letter-spacing: 4px; }
    
    .qr-box {
      background: white;
      border-radius: 28px;
      padding: 24px;
      display: inline-block;
      border: 6px solid #fbbf24;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      margin-bottom: 20px;
    }
    .qr-img { width: 280px; height: 280px; display: block; }
    .scan-hint { font-size: 18px; font-weight: 800; color: #991b1b; margin-top: 10px; }
    
    .footer-msg { font-size: 16px; font-weight: 700; color: #fef08a; margin-bottom: 8px; }
    .footer-contact { font-size: 14px; color: #ffffff; font-weight: 500; }
    
    @media print {
      body { background: white; padding: 0; }
      .print-btn-bar { display: none; }
      .card { box-shadow: none; max-width: 100%; border-radius: 20px; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="print-btn-bar">
    <button class="btn" onclick="window.print()">🖨️ กดพิมพ์ป้ายตั้งโต๊ะ (Print / PDF)</button>
    <a href="${REVIEW_URL}" target="_blank" style="text-decoration: none;">
      <button class="btn btn-gold">⭐ เปิดลิงก์รีวิว Google Maps</button>
    </a>
  </div>

  <div class="card">
    <div class="badge">👑 โต๊ะจีน รพีพัฒน์ (นครปฐม) 👑</div>
    <h1>สแกนเพื่อรีวิว &amp; ให้คะแนน 5 ดาว</h1>
    <div class="sub">บน Google Maps &amp; Google Search</div>
    <div class="stars">⭐⭐⭐⭐⭐</div>

    <div class="qr-box">
      <img class="qr-img" src="${qrDataUrl}" alt="QR Code รีวิว Google Maps โต๊ะจีนรพีพัฒน์">
      <div class="scan-hint">📷 ใช้กล้องมือถือส่องเพื่อรีวิวได้ทันที</div>
    </div>

    <div class="footer-msg">ขอบพระคุณทุกท่านที่ไว้วางใจให้เราดูแลมื้อสำคัญค่ะ</div>
    <div class="footer-contact">
      โทร: <strong>081-331-1646</strong> • LINE: <strong>pang_baichaa</strong> • <strong>www.rapeephat-catering.com</strong>
    </div>
  </div>
</body>
</html>`;

  const htmlPath = path.join(OUTPUT_DIR, 'Table_Tent_Google_Review_Printable.html');
  fs.writeFileSync(htmlPath, printableHtml, 'utf8');
  console.log('Generated:', htmlPath);
}

run().catch(console.error);
