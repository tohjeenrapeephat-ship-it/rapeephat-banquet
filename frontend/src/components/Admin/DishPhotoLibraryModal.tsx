import React, { useState } from 'react';
import { X, Search, Check, Sparkles, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export interface PhotoPreset {
  id: string;
  name: string;
  category: 'appetizers' | 'soups' | 'mains' | 'fish' | 'hotpot' | 'rice' | 'desserts';
  categoryLabel: string;
  url: string;
  tag?: string;
}

export const DISH_PHOTO_PRESETS: PhotoPreset[] = [
  // 1. Appetizers & Starters
  {
    id: 'app-crackers',
    name: 'ข้าวเกรียบ & ถั่วอบเนย / เม็ดมะม่วงหิมพานต์',
    category: 'appetizers',
    categoryLabel: 'ของทานเล่น & ออเดิร์ฟ',
    url: '/images/dishes/dish-prawn-crackers.jpg',
    tag: 'ของทานเล่น',
  },
  {
    id: 'app-5-platter',
    name: 'ออเดิร์ฟ 5 อย่างพรีเมียม (จานรวมมิตรฮ่องกง)',
    category: 'appetizers',
    categoryLabel: 'ของทานเล่น & ออเดิร์ฟ',
    url: '/images/dishes/appetizers/appetizer-5-platter-banquet-tower.jpg',
    tag: '5 อย่างพรีเมียม',
  },
  {
    id: 'app-see-see',
    name: 'สี่สีไส้มังกร & หอยจ๊อปูทองคำ',
    category: 'appetizers',
    categoryLabel: 'ของทานเล่น & ออเดิร์ฟ',
    url: '/images/dishes/appetizers/see-see-sai-mungkorn-2026.jpg',
    tag: '⭐ ยอดฮิต',
  },
  {
    id: 'app-tod-mun-kung',
    name: 'ทอดมันกุ้งกรอบ / แฮ่กึ๊นทอด',
    category: 'appetizers',
    categoryLabel: 'ของทานเล่น & ออเดิร์ฟ',
    url: '/images/dishes/appetizers/tod-mun-kung-crispy-2026.jpg',
    tag: 'กรอบนอกนุ่มใน',
  },
  {
    id: 'app-pad-ngow-kuay',
    name: 'ผัดโหงวก๊วยกระทงเผือกทองคำ',
    category: 'appetizers',
    categoryLabel: 'ของทานเล่น & ออเดิร์ฟ',
    url: '/images/dishes/appetizers/pad-ngow-kuay-bird-nest-2026.jpg',
    tag: 'มงคล 5 เซียน',
  },
  {
    id: 'app-chicken-red-wine',
    name: 'ไก่ทอดซอสเหล้าแดง / หมูกรอบเหล้าแดง',
    category: 'appetizers',
    categoryLabel: 'ของทานเล่น & ออเดิร์ฟ',
    url: '/images/dishes/appetizers/chicken-crispy-red-wine-sauce-2026.jpg',
    tag: 'ซอสสูตรเข้มข้น',
  },

  // 2. Soups & Chinese Stews
  {
    id: 'soup-fishmaw-crab',
    name: 'กระเพาะปลาเนื้อปูน้ำแดง / กระเพาะปลาเยื่อไผ่',
    category: 'soups',
    categoryLabel: 'กระเพาะปลา & ซุปตุ๋นยาจีน',
    url: '/images/dishes/soups/soup-fishmaw-spoon-lift.jpg',
    tag: 'ซุปเข้มข้น',
  },
  {
    id: 'soup-sharkfin',
    name: 'หูฉลามน้ำแดงยอดผักจักรพรรดิ',
    category: 'soups',
    categoryLabel: 'กระเพาะปลา & ซุปตุ๋นยาจีน',
    url: '/images/dishes/dish-sharkfin-soup.jpg',
    tag: 'ระดับภัตตาคาร',
  },
  {
    id: 'soup-chicken-herb',
    name: 'ไก่ตุ๋นยาจีนเห็ดหอม / ไก่ดำตุ๋นยาจีน',
    category: 'soups',
    categoryLabel: 'กระเพาะปลา & ซุปตุ๋นยาจีน',
    url: '/images/dishes/soups/soup-chicken-chinese-herb.jpg',
    tag: 'ตุ๋นยาจีน',
  },
  {
    id: 'soup-pork-rib-bamboo',
    name: 'ซี่โครงหมูตุ๋นเยื่อไผ่เห็ดหอม',
    category: 'soups',
    categoryLabel: 'กระเพาะปลา & ซุปตุ๋นยาจีน',
    url: '/images/dishes/soups/soup-pork-rib-bamboo-fungus.jpg',
    tag: 'ซุปกลมกล่อม',
  },

  // 3. Mains (ขาหมู, เป็ดย่าง, ไก่ต้ม, หมูแดง)
  {
    id: 'main-pork-knuckle',
    name: 'ขาหมูน้ำแดงหมั่นโถว / ขาหมูเยอรมัน',
    category: 'mains',
    categoryLabel: 'ขาหมู & เป็ดย่าง & ไก่',
    url: '/images/dishes/mains/main-pork-knuckle-braised-sauce.jpg',
    tag: 'นุ่มละมุน',
  },
  {
    id: 'main-duck-roast',
    name: 'เป็ดสับย่างสูตรฮ่องกง / เป็ดพะโล้ / เป็ดยอดผัก',
    category: 'mains',
    categoryLabel: 'ขาหมู & เป็ดย่าง & ไก่',
    url: '/images/dishes/mains/main-duck-roast-hongkong-chopped.jpg',
    tag: '⭐ ซิกเนเจอร์สูตรฮ่องกง',
  },
  {
    id: 'main-chicken-steamed',
    name: 'ไก่ต้มน้ำปลาสมุนไพร / ไก่สับเบตง',
    category: 'mains',
    categoryLabel: 'ขาหมู & เป็ดย่าง & ไก่',
    url: '/images/dishes/appetizers/chicken-tom-nam-pla-platter-2026.jpg',
    tag: 'เนื้อนุ่มหอมน้ำปลา',
  },

  // 4. Fish (ปลากะพง, ปลาทับทิม)
  {
    id: 'fish-seabass-lime',
    name: 'ปลากะพงนึ่งมะนาวสด 100%',
    category: 'fish',
    categoryLabel: 'ปลากะพง & ปลาทับทิม',
    url: '/images/dishes/fish/fish-seabass-steamed-lime-chili-pot.jpg',
    tag: 'ปลากะพงสดแท้',
  },
  {
    id: 'fish-seabass-fried-herb',
    name: 'ปลากะพงทอดน้ำปลา / ปลากะพงทอดสมุนไพร',
    category: 'fish',
    categoryLabel: 'ปลากะพง & ปลาทับทิม',
    url: '/images/dishes/fish/fish-seabass-fried-fishsauce-herbs.jpg',
    tag: 'กรอบนอกนุ่มใน',
  },
  {
    id: 'fish-ruby-steamed-plum',
    name: 'ปลาทับทิมนึ่งซีอิ๊ว / นึ่งบ๊วยขิงซอย',
    category: 'fish',
    categoryLabel: 'ปลากะพง & ปลาทับทิม',
    url: '/images/dishes/fish/fish-ruby-steamed-plum-red-oval.jpg',
    tag: 'ปลาทับทิมสด',
  },
  {
    id: 'fish-seabass-3flavors',
    name: 'ปลากะพงราดพริกสามรส / ปลากะพงราดยำมะม่วง',
    category: 'fish',
    categoryLabel: 'ปลากะพง & ปลาทับทิม',
    url: '/images/dishes/fish/fish-seabass-fried-sweet-sour-chili.jpg',
    tag: 'รสจัดจ้าน',
  },

  // 5. Hotpots & Soups
  {
    id: 'hotpot-gaengpa-yellow',
    name: 'แกงป่ารวมมิตร / ปลาช่อนโฮกฮือหม้อไฟ',
    category: 'hotpot',
    categoryLabel: 'หม้อไฟ & ต้มยำ & แกงป่า',
    url: '/images/dishes/hotpots/gaengpa-ruammit-hotpot-2026-v2.jpg?v=20260905_v5',
    tag: 'หม้อไฟรสจัดจ้าน',
  },
  {
    id: 'hotpot-gaengsom',
    name: 'แกงส้มชะอมกุ้งสด / แกงส้มแป๊ะซะหม้อไฟ',
    category: 'hotpot',
    categoryLabel: 'หม้อไฟ & ต้มยำ & แกงป่า',
    url: '/images/dishes/hotpots/hotpot-gaengsom-cha-om-kung.jpg',
    tag: 'แกงส้มเข้มข้น',
  },
  {
    id: 'hotpot-tomyum-prawn',
    name: 'ต้มยำกุ้งแม่น้ำน้ำข้น / ต้มยำซีฟู้ดรวมมิตร',
    category: 'hotpot',
    categoryLabel: 'หม้อไฟ & ต้มยำ & แกงป่า',
    url: '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-macro-4.jpg',
    tag: 'กุ้งแม่น้ำตัวโต',
  },
  {
    id: 'hotpot-potaek-seafood',
    name: 'ต้มยำรวมมิตรทะเลโป๊ะแตกหม้อไฟ',
    category: 'hotpot',
    categoryLabel: 'หม้อไฟ & ต้มยำ & แกงป่า',
    url: '/images/dishes/hotpots/hotpot-seafood-potaek-steaming-1.jpg',
    tag: 'โป๊ะแตกสมุนไพร',
  },
  {
    id: 'hotpot-gaengjued-lookchin',
    name: 'แกงจืดหม้อไฟเครื่องในลูกชิ้น / สี่สีหม้อไฟ',
    category: 'hotpot',
    categoryLabel: 'หม้อไฟ & ต้มยำ & แกงป่า',
    url: '/images/dishes/hotpots/hotpot-gaeng-jued-lookchin-2026.jpg',
    tag: 'หม้อไฟร้อนๆ',
  },
  {
    id: 'hotpot-tomyum-pork-knuckle',
    name: 'ต้มยำขาหมูคากิหม้อไฟ / ต้มแซ่บ',
    category: 'hotpot',
    categoryLabel: 'หม้อไฟ & ต้มยำ & แกงป่า',
    url: '/images/dishes/hotpots/hotpot-tomyum-pork-knuckle.jpg',
    tag: 'ต้มยำแซ่บจัดจ้าน',
  },

  // 6. Rice & Noodles
  {
    id: 'rice-crab-fried',
    name: 'ข้าวผัดปูก้อน / ข้าวผัดฮ่องกง / ข้าวผัดทะเล',
    category: 'rice',
    categoryLabel: 'ข้าวผัด & ผัดหมี่มงคล',
    url: '/images/dishes/rice/fried-rice-lump-crab-red-platter.jpg',
    tag: 'ปูก้อนแน่นๆ',
  },
  {
    id: 'rice-black-olive',
    name: 'ข้าวผัดหนำเลี๊ยบหมูสับทรงเครื่อง',
    category: 'rice',
    categoryLabel: 'ข้าวผัด & ผัดหมี่มงคล',
    url: '/images/dishes/rice/fried-rice-black-olive-red-platter.jpg',
    tag: 'หอมกลิ่นคั่วกระทะ',
  },
  {
    id: 'rice-pad-mee-hongkong',
    name: 'ผัดหมี่ฮ่องกง / ผัดหมี่ซั่วทรงเครื่องมงคล',
    category: 'rice',
    categoryLabel: 'ข้าวผัด & ผัดหมี่มงคล',
    url: '/images/dishes/rice/pad-mee-hongkong-2026.jpg',
    tag: 'หมี่มงคลอายุยืน',
  },

  // 7. Desserts
  {
    id: 'dessert-woon-maprao',
    name: 'วุ้นมะพร้าวน้ำหอมแท้ / วุ้นใบเตย',
    category: 'desserts',
    categoryLabel: 'ของหวานมงคล & ลอยแก้ว',
    url: '/images/dishes/desserts/dessert-woon-maprao.jpg',
    tag: 'หวานเย็นชื่นใจ',
  },
  {
    id: 'dessert-ohnee-ginkgo',
    name: 'ข้าวเหนียวเผือกแปะก๊วยมะพร้าวอ่อน / โอวนี้แปะก๊วย',
    category: 'desserts',
    categoryLabel: 'ของหวานมงคล & ลอยแก้ว',
    url: '/images/dishes/desserts/dessert-ohnee-ginkgo-coconut-wood.jpg',
    tag: 'ของหวานมงคล',
  },
  {
    id: 'dessert-fruitsalad',
    name: 'ฟรุตสลัดนมสดผลไม้รวม / สลัดผลไม้',
    category: 'desserts',
    categoryLabel: 'ของหวานมงคล & ลอยแก้ว',
    url: '/images/dishes/desserts/dessert-fruitsalad-fresh-milk.jpg',
    tag: 'สดชื่นเย็นฉ่ำ',
  },
  {
    id: 'dessert-taotung',
    name: 'เต้าทึงน้ำลำไยโบราณ / รวมมิตรหวานเย็น',
    category: 'desserts',
    categoryLabel: 'ของหวานมงคล & ลอยแก้ว',
    url: '/images/dishes/desserts/dessert-taotung-nam-lamyai-wood.jpg',
    tag: 'เครื่องแน่นน้ำลำไย',
  },
  {
    id: 'dessert-rambutan-loy-kaew',
    name: 'เงาะยัดไส้สับปะรดลอยแก้ว / ลิ้นจี่ลอยแก้ว',
    category: 'desserts',
    categoryLabel: 'ของหวานมงคล & ลอยแก้ว',
    url: '/images/dishes/desserts/dessert-rambutan-loy-kaew-wood.jpg',
    tag: 'ลอยแก้วเย็นฉ่ำ',
  },
];

interface DishPhotoLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photoUrl: string) => void;
  currentPhotoUrl?: string;
  dishNameHint?: string;
}

