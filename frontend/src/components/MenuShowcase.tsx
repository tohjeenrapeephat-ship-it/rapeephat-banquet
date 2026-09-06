import React, { useState, useEffect } from 'react';
import { WatermarkOverlay } from './WatermarkOverlay';
import { SmartDishImage } from './SmartDishImage.js';
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
  Images,
  Printer,
  FileText
} from 'lucide-react';
import { MenuCatalogModal } from './MenuCatalogModal.js';
import { useBanquetPackages, packageService } from '../services/packageService.js';
import { getDishImage } from '../utils/dishImageHelper.js';

interface MenuItem {
  category: string;
  name: string;
  description: string;
  tag: string;
  image: string;
  gallery?: string[];
}

export const MenuShowcase: React.FC = () => {
  const { packages } = useBanquetPackages();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [galleryPhotoIndex, setGalleryPhotoIndex] = useState<number>(0);
  const [cardPhotoIndexes, setCardPhotoIndexes] = useState<Record<string, number>>({});
  const [catalogModalOpen, setCatalogModalOpen] = useState<boolean>(false);
  
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 260;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  const handleTabClick = (catId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(catId);
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const categories = [
    { id: 'all', name: 'เมนูทั้งหมด', icon: '🍽️' },
    { id: 'appetizer', name: 'ข้าวเกรียบ & ออเดิร์ฟ', icon: '🥟' },
    { id: 'salad', name: 'ยำสามกรอบ & ยำซีฟู้ด', icon: '🥗' },
    { id: 'poultry', name: 'เป็ดปักกิ่ง & เป็ดอบ', icon: '🦆' },
    { id: 'soup', name: 'หูฉลาม & กระเพาะปลา', icon: '🍲' },
    { id: 'pork', name: 'ขาหมูน้ำแดง & ขาหมูเยอรมัน', icon: '🍖' },
    { id: 'fish', name: 'ปลากะพง & ปลาทับทิม 9 ขีด', icon: '🐟' },
    { id: 'hotpot', name: 'ต้มยำ & โป๊ะแตกหม้อไฟ', icon: '🔥' },
    { id: 'rice', name: 'ข้าวผัดปู & ข้าวผัดทรงเครื่อง', icon: '🍚' },
    { id: 'dessert', name: 'ของหวานมงคล', icon: '🍨' },
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
      tag: '🥟 รวม 12 ภาพจริง',
      image: '/images/dishes/appetizers/appetizer-5-platter-banquet-tower.jpg',
      gallery: [
        '/images/dishes/appetizers/appetizer-5-platter-banquet-tower.jpg',
        '/images/dishes/appetizers/appetizer-5-platter-marble.jpg',
        '/images/dishes/appetizers/chicken-cashew-stirfry.jpg',
        '/images/dishes/appetizers/appetizer-prawn-glass-noodles.jpg',
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
      name: 'ยำสามกรอบจักรพรรดิ, ยำขาหมูสไลด์ & สลัดกุ้งทอด',
      description: 'รวมสุดยอดเมนูยำและสลัดโต๊ะจีนสูตรเด็ด 35 ปี: ยำสามกรอบเม็ดมะม่วงหิมพานต์, ยำขาหมูสไลด์รสแซ่บจัดจ้าน, สลัดกุ้งทอดซอสครีม, สลัดปลาทิพย์ทอดกรอบสีทอง, ยำหมูย่างสไลด์นุ่มฉ่ำรสแซ่บ, สลัดกุ้งทอดกระทงเผือก และยำรวมมิตรทะเลสด คลุกเคล้าน้ำยำมะนาวแท้ 100% หอมสมุนไพรสดและพริกขี้หนูสวน',
      tag: '🥗 รวมอัลบั้ม 7 ภาพจริง',
      image: '/images/dishes/salads/salad-samkrob-cashew-lattice.jpg',
      gallery: [
        '/images/dishes/salads/salad-samkrob-cashew-lattice.jpg',
        '/images/dishes/salads/salad-pork-knuckle-sliced-red-platter.jpg',
        '/images/dishes/salads/salad-prawn-lime-dip.jpg',
        '/images/dishes/salads/salad-plathip-crispy.jpg',
        '/images/dishes/salads/salad-grilled-pork-yum.jpg',
        '/images/dishes/salads/salad-prawn-taro-nest.jpg',
        '/images/dishes/salads/salad-seafood-mixed-red-platter.jpg',
      ],
    },
    {
      category: 'soup',
      name: 'กระเพาะปลาน้ำแดงเนื้อปู, ไก่ตุ๋นยาจีน & กระดูกหมูตุ๋นเห็ดหอมเยื่อไผ่',
      description: 'กระเพาะปลาแท้เกรดพรีเมียม, หูฉลามน้ำแดง, ไก่ตุ๋นเห็ดหอมยาจีน และกระดูกหมูตุ๋นเยื่อไผ่ เคี่ยวน้ำซุปสูตรภัตตาคารฮ่องกงโบราณ 8 ชั่วโมง โรยเนื้อปูก้อนสดหวาน เห็ดหอม และผักชีสด หอมละมุน กลมกล่อม ซดคล่องคอ',
      tag: '🍲 รวมอัลบั้ม 8 ภาพจริง',
      image: '/images/dishes/soups/soup-fishmaw-spoon-lift.jpg',
      gallery: [
        '/images/dishes/soups/soup-fishmaw-spoon-lift.jpg',
        '/images/dishes/soups/soup-chicken-chinese-herb.jpg',
        '/images/dishes/soups/soup-pork-rib-bamboo-fungus.jpg',
        '/images/dishes/soups/soup-fishmaw-crab-macro.jpg',
        '/images/dishes/soups/soup-fishmaw-bowl-table.jpg',
        '/images/dishes/soups/soup-fishmaw-bowl-blue.jpg',
        '/images/dishes/soups/soup-fishmaw-broth-detail.jpg',
        '/images/dishes/dish-sharkfin-soup.jpg',
      ],
    },
    {
      category: 'poultry',
      name: 'เป็ดปักกิ่งหนังกรอบ, เป็ดยัดไส้หน่อไม้จีน & เป็ดอบยอดผักจักรพรรดิ',
      description: 'รวมสุดยอดเมนูเป็ดภัตตาคาร 35 ปี: เป็ดยัดไส้หน่อไม้จีนสูตรโบราณตุ๋นเข้าเนื้อนุ่มละมุน, เป็ดปักกิ่งย่างเตาถ่านหนังกรอบสีทอง เสิร์ฟคู่บะหมี่หยกมงคลเส้นเหนียวนุ่ม, เป็ดอบยอดผักน้ำแดงเนื้อนุ่มชุ่มฉ่ำ เห็ดหอม แปะก๊วยทองคำ และเป็ดอบยอดผักล้อมกุ้งสด จัดเสิร์ฟอย่างประณีตในจานกังไสสีแดงลายครามจักรพรรดิ 100%',
      tag: '🦆 อัลบั้มรวมเมนูเป็ด 14 ภาพจริง',
      image: '/images/dishes/peking-duck/peking-duck-plate-flatlay.jpg',
      gallery: [
        '/images/dishes/peking-duck/peking-duck-plate-flatlay.jpg',
        '/images/dishes/ducks/duck-stuffed-bamboo-shoots.jpg',
        '/images/dishes/ducks/ped-sap-yang-orchid-2026.jpg',
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
      name: 'ขาหมูน้ำแดงยอดผักจักรพรรดิ, กระเพาะหมูผัดเกี้ยมฉ่าย & ขาหมูเยอรมัน',
      description: 'ขาหมูคัดไซส์ใหญ่พิเศษ ตุ๋นน้ำแดงยาจีนสูตรภัตตาคาร 35 ปี จนหนังนุ่มละมุนเนื้อเปื่อยชุ่มฉ่ำ, กระเพาะหมูผัดเกี้ยมฉ่ายเห็ดหอมรสกลมกล่อม เสิร์ฟในจานกังไสสีแดงจักรพรรดิ พร้อมขาหมูเยอรมันทอดกรอบฟูและหมั่นโถวนึ่งร้อนๆ',
      tag: '🍖 รวม 8 ภาพจริง',
      image: '/images/dishes/pork/pork-knuckle-braised-peanut-platter.jpg',
      gallery: [
        '/images/dishes/pork/pork-knuckle-braised-peanut-platter.jpg',
        '/images/dishes/pork/pork-stomach-pickled-mustard-red-platter.jpg',
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
      name: 'ปลากะพง & ปลาทับทิมนึ่งมะนาวพริกสด (จานวงรีสีแดง 9 ขีด)',
      description: 'ปลากะพงและปลาทับทิมคัดไซส์ใหญ่พิเศษ 9 ขีด สดใหม่ส่งตรงจากแพ นึ่งร้อนๆ ราดน้ำยำพริกขี้หนูสวนมะนาวแท้ 100% กระเทียมสด รสชาติจัดจ้าน เปรี้ยว เผ็ด กลมกล่อม แขกทุกโต๊ะประทับใจ เสิร์ฟในจานวงรีสีแดงลายครามจักรพรรดิ (สีโต๊ะจีนมงคล)',
      tag: '🐟 ปลานึ่งมะนาวพริกสด (รวม 6 ภาพจริง)',
      image: '/images/dishes/fish/fish-seabass-steamed-lime-red-oval.jpg',
      gallery: [
        '/images/dishes/fish/fish-seabass-steamed-lime-red-oval.jpg',
        '/images/dishes/fish/fish-ruby-steamed-lime-red-oval.jpg',
        '/images/dishes/fish/fish-steamed-lime-chopsticks.jpg',
        '/images/dishes/fish/fish-steamed-lime-kitchen.jpg',
        '/images/dishes/fish/fish-steamed-lime-macro.jpg',
        '/images/dishes/fish/fish-steamed-lime-slate.jpg',
      ],
    },
    {
      category: 'fish',
      name: 'ปลาทับทิมราดพริกสามรส & ซอสเปรี้ยวหวานจักรพรรดิ (จานวงรีสีแดง 9 ขีด)',
      description: 'ปลาทับทิมคัดไซส์ 9 ขีด บั้งลวดลายสวยงาม ทอดจนหนังกรอบสีทองเนื้อในนุ่มหวาน ราดด้วยน้ำซอสสามรสสูตรเด็ดภัตตาคาร 35 ปี พริกชี้ฟ้า สับปะรด เปรี้ยวหวานเค็มครบรส กลมกล่อมลงตัว เสิร์ฟในจานวงรีสีแดงมงคล',
      tag: '🐟 ปลาทับทิมสามรส (ภาพจริงจานแดง)',
      image: '/images/dishes/fish/fish-ruby-three-flavor-red-oval.jpg',
      gallery: [
        '/images/dishes/fish/fish-ruby-three-flavor-red-oval.jpg',
        '/images/dishes/fish/fish-ruby-fried-fishsauce-red-oval.jpg',
      ],
    },
    {
      category: 'fish',
      name: 'ปลาทับทิมทอดน้ำปลาแท้เมืองระยอง & ยำมะม่วงสด (จานวงรีสีแดง 9 ขีด)',
      description: 'ปลาทับทิมสดใหม่ทอดน้ำมันเดือดจนสีเหลืองทองกรอบนอกนุ่มฉ่ำใน ราดน้ำปลาเคี่ยวหวานหอมสูตรลับ เสิร์ฟคู่กับยำมะม่วงซอยพริกสด รสชาติจัดจ้านตัดเลี่ยนยอดเยี่ยม เสิร์ฟในจานวงรีสีแดงมงคล',
      tag: '🐟 ปลาทับทิมทอดน้ำปลา (ภาพจริงจานแดง)',
      image: '/images/dishes/fish/fish-ruby-fried-fishsauce-red-oval.jpg',
      gallery: [
        '/images/dishes/fish/fish-ruby-fried-fishsauce-red-oval.jpg',
        '/images/dishes/fish/fish-ruby-three-flavor-red-oval.jpg',
      ],
    },
    {
      category: 'fish',
      name: 'ปลาทับทิมนึ่งบ๊วยขิงซอย & เห็ดหอมเต้าเจี้ยว (จานวงรีสีแดง 9 ขีด)',
      description: 'ปลาทับทิมนึ่งสมุนไพรจีนโบราณ บ๊วยดองแท้ ขิงซอยเส้น เห็ดหอม และหมูสับเส้น รสชาติเค็มหวานกลมกล่อมหอมละมุน ซดน้ำซุปคล่องคอ สไตล์โต๊ะจีนกวางตุ้งแท้ เสิร์ฟในจานวงรีสีแดงมงคล',
      tag: '🐟 ปลานึ่งบ๊วยขิงซอย (ภาพจริงจานแดง)',
      image: '/images/dishes/fish/fish-ruby-steamed-plum-red-oval.jpg',
      gallery: [
        '/images/dishes/fish/fish-ruby-steamed-plum-red-oval.jpg',
        '/images/dishes/fish/fish-ruby-steamed-lime-red-oval.jpg',
      ],
    },
    
    {
      category: 'hotpot',
      name: 'แกงส้มชะอมไข่ทอดใส่กุ้ง, ต้มยำกุ้งแม่น้ำ & ทะเลโป๊ะแตกหม้อไฟ (เสิร์ฟหม้อไฟร้อนๆ ควันฉุย)',
      description: 'รวมสุดยอดเมนูหม้อไฟโต๊ะจีนภัตตาคาร 35 ปี เสิร์ฟในหม้อไฟสแตนเลสร้อนฉ่าควันพวยพุ่งตลอดงาน: แกงส้มชะอมไข่ทอดใส่กุ้งสดตัวโตน้ำแกงส้มเข้มข้นจัดจ้าน, ต้มยำขาหมูคากิตุ๋นเปื่อยนุ่มรสแซ่บ, ต้มยำกุ้งแม่น้ำน้ำข้นตัวโตมันเยิ้ม, ต้มยำซีฟู้ดรวมมิตรน้ำข้น, ทะเลโป๊ะแตกหม้อไฟสมุนไพรไทยแท้ มะนาวสด 100% พริกขี้หนูสวน และต้มยำปลากะพงหม้อไฟปล่องสูง รสชาติจัดจ้าน เข้มข้น ซดคล่องคอร้อนๆ อร่อยถึงใจ 100%',
      tag: '🔥 หม้อไฟ & ต้มยำ (รวม 16 ภาพจริง)',
      image: '/images/dishes/hotpots/hotpot-gaengsom-cha-om-kung.jpg',
      gallery: [
        '/images/dishes/hotpots/hotpot-gaengsom-cha-om-kung.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-pork-knuckle.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-steaming-1.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-macro-4.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-ladle-5.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-macro-herb-2.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-steaming-3.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-blackwood.jpg',
        '/images/dishes/hotpots/hotpot-seafood-squid-mussel-steaming.jpg',
        '/images/dishes/hotpots/hotpot-seafood-mussel-squid-macro.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-creamy-banquet.jpg',
        '/images/dishes/hotpots/gaengpa-ruammit-hotpot-2026-v2.jpg',
        '/images/dishes/hotpots/hotpot-seabass-grouper-flaming-chimney.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-clear-banquet.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-clear-prawn-brownwood.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-topview-slate.jpg',
      ],
    },
    {
      category: 'hotpot',
      name: 'ต้มยำกุ้งแม่น้ำน้ำข้น & ต้มยำซีฟู้ดรวมมิตรน้ำข้น (สูตรน้ำข้นภัตตาคาร)',
      description: 'สุดยอดต้มยำน้ำข้นสูตรเด็ดภัตตาคาร 35 ปี คัดกุ้งแม่น้ำตัวใหญ่เนื้อแน่น หอยแมลงภู่นิวซีแลนด์ตัวโต และปลาหมึกสดบั้งลายสวย ต้มกับเครื่องสมุนไพรสด ข่า ตะไคร้ ใบมะกรูด น้ำพริกเผาสูตรลับ และนมสดแท้ รสชาติเข้มข้น จัดจ้าน เปรี้ยว เผ็ด กลมกล่อม หอมกรุ่น เสิร์ฟในหม้อไฟสแตนเลสร้อนฉ่าตลอดงาน',
      tag: '🔥 ต้มยำน้ำข้นกุ้งแม่น้ำ (รวม 5 ภาพจริง)',
      image: '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-macro-4.jpg',
      gallery: [
        '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-macro-4.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-creamy-prawn-blackwood.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-prawn-macro-lime.jpg',
        '/images/dishes/hotpots/hotpot-seafood-squid-mussel-steaming.jpg',
        '/images/dishes/hotpots/hotpot-tomyum-creamy-banquet.jpg',
      ],
    },
    {
      category: 'hotpot',
      name: 'ทะเลโป๊ะแตกหม้อไฟซีฟู้ด & โป๊ะแตกปลากะพงสมุนไพรพริกขี้หนูสวน (หม้อไฟร้อนๆ)',
      description: 'ทะเลโป๊ะแตกสูตรเด็ดรสแซ่บจัดจ้าน น้ำซุปใสสมุนไพรไทยแท้ ปรุงรสด้วยมะนาวแท้ 100% พริกขี้หนูสวนบุบ และใบกะเพราหอมกรุ่น ยกขบวนซีฟู้ดสดใหม่เต็มหม้อ: กุ้งสด หอยแมลงภู่นิวซีแลนด์ ปลาหมึกสดกรอบ และเนื้อปลากะพงสด ซดร้อนๆ คล่องคอ อร่อยจัดจ้านถึงใจ แขกทุกท่านประทับใจ',
      tag: '🍲 ทะเลโป๊ะแตกหม้อไฟ (รวม 6 ภาพจริง)',
      image: '/images/dishes/hotpots/hotpot-seafood-potaek-steaming-1.jpg',
      gallery: [
        '/images/dishes/hotpots/hotpot-seafood-potaek-steaming-1.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-ladle-5.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-macro-herb-2.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-steaming-3.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-clear-herb.jpg',
        '/images/dishes/hotpots/hotpot-seafood-potaek-topview-slate.jpg',
      ],
    },
    {
      category: 'rice',
      name: 'ข้าวผัดทรงเครื่องกุนเชียงจักรพรรดิ, ข้าวผัดไก่ & ข้าวผัดปูก้อน (จานเปลสีแดงขนาดใหญ่)',
      description: 'รวมสุดยอดข้าวผัดโต๊ะจีนสูตรภัตตาคาร 35 ปี ผัดกระทะเหล็กไฟแรงหอมกลิ่นควันกระทะ: ข้าวผัดไก่เนื้อนุ่มหอมกรุ่น, ข้าวผัดทรงเครื่องกุนเชียงจักรพรรดิ, ข้าวผัดปูก้อนโตเนื้อแน่น, ข้าวผัดปูโรยหมูหยองทองกรอบฟู, ข้าวผัดฮ่องกง, ข้าวผัดทะเลรวมมิตร และข้าวผัดแฮมไข่ทองคำ เสิร์ฟในจานเปลสีแดงลายครามจักรพรรดิขนาดใหญ่ (สีโต๊ะจีนมงคล) 100% ทุกรายการ',
      tag: '🍚 จานเปลสีแดงขนาดใหญ่ (รวม 7 ภาพจริง)',
      image: '/images/dishes/rice/fried-rice-chicken-red-platter.jpg',
      gallery: [
        '/images/dishes/rice/fried-rice-chicken-red-platter.jpg',
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
      name: 'วุ้นมะพร้าวน้ำหอมใบเตย, โอนี่แป๊ะก๊วยกะทิสด & ฟรุตสลัดนมสด',
      description: 'รวมสุดยอดของหวานโต๊ะจีนมงคล 35 ปี เสิร์ฟสดใหม่ สะอาด ถูกสุขอนามัย 100%: วุ้นมะพร้าวน้ำหอมแท้สลับชั้นใบเตยหอมหวานมันพอดีคำ, โอนี่แป๊ะก๊วยกะทิสด, ฟรุตสลัดนมสดหวานหอมสดชื่น, ลิ้นจี่ลอยแก้วเนื้อฉ่ำหวานเย็น, เต้าทึงน้ำลำไยเย็นทรงเครื่อง, เงาะลอยแก้วสอดไส้สับปะรดเกล็ดหิมะ, รวมมิตรไทยกะทิสด และ แปะก๊วยนมสดมะพร้าวอ่อน ดับเลี่ยนหวานฉ่ำชื่นใจ ปิดท้ายงานมงคลอย่างสมบูรณ์แบบ 100%',
      tag: '🥥 วุ้นมะพร้าว & ของหวานมงคล (รวม 9 ภาพจริง)',
      image: '/images/dishes/desserts/dessert-woon-maprao.jpg',
      gallery: [
        '/images/dishes/desserts/dessert-woon-maprao.jpg',
        '/images/dishes/desserts/dessert-ohnee-ginkgo-coconut-wood.jpg',
        '/images/dishes/desserts/dessert-fruitsalad-fresh-milk.jpg',
        '/images/dishes/desserts/dessert-lychee-loy-kaew.jpg',
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

  // Instant preloader for all dish images into browser cache
  useEffect(() => {
    const allImages: string[] = [];
    menuItems.forEach((item) => {
      if (item.image) allImages.push(item.image);
      if (item.gallery) {
        item.gallery.forEach((img) => allImages.push(img));
      }
    });

    allImages.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  }, []);

  // Helper to dynamically resolve photo for menu item (prioritizing custom back-office uploads)
  const getItemPhoto = (item: MenuItem): string => {
    const custom = packageService.getCustomDishImage(item.name);
    if (custom) return custom;
    return getDishImage(item.name) || item.image;
  };

  const getItemGallery = (item: MenuItem): string[] => {
    const custom = packageService.getCustomDishImage(item.name);
    if (!item.gallery) {
      return custom ? [custom] : [item.image];
    }
    if (custom && !item.gallery.includes(custom)) {
      return [custom, ...item.gallery];
    }
    return item.gallery;
  };

  const activePreviewDish = previewIndex !== null ? filteredItems[previewIndex] : null;
  const activePreviewGallery = activePreviewDish ? getItemGallery(activePreviewDish) : [];
  const activePreviewPrimary = activePreviewDish ? getItemPhoto(activePreviewDish) : '';
  const currentDisplayImage = activePreviewGallery.length > 0
    ? activePreviewGallery[galleryPhotoIndex] || activePreviewPrimary
    : activePreviewPrimary;

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
        {/* 🎛️ CATEGORY TABS (Sleek Modern Capsule Bar with Left/Right Navigation) */}
        {/* ========================================================================= */}
        <div className="relative max-w-5xl mx-auto px-1 sm:px-0">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl flex items-center justify-center transition-all border-2 border-amber-300 cursor-pointer"
              title="เลื่อนเมนูก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl flex items-center justify-center transition-all border-2 border-amber-300 cursor-pointer"
              title="เลื่อนเมนูถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="p-1.5 sm:p-2 rounded-3xl bg-white/95 border-2 border-amber-200 shadow-md backdrop-blur-md">
            <div
              ref={tabsContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 justify-start no-scrollbar scroll-smooth px-1"
            >
              {categories.map((cat) => {
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={(e) => handleTabClick(cat.id, e)}
                    className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md border-2 border-amber-300 scale-102 ring-2 ring-red-300/40'
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
        </div>

        {/* ========================================================================= */}
        {/* 🍲 DISHES GRID WITH INTERACTIVE LIGHTBOX PREVIEW */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const itemGallery = getItemGallery(item);
            const activeCardImgIdx = cardPhotoIndexes[item.name] || 0;
            const currentCardImg = itemGallery.length > 0 ? (itemGallery[activeCardImgIdx] || getItemPhoto(item)) : getItemPhoto(item);

            return (
              <div
                key={idx}
                onClick={() => handleOpenPreview(idx)}
                className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between shadow-md cursor-pointer"
              >
                {/* Image Container with Zoom & Album Badges */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <SmartDishImage
                    src={currentCardImg}
                    alt={item.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
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
                    {itemGallery.length > 1 && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1 border border-amber-300">
                        <Images className="w-3 h-3" />
                        <span>{itemGallery.length} ภาพ</span>
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

                {/* 🖼️ Quick Inline Album Thumbnail Selector Bar */}
                {itemGallery.length > 1 && (
                  <div className="px-3 py-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-400/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {itemGallery.map((gImg, gIdx) => (
                      <button
                        key={gIdx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardPhotoIndexes((prev) => ({ ...prev, [item.name]: gIdx }));
                        }}
                        onMouseEnter={() => {
                          setCardPhotoIndexes((prev) => ({ ...prev, [item.name]: gIdx }));
                        }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activeCardImgIdx === gIdx
                            ? 'border-amber-400 scale-110 shadow-md ring-2 ring-amber-300/60'
                            : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-amber-300'
                        }`}
                        title={`ดูรูปที่ ${gIdx + 1}`}
                      >
                        <SmartDishImage src={gImg} alt="รูปในเซ็ต" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    <span className="text-[10px] font-bold text-amber-300 whitespace-nowrap pl-1">
                      {activeCardImgIdx + 1}/{itemGallery.length} ภาพ
                    </span>
                  </div>
                )}

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
            );
          })}
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
                if (activePreviewGallery.length > 1) {
                  setGalleryPhotoIndex((prev) =>
                    prev > 0 ? prev - 1 : activePreviewGallery.length - 1
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
                if (activePreviewGallery.length > 1) {
                  setGalleryPhotoIndex((prev) =>
                    prev < activePreviewGallery.length - 1 ? prev + 1 : 0
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
                <SmartDishImage
                  src={currentDisplayImage}
                  alt={activePreviewDish.name}
                  className="w-full h-full object-cover object-center transition-all duration-300 select-none pointer-events-none scale-[1.03]"
                  onContextMenu={(e) => e.preventDefault()}
                />
                <WatermarkOverlay size="md" opacity={0.43} />
                
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-amber-300 text-xs font-black border border-amber-300/40 shadow-lg">
                    {activePreviewDish.tag}
                  </span>
                </div>

                {activePreviewGallery.length > 1 && (
                  <div className="absolute bottom-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                      ภาพที่ {galleryPhotoIndex + 1} / {activePreviewGallery.length}
                    </span>
                  </div>
                )}
              </div>

              {/* 🖼️ Multi-photo Thumbnail Strip (Only for items with gallery album) */}
              {activePreviewGallery.length > 1 && (
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2.5 overflow-x-auto justify-center z-20">
                  {activePreviewGallery.map((imgUrl, gIdx) => (
                    <button
                      key={gIdx}
                      onClick={() => setGalleryPhotoIndex(gIdx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        galleryPhotoIndex === gIdx
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/20 ring-2 ring-amber-300'
                          : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-400'
                      }`}
                    >
                      <SmartDishImage src={imgUrl} alt="รูปในอัลบั้ม" className="w-full h-full object-cover" />
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

      {/* Menu Catalog & Printable A4 PDF Modal */}
      <MenuCatalogModal
        isOpen={catalogModalOpen}
        onClose={() => setCatalogModalOpen(false)}
        initialPackageId="pkg-2500"
      />

    </section>
  );
};

