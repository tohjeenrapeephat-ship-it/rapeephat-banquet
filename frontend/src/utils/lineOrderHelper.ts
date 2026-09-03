import { QuotationDoc } from '../types/quotation.js';
import { formatCurrency } from './currency.js';
import { formatThaiDate } from './thaiDate.js';

export const formatLineOrderMessage = (quote: QuotationDoc): string => {
  const dishesList = quote.selectedDishes
    .map((d, i) => `   ${i + 1}. ${d.dishName}`)
    .join('\n');

  const isBkk = (quote.customer.locationZone || 'bkk_metro') === 'bkk_metro';
  const travelText = quote.travelFee?.isFree
    ? 'ฟรี 0 บาท (สั่ง 20 โต๊ะขึ้นไป กทม./ปริมณฑล)'
    : quote.travelFee && quote.travelFee.amount > 0
    ? `${formatCurrency(quote.travelFee.amount)} บาท`
    : isBkk
    ? '1,500 บาท (กทม./ปริมณฑล)'
    : 'คำนวณตามระยะทางจริง (ต่างจังหวัด)';

  return `🏮✨ แจ้งสั่งจองโต๊ะจีน / สรุปออร์เดอร์ โต๊ะจีนรพีพัฒน์ 35 ปี ✨🏮\n\n` +
    `📌 เลขที่เอกสาร: ${quote.quoteNo}\n` +
    `👤 เจ้าภาพ/ผู้ติดต่อ: คุณ${quote.customer.name}\n` +
    `📞 เบอร์โทรศัพท์: ${quote.customer.phone}\n` +
    (quote.customer.email ? `✉️ อีเมล: ${quote.customer.email}\n` : '') +
    `📅 วันที่จัดงาน: ${formatThaiDate(quote.customer.eventDate)} (${quote.customer.eventTime || 'ช่วงเย็น'})\n` +
    `📍 สถานที่จัดงาน: ${quote.customer.eventLocation}\n` +
    `🏷️ ประเภทงาน: ${quote.customer.eventType || 'งานเลี้ยงสังสรรค์'}\n` +
    `----------------------------------------\n` +
    `🍱 แพ็กเกจอาหาร: ${quote.package.name} (${formatCurrency(quote.package.price)}.- / โต๊ะ)\n` +
    `🍽️ จำนวนโต๊ะ: ${quote.tableCount} โต๊ะ` +
    (quote.freeTableCount > 0 ? ` (แถมฟรีโปร 20 แถม 1: +${quote.freeTableCount} โต๊ะ รวม ${quote.tableCount + quote.freeTableCount} โต๊ะ)` : '') + `\n` +
    (quote.beverage ? `🥤 เครื่องดื่ม: ${quote.beverage.name} (${formatCurrency(quote.beverage.pricePerTable)}.- / โต๊ะ)\n` : '') +
    (quote.floorService?.enabled ? `🏢 บริการยกขึ้นอาคาร: รวม ${formatCurrency(quote.floorService.total)} บาท\n` : '') +
    `🚚 ค่าเดินทางขนส่ง: ${travelText}\n\n` +
    `📋 รายการอาหารที่เลือก (${quote.selectedDishes.length} จาน):\n${dishesList}\n\n` +
    `----------------------------------------\n` +
    `💰 ยอดสุทธิรวมทั้งสิ้น: ${formatCurrency(quote.grandTotal)} บาท\n` +
    `🔒 ยอดมัดจำล็อกคิว (30%): ${formatCurrency(quote.depositAmount)} บาท\n` +
    `💵 ยอดคงเหลือชำระวันงาน (70%): ${formatCurrency(quote.finalAmount)} บาท\n` +
    `----------------------------------------\n` +
    `🏦 ข้อมูลบัญชีสำหรับโอนมัดจำ:\n` +
    `   • ธนาคารไทยพาณิชย์: 411-239908-0 (สาขาเซ็นทรัล นครปฐม)\n` +
    `   • ชื่อบัญชี: นางสาวทัศวรรณ จันทร์หอม\n` +
    `   • พร้อมเพย์: 081-331-1646\n\n` +
    (quote.pdfDriveUrl ? `📄 ลิงก์ใบเสนอราคา PDF: ${quote.pdfDriveUrl}\n\n` : '') +
    `รบกวนคุณแป้งตรวจสอบคิวงานและยืนยันออร์เดอร์ให้ด้วยนะคะ ขอบคุณค่ะ 🙏👑`;
};

export const sendOrderToLine = (quote: QuotationDoc): void => {
  const message = formatLineOrderMessage(quote);
  
  // 1. Copy formatted text to clipboard
  try {
    navigator.clipboard.writeText(message);
  } catch (err) {
    console.warn('Clipboard copy error:', err);
  }

  // 2. Open LINE with encoded text or direct chat
  const encoded = encodeURIComponent(message);
  const lineShareUrl = `https://line.me/R/msg/text/?${encoded}`;
  const lineDirectUrl = `https://line.me/ti/p/~pang_baichaa`;

  // On Mobile / Desktop, open LINE
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    // Open LINE text sharing scheme
    window.location.href = lineShareUrl;
  } else {
    // Open in new tab
    window.open(lineDirectUrl, '_blank');
  }
};
