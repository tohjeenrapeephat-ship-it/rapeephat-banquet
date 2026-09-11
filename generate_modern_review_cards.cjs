const fs = require('fs');
const path = require('path');
const QRCode = require('./frontend/node_modules/qrcode');

const REVIEW_URL = 'https://g.page/r/CX9Q5ttfJy6iEAE/review';
const OUTPUT_DIR = './frontend/public/images/reviews';
const DOWNLOADS_DIR = '/Users/pang/Downloads/ป้ายรีวิว_Google_Maps_โต๊ะจีนรพีพัฒน์';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateAll() {
  // 1. Generate Crisp High-Res QR Code Data URL
  const qrDataUrl = await QRCode.toDataURL(REVIEW_URL, {
    width: 900,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });

  // =========================================================================
  // 🎨 1. MODERN CLEAN WHITE CARD (ตรงตาม Reference 100% สไตล์ Google & มินิมอล)
  // =========================================================================
  const modernCleanSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440" width="1080" height="1440">
  <defs>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
    <filter id="qrShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
    <linearGradient id="headerBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
  </defs>

  <!-- Clean Minimalist Background with Soft Gradient Ring -->
  <rect width="1080" height="1440" fill="#F8FAFC"/>
  
  <!-- Outer Card Frame -->
  <rect x="40" y="40" width="1000" height="1360" rx="40" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="4" filter="url(#cardShadow)"/>

  <!-- Top Brand Banner -->
  <g transform="translate(540, 110)">
    <rect x="-260" y="-36" width="520" height="72" rx="36" fill="url(#headerBadgeGrad)" />
    <text x="0" y="10" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">
      👑 โต๊ะจีน รพีพัฒน์ (นครปฐม)
    </text>
  </g>

  <!-- KEYWORD 1: "รีวิว" (Bold Modern Black) -->
  <text x="540" y="245" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="76" font-weight="900" fill="#111827" text-anchor="middle" letter-spacing="1">
    รีวิว
  </text>

  <!-- KEYWORD 2: "5 ดาว" (Google 4 Colors: Red, Blue, Green, Yellow) -->
  <g transform="translate(540, 375)" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="115" font-weight="900" text-anchor="middle">
    <tspan fill="#EA4335" dx="-80">5 </tspan>
    <tspan fill="#4285F4">ด</tspan>
    <tspan fill="#34A853">า</tspan>
    <tspan fill="#FBBC05">ว</tspan>
  </g>

  <!-- 5 Gold Stars Rating -->
  <g transform="translate(540, 445)">
    <text x="0" y="0" font-size="52" text-anchor="middle" fill="#FBBC05" letter-spacing="8">
      ⭐ ⭐ ⭐ ⭐ ⭐
    </text>
  </g>

  <!-- KEYWORD 3: Official Google Maps Pin & Text Logo -->
  <g transform="translate(540, 525)">
    <!-- Multi-color Google Maps Pin -->
    <g transform="translate(-160, -32) scale(0.9)">
      <!-- Red Top/Right -->
      <path d="M 25 5 C 15.6 5 8 12.6 8 22 C 8 26.5 9.8 30.5 12.8 33.5 L 25 47 L 37.2 33.5 C 40.2 30.5 42 26.5 42 22 C 42 12.6 34.4 5 25 5 Z" fill="#EA4335"/>
      <!-- Yellow Left Arc -->
      <path d="M 8 22 C 8 27.5 10.8 32.3 15 35.2 L 25 47 L 25 22 Z" fill="#FBBC05"/>
      <!-- Green Right Arc -->
      <path d="M 25 22 L 25 47 L 35 35.2 C 39.2 32.3 42 27.5 42 22 Z" fill="#34A853"/>
      <!-- Blue Top Section -->
      <path d="M 25 5 C 34.4 5 42 12.6 42 22 L 25 22 Z" fill="#4285F4"/>
      <!-- White Center Circle -->
      <circle cx="25" cy="20" r="7.5" fill="#FFFFFF"/>
    </g>
    <!-- Google Maps Typography -->
    <text x="-105" y="6" font-family="'Product Sans', 'Prompt', sans-serif" font-size="46" font-weight="700" fill="#5F6368" text-anchor="start">
      Google Maps
    </text>
  </g>

  <!-- Clean QR Code Container Frame with Soft Gold Border -->
  <rect x="250" y="600" width="580" height="580" rx="36" fill="#FFFFFF" stroke="#FDE68A" stroke-width="6" filter="url(#qrShadow)"/>

  <!-- Crisp 100% Unobstructed QR Code -->
  <image x="280" y="630" width="520" height="520" href="${qrDataUrl}" />

  <!-- Action Instruction Under QR -->
  <text x="540" y="1235" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="28" font-weight="800" fill="#991B1B" text-anchor="middle">
    📷 ใช้กล้องมือถือ ส่อง QR Code เพื่อให้คะแนน 5 ดาว
  </text>

  <!-- Divider Line -->
  <line x1="160" y1="1275" x2="920" y2="1275" stroke="#E2E8F0" stroke-width="2" />

  <!-- Footer Contact & Slogan -->
  <text x="540" y="1320" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="22" font-weight="700" fill="#1F2937" text-anchor="middle">
    ขอบพระคุณทุกท่านที่ไว้วางใจให้โต๊ะจีนรพีพัฒน์ดูแลมื้อสำคัญค่ะ
  </text>
  <text x="540" y="1360" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="20" font-weight="500" fill="#64748B" text-anchor="middle">
    โทร: 081-331-1646  •  LINE: pang_baichaa  •  www.rapeephat-catering.com
  </text>
</svg>
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'Google_Review_Modern_Clean_White.svg'), modernCleanSvg, 'utf8');
  console.log('Generated: Google_Review_Modern_Clean_White.svg');

  // =========================================================================
  // 🎨 2. LUXURY RED & GOLD CARD (หรูหรา ธีมโต๊ะจีนพรีเมียม 35 ปี)
  // =========================================================================
  const luxuryRedGoldSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440" width="1080" height="1440">
  <defs>
    <linearGradient id="luxBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7f1d1d"/>
      <stop offset="40%" stop-color="#991b1b"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </linearGradient>
    <linearGradient id="luxGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="luxShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <rect width="1080" height="1440" fill="url(#luxBg)"/>
  
  <!-- Outer Gold Borders -->
  <rect x="30" y="30" width="1020" height="1380" rx="36" fill="none" stroke="url(#luxGold)" stroke-width="6"/>
  <rect x="42" y="42" width="996" height="1356" rx="28" fill="none" stroke="#fef08a" stroke-width="2" stroke-dasharray="8,6"/>

  <!-- Top Brand Badge -->
  <g transform="translate(540, 110)">
    <rect x="-280" y="-38" width="560" height="76" rx="38" fill="#fef3c7" stroke="url(#luxGold)" stroke-width="4" filter="url(#luxShadow)"/>
    <text x="0" y="11" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="28" font-weight="900" fill="#78350f" text-anchor="middle">
      👑 โต๊ะจีน รพีพัฒน์ พรีเมียม 35+ ปี 👑
    </text>
  </g>

  <!-- KEYWORD 1: "รีวิว" -->
  <text x="540" y="235" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="68" font-weight="900" fill="#FEF08A" text-anchor="middle">
    รีวิว
  </text>

  <!-- KEYWORD 2: "5 ดาว" (Google 4 Colors) -->
  <g transform="translate(540, 360)" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="110" font-weight="900" text-anchor="middle">
    <tspan fill="#EA4335" dx="-80">5 </tspan>
    <tspan fill="#4285F4">ด</tspan>
    <tspan fill="#34A853">า</tspan>
    <tspan fill="#FBBC05">ว</tspan>
  </g>

  <!-- 5 Stars -->
  <g transform="translate(540, 425)">
    <text x="0" y="0" font-size="48" text-anchor="middle" fill="#FBBC05" letter-spacing="6">
      ⭐ ⭐ ⭐ ⭐ ⭐
    </text>
  </g>

  <!-- Google Maps Badge in White Pill -->
  <g transform="translate(540, 495)">
    <rect x="-180" y="-28" width="360" height="56" rx="28" fill="#FFFFFF" filter="url(#luxShadow)"/>
    <!-- Pin -->
    <g transform="translate(-130, -22) scale(0.8)">
      <path d="M 25 5 C 15.6 5 8 12.6 8 22 C 8 26.5 9.8 30.5 12.8 33.5 L 25 47 L 37.2 33.5 C 40.2 30.5 42 26.5 42 22 C 42 12.6 34.4 5 25 5 Z" fill="#EA4335"/>
      <path d="M 8 22 C 8 27.5 10.8 32.3 15 35.2 L 25 47 L 25 22 Z" fill="#FBBC05"/>
      <path d="M 25 22 L 25 47 L 35 35.2 C 39.2 32.3 42 27.5 42 22 Z" fill="#34A853"/>
      <path d="M 25 5 C 34.4 5 42 12.6 42 22 L 25 22 Z" fill="#4285F4"/>
      <circle cx="25" cy="20" r="7" fill="#FFFFFF"/>
    </g>
    <text x="-85" y="8" font-family="'Product Sans', 'Prompt', sans-serif" font-size="34" font-weight="700" fill="#3C4043" text-anchor="start">
      Google Maps
    </text>
  </g>

  <!-- Center White Card for QR Code -->
  <rect x="250" y="565" width="580" height="590" rx="36" fill="#FFFFFF" stroke="url(#luxGold)" stroke-width="8" filter="url(#luxShadow)"/>
  <image x="280" y="595" width="520" height="520" href="${qrDataUrl}" />

  <!-- Scan Prompt -->
  <text x="540" y="1215" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="28" font-weight="800" fill="#FEF08A" text-anchor="middle">
    📷 ใช้กล้องมือถือ ส่อง QR Code เพื่อรีวิวได้ทันที
  </text>

  <text x="540" y="1295" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="24" font-weight="700" fill="#FFFFFF" text-anchor="middle">
    ขอบพระคุณทุกท่านที่ร่วมแบ่งปันความประทับใจค่ะ
  </text>
  <text x="540" y="1340" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="20" font-weight="500" fill="#FED7AA" text-anchor="middle">
    โทร: 081-331-1646  •  LINE: pang_baichaa  •  www.rapeephat-catering.com
  </text>
