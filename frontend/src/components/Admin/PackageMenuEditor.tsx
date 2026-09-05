import React, { useState, useEffect } from 'react';
import { PackageTier, CourseCategory, DishItem } from '../../types/quotation.js';
import { packageService, useBanquetPackages } from '../../services/packageService.js';
import { formatCurrency } from '../../utils/currency.js';
import { getDishImage } from '../../utils/dishImageHelper.js';
import { DishPhotoLibraryModal } from './DishPhotoLibraryModal.js';
import {
  Utensils,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Edit3,
  Download,
  Upload,
  Eye,
  Check,
  AlertTriangle,
  X,
  Layers,
  FileJson
} from 'lucide-react';

interface PackageMenuEditorProps {
  onPreviewSite?: () => void;
}

export const PackageMenuEditor: React.FC<PackageMenuEditorProps> = ({ onPreviewSite }) => {
  const { packages, savePackages, resetToDefault, exportJson, importJson } = useBanquetPackages();

  // Selected package tab
  const [selectedPkgId, setSelectedPkgId] = useState<string>(() => packages[3]?.id || 'pkg-2000');
  
  // Local working copy of packages for uncommitted edits
  const [workingPackages, setWorkingPackages] = useState<PackageTier[]>(packages);

  // Sync working copy when external packages state updates
  useEffect(() => {
    setWorkingPackages(packages);
  }, [packages]);

  // Keep valid selectedPkgId
  useEffect(() => {
    if (!workingPackages.some((p) => p.id === selectedPkgId) && workingPackages.length > 0) {
      setSelectedPkgId(workingPackages[0].id);
    }
  }, [workingPackages, selectedPkgId]);

  // Notification state
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importError, setImportError] = useState<string>('');

  // Dish Photo Library Modal state
  const [photoPickerTarget, setPhotoPickerTarget] = useState<{
    pkgId: string;
    courseId: string;
    dishId: string;
    dishName: string;
    currentUrl: string;
  } | null>(null);

  const currentPkg = workingPackages.find((p) => p.id === selectedPkgId) || workingPackages[0];

  // =========================================================================
  // HANDLERS FOR EDITING WORKING COPY
  // =========================================================================

  const handleUpdatePackageField = (field: keyof PackageTier, value: any) => {
    if (!currentPkg) return;
    const updated = workingPackages.map((p) => {
      if (p.id === currentPkg.id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setWorkingPackages(updated);
  };

  const handleUpdateCourseTitle = (courseId: string, title: string) => {
    if (!currentPkg) return;
    const updatedCourses = currentPkg.courses.map((c) => {
      if (c.id === courseId) {
        return { ...c, title };
      }
      return c;
    });
    handleUpdatePackageField('courses', updatedCourses);
  };

  const handleSetDefaultDish = (courseId: string, dishId: string) => {
    if (!currentPkg) return;
    const updatedCourses = currentPkg.courses.map((c) => {
      if (c.id === courseId) {
        return { ...c, defaultDishId: dishId };
      }
      return c;
    });
    handleUpdatePackageField('courses', updatedCourses);
  };

  const handleUpdateDishField = (courseId: string, dishId: string, field: keyof DishItem, value: any) => {
    if (!currentPkg) return;
    const updatedCourses = currentPkg.courses.map((c) => {
      if (c.id === courseId) {
        const options = c.options.map((d) => {
          if (d.id === dishId) {
            return { ...d, [field]: value };
          }
          return d;
        });
        return { ...c, options };
      }
      return c;
    });
    handleUpdatePackageField('courses', updatedCourses);
  };

  const handleAddDishOption = (courseId: string) => {
    if (!currentPkg) return;
    const course = currentPkg.courses.find((c) => c.id === courseId);
    if (!course) return;

    const newDishId = `dish-${Date.now()}`;
    const newDish: DishItem = {
      id: newDishId,
      name: `เมนูใหม่ ${course.options.length + 1}`,
      tag: 'เพิ่มใหม่',
      imageUrl: '',
    };

    const updatedCourses = currentPkg.courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          options: [...c.options, newDish],
          defaultDishId: c.defaultDishId || newDishId,
        };
      }
      return c;
    });
    handleUpdatePackageField('courses', updatedCourses);
  };

  const handleDeleteDishOption = (courseId: string, dishId: string) => {
    if (!currentPkg) return;
    const course = currentPkg.courses.find((c) => c.id === courseId);
    if (!course || course.options.length <= 1) {
      alert('ไม่สามารถลบได้ เนื่องจากต้องมีเมนูอย่างน้อย 1 รายการในแต่ละจาน');
      return;
    }

    const updatedCourses = currentPkg.courses.map((c) => {
      if (c.id === courseId) {
        const options = c.options.filter((d) => d.id !== dishId);
        let defaultDishId = c.defaultDishId;
        if (defaultDishId === dishId) {
          defaultDishId = options[0]?.id || '';
        }
        return { ...c, options, defaultDishId };
      }
      return c;
    });
    handleUpdatePackageField('courses', updatedCourses);
  };

  const handleReorderDish = (courseId: string, index: number, direction: 'up' | 'down') => {
    if (!currentPkg) return;
    const course = currentPkg.courses.find((c) => c.id === courseId);
    if (!course) return;

    const options = [...course.options];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= options.length) return;

    const [moved] = options.splice(index, 1);
    options.splice(targetIndex, 0, moved);

    const updatedCourses = currentPkg.courses.map((c) => {
      if (c.id === courseId) {
        return { ...c, options };
      }
      return c;
    });
    handleUpdatePackageField('courses', updatedCourses);
  };

  // =========================================================================
  // PERSISTENCE ACTIONS
  // =========================================================================

  const handleSaveAllChanges = () => {
    savePackages(workingPackages);
    setSaveSuccessMsg('✓ บันทึกการเปลี่ยนแปลงเมนูอาหารและแพ็กเกจขึ้นหน้าเว็บเรียบร้อยแล้ว');
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 4000);
  };

  const handleConfirmReset = () => {
    resetToDefault();
    setWorkingPackages(packageService.getPackages());
    setShowResetConfirm(false);
    setSaveSuccessMsg('✓ คืนค่าเมนูเริ่มต้นมาตรฐานโรงครัวเรียบร้อยแล้ว');
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 4000);
  };

  const handleExportJson = () => {
    const json = exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapeephat_packages_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    setImportError('');
    if (!importJsonText.trim()) {
      setImportError('กรุณาวางโค้ด JSON ข้อมูลแพ็กเกจ');
      return;
    }
    const success = importJson(importJsonText);
    if (success) {
      setWorkingPackages(packageService.getPackages());
      setShowImportModal(false);
      setImportJsonText('');
      setSaveSuccessMsg('✓ นำเข้าข้อมูลแพ็กเกจและเมนูอาหารสำเร็จ');
      setTimeout(() => {
        setSaveSuccessMsg('');
      }, 4000);
    } else {
      setImportError('รูปแบบไฟล์ JSON ไม่ถูกต้อง กรุณาตรวจสอบโครงสร้างข้อมูล');
    }
  };

  if (!currentPkg) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>จัดการเมนูอาหาร & แพ็กเกจโต๊ะจีน</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                ⚡ อัปเดตขึ้นหน้าเว็บทันที
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              แก้ไขชื่อเมนูอาหาร, ป้ายกำกับ, รูปภาพประจำจาน, เพิ่ม/ลบเมนูทางเลือกในแต่ละแพ็กเกจ
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            title="สำรองข้อมูลเป็นไฟล์ JSON"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">สำรองข้อมูล (JSON)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            title="นำเข้าไฟล์สำรองข้อมูล JSON"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">นำเข้าข้อมูล</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-300"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAllChanges}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer scale-100 hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-xs sm:text-sm font-black flex items-center gap-2.5 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏷️ PACKAGE SELECTOR TABS (เลือกระดับราคาแพ็กเกจ) */}
      {/* ========================================================================= */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs font-black text-slate-700 px-1">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-red-600" />
            เลือกระดับราคาแพ็กเกจที่ต้องการแก้ไข:
          </span>
          <span className="text-slate-400 font-medium">({workingPackages.length} แพ็กเกจ)</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {workingPackages.map((pkg) => {
            const isSelected = pkg.id === selectedPkgId;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md ring-2 ring-red-300 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border border-slate-200'
                }`}
              >
                <span>{formatCurrency(pkg.price)}</span>
                {pkg.isPopular && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-950 font-bold'}`}>
                    ยอดฮิต
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📦 PACKAGE METADATA EDIT CARD */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50/50 via-white to-red-50/30 border-2 border-amber-300 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200">
          <div>
            <span className="text-xs font-black text-red-700 uppercase tracking-wider">
              {currentPkg.id} • {currentPkg.dishCount} จาน
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentPkg.name} ({formatCurrency(currentPkg.price)})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black border border-amber-300">
              {currentPkg.tag || 'แพ็กเกจยอดนิยม'}
            </span>
          </div>
        </div>

        {/* Edit Metadata Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">ชื่อแพ็กเกจ (Package Name):</label>
            <input
              type="text"
              value={currentPkg.name}
              onChange={(e) => handleUpdatePackageField('name', e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">ป้ายกำกับ (Tag / Badge):</label>
            <input
              type="text"
              value={currentPkg.tag || ''}
              onChange={(e) => handleUpdatePackageField('tag', e.target.value)}
              placeholder="เช่น ชุดพรีเมียมยอดนิยม, เมนูแนะนำ"
              className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">ไฮไลท์เมนูเด่น (Highlight):</label>
            <input
              type="text"
              value={currentPkg.highlight || ''}
              onChange={(e) => handleUpdatePackageField('highlight', e.target.value)}
              placeholder="เช่น ออเดิร์ฟ 5 อย่าง + ปลากะพงนึ่งมะนาว"
              className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-bold text-slate-700">คำอธิบายแพ็กเกจ (Description):</label>
            <input
              type="text"
              value={currentPkg.description}
              onChange={(e) => handleUpdatePackageField('description', e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🍲 COURSE BY COURSE EDITOR (จานที่ 1 - จานที่ 9/10) */}
      {/* ========================================================================= */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>รายการอาหารในแต่ละจาน ({currentPkg.courses.length} จาน):</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            * คลิกที่รูปเพื่อเลือกภาพอาหาร หรือพิมพ์แก้ไขชื่อเมนูได้ทันที
          </span>
        </div>

        <div className="space-y-4">
          {currentPkg.courses.map((course, courseIndex) => {
            return (
              <div
                key={course.id || courseIndex}
                className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm hover:border-amber-400 transition-all space-y-4"
              >
                {/* Course Header (Title & Index & Set Default Dish) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-100">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
                      {course.courseIndex || courseIndex + 1}
                    </div>
                    <div className="flex-1 max-w-md">
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => handleUpdateCourseTitle(course.id, e.target.value)}
                        placeholder="ชื่อจาน เช่น จานที่ 7 (เลือก 1 อย่าง)"
                        className="w-full px-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-slate-500">
                      มีตัวเลือกทั้งหมด: <span className="font-black text-red-700">{course.options.length} เมนู</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddDishOption(course.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-700" />
                      <span>เพิ่มเมนูในจานนี้</span>
                    </button>
                  </div>
                </div>

                {/* Dish Options List */}
                <div className="grid grid-cols-1 gap-2.5">
                  {course.options.map((dish, dishIndex) => {
                    const isDefault = course.defaultDishId === dish.id || (!course.defaultDishId && dishIndex === 0);
                    const dishImg = dish.imageUrl || getDishImage(dish.name, course.title);

                    return (
                      <div
                        key={dish.id || dishIndex}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          isDefault
                            ? 'bg-amber-50/40 border-amber-300 shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200'
                        }`}
                      >
                        {/* Left: Thumbnail & Name & Tag Editor */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Dish Image Preview & Photo Library Trigger */}
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <div
                              onClick={() =>
                                setPhotoPickerTarget({
                                  pkgId: currentPkg.id,
                                  courseId: course.id,
                                  dishId: dish.id,
                                  dishName: dish.name,
                                  currentUrl: dishImg,
                                })
                              }
                              className="group/img relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-slate-300 hover:border-red-500 bg-slate-900 cursor-pointer shadow-xs transition-all hover:scale-105"
                              title="คลิกเพื่อเปลี่ยนรูป หรืออัปโหลดรูปใหม่"
                            >
                              <img
                                src={dishImg}
                                alt={dish.name}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-[8px] font-bold mt-0.5 leading-none">เปลี่ยนรูป</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setPhotoPickerTarget({
                                  pkgId: currentPkg.id,
                                  courseId: course.id,
                                  dishId: dish.id,
                                  dishName: dish.name,
                                  currentUrl: dishImg,
                                })
                              }
                              className="text-[10px] font-bold text-red-700 hover:text-red-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <Upload className="w-2.5 h-2.5" />
                              <span>อัปโหลดรูป</span>
                            </button>
                          </div>

                          {/* Inputs: Name & Tag */}
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ชื่อเมนูอาหาร:</label>
                              <input
                                type="text"
                                value={dish.name}
                                onChange={(e) => handleUpdateDishField(course.id, dish.id, 'name', e.target.value)}
                                placeholder="เช่น แกงป่ารวมมิตร"
                                className="w-full px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:border-red-600"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ป้ายกำกับ (Tag / Badge):</label>
                              <input
                                type="text"
                                value={dish.tag || ''}
                                onChange={(e) => handleUpdateDishField(course.id, dish.id, 'tag', e.target.value)}
                                placeholder="เช่น ⭐ ยอดฮิต, หม้อไฟ, นุ่มละมุน"
                                className="w-full px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions (Set Default, Reorder, Delete) */}
                        <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                          {isDefault ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-950 text-[11px] font-black border border-amber-400 flex items-center gap-1 shadow-2xs">
                              <Check className="w-3 h-3 stroke-[3]" /> เมนูเริ่มต้น
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultDish(course.id, dish.id)}
                              className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 text-slate-700 text-[11px] font-bold border border-slate-300 transition-colors cursor-pointer"
                            >
                              ตั้งเป็นเริ่มต้น
                            </button>
                          )}

                          {/* Reorder Buttons */}
                          <div className="flex items-center bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              disabled={dishIndex === 0}
                              onClick={() => handleReorderDish(course.id, dishIndex, 'up')}
                              className="p-1.5 hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition-colors cursor-pointer"
                              title="เลื่อนขึ้น"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={dishIndex === course.options.length - 1}
                              onClick={() => handleReorderDish(course.id, dishIndex, 'down')}
                              className="p-1.5 hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition-colors cursor-pointer"
                              title="เลื่อนลง"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Delete Dish Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteDishOption(course.id, dish.id)}
                            disabled={course.options.length <= 1}
                            className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer disabled:opacity-30"
                            title="ลบเมนูนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Save Bar */}
      <div className="sticky bottom-4 z-40 p-4 rounded-3xl bg-slate-900/95 backdrop-blur-md text-white border-2 border-amber-400 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>เมื่อแก้ไขเรียบร้อยแล้ว อย่าลืมกด "บันทึกการเปลี่ยนแปลงทั้งหมด" เพื่อให้อัปเดตขึ้นหน้าเว็บ</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleSaveAllChanges}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖼️ DISH PHOTO LIBRARY MODAL */}
      {/* ========================================================================= */}
      {photoPickerTarget && (
        <DishPhotoLibraryModal
          isOpen={!!photoPickerTarget}
          onClose={() => setPhotoPickerTarget(null)}
          dishNameHint={photoPickerTarget.dishName}
          currentPhotoUrl={photoPickerTarget.currentUrl}
          onSelectPhoto={(photoUrl) => {
            handleUpdateDishField(
              photoPickerTarget.courseId,
              photoPickerTarget.dishId,
              'imageUrl',
              photoUrl
            );
            setPhotoPickerTarget(null);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* ⚠️ RESET TO DEFAULT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-amber-400 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              ยืนยันการคืนค่าเริ่มต้นจากระบบ?
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              การคืนค่าเริ่มต้นจะรีเซ็ตรายชื่อเมนูและแพ็กเกจทั้งหมดกลับเป็นค่ามาตรฐานจากโรงครัวโต๊ะจีน รพีพัฒน์ ดั้งเดิม
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-colors cursor-pointer shadow-sm"
              >
                ยืนยันคืนค่าเริ่มต้น
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📥 IMPORT PACKAGES JSON MODAL */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border-2 border-amber-400 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-black text-slate-900">นำเข้าข้อมูลสำรอง (JSON Import)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              วางโค้ด JSON ข้อมูลสำรองของแพ็กเกจอาหารที่เคยส่งออกไว้:
            </p>

            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="[ { id: 'pkg-2000', ... } ]"
              rows={8}
              className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
            />

            {importError && (
              <p className="text-xs font-bold text-red-600">{importError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-colors cursor-pointer shadow-sm"
              >
                นำเข้าข้อมูลและบันทึก
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
