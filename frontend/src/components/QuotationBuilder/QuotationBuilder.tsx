import React, { useState } from 'react';
import { BANQUET_PACKAGES } from '../../data/packages.js';
import { BEVERAGE_SETS } from '../../data/beverages.js';
import { PackageTier, BeverageSet, CustomerInfo, SelectedDishMap, QuotationDoc } from '../../types/quotation.js';
import { CustomerForm } from './CustomerForm.js';
import { CourseSelector } from './CourseSelector.js';
import { TableCalculator } from './TableCalculator.js';
import { SummaryCard } from './SummaryCard.js';
import { QuotationModal } from './QuotationModal.js';
import { BookingStepsModal } from './BookingStepsModal.js';
import { QuotationApi } from '../../services/api.js';
import { sendOrderToLine } from '../../utils/lineOrderHelper.js';
import { Calculator, Sparkles, Utensils, CheckCircle, ChevronRight, Flame, Crown, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/currency.js';

interface QuotationBuilderProps {
  initialPackage?: PackageTier;
  initialDate?: string;
  onQuotationGenerated?: (quote: QuotationDoc) => void;
}

export const QuotationBuilder: React.FC<QuotationBuilderProps> = ({
  initialPackage,
  initialDate,
  onQuotationGenerated,
}) => {
  // State
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>(
    initialPackage || BANQUET_PACKAGES.find((p) => p.isPopular) || BANQUET_PACKAGES[2]
  );
  
  const [selectedDishes, setSelectedDishes] = useState<SelectedDishMap>(() => {
    const map: SelectedDishMap = {};
    const pkg = initialPackage || BANQUET_PACKAGES[2];
    pkg.courses.forEach((c) => {
      map[c.id] = c.defaultDishId;
    });
    return map;
  });

  const [tableCount, setTableCount] = useState<number>(10);
  const [selectedBeverage, setSelectedBeverage] = useState<BeverageSet>(BEVERAGE_SETS[1]); // Default 250
  const [floorServiceEnabled, setFloorServiceEnabled] = useState<boolean>(false);

  // Customer Information
  const [customerData, setCustomerData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    eventDate: initialDate || '',
    eventTime: 'ช่วงเย็น (17:00 - 19:00 น.)',
    eventLocation: '',
    eventType: 'งานมงคลสมรส (งานแต่งงาน)',
    notes: '',
  });

  // Effect to update eventDate if initialDate changes
  React.useEffect(() => {
    if (initialDate) {
      setCustomerData((prev) => ({ ...prev, eventDate: initialDate }));
    }
  }, [initialDate]);

  // Generated Quotation Modal State
  const [generatedQuotation, setGeneratedQuotation] = useState<QuotationDoc | null>(null);
  
  // Booking Steps Modal State
  const [bookingModalDoc, setBookingModalDoc] = useState<QuotationDoc | null>(null);

  // Handle Package Switch
  const handlePackageChange = (pkg: PackageTier) => {
    setSelectedPackage(pkg);
    const map: SelectedDishMap = {};
    pkg.courses.forEach((c) => {
      map[c.id] = c.defaultDishId;
    });
    setSelectedDishes(map);
  };

  // Handle Dish Swap in a Course
  const handleDishSelect = (courseId: string, dishId: string) => {
    setSelectedDishes((prev) => ({
      ...prev,
      [courseId]: dishId,
    }));
  };

  // Form Validation
  const isValid = Boolean(
    customerData.name.trim() &&
    customerData.phone.trim() &&
    customerData.eventDate &&
    customerData.eventLocation.trim() &&
    tableCount >= 10
  );

  // Helper to build Quote Document
  const buildQuoteDoc = (): QuotationDoc => {
    const selectedDishesArray = selectedPackage.courses.map((course) => {
      const activeDishId = selectedDishes[course.id] || course.defaultDishId;
      const dish = course.options.find((o) => o.id === activeDishId) || course.options[0];
      return {
        courseId: course.id,
        courseTitle: course.title,
        dishName: dish.name,
      };
    });

    const freeTableCount = Math.floor(tableCount / 20);
    const packageTotal = selectedPackage.price * tableCount;
    const beverageTotal = selectedBeverage.pricePerTable * tableCount;
    const floorServiceTotal = floorServiceEnabled ? 100 * tableCount : 0;
    
    // Travel fee calculation: 1,500 THB in BKK/Metro if < 20 tables, Free if >= 20 tables, customTravelFee if upcountry
    const isBkkMetro = (customerData.locationZone || 'bkk_metro') !== 'upcountry';
    const isFree = tableCount >= 20 && isBkkMetro;
    const travelFeeAmount = isBkkMetro 
      ? (tableCount < 20 ? 1500 : 0)
      : (customerData.customTravelFee || 0);
    const travelFeeDesc = isFree
      ? 'ฟรีค่าเดินทางขนส่งในกรุงเทพฯ และปริมณฑล (โปรโมชั่นสั่งครบ 20 โต๊ะขึ้นไป)'
      : isBkkMetro
      ? 'ค่าเดินทาง & ค่าขนส่งอุปกรณ์จัดเลี้ยง (กทม. และปริมณฑล - สั่งไม่ถึง 20 โต๊ะ)'
      : travelFeeAmount > 0
      ? `ค่าเดินทาง & ค่าขนส่งอุปกรณ์จัดเลี้ยง (ต่างจังหวัด - ตามตกลง ${travelFeeAmount.toLocaleString()} บาท)`
      : 'ค่าเดินทาง & ค่าขนส่งอุปกรณ์จัดเลี้ยง (ต่างจังหวัด - คำนวณตามระยะทางจริง ประสานงานคุณแป้ง)';

    const subtotal = packageTotal + beverageTotal + floorServiceTotal;
    const discount = 0;
    const grandTotal = subtotal + travelFeeAmount;

    const depositAmount = Math.round(grandTotal * 0.30);
    const finalAmount = grandTotal - depositAmount;

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    const quoteNo = `QT${year}${month}-${random}`;

    return {
      quoteNo,
      createdAt: new Date().toISOString(),
      customer: customerData,
      package: {
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: selectedPackage.price,
      },
      selectedDishes: selectedDishesArray,
      tableCount,
      freeTableCount,
      beverage: {
        id: selectedBeverage.id,
        name: selectedBeverage.name,
        pricePerTable: selectedBeverage.pricePerTable,
        total: beverageTotal,
      },
      floorService: {
        enabled: floorServiceEnabled,
        pricePerTable: 100,
        total: floorServiceTotal,
      },
      travelFee: {
        amount: travelFeeAmount,
        description: travelFeeDesc,
        zone: customerData.locationZone || 'bkk_metro',
        isFree,
      },
      subtotal,
      discount,
      grandTotal,
      depositAmount,
      finalAmount,
      status: 'pending',
    };
  };

  // Generate Quotation Document Action (View Modal)
  const handleGenerateQuotation = async () => {
    if (!isValid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน: ชื่อผู้ติดต่อ, เบอร์โทร, วันที่จัดงาน และสถานที่จัดงานนะคะ');
      return;
    }

    const quoteDoc = buildQuoteDoc();

    // Save to Database (or localStorage fallback)
    try {
      const saved = await QuotationApi.create(quoteDoc);
      setGeneratedQuotation(saved);
      if (onQuotationGenerated) onQuotationGenerated(saved);
    } catch (e) {
      setGeneratedQuotation(quoteDoc);
      if (onQuotationGenerated) onQuotationGenerated(quoteDoc);
    }
  };

  // Send Order Directly to LINE Action (Primary CTA)
  const handleSendLineOrder = async () => {
    if (!isValid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน: ชื่อผู้ติดต่อ, เบอร์โทร, วันที่จัดงาน และสถานที่จัดงาน เพื่อส่งเข้า LINE นะคะ');
      return;
    }

    const quoteDoc = buildQuoteDoc();

    try {
      const saved = await QuotationApi.create(quoteDoc);
      sendOrderToLine(saved);
      setGeneratedQuotation(saved);
      if (onQuotationGenerated) onQuotationGenerated(saved);
    } catch (e) {
      sendOrderToLine(quoteDoc);
      setGeneratedQuotation(quoteDoc);
      if (onQuotationGenerated) onQuotationGenerated(quoteDoc);
    }
  };

  // Open Booking Steps & Deposit Modal
  const handleOpenBookingModal = async () => {
    if (!isValid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน: ชื่อผู้ติดต่อ, เบอร์โทร, วันที่จัดงาน และสถานที่จัดงาน เพื่อดำเนินการสั่งจองนะคะ');
      return;
    }

    const quoteDoc = buildQuoteDoc();

    try {
      const saved = await QuotationApi.create(quoteDoc);
      setBookingModalDoc(saved);
      if (onQuotationGenerated) onQuotationGenerated(saved);
    } catch (e) {
      setBookingModalDoc(quoteDoc);
      if (onQuotationGenerated) onQuotationGenerated(quoteDoc);
    }
  };

  return (
    <section id="quotation-builder" className="py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart Quotation Builder (ระบบออกใบเสนอราคา A4)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ระบบคำนวณราคา & ออกใบเสนอราคา
            <span className="block mt-1 text-gradient-red-gold">
              มาตรฐานภัตตาคารแบบ Real-time
            </span>
          </h2>
          <p className="text-slate-700 text-sm font-medium">
            ติ๊กเลือกแพ็กเกจราคาจากแถบด้านบน ปรับแต่งรายการอาหาร ระบุจำนวนโต๊ะ และพิมพ์ใบเสนอราคา A4 ได้ทันที
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 👑 TOP SECTION: เมนูราคาทั้งหมดให้อยู่ด้านบน (Grand Horizontal Package Bar) */}
        {/* ========================================================================= */}
        <div className="bg-white/95 p-5 sm:p-7 rounded-3xl border-2 border-amber-300 shadow-xl shadow-amber-900/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-xs">
                <Utensils className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>เลือกแพ็กเกจราคาโต๊ะจีน</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {BANQUET_PACKAGES.length} ระดับราคา
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  คลิกที่ราคาเพื่อสลับแพ็กเกจและอัปเดตรายการอาหารอัตโนมัติ
                </p>
              </div>
            </div>

            {/* Selected Package Indicator Pill */}
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-red-50 to-amber-50 px-4 py-2 rounded-2xl border-2 border-amber-300 text-sm self-start sm:self-auto shadow-2xs">
              <span className="text-slate-700 font-black">แพ็กเกจที่เลือก:</span>
              <span className="font-black text-red-700 text-base">{selectedPackage.name}</span>
              <span className="text-amber-900 font-black">({formatCurrency(selectedPackage.price)}.- / โต๊ะ)</span>
            </div>
          </div>

          {/* Horizontal Package Price Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2.5">
            {BANQUET_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handlePackageChange(pkg)}
                  className={`relative p-3.5 rounded-2xl transition-all duration-200 flex flex-col justify-between items-center text-center group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-red-600 via-red-700 to-red-800 text-white shadow-xl scale-[1.03] border-2 border-amber-300 ring-4 ring-amber-300/40 z-10'
                      : 'bg-white hover:bg-amber-50/70 text-slate-900 border-2 border-amber-200 hover:border-amber-400 shadow-2xs'
                  }`}
                >
                  {/* Popular HOT Pill */}
                  {pkg.isPopular && (
                    <span className={`absolute -top-2.5 px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-0.5 shadow-sm ${
                      isSelected ? 'bg-amber-400 text-slate-950 border border-white' : 'bg-red-600 text-white'
                    }`}>
                      <Flame className="w-3 h-3" /> HOT
                    </span>
                  )}

                  <div className="space-y-0.5 w-full">
                    <div className={`text-xl sm:text-2xl font-black tracking-tight ${isSelected ? 'text-white' : 'text-red-700'}`}>
                      {pkg.price.toLocaleString()}.-
                    </div>
                    <div className={`text-xs sm:text-sm font-black truncate ${isSelected ? 'text-amber-200' : 'text-slate-900'}`}>
                      {pkg.name.replace('แพ็กเกจ', '').trim()}
                    </div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-red-100' : 'text-slate-600'}`}>
                      {pkg.dishCount} จาน / โต๊ะ
                    </div>
                  </div>

                  {/* Checked Badge */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-2 ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-700'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 MAIN SPACIOUS WORKSPACE (พื้นที่กว้างพิเศษ 8:4 Grid) */}
        {/* ========================================================================= */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* 📍 LEFT / CENTER WIDE AREA (8 Columns - Extra Spacious for Dishes & Form) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Course & Dish Selector (Spacious 2-Column Dish Cards) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-xl shadow-amber-900/5">
              <CourseSelector
                selectedPackage={selectedPackage}
                selectedDishes={selectedDishes}
                onDishSelect={handleDishSelect}
              />
            </div>

            {/* Step 2: Table Calculator & Beverages (Wide Horizontal Beverage Cards) */}
            <TableCalculator
              tableCount={tableCount}
              onTableCountChange={setTableCount}
              selectedBeverage={selectedBeverage}
              onBeverageSelect={setSelectedBeverage}
              floorServiceEnabled={floorServiceEnabled}
              onFloorServiceChange={setFloorServiceEnabled}
              packagePrice={selectedPackage.price}
            />

            {/* Step 3: Customer Details Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-xl shadow-amber-900/5">
              <CustomerForm
                formData={customerData}
                onChange={(data) => setCustomerData((prev) => ({ ...prev, ...data }))}
              />
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 📍 RIGHT AREA (4 Columns - Sticky Financial Summary & A4 Generator) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Step 4: Summary Card & Instant A4 Quotation Generator */}
            <SummaryCard
              selectedPackage={selectedPackage}
              tableCount={tableCount}
              selectedBeverage={selectedBeverage}
              onBeverageSelect={setSelectedBeverage}
              floorServiceEnabled={floorServiceEnabled}
              locationZone={customerData.locationZone || 'bkk_metro'}
              customTravelFee={customerData.customTravelFee}
              onGenerateQuotation={handleGenerateQuotation}
              onSendLineOrder={handleSendLineOrder}
              onBookNow={handleOpenBookingModal}
              isValid={isValid}
            />

          </div>

        </div>

      </div>

      {/* Booking Steps & Deposit Modal */}
      {bookingModalDoc && (
        <BookingStepsModal
          quotation={bookingModalDoc}
          isOpen={Boolean(bookingModalDoc)}
          onClose={() => setBookingModalDoc(null)}
          onViewQuotation={() => {
            setGeneratedQuotation(bookingModalDoc);
            setBookingModalDoc(null);
          }}
        />
      )}

      {/* Quotation Document Modal */}
      {generatedQuotation && (
        <QuotationModal
          quotation={generatedQuotation}
          onClose={() => setGeneratedQuotation(null)}
        />
      )}
    </section>
  );
};
