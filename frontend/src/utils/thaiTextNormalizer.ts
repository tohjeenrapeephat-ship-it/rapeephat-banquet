/**
 * 🇹🇭 Thai Dish Name Normalizer & Canonical Matcher
 * Handles spelling variations, tone marks, parenthetical descriptions, and synonyms.
 */

/**
 * Normalizes common Thai dish spelling variations to canonical forms.
 */
export function normalizeThaiDishName(name: string = ''): string {
  if (!name) return '';
  let str = name.toLowerCase().trim();

  // 1. Normalize all variations of 'ออเดิร์ฟ' / 'ออร์เดริ์ฟ' / 'ออร์เดิร์ฟ' / 'ออเดริฟ' / 'ออเดิฟ'
  str = str.replace(/อ[ออร์]+[เเด]+[ริิร์]+[ฟฟ์]+/g, 'ออเดิร์ฟ');
  str = str.replace(/ออเดิ[ฟร]/g, 'ออเดิร์ฟ');
  str = str.replace(/ออร์เดิ[ฟร]/g, 'ออเดิร์ฟ');
  str = str.replace(/ออร์เดิ์ฟ/g, 'ออเดิร์ฟ');
  str = str.replace(/ออร์เดิร์ฟ/g, 'ออเดิร์ฟ');
  str = str.replace(/ออเดริ์ฟ/g, 'ออเดิร์ฟ');
  str = str.replace(/ออเดริฟ/g, 'ออเดิร์ฟ');
  str = str.replace(/ออเดิฟ/g, 'ออเดิร์ฟ');
  str = str.replace(/ออร์เดฟ/g, 'ออเดิร์ฟ');
  str = str.replace(/ออเดอฟ/g, 'ออเดิร์ฟ');

  // 2. Normalize other common Thai culinary terms
  str = str.replace(/กะเพาะปลา/g, 'กระเพาะปลา');
  str = str.replace(/หนำเลียบ/g, 'หนำเลี๊ยบ');
  str = str.replace(/โพ๊ะแตก/g, 'โป๊ะแตก');
  str = str.replace(/ติมซำ/g, 'ติ่มซำ');
  str = str.replace(/หมี่ซัว/g, 'หมี่ซั่ว');
  str = str.replace(/โอนี/g, 'โอนี่');
  str = str.replace(/โอวนี้/g, 'โอนี่');

  // 3. Remove consecutive spaces
  str = str.replace(/\s+/g, ' ').trim();

  return str;
}

/**
 * Extracts base dish title by removing parenthetical ingredient details
 * e.g. "ออเดิร์ฟ 5 อย่าง (ขนมจีบ, ไข่เยี่ยวม้า, ไส้กรอก...)" -> "ออเดิร์ฟ 5 อย่าง"
 */
export function extractDishBaseName(name: string = ''): string {
  if (!name) return '';
  let base = normalizeThaiDishName(name);

  // Remove parenthesis content
  base = base.replace(/\s*\([^)]*\)/g, '').trim();
  base = base.replace(/\s*\[[^\]]*\]/g, '').trim();
  base = base.replace(/\s*\{[^}]*\}/g, '').trim();

  return base;
}

/**
 * Checks if a dish or course is an appetizer (ออเดิร์ฟ 5 อย่าง / จานที่ 2)
 */
export function isAppetizerDish(dishName: string = '', courseTitle: string = ''): boolean {
  const normDish = normalizeThaiDishName(dishName);
  const normCourse = normalizeThaiDishName(courseTitle);

  const keywords = [
    'ออเดิร์ฟ',
    'ขนมจีบ',
    'ไข่เยี่ยวม้า',
    'เป๋าฮื้อแผ่น',
    'เกี๊ยวซ่า',
    'หมูแผ่น',
    '5 อย่าง',
    'ห้าอย่าง',
    'จานรวมมิตร'
  ];

  if (keywords.some((k) => normDish.includes(k))) return true;
  if (normCourse.includes('จานที่ 2') || normCourse.includes('ออเดิร์ฟ')) return true;

  return false;
}
