import { QuotationDoc } from "../types/quotation.js";

export interface BookingPolicy {
  isAcceptingBookings: boolean; // true = เปิดรับงานปกติ, false = ไม่รับงานเลย (งดรับงานชั่วคราว)
  closedReason: string;
  minTables: number; // e.g. 5, 10, 20 โต๊ะขึ้นไป
  updatedAt: number;
}

export interface BlockedDateEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  tableCount?: number | string; // e.g. 80, 120, "120 โต๊ะ"
  note: string;
  reason: "fully_booked" | "maintenance" | "holiday" | "custom";
  createdAt: number;
}

export interface DynamicQueueEvent {
  id: string;
  dateStr: string; // e.g. "15 มี.ค. 2569"
  fullDate: string; // "YYYY-MM-DD"
  dayOfWeek: string;
  monthKey: "mar" | "apr" | "may" | "jun_dec" | "all";
  monthLabel: string;
  ceremonyType: "wedding" | "ordination" | "housewarming" | "birthday" | "graduation" | "reunion" | "corporate" | "available";
  ceremonyName: string;
  hostName: string;
  tableCount: string;
  location: string;
  province: string;
  timeSlot?: string;
  status: "confirmed" | "filling_fast" | "available";
  statusText: string;
  statusBadgeClass: string;
  availableSlotsRemaining: number;
  isFromQuotation?: boolean;
  quoteNo?: string;
}

const BLOCKED_DATES_KEY = "rapeephat_blocked_dates";
const BOOKING_POLICY_KEY = "rapeephat_booking_policy";

const DEFAULT_BOOKING_POLICY: BookingPolicy = {
  isAcceptingBookings: true,
  closedReason: "กราบขออภัยเป็นอย่างยิ่งค่ะ ขณะนี้ทางร้านโต๊ะจีนรพีพัฒน์ของดรับงานจัดเลี้ยงชั่วคราว เพื่อปรับปรุงและพัฒนาคุณภาพการบริการระดับภัตตาคารค่ะ",
  minTables: 10,
  updatedAt: Date.now(),
};

// Default initial blocked dates (high season auspicious dates)
const INITIAL_BLOCKED_DATES: BlockedDateEntry[] = [
  {
    id: "blk-2026-03-01",
    date: "2026-03-01",
    tableCount: 60,
    note: "งานฉลองมงคลสมรสหอประชุมใหญ่ (รับเต็ม 60 โต๊ะ)",
    reason: "fully_booked",
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "blk-2026-03-05",
    date: "2026-03-05",
    tableCount: 25,
    note: "งานทำบุญขึ้นบ้านใหม่ ม.ภัสสร (รับเต็ม 25 โต๊ะ)",
    reason: "fully_booked",
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: "blk-2026-03-14",
    date: "2026-03-14",
    tableCount: 50,
    note: "งานอุปสมบทมงคล ลานโดมวัดใหญ่ (รับเต็ม 50 โต๊ะ)",
    reason: "fully_booked",
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "blk-2026-03-21",
    date: "2026-03-21",
    tableCount: 100,
    note: "งานเลี้ยงสังสรรค์สมาคมศิษย์เก่า (รับเต็ม 100 โต๊ะ)",
    reason: "fully_booked",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "blk-2026-03-28",
    date: "2026-03-28",
    tableCount: 120,
    note: "งานแต่งงานระดับ VIP แกรนด์บอลรูม (รับเต็ม 120 โต๊ะ)",
    reason: "fully_booked",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "blk-2026-04-04",
    date: "2026-04-04",
    tableCount: 50,
    note: "งานทำบุญรวมญาติสงกรานต์ (รับเต็ม 50 โต๊ะ)",
    reason: "fully_booked",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "blk-2026-04-11",
    date: "2026-04-11",
    tableCount: 80,
    note: "งานมงคลสมรสช่วงเทศกาล (รับเต็ม 80 โต๊ะ)",
    reason: "fully_booked",
    createdAt: Date.now() - 86400000,
  },
];

