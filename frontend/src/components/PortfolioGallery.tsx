import React, { useState, useEffect, useRef } from 'react';
import { WatermarkOverlay } from './WatermarkOverlay';
import {
  Camera,
  Sparkles,
  CheckCircle,
  Eye,
  X,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  FolderHeart,
  Palette,
  MapPin,
  Maximize2,
  Layers,
  Check
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  locationType: 'outdoor' | 'indoor' | 'vip_details' | 'mega_banquet';
  locationTypeName: string;
  bowColorName: string;
  colorTheme: 'purple' | 'gold' | 'pink' | 'blue' | 'green' | 'red' | 'multi' | 'mega_750';
  colorThemeName: string;
  colorDotClass: string;
  image: string;
  tag: string;
  description: string;
  highlights: string[];
  tableType: string;
  location: string;
}

interface MasterColorTheme {
  id: 'purple' | 'gold' | 'pink' | 'blue' | 'green' | 'red' | 'multi' | 'mega_750';
  name: string;
  shortName: string;
  iconEmoji: string;
  tagline: string;
  description: string;
  coverImage: string;
  accentBg: string;
  borderAccent: string;
  badgeBg: string;
  textAccent: string;
  ringClass: string;
}

const MASTER_COLOR_THEMES: MasterColorTheme[] = [
  
  {
    id: 'purple',
    name: 'ธีมสีม่วง (Royal Purple Theme)',
    shortName: 'ธีมสีม่วง',
    iconEmoji: '🟣',
    tagline: 'หรูหรา สง่างาม ภูมิฐานระดับจักรพรรดิ',
    description: 'รวมภาพการจัดเลี้ยงโต๊ะจีนธีมสีม่วงพรีเมียม ในศูนย์การประชุม แชนเดอเรียหรู สนามกีฬาอินดอร์สเตเดียม 300+ โต๊ะ และเซ็ตโต๊ะ VIP ดอกกุหลาบขาว',
    coverImage: '/images/portfolio/work-purple-stadium-arena-mega-scale.jpg',
    accentBg: 'from-purple-900/90 via-purple-800/80 to-slate-950',
    borderAccent: 'border-purple-400',
    badgeBg: 'bg-purple-600 text-white',
    textAccent: 'text-purple-700',
    ringClass: 'ring-purple-400',
  },
  {
    id: 'gold',
    name: 'ธีมสีทอง (Imperial Gold Theme)',
    shortName: 'ธีมสีทอง',
    iconEmoji: '👑',
    tagline: 'สิริมงคล อร่ามตา หรูหราคลาสสิก',
    description: 'รวมภาพการจัดเลี้ยงโต๊ะจีนธีมสีทองและสีเหลืองมงคล โบว์ทองซาตินปีกผีเสื้อ ผังสมมาตรทิวปาล์ม ผังเต็นท์โดม 50+ โต๊ะ ผังกลางแจ้ง และคอนเสิร์ต 100+ โต๊ะ',
    coverImage: '/images/portfolio/work-gold-symmetrical-perspective-palm.jpg',
    accentBg: 'from-amber-900/90 via-amber-700/80 to-slate-950',
    borderAccent: 'border-amber-400',
    badgeBg: 'bg-amber-500 text-slate-950 font-black',
    textAccent: 'text-amber-700',
    ringClass: 'ring-amber-400',
  },
  {
    id: 'pink',
    name: 'ธีมสีชมพู (Sweet Pink Theme)',
    shortName: 'ธีมสีชมพู',
    iconEmoji: '🌸',
    tagline: 'หวานละมุน อบอุ่น โรแมนติกน่าประทับใจ',
    description: 'รวมภาพการจัดเลี้ยงโต๊ะจีนธีมสีชมพูหวาน โบว์ชมพูซาตินและพาสเทล เซ็ต VIP ห่วงทองไข่มุก ผังโดมวิวอุโบสถ และงานแต่งงาน Sunset 50+ โต๊ะ',
    coverImage: '/images/portfolio/work-pink-dome-perspective.jpg',
    accentBg: 'from-pink-900/90 via-rose-800/80 to-slate-950',
    borderAccent: 'border-pink-400',
    badgeBg: 'bg-pink-600 text-white',
    textAccent: 'text-pink-700',
    ringClass: 'ring-pink-400',
  },
  {
    id: 'blue',
    name: 'ธีมสีฟ้า (Ocean Blue Theme)',
    shortName: 'ธีมสีฟ้า',
    iconEmoji: '💙',
    tagline: 'สดใส มีชีวิตชีวา รอยัลบลู & ฟ้าครามสดชื่น',
    description: 'รวมภาพการจัดเลี้ยงโต๊ะจีนธีมสีฟ้าและสีน้ำเงินรอยัลบลู ผังคอนเสิร์ต 100+ โต๊ะ เซ็ต VIP แจกันไฮเดรนเยีย และพรมแดงนำเข้าสู่เวที',
    coverImage: '/images/portfolio/work-blue-turquoise-concert-100tables.jpg',
    accentBg: 'from-blue-900/90 via-sky-800/80 to-slate-950',
    borderAccent: 'border-sky-400',
    badgeBg: 'bg-sky-600 text-white',
    textAccent: 'text-sky-700',
    ringClass: 'ring-sky-400',
  },
  {
    id: 'green',
    name: 'ธีมสีเขียว (Emerald Green Theme)',
    shortName: 'ธีมสีเขียว',
    iconEmoji: '🌿',
    tagline: 'ร่มรื่น สดชื่น เอกลักษณ์ระดับคฤหาสน์หรู 5 ดาว',
    description: 'รวมภาพการจัดเลี้ยงโต๊ะจีนธีมสีเขียวมรกต โต๊ะยาว Long Table ในสวนสนามหญ้า โบว์ซาตินเขียวพรีเมียม กรงนกทองดอกไม้สด และงานเลี้ยง Sunset ไฟประดับ',
    coverImage: '/images/portfolio/work-green-emerald-long-vip-table-lawn.jpg',
    accentBg: 'from-emerald-950/95 via-emerald-800/85 to-slate-950',
    borderAccent: 'border-emerald-400',
    badgeBg: 'bg-emerald-600 text-white',
    textAccent: 'text-emerald-700',
    ringClass: 'ring-emerald-400',
  },
  {
    id: 'mega_750',
    name: 'จัดเลี้ยง 750 โต๊ะ (ภาพมุมสูงโดรน 4K)',
    shortName: 'จัดเลี้ยง 750 โต๊ะ',
    iconEmoji: '🚁',
    tagline: 'ศักยภาพสูงสุด จัดงานได้ถึง 750 โต๊ะ/วัน (7,500+ แขก)',
    description: 'รวมภาพถ่ายมุมสูงจากโดรน 4K และผลงานจัดเลี้ยงระดับมหกรรม 50 - 750 โต๊ะ ครัวสนาม 30 สถานี ขบวนรถกว่า 30 คัน เสิร์ฟร้อน สด สะอาด พร้อมกัน 100%',
    coverImage: '/images/portfolio/work-mega-750tables-drone-grand-flagship.jpg',
    accentBg: 'from-blue-950 via-slate-900 to-amber-950',
    borderAccent: 'border-amber-400',
    badgeBg: 'bg-gradient-to-r from-red-600 to-amber-600 text-white font-black',
    textAccent: 'text-amber-500',
    ringClass: 'ring-amber-400',
  },
];