export const DishPhotoLibraryModal: React.FC<DishPhotoLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  currentPhotoUrl = '',
  dishNameHint = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'appetizers', label: 'ของทานเล่น & ออเดิร์ฟ' },
    { id: 'soups', label: 'กระเพาะปลา & ตุ๋นยาจีน' },
    { id: 'mains', label: 'ขาหมู & เป็ด & ไก่' },
    { id: 'fish', label: 'ปลากะพง & ปลาทับทิม' },
    { id: 'hotpot', label: 'หม้อไฟ & ต้มยำ & แกงป่า' },
    { id: 'rice', label: 'ข้าวผัด & ผัดหมี่' },
    { id: 'desserts', label: 'ของหวานมงคล' },
  ];

  const filteredPresets = DISH_PHOTO_PRESETS.filter((preset) => {
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    const matchesSearch =
      preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (preset.tag && preset.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (url: string) => {
    onSelectPhoto(url);
    onClose();
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      onSelectPhoto(customUrl.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300 max-w-4xl w-full max-h-[90vh] flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-amber-50 via-white to-red-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-900 flex items-center justify-center shadow-xs">
              <ImageIcon className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                คลังภาพอาหารแท้ โต๊ะจีน รพีพัฒน์
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                เลือกภาพอาหารมาตรฐานสำหรับเมนู: <span className="font-bold text-red-700">{dishNameHint || 'จานที่เลือก'}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่ออาหาร เช่น ต้มยำ, ปลากะพง, แกงป่า, ออเดิร์ฟ, ข้าวผัด..."
              className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-black whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-amber-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Photos Grid */}
        <div className="p-4 overflow-y-auto flex-1 max-h-[50vh] space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredPresets.map((preset) => {
              const isSelected = currentPhotoUrl && (currentPhotoUrl.includes(preset.url) || preset.url.includes(currentPhotoUrl));
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelect(preset.url)}
                  className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all bg-white shadow-xs hover:shadow-md hover:scale-[1.02] flex flex-col justify-between ${
                    isSelected ? 'border-red-600 ring-2 ring-red-300' : 'border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {preset.tag && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-400/95 text-amber-950 text-[10px] font-black shadow-xs">
                        {preset.tag}
                      </span>
                    )}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white flex flex-col justify-between flex-1">
                    <p className="text-[11px] font-black text-slate-800 line-clamp-2 leading-tight">
                      {preset.name}
                    </p>
                    <button
                      type="button"
                      className="mt-1.5 w-full py-1 rounded-lg bg-amber-50 group-hover:bg-red-600 text-amber-950 group-hover:text-white text-[10px] font-black transition-colors"
                    >
                      เลือกรูปนี้
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-bold">ไม่พบรูปภาพที่ตรงกับคำค้นหา "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Custom URL Input Section */}
        <div className="p-4 bg-slate-100 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>หรือระบุ URL รูปภาพกำหนดเอง:</span>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="/images/dishes/... หรือ https://..."
                className="flex-1 px-3 py-1.5 bg-white border-2 border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                disabled={!customUrl.trim()}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                ใช้ URL นี้
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
