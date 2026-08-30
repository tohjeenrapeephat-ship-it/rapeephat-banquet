import React, { useState, useEffect } from 'react';
import { WatermarkOverlay } from './WatermarkOverlay';
import {
  UtensilsCrossed,
  Flame,
  Check,
  Sparkles,
  Award,
  ChefHat,
  ArrowRight,
  Heart,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Images
} from 'lucide-react';

interface MenuItem {
  category: string;
  name: string;
  description: string;
  tag: string;
  image: string;
  gallery?: string[];
}

export const MenuShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [galleryPhotoIndex, setGalleryPhotoIndex] = useState<number>(0);

  const categories = [
    { id: 'all', name: '✨ เมนูทั้งหมด', icon: '🍽️' },
    { id: 'appetizer', name: '🥟 ข้าวเกรียบ & ออเดิร์ฟ', icon: '🥟' },
    { id: 'salad', name: '🥗 ยำสามกรอบ & ยำซีฟู้ดรสเด็ด', icon: '🥗' },
    { id: 'poultry', name: '🦆 เป็ดปักกิ่ง & หมูหัน', icon: '🦆' },
    { id: 'soup', name: '🍲 หูฉลาม & กระเพาะปลา', icon: '🍲' },
    { id: 'pork', name: '🍖 ขาหมูน้ำแดง & ขาหมูเยอรมัน', icon: '🍖' },
    { id: 'fish', name: '🐟 ปลากะพง & ปลาทับทิม 9 ขีด', icon: '🐟' },
    { id: 'hotpot', name: '🔥 ต้มยำ & โป๊ะแตกหม้อไฟ', icon: '🔥' },
    { id: 'rice', name: '🍚 ข้าวผัดปู & ผัดหมี่มงคล', icon: '🍚' },
    { id: 'dessert', name: '🍨 ของหวานมงคล', icon: '🍨' },
  ];

  // Authentic Banquet Menu Items (100% Plated Dish Photos - No Table Photos)
  const menuItems: MenuItem[] = [
    {
      category: 'appetizer',
      name: 'ข้าวเกรียบกุ้ง & ถั่วทอดสมุนไพรมงคล (จานที่ 1)',
      description: 'ข้าวเกรียบกุ้งสีทองกรอบฟู ไม่อมน้ำมัน เสิร์ฟคู่ถั่วปากอ้าและถั่วทอดสมุนไพรเคี้ยวเพลิน จัดเรียงอย่างประณีตในจานกังไสลายครามจักรพรรดิ',
      tag: '🥢 จานที่ 1 ทานเล่นเปิดโต๊ะ',
      image: '/images/dishes/dish-prawn-crackers.jpg',
    },
    {
      category: 'appetizer',
      name: 'ออเดิร์ฟจักรพรรดิ 5 อย่าง & ออเดิร์ฟทะเลนึ่งเตาซึ้งร้อนๆ',
      description: 'รวมสุดยอดออเดิร์ฟโต๊ะจีนสูตรภัตตาคาร 35 ปี: ออเดิร์ฟทะเลนึ่งเตาซึ้งร้อนๆ (ก้ามปู, ปูอัด, ลูกชิ้นปลาเยาวราช, เต้าหู้ปลา, กุ้งลวก โรยกระเทียมเจียวสีทอง เสิร์ฟพร้อมน้ำจิ้มซีฟู้ดมะนาวสดแท้) และออเดิร์ฟ 5 ช่องจักรพรรดิ (แฮ่กึ๊นทอดกรอบ, หอยจ๊อปู, ขนมจีบหมู, เม็ดมะม่วงหิมพานต์, ไส้กรอกแดงผ่าดอก)',
      tag: '🥟 รวม 11 ภาพจริง',
      image: '/images/dishes/appetizers/appetizer-5-platter-marble.jpg',
      gallery: [
        '/images/dishes/appetizers/appetizer-5-platter-marble.jpg',
        '/images/dishes/appetizers/appetizer-seafood-steamer.jpg',
        '/images/dishes/dish-appetizer-seafood-macro.jpg',
        '/images/dishes/appetizers/appetizer-5-platter-luxury.jpg',
        '/images/dishes/appetizers/appetizer-5-platter-handpick.jpg',
        '/images/dishes/appetizers/appetizer-platters-tower-studio.jpg',
        '/images/dishes/appetizers/appetizer-prawns-dip.jpg',
        '/images/dishes/appetizers/appetizer-squid-dip.jpg',
        '/images/dishes/appetizers/appetizer-wontons-dip.jpg',
        '/images/dishes/appetizers/appetizer-5-platter-table.jpg',
        '/images/dishes/appetizers/appetizer-5-platter-stacks.jpg',
      ],
    },
    {
      category: 'salad',
      name: 'ยำสามกรอบรสเด็ดจักรพรรดิ (ครบเครื่อง 3 กรอบพรีเมียม)',
      description: 'ยำสามกรอบรสเด็ดสูตรภัตตาคาร 35 ปี ครบเครื่อง 3 กรอบพรีเมียม: กระเพาะปลาแท้ทอดกรอบฟู, ปลาหมึกแห้งทอดกรอบสีทอง, เม็ดมะม่วงหิมพานต์คั่วหอม และแคบหมูกรอบ คลุกเคล้าน้ำยำพริกมะนาวสดแท้ รสชาติจัดจ้าน เปรี้ยวหวานเผ็ดกลมกล่อม',
      tag: '🥗 อัลบั้มเมนูยำ (รวม 3 ภาพจริง)',
      image: '/images/dishes/salads/salad-samkrob-cashew-lattice.jpg',
      gallery: [
        '/images/dishes/salads/salad-samkrob-cashew-lattice.jpg',
        '/images/dishes/salads/salad-samkrob-orchid-plate.jpg',
        '/images/dishes/salads/salad-samkrob-macro-crispy.jpg',
      ],
    },
    {
      category: 'soup',
      name: 'กระเพาะปลาน้ำแดงเนื้อปู / หูฉลามน้ำแดงเห็ดหอม',
      description: 'กระเพาะปลาแท้เกรดพรีเมียมและหูฉลามน้ำแดง เคี่ยวน้ำซุปสูตรภัตตาคารฮ่องกงโบราณ 8 ชั่วโมง โรยเนื้อปูก้อนสดหวาน เห็ดหอม และผักชีสด หอมละมุน กลมกล่อม ซดคล่องคอ',
      tag: '🍲 รวมอัลบั้ม 6 ภาพจริง',
      image: '/images/dishes/soups/soup-fishmaw-spoon-lift.jpg',
      gallery: [
        '/images/dishes/soups/soup-fishmaw-spoon-lift.jpg',
        '/images/dishes/soups/soup-fishmaw-crab-macro.jpg',
        '/images/dishes/soups/soup-fishmaw-bowl-table.jpg',
        '/images/dishes/soups/soup-fishmaw-bowl-blue.jpg',
        '/images/dishes/soups/soup-fishmaw-broth-detail.jpg',
        '/images/dishes/dish-sharkfin-soup.jpg',
      ],
    },
    {
      category: 'poultry',
      name: 'เป็ดปักกิ่งหนังกรอบ & เป็ดอบยอดผักจักรพรรดิ (บะหมี่หยก / แปะก๊วย)',
      description: 'รวมสุดยอดเมนูเป็ดภัตตาคาร 35 ปี: เป็ดปักกิ่งย่างเตาถ่านหนังกรอบสีทอง เสิร์ฟคู่บะหมี่หยกมงคลเส้นเหนียวนุ่ม, เป็ดอบยอดผักน้ำแดงเนื้อนุ่มชุ่มฉ่ำ เห็ดหอม แปะก๊วยทองคำ และเป็ดอบยอดผักล้อมกุ้งสด จัดเสิร์ฟอย่างประณีตในจานกังไสสีแดงลายครามจักรพรรดิ (สีเดียวกับจานข้าวเกรียบตรงตามต้นตำรับโต๊ะจีน)',
      tag: '🦆 อัลบั้มรวมเมนูเป็ด 13 ภาพจริง',
      image: '/images/dishes/peking-duck/peking-duck-plate-flatlay.jpg',
      gallery: [
        '/images/dishes/peking-duck/peking-duck-plate-flatlay.jpg',
        '/images/dishes/ducks/duck-roast-imperial-plate.jpg',
        '/images/dishes/ducks/duck-abalone-shrimp-platter.jpg',
        '/images/dishes/peking-duck/peking-duck-table-chopsticks.jpg',
        '/images/dishes/peking-duck/peking-duck-chopsticks-noodles.jpg',
        '/images/dishes/peking-duck/peking-duck-jadenoodles-platter.jpg',
        '/images/dishes/ducks/duck-ladle-ginkgo-lift.jpg',
        '/images/dishes/ducks/duck-spoon-meat-shiitake.jpg',
        '/images/dishes/peking-duck/peking-duck-skin-sauce.jpg',
        '/images/dishes/peking-duck/peking-duck-glistening-macro.jpg',
        '/images/dishes/ducks/duck-ginkgo-spoon-gourmet.jpg',
        '/images/dishes/ducks/duck-shiitake-macro.jpg',
        '/images/dishes/dish-duck-roast-plate.jpg',
      ],
    },
    {
      category: 'pork',
      name: 'ขาหมูน้ำแดงยอดผักจักรพรรดิ & ขาหมูเยอรมัน (หมั่นโถว)',
      description: 'ขาหมูคัดไซส์ใหญ่พิเศษ ตุ๋นน้ำแดงยาจีนสูตรภัตตาคาร 35 ปี จนหนังนุ่มละมุนเนื้อเปื่อยชุ่มฉ่ำ เสิร์ฟในจานกังไสสีแดงจักรพรรดิ (สีโต๊ะจีนมงคล) คู่ยอดผักคะน้าฮ่องกงและเห็ดหอม พร้อมขาหมูเยอรมันทอดกรอบฟูและหมั่นโถวนึ่งร้อนๆ',
      tag: '🍖 จานกังไสสีแดง (รวม 6 ภาพจริง)',
      image: '/images/dishes/pork/pork-knuckle-braised-spoon-lift.jpg',
      gallery: [
        '/images/dishes/pork/pork-knuckle-braised-spoon-lift.jpg',
        '/images/dishes/pork/pork-knuckle-braised-red-plate-dining.jpg',
        '/images/dishes/pork/pork-knuckle-braised-shiitake-platter.jpg',
        '/images/dishes/pork/pork-knuckle-braised-skin-macro.jpg',
        '/images/dishes/pork/pork-knuckle-braised-shiitake-macro.jpg',
        '/images/dishes/dish-pork-knuckle.jpg',
      ],
    },
    {
      category: 'fish',
      name: 'ปลากะพง & ปลาทับทิมจักรพรรดิ 9 ขีด (นึ่งมะนาว / สามรส / นึ่งบ๊วย / ทอดน้ำปลา)',
      description: 'รวมสุดยอดเมนูปลาภัตตาคาร 35 ปี คัดไซส์ใหญ่พิเศษ 9 ขีด: ปลากะพงนึ่งมะนาวพริกสด, ปลาทับทิมนึ่งมะนาว, ปลาทับทิมสามรสซอสฉ่ำ, ปลาทับทิมนึ่งบ๊วยขิงซอย และปลาทับทิมทอดน้ำปลาคู่ยำมะม่วง เสิร์ฟในจานวงรีสีแดงลายครามจักรพรรดิ (สีโต๊ะจีนมงคล)',
      tag: '🐟 ปลา 9 ขีด จานวงรีสีแดง (รวม 9 ภาพจริง)',
      image: '/images/dishes/fish/fish-seabass-steamed-lime-red-oval.jpg',
      gallery: [
        '/images/dishes/fish/fish-seabass-steamed-lime-red-oval.jpg',
        '/images/dishes/fish/fish-ruby-steamed-lime-red-oval.jpg',
        '/images/dishes/fish/fish-ruby-three-flavor-red-oval.jpg',
        '/images/dishes/fish/fish-ruby-steamed-plum-red-oval.jpg',
        '/images/dishes/fish/fish-ruby-fried-fishsauce-red-oval.jpg',
        '/images/dishes/fish/fish-steamed-lime-slate.jpg',
        '/images/dishes/fish/fish-steamed-lime-chopsticks.jpg',
        '/images/dishes/fish/fish-steamed-lime-kitchen.jpg',
        '/images/dishes/fish/fish-steamed-lime-macro.jpg',
      ],
    },
    
    {
      category: 'rice',
      name: 'ข้าวผัดทรงเครื่องกุนเชียงจักรพรรดิ & ข้าวผัดปูก้อน (จานเปลสีแดงขนาดใหญ่)',
      description: 'รวมสุดยอดข้าวผัดโต๊ะจีนสูตรภัตตาคาร 35 ปี ผัดกระทะเหล็กไฟแรงหอมกลิ่นควันกระทะ: ข้าวผัดทรงเครื่องกุนเชียงจักรพรรดิ, ข้าวผัดปูก้อนโตเนื้อแน่น, ข้าวผัดปูโรยหมูหยองทองกรอบฟู, ข้าวผัดฮ่องกง, ข้าวผัดทะเลรวมมิตร และข้าวผัดแฮมไข่ทองคำ เสิร์ฟในจานเปลสีแดงลายครามจักรพรรดิขนาดใหญ่ (สีโต๊ะจีนมงคล) 100% ทุกรายการ',
      tag: '🍚 จานเปลสีแดงขนาดใหญ่ (รวม 6 ภาพจริง)',
      image: '/images/dishes/rice/fried-rice-combination-red-platter.jpg',
      gallery: [
        '/images/dishes/rice/fried-rice-combination-red-platter.jpg',
        '/images/dishes/rice/fried-rice-lump-crab-red-platter.jpg',
        '/images/dishes/rice/fried-rice-crab-porkfloss-red-platter.jpg',
        '/images/dishes/rice/fried-rice-hongkong-red-platter.jpg',
        '/images/dishes/rice/fried-rice-seafood-red-platter.jpg',
        '/images/dishes/rice/fried-rice-ham-red-platter.jpg',
      ],
    },
            {
      category: 'dessert',
      name: 'โอนี่แป๊ะก๊วยกะทิสด, รวมมิตรไทย, เต้าทึงน้ำลำไย, เงาะลอยแก้ว, สตรอว์เบอร์รี & แปะก๊วยนมสด (ชามใหญ่พิเศษ)',
      description: 'รวมสุดยอดของหวานโต๊ะจีนมงคล 35 ปี เสิร์ฟในชามเซรามิกสีขาวบริสุทธิ์ขนาดใหญ่พิเศษสำหรับ 10 ท่าน สะอาด ถูกสุขอนามัย 100% พร้อมช้อนตักสีขาว จัดวางบนพื้นไม้ธรรมชาติทุกรายการ: โอนี่แป๊ะก๊วยกะทิสด (ข้าวเหนียวมูนเผือกกวนเนื้อเนียนสีม่วงทรงเจดีย์ แปะก๊วยทอง พุทราจีน ราดกะทิสดมะพร้าวอ่อน), รวมมิตรไทยกะทิสดทรงเครื่อง, เต้าทึงน้ำลำไยเย็นทรงเครื่อง, เงาะลอยแก้วสอดไส้สับปะรดเกล็ดหิมะ, สตรอว์เบอร์รีลอยแก้ว และ แปะก๊วยนมสดมะพร้าวอ่อน ดับเลี่ยนหวานฉ่ำชื่นใจ ปิดท้ายงานมงคลอย่างสมบูรณ์แบบ 100%',
      tag: '🍨 ของหวานมงคลชามขาวสะอาด (รวม 6 ภาพจริง)',
      image: '/images/dishes/desserts/dessert-ohnee-ginkgo-coconut-wood.jpg',
      gallery: [
        '/images/dishes/desserts/dessert-ohnee-ginkgo-coconut-wood.jpg',
        '/images/dishes/desserts/dessert-taotung-nam-lamyai-wood.jpg',
        '/images/dishes/desserts/dessert-rambutan-loy-kaew-wood.jpg',
        '/images/dishes/desserts/dessert-ruam-mit-wood.jpg',
        '/images/dishes/desserts/dessert-strawberry-loy-kaew-wood.jpg',
        '/images/dishes/desserts/dessert-ginkgo-fresh-milk-coconut.jpg',
      ],
    },
  ];

  const filteredItems = activeTab === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);

  // When previewIndex changes, reset gallery photo index
  const handleOpenPreview = (index: number) => {
    setPreviewIndex(index);
    setGalleryPhotoIndex(0);
  };

  // Keyboard navigation for preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (previewIndex === null) return;
      if (e.key === 'Escape') setPreviewIndex(null);
      if (e.key === 'ArrowLeft') {
        setPreviewIndex((prev) => {
          const next = prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1;
          setGalleryPhotoIndex(0);
          return next;
        });
      }
      if (e.key === 'ArrowRight') {
        setPreviewIndex((prev) => {
          const next = prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0;
          setGalleryPhotoIndex(0);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewIndex, filteredItems.length]);

  const activePreviewDish = previewIndex !== null ? filteredItems[previewIndex] : null;
  const currentDisplayImage = activePreviewDish?.gallery 
    ? activePreviewDish.gallery[galleryPhotoIndex] || activePreviewDish.image
    : activePreviewDish?.image;

  return (
    <section id="menu-showcase" className="py-20 relative border-t-2 border-amber-300/80 bg-gradient-to-b from-white via-amber-50/20 to-white overflow-hidden">
      
      {/* Background Decorative Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-red-500/10 via-amber-500/15 to-red-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* 🌟 ULTRA-MODERN SECTION HEADER */}
        {/* ========================================================================= */}
        <div className="text-center max-w-5xl mx-auto space-y-4">
          
          {/* Top Gold-Bordered Luxury Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-50 via-red-50 to-amber-50 border-2 border-amber-400 text-red-950 text-xs font-black uppercase tracking-wider shadow-sm">
            <UtensilsCrossed className="w-4 h-4 text-red-600" />
            <span>AUTHENTIC BANQUET CUISINE • รายการอาหารโต๊ะจีนภัตตาคาร 35 ปี</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          {/* Balanced Modern Headline with Red-Gold Gradient (No Lonely 'โต๊ะ' Wrapping) */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.3]">
            <span className="block">คัดสรรวัตถุดิบชั้นเลิศระดับพรีเมียม</span>
            <span className="block mt-1 sm:mt-2 text-gradient-red-gold drop-shadow-xs">
              <span className="inline-block">ปรุงสุกสดใหม่ ร้อนๆ น่ารับประทาน</span>{' '}
              <span className="inline-block whitespace-nowrap">เสิร์ฟตรงถึงโต๊ะ</span>
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            สืบทอดความอร่อยตำรับโต๊ะจีนภัตตาคารกว่า 35 ปี ปรุงสุกสดใหม่หน้างาน 100% หม้อต่อหม้อ หอมกรุ่นกลิ่นกระทะ เสิร์ฟตรงเวลาทุกงานจัดเลี้ยง
          </p>

          {/* 3 Modern Feature Highlight Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-2 border-red-200 text-red-900 text-xs font-bold shadow-xs">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>ปรุงสุกสดใหม่หน้างาน 100%</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-2 border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
              <ChefHat className="w-3.5 h-3.5 text-amber-600" />
              <span>เชฟภัตตาคารมืออาชีพ 35 ปี</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-2 border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>อาหารสดสะอาด เสิร์ฟตรงเวลา</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 🎛️ CATEGORY TABS (Sleek Modern Capsule Bar) */}
        {/* ========================================================================= */}
        <div className="p-2 rounded-3xl bg-white/90 border-2 border-amber-200 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-start lg:justify-center no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg border-2 border-amber-300 scale-102'
                      : 'bg-transparent text-slate-700 hover:text-red-700 hover:bg-amber-50/80 border border-transparent'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🍲 DISHES GRID WITH INTERACTIVE LIGHTBOX PREVIEW */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenPreview(idx)}
              className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between shadow-md cursor-pointer"
            >
              {/* Image Container with Zoom & Album Badges */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 select-none pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                />
                <WatermarkOverlay size="md" opacity={0.43} />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/20 to-transparent pointer-events-none" />
                
                {/* Top Left Tag Badge */}
                <div className="absolute top-3.5 left-3.5 z-20">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-amber-300 text-[11px] font-black border border-amber-300/40 shadow-md">
                    {item.tag}
                  </span>
                </div>

                {/* Top Right Zoom & Album Counter Badges */}
                <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
                  {item.gallery && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1 border border-amber-300">
                      <Images className="w-3 h-3" />
                      <span>{item.gallery.length} ภาพ</span>
                    </span>
                  )}
                  <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/30 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-md">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>

                {/* Dish Title on Bottom of Image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20">
                  <h3 className="text-base sm:text-lg font-black text-white drop-shadow-md leading-tight group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-white">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>มีในแพ็กเกจทุกระดับ</span>
                  </span>
                  
                  <a
                    href="#quotation"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-black group/link"
                  >
                    <span>เลือกในใบเสนอราคา</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🔍 INTERACTIVE FULL-SIZE LIGHTBOX & ALBUM CAROUSEL MODAL */}
      {/* ========================================================================= */}
      {activePreviewDish && previewIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setPreviewIndex(null)}
        >
          <div
            className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300 max-w-5xl w-full max-h-[92vh] flex flex-col md:flex-row animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setPreviewIndex(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg border border-white/30 cursor-pointer"
              title="ปิดหน้าต่าง (ESC)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left/Prev Navigation Button */}
            <button
              onClick={() => {
                if (activePreviewDish.gallery && activePreviewDish.gallery.length > 1) {
                  setGalleryPhotoIndex((prev) =>
                    prev > 0 ? prev - 1 : (activePreviewDish.gallery?.length || 1) - 1
                  );
                } else {
                  setPreviewIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
                  );
                  setGalleryPhotoIndex(0);
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center transition-all shadow-xl border border-white/30 cursor-pointer"
              title="ภาพก่อนหน้า (ลูกศรซ้าย)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right/Next Navigation Button */}
            <button
              onClick={() => {
                if (activePreviewDish.gallery && activePreviewDish.gallery.length > 1) {
                  setGalleryPhotoIndex((prev) =>
                    prev < (activePreviewDish.gallery?.length || 1) - 1 ? prev + 1 : 0
                  );
                } else {
                  setPreviewIndex((prev) =>
                    prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
                  );
                  setGalleryPhotoIndex(0);
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center transition-all shadow-xl border border-white/30 cursor-pointer md:right-auto md:left-[55%]"
              title="ภาพถัดไป (ลูกศรขวา)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Preview Side with Thumbnail Strip */}
            <div className="md:w-3/5 relative bg-slate-950 flex flex-col justify-between overflow-hidden">
              
              {/* Main Photo Display */}
              <div className="relative flex-1 flex items-center justify-center min-h-[280px] sm:min-h-[380px] overflow-hidden">
                <img
                  src={currentDisplayImage}
                  alt={activePreviewDish.name}
                  className="w-full h-full object-cover object-center transition-all duration-300 select-none pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                />
                <WatermarkOverlay size="md" opacity={0.43} />
                
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-amber-300 text-xs font-black border border-amber-300/40 shadow-lg">
                    {activePreviewDish.tag}
                  </span>
                </div>

                {activePreviewDish.gallery && (
                  <div className="absolute bottom-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                      ภาพที่ {galleryPhotoIndex + 1} / {activePreviewDish.gallery.length}
                    </span>
                  </div>
                )}
              </div>

              {/* 🖼️ Multi-photo Thumbnail Strip (Only for items with gallery album) */}
              {activePreviewDish.gallery && activePreviewDish.gallery.length > 1 && (
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2.5 overflow-x-auto justify-center z-20">
                  {activePreviewDish.gallery.map((imgUrl, gIdx) => (
                    <button
                      key={gIdx}
                      onClick={() => setGalleryPhotoIndex(gIdx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        galleryPhotoIndex === gIdx
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/20 ring-2 ring-amber-300'
                          : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-400'
                      }`}
                    >
                      <img src={imgUrl} alt="รูปในอัลบั้ม" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Content Details Side */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white via-amber-50/30 to-white overflow-y-auto">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-black text-red-700 uppercase tracking-wider">
                  <ChefHat className="w-4 h-4 text-amber-600" />
                  <span>โต๊ะจีน รพีพัฒน์ พรีเมียม 35 ปี</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {activePreviewDish.name}
                </h3>

                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {activePreviewDish.description}
                </p>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>จุดเด่น & การันตีรสชาติ</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 font-medium list-disc list-inside">
                    <li>ปรุงสุกสดใหม่หน้างาน 100%</li>
                    <li>เชฟภัตตาคารมืออาชีพ ประสบการณ์ 35 ปี</li>
                    <li>วัตถุดิบคัดเกรดพรีเมียม สด สะอาด ถูกหลักอนามัย</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-amber-200">
                <a
                  href="#quotation"
                  onClick={() => setPreviewIndex(null)}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-98 cursor-pointer border border-amber-300"
                >
                  <UtensilsCrossed className="w-4 h-4 text-amber-300" />
                  <span>เลือกเมนูนี้ในใบเสนอราคา</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </a>

                <p className="text-center text-[11px] text-slate-500 font-medium">
                  เมนู {previewIndex + 1} จากทั้งหมด {filteredItems.length} รายการ (กดปุ่ม ◄ ► เพื่อเลื่อนดู)
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

