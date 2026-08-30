/**
 * Format number into Thai Baht string e.g. 1,500
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('th-TH');
}

/**
 * Convert number into Thai Baht Text e.g. 15000 -> หนึ่งหมื่นห้าพันบาทถ้วน
 */
export function thaiBahtText(num: number): string {
  if (isNaN(num)) return '';
  if (num === 0) return 'ศูนย์บาทถ้วน';

  const numbers = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  // Split integer and decimal parts
  const [intStr, decStr = ''] = num.toFixed(2).split('.');
  
  function convertGroup(nStr: string): string {
    let result = '';
    const len = nStr.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(nStr[i], 10);
      const pos = len - i - 1;
      if (digit !== 0) {
        if (pos === 1 && digit === 1) {
          result += 'สิบ';
        } else if (pos === 1 && digit === 2) {
          result += 'ยี่สิบ';
        } else if (pos === 0 && digit === 1 && len > 1 && parseInt(nStr[len - 2], 10) !== 0) {
          result += 'เอ็ด';
        } else {
          result += numbers[digit] + units[pos];
        }
      }
    }
    return result;
  }

  let text = '';
  // Handling millions if needed
  if (intStr.length > 6) {
    const millionPart = intStr.slice(0, intStr.length - 6);
    const remainPart = intStr.slice(intStr.length - 6);
    text = convertGroup(millionPart) + 'ล้าน' + convertGroup(remainPart);
  } else {
    text = convertGroup(intStr);
  }

  text += 'บาท';

  const satang = parseInt(decStr, 10);
  if (satang === 0) {
    text += 'ถ้วน';
  } else {
    text += convertGroup(decStr) + 'สตางค์';
  }

  return text;
}
