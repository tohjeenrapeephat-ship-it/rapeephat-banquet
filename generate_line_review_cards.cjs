const fs = require('fs');
const path = require('path');
const QRCode = require('./frontend/node_modules/qrcode');

const REVIEW_URL = 'https://g.page/r/CX9Q5ttfJy6iEAE/review';
const OUTPUT_DIR = './frontend/public/images/reviews';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  // 1. Generate High-Res QR Data URL
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
  // 🌸 CARD 1: LINE SQUARE CARD (1080 x 1080 px) - ขอบคุณหลังจัดงานเสร็จ สไตล์คลีนโมเดิร์น
  // =========================================================================
  const squareLineCardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <filter id="shadowSquare" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
    <linearGradient id="redBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
  </defs>

  <!-- Clean Background -->
  <rect width="1080" height="1080" fill="#FFFDF9"/>
  <rect x="24" y="24" width="1032" height="1032" rx="36" fill="#FFFFFF" stroke="#FDE68A" stroke-width="4" filter="url(#shadowSquare)"/>

  <!-- Top Ribbon Badge -->
  <g transform="translate(540, 75)">
    <rect x="-240" y="-28" width="480" height="56" rx="28" fill="url(#redBadgeGrad)"/>
    <text x="0" y="8" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="22" font-weight="800" fill="#FFFFFF" text-anchor="middle">
      👑 โต๊ะจีน รพีพัฒน์ (นครปฐม)
    </text>
  </g>

  <!-- Thank You Message -->
  <text x="540" y="150" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="34" font-weight="900" fill="#78350F" text-anchor="middle">
    กราบขอบพระคุณเจ้าภาพและครอบครัวค่ะ 🙏✨
  </text>
  <text x="540" y="195" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="22" font-weight="600" fill="#4B5563" text-anchor="middle">
    ที่ไว้วางใจให้เราได้ดูแลอาหารมื้อสำคัญในวันนี้
  </text>

  <!-- Iconic Keyword: รีวิว 5 ดาว Google Maps -->
  <g transform="translate(540, 260)">
    <text x="-130" y="0" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="44" font-weight="900" fill="#111827">รีวิว</text>
    <g transform="translate(15, 0)" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="52" font-weight="900">
      <tspan fill="#EA4335">5 </tspan>
      <tspan fill="#4285F4">ด</tspan>
      <tspan fill="#34A853">า</tspan>
      <tspan fill="#FBBC05">ว</tspan>
    </g>
  </g>

  <!-- 5 Gold Stars & Google Maps Tag -->
  <g transform="translate(540, 310)">
    <text x="0" y="0" font-size="32" text-anchor="middle" fill="#FBBC05" letter-spacing="4">
      ⭐ ⭐ ⭐ ⭐ ⭐
    </text>
  </g>

  <!-- Google Maps Pin & Text Badge -->
  <g transform="translate(540, 360)">
    <rect x="-140" y="-22" width="280" height="44" rx="22" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <g transform="translate(-105, -16) scale(0.65)">
      <path d="M 25 5 C 15.6 5 8 12.6 8 22 C 8 26.5 9.8 30.5 12.8 33.5 L 25 47 L 37.2 33.5 C 40.2 30.5 42 26.5 42 22 C 42 12.6 34.4 5 25 5 Z" fill="#EA4335"/>
      <path d="M 8 22 C 8 27.5 10.8 32.3 15 35.2 L 25 47 L 25 22 Z" fill="#FBBC05"/>
      <path d="M 25 22 L 25 47 L 35 35.2 C 39.2 32.3 42 27.5 42 22 Z" fill="#34A853"/>
      <path d="M 25 5 C 34.4 5 42 12.6 42 22 L 25 22 Z" fill="#4285F4"/>
      <circle cx="25" cy="20" r="7" fill="#FFFFFF"/>
    </g>
    <text x="-70" y="7" font-family="'Product Sans', 'Prompt', sans-serif" font-size="24" font-weight="700" fill="#5F6368" text-anchor="start">
      Google Maps
    </text>
  </g>

  <!-- QR Code Container Box -->
  <rect x="310" y="405" width="460" height="460" rx="32" fill="#FFFFFF" stroke="#FDE68A" stroke-width="6" filter="url(#shadowSquare)"/>
  <image x="335" y="430" width="410" height="410" href="${qrDataUrl}" />

  <!-- Action Hint -->
  <text x="540" y="910" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="24" font-weight="800" fill="#B91C1C" text-anchor="middle">
    📷 ใช้กล้องมือถือ ส่อง QR Code เพื่อรีวิวได้ทันที
  </text>

  <!-- Bottom Message -->
  <text x="540" y="965" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="20" font-weight="700" fill="#1F2937" text-anchor="middle">
    ทุกคะแนนรีวิวคือกำลังใจอันล้ำค่าของทีมงานโต๊ะจีนรพีพัฒน์ค่ะ ❤️
  </text>
  <text x="540" y="1005" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="17" font-weight="500" fill="#64748B" text-anchor="middle">
    โทร: 081-331-1646 • LINE: pang_baichaa • www.rapeephat-catering.com
  </text>
