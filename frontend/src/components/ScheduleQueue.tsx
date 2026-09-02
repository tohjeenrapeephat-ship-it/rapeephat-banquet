import React, { useState, useEffect } from 'react';
import { QuotationApi } from '../services/api.js';
import { QueueService, DynamicQueueEvent, formatThaiDateShort, getDayOfWeekThai } from '../services/queueService.js';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  Users,
  ShieldCheck,
  Crown,
  Cake,
  HeartHandshake,
  Home,
  GraduationCap,
  PartyPopper,
  Phone,
  MessageCircle,
  Layers,
  LayoutGrid,
  List,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QueueEvent {
  id: string;
  dateStr: string; // e.g. "15 มี.ค. 2569"
  fullDate: string; // e.g. "2026-03-15"
  dayOfWeek: string; // e.g. "วันอาทิตย์"
  monthKey: 'mar' | 'apr' | 'may' | 'jun_dec';
  monthLabel: string;
  ceremonyType: 'wedding' | 'ordination' | 'housewarming' | 'birthday' | 'graduation' | 'reunion' | 'corporate' | 'available';
  ceremonyName: string;
  icon: React.ElementType;
  hostName: string;
  tableCount: string;
  location: string;
  province: string;
  status: 'confirmed' | 'filling_fast' | 'available';
  statusText: string;
  statusBadgeClass: string;
  availableSlotsRemaining: number;
}