// Helper to format date to Thai string
export function formatThaiDateShort(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  const day = d.getDate();
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

export function getDayOfWeekThai(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  const days = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
  return days[d.getDay()];
}

export function maskCustomerName(name: string): string {
  if (!name || name.trim() === "") return "คุณลูกค้าผู้มีเกียรติ";
  const clean = name.replace(/^(นาย|นางสาว|นาง|คุณ|ดร\.|พล\.|พ\.ต\.|น\.ส\.)\s*/, "").trim();
  if (clean.length <= 2) return `คุณ ${clean}***`;
  const first = clean.charAt(0);
  return `คุณ ${first}***`;
}

export const QueueService = {
  // Booking Policy (เปิดรับงาน / ไม่รับงานเลย / รับขั้นต่ำกี่โต๊ะ)
  getBookingPolicy(): BookingPolicy {
    try {
      const stored = localStorage.getItem(BOOKING_POLICY_KEY);
      if (stored) {
        return { ...DEFAULT_BOOKING_POLICY, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load booking policy:", e);
    }
    this.saveBookingPolicy(DEFAULT_BOOKING_POLICY);
    return DEFAULT_BOOKING_POLICY;
  },

  saveBookingPolicy(policy: BookingPolicy): void {
    try {
      localStorage.setItem(BOOKING_POLICY_KEY, JSON.stringify(policy));
      window.dispatchEvent(new Event("rapeephat_queue_updated"));
    } catch (e) {
      console.error("Failed to save booking policy:", e);
    }
  },

  // Get list of all blocked dates
  getBlockedDates(): BlockedDateEntry[] {
    try {
      const stored = localStorage.getItem(BLOCKED_DATES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load blocked dates:", e);
    }
    // Save defaults
    this.saveBlockedDates(INITIAL_BLOCKED_DATES);
    return INITIAL_BLOCKED_DATES;
  },

  saveBlockedDates(dates: BlockedDateEntry[]): void {
    try {
      localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(dates));
      window.dispatchEvent(new Event("rapeephat_queue_updated"));
    } catch (e) {
      console.error("Failed to save blocked dates:", e);
    }
  },

  addBlockedDate(
    date: string,
    note?: string,
    reason: BlockedDateEntry["reason"] = "fully_booked",
    tableCount?: number | string
  ): BlockedDateEntry {
    const list = this.getBlockedDates();
    const cleanDate = date.split("T")[0];
    const existing = list.find((item) => item.date === cleanDate);
    if (existing) {
      existing.note = note || "คิวงานเต็มทุกช่วงเวลา";
      existing.reason = reason;
      if (tableCount !== undefined && tableCount !== "") {
        existing.tableCount = tableCount;
      }
      this.saveBlockedDates(list);
      return existing;
    }

    const newEntry: BlockedDateEntry = {
      id: `blk-${cleanDate}-${Date.now()}`,
      date: cleanDate,
      tableCount: tableCount !== undefined && tableCount !== "" ? tableCount : undefined,
      note: note || "คิวงานเต็มทุกช่วงเวลา (งดรับจอง)",
      reason,
      createdAt: Date.now(),
    };

    list.push(newEntry);
    this.saveBlockedDates(list);
    return newEntry;
  },

  removeBlockedDate(idOrDate: string): void {
    const list = this.getBlockedDates();
    const clean = idOrDate.split("T")[0];
    const filtered = list.filter((item) => item.id !== idOrDate && item.date !== clean);
    this.saveBlockedDates(filtered);
  },

  // Check if a specific date is full or blocked
  isDateBlocked(dateStr: string): {
    isBlocked: boolean;
    note?: string;
    reason?: string;
    isPaidBooking?: boolean;
    tableCount?: number | string;
  } {
    if (!dateStr) return { isBlocked: false };
    const cleanDate = dateStr.split("T")[0];

    // 1. Check manually blocked dates
    const blockedList = this.getBlockedDates();
    const foundBlocked = blockedList.find((b) => b.date === cleanDate);
    if (foundBlocked) {
      return {
        isBlocked: true,
        note: foundBlocked.note,
        reason: foundBlocked.reason,
        tableCount: foundBlocked.tableCount,
        isPaidBooking: false,
      };
    }

    // 2. Check if there are confirmed/deposit_paid quotations on this date
    try {
      const rawQuotes = localStorage.getItem("rapeephat_quotations_db");
      if (rawQuotes) {
        const quotes: QuotationDoc[] = JSON.parse(rawQuotes);
        const paidQuote = quotes.find(
          (q) =>
            q.customer?.eventDate?.split("T")[0] === cleanDate &&
            (q.status === "deposit_paid" || q.status === "confirmed" || q.status === "completed")
        );
        if (paidQuote) {
          const totalT = paidQuote.tableCount + (paidQuote.freeTableCount || 0);
          return {
            isBlocked: true,
            note: `คิวงานเต็ม ยืนยันแล้ว (${paidQuote.customer.eventType || "งานจัดเลี้ยง"} ${totalT} โต๊ะ)`,
            reason: "fully_booked",
            tableCount: totalT,
            isPaidBooking: true,
          };
        }
      }
    } catch (e) {
      console.error("Error checking quotation date:", e);
    }

    return { isBlocked: false };
  },

  // Build combined live queue events for public schedule display
  buildLiveQueueEvents(quotations: QuotationDoc[]): DynamicQueueEvent[] {
    const events: DynamicQueueEvent[] = [];
    const blockedDates = this.getBlockedDates();

    // 1. Add all Quotations with status "deposit_paid", "confirmed", or "completed"
    quotations.forEach((quote) => {
      const isPaid = quote.status === "deposit_paid" || quote.status === "confirmed" || quote.status === "completed";
      if (!isPaid || !quote.customer?.eventDate) return;

      const fullDate = quote.customer.eventDate.split("T")[0];
      const d = new Date(fullDate);
      if (isNaN(d.getTime())) return;

      const m = d.getMonth();
      let monthKey: DynamicQueueEvent["monthKey"] = "all";
      if (m === 2) monthKey = "mar";
      else if (m === 3) monthKey = "apr";
      else if (m === 4) monthKey = "may";
      else if (m >= 5) monthKey = "jun_dec";

      const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
      const monthLabel = `${monthsThai[m]} ${d.getFullYear() + 543}`;

      // Ceremony Type mapping
      const eventType = quote.customer.eventType || "งานจัดเลี้ยง";
      let ceremonyType: DynamicQueueEvent["ceremonyType"] = "wedding";
      let ceremonyName = `${eventType} 💍`;

      if (eventType.includes("บวช") || eventType.includes("อุปสมบท")) {
        ceremonyType = "ordination";
        ceremonyName = "งานอุปสมบทมงคล 📿";
      } else if (eventType.includes("บ้านใหม่") || eventType.includes("ทำบุญ")) {
        ceremonyType = "housewarming";
        ceremonyName = "งานทำบุญขึ้นบ้านใหม่ 🏡";
      } else if (eventType.includes("วันเกิด") || eventType.includes("แซยิด")) {
        ceremonyType = "birthday";
        ceremonyName = "งานฉลองวันเกิด 🎂";
      } else if (eventType.includes("สังสรรค์") || eventType.includes("ปีใหม่") || eventType.includes("องค์กร")) {
        ceremonyType = "corporate";
        ceremonyName = "งานเลี้ยงสังสรรค์องค์กร 🎉";
      } else if (eventType.includes("ฌาปนกิจ") || eventType.includes("พระราชทานเพลิง")) {
        ceremonyType = "reunion";
        ceremonyName = "งานพิธีจัดเลี้ยง 🕊️";
      }

      // Extract province from location
      let province = quote.customer.eventLocation || "กรุงเทพมหานคร";
      const provMatch = province.match(/(จ\.|จังหวัด)\s*([^\s,]+)/);
      if (provMatch) {
        province = `จ.${provMatch[2]}`;
      } else if (province.includes("กทม") || province.includes("กรุงเทพ")) {
        province = "กรุงเทพมหานคร";
      }

      const totalTables = quote.tableCount + (quote.freeTableCount || 0);

      events.push({
        id: `live-${quote.id || quote.quoteNo}`,
        dateStr: formatThaiDateShort(fullDate),
        fullDate,
        dayOfWeek: getDayOfWeekThai(fullDate),
        monthKey,
        monthLabel,
        ceremonyType,
        ceremonyName,
        hostName: maskCustomerName(quote.customer.name),
        tableCount: `${totalTables} โต๊ะ${quote.freeTableCount ? ` (+แถม ${quote.freeTableCount})` : ""}`,
        location: quote.customer.eventLocation || "สถานที่จัดงานของเจ้าภาพ",
        province,
        timeSlot: quote.customer.eventTime,
        status: "confirmed",
        statusText: quote.status === "deposit_paid" ? "มัดจำล็อกคิวแล้ว 🟢" : "คิวเต็ม ยืนยันแล้ว 🔴",
        statusBadgeClass: quote.status === "deposit_paid"
          ? "bg-emerald-100 text-emerald-900 border-emerald-400 font-black"
          : "bg-red-100 text-red-800 border-red-300 font-black",
        availableSlotsRemaining: 0,
        isFromQuotation: true,
        quoteNo: quote.quoteNo,
      });
    });

    // 2. Add manual Blocked Dates that don't already have quotation events
    blockedDates.forEach((blocked) => {
      const alreadyHas = events.some((e) => e.fullDate === blocked.date);
      if (alreadyHas) return;

      const d = new Date(blocked.date);
      if (isNaN(d.getTime())) return;

      const m = d.getMonth();
      let monthKey: DynamicQueueEvent["monthKey"] = "all";
      if (m === 2) monthKey = "mar";
      else if (m === 3) monthKey = "apr";
      else if (m === 4) monthKey = "may";
      else if (m >= 5) monthKey = "jun_dec";

      const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
      const monthLabel = `${monthsThai[m]} ${d.getFullYear() + 543}`;

      const formattedTables = blocked.tableCount ? `รับบริการเต็ม ${blocked.tableCount} โต๊ะ` : "เต็มทุกช่วงเวลา";

      events.push({
        id: blocked.id,
        dateStr: formatThaiDateShort(blocked.date),
        fullDate: blocked.date,
        dayOfWeek: getDayOfWeekThai(blocked.date),
        monthKey,
        monthLabel,
        ceremonyType: "wedding",
        ceremonyName: "คิวงานจัดเลี้ยงเต็ม 🔒",
        hostName: "ล็อกคิวจัดเลี้ยงเรียบร้อย",
        tableCount: formattedTables,
        location: blocked.note || "งดรับจองในวันดังกล่าว",
        province: "กทม. & ปริมณฑล / ต่างจังหวัด",
        status: "confirmed",
        statusText: blocked.tableCount ? `คิวเต็ม (${blocked.tableCount} โต๊ะ) 🔴` : "คิวเต็ม ปิดรับจอง 🔴",
        statusBadgeClass: "bg-red-100 text-red-800 border-red-300 font-black",
        availableSlotsRemaining: 0,
      });
    });

    // Sort chronologically
    return events.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  },
};