</svg>
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'Card_LINE_Review_After_Event_Square.svg'), squareLineCardSvg, 'utf8');
  console.log('Generated: Card_LINE_Review_After_Event_Square.svg');

  // =========================================================================
  // 🌺 CARD 2: LINE PORTRAIT STORY CARD (1080 x 1440 px) - การ์ดทรงตั้งแนวหรูหรา
  // =========================================================================
  const portraitLineCardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440" width="1080" height="1440">
  <defs>
    <filter id="shadowPort" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.1"/>
    </filter>
    <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>

  <rect width="1080" height="1440" fill="#FFFDF9"/>
  <rect x="36" y="36" width="1008" height="1368" rx="44" fill="#FFFFFF" stroke="#FDE68A" stroke-width="4" filter="url(#shadowPort)"/>

  <!-- Top Logo & Brand -->
  <g transform="translate(540, 110)">
    <rect x="-260" y="-36" width="520" height="72" rx="36" fill="#B91C1C"/>
    <text x="0" y="10" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">
      👑 โต๊ะจีน รพีพัฒน์ (นครปฐม)
    </text>
  </g>

  <text x="540" y="210" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="40" font-weight="900" fill="url(#goldTextGrad)" text-anchor="middle">
    กราบขอบพระคุณท่านเจ้าภาพค่ะ 🙏✨
  </text>
  <text x="540" y="260" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="24" font-weight="600" fill="#4B5563" text-anchor="middle">
    ขอขอบคุณที่ไว้วางใจให้โต๊ะจีนรพีพัฒน์ดูแลมื้อสำคัญในงานเลี้ยงวันนี้
  </text>

  <!-- Divider -->
  <line x1="200" y1="300" x2="880" y2="300" stroke="#FDE68A" stroke-width="2" />

  <!-- KEYWORD: รีวิว 5 ดาว Google Maps -->
  <text x="540" y="380" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="64" font-weight="900" fill="#111827" text-anchor="middle">
    รีวิว
  </text>

  <g transform="translate(540, 480)" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="96" font-weight="900" text-anchor="middle">
    <tspan fill="#EA4335" dx="-70">5 </tspan>
    <tspan fill="#4285F4">ด</tspan>
    <tspan fill="#34A853">า</tspan>
    <tspan fill="#FBBC05">ว</tspan>
  </g>

  <!-- 5 Gold Stars -->
  <g transform="translate(540, 545)">
    <text x="0" y="0" font-size="44" text-anchor="middle" fill="#FBBC05" letter-spacing="6">
      ⭐ ⭐ ⭐ ⭐ ⭐
    </text>
  </g>

  <!-- Google Maps Badge -->
  <g transform="translate(540, 615)">
    <rect x="-160" y="-24" width="320" height="48" rx="24" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <g transform="translate(-120, -18) scale(0.7)">
      <path d="M 25 5 C 15.6 5 8 12.6 8 22 C 8 26.5 9.8 30.5 12.8 33.5 L 25 47 L 37.2 33.5 C 40.2 30.5 42 26.5 42 22 C 42 12.6 34.4 5 25 5 Z" fill="#EA4335"/>
      <path d="M 8 22 C 8 27.5 10.8 32.3 15 35.2 L 25 47 L 25 22 Z" fill="#FBBC05"/>
      <path d="M 25 22 L 25 47 L 35 35.2 C 39.2 32.3 42 27.5 42 22 Z" fill="#34A853"/>
      <path d="M 25 5 C 34.4 5 42 12.6 42 22 L 25 22 Z" fill="#4285F4"/>
      <circle cx="25" cy="20" r="7" fill="#FFFFFF"/>
    </g>
    <text x="-80" y="9" font-family="'Product Sans', 'Prompt', sans-serif" font-size="28" font-weight="700" fill="#5F6368" text-anchor="start">
      Google Maps
    </text>
  </g>

  <!-- QR Frame -->
  <rect x="270" y="680" width="540" height="540" rx="36" fill="#FFFFFF" stroke="#FDE68A" stroke-width="6" filter="url(#shadowPort)"/>
  <image x="300" y="710" width="480" height="480" href="${qrDataUrl}" />

  <!-- Action Hint -->
  <text x="540" y="1265" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="28" font-weight="800" fill="#B91C1C" text-anchor="middle">
    📷 ใช้กล้องมือถือ ส่อง QR Code เพื่อรีวิวได้ทันที
  </text>

  <!-- Footer Thank You -->
  <text x="540" y="1320" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="22" font-weight="700" fill="#1F2937" text-anchor="middle">
    ทุกคำติชมและคะแนนรีวิว คือกำลังใจอันล้ำค่าของพวกเราค่ะ ❤️
  </text>
  <text x="540" y="1360" font-family="'Prompt', 'Sarabun', 'Arial', sans-serif" font-size="19" font-weight="500" fill="#64748B" text-anchor="middle">
    โทร: 081-331-1646  •  LINE: pang_baichaa  •  www.rapeephat-catering.com
  </text>
</svg>
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'Card_LINE_Review_After_Event_Portrait.svg'), portraitLineCardSvg, 'utf8');
  console.log('Generated: Card_LINE_Review_After_Event_Portrait.svg');
}

run().catch(console.error);