const QUEUE_DATA: QueueEvent[] = [
  // ==========================================
  // 🌸 มีนาคม 2569 (MARCH 2026)
  // ==========================================
  {
    id: 'q-mar-01',
    dateStr: '1 มี.ค. 2569',
    fullDate: '2026-03-01',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'wedding',
    ceremonyName: 'งานฉลองมงคลสมรส 💍',
    icon: Crown,
    hostName: 'คุณธนภัทร & คุณพิมพ์ลดา',
    tableCount: '60 โต๊ะ',
    location: 'หอประชุมใหญ่',
    province: 'จ.นครปฐม',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-mar-05',
    dateStr: '5 มี.ค. 2569',
    fullDate: '2026-03-05',
    dayOfWeek: 'วันพฤหัสบดี',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'housewarming',
    ceremonyName: 'งานทำบุญขึ้นบ้านใหม่ 🏡',
    icon: Home,
    hostName: 'คุณวิชัย รัตนโชติ',
    tableCount: '25 โต๊ะ',
    location: 'ม.ภัสสร',
    province: 'จ.ปทุมธานี',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-mar-08',
    dateStr: '8 มี.ค. 2569',
    fullDate: '2026-03-08',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'birthday',
    ceremonyName: 'งานฉลองวันเกิด 60 ปี 🎂',
    icon: Cake,
    hostName: 'คุณธีรศักดิ์ (คุณแม่สุชาดา)',
    tableCount: '20 โต๊ะ',
    location: 'เรือนรับรองสวนหรู',
    province: 'จ.นนทบุรี',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-mar-14',
    dateStr: '14 มี.ค. 2569',
    fullDate: '2026-03-14',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'ordination',
    ceremonyName: 'งานอุปสมบทมงคล 📿',
    icon: HeartHandshake,
    hostName: 'ครอบครัววัฒนศิริ',
    tableCount: '50 โต๊ะ',
    location: 'ลานโดมวัดใหญ่',
    province: 'จ.พระนครศรีอยุธยา',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-mar-15',
    dateStr: '15 มี.ค. 2569',
    fullDate: '2026-03-15',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'wedding',
    ceremonyName: 'งานฉลองมงคลสมรส 💍',
    icon: Crown,
    hostName: 'คุณชานนท์ & คุณลลิตา',
    tableCount: '80 โต๊ะ',
    location: 'สโมสรราชพฤกษ์',
    province: 'กรุงเทพมหานคร',
    status: 'filling_fast',
    statusText: 'รับเพิ่มได้อีก 1 คิว 🟡',
    statusBadgeClass: 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse',
    availableSlotsRemaining: 1,
  },
  {
    id: 'q-mar-21',
    dateStr: '21 มี.ค. 2569',
    fullDate: '2026-03-21',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'reunion',
    ceremonyName: 'งานเลี้ยงสังสรรค์ประจำปี 🎉',
    icon: PartyPopper,
    hostName: 'ชมรมศิษย์เก่า & สมาคม',
    tableCount: '100 โต๊ะ',
    location: 'สนามกีฬา & หอประชุม',
    province: 'จ.สุพรรณบุรี',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-mar-22',
    dateStr: '22 มี.ค. 2569',
    fullDate: '2026-03-22',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'available',
    ceremonyName: 'คิวว่างเปิดรับจอง ✨',
    icon: Sparkles,
    hostName: 'เปิดรับจองทุกงานพิธี',
    tableCount: '10 - 200 โต๊ะ',
    location: 'ทุกสถานที่ทั่วไทย',
    province: 'ทั่วประเทศ',
    status: 'available',
    statusText: 'ว่าง 2 คิว พร้อมจอง 🟢',
    statusBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black',
    availableSlotsRemaining: 2,
  },
  {
    id: 'q-mar-28',
    dateStr: '28 มี.ค. 2569',
    fullDate: '2026-03-28',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'wedding',
    ceremonyName: 'งานแต่งงานระดับ VIP 👑',
    icon: Crown,
    hostName: 'คุณพงศ์ศักดิ์ & คุณณิชาภัทร',
    tableCount: '120 โต๊ะ',
    location: 'แกรนด์บอลรูม',
    province: 'กรุงเทพมหานคร',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-mar-29',
    dateStr: '29 มี.ค. 2569',
    fullDate: '2026-03-29',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'mar',
    monthLabel: 'มีนาคม 2569',
    ceremonyType: 'available',
    ceremonyName: 'คิวว่างเปิดรับจอง ✨',
    icon: Sparkles,
    hostName: 'เปิดรับจองทุกงานพิธี',
    tableCount: '10 - 150 โต๊ะ',
    location: 'ทุกสถานที่ทั่วไทย',
    province: 'ภาคกลาง & กทม.',
    status: 'available',
    statusText: 'ว่าง 2 คิว พร้อมจอง 🟢',
    statusBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black',
    availableSlotsRemaining: 2,
  },

  // ==========================================
  // ☀️ เมษายน 2569 (APRIL 2026 - เทศกาลสงกรานต์ & ฤดูบวช)
  // ==========================================
  {
    id: 'q-apr-04',
    dateStr: '4 เม.ย. 2569',
    fullDate: '2026-04-04',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'apr',
    monthLabel: 'เมษายน 2569',
    ceremonyType: 'reunion',
    ceremonyName: 'งานทำบุญรวมญาติสงกรานต์ 🎉',
    icon: PartyPopper,
    hostName: 'ตระกูลโสภณพานิช',
    tableCount: '50 โต๊ะ',
    location: 'ลานจัดเลี้ยงครอบครัว',
    province: 'จ.ราชบุรี',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-apr-05',
    dateStr: '5 เม.ย. 2569',
    fullDate: '2026-04-05',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'apr',
    monthLabel: 'เมษายน 2569',
    ceremonyType: 'wedding',
    ceremonyName: 'งานมงคลสมรส 💍',
    icon: Crown,
    hostName: 'คุณศุภชัย & คุณอรทัย',
    tableCount: '70 โต๊ะ',
    location: 'อาคารเฉลิมพระเกียรติ',
    province: 'จ.สมุทรสาคร',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-apr-11',
    dateStr: '11 เม.ย. 2569',
    fullDate: '2026-04-11',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'apr',
    monthLabel: 'เมษายน 2569',
    ceremonyType: 'reunion',
    ceremonyName: 'มหกรรมงานสงกรานต์ 150 โต๊ะ 🎪',
    icon: Flame,
    hostName: 'อบต. & ชมรมท้องถิ่น',
    tableCount: '150 โต๊ะ',
    location: 'ลานกิจกรรมเทศบาล',
    province: 'จ.กาญจนบุรี',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-apr-12',
    dateStr: '12 เม.ย. 2569',
    fullDate: '2026-04-12',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'apr',
    monthLabel: 'เมษายน 2569',
    ceremonyType: 'ordination',
    ceremonyName: 'งานอุปสมบท 📿',
    icon: HeartHandshake,
    hostName: 'ครอบครัวเจริญสุข',
    tableCount: '40 โต๊ะ',
    location: 'วัดโพธิ์ทอง',
    province: 'จ.อ่างทอง',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-apr-18',
    dateStr: '18 เม.ย. 2569',
    fullDate: '2026-04-18',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'apr',
    monthLabel: 'เมษายน 2569',
    ceremonyType: 'available',
    ceremonyName: 'คิวว่างรับจองฤกษ์มงคล ✨',
    icon: Sparkles,
    hostName: 'เปิดรับจองทุกงานพิธี',
    tableCount: '10 - 200 โต๊ะ',
    location: 'ทุกสถานที่ทั่วไทย',
    province: 'ทั่วประเทศ',
    status: 'available',
    statusText: 'ว่าง 3 คิว พร้อมจอง 🟢',
    statusBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black',
    availableSlotsRemaining: 3,
  },
  {
    id: 'q-apr-19',
    dateStr: '19 เม.ย. 2569',
    fullDate: '2026-04-19',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'apr',
    monthLabel: 'เมษายน 2569',
    ceremonyType: 'wedding',
    ceremonyName: 'งานฉลองมงคลสมรส 💍',
    icon: Crown,
    hostName: 'คุณกิตติศักดิ์ & คุณวรินทร',
    tableCount: '90 โต๊ะ',
    location: 'หอประชุมอำเภอเมือง',
    province: 'จ.สิงห์บุรี',
    status: 'filling_fast',
    statusText: 'รับเพิ่มได้อีก 1 คิว 🟡',
    statusBadgeClass: 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse',
    availableSlotsRemaining: 1,
  },
  {
    id: 'q-apr-25',
    dateStr: '25 เม.ย. 2569',
    fullDate: '2026-04-25',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'apr',
    monthLabel: 'เมษายน 2569',
    ceremonyType: 'reunion',
    ceremonyName: 'งานเลี้ยงประจำปีบริษัท 200 โต๊ะ 🎪',
    icon: PartyPopper,
    hostName: 'บจก. ไทยออโต้พาร์ท',
    tableCount: '200 โต๊ะ',
    location: 'ศูนย์ประชุมพัทยา',
    province: 'จ.ชลบุรี',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-apr-26',
    dateStr: '26 เม.ย. 2569',
    fullDate: '2026-04-26',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'apr',
    monthLabel: 'เมษายน 2569',
    ceremonyType: 'available',
    ceremonyName: 'คิวว่างเปิดรับจอง ✨',
    icon: Sparkles,
    hostName: 'เปิดรับจองทุกงานพิธี',
    tableCount: '10 - 150 โต๊ะ',
    location: 'ทุกสถานที่ทั่วไทย',
    province: 'ทั่วประเทศ',
    status: 'available',
    statusText: 'ว่าง 2 คิว พร้อมจอง 🟢',
    statusBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black',
    availableSlotsRemaining: 2,
  },

  // ==========================================
  // 🌿 พฤษภาคม 2569 (MAY 2026)
  // ==========================================
  {
    id: 'q-may-02',
    dateStr: '2 พ.ค. 2569',
    fullDate: '2026-05-02',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'may',
    monthLabel: 'พฤษภาคม 2569',
    ceremonyType: 'wedding',
    ceremonyName: 'งานแต่งงาน 💍',
    icon: Crown,
    hostName: 'คุณอรรถพล & คุณชลิตา',
    tableCount: '80 โต๊ะ',
    location: 'สวนหลวงสามพราน',
    province: 'จ.นครปฐม',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-may-03',
    dateStr: '3 พ.ค. 2569',
    fullDate: '2026-05-03',
    dayOfWeek: 'วันอาทิตย์',
    monthKey: 'may',
    monthLabel: 'พฤษภาคม 2569',
    ceremonyType: 'graduation',
    ceremonyName: 'งานฉลองรับปริญญา 🎓',
    icon: GraduationCap,
    hostName: 'ครอบครัวสิริโภคิน',
    tableCount: '30 โต๊ะ',
    location: 'สโมสรตำรวจ',
    province: 'กรุงเทพมหานคร',
    status: 'available',
    statusText: 'ว่าง 2 คิว พร้อมจอง 🟢',
    statusBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black',
    availableSlotsRemaining: 2,
  },
  {
    id: 'q-may-09',
    dateStr: '9 พ.ค. 2569',
    fullDate: '2026-05-09',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'may',
    monthLabel: 'พฤษภาคม 2569',
    ceremonyType: 'ordination',
    ceremonyName: 'งานอุปสมบท 📿',
    icon: HeartHandshake,
    hostName: 'ครอบครัวพูลสวัสดิ์',
    tableCount: '60 โต๊ะ',
    location: 'วัดพระญาติการาม',
    province: 'จ.พระนครศรีอยุธยา',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-may-16',
    dateStr: '16 พ.ค. 2569',
    fullDate: '2026-05-16',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'may',
    monthLabel: 'พฤษภาคม 2569',
    ceremonyType: 'housewarming',
    ceremonyName: 'งานทำบุญขึ้นบ้านใหม่ 🏡',
    icon: Home,
    hostName: 'คุณสมศักดิ์ วงศ์สวัสดิ์',
    tableCount: '40 โต๊ะ',
    location: 'ม.เศรษฐสิริ ราชพฤกษ์',
    province: 'จ.นนทบุรี',
    status: 'filling_fast',
    statusText: 'รับเพิ่มได้อีก 1 คิว 🟡',
    statusBadgeClass: 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse',
    availableSlotsRemaining: 1,
  },
  {
    id: 'q-may-23',
    dateStr: '23 พ.ค. 2569',
    fullDate: '2026-05-23',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'may',
    monthLabel: 'พฤษภาคม 2569',
    ceremonyType: 'wedding',
    ceremonyName: 'งานฉลองมงคลสมรส 100 โต๊ะ 💍',
    icon: Crown,
    hostName: 'คุณปรเมษฐ์ & คุณนภัสสร',
    tableCount: '100 โต๊ะ',
    location: 'หอประชุมธรรมศาสตร์',
    province: 'จ.ปทุมธานี',
    status: 'confirmed',
    statusText: 'คิวเต็ม ยืนยันแล้ว 🔴',
    statusBadgeClass: 'bg-red-100 text-red-800 border-red-300',
    availableSlotsRemaining: 0,
  },
  {
    id: 'q-may-30',
    dateStr: '30 พ.ค. 2569',
    fullDate: '2026-05-30',
    dayOfWeek: 'วันเสาร์',
    monthKey: 'may',
    monthLabel: 'พฤษภาคม 2569',
    ceremonyType: 'available',
    ceremonyName: 'คิวว่างรับจองล่วงหน้า ✨',
    icon: Sparkles,
    hostName: 'เปิดรับจองทุกงานพิธี',
    tableCount: '10 - 300 โต๊ะ',
    location: 'ทุกสถานที่ทั่วไทย',
    province: 'ทั่วประเทศ',
    status: 'available',
    statusText: 'ว่าง 4 คิว พร้อมจอง 🟢',
    statusBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black',
    availableSlotsRemaining: 4,
  },
];

