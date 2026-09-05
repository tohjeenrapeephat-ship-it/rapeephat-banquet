export function formatThaiDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // BE
    
    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Format customer name with honorific 'คุณ' prefix
 */
export function formatCustomerNameWithPrefix(name?: string): string {
  if (!name || !name.trim()) return 'คุณลูกค้าผู้มีเกียรติ';
  const trimmed = name.trim();
  
  const prefixes = [
    'คุณ', 'นาย', 'นาง', 'นางสาว', 'น.ส.', 'ดร.', 'ศ.', 'ผศ.', 'รศ.', 
    'พล.', 'พ.ต.', 'พ.อ.', 'พ.ท.', 'ร.ต.', 'ร.อ.', 'ร.ท.', 
    'บจก.', 'หจก.', 'บริษัท', 'ห้างหุ้นส่วน'
  ];
  
  const hasPrefix = prefixes.some(p => trimmed.startsWith(p));
  if (hasPrefix) return trimmed;
  
  return `คุณ${trimmed}`;
}

