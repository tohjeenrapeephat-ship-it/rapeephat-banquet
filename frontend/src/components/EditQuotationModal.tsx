import React, { useState } from 'react';
import { QuotationDoc } from '../types/quotation.js';
import { useBanquetPackages } from '../services/packageService.js';
import { formatCurrency, thaiBahtText } from '../utils/currency.js';
import { RealtimeLocationMap } from './QuotationBuilder/RealtimeLocationMap.js';
import { DISH_PHOTO_PRESETS } from './Admin/DishPhotoLibraryModal.js';
import {
  X,
  Save,
  FileText,
  User,
  Calendar,
  Phone,
  MapPin,
  Utensils,
  DollarSign,
  Gift,
  Tag,
  Clock,
  Sparkles,
  ExternalLink,
  Printer,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Award,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface EditQuotationModalProps {
  quotation: QuotationDoc;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuote: QuotationDoc, openPreview?: boolean) => void;
}

export const EditQuotationModal: React.FC<EditQuotationModalProps> = ({
  quotation,
  isOpen,
  onClose,
  onSave,
}) => {
  const { packages } = useBanquetPackages();

  if (!isOpen || !quotation) return null;

  // Form State initialized with current quotation values
  const [customerName, setCustomerName] = useState(quotation.customer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(quotation.customer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(quotation.customer?.email || '');
  const [eventDate, setEventDate] = useState(quotation.customer?.eventDate || '');
  const [eventTime, setEventTime] = useState(quotation.customer?.eventTime || '11:00 น.');
  const [eventLocation, setEventLocation] = useState(quotation.customer?.eventLocation || '');
  const [eventType, setEventType] = useState(quotation.customer?.eventType || 'งานเลี้ยงทั่วไป');
  const [notes, setNotes] = useState(quotation.customer?.notes || '');

  const [locationZone, setLocationZone] = useState<'bkk_metro' | 'upcountry'>(
    quotation.customer?.locationZone || 'bkk_metro'
  );
  const [travelFeeAmount, setTravelFeeAmount] = useState<number>(() => {
    if (quotation.travelFee?.amount !== undefined) return quotation.travelFee.amount;
    const isBkk = (quotation.customer?.locationZone || 'bkk_metro') !== 'upcountry';
    return (quotation.tableCount || 10) < 20 && isBkk ? 1500 : 0;
  });

  const [selectedPackageId, setSelectedPackageId] = useState(quotation.package?.id || 'pkg-2000');
  const [packagePrice, setPackagePrice] = useState<number>(quotation.package?.price || 2000);
  const [packageName, setPackageName] = useState(quotation.package?.name || '');

  const [tableCount, setTableCount] = useState<number>(quotation.tableCount || 10);
  const [freeTableCount, setFreeTableCount] = useState<number>(quotation.freeTableCount || 0);
  const [discount, setDiscount] = useState<number>(quotation.discount || 0);
  const [status, setStatus] = useState<string>(quotation.status || 'pending');
  const [pdfDriveUrl, setPdfDriveUrl] = useState(quotation.pdfDriveUrl || '');

  // Beverage & Service settings
  const [enableBeverage, setEnableBeverage] = useState<boolean>(!!quotation.beverage && quotation.beverage.total > 0);
  const [beveragePricePerTable, setBeveragePricePerTable] = useState<number>(quotation.beverage?.pricePerTable || 300);

  const [enableFloorService, setEnableFloorService] = useState<boolean>(quotation.floorService?.enabled || false);
  const [floorServicePricePerTable, setFloorServicePricePerTable] = useState<number>(quotation.floorService?.pricePerTable || 150);

  // Dishes State: Initialized with quotation's selectedDishes
  const [dishes, setDishes] = useState<{ courseId: string; courseTitle: string; dishName: string }[]>(() => {
    if (quotation.selectedDishes && quotation.selectedDishes.length > 0) {
      return quotation.selectedDishes.map((d) => ({ ...d }));
    }
    const pkg = packages.find((p) => p.id === quotation.package?.id) || packages[0];
    return pkg.courses.map((c) => {
      const defDish = c.options.find((o) => o.id === c.defaultDishId) || c.options[0];
      return {
        courseId: c.id,
        courseTitle: c.title,
        dishName: defDish ? defDish.name : '',
      };
    });
  });

  // Calculate prices dynamically
  const beverageTotal = enableBeverage ? tableCount * beveragePricePerTable : 0;
  const floorServiceTotal = enableFloorService ? tableCount * floorServicePricePerTable : 0;
  const tableBaseTotal = tableCount * packagePrice;
  const subtotal = tableBaseTotal + beverageTotal + floorServiceTotal;
  const grandTotal = Math.max(0, subtotal + travelFeeAmount - discount);
  
  const depositAmount = Math.round(grandTotal * 0.3);
  const finalAmount = Math.max(0, grandTotal - depositAmount);

  const currentPackageData = packages.find((p) => p.id === selectedPackageId) || packages[0];

  // All preset dishes across catalog for fast lookup
  const allCatalogDishes = DISH_PHOTO_PRESETS.map((p) => p.name);

  // Package Switch Handler
  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgId = e.target.value;
    setSelectedPackageId(pkgId);
    const found = packages.find((p) => p.id === pkgId);
    if (found) {
      setPackagePrice(found.price);
      setPackageName(found.name);
      // Update dishes to new package defaults
      const newDishes = found.courses.map((c) => {
        const defDish = c.options.find((o) => o.id === c.defaultDishId) || c.options[0];
        return {
          courseId: c.id,
          courseTitle: c.title,
          dishName: defDish ? defDish.name : '',
        };
      });
      setDishes(newDishes);
    }
  };

  const handleTableCountChange = (val: number) => {
    const count = Math.max(1, val);
    setTableCount(count);
    // Automatic Free Table promotion rule: 1 free table per 20 tables
    const autoFree = Math.floor(count / 20);
    setFreeTableCount(autoFree);
    // Auto adjust travel fee if in BKK zone
    if (locationZone === 'bkk_metro') {
      setTravelFeeAmount(count < 20 ? 1500 : 0);
    }
  };

  const handleZoneChange = (zone: 'bkk_metro' | 'upcountry') => {
    setLocationZone(zone);
    if (zone === 'bkk_metro') {
      setTravelFeeAmount(tableCount < 20 ? 1500 : 0);
    }
  };

  // Dish Handlers
  const handleDishNameChange = (index: number, newName: string) => {
    setDishes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], dishName: newName };
      return updated;
    });
  };

  const handleCourseTitleChange = (index: number, newTitle: string) => {
    setDishes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], courseTitle: newTitle };
      return updated;
    });
  };

  const handleReorderDish = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= dishes.length) return;

    setDishes((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIdx, 0, moved);
      return updated;
    });
  };

  const handleAddCustomDish = () => {
    const nextIdx = dishes.length + 1;
    setDishes((prev) => [
      ...prev,
      {
        courseId: `c-custom-${Date.now()}`,
        courseTitle: `จานพิเศษที่ ${nextIdx}`,
        dishName: '',
      },
    ]);
  };

  const handleRemoveDish = (index: number) => {
    if (dishes.length <= 1) {
      alert('ชุดโต๊ะจีนต้องมีรายการอาหารอย่างน้อย 1 รายการค่ะ');
      return;
    }
    setDishes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetToPackageDefaults = () => {
    if (!confirm('ต้องการรีเซ็ตรายการอาหารกลับเป็นค่าเริ่มต้นตามแพ็กเกจหรือไม่?')) return;
    const pkg = packages.find((p) => p.id === selectedPackageId) || packages[0];
    const defaultDishes = pkg.courses.map((c) => {
      const defDish = c.options.find((o) => o.id === c.defaultDishId) || c.options[0];
      return {
        courseId: c.id,
        courseTitle: c.title,
        dishName: defDish ? defDish.name : '',
      };
    });
    setDishes(defaultDishes);
  };

  const handleFormSubmit = (e: React.FormEvent, openPreview: boolean = false) => {
    e.preventDefault();

    const selectedPkg = packages.find((p) => p.id === selectedPackageId) || quotation.package;
    const isBkk = locationZone !== 'upcountry';
    const isFree = tableCount >= 20 && isBkk;

    const updated: QuotationDoc = {
      ...quotation,
      customer: {
        ...quotation.customer,
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        eventDate,
        eventTime,
        eventLocation,
        eventType,
        locationZone,
        notes,
      },
      package: {
        ...selectedPkg,
        id: selectedPackageId,
        name: packageName || selectedPkg.name,
        price: packagePrice,
      },
      selectedDishes: dishes.map((d, i) => ({
        courseId: d.courseId || `c-${i + 1}`,
        courseTitle: d.courseTitle || `จานที่ ${i + 1}`,
        dishName: d.dishName.trim() || `รายการอาหารที่ ${i + 1}`,
      })),
      tableCount,
      freeTableCount,
      beverage: enableBeverage
        ? {
            id: 'bev-standard',
            name: 'เครื่องดื่ม & น้ำดื่มตลอดงาน',
            pricePerTable: beveragePricePerTable,
            total: beverageTotal,
          }
        : undefined,
      floorService: {
        enabled: enableFloorService,
        pricePerTable: floorServicePricePerTable,
        total: floorServiceTotal,
      },
      travelFee: {
        amount: travelFeeAmount,
        description: isFree
          ? 'ฟรีค่าเดินทางขนส่งในกรุงเทพฯ และปริมณฑล (โปรโมชั่นสั่งครบ 20 โต๊ะขึ้นไป)'
          : isBkk
          ? 'ค่าเดินทาง & ค่าขนส่งอุปกรณ์จัดเลี้ยง (กทม. และปริมณฑล - สั่งไม่ถึง 20 โต๊ะ)'
          : 'ค่าเดินทาง & ค่าขนส่งอุปกรณ์จัดเลี้ยง (ต่างจังหวัด - คำนวณตามระยะทางจริง ประสานงานคุณแป้ง)',
        zone: locationZone,
        isFree,
      },
      subtotal,
      discount,
      grandTotal,
      depositAmount,
      finalAmount,
      status: status as any,
      pdfDriveUrl: pdfDriveUrl.trim() || undefined,
      updatedAt: Date.now(),
    };

    onSave(updated, openPreview);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden my-4 flex flex-col max-h-[94vh] animate-scaleUp">
        
        {/* ========================================================================= */}
        {/* 🎛️ MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 px-5 sm:px-6 py-4 flex items-center justify-between text-white border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                <span>แก้ไขใบเสนอราคา & รายการอาหาร & ปรับราคา</span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-white border border-white/20">
                  {quotation.quoteNo || 'QT-DRAFT'}
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                เปลี่ยนเมนูอาหารทุกจาน, ปรับราคาต่อโต๊ะ, ส่วนลด, ค่าเดินทาง และสั่งพิมพ์/ออก PDF ฉบับจริงได้ทันที
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 📝 FORM BODY */}
        {/* ========================================================================= */}
        <form onSubmit={(e) => handleFormSubmit(e, false)} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* SECTION 1: CUSTOMER INFORMATION */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-red-600" />
              <span>1. ข้อมูลผู้ว่าจ้าง / ลูกค้า & วันจัดงาน</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อเจ้าภาพ / ผู้ติดต่อ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-bold text-slate-900 outline-none"
                  placeholder="เช่น คุณสมศักดิ์ นครปฐม หรือ บริษัท เอ บี ซี จำกัด"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-mono font-bold text-slate-900 outline-none"
                  placeholder="เช่น 081-234-5678"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทงานจัดเลี้ยง</label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-medium text-slate-900 outline-none"
                  placeholder="เช่น งานมงคลสมรส, งานบวช, งานสังสรรค์"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">วันที่จัดงานเลี้ยง *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เวลาเสิร์ฟอาหาร (บริการ 4 ชม.)</label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-medium text-slate-900 outline-none"
                  placeholder="เช่น เพล (11:00 น.) หรือ เย็น (18:00 น.)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">สถานะเอกสาร</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-bold text-slate-900 outline-none"
                >
                  <option value="pending">⏳ รอยืนยัน (Pending)</option>
                  <option value="deposit_paid">💳 ชำระมัดจำแล้ว (Deposit Paid)</option>
                  <option value="confirmed">✅ ยืนยันคิวแล้ว (Confirmed)</option>
                  <option value="completed">🎉 เสร็จสิ้นงาน (Completed)</option>
                  <option value="cancelled">❌ ยกเลิก (Cancelled)</option>
                </select>
              </div>

              <div className="sm:col-span-2 md:col-span-3 space-y-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">สถานที่จัดงาน / อำเภอ จังหวัด *</label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-medium text-slate-900 outline-none"
                  placeholder="เช่น วัดไร่ขิง อ.สามพราน จ.นครปฐม หรือ หอประชุมเทศบาล"
                />
                <RealtimeLocationMap
                  location={eventLocation}
                  onLocationChange={(newLoc) => setEventLocation(newLoc)}
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: PRICING, PACKAGE & TABLE SETTINGS */}
          {/* ========================================================================= */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2">
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-700" />
                <span>2. แพ็กเกจอาหาร, ปรับราคาต่อโต๊ะ & คำนวณเงิน</span>
              </h3>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                ⚡ ปรับราคาต่อโต๊ะ หรือส่วนลดได้อิสระ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* Package Select */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">เลือกแพ็กเกจอาหาร:</label>
                <select
                  value={selectedPackageId}
                  onChange={handlePackageChange}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-black text-slate-900 outline-none"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({formatCurrency(pkg.price)}.-)
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Per Table with Quick Adjusters */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>ราคาต่อโต๊ะ (บาท):</span>
                  <span className="text-[10px] text-red-600 font-bold">ปรับราคาได้</span>
                </label>
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-mono font-black text-slate-900 outline-none"
                />
                <div className="flex items-center gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setPackagePrice((prev) => Math.max(500, prev - 100))}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    -100
                  </button>
                  <button
                    type="button"
                    onClick={() => setPackagePrice((prev) => prev + 100)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    +100
                  </button>
                  <button
                    type="button"
                    onClick={() => setPackagePrice((prev) => prev + 500)}
                    className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-black cursor-pointer"
                  >
                    +500
                  </button>
                </div>
              </div>

              {/* Table Count with Quick Adjusters */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>จำนวนโต๊ะที่สั่ง (โต๊ะ):</span>
                  <span className="text-[10px] text-slate-500 font-medium">{tableCount} โต๊ะ</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={tableCount === 0 ? '' : tableCount}
                  onChange={(e) => handleTableCountChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-mono font-black text-slate-900 outline-none"
                />
                <div className="flex items-center gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleTableCountChange(Math.max(1, tableCount - 1))}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTableCountChange(tableCount + 1)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTableCountChange(tableCount + 5)}
                    className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-black cursor-pointer"
                  >
                    +5 โต๊ะ
                  </button>
                </div>
              </div>

              {/* Free Table Promotion */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">จำนวนโต๊ะแถมฟรี (โต๊ะ):</label>
                <input
                  type="number"
                  min="0"
                  value={freeTableCount}
                  onChange={(e) => setFreeTableCount(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-mono font-black text-emerald-700 outline-none"
                />
                <p className="text-[10px] text-emerald-700 font-bold pt-0.5">
                  * โปรโมชั่นแถม 1 โต๊ะ ทุกๆ 20 โต๊ะ
                </p>
              </div>

              {/* Travel Fee */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>ค่าเดินทางขนส่ง (บาท):</span>
                  <span className="text-[10px] text-slate-500">
                    {locationZone === 'bkk_metro' ? (tableCount >= 20 ? 'ฟรี 0.-' : '1,500.-') : 'ต่างจังหวัด'}
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={travelFeeAmount}
                  onChange={(e) => setTravelFeeAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-mono font-bold text-slate-900 outline-none"
                />
                <div className="flex items-center gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setTravelFeeAmount(0)}
                    className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-bold cursor-pointer"
                  >
                    ฟรี (0.-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelFeeAmount(1500)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    1,500.-
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelFeeAmount(2500)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    2,500.-
                  </button>
                </div>
              </div>

              {/* Special Discount */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">ส่วนลดพิเศษ (บาท):</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={discount === 0 ? '' : discount}
                  onChange={(e) => setDiscount(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-mono font-black text-red-600 outline-none"
                  placeholder="0"
                />
                <div className="flex items-center gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setDiscount(500)}
                    className="px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold cursor-pointer"
                  >
                    -500
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscount(1000)}
                    className="px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold cursor-pointer"
                  >
                    -1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscount(0)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold cursor-pointer"
                  >
                    รีเซ็ต
                  </button>
                </div>
              </div>

              {/* Zone Select */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">โซนพื้นที่จัดงาน:</label>
                <select
                  value={locationZone}
                  onChange={(e) => handleZoneChange(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs sm:text-sm font-bold text-slate-900 outline-none"
                >
                  <option value="bkk_metro">กรุงเทพฯ และปริมณฑล</option>
                  <option value="upcountry">ต่างจังหวัด (นอกปริมณฑล)</option>
                </select>
              </div>

              {/* Beverage Options */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>บริการเครื่องดื่ม & น้ำดื่ม:</span>
                  <input
                    type="checkbox"
                    checked={enableBeverage}
                    onChange={(e) => setEnableBeverage(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                </label>
                {enableBeverage ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={beveragePricePerTable}
                      onChange={(e) => setBeveragePricePerTable(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-xs font-mono font-bold text-slate-900 outline-none"
                      placeholder="ราคา/โต๊ะ"
                    />
                    <span className="text-[11px] text-slate-500 font-bold shrink-0">บ./โต๊ะ</span>
                  </div>
                ) : (
                  <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium">
                    ไม่รวมเครื่องดื่ม
                  </div>
                )}
              </div>
            </div>

            {/* Calculated Financial Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-red-50 border-2 border-amber-300 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center shadow-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">รวมโต๊ะจัดเสิร์ฟ</div>
                <div className="text-base font-black text-slate-900">{tableCount + freeTableCount} โต๊ะ</div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  (สั่ง {tableCount} + แถม {freeTableCount})
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">ค่าเดินทางขนส่ง</div>
                <div className="text-base font-black text-slate-900 font-mono">
                  {travelFeeAmount > 0 ? `${formatCurrency(travelFeeAmount)}.-` : 'ฟรี (0.-)'}
                </div>
              </div>

              <div className="p-2.5 bg-red-50 rounded-xl border-2 border-red-300">
                <div className="text-[10px] text-red-800 font-bold">ยอดรวมสุทธิ</div>
                <div className="text-lg font-black text-red-700 font-mono">{formatCurrency(grandTotal)}.-</div>
                <div className="text-[9px] text-red-600 font-medium truncate">
                  ({thaiBahtText(grandTotal)})
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border-2 border-emerald-300">
                <div className="text-[10px] text-emerald-800 font-bold flex items-center justify-center gap-1">
                  <span>มัดจำจองคิว 30%</span>
                </div>
                <div className="text-base font-black text-emerald-700 font-mono">
                  {formatCurrency(depositAmount)}.-
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">คงเหลือชำระวันงาน 70%</div>
                <div className="text-base font-black text-slate-900 font-mono">{formatCurrency(finalAmount)}.-</div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: EDIT DISHES IN EACH COURSE */}
          {/* ========================================================================= */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-red-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <span>3. รายการอาหารในใบเสนอราคา ({dishes.length} จาน)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✏️ แก้ไขชื่อเมนู / สลับจานได้ทันที
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    คุณแป้งสามารถเลือกเมนูจากรายการมาตรฐาน หรือพิมพ์ข้อความชื่อเมนูพิเศษตามที่ลูกค้าขอได้เลยค่ะ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToPackageDefaults}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                  title="รีเซ็ตกลับเป็นเมนูมาตรฐานตามแพ็กเกจ"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>รีเซ็ตตามแพ็กเกจ</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddCustomDish}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  title="เพิ่มรายการอาหารพิเศษในชุด"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ เพิ่มจานพิเศษ</span>
                </button>
              </div>
            </div>

            {/* Dish Rows List */}
            <div className="space-y-3 pt-1">
              {dishes.map((dish, idx) => {
                // Find matching course in package if exists
                const matchedCourse = currentPackageData.courses[idx];
                const availableOptions = matchedCourse?.options || [];

                return (
                  <div
                    key={dish.courseId || idx}
                    className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-amber-50/50 border-2 border-slate-200 hover:border-amber-400 transition-all space-y-2.5"
                  >
                    {/* Course Title & Reorder / Delete Controls */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 max-w-sm">
                        <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={dish.courseTitle}
                          onChange={(e) => handleCourseTitleChange(idx, e.target.value)}
                          placeholder={`จานที่ ${idx + 1}`}
                          className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleReorderDish(idx, 'up')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 border border-slate-200 transition-colors cursor-pointer"
                          title="เลื่อนขึ้น"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={idx === dishes.length - 1}
                          onClick={() => handleReorderDish(idx, 'down')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 border border-slate-200 transition-colors cursor-pointer"
                          title="เลื่อนลง"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete Dish */}
                        <button
                          type="button"
                          onClick={() => handleRemoveDish(idx)}
                          className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                          title="ลบจานนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dish Options & Direct Freeform Input */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                      {/* Preset Course Options Dropdown */}
                      {availableOptions.length > 0 ? (
                        <div className="md:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            เลือกจากตัวเลือกมาตรฐานในจานนี้:
                          </label>
                          <select
                            value={availableOptions.some((o) => o.name === dish.dishName) ? dish.dishName : ''}
                            onChange={(e) => {
                              if (e.target.value) handleDishNameChange(idx, e.target.value);
                            }}
                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 focus:border-red-600 outline-none"
                          >
                            <option value="">-- เลือกเมนูมาตรฐานประจำจาน --</option>
                            {availableOptions.map((opt) => (
                              <option key={opt.id} value={opt.name}>
                                {opt.name} {opt.tag ? `(${opt.tag})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="md:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            เลือกจากคลังอาหารโต๊ะจีนทั้งหมด:
                          </label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleDishNameChange(idx, e.target.value);
                            }}
                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 focus:border-red-600 outline-none"
                          >
                            <option value="">-- เลือกเมนูจากคลังอาหาร --</option>
                            {allCatalogDishes.map((name, cIdx) => (
                              <option key={cIdx} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Direct Freeform Name Input */}
                      <div className="md:col-span-7">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          ชื่อรายการอาหารที่จะแสดงบนใบเสนอราคา & สัญญาจัดเลี้ยง:
                        </label>
                        <input
                          type="text"
                          required
                          value={dish.dishName}
                          onChange={(e) => handleDishNameChange(idx, e.target.value)}
                          placeholder="พิมพ์ชื่อเมนูอาหาร หรือระบุเงื่อนไขพิเศษ..."
                          className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-xs font-black text-slate-900 focus:border-red-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: PDF GOOGLE DRIVE LINK & NOTES */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ExternalLink className="w-4 h-4 text-red-600" />
              <span>4. ลิงก์ไฟล์ PDF บน Google Drive & หมายเหตุพิเศษ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ลิงก์ไฟล์ PDF บน Google Drive (คัดลอกมาวางเพื่ออัปเดตไฟล์ PDF ได้โดยตรง):
                </label>
                <input
                  type="url"
                  value={pdfDriveUrl}
                  onChange={(e) => setPdfDriveUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs font-mono text-slate-900 outline-none"
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">หมายเหตุ / ความต้องการพิเศษจากลูกค้า:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-red-600 text-xs font-medium text-slate-900 outline-none"
                  placeholder="เช่น ต้องการพัดลมไอเย็นเพิ่ม, ขอเสิร์ฟเร็วขึ้น 30 นาที..."
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🔘 ACTION BUTTONS (BOTTOM) */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>

            <div className="flex items-center gap-2.5">
              {/* Save Only */}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all border border-amber-400/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกข้อมูล</span>
              </button>

              {/* Save & Preview A4 / PDF */}
              <button
                type="button"
                onClick={(e) => handleFormSubmit(e, true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>บันทึก & เปิดดูใบเสนอราคา A4 ทันที</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