</svg>
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'Google_Review_Luxury_Red_Gold.svg'), luxuryRedGoldSvg, 'utf8');
  console.log('Generated: Google_Review_Luxury_Red_Gold.svg');

  // =========================================================================
  // 🎨 3. SQUARE SOCIAL POST CARD (1080 x 1080 px สำหรับส่ง LINE & Facebook)
  // =========================================================================
  const squareCleanSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <filter id="sqShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000000" flood-opacity="0.1"/>
    </filter>
  </defs>

  <rect width="1080" height="1080" fill="#FFFFFF"/>
  <rect x="24" y="24" width="1032" height="1032" rx="36" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="4"/>

  <!-- Top Title -->
  <text x="540" y="80" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="26" font-weight="800" fill="#B91C1C" text-anchor="middle">
    👑 โต๊ะจีน รพีพัฒน์ (นครปฐม)
  </text>

  <text x="540" y="150" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="54" font-weight="900" fill="#111827" text-anchor="middle">
    รีวิว
  </text>

  <!-- 5 ดาว in Google 4 Colors -->
  <g transform="translate(540, 245)" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="80" font-weight="900" text-anchor="middle">
    <tspan fill="#EA4335" dx="-60">5 </tspan>
    <tspan fill="#4285F4">ด</tspan>
    <tspan fill="#34A853">า</tspan>
    <tspan fill="#FBBC05">ว</tspan>
  </g>

  <!-- 5 Stars -->
  <g transform="translate(540, 295)">
    <text x="0" y="0" font-size="38" text-anchor="middle" fill="#FBBC05" letter-spacing="4">
      ⭐ ⭐ ⭐ ⭐ ⭐
    </text>
  </g>

  <!-- Google Maps Pin + Text -->
  <g transform="translate(540, 350)">
    <g transform="translate(-130, -26) scale(0.75)">
      <path d="M 25 5 C 15.6 5 8 12.6 8 22 C 8 26.5 9.8 30.5 12.8 33.5 L 25 47 L 37.2 33.5 C 40.2 30.5 42 26.5 42 22 C 42 12.6 34.4 5 25 5 Z" fill="#EA4335"/>
      <path d="M 8 22 C 8 27.5 10.8 32.3 15 35.2 L 25 47 L 25 22 Z" fill="#FBBC05"/>
      <path d="M 25 22 L 25 47 L 35 35.2 C 39.2 32.3 42 27.5 42 22 Z" fill="#34A853"/>
      <path d="M 25 5 C 34.4 5 42 12.6 42 22 L 25 22 Z" fill="#4285F4"/>
      <circle cx="25" cy="20" r="7" fill="#FFFFFF"/>
    </g>
    <text x="-90" y="4" font-family="'Product Sans', 'Prompt', sans-serif" font-size="36" font-weight="700" fill="#5F6368" text-anchor="start">
      Google Maps
    </text>
  </g>

  <!-- Center QR Container -->
  <rect x="290" y="400" width="500" height="500" rx="28" fill="#FFFFFF" stroke="#FDE68A" stroke-width="4" filter="url(#sqShadow)"/>
  <image x="315" y="425" width="450" height="450" href="${qrDataUrl}" />

  <!-- Bottom CTA -->
  <text x="540" y="945" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="24" font-weight="800" fill="#991B1B" text-anchor="middle">
    📷 สแกนด้วยกล้องมือถือ เพื่อให้คะแนน 5 ดาว
  </text>
  <text x="540" y="995" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="18" font-weight="600" fill="#64748B" text-anchor="middle">
    ขอบพระคุณทุกท่านค่ะ • โทร 081-331-1646 • LINE: pang_baichaa
  </text>
