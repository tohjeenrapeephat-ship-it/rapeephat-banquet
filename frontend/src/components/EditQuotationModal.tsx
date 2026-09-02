import React, { useState } from 'react';
import { QuotationDoc } from '../types/quotation.js';
import { BANQUET_PACKAGES } from '../data/packages.js';
import { formatCurrency } from '../utils/currency.js';
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
  Award
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

  const [selectedPackageId, setSelectedPackageId] = useState(quotation.package?.id || 'pkg-1400');
  const [packagePrice, setPackagePrice] = useState<number>(quotation.package?.price || 1400);
  const [packageName, setPackageName] = useState(quotation.package?.name || '');

  const [tableCount, setTableCount] = useState<number>(quotation.tableCount || 10);
  const [freeTableCount, setFreeTableCount] = useState<number>(quotation.freeTableCount || 0);
  const [discount, setDiscount] = useState<number>(quotation.discount || 0);
  const [status, setStatus] = useState<string>(quotation.status || 'pending');
  const [pdfDriveUrl, setPdfDriveUrl] = useState(quotation.pdfDriveUrl || '');

  // Dishes State: Initialized with quotation's selectedDishes
  const [dishes, setDishes] = useState<{ courseId: string; courseTitle: string; dishName: string }[]>(() => {
    if (quotation.selectedDishes && quotation.selectedDishes.length > 0) {
      return quotation.selectedDishes.map((d) => ({ ...d }));
    }
    const pkg = BANQUET_PACKAGES.find((p) => p.id === quotation.package?.id) || BANQUET_PACKAGES[0];
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
  const beverageTotal = quotation.beverage?.total || 0;
  const floorServiceTotal = quotation.floorService?.total || 0;
  const subtotal = tableCount * packagePrice + beverageTotal + floorServiceTotal;
  const grandTotal = Math.max(0, subtotal + travelFeeAmount - discount);
  const depositAmount = Math.round(grandTotal * 0.3);
  const finalAmount = grandTotal - depositAmount;

  const currentPackageData = BANQUET_PACKAGES.find((p) => p.id === selectedPackageId) || BANQUET_PACKAGES[0];

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgId = e.target.value;
    setSelectedPackageId(pkgId);
    const found = BANQUET_PACKAGES.find((p) => p.id === pkgId);
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

  const handleSelectPredefinedDish = (index: number, dishName: string) => {
    handleDishNameChange(index, dishName);
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
    const pkg = BANQUET_PACKAGES.find((p) => p.id === selectedPackageId) || BANQUET_PACKAGES[0];
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

    const selectedPkg = BANQUET_PACKAGES.find((p) => p.id === selectedPackageId) || quotation.package;
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 px-6 py-4 flex items-center justify-between text-white border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-300 flex items-center gap-2">
                <span>แก้ไขใบเสนอราคา & รายการอาหารจัดเลี้ยง</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/20">
                  {quotation.quoteNo}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                แก้ไขชื่อลูกค้า, วันจัดงาน, รายการอาหารทุกจาน, ราคา และอัปเดตไฟล์ PDF ทันที
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => handleFormSubmit(e, false)} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto bg-slate-50/50">
          
          {/* Section 1: Customer Information */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-red-600" />
              <span>1. ข้อมูลผู้ว่าจ้าง / ลูกค้า</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อเจ้าภาพ / ผู้ติดต่อ <span className="text-red-700 font-extrabold text-[11px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200 ml-1">(ชื่อในการออกใบเสร็จ/สัญญาจ้างงาน)</span> <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-medium text-slate-900 outline-none"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-mono font-medium text-slate-900 outline-none"
                  placeholder="เช่น 081-234-5678"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">อีเมล (ถ้ามี)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-medium text-slate-900 outline-none"
                  placeholder="customer@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทงานจัดเลี้ยง</label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-medium text-slate-900 outline-none"
                  placeholder="เช่น งานมงคลสมรส, งานบวช, งานสังสรรค์ประจำปี"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Event Schedule & Location */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>2. วันเวลาและสถานที่จัดงาน</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">วันที่จัดงานเลี้ยง *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-medium text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เวลาเสิร์ฟอาหาร (บริการ 4 ชม.)</label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-medium text-slate-900 outline-none"
                  placeholder="เช่น ช่วงเพล (11:00 - 15:00 น. รวม 4 ชม.) หรือ 18:00 - 22:00 น."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">สถานที่จัดงาน / อำเภอ จังหวัด *</label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-medium text-slate-900 outline-none"
                  placeholder="เช่น หอประชุมเทศบาลเมืองนครปฐม ถ.เทศา อ.เมือง จ.นครปฐม"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Package, Tables & Pricing */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Utensils className="w-4 h-4 text-red-600" />
              <span>3. แพ็กเกจอาหาร, จำนวนโต๊ะ และการคิดราคา</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เลือกแพ็กเกจอาหาร</label>
                <select
                  value={selectedPackageId}
                  onChange={handlePackageChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-bold text-slate-900 outline-none"
                >
                  {BANQUET_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({formatCurrency(pkg.price)}.-)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ราคาต่อโต๊ะ (บาท)</label>
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">โซนพื้นที่จัดงาน</label>
                <select
                  value={locationZone}
                  onChange={(e) => handleZoneChange(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-bold text-slate-900 outline-none"
                >
                  <option value="bkk_metro">กรุงเทพฯ และปริมณฑล</option>
                  <option value="upcountry">ต่างจังหวัด (นอกเขตปริมณฑล)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ค่าเดินทางขนส่ง (บาท)
                  {locationZone === 'bkk_metro' && tableCount < 20 && (
                    <span className="text-[10.5px] text-red-600 font-bold ml-1">(ไม่ถึง 20 โต๊ะ = 1,500)</span>
                  )}
                  {locationZone === 'bkk_metro' && tableCount >= 20 && (
                    <span className="text-[10.5px] text-emerald-600 font-bold ml-1">(20 โต๊ะขึ้นไป = ฟรี 0.-)</span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={travelFeeAmount}
                  onChange={(e) => setTravelFeeAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">จำนวนโต๊ะที่สั่ง (โต๊ะ)</label>
                <input
                  type="number"
                  min="1"
                  value={tableCount}
                  onChange={(e) => handleTableCountChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">จำนวนโต๊ะแถมฟรี</label>
                <input
                  type="number"
                  min="0"
                  value={freeTableCount}
                  onChange={(e) => setFreeTableCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-mono font-bold text-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ส่วนลดพิเศษ (บาท)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-mono font-bold text-red-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">สถานะเอกสาร</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-sm font-bold text-slate-900 outline-none"
                >
                  <option value="pending">รอยืนยัน (Pending)</option>
                  <option value="deposit_paid">ชำระมัดจำแล้ว (Deposit Paid)</option>
                  <option value="confirmed">ยืนยันคิวแล้ว (Confirmed)</option>
                  <option value="completed">เสร็จสิ้นงาน (Completed)</option>
                  <option value="cancelled">ยกเลิก (Cancelled)</option>
                </select>
              </div>
            </div>

            {/* Calculated Financial Summary */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-red-50 border border-amber-300 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">รวมโต๊ะจัดเสิร์ฟ</div>
                <div className="text-base font-black text-slate-900">{tableCount + freeTableCount} โต๊ะ</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">ค่าเดินทาง</div>
                <div className="text-base font-black text-slate-900 font-mono">
                  {travelFeeAmount > 0 ? `${formatCurrency(travelFeeAmount)}.-` : 'ฟรี (0.-)'}
                </div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">ยอดรวมสุทธิ</div>
                <div className="text-base font-black text-red-700 font-mono">{formatCurrency(grandTotal)}.-</div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-300">
                <div className="text-[10px] text-emerald-800 font-bold">มัดจำ 30%</div>
                <div className="text-base font-black text-emerald-700 font-mono">{formatCurrency(depositAmount)}.-</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">คงเหลือวันงาน 70%</div>
                <div className="text-base font-black text-slate-900 font-mono">{formatCurrency(finalAmount)}.-</div>
              </div>
            </div>
          </div>

          {/* Section 4: EDIT DISHES / MENU ITEMS (NEW FEATURE) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    4. รายการอาหารในชุดโต๊ะจีน ({dishes.length} จาน)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    คุณแป้งสามารถเลือกสลับเมนู หรือพิมพ์แก้ไขชื่อเมนูพิเศษตามที่ลูกค้าขอได้โดยตรง
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToPackageDefaults}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200"
                  title="รีเซ็ตกลับเป็นเมนูมาตรฐานตามแพ็กเกจ"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>รีเซ็ตตามแพ็กเกจ</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddCustomDish}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  title="เพิ่มรายการอาหารพิเศษ"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มจานพิเศษ</span>
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
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50/40 border border-slate-200 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {dish.courseTitle || `จานที่ ${idx + 1}`}:
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDish(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="ลบจานนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Option A: Pick Predefined Dish from Package Course */}
                      {availableOptions.length > 0 && (
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                            เลือกจากตัวเลือกมาตรฐานของแพ็กเกจ:
                          </label>
                          <select
                            value={availableOptions.some((o) => o.name === dish.dishName) ? dish.dishName : ''}
                            onChange={(e) => {
                              if (e.target.value) handleSelectPredefinedDish(idx, e.target.value);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:border-red-600 outline-none"
                          >
                            <option value="">-- เลือกเมนูมาตรฐาน --</option>
                            {availableOptions.map((opt) => (
                              <option key={opt.id} value={opt.name}>
                                {opt.name} {opt.tag ? `(${opt.tag})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Option B: Direct Custom Text Input for Dish Name */}
                      <div className={availableOptions.length === 0 ? 'sm:col-span-2' : ''}>
                        <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                          ชื่อรายการอาหารที่จะพิมพ์ลงใบเสนอราคา & สัญญาจ้าง:
                        </label>
                        <input
                          type="text"
                          required
                          value={dish.dishName}
                          onChange={(e) => handleDishNameChange(idx, e.target.value)}
                          placeholder="พิมพ์ชื่อเมนูอาหาร..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:border-red-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: PDF Google Drive Link & Notes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ExternalLink className="w-4 h-4 text-red-600" />
              <span>5. ลิงก์ไฟล์ PDF และหมายเหตุ</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ลิงก์ไฟล์ PDF บน Google Drive (คัดลอกมาวางเพื่ออัปเดตไฟล์ PDF ได้โดยตรง):
              </label>
              <input
                type="url"
                value={pdfDriveUrl}
                onChange={(e) => setPdfDriveUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-xs font-mono text-slate-900 outline-none"
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">หมายเหตุ / ความต้องการพิเศษจากลูกค้า:</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 text-xs font-medium text-slate-900 outline-none"
                placeholder="เช่น ต้องการพัดลมไอเย็นเพิ่ม, ขอเสิร์ฟเร็วขึ้น 30 นาที..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
            >
              ยกเลิก
            </button>

            <div className="flex items-center gap-3">
              {/* Save Only */}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all border border-amber-400/40"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกข้อมูล</span>
              </button>

              {/* Save and View Updated PDF / Quotation */}
              <button
                type="button"
                onClick={(e) => handleFormSubmit(e, true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white text-xs font-black flex items-center gap-2 shadow-red-glow border border-amber-300 transition-all transform hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>บันทึก & ออกเอกสาร A4 / PDF ใหม่</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
