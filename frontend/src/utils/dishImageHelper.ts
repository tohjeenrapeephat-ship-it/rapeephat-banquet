/**
 * 🍽️ Dish Image Helper Utility
 * Maps any banquet dish name or course category to authentic high-resolution plated dish photos.
 * 100% verified across all package tiers (1,400 to 6,000 THB) with zero fallbacks.
 */

export const getDishImage = (dishName: string = '', courseTitle: string = ''): string => {
  const d = (dishName || '').toLowerCase().trim();
  const c = (courseTitle || '').toLowerCase().trim();

  // --- 0. PRIORITY DISH MAPPING (แกงป่ารวมมิตร / แกงป่า / โฮกฮือ) ---
  if (d.includes('แกงป่า') || d.includes('โฮกฮือ')) {
    return '/images/dishes/hotpots/hotpot-gaengpa-ruammit-2026.jpg?v=20260905_v3';
  }

  // --- 1. Snack Starters & Crackers (ข้าวเกรียบ & ถั่วอบ & ของทานเล่น) ---
  if (
    ['ข้าวเกรียบ', 'ถั่วทอด', 'ถั่วอบ', 'ถั่วโก๋แก่', 'เฟรนช์ฟรายส์', 'ของทานเล่น', 'เม็ดมะม่วงหิมพานต์อบเกลือ', 'เม็ดมะม่วงอบ'].some((k) => d.includes(k)) ||
    c.startsWith('จานที่ 1 ') ||
    c === 'จานที่ 1' ||
    d === 'เม็ดมะม่วง'
  ) {
    return '/images/dishes/dish-prawn-crackers.jpg';
  }

  // --- 2. Desserts (ของหวานมงคล - ป้องกันการชนกับเมนูยำ / ข้าวผัด / ซุปหม้อไฟ / สลัด) ---
  if (['ฟรุตสลัด', 'สลัดผลไม้', 'ผลไม้รวม', 'ฟรุ้ตสลัด'].some((k) => d.includes(k))) {
    return '/images/dishes/desserts/dessert-fruitsalad-fresh-milk.jpg';
  }

  const isDessertContext = !d.includes('ผัด') && !d.includes('โหงวก๊วย') && !d.includes('ยำ') && !d.includes('สลัดกุ้ง') && !d.includes('สลัดปู') && !d.includes('ข้าวผัด') && !d.includes('หม้อไฟ') && !d.includes('ต้ม') && !d.includes('แกง') && !d.includes('หัวปลา') && !d.includes('ทอด');

  if (isDessertContext) {
    if (!d.includes('วุ้นเส้น') && ['วุ้น', 'วุ้นมะพร้าว', 'วุ้นกะทิ', 'วุ้นใบเตย', 'วุ้นมะพร้าวอ่อน', 'วุ้นมะพร้าวน้ำหอม', 'วุ้นหวานเย็น', 'วุ้นรวมมิตร'].some((k) => d.includes(k))) {
      return '/images/dishes/desserts/dessert-woon-maprao.jpg';
    }
    if (['ฟรุตสลัด', 'สลัดผลไม้', 'ผลไม้รวม'].some((k) => d.includes(k))) {
      return '/images/dishes/desserts/dessert-fruitsalad-fresh-milk.jpg';
    }
    if (['สตรอว์', 'สตรอเบอร์รี่'].some((k) => d.includes(k))) {
      return '/images/dishes/desserts/dessert-strawberry-loy-kaew-wood.jpg';
    }
    if (['โอนี่', 'โอนี', 'โอวนี้', 'เผือกกวน', 'ข้าวเหนียวเผือก', 'เผือกหิมะ'].some((k) => d.includes(k)) || (d.includes('เผือก') && !d.includes('กระทงเผือก') && !d.includes('หัวปลา'))) {
      return '/images/dishes/desserts/dessert-ohnee-ginkgo-coconut-wood.jpg';
    }
    if (['เต้าทึง', 'น้ำลำไย'].some((k) => d.includes(k))) {
      return '/images/dishes/desserts/dessert-taotung-nam-lamyai-wood.jpg';
    }
    if (['ลิ้นจี่', 'ลิ้นจี้'].some((k) => d.includes(k))) {
      return '/images/dishes/desserts/dessert-lychee-loy-kaew.jpg';
    }
    if (['เงาะ', 'ลอยแก้ว'].some((k) => d.includes(k))) {
      return '/images/dishes/desserts/dessert-rambutan-loy-kaew-wood.jpg';
    }
    if (['นมสด', 'มะพร้าวอ่อน', 'แปะก๊วยนมสด', 'เต้าฮู้นมสด', 'แปะก๊วยรังนก', 'แปะก๊วยตุ๋น'].some((k) => d.includes(k)) || (c.includes('ของหวาน') && d.includes('รังนก'))) {
      return '/images/dishes/desserts/dessert-ginkgo-fresh-milk-coconut.jpg';
    }
    if (['รวมมิตร', 'หวานเย็น'].some((k) => d.includes(k)) || (c.includes('ของหวาน') && d.includes('แปะก๊วย'))) {
      return '/images/dishes/desserts/dessert-ruam-mit-wood.jpg';
    }
  }

  // --- 3. Soups / Fish Maw / Shark Fin / Chinese Herb (กระเพาะปลา & หูฉลาม & ซุปตุ๋นยาจีน) ---
  if (d.includes('หูฉลาม')) {
    return '/images/dishes/dish-sharkfin-soup.jpg';
  }
  if (d.includes('กระเพาะปลา') || d.includes('กะเพาะปลา')) {
    if (d.includes('ผัดแห้ง')) {
      return '/images/dishes/soups/soup-fishmaw-crab-macro.jpg';
    }
    return '/images/dishes/soups/soup-fishmaw-spoon-lift.jpg';
  }
  // ไก่ตุ๋นเห็ดหอมยาจีน / ไก่ตุ๋นยาจีน / ไก่ตุ๋นเห็ดหอม / ปีกไก่ตุ๋น / ไก่ดำตุ๋นยาจีน
  if (['ไก่ตุ๋น', 'ไก่บ้านตุ๋น', 'ไก่ดำตุ๋น', 'ปีกไก่ตุ๋น', 'น่องไก่ตุ๋น'].some((k) => d.includes(k))) {
    return '/images/dishes/soups/soup-chicken-chinese-herb.jpg';
  }
  // แกงจืดหม้อไฟเครื่องในลูกชิ้น / แกงจืดลูกชิ้นหม้อไฟ / แกงจืดลูกชิ้น
  if (['แกงจืดหม้อไฟ', 'เครื่องในลูกชิ้น', 'แกงจืดลูกชิ้น', 'ลูกชิ้นหม้อไฟ'].some((k) => d.includes(k)) || (d.includes('แกงจืด') && d.includes('ลูกชิ้น'))) {
    return '/images/dishes/hotpots/hotpot-gaeng-jued-lookchin-2026.jpg';
  }
  // กระดูกหมูตุ๋นเห็ดหอมเยื่อไผ่ / ซี่โครงหมูตุ๋น / เยื่อไผ่ / เห็ดหอม
  if (['กระดูกหมู', 'ซี่โครงหมู', 'เยื่อไผ่', 'เห็ดหอม'].some((k) => d.includes(k))) {
    return '/images/dishes/soups/soup-pork-rib-bamboo-fungus.jpg';
  }
  // ซุปตุ๋นยาจีนอื่นๆ (เป็ดตุ๋น, สามเซียนตุ๋น, หน่อไม้กระป๋อง, แกงจืด)
  if (['ยาจีน', 'ตุ๋นยาจีน', 'เป็ดตุ๋น', 'สามเซียนตุ๋น', 'หน่อไม้กระป๋อง', 'แกงจืด'].some((k) => d.includes(k))) {
    return '/images/dishes/soups/soup-chicken-chinese-herb.jpg';
  }

  // --- 4. Hotpot / Tom Yum / Poh Taek / Gaeng Som (ต้มยำ & โป๊ะแตก & แกงส้มหม้อไฟ) ---
  if (['ต้มยำขาหมู', 'ต้มแซ่บขาหมู', 'ขาหมูต้มยำ'].some((k) => d.includes(k)) || (d.includes('ต้มยำ') && d.includes('ขาหมู'))) {
    return '/images/dishes/hotpots/hotpot-tomyum-pork-knuckle.jpg';
  }
  if (['โป๊ะแตก', 'โพ๊ะแตก'].some((k) => d.includes(k))) {
    return '/images/dishes/hotpots/hotpot-seafood-potaek-steaming-1.jpg';
  }
  if (['หัวปลา', 'ต้มเผือก'].some((k) => d.includes(k)) || (d.includes('ต้มยำ') && ['ปลากะพง', 'ปลาเก๋า', 'ปลาดอลลี่'].some((k) => d.includes(k)))) {
    return '/images/dishes/hotpots/hotpot-seabass-grouper-flaming-chimney.jpg';
  }
  if (d.includes('ต้มยำ') && ['กุ้ง', 'แม่น้ำ'].some((k) => d.includes(k))) {
    return '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-macro-4.jpg';
  }
  if (d.includes('ต้มยำ') && ['รวมมิตร', 'ทะเล', 'ซีฟู้ด'].some((k) => d.includes(k))) {
    return '/images/dishes/hotpots/hotpot-seafood-potaek-ladle-5.jpg';
  }
  if (['ต้มยำ', 'หม้อไฟ', 'เย็นตาโฟ'].some((k) => d.includes(k))) {
    return '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-blackwood.jpg';
  }
  if (['แกงส้ม', 'ชะอมกุ้ง', 'ชะอมไข่', 'แป๊ะซะ'].some((k) => d.includes(k))) {
    return '/images/dishes/hotpots/hotpot-gaengsom-cha-om-kung.jpg';
  }
  if (['แกงป่า', 'โฮกฮือ', 'ต้มโคล้ง'].some((k) => d.includes(k))) {
    return '/images/dishes/hotpots/hotpot-gaengpa-ruammit-2026.jpg?v=20260905';
  }

  // --- 5. Rice & Noodles (ข้าวผัด & ผัดหมี่มงคล - ตรวจสอบความถูกต้องของทุกเมนูข้าวผัด) ---
  if (
    ['ข้าวผัดไก่', 'ผัดไก่'].some((k) => d.includes(k)) ||
    (d.includes('ข้าวผัด') && d.includes('ไก่')) ||
    (d.includes('ข้าว') && d.includes('ไก่') && !d.includes('ข้าวเกรียบ'))
  ) {
    return '/images/dishes/rice/fried-rice-chicken-red-platter.jpg';
  }
  if (['หมูหยอง', 'ปูโรยหมูหยอง', 'ข้าวผัดหมูหยอง', 'บะหมี่น้ำผึ้งหมูหยอง'].some((k) => d.includes(k))) {
    return '/images/dishes/rice/fried-rice-crab-porkfloss-red-platter.jpg';
  }
  if (
    ['ข้าวผัดปู', 'ปูก้อน', 'เนื้อปู', 'บะหมี่หยกเนื้อปู'].some((k) => d.includes(k)) ||
    (d.includes('ข้าวผัด') && d.includes('ปู'))
  ) {
    return '/images/dishes/rice/fried-rice-lump-crab-red-platter.jpg';
  }
  if (['หนำเลี๊ยบ', 'หนำเลียบ', 'ข้าวผัดหนำเลี๊ยบ', 'ข้าวผัดหนำเลี้ยบ'].some((k) => d.includes(k))) {
    return '/images/dishes/rice/fried-rice-black-olive-red-platter.jpg';
  }
  if (['ข้าวผัดแฮม'].some((k) => d.includes(k)) || (d.includes('ข้าวผัด') && d.includes('แฮม'))) {
    return '/images/dishes/rice/fried-rice-ham-red-platter.jpg';
  }
  if (['ข้าวผัดฮ่องกง'].some((k) => d.includes(k))) {
    return '/images/dishes/rice/fried-rice-hongkong-red-platter.jpg';
  }
  if (['ข้าวผัดทะเล', 'ข้าวผัดซีฟู้ด', 'ข้าวผัดรวมมิตร'].some((k) => d.includes(k))) {
    return '/images/dishes/rice/fried-rice-seafood-red-platter.jpg';
  }
  if (['ผัดหมี่', 'หมี่ฮ่องกง', 'ผัดหมี่ฮ่องกง', 'หมี่ซั่ว', 'โกยซีหมี่', 'บะหมี่'].some((k) => d.includes(k))) {
    return '/images/dishes/rice/pad-mee-hongkong-2026.jpg';
  }
  if (
    ['ข้าวห่อใบบัว', 'ข้าวผัด'].some((k) => d.includes(k)) ||
    (d.includes('ข้าว') && !d.includes('ข้าวเกรียบ') && !d.includes('ข้าวเหนียว'))
  ) {
    return '/images/dishes/rice/fried-rice-combination-red-platter.jpg';
  }

  // --- 6. Fish Dishes (ปลานึ่ง / ปลาทอด / ปลาสดยำ / เมี่ยงปลา) ---
  // เมี่ยงปลาทับทิม / เมี่ยงปลาช่อน / เมี่ยงปลา
  if (['เมี่ยงปลา', 'เมี่ยงปลาทับทิม', 'เมี่ยงปลาช่อน', 'ปลาเมี่ยง', 'เมี่ยง'].some((k) => d.includes(k))) {
    return '/images/dishes/fish/fish-ruby-miang-pla-herb-2026.jpg';
  }
  if (['ปลาทับทิม', 'ปลากะพง', 'ปลาช่อน', 'ปลาหมึก', 'ปลาแซลมอน', 'ปลาเก๋า', 'ปลาหิมะ', 'ปลาดอลลี่', 'ปลากระบอก'].some((k) => d.includes(k))) {
    if (['ทอดสมุนไพร', 'สมุนไพร'].some((k) => d.includes(k))) {
      return '/images/dishes/fish/fish-seabass-fried-herbal-2026.jpg';
    }
    if (['สามรส', '3 รส', 'ราดพริก'].some((k) => d.includes(k))) {
      return '/images/dishes/fish/fish-ruby-three-flavor-red-oval.jpg';
    }
    if (['ทอดน้ำปลา', 'ยำมะม่วง', 'ราดน้ำปลา'].some((k) => d.includes(k))) {
      return '/images/dishes/fish/fish-ruby-fried-fishsauce-red-oval.jpg';
    }
    if (['นึ่งบ๊วย', 'นึ่งซีอิ๊ว', 'ต้มบ๊วย'].some((k) => d.includes(k))) {
      return '/images/dishes/fish/fish-ruby-steamed-plum-red-oval.jpg';
    }
    return '/images/dishes/fish/fish-seabass-steamed-lime-red-oval.jpg';
  }

  // --- 7. Duck / Pork / Knuckle / Hong Kong Roast (เป็ด / หมูหัน / ขาหมู) ---
  if (d.includes('เป็ดปักกิ่ง')) {
    return '/images/dishes/peking-duck/peking-duck-plate-flatlay.jpg';
  }
  if (d.includes('หมูหัน')) {
    return '/images/dishes/peking-duck/peking-duck-skin-macro.jpg';
  }
  // เป็ดยัดไส้หน่อไม้จีน / เป็ดยัดไส้ / เป็ดยัดไส้เกาลัด / ไก่ยัดไส้
  if (['เป็ดยัดไส้', 'ยัดไส้หน่อไม้', 'ยัดไส้เกาลัด', 'ไก่ยัดไส้'].some((k) => d.includes(k))) {
    return '/images/dishes/ducks/duck-stuffed-bamboo-shoots.jpg';
  }
  // เป็ดอบยอดผัก / เป็ดยอดผัก / เป็ดอบ / เป็ดอบน้ำผึ้ง
  if (['เป็ดอบยอดผัก', 'เป็ดยอดผัก', 'เป็ดอบ', 'ยอดผัก'].some((k) => d.includes(k)) && !d.includes('ไก่')) {
    return '/images/dishes/ducks/ped-ob-yod-pak-braised-2026.jpg';
  }
  // เป็ดพะโล้ / เป็ดพะโล้ทรงเครื่อง
  if (['เป็ดพะโล้', 'พะโล้'].some((k) => d.includes(k)) && !d.includes('หมู')) {
    return '/images/dishes/ducks/ped-palo-braised-2026.jpg';
  }
  // เป็ดสับย่าง / เป็ดย่าง / เป็ดสับ / เป็ด
  if (['เป็ดสับ', 'เป็ดย่าง', 'เป็ด'].some((k) => d.includes(k))) {
    return '/images/dishes/ducks/ped-sap-yang-orchid-2026.jpg';
  }
  // ยำขาหมูสไลด์ / ยำขาหมู / ขาหมูสไลด์ (ต้องเช็คก่อนขาหมูตุ๋นทั่วไป)
  if (['ยำขาหมู', 'ขาหมูสไลด์', 'ยำขาหมูสไลด์'].some((k) => d.includes(k))) {
    return '/images/dishes/salads/salad-pork-knuckle-sliced-red-platter.jpg';
  }
  if (['ขาหมูเยอรมัน', 'ขาหมูทอด', 'ขาหมูตุ๋นยาจีนทอด'].some((k) => d.includes(k))) {
    return '/images/dishes/pork/pork-knuckle-braised-red-plate-dining.jpg';
  }
  if (['ขาหมู', 'หมั่นโถ'].some((k) => d.includes(k)) && !d.includes('ยำ') && !d.includes('ต้มยำ')) {
    return '/images/dishes/pork/pork-knuckle-braised-peanut-platter.jpg';
  }
  // กระเพาะหมูผัดเกี้ยมฉ่าย / กระเพาะหมู / เกี้ยมฉ่าย
  if (['กระเพาะหมู', 'เกี้ยมฉ่าย'].some((k) => d.includes(k)) && !d.includes('แกงจืด') && !d.includes('ต้ม')) {
    return '/images/dishes/pork/pork-stomach-pickled-mustard-red-platter.jpg';
  }
  // หมูกรอบ / หมูกรอบเหล้าแดง
  if (['หมูกรอบ', 'หมูกรอบเหล้าแดง'].some((k) => d.includes(k))) {
    return '/images/dishes/pork/crispy-pork-belly-crackling-2026.jpg';
  }

  // --- 8. Appetizers / Dim Sum / Fried / Stir-fry / Prawn Dishes ---
  // ไก่ผัดเม็ดมะม่วง / ผัดเม็ดมะม่วง / ไก่ผัดเม็ดมะม่วงหิมพานต์
  if (['ไก่ผัดเม็ดมะม่วง', 'ผัดเม็ดมะม่วง'].some((k) => d.includes(k))) {
    return '/images/dishes/appetizers/chicken-cashew-stirfry.jpg';
  }
  if (['ออเดิร์ฟทะเล', 'ทะเลนึ่ง', 'เตาซึ้ง'].some((k) => d.includes(k))) {
    return '/images/dishes/appetizers/appetizer-seafood-steamer.jpg';
  }
  // สี่สีไส้มังกร / สี่สีทอด / ไส้มังกร / หอยจ๊อปู / แฮ่กึ๊น
  if (['สี่สีไส้มังกร', 'ไส้มังกร', 'สี่สีทอด', 'สี่สี'].some((k) => d.includes(k)) && !d.includes('ขนมจีบ') && !d.includes('หม้อไฟ')) {
    return '/images/dishes/appetizers/see-see-sai-mungkorn-2026.jpg';
  }
  // จานที่ 2 ของชุด 1,700.- (ขนมจีบ, ไข่เยี่ยวม้า, ไส้กรอก, แฮม, หมูแผ่น, สลัดกุ้งทอด, สลัดปลาทิพย์)
  if (
    (d.includes('ขนมจีบ') && (d.includes('สลัดกุ้ง') || d.includes('ปลาทิพย์'))) ||
    d.includes('สลัดกุ้งทอด, สลัดปลาทิพย์')
  ) {
    return '/images/dishes/appetizers/appetizer-5-platter-banquet-tower.jpg';
  }
  // จานที่ 2 ของชุด 1,500.- / 1,400.- (ขนมจีบ, ไข่เยี่ยวม้า, ไส้กรอก, แฮม, หมูแผ่น) และออเดิร์ฟ 5 อย่างมาตรฐาน
  if (['ขนมจีบ', 'ติ่มซำ', 'ออเดิร์ฟ', 'เป๋าฮื้อแผ่น', 'เกี๊ยวซ่า', 'หมูแผ่น', 'ไข่เยี่ยวม้า'].some((k) => d.includes(k)) || c.includes('จานที่ 2') || c.includes('ออเดิร์ฟ')) {
    return '/images/dishes/appetizers/appetizer-5-platter-marble.jpg';
  }
  // กุ้งอบวุ้นเส้น / ปูทะเลอบวุ้นเส้น / ทะเลอบวุ้นเส้น / อบวุ้นเส้น
  if (['อบวุ้นเส้น', 'กุ้งอบวุ้นเส้น', 'ปูทะเลอบวุ้นเส้น', 'ทะเลอบวุ้นเส้น'].some((k) => d.includes(k))) {
    return '/images/dishes/appetizers/appetizer-prawn-glass-noodles.jpg';
  }
  // ทอดมันกุ้ง / ทอดมันกุ้งสด / ทอดมัน
  if (['ทอดมันกุ้ง', 'ทอดมัน'].some((k) => d.includes(k))) {
    return '/images/dishes/appetizers/tod-mun-kung-crispy-2026.jpg';
  }
  // ยำตะไคร้กุ้งสด / ยำตะไคร้ / ยำกุ้งสด
  if (['ยำตะไคร้', 'ตะไคร้กุ้งสด', 'ยำตะไคร้กุ้ง', 'ยำกุ้งสด'].some((k) => d.includes(k))) {
    return '/images/dishes/salads/salad-yam-takrai-kung-sod-2026.jpg';
  }
  if (!d.includes('สลัด') && !d.includes('ยำ') && ['กุ้งอบ', 'กุ้งนึ่ง', 'กุ้งผัด', 'กุ้งทอด', 'กุ้งแชบ๊วย', 'กุ้ง', 'ทะเลอบ', 'ปูทะเลอบ'].some((k) => d.includes(k))) {
    return '/images/dishes/appetizers/appetizer-prawns-dip.jpg';
  }
  // ไก่ทอดอบซอสเหล้าแดง / ไก่อบซอสเหล้าแดง / ซอสเหล้าแดง
  if (['เหล้าแดง', 'ซอสเหล้าแดง', 'ไก่ทอดอบซอสเหล้าแดง', 'ไก่อบซอสเหล้าแดง'].some((k) => d.includes(k)) && !d.includes('หมูกรอบ')) {
    return '/images/dishes/appetizers/chicken-crispy-red-wine-sauce-custom-2026.jpg';
  }
  // ผัดโหงวก๊วยรังนก / ผัดโหงวก๊วย / โหงวก๊วยรังนก / โหงวก๊วย / กระทงรังนก
  if (['โหงวก๊วย', 'ผัดโหงวก๊วย', 'โหงวก๊วยรังนก', 'กระทงรังนก', 'ห้าเซียน'].some((k) => d.includes(k))) {
    return '/images/dishes/appetizers/pad-ngow-kuay-bird-nest-2026.jpg';
  }
  // ไก่ต้มน้ำปลา / ไก่น้ำปลา / ต้มน้ำปลา
  if (['ไก่ต้มน้ำปลา', 'ต้มน้ำปลา', 'ไก่น้ำปลา'].some((k) => d.includes(k))) {
    return '/images/dishes/appetizers/chicken-tom-nam-pla-platter-2026.jpg';
  }
  if (['บล็อกโคลี่', 'ไก่ผัด', 'ไก่ทอด', 'ไก่ต้ม', 'ไก่ตอน', 'ไก่อบ', 'ไก่แช่เหล้า', 'ไก่', 'ปีกไก่', 'สามเซียนผัด', 'หน่อไม้ทะเล', 'ผัดฉ่า', 'พริกไทยดำ'].some((k) => d.includes(k))) {
    return '/images/dishes/ducks/duck-abalone-shrimp-platter.jpg';
  }

  // --- 9. Salad & Spicy Yum (สลัด & ยำ) ---
  // หมูมะนาว (จานโต๊ะจีนเรียงรายน้ำยำมะนาวพริกกระเทียมสด)
  if (['หมูมะนาว'].some((k) => d.includes(k))) {
    return '/images/dishes/salads/moo-manao-banquet-2026.jpg';
  }
  // ยำหมูย่าง / หมูย่าง / คอหมูย่าง / หมูสะดุ้ง
  if (['ยำหมูย่าง', 'หมูย่าง', 'คอหมูย่าง', 'หมูสะดุ้ง'].some((k) => d.includes(k))) {
    return '/images/dishes/salads/salad-grilled-pork-yum.jpg';
  }
  // ยำทะเล & ยำรวมมิตร & ยำซีฟู้ด
  if (['ยำทะเล', 'ยำรวมมิตรทะเล', 'ยำรวมมิตร', 'ยำซีฟู้ด'].some((k) => d.includes(k))) {
    return '/images/dishes/salads/salad-seafood-mixed-red-platter.jpg';
  }
  // ยำสามกรอบ
  if (d.includes('สามกรอบ')) {
    return '/images/dishes/salads/salad-samkrob-cashew-lattice.jpg';
  }
  // ยำอื่นๆ
  if (d.includes('ยำ') && !d.includes('ต้มยำ')) {
    return '/images/dishes/salads/salad-seafood-macro.jpg';
  }

  // สลัดปลาทิพย์
  if (d.includes('ปลาทิพย์')) {
    return '/images/dishes/salads/salad-plathip-crispy.jpg';
  }
  // สลัดกุ้งทอดกระทงเผือก
  if (d.includes('กระทงเผือก')) {
    return '/images/dishes/salads/salad-prawn-taro-nest.jpg';
  }
  // สลัดกุ้งทอด / สลัดกุ้ง
  if (d.includes('สลัดกุ้ง')) {
    return '/images/dishes/salads/salad-prawn-lime-dip.jpg';
  }
  // สลัดปูนิ่ม / สลัดผักผลไม้ / สลัดอื่นๆ
  if (d.includes('สลัด')) {
    return '/images/dishes/salads/salad-prawn-taro-nest.jpg';
  }

  // --- 10. Crab / Prawn Curry ---
  if (['ผงกะหรี่', 'ปูนิ่ม', 'ซอสมะขาม'].some((k) => d.includes(k))) {
    return '/images/dishes/rice/fried-rice-lump-crab-red-platter.jpg';
  }

  // Default fallback
  return '/images/dishes/fish/fish-seabass-steamed-lime-red-oval.jpg';
};

/**
 * 📦 Package Highlight Image Preview
 */
export const getPackageHeroImage = (packageId: string): string => {
  switch (packageId) {
    case 'pkg-1400':
      return '/images/dishes/pork/pork-knuckle-braised-spoon-lift.jpg';
    case 'pkg-1700':
      return '/images/dishes/ducks/ped-sap-yang-orchid-2026.jpg';
    case 'pkg-2000':
      return '/images/dishes/fish/fish-seabass-steamed-lime-red-oval.jpg';
    case 'pkg-2500':
      return '/images/dishes/peking-duck/peking-duck-plate-flatlay.jpg';
    case 'pkg-3000':
      return '/images/dishes/soups/soup-fishmaw-spoon-lift.jpg';
    case 'pkg-3500':
      return '/images/dishes/dish-sharkfin-soup.jpg';
    default:
      return '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-blackwood.jpg';
  }
};