interface ScheduleQueueProps {
  onOpenBuilder?: () => void;
}

export const ScheduleQueue: React.FC<ScheduleQueueProps> = ({ onOpenBuilder }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  // Default hidden as requested by user ("คิวงานทั้งหมดให้ซ่อนไว้ตรงนี้ ติ๊กเลือกค่อยแสดง")
  const [isQueueVisible, setIsQueueVisible] = useState<boolean>(false);

  // Search date checker state
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchProvince, setSearchProvince] = useState<string>('all');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [blockedModalInfo, setBlockedModalInfo] = useState<{ date: string; note?: string; reason?: string } | null>(null);
  const [allQueueEvents, setAllQueueEvents] = useState<QueueEvent[]>(QUEUE_DATA);

  // Load dynamic bookings from quotations and blocked dates
  const loadDynamicEvents = async () => {
    try {
      const quotes = await QuotationApi.getAll();
      const dynamicEvents = QueueService.buildLiveQueueEvents(quotes);
      
      const mapped: QueueEvent[] = dynamicEvents.map((de) => {
        let icon = Sparkles;
        if (de.ceremonyType === 'wedding') icon = Crown;
        else if (de.ceremonyType === 'ordination') icon = HeartHandshake;
        else if (de.ceremonyType === 'housewarming') icon = Home;
        else if (de.ceremonyType === 'birthday') icon = Cake;
        else if (de.ceremonyType === 'graduation') icon = GraduationCap;
        else if (de.ceremonyType === 'reunion' || de.ceremonyType === 'corporate') icon = PartyPopper;

        return {
          id: de.id,
          dateStr: de.dateStr,
          fullDate: de.fullDate,
          dayOfWeek: de.dayOfWeek,
          monthKey: (de.monthKey === 'all' ? 'mar' : de.monthKey) as any,
          monthLabel: de.monthLabel,
          ceremonyType: de.ceremonyType,
          ceremonyName: de.ceremonyName,
          icon,
          hostName: de.hostName,
          tableCount: de.tableCount,
          location: de.location,
          province: de.province,
          status: de.status,
          statusText: de.statusText,
          statusBadgeClass: de.statusBadgeClass,
          availableSlotsRemaining: de.availableSlotsRemaining,
        };
      });

      // Merge with base events
      const combined = [...mapped];
      QUEUE_DATA.forEach((base) => {
        if (!combined.some((c) => c.fullDate === base.fullDate)) {
          combined.push(base);
        }
      });

      combined.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
      setAllQueueEvents(combined);
    } catch (e) {
      console.error('Failed to load dynamic queue events:', e);
    }
  };

  useEffect(() => {
    loadDynamicEvents();
    window.addEventListener('rapeephat_queue_updated', loadDynamicEvents);
    return () => {
      window.removeEventListener('rapeephat_queue_updated', loadDynamicEvents);
    };
  }, []);

  const filteredQueue = allQueueEvents.filter((item) => {
    const matchMonth = selectedMonth === 'all' || item.monthKey === selectedMonth;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchProvince = searchProvince === 'all' || item.province.includes(searchProvince) || item.province === 'ทั่วประเทศ';
    return matchMonth && matchStatus && matchProvince;
  });

  const handleCheckDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDate) {
      setSearchResult('กรุณาเลือกวันที่ท่านต้องการจัดงานครับ');
      return;
    }

    const blockedCheck = QueueService.isDateBlocked(searchDate);
    if (blockedCheck.isBlocked) {
      setBlockedModalInfo({
        date: searchDate,
        note: blockedCheck.note,
        reason: blockedCheck.reason,
      });
      setSearchResult(`🔴 วันที่ ${formatThaiDateShort(searchDate)} คิวงานจัดเลี้ยงเต็มแล้วครับ (คลิกเพื่อดูรายละเอียดและคำแนะนำ)`);
      return;
    }

    const found = allQueueEvents.find((q) => q.fullDate === searchDate);
    if (found) {
      if (found.status === 'available') {
        setSearchResult(`🟢 วันที่ ${found.dateStr} ยังมีคิวว่าง ${found.availableSlotsRemaining} คิว! พร้อมรับจัดเลี้ยงทันที (รับสิทธิ์ 20 แถม 1)`);
      } else if (found.status === 'filling_fast') {
        setSearchResult(`🟡 วันที่ ${found.dateStr} มีการจองแล้ว แต่ยังมีทีมเสริมรองรับได้อีก ${found.availableSlotsRemaining} คิวสุดท้าย! รีบติดต่อจอง`);
      } else {
        setBlockedModalInfo({
          date: searchDate,
          note: found.location || 'คิวงานเต็มทุกช่วงเวลา',
          reason: 'fully_booked',
        });
        setSearchResult(`🔴 วันที่ ${found.dateStr} คิวงานเต็มแล้วครับ (คลิกเพื่อดูรายละเอียดและคำแนะนำ)`);
      }
    } else {
      setSearchResult(`🟢 วันที่ ${formatThaiDateShort(searchDate)} คิวงานยังว่างพร้อมให้บริการเต็มรูปแบบ! สามารถจองล็อกวันและออกใบเสนอราคาได้ทันทีครับ`);
    }
  };

  return (
    <section id="schedule-queue" className="py-20 relative border-t-2 border-amber-300/80 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* ========================================================================= */}
        {/* Section Header with Live Pulsing Badge */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border-2 border-red-400 text-red-950 text-xs font-black uppercase tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
            <Clock className="w-4 h-4 text-red-600" />
            <span>LIVE BOOKING SCHEDULE • ตารางคิวงานจัดเลี้ยงสด</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-normal space-y-1 sm:space-y-2">
            <span className="block">ตารางคิวงาน & สถานะรับจองโต๊ะจีน</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-amber-600 to-red-800 text-xl sm:text-3xl lg:text-4xl py-1.5 leading-normal">
              อัปเดตสดแบบเรียลไทม์ ทั่วราชอาณาจักร
            </span>
          </h2>

          <p className="text-slate-700 text-sm sm:text-base font-medium">
            เช็ควันว่าง จองคิวก่อนเต็ม รองรับทีมเชฟปรุงสดหน้างาน 5-8 คิวต่อวัน พร้อมบริกรและอุปกรณ์ครบชุด
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🔍 1. INSTANT LIVE DATE AVAILABILITY CHECKER WIDGET */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white border-2 border-amber-400 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  ตรวจสอบคิวว่างตามวันที่ท่านต้องการจัดงาน
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  ใส่วันที่และจังหวัด เพื่อตรวจสอบทีมเชฟและสถานะความพร้อมทันที
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-500/40 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ระบบอัปเดตล่าสุดวันนี้ (Real-Time)</span>
            </div>
          </div>

          {/* Search Form with High Visibility & Crystal Clear Calendar Picker */}
          <form onSubmit={handleCheckDate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
              
              {/* Date Input with High Contrast White Card & Crystal Clear Calendar */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-black text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-amber-400" />
                    <span>เลือกวันที่จัดงาน:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    คลิกไอคอนปฏิทินเพื่อเลือกวัน
                  </span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-amber-400 text-slate-950 placeholder-slate-400 focus:outline-hidden focus:border-red-600 focus:ring-4 focus:ring-amber-300/50 text-sm font-black transition-all shadow-md cursor-pointer [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:scale-125 [&::-webkit-calendar-picker-indicator]:hover:scale-135 [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:rounded-md [&::-webkit-calendar-picker-indicator]:transition-transform"
                    placeholder="วว/ดด/ปปปป"
                  />
                </div>
              </div>

              {/* Province Selector with High Contrast White Card */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>จังหวัดที่จัดงาน:</span>
                </label>
                <select
                  value={searchProvince}
                  onChange={(e) => setSearchProvince(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-amber-400 text-slate-950 focus:outline-hidden focus:border-red-600 focus:ring-4 focus:ring-amber-300/50 text-sm font-black transition-all shadow-md cursor-pointer"
                >
                  <option value="all">📍 ทุกจังหวัดทั่วไทย (77 จังหวัด)</option>
                  <option value="นครปฐม">จ.นครปฐม (ศูนย์ใหญ่)</option>
                  <option value="กรุงเทพ">กรุงเทพมหานคร</option>
                  <option value="นนทบุรี">จ.นนทบุรี</option>
                  <option value="ปทุมธานี">จ.ปทุมธานี</option>
                  <option value="พระนครศรีอยุธยา">จ.พระนครศรีอยุธยา</option>
                  <option value="สุพรรณบุรี">จ.สุพรรณบุรี</option>
                  <option value="ราชบุรี">จ.ราชบุรี</option>
                  <option value="สมุทรสาคร">จ.สมุทรสาคร</option>
                  <option value="ชลบุรี">จ.ชลบุรี</option>
                  <option value="กาญจนบุรี">จ.กาญจนบุรี</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-4 flex items-center gap-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm shadow-xl transition-all transform hover:scale-102 active:scale-95 border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer h-[48px]"
                >
                  <Search className="w-4 h-4 text-amber-300" />
                  <span>ตรวจสอบคิวว่างทันที</span>
                </button>
              </div>
            </div>

            {/* Quick Date Shortcut Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-bold">⚡ วันยอดนิยม:</span>
              {[
                { label: '🌸 15 มี.ค. 69', date: '2026-03-15' },
                { label: '☀️ 13 เม.ย. (สงกรานต์)', date: '2026-04-13' },
                { label: '☀️ 15 เม.ย. 69', date: '2026-04-15' },
                { label: '🌿 1 พ.ค. (วันแรงงาน)', date: '2026-05-01' },
                { label: '👑 10 พ.ค. 69', date: '2026-05-10' },
              ].map((chip) => (
                <button
                  key={chip.date}
                  type="button"
                  onClick={() => {
                    setSearchDate(chip.date);
                    // trigger search
                    const found = QUEUE_DATA.find((q) => q.fullDate === chip.date);
                    if (found) {
                      if (found.status === 'available') {
                        setSearchResult(`🟢 วันที่ ${found.dateStr} ยังมีคิวว่าง ${found.availableSlotsRemaining} คิว! พร้อมรับจัดเลี้ยงทันที`);
                      } else if (found.status === 'filling_fast') {
                        setSearchResult(`🟡 วันที่ ${found.dateStr} มีการจองแล้ว แต่ยังมีทีมเสริมรองรับได้อีก ${found.availableSlotsRemaining} คิวสุดท้าย! รีบติดต่อจอง`);
                      } else {
                        setSearchResult(`🔴 วันที่ ${found.dateStr} ทีมหลักเต็มแล้ว แต่สามารถเปิดทีมเชฟสำรองพิเศษได้ (กรุณาโทรสอบถามด่วน)`);
                      }
                    } else {
                      setSearchResult(`🟢 วันที่เลือก ยังมีคิวว่างพร้อมให้บริการเต็มรูปแบบ! สามารถจองล็อกวันและออกใบเสนอราคาได้ทันที`);
                    }
                  }}
                  className={`px-3 py-1 rounded-xl font-black text-[11px] transition-all cursor-pointer border ${
                    searchDate === chip.date
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </form>

          {/* Search Result Banner */}
          {searchResult && (
            <div className="p-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-fadeIn border-2 border-amber-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-700 shrink-0" />
                <span>{searchResult}</span>
              </div>
              
              <a
                href="#quotation"
                onClick={onOpenBuilder}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-md shrink-0 flex items-center gap-1.5 transition-all transform hover:scale-105"
              >
                <span>ล็อกคิว & ออกใบเสนอราคา</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 🎛️ 2. FILTER CONTROLS & VIEW TOGGLE */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-xl space-y-4">
          
          {/* Month Selector Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-red-600" />
              <span className="text-sm font-black text-slate-900">เลือกช่วงเดือนที่ต้องการดูคิว:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', name: '✨ ดูคิวทั้งหมด', count: allQueueEvents.length },
                { id: 'mar', name: '🌸 มีนาคม 2569', count: allQueueEvents.filter((q) => q.monthKey === 'mar').length },
                { id: 'apr', name: '☀️ เมษายน 2569 (สงกรานต์)', count: allQueueEvents.filter((q) => q.monthKey === 'apr').length },
                { id: 'may', name: '🌿 พฤษภาคม 2569', count: allQueueEvents.filter((q) => q.monthKey === 'may').length },
              ].map((m) => {
                const isActive = selectedMonth === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMonth(m.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md border-2 border-amber-300 ring-2 ring-amber-300/40'
                        : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-2 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {m.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter & View Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700">สถานะคิวงาน:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', name: 'ทั้งหมด' },
                  { id: 'available', name: '🟢 ว่าง รับจองได้' },
                  { id: 'filling_fast', name: '🟡 คิวเหลือน้อย' },
                  { id: 'confirmed', name: '🔴 ยืนยันแล้ว' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStatus(st.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedStatus === st.id
                        ? 'bg-slate-900 text-amber-300 border border-amber-300 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode & Visibility Toggle (ดีไซน์ทันสมัย ซ่อนเป็นค่าเริ่มต้น ติ๊กเลือกค่อยแสดง) */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Checkbox / Visibility Toggle Button */}
              <button
                type="button"
                onClick={() => setIsQueueVisible(!isQueueVisible)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isQueueVisible
                    ? 'bg-slate-900 text-amber-300 border-2 border-amber-400'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300'
                }`}
                title={isQueueVisible ? 'คลิกเพื่อซ่อนคิวงาน' : 'ติ๊กเลือกเพื่อแสดงคิวงาน'}
              >
                {isQueueVisible ? (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-400" />
                    <span>ซ่อนคิวงาน ▴</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-amber-700" />
                    <span>ติ๊กเลือกแสดงคิวงาน ({filteredQueue.length}) ▾</span>
                  </>
                )}
              </button>

              {/* View Mode Toggle Buttons with Blue Capsule Outline (ตามที่ผู้ใช้ส่งภาพมา) */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border-2 border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('timeline');
                    setIsQueueVisible(true);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    isQueueVisible && viewMode === 'timeline'
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 border-2 border-blue-600'
                      : 'bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-600 shadow-2xs'
                  }`}
                  title="คลิกเพื่อแสดงมุมมองไทม์ไลน์"
                >
                  {isQueueVisible && viewMode === 'timeline' ? (
                    <CheckSquare className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <List className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>มุมมองไทม์ไลน์</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode('grid');
                    setIsQueueVisible(true);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    isQueueVisible && viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 border-2 border-blue-600'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-300 shadow-2xs'
                  }`}
                  title="คลิกเพื่อแสดงมุมมองการ์ด"
                >
                  {isQueueVisible && viewMode === 'grid' ? (
                    <CheckSquare className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <span>มุมมองการ์ด</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 📋 3. LIVE BANQUET QUEUE DISPLAY (ซ่อนเป็นค่าเริ่มต้น • ติ๊กเลือกค่อยแสดง) */}
        {/* ========================================================================= */}
        {!isQueueVisible ? (
          /* COLLAPSED TEASER CARD WHEN HIDDEN */
          <div
            onClick={() => setIsQueueVisible(true)}
            className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-50/70 via-white to-amber-50/70 border-2 border-dashed border-blue-300 hover:border-blue-600 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-108 transition-transform">
                <List className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10.5px] font-black border border-blue-300">
                  <CheckSquare className="w-3 h-3 text-blue-700" />
                  <span>คิวงานทั้งหมดถูกซ่อนไว้เป็นค่าเริ่มต้น • ติ๊กเลือกเพื่อเปิดดู</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                  คลิกที่นี่ หรือ ติ๊กเลือก "มุมมองไทม์ไลน์" เพื่อเปิดดูตารางคิวงานทั้งหมด
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  แสดงสถานะคิวว่าง คิวรับจอง และคิวที่ยืนยันแล้วทั้งหมด <strong>{filteredQueue.length} รายการ</strong> ในช่วงเดือนที่เลือก
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-xs sm:text-sm shadow-md shrink-0 flex items-center gap-2 border border-blue-400 group-hover:scale-105 transition-all cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>เปิดดูตารางคิวงาน ({filteredQueue.length} คิว) ▾</span>
            </button>
          </div>
        ) : filteredQueue.length > 0 ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Expanded Status Bar */}
            <div className="flex items-center justify-between p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 font-bold">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-700" />
                <span>กำลังแสดงตารางคิวงานทั้งหมด ({filteredQueue.length} รายการ) ใน {viewMode === 'timeline' ? 'มุมมองไทม์ไลน์' : 'มุมมองการ์ด'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsQueueVisible(false)}
                className="text-xs font-black text-slate-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>ซ่อนตารางคิวงาน ▴</span>
              </button>
            </div>

            {viewMode === 'timeline' ? (
              /* TIMELINE VIEW */
              <div className="space-y-4">
                {filteredQueue.map((item, idx) => {
                  const Icon = item.icon;
                  const isAvail = item.status === 'available';
                  const isFast = item.status === 'filling_fast';

                  return (
                    <div
                      key={item.id}
                      className={`p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 shadow-md hover:shadow-xl ${
                        isAvail
                          ? 'bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 border-emerald-300 hover:border-emerald-500'
                          : isFast
                          ? 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border-amber-300 hover:border-amber-500'
                          : 'bg-white border-slate-200 opacity-90'
                      }`}
                    >
                      {/* Left: Date & Calendar Block */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 shadow-md border-2 ${
                            isAvail
                              ? 'bg-emerald-600 text-white border-emerald-400'
                              : isFast
                              ? 'bg-amber-500 text-slate-950 border-amber-300'
                              : 'bg-slate-800 text-slate-100 border-slate-600'
                          }`}
                        >
                          <span className="text-[10px] sm:text-xs font-bold opacity-90 uppercase">
                            {item.dayOfWeek.replace('วัน', '')}
                          </span>
                          <span className="text-xl sm:text-2xl font-black leading-none my-0.5">
                            {item.dateStr.split(' ')[0]}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold opacity-80">
                            {item.dateStr.split(' ')[1]}
                          </span>
                        </div>

                        {/* Middle: Ceremony Info */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black border flex items-center gap-1 ${item.statusBadgeClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-emerald-600' : isFast ? 'bg-amber-600' : 'bg-red-600'}`} />
                              <span>{item.statusText}</span>
                            </span>
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-red-600" />
                              <span>{item.province}</span>
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                            <Icon className="w-4 h-4 text-amber-700 shrink-0" />
                            <span>{item.ceremonyName}</span>
                          </h4>

                          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 font-medium">
                            <span>
                              เจ้าภาพ: <strong>{item.hostName}</strong>
                            </span>
                            {item.tableCount && (
                              <span>
                                จำนวน: <strong className="text-red-700">{item.tableCount}</strong>
                              </span>
                            )}
                            <span className="text-slate-400">({item.location})</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Slot Status & CTA */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                        {isAvail ? (
                          <div className="space-y-1 text-left lg:text-right w-full sm:w-auto">
                            <div className="text-xs font-black text-emerald-800 flex items-center lg:justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ว่างรับได้อีก {item.availableSlotsRemaining} คิว</span>
                            </div>
                            <a
                              href="#quotation"
                              onClick={onOpenBuilder}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs shadow-sm inline-flex items-center gap-1 transition-all transform hover:scale-105"
                            >
                              <span>จองคิววันนี้</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        ) : isFast ? (
                          <div className="space-y-1 text-left lg:text-right w-full sm:w-auto">
                            <div className="text-xs font-black text-amber-900 flex items-center lg:justify-end gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>เหลือเพียง {item.availableSlotsRemaining} คิวสุดท้าย!</span>
                            </div>
                            <a
                              href="#quotation"
                              onClick={onOpenBuilder}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-sm inline-flex items-center gap-1 transition-all transform hover:scale-105"
                            >
                              <span>ล็อกคิวด่วน</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <div className="space-y-1 text-left lg:text-right w-full sm:w-auto">
                            <div className="text-[11px] font-bold text-slate-500">
                              ทีมหลักลงพื้นที่เรียบร้อย
                            </div>
                            <a
                              href="tel:0813311646"
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-red-600" />
                              <span>โทรสอบถามทีมเสริม</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredQueue.map((item) => {
                  const Icon = item.icon;
                  const isAvail = item.status === 'available';
                  const isFast = item.status === 'filling_fast';

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg ${
                        isAvail
                          ? 'bg-gradient-to-b from-emerald-50/50 to-white border-emerald-300'
                          : isFast
                          ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${item.statusBadgeClass}`}
                          >
                            {item.statusText}
                          </span>
                          <span className="text-xs font-bold text-slate-500">{item.province}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black shrink-0 ${
                              isAvail
                                ? 'bg-emerald-600 text-white'
                                : isFast
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-white'
                            }`}
                          >
                            <span className="text-[9px] opacity-80">{item.dayOfWeek.replace('วัน', '')}</span>
                            <span className="text-base font-black leading-none">{item.dateStr.split(' ')[0]}</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-500">{item.monthLabel}</div>
                            <h4 className="text-sm font-black text-slate-900 line-clamp-1">{item.ceremonyName}</h4>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          เจ้าภาพ: <strong>{item.hostName}</strong> ({item.tableCount || '10-50 โต๊ะ'})
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        {isAvail ? (
                          <a
                            href="#quotation"
                            onClick={onOpenBuilder}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs text-center block transition-all"
                          >
                            จองคิวว่างวันนี้ ({item.availableSlotsRemaining} คิว)
                          </a>
                        ) : isFast ? (
                          <a
                            href="#quotation"
                            onClick={onOpenBuilder}
                            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs text-center block transition-all"
                          >
                            รีบล็อกคิวด่วน ({item.availableSlotsRemaining} คิว)
                          </a>
                        ) : (
                          <div className="w-full py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-[11px] text-center">
                            ยืนยันทีมบริการแล้ว
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Collapse Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsQueueVisible(false)}
                className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition-all border border-slate-300 inline-flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>ซ่อนตารางคิวงาน ▴</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-amber-200">
            <p className="text-slate-600 font-bold">ไม่พบคิวงานในตัวกรองที่เลือก กรุณาเลือกตัวกรองอื่น</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📞 4. EMERGENCY HOTLINE & LOCK-IN DEPOSIT BANNER */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white shadow-2xl border-2 border-amber-300 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner border border-amber-300">
              <Phone className="w-7 h-7 text-amber-300 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg sm:text-xl font-black">
                ต้องการล็อกคิววันจัดงานเร่งด่วน หรือจัดเลี้ยงสเกลใหญ่?
              </h4>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">
                โทรสายตรงสอบถามทีมงานได้ตลอด 24 ชม. • มัดจำเพียง 30% พร้อมสัญญาและใบเสนอราคาทางการทันที
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:0813311646"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-red-700 font-black text-xs sm:text-sm shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 border border-amber-300"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>โทร 081-331-1646</span>
            </a>

            <a
              href="https://line.me/ti/p/~pang_baichaa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-xs sm:text-sm shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 border border-white/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ทัก LINE ล็อกคิว</span>
            </a>
          </div>
        </div>

        {/* Modal: Auspicious & Polite Notice when Date is Fully Booked */}
        {blockedModalInfo && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-red-500 shadow-2xl p-6 sm:p-7 space-y-5 text-slate-900">
              
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto border-4 border-red-200 shadow-inner">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>

              {/* Title & Designed Apology */}
              <div className="text-center space-y-2">
                <span className="text-xs font-black text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-block">
                  👑 แจ้งสถานะคิวงานจัดเลี้ยง
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-snug">
                  กราบขออภัยเป็นอย่างยิ่งครับ<br />
                  <span className="text-red-700">วันที่ {formatThaiDateShort(blockedModalInfo.date)} คิวงานจัดเลี้ยงเต็มแล้วครับ</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
                  เพื่อรักษามาตรฐานคุณภาพความสดใหม่ของวัตถุดิบ การปรุงอาหารสุกร้อนสดๆ หน้างาน และการบริการระดับภัตตาคารอย่างดีที่สุด ทางโต๊ะจีนรพีพัฒน์จึงขอสงวนสิทธิ์ปิดรับจองในวันดังกล่าวครับ
                </p>
                {blockedModalInfo.note && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
                    • {blockedModalInfo.note}
                  </div>
                )}
              </div>

              {/* Recommendations Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>คำแนะนำสำหรับเจ้าภาพ / ผู้ว่าจ้าง:</span>
                </div>
                <p>• แนะนำเลือกวันจัดงานใกล้เคียง หรือเลือกวันธรรมดาที่คิวว่าง</p>
                <p>• สามารถโทรปรึกษาคุณแป้งโดยตรง เพื่อตรวจสอบคิวพิเศษหรือช่วงเวลาแทรกได้ตลอด 24 ชม.</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="tel:0813311646"
                  className="py-3 px-4 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-amber-300" />
                  <span>โทร 081-331-1646</span>
                </a>
                <a
                  href="https://line.me/ti/p/~pang_baichaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>ทัก LINE: คุณแป้ง</span>
                </a>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setBlockedModalInfo(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง & เลือกวันใหม่
              </button>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