const PORTFOLIO_DATA: PortfolioItem[] = [
  // 💜 THEME PURPLE (ผลงานจริงธีมสีม่วงระดับมหกรรม 300+ โต๊ะ & ศูนย์ประชุม)
    {
    id: 'purple-grand-ballroom-entrance-perspective',
    title: 'ทางเข้าห้องแกรนด์บอลรูม & ขบวนโต๊ะจีนธีมสีม่วงทอดยาวจรดเวที',
    category: 'ผังทางเดินห้องบอลรูม (Ballroom Walkway)',
    locationType: 'indoor',
    locationTypeName: '🏛️ ห้องแกรนด์บอลรูม',
    bowColorName: 'ผ้าปูสีม่วง & เก้าอี้คลุมขาว',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-grand-ballroom-entrance-perspective.jpg',
    tag: '🏛️ ทางเข้าห้องบอลรูม 💜',
    description: 'มุมมองจากประตูทางเข้าห้องแกรนด์บอลรูม มองเห็นแนวทางเดินกลางทอดยาวไปยังเวทีประธาน ขนาบข้างด้วยโต๊ะจีนธีมสีม่วงและเก้าอี้คลุมขาวอย่างโอ่อ่า',
    highlights: [
      'ผังจัดวางทางเดินกลางกว้างขวาง สมเกียรติงานเลี้ยงประธาน',
      'โต๊ะจีนผ้าปูสีม่วงสดใสตัดกับเก้าอี้ขาวสะอาดตา',
      'ดอกไม้สดประดับกลางโต๊ะทุกจุดสวยงามสมบูรณ์แบบ',
      'รองรับงานเลี้ยงในโรงแรมและศูนย์ประชุมระดับพรีเมียม'
    ],
    tableType: '100 - 250 โต๊ะ',
    location: 'ห้องแกรนด์บอลรูม & ศูนย์ประชุมระดับ 5 ดาว',
  },
  {
    id: 'purple-ballroom-chairs-glassware-perspective',
    title: 'บรรยากาศโต๊ะจีนธีมสีม่วง & แก้วน้ำคริสตัลขัดเงา',
    category: 'บรรยากาศในห้องจัดเลี้ยง (Atmosphere)',
    locationType: 'indoor',
    locationTypeName: '🏛️ ห้องจัดเลี้ยงพรีเมียม',
    bowColorName: 'ผ้าปูสีม่วง & เก้าอี้คลุมขาว',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-ballroom-chairs-glassware-perspective.jpg',
    tag: '💎 บรรยากาศพรีเมียม 💜',
    description: 'ทัศนียภาพความประณีตของโต๊ะจีนธีมสีม่วง เก้าอี้คลุมผ้าขาวทรงเรียบหรู แก้วน้ำคริสตัลใสประกาย และผ้าเช็ดปากจัดวางพร้อมต้อนรับแขกคนสำคัญ',
    highlights: [
      'แก้วไวน์และแก้วน้ำคริสตัลใสสะอาด ไร้คราบน้ำ 100%',
      'เก้าอี้คลุมผ้าขาวสะอาด ทรงสวย เรียบร้อยทุกตัว',
      'แจกันดอกไม้สดโทนขาว-เขียวประดับกลางโต๊ะอย่างลงตัว',
      'ความพร้อมจัดเลี้ยงระดับภัตตาคาร 35 ปี'
    ],
    tableType: '50 - 200 โต๊ะ',
    location: 'ห้องจัดเลี้ยงพรีเมียม & งานมงคลสมรส',
  },
  {
    id: 'purple-ballroom-white-rose',
    title: 'โต๊ะจีน VIP ธีมสีม่วง & แจกันดอกกุหลาบขาวกลางโต๊ะ',
    category: 'เซ็ตโต๊ะ VIP ในห้องประชุม',
    locationType: 'indoor',
    locationTypeName: '🏛️ ห้องประชุม & ศูนย์จัดเลี้ยง',
    bowColorName: 'ผ้าปูโต๊ะสีม่วง & เก้าอี้คลุมขาว',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-ballroom-white-rose-centerpiece.jpg',
    tag: '👑 โต๊ะ VIP ดอกกุหลาบขาว 💜',
    description: 'โต๊ะจีนผ้าปูสีม่วงสดใส เก้าอี้คลุมขาวเรียบหรู พร้อมแจกันดอกกุหลาบขาวประดับกลางโต๊ะ ชุดจานชามเมลามีน แก้วน้ำคริสตัล และผ้าเช็ดปากพับทรงนกยูงประณีต',
    highlights: [
      'ผ้าปูโต๊ะสีม่วงสดใสตัดกับผ้าคลุมเก้าอี้สีขาวบริสุทธิ์',
      'แจกันดอกกุหลาบขาวสดและดอกไม้ประดับกลางโต๊ะ',
      'จัดวางระยะห่างระหว่างเก้าอี้ได้มาตรฐาน นั่งสบาย',
      'อุปกรณ์ จานชาม แก้วน้ำ ช้อนส้อมขัดเงาสะอาด 100%'
    ],
    tableType: '50 - 300 โต๊ะ',
    location: 'ศูนย์ประชุม & หอประชุมใหญ่ระดับประเทศ',
  },
  {
    id: 'purple-stadium-arena-mega-scale',
    title: 'มหกรรมโต๊ะจีนธีมสีม่วง ในสนามกีฬาอินดอร์สเตเดียม 300+ โต๊ะ',
    category: 'มหกรรมจัดเลี้ยงในอาคาร (Mega Arena)',
    locationType: 'mega_banquet',
    locationTypeName: '🏟️ สนามกีฬาอินดอร์สเตเดียม',
    bowColorName: 'ผ้าปูโต๊ะสีม่วง & เก้าอี้คลุมขาว',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-stadium-arena-mega-scale.jpg',
    tag: '🏟️ อินดอร์สเตเดียม 300+ โต๊ะ 💜',
    description: 'มหกรรมจัดเลี้ยงโต๊ะจีนขนาดใหญ่พิเศษเต็มพื้นที่คอร์ทสนามกีฬาในร่ม แถวโต๊ะจีนสีม่วงเรียงรายนับร้อยโต๊ะสมมาตร รองรับงานเลี้ยงสังสรรค์ระดับพันคน',
    highlights: [
      'รองรับการจัดงานสเกลใหญ่ในสนามกีฬาในร่มและฮอลล์ขนาดใหญ่',
      'ผังจัดวางโต๊ะสมมาตร ทางเดินกว้าง เสิร์ฟคล่องตัว',
      'ระบบไฟส่องสว่างครอบคลุมทั่วถึงทุกโต๊ะอาหาร',
      'ทีมเสิร์ฟและผู้ประสานงานมืออาชีพกว่า 100 ชีวิต'
    ],
    tableType: '300 โต๊ะ (3,000 ที่นั่ง)',
    location: 'สนามกีฬาในร่มขนาดใหญ่ (Indoor Stadium Arena)',
  },
  {
    id: 'purple-convention-hall-chandelier',
    title: 'จัดเลี้ยงโต๊ะจีนธีมสีม่วง ในศูนย์การประชุม แชนเดอเรียคริสตัลหรู',
    category: 'งานเลี้ยงในศูนย์การประชุม',
    locationType: 'indoor',
    locationTypeName: '🏛️ ศูนย์การประชุมนานาชาติ',
    bowColorName: 'ผ้าปูโต๊ะสีม่วง & เก้าอี้คลุมขาว',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-convention-hall-chandelier.jpg',
    tag: '✨ แชนเดอเรียคริสตัลหรู 💜',
    description: 'บรรยากาศงานเลี้ยงกาล่าดินเนอร์ในศูนย์การประชุมนานาชาติ แชนเดอเรียสีทองอร่ามตา โต๊ะจีนผ้าปูสีม่วงตัดขาวอย่างภูมิฐาน เหมาะสำหรับงานองค์กรและงานมงคล',
    highlights: [
      'บรรยากาศหรูหรา ภูมิฐาน ภายใต้แสงไฟแชนเดอเรียสีทอง',
      'โต๊ะจีนผ้าปูสีม่วงเรียบหรู พร้อมแจกันดอกไม้สดทุกโต๊ะ',
      'เหมาะสำหรับงานเลี้ยงประจำปี งานเกษียณ และงานกาล่า',
      'เสิร์ฟอาหารร้อนสดใหม่จากครัวภัตตาคาร 100%'
    ],
    tableType: '100 - 300 โต๊ะ',
    location: 'ศูนย์การประชุมนานาชาติ & ห้องแกรนด์บอลรูม',
  },
  {
    id: 'purple-stadium-front-perspective',
    title: 'ทัศนียภาพแถวโต๊ะจีนธีมสีม่วง ในสนามกีฬาในร่มขนาดใหญ่',
    category: 'งานเลี้ยงในอินดอร์สเตเดียม',
    locationType: 'indoor',
    locationTypeName: '🏟️ สนามกีฬาในร่ม',
    bowColorName: 'ผ้าปูโต๊ะสีม่วง & เก้าอี้คลุมขาว',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-stadium-front-perspective.jpg',
    tag: '🎪 ผังโต๊ะสวยงามสมมาตร 💜',
    description: 'ทัศนียภาพมุมมองระดับสายตาของแถวโต๊ะจีนธีมสีม่วงในโรงยิมเนเซียม/อินดอร์สเตเดียม สะท้อนความเป็นระเบียบเรียบร้อยและความพร้อมระดับมืออาชีพ',
    highlights: [
      'จัดเรียงแนวโต๊ะตรงเป็นระเบียบสมบูรณ์แบบ',
      'แจกันดอกไม้ประดับกลางโต๊ะทุกจุดสวยงามเท่ากัน',
      'ทางเดินระหว่างแถวกว้างขวาง รองรับขบวนเปิดงาน',
      'บริการจัดเลี้ยงได้ทั้งในกรุงเทพฯ และต่างจังหวัดทั่วไทย'
    ],
    tableType: '200 โต๊ะ',
    location: 'อินดอร์สเตเดียม & อาคารยิมเนเซียม',
  },
  {
    id: 'purple-stadium-grandstand-high-angle',
    title: 'ภาพมุมสูงจากอัฒจันทร์: ผังโต๊ะจีนธีมสีม่วงเต็มลานกีฬาอินดอร์',
    category: 'ภาพมุมสูงจากอัฒจันทร์',
    locationType: 'indoor',
    locationTypeName: '🏟️ มุมสูงอัฒจันทร์สนามกีฬา',
    bowColorName: 'ผ้าปูโต๊ะสีม่วง & เก้าอี้คลุมขาว',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-stadium-grandstand-high-angle.jpg',
    tag: '📐 มุมสูงผังโต๊ะเต็มคอร์ท 💜',
    description: 'ภาพถ่ายมุมสูงจากอัฒจันทร์ผู้ชม แสดงความยิ่งใหญ่ของผังโต๊ะจีนธีมสีม่วงเต็มพื้นที่สนามแข่ง สะท้อนศักยภาพการจัดงานเลี้ยงระดับสเกลยักษ์',
    highlights: [
      'ภาพรวมมุมสูงเห็นผังโต๊ะจีนครบทุกแถวอย่างชัดเจน',
      'การจัดวางตำแหน่งโต๊ะเว้นระยะอย่างถูกต้องตามหลักความปลอดภัย',
      'โต๊ะจีนพร้อมชุดจานชามและแก้วน้ำพร้อมเปิดงานทันที',
      'การันตีคุณภาพและความประทับใจจากเจ้าภาพ 100%'
    ],
    tableType: '250 - 300 โต๊ะ',
    location: 'อัฒจันทร์สนามกีฬาในร่มขนาดใหญ่',
  },
  // 🚁 FLAGSHIP 750 TABLES DRONE AERIAL (ภาพถ่ายมุมสูงโดรน 4K 750 โต๊ะเต็มลาน)
  {
    id: 'mega-750tables-drone-grand-flagship',
    title: 'ภาพมุมสูงโดรน 4K: มหกรรมโต๊ะจีน 750 โต๊ะ เต็มลานอเนกประสงค์ระดับประเทศ',
    category: 'ภาพมุมสูงโดรน (Drone Aerial 4K)',
    locationType: 'mega_banquet',
    locationTypeName: 'มหาอภิมหาจัดเลี้ยง 750 โต๊ะ',
    bowColorName: 'ผ้าคลุมขาว โบว์ทอง-ส้มมงคล',
    colorTheme: 'mega_750',
    colorThemeName: 'จัดเลี้ยง 750 โต๊ะ',
    colorDotClass: 'bg-amber-500',
    image: '/images/portfolio/work-mega-750tables-drone-grand-flagship.jpg',
    tag: '🚁 ภาพถ่ายมุมสูงโดรน 750 โต๊ะจริง',
    description: 'ภาพถ่ายมุมสูงจากโดรน 4K แสดงการจัดผังโต๊ะจีน 750 โต๊ะเรียงรายอย่างเป็นระเบียบสมมาตร พร้อมเต็นท์ครัวหลวง เวทีการแสดง และกองทัพรถบริการจัดเลี้ยง ณ ลานกิจกรรมขนาดใหญ่',
    highlights: [
      'รองรับการจัดงานสเกลสูงสุด 750 โต๊ะต่อวัน (7,500+ แขก)',
      'ผังโต๊ะสมมาตร 4 โซน ทางเดินกว้างขวาง เสิร์ฟร้อนพร้อมกัน 100%',
      'ขบวนรถบริการและเต็นท์ครัวสนาม 30 สถานีมาตรฐานสากล',
      'แสงไฟเวทีและบรรยากาศยามเย็นสุดอลังการ'
    ],
    tableType: '750 โต๊ะ (7,500 ที่นั่ง)',
    location: 'ลานจัดเลี้ยงมหาชนระดับประเทศ',
  },
  // 🌟 MEGA BANQUET 750 TABLES & DRONE AERIAL (ผลงานจริงระดับประเทศ 750 โต๊ะ/วัน)
  {
    id: 'mega-750tables-aerial-drone-zones',
    title: 'ภาพมุมสูงโดรน 4K: ลานจัดเลี้ยงมหาอภิมหา 750 โต๊ะ (4 โซนสีมงคล)',
    category: 'ภาพมุมสูงโดรน (Drone Aerial)',
    locationType: 'mega_banquet',
    locationTypeName: 'มหาอภิมหาจัดเลี้ยง 750 โต๊ะ',
    bowColorName: 'โบว์หลากสี 4 โซนมงคล (แดง/ม่วง/เขียว/น้ำเงิน)',
    colorTheme: 'mega_750',
    colorThemeName: 'ธีมสีน้ำเงิน & หลากสี',
    colorDotClass: 'bg-blue-600',
    image: '/images/portfolio/work-mega-750tables-aerial-drone-zones.jpg',
    tag: '🚁 ภาพมุมสูงโดรน 750 โต๊ะ/วัน',
    description: 'ผังจัดเลี้ยงระดับประเทศ รองรับแขกกว่า 7,500 ท่าน จัดวางโต๊ะจีนมาตรฐานเป็นระเบียบเรียบร้อยเต็มลานกิจกรรม แบ่งโซนสีแดง ม่วง เขียว น้ำเงิน พร้อมเวทีและเสาไฟประดับอลังการ',
    highlights: [
      'รองรับการจัดงานสเกลสูงสุด 750 โต๊ะต่อวัน (7,500+ แขก)',
      'บริหารจัดการ 4 โซนสีมงคลชัดเจน ทางเดินกว้าง เสิร์ฟคล่องตัว',
      'ครัวสนามเคลื่อนที่ 30 สถานี ปรุงสุกสดใหม่หน้างาน 100%',
      'อุปกรณ์ จานชาม แก้วน้ำ ผ้าคลุมครบเซ็ตมาตรฐานภัตตาคาร 35 ปี'
    ],
    tableType: '750 โต๊ะ (7,500 ที่นั่ง)',
    location: 'ลานจัดเลี้ยงกลางแจ้งขนาดใหญ่ระดับประเทศ',
  },
  {
    id: 'mega-750tables-high-angle-overview',
    title: 'ทัศนียภาพพาโนรามามุมสูง: ขบวนโต๊ะจีนทอดยาวจรดเวทีใหญ่',
    category: 'ทัศนียภาพมุมสูง (High-Angle Overview)',
    locationType: 'mega_banquet',
    locationTypeName: 'มหาอภิมหาจัดเลี้ยง 750 โต๊ะ',
    bowColorName: 'โบว์น้ำเงินรอยัลบลูซาติน',
    colorTheme: 'mega_750',
    colorThemeName: 'ธีมสีน้ำเงิน',
    colorDotClass: 'bg-blue-600',
    image: '/images/portfolio/work-mega-750tables-high-angle-overview.jpg',
    tag: '🌟 พาโนรามามุมสูง 750 โต๊ะ',
    description: 'ขบวนโต๊ะจีนผ้าคลุมสีน้ำเงินตัดโบว์ขาวสะอาดตา ทอดยาวจรดเวทีใหญ่ด้านหน้า พร้อมระบบเสียงและแสงสว่างรองรับงานเลี้ยงสังสรรค์ยามค่ำคืน',
    highlights: [
      'ทัศนียภาพกว้างขวาง เห็นผังงานเลี้ยงทั้งระบบแบบ 360 องศา',
      'ทีมงานจัดวางผังโต๊ะได้สมมาตรและสวยงามระดับมืออาชีพ',
      'ระบบไฟประดับส่องสว่างทั่วถึงทุกโต๊ะอาหาร',
      'การันตีอาหารเสิร์ฟร้อนฉ่าพร้อมกันทุกโต๊ะ 100%'
    ],
    tableType: '500 - 750 โต๊ะ',
    location: 'ลานเวทีคอนเสิร์ต & มหกรรมจัดเลี้ยงกลางแจ้ง',
  },
  {
    id: 'mega-750tables-blue-arena-hydrangea',
    title: 'โซนรอยัลบลู & แจกันดอกไฮเดรนเยียสดประดับโต๊ะ',
    category: 'โต๊ะจีนกลางแจ้ง (Outdoor Setup)',
    locationType: 'outdoor',
    locationTypeName: 'ลานจัดเลี้ยงกลางแจ้ง',
    bowColorName: 'โบว์น้ำเงินรอยัลบลู & ดอกไฮเดรนเยีย',
    colorTheme: 'mega_750',
    colorThemeName: 'ธีมสีน้ำเงิน',
    colorDotClass: 'bg-blue-600',
    image: '/images/portfolio/work-mega-750tables-blue-arena-hydrangea.jpg',
    tag: '💙 โซนรอยัลบลู & ดอกไม้สด',
    description: 'การจัดวางโต๊ะจีนกลางแจ้งพร้อมแจกันดอกไฮเดรนเยียสีฟ้า-ขาว และชุดจานชามแก้วน้ำครบเซ็ตระดับภัตตาคาร 35 ปี',
    highlights: [
      'ผ้าปูโต๊ะสีน้ำเงินเข้มตัดกับผ้าคลุมเก้าอี้ขาว โบว์น้ำเงินซาติน',
      'แจกันดอกไฮเดรนเยียสดและกุหลาบขาวประดับกลางโต๊ะ',
      'ชุดจานชามเมลามีนและแก้วน้ำใสสะอาด 100%',
      'รองรับการจัดเลี้ยงตั้งแต่ 50 ถึง 750 โต๊ะ'
    ],
    tableType: '300 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้งไฟประดับ',
  },
  {
    id: 'mega-750tables-blue-lighting-tower',
    title: 'ขบวนแถวโต๊ะจีนสุดสายตา & เสาไฟบานสปอตไลต์',
    category: 'โต๊ะจีนกลางแจ้ง (Outdoor Setup)',
    locationType: 'outdoor',
    locationTypeName: 'ลานจัดเลี้ยงกลางแจ้ง',
    bowColorName: 'โบว์น้ำเงินซาตินพรีเมียม',
    colorTheme: 'mega_750',
    colorThemeName: 'ธีมสีน้ำเงิน',
    colorDotClass: 'bg-blue-600',
    image: '/images/portfolio/work-mega-750tables-blue-lighting-tower.jpg',
    tag: '⚡ ขบวนแถวโต๊ะจีนสุดสายตา',
    description: 'ขบวนแถวโต๊ะจีนจัดวางเว้นระยะทางเดินสะดวก เสิร์ฟอาหารร้อนได้รวดเร็วทันใจ พร้อมโครงสร้างเสาไฟส่องสว่างทั่วถึงทุกโต๊ะ',
    highlights: [
      'ระยะห่างระหว่างโต๊ะได้มาตรฐาน เดินสะดวก เสิร์ฟปลอดภัย',
      'โครงสร้างเสาไฟส่องสว่างครอบคลุมทุกตารางเมตร',
      'ทีมเสิร์ฟและผู้ประสานงานประจำจุดอย่างทั่วถึง',
      'ขบวนรถตู้ทึบควบคุมความเย็นจอดประจำการหลังครัวสนาม'
    ],
    tableType: '400 โต๊ะ',
    location: 'ลานจัดเลี้ยงเสาไฟประดับสายรุ้ง',
  },
  {
    id: 'mega-750tables-vip-gold-tableware',
    title: 'เซ็ตโต๊ะ VIP จานชามขอบทอง & แถวโต๊ะจีนทอดยาว',
    category: 'รายละเอียด VIP (VIP Tableware)',
    locationType: 'vip_details',
    locationTypeName: 'รายละเอียดอุปกรณ์ VIP',
    bowColorName: 'โบว์น้ำเงินซาติน & จานกังไสขอบทอง',
    colorTheme: 'mega_750',
    colorThemeName: 'ธีมสีน้ำเงิน',
    colorDotClass: 'bg-blue-600',
    image: '/images/portfolio/work-mega-750tables-vip-gold-tableware.jpg',
    tag: '👑 เซ็ต VIP จานขอบทอง',
    description: 'ชุดจานกังไสขอบทอง แก้วน้ำคริสตัล ช้อนส้อมสแตนเลสขัดเงา และดอกไม้สดประดับโต๊ะประธาน สวยงามสมเกียรติเจ้าภาพ',
    highlights: [
      'จานรองลายกังไสขอบทองอร่ามตา เพิ่มความหรูหรา',
      'แก้วไวน์และแก้วน้ำดื่มคริสตัลใสสะอาด ไร้คราบ',
      'ผ้าเช็ดปากพับทรงนกยูง/พัดสวยงามประณีต',
      'เหมาะสำหรับโต๊ะประธานและแขกผู้มีเกียรติระดับ VIP'
    ],
    tableType: 'VIP 50 โต๊ะ',
    location: 'โซนประธาน & แขก VIP มหาอภิมหาจัดเลี้ยง',
  },
  // =========================================================================
  // 🟣 1. ธีมสีม่วง (Royal Purple Theme - 7 ผลงานจริง ไร้ภาพซ้ำ)
  // =========================================================================
  {
    id: 'pur1',
    title: 'เซ็ตโต๊ะจีนธีมสีม่วงลูกไม้ พร้อมทาวเวอร์ขนมเบเกอรี่ & ของว่าง',
    category: 'เซ็ตโต๊ะ VIP & ของว่าง',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีม่วงซาติน 💜',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-pastry-tower.jpg',
    tag: 'เซ็ตของว่างพรีเมียม 💜',
    description: 'โต๊ะจีนผ้าปูลูกไม้สีม่วงสุดหรูหรา เก้าอี้ผูกโบว์ม่วงซาติน พร้อมทาวเวอร์เบเกอรี่ 3 ชั้น คานาเป้ ขนมปัง และน้ำดื่มบริสุทธิ์บริการต้อนรับแขกคนสำคัญ',
    highlights: ['ทาวเวอร์ขนมเบเกอรี่ 3 ชั้น & คานาเป้', 'ผ้าปูลูกไม้สีม่วงทอละเอียดประณีต', 'เก้าอี้คลุมขาวผูกโบว์ม่วงซาตินเงางาม', 'เซ็ตแก้วน้ำและผ้าเช็ดปากทรงกรวยทอง'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'งานมงคลสมรส & งานเลี้ยงสังสรรค์',
  },
  {
    id: 'pur2',
    title: 'จัดเลี้ยงโต๊ะจีนธีมสีม่วง ใต้เต็นท์โดมหลังคาโค้ง บรรยากาศโปร่งสบาย',
    category: 'งานเลี้ยงในโดม / เต็นท์พิธี',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีม่วงสดใส 💜',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-dome-pavilion.jpg',
    tag: 'งานโดมหลังคาโค้ง ✨',
    description: 'การจัดโต๊ะจีนใต้โครงสร้างโดมหลังคาโค้ง ผังโต๊ะโปร่งสบาย ลมพัดถ่ายเทสะดวก โต๊ะผ้าลูกไม้สีม่วงตัดกับเก้าอี้คลุมขาวผูกโบว์ม่วงสดใส',
    highlights: ['ผังโต๊ะโปร่งสบาย ลมถ่ายเทสะดวก', 'ทางเดินกว้างขวางเดินสวนสะดวก', 'พนักงานบริกรดูแลประจำโซน', 'ฟรีอุปกรณ์ครบเซ็ตทุกราคา'],
    tableType: '30 - 100 โต๊ะ',
    location: 'โดมจัดเลี้ยง & ลานกิจกรรม',
  },
  {
    id: 'pur3',
    title: 'มุมสูงผังโต๊ะจีนธีมสีม่วงลูกไม้ จัดเรียงเป็นระเบียบสง่างาม',
    category: 'ผังจัดเลี้ยงมาตรฐาน',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีม่วงซาติน 💜',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-high-angle-grid.jpg',
    tag: 'ผังมาตรฐาน 100% 📐',
    description: 'มุมสูงแสดงความมีระเบียบวินัยของการจัดวางโต๊ะจีนแถวหน้ากระดาน ทุกโต๊ะตั้งตรงแนว เก้าอี้ทุกตัวผูกโบว์ปีกผีเสื้อขนาดเท่ากันเป๊ะ',
    highlights: ['การจัดวางโต๊ะตรงแนวมาตรฐาน', 'ผ้าเช็ดปากพับทรงกรวยทองหรูหรา', 'ขวดน้ำดื่มและน้ำอัดลมพร้อมเสิร์ฟ', 'จานชามเมลามีนแก้วน้ำครบเซ็ต'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ลานจัดเลี้ยง & สวนสวย',
  },
  {
    id: 'pur4',
    title: 'แนวแถวโต๊ะจีนธีมสีม่วงลูกไม้ ทางเดินกว้างขวาง บริการรวดเร็ว',
    category: 'งานจัดเลี้ยงใหญ่',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีม่วงประกาย 💜',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-perspective-lane.jpg',
    tag: 'ทางเดินกว้างขวาง 🎪',
    description: 'ทัศนียภาพแนวแถวโต๊ะจีนแนวยาว สะท้อนความโอ่อ่าของสถานที่จัดเลี้ยง ทางเดินตรงกลางกว้างขวาง รองรับขบวนแห่ขันหมากและแขกผู้มีเกียรติ',
    highlights: ['ทางเดินกลางกว้างพิเศษ', 'เก้าอี้ผูกโบว์ม่วงประกายซาติน', 'เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ', 'ทีมงานมืออาชีพกว่า 35 ปี'],
    tableType: '50 - 200 โต๊ะ',
    location: 'หอประชุม & ลานอเนกประสงค์',
  },
  {
    id: 'pur5',
    title: 'บรรยากาศจัดเลี้ยงธีมสีม่วงลูกไม้ ผังสมมาตรใต้โดมจัดเลี้ยง',
    category: 'บรรยากาศงานเลี้ยง',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีม่วงซาติน 💜',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-dome-symmetry.jpg',
    tag: 'ผังสมมาตรหรูหรา 🏛️',
    description: 'ภาพรวมบรรยากาศงานจัดเลี้ยงโต๊ะจีนธีมสีม่วงลูกไม้สองฝั่งซ้ายขวาอย่างสมมาตร พร้อมโคลสอัพความประณีตของโบว์ผูกเก้าอี้ด้านหลัง',
    highlights: ['การจัดวางผังสมมาตรสวยงาม', 'โบว์ซาตินสีม่วงเงางามไร้รอยยับ', 'ชุดจานช้อนสแตนเลสสะอาดเอี่ยม', 'เสิร์ฟอาหารสดใหม่จากครัวสนาม'],
    tableType: '30 - 100 โต๊ะ',
    location: 'โดมจัดเลี้ยง & หอประชุม',
  },
  {
    id: 'pur6',
    title: 'โต๊ะจีนจัดเลี้ยงธีมสีม่วง ผ้าลูกไม้สีม่วง & เก้าอี้โบว์ม่วงซาติน',
    category: 'งานมงคล / งานเลี้ยง',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีม่วงซาติน 💜',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-satin-tables.jpg',
    tag: 'ยอดนิยมธีมม่วง 💜',
    description: 'การจัดเลี้ยงโต๊ะจีนธีมสีม่วงสุดหรูหรา ผ้าปูโต๊ะลูกไม้สีม่วงหวาน เก้าอี้คลุมขาวผูกโบว์ซาตินสีม่วงเงางาม แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง',
    highlights: ['ผ้าปูโต๊ะลูกไม้สีม่วงทอละเอียด', 'เก้าอี้ผูกโบว์ม่วงซาตินประกายเงา', 'ชุดจานชามเมลามีน & ช้อนกลาง', 'พับผ้าเช็ดปากทรงกรวยสีทอง'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ลานจัดเลี้ยง & สวนร่มรื่น',
  },
  {
    id: 'pur7',
    title: 'ความหรูหราโอ่อ่า จัดเลี้ยงโต๊ะจีนธีมสีม่วงจักรพรรดิ ในหอประชุมใหญ่',
    category: 'งานเลี้ยงในห้องประชุม',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีม่วงจักรพรรดิ 💜',
    colorTheme: 'purple',
    colorThemeName: 'ธีมสีม่วง (Royal Purple Theme)',
    colorDotClass: 'bg-purple-600',
    image: '/images/portfolio/work-purple-luxury.jpg',
    tag: 'ม่วงจักรพรรดิหรู 💜',
    description: 'การตกแต่งสถานที่จัดเลี้ยงโต๊ะจีนด้วยผ้าปูโต๊ะสีม่วงเข้มและเก้าอี้ผูกโบว์ม่วงซาติน ให้บรรยากาศภูมิฐาน สง่างาม เหมาะแก่งานเลี้ยงผู้บริหารและงานมงคล',
    highlights: ['ผ้าปูโต๊ะสีม่วงเข้มสง่างาม', 'เก้าอี้คลุมผ้าขาวผูกโบว์ม่วง', 'จัดวางตรงตามหลักสากล', 'บริการระดับ 5 ดาว'],
    tableType: '30 - 150 โต๊ะ',
    location: 'หอประชุมใหญ่ & ศูนย์ประชุม',
  },

  // =========================================================================
  // 👑 2. ธีมสีทอง (Imperial Gold Theme - 13 ผลงานจริง ไร้ภาพซ้ำ)
  // =========================================================================
  {
    id: 'gld-lace-chair-napkin',
    title: 'โคลสอัพความประณีตโต๊ะจีนผ้าลูกไม้สีครีม เก้าอี้ผูกโบว์สีเหลืองทอง & พับผ้าเช็ดปากทรงกรวยทอง',
    category: 'เซ็ตโต๊ะ VIP & ความประณีต',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเหลืองทองซาติน 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-lace-chair-napkin-detail.jpg',
    tag: 'พับผ้าเช็ดปากทรงกรวย 👑',
    description: 'ความประณีตระดับ 5 ดาว โต๊ะกลมผ้าปูลูกไม้ถักทอสีครีมหวาน เก้าอี้คลุมผ้าขาวผูกโบว์ซาตินสีเหลืองทองปีกผีเสื้อ แก้วน้ำใส และผ้าเช็ดปากพับทรงกรวยทองบนจานแบ่งขาวสะอาด',
    highlights: ['ผ้าปูลูกไม้ถักทอสีครีมหวานประณีต', 'เก้าอี้ผูกโบว์ซาตินสีเหลืองทองเงางาม', 'ผ้าเช็ดปากพับทรงกรวยทองคำวิจิตร', 'ชุดแก้วน้ำและช้อนส้อมสแตนเลส'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สวนสวย',
  },
  {
    id: 'gld-symmetrical-perspective-palm',
    title: 'ผังโต๊ะจีนแถวคู่ขนานสมมาตรยาว ทอดยาวสู่ทิวต้นปาล์ม ธีมโบว์สีเหลืองทองมงคล',
    category: 'งานจัดเลี้ยงกลางแจ้งสเกลใหญ่',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเหลืองทองอร่าม 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-symmetrical-perspective-palm.jpg',
    tag: 'ผังสมมาตรทิวปาล์ม 🌴',
    description: 'ทัศนียภาพความงดงามสมบูรณ์แบบของผังโต๊ะจีนแถวคู่ขนานหลายสิบโต๊ะ จัดวางเป็นแนวสมมาตรทอดยาวสู่ทิวต้นปาล์ม โต๊ะผ้าลูกไม้ครีมทอง เก้าอี้ผูกโบว์เหลืองทองอร่ามตา',
    highlights: ['ผังโต๊ะคู่ขนานสมมาตรระดับสากล', 'ทางเดินกว้างขวางบริการสะดวกสบาย', 'เก้าอี้ผูกโบว์เหลืองทองทรงปีกผีเสื้อ', 'เสิร์ฟอาหารสดใหม่พร้อมกันทุกโต๊ะ'],
    tableType: '50 - 200 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สวนสวย',
  },
  {
    id: 'gld-outdoor-high-angle-grid',
    title: 'มุมสูงผังจัดเลี้ยงโต๊ะจีนกลางแจ้ง 50+ โต๊ะ ธีมโบว์สีเหลืองทองอร่าม สวยงามเป็นระเบียบ',
    category: 'งานจัดเลี้ยงกลางแจ้งสเกลใหญ่',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเหลืองทองมงคล 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-outdoor-high-angle-grid.jpg',
    tag: 'ผัง 50+ โต๊ะมุมสูง 🌟',
    description: 'มุมสูงแสดงความโอ่อ่าและความเป็นระเบียบวินัยของการจัดวางผังโต๊ะจีนกลางแจ้งกว่า 50 โต๊ะ ธีมโบว์สีเหลืองทองอร่ามตา ตัดกับผ้าปูลูกไม้สีครีมทองอย่างลงตัว',
    highlights: ['ผังโต๊ะกลางแจ้ง 50+ โต๊ะตรงแนวเป๊ะ', 'ผ้าปูลูกไม้สีครีมทองสะอาดสะอ้าน', 'เก้าอี้ผูกโบว์สีเหลืองทองสว่างไสว', 'ทีมงานบริกรดูแลประจำจุดทั่วถึง'],
    tableType: '50 - 150 โต๊ะ',
    location: 'ลานอเนกประสงค์ & ลานจัดเลี้ยงกลางแจ้ง',
  },
  {
    id: 'gld-dome-50tables',
    title: 'ผังโต๊ะจีน 50+ โต๊ะใต้เต็นท์โดมโค้ง ธีมโบว์สีเหลืองทอง & โคลสอัพเซ็ตถังน้ำแข็ง',
    category: 'งานจัดเลี้ยงใต้เต็นท์โดม',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเหลืองทอง 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-yellow-dome-50tables.jpg',
    tag: 'เต็นท์โดม 50+ โต๊ะ ✨',
    description: 'ผังจัดเลี้ยงโต๊ะจีนสเกลใหญ่กว่า 50 โต๊ะใต้โครงสร้างเต็นท์โดมหลังคาโค้ง โต๊ะผ้าปูลูกไม้สีครีมทอง เก้าอี้ผูกโบว์สีเหลืองทองอร่าม พร้อมเซ็ตถังน้ำแข็งสแตนเลสและหลอดดูดสะอาดถูกหลักสุขอนามัย',
    highlights: ['ผังเต็นท์โดมโค้ง 50+ โต๊ะโปร่งสบาย', 'เก้าอี้คาดแถบ & ผูกโบว์สีเหลืองทอง', 'ถังน้ำแข็งสแตนเลส & เครื่องดื่มครบเซ็ต', 'เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ'],
    tableType: '50 - 150 โต๊ะ',
    location: 'เต็นท์โดม & ลานกิจกรรม',
  },
  {
    id: 'gld-garden-grand',
    title: 'ผังจัดเลี้ยงโต๊ะจีนกลางแจ้ง 50+ โต๊ะ ธีมโบว์สีเหลืองทอง & โคลสอัพผ้าปูลูกไม้',
    category: 'งานจัดเลี้ยงกลางแจ้งสเกลใหญ่',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเหลืองทองอร่าม 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-yellow-garden-grand.jpg',
    tag: 'ผัง 50+ โต๊ะกลางแจ้ง 🌟',
    description: 'ผังจัดเลี้ยงโต๊ะจีนกลางแจ้ง 50+ โต๊ะ โต๊ะผ้าปูลูกไม้สีครีมทอง เก้าอี้คลุมขาวผูกโบว์สีเหลืองทองอร่าม พร้อมโคลสอัพชุดแก้วน้ำและผ้าปูโต๊ะลูกไม้ทอละเอียด',
    highlights: ['ผังโต๊ะกลางแจ้ง 50+ โต๊ะสมมาตร', 'ผ้าปูลูกไม้ถักทอสีครีมทองหรูหรา', 'เก้าอี้ผูกโบว์สีเหลืองทองเงางาม', 'เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ'],
    tableType: '50 - 150 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สวนสวย',
  },
  {
    id: 'gld-bow-butterfly',
    title: 'โคลสอัพความประณีตโบว์ซาตินสีเหลืองทองทรงปีกผีเสื้อ & เซ็ตถ้วยชาม',
    category: 'รายละเอียดอุปกรณ์ VIP',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเหลืองทองปีกผีเสื้อ 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-yellow-bow-butterfly.jpg',
    tag: 'ความประณีต 100% 👑',
    description: 'โคลสอัพการผูกโบว์ซาตินสีเหลืองทองทรงปีกผีเสื้อดึงตึงสวยงามไร้รอยยับ และเซ็ตถ้วยแบ่งเซรามิกสีขาวสะอาดตาพร้อมถ้วยน้ำจิ้ม',
    highlights: ['โบว์ซาตินสีเหลืองทองทรงปีกผีเสื้อ', 'ผ้าคลุมเก้าอี้ขาวสะอาดไร้รอยยับ', 'ถ้วยชามเซรามิกเกรดส่งออก', 'ฟรีสำหรับลูกค้าทุกแพ็กเกจ'],
    tableType: 'เก้าอี้ทุกที่นั่ง',
    location: 'งานจัดเลี้ยงทุกสถานที่ทั่วไทย',
  },
  {
    id: 'gld-marquee',
    title: 'ผังจัดเลี้ยงโต๊ะจีนใต้เต็นท์โดม & โคลสอัพโบว์สีเหลืองทอง',
    category: 'งานจัดเลี้ยงใต้เต็นท์โดม',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเหลืองทอง 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-yellow-marquee-pavilion.jpg',
    tag: 'โดมจัดเลี้ยงเต็นท์โค้ง ✨',
    description: 'ผังจัดเลี้ยงโต๊ะจีนผ้าลูกไม้สีครีมทองใต้เต็นท์โดมขนาดใหญ่ เก้าอี้คลุมขาวผูกโบว์สีเหลืองทองสดใส พร้อมโคลสอัพความประณีตของโบว์เก้าอี้และเซ็ตน้ำดื่ม',
    highlights: ['เต็นท์โดมโปร่งสบาย อากาศถ่ายเทดี', 'เก้าอี้ผูกโบว์สีเหลืองทองประกายเงา', 'ชุดแก้วน้ำและขวดเครื่องดื่มพร้อมเสิร์ฟ', 'ทีมงานบริกรดูแลใกล้ชิด'],
    tableType: '40 - 120 โต๊ะ',
    location: 'เต็นท์โดม & ลานกิจกรรม',
  },
  {
    id: 'gld-yellow1',
    title: 'โคลสอัพความประณีตเก้าอี้ผูกโบว์ซาตินสีเหลืองทองเงางาม',
    category: 'รายละเอียดอุปกรณ์ VIP',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเหลืองทองซาติน 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-yellow-bow-closeup.jpg',
    tag: 'ความประณีต 100% 👑',
    description: 'โคลสอัพการผูกโบว์ซาตินสีเหลืองทองปีกผีเสื้อด้านหลังเก้าอี้ ดึงทรงโบว์ตึงสวยงาม ไร้รอยยับ ผ้าปูโต๊ะสีเหลืองทองสดใส พร้อมชุดถ้วยชามสะอาดสะอ้าน',
    highlights: ['โบว์ซาตินสีเหลืองทองเงางาม', 'ผ้าคลุมเก้าอี้สีขาวสะอาดไร้รอยยับ', 'ผูกโบว์ทรงปีกผีเสื้อประณีต', 'ฟรีสำหรับลูกค้าทุกแพ็กเกจ'],
    tableType: 'เก้าอี้ทุกที่นั่ง',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & หน้าเวที',
  },
  {
    id: 'gld-yellow2',
    title: 'ภาพมุมกว้างผังโต๊ะจีนกลางแจ้งหน้าเวที ธีมสีเหลืองทองมงคล 50+ โต๊ะ',
    category: 'งานจัดเลี้ยงกลางแจ้งหน้าเวที',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเหลืองทอง 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-yellow-outdoor-wide.jpg',
    tag: 'ผัง 50+ โต๊ะหน้าเวที 🌟',
    description: 'มุมกว้างแสดงผังจัดเลี้ยงโต๊ะจีนกลางแจ้งหน้าเวทีคอนเสิร์ต 50+ โต๊ะ ธีมสีเหลืองทองอร่าม โต๊ะทุกตัวตั้งตรงแนว ทางเดินกว้างขวาง บรรยากาศโอ่อ่าอลังการ',
    highlights: ['ผังโต๊ะหน้าเวทีคอนเสิร์ต 50+ โต๊ะ', 'โต๊ะผ้าปูสีเหลืองทองตัดเก้าอี้ขาว', 'ทีมงานบริกรดูแลประจำจุด', 'เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ'],
    tableType: '50 - 150 โต๊ะ',
    location: 'ลานคอนเสิร์ต & มหกรรมจัดเลี้ยง',
  },
  {
    id: 'gld-new1',
    title: 'จัดเลี้ยงโต๊ะจีนกลางแจ้งหน้าเวที ธีมสีเหลืองทองมงคล เก้าอี้ผูกโบว์ทองอร่าม',
    category: 'งานจัดเลี้ยงกลางแจ้งหน้าเวที',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเหลืองทองอร่าม 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-stage-outdoor-yellow.jpg',
    tag: 'โบว์ทองสดใส 👑',
    description: 'การจัดเลี้ยงโต๊ะจีนกลางแจ้งหน้าเวทีคอนเสิร์ต ผ้าปูโต๊ะสีเหลืองทองสดใส เก้าอี้คลุมขาวผูกโบว์ซาตินสีเหลืองทองสว่างไสว สะท้อนแสงแดดและความมงคล',
    highlights: ['ผ้าปูโต๊ะสีเหลืองทองอร่ามสดใส', 'เก้าอี้คลุมขาวผูกโบว์ทองประกายเงา', 'จัดวางหน้าเวทีคอนเสิร์ตโอ่อ่า', 'ถ้วยชามและเครื่องดื่มครบเซ็ต'],
    tableType: '30 - 100 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & หน้าเวทีคอนเสิร์ต',
  },
  {
    id: 'gld1',
    title: 'งานเลี้ยงในโรงแรมหอประชุมหรู ธีมสีเงินซิลเวอร์ เสาไฟคริสตัล',
    category: 'งานเลี้ยงโรงแรม & หอประชุมหรู',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเงินซิลเวอร์ประกาย 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-silver-crystal-hall.jpg',
    tag: 'ระดับโรงแรม 5 ดาว 👑',
    description: 'การจัดเลี้ยงโต๊ะจีนระดับไฮเอนด์ในห้องแกรนด์บอลรูม ผ้าปูลูกไม้สีครีม เก้าอี้ผูกโบว์สีเงินซิลเวอร์ประกายเงา ประดับเสาไฟคริสตัลและแจกันดอกไม้สดสุดอลังการ',
    highlights: ['เสาคริสตัลประดับแจกันดอกไม้สด', 'เก้าอี้ผูกโบว์สีเงินซิลเวอร์ประกายหรู', 'ผ้าปูลูกไม้ถักทอละเอียด', 'บริการระดับโรงแรม 5 ดาว'],
    tableType: '50 - 200 โต๊ะ',
    location: 'ห้องแกรนด์บอลรูม & ศูนย์ประชุม',
  },
  {
    id: 'gld2',
    title: 'งานเลี้ยงสังสรรค์ & คอนเสิร์ตกลางแจ้งยามค่ำคืน 100+ โต๊ะ ธีมสีทองอร่าม',
    category: 'คอนเสิร์ต & งานเลี้ยงใหญ่กลางแจ้ง',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีทองมงคล 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-night-concert.jpg',
    tag: 'คอนเสิร์ตใหญ่ 100+ โต๊ะ 🌟',
    description: 'บรรยากาศงานจัดเลี้ยงโต๊ะจีนสเกลใหญ่ระดับร้อยโต๊ะในงานคอนเสิร์ตกลางแจ้งยามค่ำคืน เก้าอี้ผูกโบว์สีทองสว่างไสว สะท้อนแสงไฟเวทีคอนเสิร์ตสุดอลังการ',
    highlights: ['รองรับแขกกว่า 1,000+ ท่าน', 'เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ', 'เก้าอี้ผูกโบว์ทองประกายมงคล', 'ทีมครัวสนามพร้อมบริกรดูแลทั่วถึง'],
    tableType: '100 - 300 โต๊ะ',
    location: 'ลานคอนเสิร์ต & ลานจัดเลี้ยงกลางแจ้ง',
  },
  {
    id: 'gld3',
    title: 'งานมงคลสมรส ธีมสีทองหรูหรากลางแจ้ง (Gold Lace Elegance)',
    category: 'งานแต่งงานกลางแจ้ง',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีทองประกาย 🎗️',
    colorTheme: 'gold',
    colorThemeName: 'ธีมสีทอง (Imperial Gold Theme)',
    colorDotClass: 'bg-amber-400',
    image: '/images/portfolio/work-gold-garden.jpg',
    tag: 'หรูหราระดับพรีเมียม 👑',
    description: 'โต๊ะจีนผ้าปูลูกไม้ถักทอสีครีมทอง เก้าอี้คลุมขาวผูกโบว์สีทองประกายมงคล แก้วน้ำทรงก้านไวน์หรูหรา พร้อมการพับผ้าเช็ดปากทรงหงส์สุดวิจิตร',
    highlights: ['ผ้าปูลูกไม้ถักทอสีทองประณีต', 'เก้าอี้ผูกโบว์ทองมงคลอร่าม', 'แก้วก้านไวน์ & ผ้าเช็ดปากทรงหงส์', 'จานชามเมลามีนเกรดส่งออก'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'สวนจัดเลี้ยง & กลางแจ้ง',
  },

  // =========================================================================
  // 🌸 3. ธีมสีชมพู (Sweet Pink Theme - 13 ผลงานจริง ไร้ภาพซ้ำ)
  // =========================================================================
  {
    id: 'pnk-new1',
    title: 'จัดเลี้ยงโต๊ะจีนธีมสีชมพูหวานใต้โดมโค้ง เก้าอี้ผูกโบว์ชมพูซาติน',
    category: 'งานจัดเลี้ยงใต้โดมพิธี',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีชมพูซาติน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-pink-dome-perspective.jpg',
    tag: 'โบว์ชมพูซาติน 🌸',
    description: 'บรรยากาศจัดเลี้ยงโต๊ะจีนธีมสีชมพูหวานสดใสใต้โดมหลังคาโค้ง โต๊ะผ้าปูสีชมพู เก้าอี้คลุมขาวผูกโบว์ซาตินสีชมพูหวานเข้าเซ็ตอย่างประณีต',
    highlights: ['เก้าอี้คลุมขาวผูกโบว์ชมพูซาติน', 'ผ้าปูโต๊ะสีชมพูเงางามสะอาดสะอ้าน', 'แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง', 'บริการครบวงจรพร้อมน้ำดื่มน้ำอัดลม'],
    tableType: '30 - 100 โต๊ะ',
    location: 'โดมจัดเลี้ยง & ลานกิจกรรมวัด',
  },
  {
    id: 'pnk-new2',
    title: 'ภาพรวมจัดเลี้ยงโต๊ะจีนธีมสีชมพูพาสเทลใต้โดมโค้ง วิวอุโบสถวัด',
    category: 'งานบุญ / งานพิธีมงคล',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีชมพูพาสเทล 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-pink-dome-temple-view.jpg',
    tag: 'ผังโดมวิวอุโบสถ ✨',
    description: 'ผังจัดเลี้ยงโต๊ะจีนคู่ขนานสองฝั่งธีมสีชมพูพาสเทล ทอดยาวมุ่งสู่อุโบสถวัดด้านหลัง บรรยากาศสง่างามและเปี่ยมด้วยความเป็นสิริมงคล',
    highlights: ['ผังโต๊ะคู่ขนาน ทางเดินตรงกลางโปร่งโล่ง', 'เก้าอี้ผูกโบว์ชมพูพาสเทลหวานละมุน', 'เซ็ตขวดเครื่องดื่มและแก้วน้ำพร้อมเสิร์ฟ', 'ทีมงานบริกรดูแลตลอดพิธีการ'],
    tableType: '40 - 120 โต๊ะ',
    location: 'ลานพิธีการวัด & โดมจัดเลี้ยง',
  },
  {
    id: 'pnk-new3',
    title: 'เซ็ตโต๊ะจัดเลี้ยงธีมสีชมพูหวาน แก้วก้านใส ผ้าเช็ดปากทรงกรวยทอง & เครื่องดื่ม',
    category: 'เซ็ตโต๊ะอาหาร & เครื่องดื่ม',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีชมพูหวาน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-pink-beverage-close-detail.jpg',
    tag: 'เซ็ตโต๊ะหวานพรีเมียม 🍷',
    description: 'โคลสอัพความประณีตของโต๊ะจีนผ้าปูสีชมพูหวาน แก้วน้ำก้านใส จานช้อนสแตนเลส ผ้าเช็ดปากพับทรงกรวยสีทอง และขวดน้ำดื่มน้ำอัดลมพร้อมเสิร์ฟไม่อั้น',
    highlights: ['แก้วน้ำทรงก้านใสระดับสากล', 'ผ้าเช็ดปากทรงกรวยทองหรูหรา', 'น้ำดื่มและเครื่องดื่มบริการครบเซ็ต', 'ชุดจานชามเมลามีนสะอาดเอี่ยม'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'งานจัดเลี้ยงทุกสถานที่ทั่วไทย',
  },
  {
    id: 'pnk-new4',
    title: 'ผังโต๊ะจีนธีมสีชมพู ทางเดินกลางกว้างขวาง มุ่งหน้าสู่อาคารพิธีสงฆ์',
    category: 'งานพิธีการในอาคาร',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีชมพูหวาน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-pink-center-walkway-temple.jpg',
    tag: 'ทางเดินกว้างขวาง 🏛️',
    description: 'แนวแถวโต๊ะจีนธีมสีชมพูจัดวางอย่างเป็นระเบียบ ทางเดินกว้างขวาง ช่วยให้แขกเดินได้สะดวกและทีมบริกรเสิร์ฟอาหารได้สะดวกรวดเร็ว',
    highlights: ['ทางเดินตรงกลางกว้างพิเศษ', 'เก้าอี้คลุมขาวผูกโบว์ชมพูตรงแนวเป๊ะ', 'โต๊ะผ้าปูสีชมพูหวานสดชื่น', 'ฟรีอุปกรณ์ครบชุดทุกแพ็กเกจ'],
    tableType: '30 - 150 โต๊ะ',
    location: 'โดมจัดเลี้ยง & หอประชุม',
  },
  {
    id: 'pnk1',
    title: 'เซ็ตโต๊ะจีนพรีเมียม VIP ผ้าเช็ดปากประดับห่วงทองไข่มุก',
    category: 'เซ็ตโต๊ะ VIP พรีเมียม',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีขาว-ชมพู VIP 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-vip-pearl-napkin.jpg',
    tag: 'ความประณีตระดับ VIP 💎',
    description: 'การจัดโต๊ะจีนระดับภัตตาคาร ผ้าปูลูกไม้ซาตินสีชมพู แก้วไวน์ก้านใส ชุดช้อนส้อมสแตนเลส และการพับผ้าเช็ดปากทรงหงส์ประดับด้วยห่วงทองล้อมไข่มุกแท้',
    highlights: ['ผ้าเช็ดปากประดับห่วงทองไข่มุกแท้', 'แก้วก้านไวน์ใสระดับภัตตาคาร', 'จานชามเมลามีนเกรดส่งออก', 'เก้าอี้คลุมผ้าขาวผูกโบว์ขาวซาติน'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'งานมงคลสมรส & งานเลี้ยงรับรอง VIP',
  },
  {
    id: 'pnk2',
    title: 'งานเลี้ยงมงคลสมรส 50+ โต๊ะ กลางแจ้งยามเย็น Sunset',
    category: 'งานแต่งงานกลางแจ้ง',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีชมพูฟูเชีย 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-outdoor-sunset-grand.jpg',
    tag: 'ผลงานจริง 50+ โต๊ะ 🔥',
    description: 'บรรยากาศงานจัดเลี้ยงโต๊ะจีนกลางแจ้งยามเย็นช่วงแสงอาทิตย์อัสดง ผังโต๊ะ 50+ โต๊ะ จัดวางเป็นระเบียบ สวยงาม ผ้าปูโต๊ะชมพูลูกไม้ เก้าอี้คลุมขาวผูกโบว์ชมพูซาตินหวาน',
    highlights: ['โต๊ะจีนจัดเลี้ยงกลางแจ้ง 50+ โต๊ะ', 'ผ้าปูโต๊ะลูกไม้สีชมพูหวาน', 'เก้าอี้คลุมขาวผูกโบว์ชมพูฟูเชีย', 'ทีมบริกรดูแลตลอดงาน'],
    tableType: '50 - 150 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สวนสวย',
  },
  {
    id: 'pnk3',
    title: 'การจัดเลี้ยงโต๊ะจีนในอาคารอเนกประสงค์ & หอประชุมใหญ่',
    category: 'งานเลี้ยงในอาคาร',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีชมพูซาติน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-hall-pink-indoor.jpg',
    tag: 'รองรับ 50-200 โต๊ะ 🏛️',
    description: 'ผังจัดเลี้ยงโต๊ะจีนมาตรฐานสำหรับห้องประชุม หอประชุม และอาคารอเนกประสงค์ แนวแถวเป็นระเบียบสวยงาม เดินสวนสะดวก พร้อมเวทีและระบบเสิร์ฟรวดเร็ว',
    highlights: ['ผังโต๊ะมาตรฐาน ทางเดินกว้างขวาง', 'เซ็ตแก้วน้ำและผ้าเช็ดปากหรูหรา', 'บริกรประจำโต๊ะดูแลทั่วถึง', 'ฟรีอุปกรณ์ครบเซ็ตทุกราคา'],
    tableType: '50 - 200 โต๊ะ',
    location: 'หอประชุม & อาคารจัดเลี้ยง',
  },
  {
    id: 'pnk4',
    title: 'เซ็ตโต๊ะจัดเลี้ยงพร้อมเครื่องดื่ม น้ำอัดลม น้ำแข็ง บริการครบวงจร',
    category: 'เซ็ตเครื่องดื่มประจำโต๊ะ',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีชมพูซาติน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-outdoor-sunset-beverage.jpg',
    tag: 'บริการครบเซ็ต 🍷',
    description: 'โต๊ะจีนพร้อมจัดวางขวดน้ำดื่ม น้ำอัดลม แก้วน้ำใส และถังน้ำแข็งเติมได้ไม่อั้นตลอดงาน พร้อมถ้วยน้ำจิ้มและช้อนกลางอย่างถูกสุขอนามัย',
    highlights: ['น้ำอัดลม & น้ำดื่มเติมไม่อั้น', 'แก้วน้ำใส & ถ้วยชามเซ็ตใหม่', 'บริกรคอยบริการเติมน้ำแข็ง', 'จัดวางเรียบร้อยพร้อมเสิร์ฟ'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'จัดเลี้ยงทุกสถานที่ทั่วไทย',
  },
  {
    id: 'pnk5',
    title: 'โต๊ะจีนธีมชมพูหวานพร้อมเครื่องดื่มและเซ็ตถ้วยชามเมลามีน',
    category: 'เซ็ตโต๊ะอาหาร & เครื่องดื่ม',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีชมพูหวาน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-pink-table-beverage-close.jpg',
    tag: 'เซ็ตโต๊ะพร้อมเสิร์ฟ 🌸',
    description: 'การจัดเซ็ตโต๊ะจีนผ้าลูกไม้สีชมพูหวานสดใส ถ้วยชามเมลามีนขาวสะอาดตา แก้วน้ำทรงสูงพับผ้าเช็ดปากสีทอง และขวดน้ำอัดลมน้ำดื่มพร้อมบริการ',
    highlights: ['ถ้วยชามเมลามีนขาวสะอาดเกรดพรีเมียม', 'แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง', 'ผ้าปูโต๊ะลูกไม้สีชมพูหวาน', 'จัดวางตรงตามมาตรฐานสุขอนามัย'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'หอประชุม & ลานจัดเลี้ยง',
  },
  {
    id: 'pnk6',
    title: 'ความประณีตเก้าอี้คลุมผ้าขาว ผูกโบว์ซาตินสีชมพูฟูเชีย',
    category: 'รายละเอียดอุปกรณ์',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีชมพูฟูเชีย 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-600',
    image: '/images/portfolio/work-chair-bow-detail.jpg',
    tag: 'ความประณีต 100% ✨',
    description: 'โคลสอัพความประณีตของการผูกโบว์ซาตินด้านหลังเก้าอี้ ทุกตัวถูกผูกด้วยความตั้งใจ ดึงทรงปีกโบว์สวยงาม ทรงเก้าอี้เรียบร้อย ตอกย้ำความเป็นมืออาชีพกว่า 35 ปี',
    highlights: ['ผ้าคลุมเก้าอี้สีขาวสะอาดไร้รอยยับ', 'โบว์ซาตินสีชมพูฟูเชียเงางาม', 'ผูกโบว์ทรงปีกผีเสื้อประณีต', 'ฟรีสำหรับลูกค้าทุกแพ็กเกจ'],
    tableType: 'เก้าอี้ทุกที่นั่ง',
    location: 'งานจัดเลี้ยงทุกระดับ',
  },
  {
    id: 'pnk7',
    title: 'งานมงคลสมรสธีมสีชมพูหวานแหวว พร้อมการจัดโต๊ะจีนระดับพรีเมียม',
    category: 'งานแต่งงานในอาคาร',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีชมพูหวาน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-pink-wedding.jpg',
    tag: 'งานแต่งงานสีชมพู 🌸',
    description: 'บรรยากาศงานมงคลสมรสสุดหวาน โต๊ะจีนผ้าปูลูกไม้สีชมพูและเก้าอี้คลุมขาวผูกโบว์สีชมพู เพิ่มความอบอุ่นและความประทับใจให้กับคู่บ่าวสาวและแขกผู้มีเกียรติ',
    highlights: ['ธีมสีชมพูหวานโรแมนติก', 'โต๊ะจีนพร้อมถ้วยชามเซ็ตใหม่', 'เก้าอี้คลุมขาวผูกโบว์ชมพูหวาน', 'บริการระดับพรีเมียม'],
    tableType: '30 - 150 โต๊ะ',
    location: 'ศูนย์ประชุม & หอประชุมจัดเลี้ยง',
  },
  {
    id: 'pnk8',
    title: 'จัดเลี้ยงโต๊ะจีนธีมสีชมพูในห้องแกรนด์ฮอลล์ใหญ่ แสงไฟสว่างไสว',
    category: 'งานเลี้ยงในอาคาร',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีชมพูซาติน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-pink-hall.jpg',
    tag: 'แกรนด์ฮอลล์สีชมพู 🏛️',
    description: 'การจัดผังโต๊ะจีนธีมสีชมพูในหอประชุมขนาดใหญ่ ทางเดินกว้างขวาง จัดวางตรงตามมาตรฐานสุขอนามัย เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ',
    highlights: ['ผังโต๊ะตรงตามมาตรฐาน', 'ผ้าปูโต๊ะสีชมพูสดใส', 'เก้าอี้ผูกโบว์ชมพูเป็นระเบียบ', 'ทีมบริกรดูแลตลอดงาน'],
    tableType: '50 - 200 โต๊ะ',
    location: 'หอประชุมใหญ่ & ศูนย์ประชุม',
  },
  {
    id: 'pnk9',
    title: 'โต๊ะจีนผ้าซาตินสีชมพูหวานในห้องจัดเลี้ยงหรู พร้อมอุปกรณ์ครบครัน',
    category: 'งานมงคล / งานเลี้ยง',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีชมพูซาติน 🎀',
    colorTheme: 'pink',
    colorThemeName: 'ธีมสีชมพู (Sweet Pink Theme)',
    colorDotClass: 'bg-pink-500',
    image: '/images/portfolio/work-hall-pink-satin.jpg',
    tag: 'ซาตินชมพูหวาน 🌸',
    description: 'ความงดงามของโต๊ะจีนผ้าปูซาตินสีชมพูเงางาม เก้าอี้ผูกโบว์สีชมพูเข้าชุด พร้อมจัดเซ็ตแก้วน้ำและผ้าเช็ดปากทรงกรวยทอง',
    highlights: ['ผ้าปูโต๊ะซาตินสีชมพูเงางาม', 'เก้าอี้คลุมขาวผูกโบว์ชมพู', 'แก้วน้ำพับผ้าเช็ดปากสีทอง', 'บริการครบวงจร'],
    tableType: '20 - 100 โต๊ะ',
    location: 'ห้องจัดเลี้ยง & หอประชุม',
  },

  // =========================================================================
  // 💙 4. ธีมสีฟ้า (Ocean Blue Theme - 10 ผลงานจริง ไร้ภาพซ้ำ)
  // =========================================================================
  {
    id: 'blu-turq1',
    title: 'ผังโต๊ะจีน 100+ โต๊ะกลางแจ้งหน้าเวทีคอนเสิร์ต ธีมโบว์สีฟ้าครามสดใส',
    category: 'งานจัดเลี้ยงใหญ่หน้าเวที',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีฟ้าครามสดใส 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-sky-500',
    image: '/images/portfolio/work-blue-turquoise-concert-100tables.jpg',
    tag: 'คอนเสิร์ตใหญ่ 100+ โต๊ะ 🌟',
    description: 'ผังจัดเลี้ยงโต๊ะจีนสเกลใหญ่กว่า 100 โต๊ะหน้าเวทีคอนเสิร์ตใหญ่ โต๊ะจีนผ้าปูสีฟ้า-ขาว เก้าอี้คลุมขาวคาดแถบและผูกโบว์สีฟ้าครามสดใส สวยงามเป็นระเบียบ',
    highlights: ['ผังโต๊ะหน้าเวทีคอนเสิร์ต 100+ โต๊ะ', 'เก้าอี้ผูกโบว์ฟ้าครามซาตินปีกผีเสื้อ', 'เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ', 'ทีมงานมืออาชีพกว่า 35 ปี'],
    tableType: '100 - 300 โต๊ะ',
    location: 'ลานคอนเสิร์ต & มหกรรมจัดเลี้ยง',
  },
  {
    id: 'blu-turq2',
    title: 'โต๊ะจีนจัดเลี้ยงกลางแจ้ง โบว์สีฟ้าครามสดใส & ผ้าปูลูกไม้ขาว',
    category: 'งานจัดเลี้ยงกลางแจ้ง',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีฟ้าครามสดใส 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-sky-500',
    image: '/images/portfolio/work-blue-turquoise-outdoor-table.jpg',
    tag: 'โบว์ฟ้าครามสดใส 🌊',
    description: 'การจัดเซ็ตโต๊ะจีนกลางแจ้งผ้าปูลูกไม้สีขาวสะอาดตา เก้าอี้คลุมขาวผูกโบว์ซาตินสีฟ้าครามสดชื่น แก้วน้ำใสและผ้าเช็ดปากทรงกรวยพับตั้งสง่างาม',
    highlights: ['ผ้าปูโต๊ะลูกไม้ขาวบริสุทธิ์', 'โบว์ซาตินสีฟ้าครามเงางาม', 'ชุดแก้วน้ำและจานแบ่งสะอาดเอี่ยม', 'ฟรีอุปกรณ์ครบเซ็ตทุกราคา'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สวนสวย',
  },
  {
    id: 'blu-turq3',
    title: 'โคลสอัพเก้าอี้คาดแถบผูกโบว์สีฟ้าครามสดใส & เซ็ตแก้วน้ำ',
    category: 'รายละเอียดอุปกรณ์ VIP',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีฟ้าครามซาติน 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-sky-500',
    image: '/images/portfolio/work-blue-turquoise-chair-closeup.jpg',
    tag: 'ความประณีต 100% 💎',
    description: 'โคลสอัพความประณีตของการคาดแถบเก้าอี้สีฟ้าครามและการผูกโบว์ปีกผีเสื้อเงางามด้านหลังเก้าอี้ พร้อมแก้วไวน์ก้านใสและผ้าเช็ดปากพับประณีต',
    highlights: ['เก้าอี้คาดแถบฟ้าคราม & ผูกโบว์ซาติน', 'ผ้าคลุมเก้าอี้สีขาวสะอาดไร้รอยยับ', 'แก้วก้านใสระดับภัตตาคาร', 'ฟรีสำหรับลูกค้าทุกแพ็กเกจ'],
    tableType: 'เก้าอี้ทุกที่นั่ง',
    location: 'งานจัดเลี้ยงทุกระดับ',
  },
  {
    id: 'blu1',
    title: 'มุมสูงผังโต๊ะจีนกลางแจ้ง ธีมสีน้ำเงินรอยัลบลู จัดเรียงสมมาตรสวยงาม',
    category: 'ผังจัดเลี้ยงกลางแจ้งมุมสูง',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีน้ำเงินซาติน 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-blue-600',
    image: '/images/portfolio/work-blue-aerial-outdoor-symmetry.jpg',
    tag: 'ผังสมมาตร 100% 📐',
    description: 'มุมสูงแสดงความมีระเบียบวินัยขั้นสูงของการจัดวางโต๊ะจีนกลางแจ้งธีมสีน้ำเงินรอยัลบลู แถวโต๊ะตรงแนวเป๊ะ ชุดแก้วน้ำและจานชามเมลามีนตั้งพร้อมเสิร์ฟอย่างสมบูรณ์แบบ',
    highlights: ['การจัดวางผังสมมาตรระดับมืออาชีพ', 'โต๊ะผ้าปูน้ำเงินตัดโบว์เก้าอี้น้ำเงินซาติน', 'แก้วน้ำใสและถ้วยชามสะอาดเอี่ยม', 'เสิร์ฟอาหารตรงเวลาทุกโต๊ะ'],
    tableType: '50 - 200 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สวนสวย',
  },
  {
    id: 'blu2',
    title: 'เซ็ตโต๊ะจีนพรีเมียม VIP ผ้าปูสีน้ำเงิน แจกันดอกไฮเดรนเยีย & จานขอบทอง',
    category: 'เซ็ตโต๊ะ VIP พรีเมียม',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีน้ำเงินรอยัลบลู 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-blue-600',
    image: '/images/portfolio/work-blue-hydrangea-vip.jpg',
    tag: 'VIP ไฮเดรนเยีย 💙',
    description: 'การจัดเซ็ตโต๊ะจีนพรีเมียม VIP ผ้าปูสีน้ำเงินรอยัลบลู เก้าอี้คลุมขาวผูกโบว์น้ำเงินซาติน ประดับแจกันดอกไฮเดรนเยียสีฟ้า-ขาว และเซ็ตจานเงินขอบทองคำแท้',
    highlights: ['แจกันดอกไฮเดรนเยียสดกลางโต๊ะ', 'เซ็ตจานเงินขอบทองพรีเมียม VIP', 'แก้วก้านไวน์ใสระดับภัตตาคาร', 'เก้าอี้ผูกโบว์น้ำเงินรอยัลบลู'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ลานจัดเลี้ยง & งานแต่งงาน VIP',
  },
  {
    id: 'blu3',
    title: 'ผังโต๊ะจีน 100+ โต๊ะ กลางแจ้ง ธีมสีน้ำเงินรอยัลบลู ซุ้มไฟอลังการ',
    category: 'งานจัดเลี้ยงใหญ่กลางแจ้ง',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีน้ำเงินรอยัลบลู 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-blue-600',
    image: '/images/portfolio/work-blue-outdoor-100tables.jpg',
    tag: 'กลางแจ้ง 100+ โต๊ะ 🌊',
    description: 'บรรยากาศงานจัดเลี้ยงโต๊ะจีนกลางแจ้งสเกลใหญ่ระดับ 100 โต๊ะขึ้นไป ธีมสีน้ำเงินรอยัลบลู ประดับโครงสร้างซุ้มไฟดอกพิกุลระยิบระยับยามค่ำคืน',
    highlights: ['รองรับแขกกว่า 1,000+ ท่าน', 'โครงสร้างซุ้มไฟสว่างไสวทั่วงาน', 'โต๊ะผ้าปูสีน้ำเงินตัดโบว์น้ำเงิน', 'เสิร์ฟอาหารร้อนพร้อมกันทั่วถึง'],
    tableType: '100 - 300 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สนามกีฬา',
  },
  {
    id: 'blu4',
    title: 'ทางเดินพรมแดงกึ่งกลาง ขนาบด้วยเสาดอกไม้สด & โต๊ะจีนธีมฟ้าคราม',
    category: 'งานมงคลสมรส / ทางเดินพิธี',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีฟ้าครามซาติน 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-sky-500',
    image: '/images/portfolio/work-blue-flower-walkway.jpg',
    tag: 'พรมแดง & เสาดอกไม้ 🌊',
    description: 'การจัดผังโต๊ะจีนธีมสีฟ้าครามสดใสขนาบสองฝั่งทางเดินพรมแดง ตกแต่งด้วยเสาไฟประดับแจกันดอกไม้สด เก้าอี้คลุมขาวผูกโบว์ซาตินสีฟ้าครามสดชื่น',
    highlights: ['ทางเดินพรมแดงทอดยาวถึงเวที', 'เสาไฟประดับแจกันดอกไม้สดหรูหรา', 'เก้าอี้คลุมขาวผูกโบว์ฟ้าครามซาติน', 'ชุดผ้าปูโต๊ะลูกไม้สีทอง-ฟ้า'],
    tableType: '50 - 150 โต๊ะ',
    location: 'หอประชุม & ลานอเนกประสงค์',
  },
  {
    id: 'blu5',
    title: 'มุมสูงผังโต๊ะจีน 100+ โต๊ะ ธีมฟ้าคราม & เซ็ตจานเงินพรีเมียม VIP',
    category: 'ผังจัดเลี้ยงสเกลใหญ่',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีฟ้าคราม 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-sky-500',
    image: '/images/portfolio/work-blue-aerial-100tables.jpg',
    tag: 'งานใหญ่ 100+ โต๊ะ 🏛️',
    description: 'มุมสูงแสดงความโอ่อ่าของงานจัดเลี้ยงโต๊ะจีนกว่า 100 โต๊ะ จัดเรียง 4 แถวอย่างสมมาตร พร้อมโคลสอัพเซ็ตจานเงินพรีเมียม VIP ผ้าเช็ดปากและการ์ดรายการอาหาร',
    highlights: ['ผังโต๊ะ 100+ โต๊ะ สมมาตรสมบูรณ์แบบ', 'เซ็ตจานเงินรองพรีเมียม VIP', 'ทางเดินกว้างขวางเสิร์ฟสะดวกรวดเร็ว', 'ทีมบริกรดูแลประจำจุดทั่วถึง'],
    tableType: '100 - 300 โต๊ะ',
    location: 'ศูนย์ประชุม & หอประชุมใหญ่',
  },
  {
    id: 'blu6',
    title: 'บรรยากาศโต๊ะจีนธีมฟ้าครามในอาคารโดม พร้อมพรมแดงและซุ้มดอกไม้',
    category: 'งานแต่งงานในอาคาร',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีฟ้าคราม 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-sky-500',
    image: '/images/portfolio/work-blue-dome-carpet.jpg',
    tag: 'บรรยากาศโดมโอ่อ่า ✨',
    description: 'ภาพรวมงานจัดเลี้ยงโต๊ะจีนธีมสีฟ้าครามใต้หลังคาโดมสูงโปร่ง ตกแต่งด้วยไฟประดับหลากสีและพรมแดงนำเข้าสู่เวทีหลัก',
    highlights: ['อาคารโดมสูงโปร่ง อากาศถ่ายเทดี', 'ผังโต๊ะเป็นระเบียบสวยงาม', 'ระบบไฟตกแต่งบรรยากาศงานเลี้ยง', 'ฟรีอุปกรณ์ครบเซ็ตทุกราคา'],
    tableType: '50 - 200 โต๊ะ',
    location: 'โดมจัดเลี้ยง & ลานกิจกรรม',
  },
  {
    id: 'blu7',
    title: 'เซ็ตโต๊ะจัดเลี้ยงธีมฟ้าคราม แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง',
    category: 'เซ็ตโต๊ะ VIP & อุปกรณ์',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีฟ้าครามซาติน 💙',
    colorTheme: 'blue',
    colorThemeName: 'ธีมสีฟ้า (Ocean Blue Theme)',
    colorDotClass: 'bg-sky-500',
    image: '/images/portfolio/work-blue-tableware-detail.jpg',
    tag: 'ความประณีต 100% 💎',
    description: 'โคลสอัพความประณีตของชุดแก้วน้ำพับผ้าเช็ดปากทรงกรวยสีทองตัดกับโบว์เก้าอี้สีฟ้าคราม พร้อมมุมมองบรรยากาศโต๊ะจีนสุดอลังการ',
    highlights: ['ผ้าเช็ดปากพับทรงกรวยสีทองหรู', 'โบว์ซาตินสีฟ้าครามเงางาม', 'จานชามเมลามีนสะอาดเอี่ยม', 'น้ำดื่มและเครื่องดื่มพร้อมบริการ'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'จัดเลี้ยงทุกสถานที่ทั่วไทย',
  },

  // =========================================================================
  // 🌿 5. ธีมสีเขียว (Emerald Green Theme - 19 ผลงานจริง ไร้ภาพซ้ำ)
  // =========================================================================
  {
    id: 'grn-lime-ceramic-close',
    title: 'โคลสอัพเซ็ตถ้วยชามเซรามิก VIP ถ้วยน้ำชา & จานหมุนทองคำเงางาม',
    category: 'เซ็ตโต๊ะ VIP & ความประณีต',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-ceramic-tableware-closeup.jpg',
    tag: 'เซรามิก VIP ระดับภัตตาคาร 💎',
    description: 'โคลสอัพความประณีตระดับ 5 ดาว ชุดถ้วยชามเซรามิกสีขาวเนื้อเงา ถ้วยน้ำชาพร้อมจานรอง ถ้วยน้ำจิ้ม 4 หลุม ผ้าเช็ดปากทรงกรวยทอง และจานหมุนซาตินสีทองอร่าม',
    highlights: ['ชุดถ้วยชามเซรามิกโบนไชน่าเนื้อเงา', 'ผ้าเช็ดปากพับทรงกรวยทองคำวิจิตร', 'จานหมุนอาหารซาตินสีทองเงางาม', 'มาตรฐานความสะอาดสูงสุด 100%'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ห้องจัดเลี้ยง VIP & คฤหาสน์หรู',
  },
  {
    id: 'grn-lime-chandelier-hall',
    title: 'ภาพรวมห้องจัดเลี้ยงคฤหาสน์หรู โคมไฟแชนเดอเรียคริสตัลระย้า & โบว์เขียวตองอ่อน',
    category: 'งานเลี้ยงในห้องรับรองหรู',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-chandelier-mansion-hall.jpg',
    tag: 'แชนเดอเรียคริสตัลหรู 👑',
    description: 'ทัศนียภาพห้องจัดเลี้ยงระดับพรีเมียมในคฤหาสน์หรู โคมไฟแชนเดอเรียคริสตัลระย้า 2 ดวงส่องประกาย โต๊ะจีนผ้าปูสีเขียวมะนาว จานหมุนทองคำ เก้าอี้ผูกโบว์เขียวตองอ่อน',
    highlights: ['โคมไฟแชนเดอเรียคริสตัลระย้าหรูหรา', 'เพดานและประตูไม้สักทองทรงคุณค่า', 'โต๊ะกลมพร้อมจานหมุนกระจกทองคำ', 'เก้าอี้คลุมขาวผูกโบว์เขียวตองอ่อน'],
    tableType: '10 - 40 โต๊ะ',
    location: 'ห้องรับรองคฤหาสน์ & เรือนรับรองหรู',
  },
  {
    id: 'grn-lime-vip-table-front',
    title: 'โต๊ะจีนพรีเมียม VIP หน้าตรง ผ้าปูเขียวมะนาว จานหมุนทอง & เก้าอี้โบว์เขียวตองอ่อน',
    category: 'เซ็ตโต๊ะ VIP พรีเมียม',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-vip-table-frontview.jpg',
    tag: 'เซ็ตโต๊ะ VIP สมบูรณ์แบบ ✨',
    description: 'มุมมองหน้าตรงแสดงการจัดเซ็ตโต๊ะจีนพรีเมียม VIP ผ้าปูสีเขียวมะนาวสดชื่น คาดผ้ารองสีขาว จานหมุนอาหารสีทอง และเก้าอี้คลุมขาวผูกโบว์เขียวตองอ่อนเป็นระเบียบ',
    highlights: ['การจัดวางสมมาตรตามมาตรฐานสากล', 'ถ้วยแบ่งเซรามิกและช้อนสแตนเลส', 'แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง', 'เก้าอี้ผูกโบว์เขียวตองอ่อนปีกผีเสื้อ'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ห้องจัดเลี้ยง VIP & อาคารพิธี',
  },
  {
    id: 'grn-lime-mansion-wide',
    title: 'ผังโต๊ะจีนในห้องจัดเลี้ยงคฤหาสน์หรู ทอดตัวสู่ประตูไม้สักทอง',
    category: 'งานเลี้ยงในห้องรับรองหรู',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-mansion-perspective-wide.jpg',
    tag: 'ผังคฤหาสน์ไม้สักทอง 🏛️',
    description: 'บรรยากาศโอ่อ่าของการจัดเลี้ยงโต๊ะจีนในคฤหาสน์หรู ผังโต๊ะกลมสีเขียวมะนาวตัดทอง ทอดยาวสู่โถงบันไดไม้สักทองและประตูบานเฟี้ยมโบราณวิจิตร',
    highlights: ['บรรยากาศคฤหาสน์หรูทรงคุณค่า', 'โต๊ะจีนพร้อมจานหมุนสีทองอร่าม', 'เก้าอี้ผูกโบว์สีเขียวตองอ่อนสดใส', 'ทีมบริกรดูแลบริการอบอุ่น'],
    tableType: '20 - 50 โต๊ะ',
    location: 'ห้องจัดเลี้ยงคฤหาสน์ & เรือนไทยประยุกต์',
  },
  {
    id: 'grn-lime-vip-glass',
    title: 'เซ็ตโต๊ะ VIP แก้วไวน์ก้านใส แจกันดอกไม้สด & โบว์สีเขียวตองอ่อน',
    category: 'เซ็ตโต๊ะ VIP พรีเมียม',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-vip-glassware-detail.jpg',
    tag: 'เซ็ตโต๊ะ VIP กลางแจ้ง 💎',
    description: 'โคลสอัพความประณีตของโต๊ะจีนพรีเมียม VIP ผ้าปูสีเขียวอ่อน แก้วไวน์ก้านใสระดับสากล แจกันดอกไม้สดสีขาว-เขียว ผ้าเช็ดปากทรงพีระมิดขาว และฉากหลังเวทีคอนเสิร์ตประดับไฟสวยงาม',
    highlights: ['แก้วไวน์ก้านใสระดับภัตตาคาร 5 ดาว', 'แจกันดอกไม้สดประดับกึ่งกลางโต๊ะ', 'ผ้าเช็ดปากทรงพีระมิดขาวสะอาดตา', 'เก้าอี้ผูกโบว์เขียวตองอ่อนเงางาม'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & หน้าเวที',
  },
  {
    id: 'grn-lime-thai-mansion',
    title: 'โต๊ะจีนในห้องจัดเลี้ยงคฤหาสน์หรู จานหมุนทอง & โบว์สีเขียวตองอ่อน',
    category: 'งานเลี้ยงในห้องรับรองหรู',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-thai-mansion-hall.jpg',
    tag: 'คฤหาสน์หรู จานหมุนทอง 👑',
    description: 'การจัดโต๊ะจีนระดับไฮเอนด์ในห้องจัดเลี้ยงคฤหาสน์ไม้สักทอง โคมไฟแชนเดอเรียระย้า โต๊ะผ้าปูสีเขียวมะนาวสดใสพร้อมจานหมุนสีทองอร่าม เก้าอี้ผูกโบว์เขียวตองอ่อน',
    highlights: ['โต๊ะกลมพร้อมจานหมุนสีทองอร่าม', 'โคมไฟระย้าแชนเดอเรียคริสตัลหรูหรา', 'ผ้าเช็ดปากทรงกรวยทองลวดลายวิจิตร', 'เก้าอี้คลุมขาวผูกโบว์เขียวตองอ่อน'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ห้องรับรองคฤหาสน์ & เรือนรับรองหรู',
  },
  {
    id: 'grn-lime-twilight-concert',
    title: 'บรรยากาศโต๊ะจีนกลางแจ้งยามพลบค่ำหน้าเวทีคอนเสิร์ต ไฟวอร์มไวท์สวยงาม',
    category: 'คอนเสิร์ต & งานเลี้ยงใหญ่กลางแจ้ง',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-twilight-concert-warmglow.jpg',
    tag: 'บรรยากาศพลบค่ำ Twilight ✨',
    description: 'ทัศนียภาพความงดงามยามพลบค่ำของงานจัดเลี้ยงโต๊ะจีนหน้าเวทีคอนเสิร์ต แสงไฟวอร์มไวท์ประดับกิ่งไม้และเวทีสว่างไสว สะท้อนโบว์เก้าอี้สีเขียวตองอ่อนสุดโรแมนติก',
    highlights: ['ไฟวอร์มไวท์ประดับบรรยากาศอบอุ่น', 'ผังโต๊ะคู่ขนานหน้าเวทีคอนเสิร์ต', 'เก้าอี้ผูกโบว์เขียวตองอ่อนตรงแนว', 'ทีมงานบริกรพร้อมเสิร์ฟตลอดงาน'],
    tableType: '50 - 200 โต๊ะ',
    location: 'ลานคอนเสิร์ต & สวนกลางแจ้ง',
  },
  {
    id: 'grn-lime-villa-panoramic',
    title: 'ผังโต๊ะจีนหน้าอาคารวิลล่าหรู & โคลสอัพโบว์สีเขียวตองอ่อน',
    category: 'งานจัดเลี้ยงหน้าอาคารวิลล่า',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-villa-panoramic-tables.jpg',
    tag: 'วิลล่าหรู 50+ โต๊ะ 🏡',
    description: 'ผังจัดเลี้ยงโต๊ะจีนหลายสิบโต๊ะหน้าอาคารวิลล่าหรูสองชั้น โต๊ะผ้าปูลูกไม้สีเขียวอ่อน เก้าอี้ผูกโบว์สีเขียวตองอ่อน พร้อมโคลสอัพความประณีตของโบว์เก้าอี้และชุดจานชาม',
    highlights: ['ผังโต๊ะหน้าอาคารวิลล่าหรูเป็นระเบียบ', 'ผ้าปูลูกไม้สีเขียวอ่อนสะอาดตา', 'เก้าอี้ผูกโบว์เขียวตองอ่อนปีกผีเสื้อ', 'เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ'],
    tableType: '40 - 120 โต๊ะ',
    location: 'ลานจัดเลี้ยงวิลล่า & สวนสวย',
  },
  {
    id: 'grn-lime1',
    title: 'จัดเลี้ยงโต๊ะจีนกลางแจ้งหน้าเวทีคอนเสิร์ต ธีมโบว์สีเขียวตองอ่อนสดใส',
    category: 'งานจัดเลี้ยงกลางแจ้งหน้าเวที',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-walkway-concert.jpg',
    tag: 'เขียวตองอ่อนสดใส 🌿',
    description: 'ทัศนียภาพทางเดินตรงกลางมุ่งสู่เวทีคอนเสิร์ตยามเย็น โต๊ะจีนผ้าปูลูกไม้สีเขียวอ่อน เก้าอี้คลุมขาวผูกโบว์ซาตินสีเขียวตองอ่อนสะท้อนแสงไฟและท้องฟ้ายามเย็น',
    highlights: ['ทางเดินพรมทางเดินกว้างขวาง', 'เก้าอี้ผูกโบว์เขียวตองอ่อนปีกผีเสื้อ', 'ผ้าปูลูกไม้สีเขียวอ่อนนวลตา', 'ทีมงานบริกรดูแลตลอดงานเลี้ยง'],
    tableType: '50 - 150 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สวนสวย',
  },
  {
    id: 'grn-lime2',
    title: 'บรรยากาศโต๊ะจีนหน้าอาคารวิลล่าหรู ธีมโบว์สีเขียวตองอ่อน & แจกันดอกไม้ขาว',
    category: 'งานจัดเลี้ยงหน้าอาคารวิลล่า',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-villa-garden.jpg',
    tag: 'งานเลี้ยงสไตล์การ์เด้น 🏡',
    description: 'ภาพรวมงานจัดเลี้ยงโต๊ะจีนธีมสีเขียวตองอ่อนหน้าอาคารสไตล์โมเดิร์นวิลล่า โต๊ะอาหารประดับแจกันดอกไม้สดสีขาวบริสุทธิ์ บรรยากาศร่มรื่นและอบอุ่น',
    highlights: ['แจกันดอกไม้สดสีขาวกลางโต๊ะ', 'เก้าอี้ผูกโบว์เขียวตองอ่อนสดชื่น', 'จัดวางเป็นสัดส่วนสะอาดสะอ้าน', 'บริการระดับพรีเมียม'],
    tableType: '20 - 80 โต๊ะ',
    location: 'สวนหน้าวิลล่า & ลานกิจกรรม',
  },
  {
    id: 'grn-lime3',
    title: 'เซ็ตโต๊ะจัดเลี้ยงกลางแจ้งยามเย็นหน้าเวที ธีมโบว์สีเขียวตองอ่อน',
    category: 'งานเลี้ยงกลางแจ้งยามเย็น',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีเขียวตองอ่อน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-lime-500',
    image: '/images/portfolio/work-green-lime-outdoor-sunset.jpg',
    tag: 'งานเลี้ยง Sunset 🌅',
    description: 'การจัดวางโต๊ะจีนกลมผ้าลูกไม้สีเขียวอ่อน เก้าอี้คลุมขาวผูกโบว์สีเขียวตองอ่อนใต้ต้นไม้ใหญ่และแสงธรรมชาติยามเย็น พร้อมอุปกรณ์ครบเซ็ต',
    highlights: ['โต๊ะกลมผ้าปูลูกไม้สีเขียวอ่อน', 'แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง', 'เก้าอี้ผูกโบว์เขียวตองอ่อนเงางาม', 'เสิร์ฟอาหารสดใหม่จากครัวสนาม'],
    tableType: '30 - 100 โต๊ะ',
    location: 'ลานจัดเลี้ยงกลางแจ้ง & สวนสวย',
  },
  {
    id: 'grn-mint-ballroom',
    title: 'ภาพรวมจัดเลี้ยงโต๊ะจีนธีมเขียวมินต์พาสเทลในห้องแกรนด์ฮอลล์ใหญ่',
    category: 'งานเลี้ยงในห้องแกรนด์ฮอลล์',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเขียวมินต์พาสเทล 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-emerald-500',
    image: '/images/portfolio/work-green-mint-ballroom-panoramic.jpg',
    tag: 'แกรนด์ฮอลล์พาสเทล ✨',
    description: 'ภาพรวมบรรยากาศงานจัดเลี้ยงโต๊ะจีนหลายสิบโต๊ะในห้องแกรนด์ฮอลล์ใหญ่ ธีมสีเขียวมินต์พาสเทล ผังโต๊ะกลมสะอาดสะอ้าน เก้าอี้ทุกตัวผูกโบว์เขียวมินต์งดงาม',
    highlights: ['ผังโต๊ะห้องแกรนด์ฮอลล์ 30+ โต๊ะ', 'ผ้าปูโต๊ะสีเขียวมินต์พาสเทล', 'เก้าอี้คลุมขาวผูกโบว์เขียวมินต์', 'ทีมบริกรดูแลบริการอบอุ่น'],
    tableType: '30 - 100 โต๊ะ',
    location: 'ห้องแกรนด์ฮอลล์ & อาคารจัดเลี้ยง',
  },
  {
    id: 'grn-mint1',
    title: 'เซ็ตโต๊ะจีนธีมเขียวมินต์พาสเทล แก้วไวน์ก้านใส & ผ้าเช็ดปากทรงกรวยทอง',
    category: 'เซ็ตโต๊ะอาหาร & เครื่องดื่ม',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเขียวมินต์พาสเทล 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-emerald-500',
    image: '/images/portfolio/work-green-mint-glassware-detail.jpg',
    tag: 'เขียวมินต์พาสเทล 🌿',
    description: 'โคลสอัพความประณีตของโต๊ะจีนผ้าซาตินสีเขียวมินต์พาสเทล เก้าอี้ผูกโบว์เขียวมินต์ แก้วไวน์ก้านใส 2 ทรง ช้อนส้อมสแตนเลส และผ้าเช็ดปากทรงกรวยทองคำ',
    highlights: ['ผ้าปูโต๊ะซาตินสีเขียวมินต์หวานละมุน', 'เก้าอี้คลุมขาวผูกโบว์เขียวมินต์ซาติน', 'แก้วก้านไวน์ใสระดับสากล', 'ถ้วยแบ่งเซรามิกขาวสะอาดเอี่ยม'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ห้องจัดเลี้ยง & โรงแรมหรู',
  },
  {
    id: 'grn-mint2',
    title: 'ภาพรวมจัดเลี้ยงโต๊ะจีนธีมเขียวมินต์ในห้องจัดเลี้ยงหรู แจกันดอกไม้ & เชิงเทียน',
    category: 'งานเลี้ยงในห้องแกรนด์บอลรูม',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเขียวมินต์ซาติน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-emerald-500',
    image: '/images/portfolio/work-green-mint-hall-grand.jpg',
    tag: 'แกรนด์บอลรูมหรู 👑',
    description: 'บรรยากาศงานจัดเลี้ยงโต๊ะจีนธีมสีเขียวมินต์พาสเทลในห้องแกรนด์บอลรูม ประดับแจกันดอกไม้สดและเชิงเทียนสุดโรแมนติก เก้าอี้ทุกตัวผูกโบว์เขียวมินต์เป็นระเบียบ',
    highlights: ['แจกันดอกไม้สด & เชิงเทียนกลางโต๊ะ', 'เก้าอี้ผูกโบว์เขียวมินต์ทรงปีกผีเสื้อ', 'เซ็ตเครื่องดื่มและขวดน้ำอัดลมพร้อมเสิร์ฟ', 'บริการระดับภัตตาคาร 5 ดาว'],
    tableType: '30 - 100 โต๊ะ',
    location: 'ห้องแกรนด์บอลรูม & ศูนย์ประชุม',
  },
  {
    id: 'grn-mint3',
    title: 'มุมสูง Top View โต๊ะจีนธีมเขียวมินต์ เก้าอี้ผูกโบว์เขียวมินต์ & เซ็ตเครื่องดื่ม',
    category: 'ผังจัดเลี้ยง Top View',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเขียวมินต์ 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-emerald-500',
    image: '/images/portfolio/work-green-mint-topview-table.jpg',
    tag: 'เซ็ตโต๊ะ Top View 📐',
    description: 'มุมสูงแบบ Top View แสดงการจัดวางโต๊ะจีนผ้าซาตินสีเขียวมินต์ เก้าอี้คลุมขาวคาดแถบและผูกโบว์เขียวมินต์ ถ้วยน้ำจิ้ม ช้อนกลาง และเครื่องดื่มครบครัน',
    highlights: ['การจัดวางสมมาตรตามหลักสุขอนามัย', 'แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง', 'ขวดน้ำดื่มและน้ำอัดลมพร้อมเสิร์ฟ', 'เก้าอี้คาดแถบโบว์เขียวมินต์สวยงาม'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'อาคารจัดเลี้ยง & งานมงคล',
  },
  {
    id: 'grn1',
    title: 'เซ็ตโต๊ะ VIP แก้วไวน์ก้านใส 3 ใบ & โต๊ะจีนผ้าซาตินเขียวมรกต',
    category: 'เซ็ตโต๊ะ VIP พรีเมียม',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเขียวมรกตซาติน 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-emerald-500',
    image: '/images/portfolio/work-green-vip-wineglass-luxury.jpg',
    tag: 'ความหรูหราระดับ VIP 💎',
    description: 'การจัดโต๊ะจีนระดับภัตตาคาร 5 ดาว ผ้าปูโต๊ะซาตินสีเขียวมรกตเงางาม แก้วก้านไวน์ใส 3 ทรง จานเงินรองพรีเมียม VIP และผ้าเช็ดปากทรงหงส์ประดับห่วงหยกเขียววิจิตร',
    highlights: ['แก้วไวน์ก้านใสระดับสากล 3 ใบ/ที่นั่ง', 'ผ้าเช็ดปากประดับห่วงหยกเขียวมรกต', 'จานเงินรองพรีเมียม VIP เกรดส่งออก', 'เก้าอี้คลุมผ้าขาวผูกโบว์เขียวมรกต'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'ห้องจัดเลี้ยง VIP & โรงแรมหรู',
  },
  {
    id: 'grn2',
    title: 'เซ็ตจานเงินพรีเมียม VIP ห่วงหยก & ผังโต๊ะจีนสีเขียวมรกต',
    category: 'เซ็ตโต๊ะอาหาร VIP',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเขียวมรกต 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-emerald-500',
    image: '/images/portfolio/work-green-vip-tableware-detail.jpg',
    tag: 'เซ็ตจานเงิน VIP 🌿',
    description: 'โคลสอัพเซ็ตจานเงินรองพรีเมียม ช้อนส้อมสแตนเลสขัดเงา และผ้าเช็ดปากสีขาวพับประณีตสวมห่วงหยกเขียว พร้อมมุมมองผังโต๊ะจีนสีเขียวมรกตในอาคาร',
    highlights: ['ชุดจานเงินรองขอบมนประณีต', 'ห่วงหยกเขียวมรกตลายไทยวิจิตร', 'ช้อนส้อมสแตนเลสสะอาดเอี่ยม', 'ฟรีอุปกรณ์ครบเซ็ตทุกราคา'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'หอประชุม & งานเลี้ยงมงคล',
  },
  {
    id: 'grn3',
    title: 'เซ็ตโต๊ะ VIP ผ้าเช็ดปากประดับห่วงหยกเขียว & แก้วไวน์ก้านใส',
    category: 'เซ็ตโต๊ะ VIP พรีเมียม',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีเขียวมรกต 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-emerald-500',
    image: '/images/portfolio/work-green-vip-emerald-napkin.jpg',
    tag: 'หยกมรกต VIP 🌿',
    description: 'การจัดโต๊ะจีนระดับภัตตาคาร ผ้าปูโต๊ะสีเขียวมรกตหรูหรา แก้วไวน์ก้านใสระดับสากล จานชามเมลามีนเกรดส่งออก และการพับผ้าเช็ดปากทรงหงส์ประดับห่วงหยกเขียว',
    highlights: ['ผ้าเช็ดปากประดับห่วงหยกเขียวมรกต', 'แก้วก้านไวน์ใสระดับภัตตาคาร', 'จานชามเมลามีนเกรดส่งออก', 'เก้าอี้คลุมผ้าขาวผูกโบว์เขียวมรกต'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'หอประชุม & งานเลี้ยงรับรอง VIP',
  },
  {
    id: 'grn4',
    title: 'แนวแถวโต๊ะจีนธีมสีเขียวมรกตในหอประชุมใหญ่ เป็นระเบียบสวยงาม',
    category: 'งานเลี้ยงในอาคาร',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีเขียวมรกต 🌿',
    colorTheme: 'green',
    colorThemeName: 'ธีมสีเขียว (Emerald Green Theme)',
    colorDotClass: 'bg-emerald-500',
    image: '/images/portfolio/work-green-hall-perspective.jpg',
    tag: 'ผังหอประชุมใหญ่ 🏛️',
    description: 'ทัศนียภาพแนวแถวโต๊ะจีนธีมสีเขียวมรกตในหอประชุมใหญ่ สะท้อนความสดชื่น ร่มรื่น และหรูหรา ทางเดินตรงกลางกว้างขวาง เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ',
    highlights: ['ผังโต๊ะมาตรฐาน ทางเดินกว้างขวาง', 'ผ้าปูโต๊ะสีเขียวมรกตสดชื่น', 'พัดลมและระบบระบายอากาศทั่วถึง', 'ทีมบริกรดูแลตลอดงาน'],
    tableType: '50 - 200 โต๊ะ',
    location: 'หอประชุมใหญ่ & ศูนย์ประชุม',
  },

  // =========================================================================
  // 🔴 6. ธีมสีแดงมงคล (Imperial Red Theme - 4 ผลงานจริง ไร้ภาพซ้ำ)
  // =========================================================================
  {
    id: 'red1',
    title: 'ผังจัดเลี้ยงโต๊ะจีนสเกลใหญ่ในเต็นท์พิธี ธีมสีแดงมงคลหรูหรา',
    category: 'งานมงคล / งานบุญพิธี',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีแดงมงคลซาติน 🔴',
    colorTheme: 'red',
    colorThemeName: 'ธีมสีแดง (Imperial Red Theme)',
    colorDotClass: 'bg-red-600',
    image: '/images/portfolio/work-red-tent-wide.jpg',
    tag: 'มงคลมั่งคั่ง 🔴',
    description: 'บรรยากาศงานจัดเลี้ยงโต๊ะจีนในเต็นท์พิธีทรงโค้ง ผังโต๊ะผ้าปูสีแดงซาตินมงคล เก้าอี้คลุมขาวผูกโบว์แดงเงางาม แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง',
    highlights: ['ผ้าปูโต๊ะซาตินสีแดงมงคลเงางาม', 'เก้าอี้คลุมขาวผูกโบว์แดงซาติน', 'ผ้าเช็ดปากทรงกรวยสีทองตัดแดงหรูหรา', 'เสิร์ฟอาหารร้อนพร้อมกันทุกโต๊ะ'],
    tableType: '30 - 150 โต๊ะ',
    location: 'ลานพิธี & วัด / อาคารอเนกประสงค์',
  },
  {
    id: 'red2',
    title: 'จัดเลี้ยงโต๊ะจีนธีมสีแดงซาตินมงคล หน้าอาคารพิธีสงฆ์',
    category: 'งานบุญ / งานพิธีการ',
    locationType: 'outdoor',
    locationTypeName: '🌅 กลางแจ้ง & เต็นท์พิธี',
    bowColorName: 'โบว์สีแดงสดใส 🔴',
    colorTheme: 'red',
    colorThemeName: 'ธีมสีแดง (Imperial Red Theme)',
    colorDotClass: 'bg-red-600',
    image: '/images/portfolio/work-red-temple-front.jpg',
    tag: 'งานบุญประเพณี ✨',
    description: 'การจัดโต๊ะจีนในเต็นท์พิธีงานบุญฉลอง จัดวางเป็นสัดส่วนสะอาดสะอ้าน ผ้าปูแดงเลือดหมูตัดกับโบว์เก้าอี้สีแดงสดใส พร้อมชุดเครื่องดื่มและถ้วยน้ำจิ้ม',
    highlights: ['ผังโต๊ะระเบียบเรียบร้อย', 'ชุดจานชามเมลามีนสะอาดเอี่ยม', 'น้ำดื่มและเครื่องดื่มจัดวางพร้อมเสิร์ฟ', 'ทีมบริกรดูแลตลอดงาน'],
    tableType: '20 - 80 โต๊ะ',
    location: 'ลานพิธีการ & กลางแจ้ง',
  },
  {
    id: 'red3',
    title: 'ความประณีตเก้าอี้ผูกโบว์ซาตินสีแดงโรสโกลด์ & เซ็ตโต๊ะจีนพรีเมียม',
    category: 'รายละเอียดอุปกรณ์ VIP',
    locationType: 'vip_details',
    locationTypeName: '💎 เซ็ตโต๊ะ VIP & ความประณีต',
    bowColorName: 'โบว์สีแดงโรสโกลด์ 🔴',
    colorTheme: 'red',
    colorThemeName: 'ธีมสีแดง (Imperial Red Theme)',
    colorDotClass: 'bg-red-600',
    image: '/images/portfolio/work-red-rosegold-detail.jpg',
    tag: 'ความประณีต 100% 💎',
    description: 'โคลสอัพการผูกโบว์ซาตินสีแดงโรสโกลด์เงางามด้านหลังเก้าอี้ และการจัดวางชุดถ้วยแบ่งช้อนกลางและแก้วน้ำใสบนโต๊ะผ้าซาตินสีแดง',
    highlights: ['โบว์ซาตินแดงโรสโกลด์เงางาม', 'ผ้าคลุมเก้าอี้สีขาวสะอาดไร้รอยยับ', 'ชุดถ้วยแบ่งและช้อนสแตนเลส', 'ฟรีสำหรับลูกค้าทุกแพ็กเกจ'],
    tableType: '10 ท่าน / โต๊ะ',
    location: 'จัดเลี้ยงทุกสถานที่ทั่วไทย',
  },
  {
    id: 'red4',
    title: 'ภาพรวมผังโต๊ะจีนธีมสีแดงโรสโกลด์ในเต็นท์พิธี & โคลสอัพโต๊ะอาหาร',
    category: 'งานมงคล / งานเลี้ยง',
    locationType: 'indoor',
    locationTypeName: '🏛️ ในอาคาร & โดมพิธี',
    bowColorName: 'โบว์สีแดงโรสโกลด์ 🔴',
    colorTheme: 'red',
    colorThemeName: 'ธีมสีแดง (Imperial Red Theme)',
    colorDotClass: 'bg-red-600',
    image: '/images/portfolio/work-red-rosegold-grand.jpg',
    tag: 'ผังเต็นท์พิธีหรู 🎪',
    description: 'ภาพรวมบรรยากาศงานจัดเลี้ยงโต๊ะจีนหลายสิบโต๊ะในเต็นท์พิธีทรงโค้ง จัดวางผังโต๊ะคู่ขนานสองฝั่ง พร้อมโคลสอัพความเงางามของผ้าปูโต๊ะซาตินสีแดงโรสโกลด์',
    highlights: ['ผังโต๊ะคู่ขนาน ทางเดินกลางกว้างขวาง', 'ผ้าปูโต๊ะซาตินสีแดงโรสโกลด์พรีเมียม', 'แก้วน้ำพับผ้าเช็ดปากทรงกรวยทอง', 'บริการครบวงจรทั่วไทย'],
    tableType: '30 - 120 โต๊ะ',
    location: 'ลานพิธี & เต็นท์โดม',
  },

  // =========================================================================
  // 🎪 7. ธีมงานมหกรรม 300+ โต๊ะ (Mega Banquets Theme - 2 ผลงานจริง ไร้ภาพซ้ำ)
  // =========================================================================
  {
    id: 'mega1',
    title: 'มหกรรมงานจัดเลี้ยงโต๊ะจีน 300+ โต๊ะ หลายโซนหลากสีสัน ซุ้มไฟพิกุลยักษ์',
    category: 'มหกรรมจัดเลี้ยงสเกลใหญ่',
    locationType: 'mega_banquet',
    locationTypeName: '🎪 งานมหกรรม 300+ โต๊ะ',
    bowColorName: 'โบว์หลากสีแยกตามโซน 🎪',
    colorTheme: 'multi',
    colorThemeName: 'มหกรรม 300+ โต๊ะ',
    colorDotClass: 'bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500',
    image: '/images/portfolio/work-mega-banquet-300tables-multitheme.jpg',
    tag: 'งานใหญ่ 300+ โต๊ะ 🔥',
    description: 'ภาพรวมมหกรรมจัดเลี้ยงโต๊ะจีนสเกลยักษ์กว่า 300 โต๊ะ แบ่งโซนสีสันอย่างเป็นระเบียบ (โซนน้ำเงิน, โซนเขียว, โซนม่วง, โซนแดง) พร้อมโครงสร้างซุ้มไฟพิกุลยักษ์สว่างไสว สะท้อนศักยภาพการจัดเลี้ยงระดับประเทศ',
    highlights: ['รองรับแขกกว่า 3,000+ ท่าน', 'แบ่งโซนสีสันชัดเจนสวยงาม', 'ครัวสนามขนาดใหญ่เสิร์ฟพร้อมกัน', 'ทีมบริกรและกัปตันกว่า 100 ชีวิต'],
    tableType: '300 - 600 โต๊ะ',
    location: 'ลานจัดแสดงสินค้า & สนามกีฬาใหญ่',
  },
  {
    id: 'mega2',
    title: 'งานจัดเลี้ยงสเกลใหญ่ 300+ โต๊ะ หน้าเวทีคอนเสิร์ตใหญ่ระดับประเทศ',
    category: 'งานคอนเสิร์ต & งานเลี้ยงใหญ่',
    locationType: 'mega_banquet',
    locationTypeName: '🎪 งานมหกรรม 300+ โต๊ะ',
    bowColorName: 'โบว์หลากสีหน้าเวที 🎪',
    colorTheme: 'multi',
    colorThemeName: 'มหกรรม 300+ โต๊ะ',
    colorDotClass: 'bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500',
    image: '/images/portfolio/work-mega-banquet-stage-perspective.jpg',
    tag: 'คอนเสิร์ตใหญ่ 300+ โต๊ะ 🌟',
    description: 'ทัศนียภาพความอลังการของงานจัดเลี้ยงโต๊ะจีนหน้าเวทีคอนเสิร์ตใหญ่ระดับประเทศ ผังโต๊ะหลายร้อยโต๊ะจัดวางเป็นแนวสมมาตร รถขนส่งและทีมงานมืออาชีพดูแลตลอดงาน',
    highlights: ['ผังโต๊ะคู่ขนานหน้าเวทีคอนเสิร์ต', 'ระบบเสียงและไฟจัดเลี้ยงระดับสากล', 'เสิร์ฟอาหารร้อนสดใหม่ทุกโต๊ะ', 'ประสบการณ์กว่า 35 ปีการันตีคุณภาพ'],
    tableType: '200 - 500 โต๊ะ',
    location: 'ลานคอนเสิร์ต & มหกรรมจัดเลี้ยง',
  },
];

// Reusable Official Brand Watermark Badge
const WatermarkBadge: React.FC<{ isLarge?: boolean }> = ({ isLarge = false }) => {
  return (
    <div className={`absolute bottom-3 right-3 z-10 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border-2 border-amber-400/80 shadow-2xl ${
      isLarge ? 'scale-105 sm:scale-115 origin-bottom-right' : 'scale-90 sm:scale-100 origin-bottom-right'
    }`}>
      <div className="w-6 h-6 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 shadow-xs border border-amber-300">
        <img
          src="/images/brand/logo.png"
          alt="โลโก้ โต๊ะจีน รพีพัฒน์"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-left leading-none">
        <div className="text-[10.5px] font-black text-amber-300 tracking-wide uppercase">
          โต๊ะจีน รพีพัฒน์ พรีเมียม
        </div>
        <div className="text-[8.5px] font-bold text-slate-200 mt-0.5">
          © ผลงานจริง 100% • โทร 081-331-1646
        </div>
      </div>
    </div>
  );
};

export const PortfolioGallery: React.FC = () => {
  // Default to gold theme
  const [selectedTheme, setSelectedTheme] = useState<string>('purple');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active Master Theme Metadata
  const currentMasterTheme = MASTER_COLOR_THEMES.find((a) => a.id === selectedTheme) || MASTER_COLOR_THEMES[0];

  // Filtered portfolio items strictly belonging to the selected theme
  const filteredItems = PORTFOLIO_DATA.filter((item) => {
    return item.colorTheme === selectedTheme;
  });

  const currentItem = filteredItems[currentIndex] || filteredItems[0] || PORTFOLIO_DATA[0];

  // Auto-play Slider within the active theme
  useEffect(() => {
    if (isPlaying && filteredItems.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
      }, 4500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, filteredItems.length]);

  // Reset slider index when theme changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedTheme]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
      if (e.key === 'ArrowRight') handleLightboxNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const handleLightboxPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : (prev || 1) - 1));
  };

  const handleLightboxNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev || 0) + 1) % filteredItems.length);
  };

  return (
    <section id="portfolio" className="py-20 relative border-t-2 border-amber-300/40 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* Modern Section Header (Keyword ดีไซน์ทันสมัย) */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>5 SIGNATURE COLOR THEMES • ผลงานจริง 100%</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ผลงานจัดเลี้ยงระดับพรีเมียม
            <span className="block mt-1 text-gradient-red-gold">
              6 อัลบั้มผลงานยอดนิยม & จัดงานได้ถึง 750 โต๊ะ/วัน
            </span>
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-medium">
            สัมผัสความประณีตระดับภัตตาคาร 5 ดาว ครบครัน 5 โทนสี: <strong>ธีมสีม่วง</strong>, <strong>ธีมสีทอง</strong>, <strong>ธีมสีชมพู</strong>, <strong>ธีมสีฟ้า</strong> และ <strong>ธีมสีเขียว</strong>
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🎨 1. THE 5 MASTER COLOR THEME DECK (การ์ด 5 ธีมสีหลัก สวยงามทันสมัย) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-red-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                เลือกชมผลงานตามอัลบั้มจัดเลี้ยง (6 อัลบั้มยอดนิยม):
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">คลิกเลือกดูธีมสีที่ต้องการ</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {MASTER_COLOR_THEMES.map((theme) => {
              const isActive = selectedTheme === theme.id;
              const photoCount = PORTFOLIO_DATA.filter((p) => p.colorTheme === theme.id).length;

              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between p-3.5 sm:p-4 group shadow-md hover:shadow-2xl transform ${
                    isActive
                      ? `border-3 ${theme.borderAccent} scale-103 shadow-xl ring-4 ring-amber-300/50 bg-slate-950 text-white`
                      : 'border-2 border-slate-200 hover:border-amber-300 bg-white text-slate-900 hover:-translate-y-1'
                  }`}
                >
                  {/* Background Cover Thumbnail for Active / Hover */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-3 bg-slate-900">
                    <img
                      src={theme.coverImage}
                      alt={theme.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isActive ? 'scale-108' : 'group-hover:scale-105 opacity-90'
                      }`}
                    />
                    <WatermarkOverlay size="sm" opacity={0.4} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Badge Count on Thumbnail */}
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black border border-white/20">
                      {photoCount} ภาพผลงานจริง
                    </div>

                    {/* Active Checkmark Pill */}
                    {isActive && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Theme Name & Subtitle */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{theme.iconEmoji}</span>
                      <h4 className={`text-xs sm:text-sm font-black leading-tight truncate ${
                        isActive ? 'text-amber-300' : 'text-slate-900 group-hover:text-red-700'
                      }`}>
                        {theme.shortName}
                      </h4>
                    </div>
                    <p className={`text-[10.5px] line-clamp-1 font-medium ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {theme.tagline}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 2. ACTIVE THEME SHOWCASE HERO HEADER (DYNAMIC DETAILS PER THEME) */}
        {/* ========================================================================= */}
        <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${currentMasterTheme.accentBg} text-white border-2 border-amber-300 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden`}>
          <div className="space-y-2 relative z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 border border-white/20 ${currentMasterTheme.badgeBg}`}>
                <span>{currentMasterTheme.iconEmoji}</span>
                <span>{currentMasterTheme.name}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-black/50 text-amber-300 text-xs font-bold border border-amber-300/40">
                รวม {filteredItems.length} ภาพผลงานจริง ไร้ภาพซ้ำ
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentMasterTheme.tagline}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {currentMasterTheme.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0 w-full md:w-auto">
            <a
              href="#quotation-builder"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 border border-amber-300"
            >
              <span>เลือกจัดเลี้ยงธีมนี้</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 3. FEATURED HIGHLIGHT SLIDER FOR ACTIVE THEME */}
        {/* ========================================================================= */}
        {filteredItems.length > 0 && (
          <div
            className="relative rounded-3xl bg-white border-2 border-amber-300 shadow-2xl overflow-hidden"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            <div className="grid lg:grid-cols-12 items-stretch">
              
              {/* Left: Large Image Showcase with Full-Frame Cover Fill */}
              <div className="lg:col-span-7 relative h-[360px] sm:h-[460px] lg:h-[550px] w-full overflow-hidden bg-slate-950 group">
                <img
                  key={currentItem.id}
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover object-center animate-fadeIn duration-500 transform group-hover:scale-105 transition-transform"
                />
                <WatermarkOverlay size="lg" opacity={0.43} />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* 🏷️ Top Tag Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-red-600/95 backdrop-blur-md text-white text-xs font-black shadow-md flex items-center gap-1.5 border border-red-400">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>{currentItem.tag}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-300/40">
                    {currentItem.bowColorName}
                  </span>
                </div>

                {/* 💧 BRAND WATERMARK ON IMAGE */}
                <WatermarkBadge isLarge={true} />

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-4 left-4 right-48 flex items-center justify-between text-white">
                  <div>
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${currentItem.colorDotClass}`} />
                      <span>{currentItem.colorThemeName}</span>
                    </div>
                    <div className="text-base sm:text-lg font-black truncate max-w-md mt-0.5">
                      {currentItem.title}
                    </div>
                  </div>
                </div>

                {/* Lightbox Trigger Button */}
                <button
                  type="button"
                  onClick={() => openLightbox(currentIndex)}
                  className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 text-xs font-black border border-white/20 cursor-pointer"
                  title="ดูภาพขยายใหญ่ Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">ดูภาพขยาย</span>
                </button>

                {/* Prev / Next Floating Arrows */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-black/50 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-lg border border-white/20 cursor-pointer"
                  title="ภาพก่อนหน้า"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-black/50 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-lg border border-white/20 cursor-pointer"
                  title="ภาพถัดไป"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Right: Detailed Information Card */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-700 uppercase tracking-wider bg-red-50 px-3.5 py-1 rounded-full border-2 border-red-200 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${currentItem.colorDotClass}`} />
                      <span>{currentItem.colorThemeName}</span>
                    </span>
                    
                    {/* Auto-play toggle */}
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-red-600" />}
                      <span>{isPlaying ? 'พักสไลด์' : 'เล่นต่อ'}</span>
                    </button>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {currentItem.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {currentItem.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-2 pt-2 border-t border-amber-100">
                    <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      อุปกรณ์ & การบริการที่รวมในแพ็กเกจ:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentItem.highlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs font-bold text-slate-800"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>{currentItem.location}</span>
                  </div>

                  <a
                    href="#quotation-builder"
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-red-glow flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-95 border border-amber-300"
                  >
                    <span>เลือกจัดเลี้ยงธีมนี้ & ออกใบเสนอราคา</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 📸 4. COMPLETE PHOTO GALLERY FOR ACTIVE THEME (100% FULL FRAME • ZERO DUPLICATES) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-red-600" />
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                รวมภาพถ่ายจริงใน {currentMasterTheme.name} ({filteredItems.length} ผลงานจริง)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">คลิกที่รูปเพื่อเปิดดูภาพขยายใหญ่แบบเต็มกรอบ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-3xl bg-white border-2 border-amber-200/90 hover:border-amber-400 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container with Full-Frame Fill */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                  <WatermarkOverlay size="md" opacity={0.42} />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black border border-white/20 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.colorDotClass}`} />
                      <span>{item.bowColorName}</span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black shadow-xs">
                      {item.tag}
                    </span>
                  </div>

                  {/* 💧 WATERMARK BADGE ON EVERY CARD */}
                  <WatermarkBadge isLarge={false} />

                  {/* Hover Eye Icon Overlay */}
                  <div className="absolute inset-0 bg-red-950/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="p-3 rounded-full bg-white text-red-700 shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 sm:p-5 space-y-2 bg-white">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide flex items-center justify-between">
                    <span>{item.locationTypeName}</span>
                    <span className="text-slate-500 font-medium">{item.bowColorName}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-red-700 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Equipment Note Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-xl border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner border border-amber-300">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black">
                ฟรี! อุปกรณ์ครบชุด โต๊ะ เก้าอี้พร้อมผ้าคลุมผูกโบว์ ทุกแพ็กเกจราคา
              </h4>
              <p className="text-xs text-red-100 font-medium">
                เลือกสีโบว์ผูกเก้าอี้และธีมผ้าปูโต๊ะได้ตามต้องการ (สีม่วง, สีทอง, สีชมพู, สีฟ้า, สีเขียว) โดยไม่มีค่าใช้จ่ายเพิ่ม
              </p>
            </div>
          </div>

          <a
            href="#quotation-builder"
            className="px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-red-700 font-black text-xs shadow-md shrink-0 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 border border-amber-300"
          >
            <span>คำนวณราคาโต๊ะจีน</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🔍 FULLSCREEN IMMERSIVE LIGHTBOX MODAL (NO BLACK GAPS • 100% FULL FRAME) */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-scaleUp border-2 border-amber-300 max-h-[92vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-30 p-3 rounded-full bg-slate-900/80 hover:bg-red-600 text-white transition-colors border border-white/30 cursor-pointer shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Body Grid: Side-by-Side on Desktop */}
            <div className="grid lg:grid-cols-12 items-stretch overflow-hidden flex-1 max-h-[92vh]">
              
              {/* Left/Center: 100% Full-Frame Edge-to-Edge Image (No Black Gaps) */}
              <div className="lg:col-span-7 relative bg-slate-900 flex items-stretch justify-center overflow-hidden min-h-[380px] lg:min-h-[580px]">
                
                {/* Main Full-Frame Image using object-cover to completely fill the frame with ZERO black bars */}
                <img
                  src={filteredItems[lightboxIndex]?.image}
                  alt={filteredItems[lightboxIndex]?.title}
                  className="w-full h-full object-cover object-center"
                />
                <WatermarkOverlay size="lg" opacity={0.45} />

                {/* Subtle Luxury Gradient Overlay at Top & Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* 💧 WATERMARK ON LIGHTBOX IMAGE */}
                <WatermarkBadge isLarge={true} />

                {/* Top Image Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-red-600/95 backdrop-blur-md text-white text-xs font-black shadow-md border border-red-400">
                    {filteredItems[lightboxIndex]?.tag}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-300/40">
                    {filteredItems[lightboxIndex]?.bowColorName}
                  </span>
                </div>

                {/* Navigation Arrows with Luxury Golden Glow */}
                <button
                  type="button"
                  onClick={handleLightboxPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-2xl border-2 border-amber-300/60 hover:border-amber-300 cursor-pointer"
                  title="ภาพก่อนหน้า (หรือกดลูกศรซ้าย)"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>

                <button
                  type="button"
                  onClick={handleLightboxNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-2xl border-2 border-amber-300/60 hover:border-amber-300 cursor-pointer"
                  title="ภาพถัดไป (หรือกดลูกศรขวา)"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>

              {/* Right: Rich Luxury Details Panel */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white overflow-y-auto max-h-[85vh] border-l-2 border-amber-200/80">
                
                <div className="space-y-4">
                  {/* Category & Color Theme Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-red-700 uppercase tracking-wide bg-red-50 px-3.5 py-1 rounded-full border border-red-200">
                        {filteredItems[lightboxIndex]?.locationTypeName}
                      </span>
                      <span className="text-xs font-black text-slate-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${filteredItems[lightboxIndex]?.colorDotClass}`} />
                        <span>{filteredItems[lightboxIndex]?.bowColorName}</span>
                      </span>
                    </div>

                    <span className="text-xs font-black text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300">
                      {lightboxIndex + 1} / {filteredItems.length}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {filteredItems[lightboxIndex]?.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {filteredItems[lightboxIndex]?.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-2 pt-2 border-t border-amber-100">
                    <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      อุปกรณ์ & การบริการที่รวมในแพ็กเกจ:
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {filteredItems[lightboxIndex]?.highlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs font-bold text-slate-800"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="pt-4 border-t border-amber-100 space-y-3">
                  <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>สถานที่จัดงาน: {filteredItems[lightboxIndex]?.location}</span>
                  </div>

                  <a
                    href="#quotation-builder"
                    onClick={closeLightbox}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-red-glow flex items-center justify-center gap-2 transition-all border border-amber-300 transform hover:scale-102 active:scale-95"
                  >
                    <span>เลือกจัดเลี้ยงธีมนี้ & ออกใบเสนอราคา</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