</svg>
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'Google_Review_Modern_Square_1080.svg'), squareCleanSvg, 'utf8');
  console.log('Generated: Google_Review_Modern_Square_1080.svg');

  // =========================================================================
  // 🖨️ 4. STANDALONE PRINTABLE HTML (1-CLICK PRINT / SAVE TO PDF)
  // =========================================================================
  const interactiveHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ป้ายรีวิว 5 ดาว Google Maps - โต๊ะจีนรพีพัฒน์</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Prompt', sans-serif; }
    body { background: #0f172a; display: flex; flex-direction: column; align-items: center; padding: 30px 15px; min-height: 100vh; }
    
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-bottom: 25px;
    }
    .btn {
      padding: 12px 24px;
      border-radius: 14px;
      font-weight: 800;
      font-size: 15px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .btn-red { background: #dc2626; color: white; }
    .btn-red:hover { background: #b91c1c; transform: translateY(-2px); }
    .btn-google { background: white; color: #1e293b; }
    .btn-google:hover { background: #f8fafc; transform: translateY(-2px); }
    
    .card-container {
      width: 100%;
      max-width: 580px;
      background: white;
      border-radius: 36px;
      padding: 40px 30px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4);
      border: 4px solid #fef08a;
      text-align: center;
    }
    
    .brand-badge {
      display: inline-block;
      background: #b91c1c;
      color: white;
      padding: 8px 24px;
      border-radius: 30px;
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 16px;
      box-shadow: 0 4px 10px rgba(185,28,28,0.25);
    }
    
    .title-review {
      font-size: 48px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.1;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }
    
    .google-5star {
      font-size: 64px;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .c-red { color: #EA4335; }
    .c-blue { color: #4285F4; }
    .c-green { color: #34A853; }
    .c-yellow { color: #FBBC05; }
    
    .stars-row {
      font-size: 32px;
      color: #FBBC05;
      margin-bottom: 12px;
      letter-spacing: 4px;
    }
    
    .google-maps-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 20px;
      border-radius: 20px;
      font-size: 22px;
      font-weight: 700;
      color: #5f6368;
      margin-bottom: 24px;
    }
    .google-pin {
      width: 26px;
      height: 26px;
    }
    
    .qr-frame {
      background: white;
      border-radius: 28px;
      padding: 20px;
      display: inline-block;
      border: 4px solid #fef08a;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      margin-bottom: 16px;
    }
    .qr-img {
      width: 260px;
      height: 260px;
      display: block;
    }
    
    .scan-guide {
      font-size: 18px;
      font-weight: 800;
      color: #b91c1c;
      margin-bottom: 16px;
    }
    
    .divider {
      height: 1px;
      background: #e2e8f0;
      margin: 16px 0;
    }
    
    .footer-note {
      font-size: 14px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 4px;
    }
    .footer-contact {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    @media print {
      body { background: white; padding: 0; }
      .toolbar { display: none; }
      .card-container { box-shadow: none; border: 2px solid #cbd5e1; max-width: 100%; border-radius: 20px; }
    }
  </style>
</head>
<body>

  <div class="toolbar">
    <button class="btn btn-red" onclick="window.print()">🖨️ กดพิมพ์ป้ายตั้งโต๊ะ (Print / PDF)</button>
    <a href="${REVIEW_URL}" target="_blank" class="btn btn-google">
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      <span>⭐ เปิดหน้ารีวิว Google Maps</span>
    </a>
  </div>

  <div class="card-container">
    <div class="brand-badge">👑 โต๊ะจีน รพีพัฒน์ (นครปฐม)</div>
    
    <div class="title-review">รีวิว</div>
    
    <div class="google-5star">
      <span class="c-red">5</span>
      <span class="c-blue">ด</span>
      <span class="c-green">า</span>
      <span class="c-yellow">ว</span>
    </div>
    
    <div class="stars-row">⭐ ⭐ ⭐ ⭐ ⭐</div>
    
    <div class="google-maps-badge">
      <svg class="google-pin" viewBox="0 0 50 50">
        <path d="M 25 5 C 15.6 5 8 12.6 8 22 C 8 26.5 9.8 30.5 12.8 33.5 L 25 47 L 37.2 33.5 C 40.2 30.5 42 26.5 42 22 C 42 12.6 34.4 5 25 5 Z" fill="#EA4335"/>
        <path d="M 8 22 C 8 27.5 10.8 32.3 15 35.2 L 25 47 L 25 22 Z" fill="#FBBC05"/>
        <path d="M 25 22 L 25 47 L 35 35.2 C 39.2 32.3 42 27.5 42 22 Z" fill="#34A853"/>
        <path d="M 25 5 C 34.4 5 42 12.6 42 22 L 25 22 Z" fill="#4285F4"/>
        <circle cx="25" cy="20" r="7.5" fill="#FFFFFF"/>
      </svg>
      <span>Google Maps</span>
    </div>

    <div>
      <div class="qr-frame">
        <img class="qr-img" src="${qrDataUrl}" alt="QR Code รีวิว Google Maps">
      </div>
    </div>

    <div class="scan-guide">📷 ใช้กล้องมือถือ ส่อง QR Code เพื่อให้คะแนน 5 ดาว</div>

    <div class="divider"></div>

    <div class="footer-note">ขอบพระคุณทุกท่านที่ไว้วางใจให้โต๊ะจีนรพีพัฒน์ดูแลมื้อสำคัญค่ะ</div>
    <div class="footer-contact">
      โทร: <strong>081-331-1646</strong> • LINE: <strong>pang_baichaa</strong> • <strong>www.rapeephat-catering.com</strong>
    </div>
  </div>

</body>
</html>
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'Google_Review_Modern_Clean_Printable.html'), interactiveHtml, 'utf8');
  console.log('Generated: Google_Review_Modern_Clean_Printable.html');
}

generateAll().catch(console.error);
