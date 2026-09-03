/**
 * 🍽️ Dish Image Helper Utility
 * Maps any banquet dish name or course category to authentic high-resolution plated dish photos.
 */

export const getDishImage = (dishName: string = '', courseTitle: string = ''): string => {
  const name = (dishName + ' ' + courseTitle).toLowerCase().trim();

  // 1. ทานเล่น / ข้าวเกรียบ / ถั่วทอด
  if (name.includes('ข้าวเกรียบ') || name.includes('ถั่วทอด') || name.includes('เฟรนช์ฟรายส์') || name.includes('จานที่ 1')) {
    return '/images/dishes/dish-prawn-crackers.jpg';
  }

  // 2. ออเดิร์ฟ / ติ่มซำ / ซีฟู้ดนึ่ง
  if (name.includes('ออเดิร์ฟทะเล') || name.includes('ทะเลนึ่ง')) {
    return '/images/dishes/appetizers/appetizer-seafood-steamer.jpg';
  }
  if (name.includes('ออเดิร์ฟ') || name.includes('ขนมจีบ') || name.includes('หอยจ๊อ') || name.includes('แฮ่กึ๊น') || name.includes('ไส้กรอก')) {
    return '/images/dishes/appetizers/appetizer-5-platter-marble.jpg';
  }

  // 3. ยำ / สลัด
  if (name.includes('ยำสามกรอบ') || name.includes('ยำรวมมิตร') || name.includes('ยำซีฟู้ด') || name.includes('สลัดกุ้ง') || name.includes('ยำ')) {
    return '/images/dishes/salads/salad-samkrob-cashew-lattice.jpg';
  }

  // 4. ซุป / กระเพาะปลา / หูฉลาม
  if (name.includes('หูฉลาม')) {
    return '/images/dishes/dish-sharkfin-soup.jpg';
  }
  if (name.includes('กระเพาะปลา')) {
    return '/images/dishes/soups/soup-fishmaw-spoon-lift.jpg';
  }

  // 5. เป็ดปักกิ่ง / เป็ดย่าง / เป็ดอบ
  if (name.includes('เป็ดปักกิ่ง')) {
    return '/images/dishes/peking-duck/peking-duck-plate-flatlay.jpg';
  }
  if (name.includes('เป็ดอบ') || name.includes('เป็ดพะโล้') || name.includes('เป็ดย่าง') || name.includes('เป็ด')) {
    return '/images/dishes/ducks/duck-roast-imperial-plate.jpg';
  }

  // 6. ขาหมู / หมูหัน
  if (name.includes('ขาหมูเยอรมัน')) {
    return '/images/dishes/pork/pork-knuckle-braised-red-plate-dining.jpg';
  }
  if (name.includes('ขาหมู') || name.includes('หมูหัน')) {
    return '/images/dishes/pork/pork-knuckle-braised-spoon-lift.jpg';
  }

  // 7. ปลา / ปลากะพง / ปลาทับทิม
  if (name.includes('สามรส')) {
    return '/images/dishes/fish/fish-ruby-three-flavor-red-oval.jpg';
  }
  if (name.includes('ทอดน้ำปลา')) {
    return '/images/dishes/fish/fish-ruby-fried-fishsauce-red-oval.jpg';
  }
  if (name.includes('นึ่งบ๊วย') || name.includes('นึ่งซีอิ๊ว')) {
    return '/images/dishes/fish/fish-ruby-steamed-plum-red-oval.jpg';
  }
  if (name.includes('ปลากะพง') || name.includes('ปลาทับทิม') || name.includes('นึ่งมะนาว') || name.includes('ปลา')) {
    return '/images/dishes/fish/fish-seabass-steamed-lime-red-oval.jpg';
  }

  // 8. ต้มยำ & โป๊ะแตกหม้อไฟ
  if (name.includes('โป๊ะแตก') || name.includes('โพ๊ะแตก')) {
    return '/images/dishes/hotpots/hotpot-seafood-potaek-smoking-wood.jpg';
  }
  if ((name.includes('ปลากะพง') || name.includes('หัวปลา') || name.includes('ปลาเก๋า')) && name.includes('ต้มยำ')) {
    return '/images/dishes/hotpots/hotpot-seabass-grouper-flaming-chimney.jpg';
  }
  if (name.includes('กุ้ง') && name.includes('ต้มยำ')) {
    return '/images/dishes/hotpots/hotpot-tomyum-prawn-macro-lime.jpg';
  }
  if (name.includes('รวมมิตร') && name.includes('ต้มยำ')) {
    return '/images/dishes/hotpots/hotpot-seafood-squid-mussel-steaming.jpg';
  }
  if (name.includes('ต้มยำ') || name.includes('หม้อไฟ') || name.includes('แกงส้ม')) {
    return '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-blackwood.jpg';
  }

  // 9. ข้าวผัด / ผัดหมี่
  if (name.includes('ข้าวผัดปู') || name.includes('ปูก้อน')) {
    return '/images/dishes/rice/fried-rice-lump-crab-red-platter.jpg';
  }
  if (name.includes('ผัดหมี่') || name.includes('หมี่ฮ่องกง')) {
    return '/images/dishes/rice/fried-rice-hongkong-red-platter.jpg';
  }
  if (name.includes('ข้าวผัด')) {
    return '/images/dishes/rice/fried-rice-combination-red-platter.jpg';
  }

  // 10. ของหวานมงคล
  if (name.includes('โอนี่') || name.includes('เผือกกวน')) {
    return '/images/dishes/desserts/dessert-ohnee-ginkgo-coconut-wood.jpg';
  }
  if (name.includes('เต้าทึง') || name.includes('น้ำลำไย')) {
    return '/images/dishes/desserts/dessert-taotung-nam-lamyai-wood.jpg';
  }
  if (name.includes('เงาะ') || name.includes('ลิ้นจี่')) {
    return '/images/dishes/desserts/dessert-rambutan-loy-kaew-wood.jpg';
  }
  if (name.includes('รวมมิตร')) {
    return '/images/dishes/desserts/dessert-ruam-mit-wood.jpg';
  }
  if (name.includes('นมสด') || name.includes('แปะก๊วยนมสด')) {
    return '/images/dishes/desserts/dessert-ginkgo-fresh-milk-coconut.jpg';
  }
  if (name.includes('สตรอว์') || name.includes('ผลไม้')) {
    return '/images/dishes/desserts/dessert-strawberry-loy-kaew-wood.jpg';
  }
  if (name.includes('ของหวาน') || name.includes('แปะก๊วย') || name.includes('ลอยแก้ว')) {
    return '/images/dishes/desserts/dessert-ohnee-ginkgo-coconut-wood.jpg';
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
      return '/images/dishes/ducks/duck-roast-imperial-plate.jpg';
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
