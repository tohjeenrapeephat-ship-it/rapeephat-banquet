import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Camera,
  Search,
  Check,
  Edit3,
  Trash2,
  Eye,
  Download,
  Scissors,
  RefreshCw,
  Plus,
  Sparkles,
  Utensils,
  FolderHeart,
  HelpCircle,
  X,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SmartDishImage } from '../SmartDishImage.js';
import { imageStore } from '../../services/imageStore.js';
import { packageService } from '../../services/packageService.js';
import { normalizeThaiDishName, extractDishBaseName } from '../../utils/thaiTextNormalizer.js';
import { trimCanvasWhiteMargins } from '../../utils/imageTrimHelper.js';
import { DISH_PHOTO_PRESETS, PhotoPreset } from './DishPhotoLibraryModal.js';
import { PackageTier } from '../../types/quotation.js';

const CUSTOM_PHOTOS_KEY = 'rapeephat_custom_uploaded_photos_v1';

// Client-side image compression & white-margin auto-trimming
const processImageFile = (file: File, autoTrim: boolean = true): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Standard high-definition banquet photo resolution
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let finalCanvas = canvas;
        if (autoTrim) {
          try {
            finalCanvas = trimCanvasWhiteMargins(canvas);
          } catch (err) {
            console.warn('Auto-trim notice:', err);
          }
        }

        const dataUrl = finalCanvas.toDataURL('image/jpeg', 0.88);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการโหลดไฟล์'));
    reader.readAsDataURL(file);
  });
};

export const PhotoManager: React.FC = () => {
  const [customPhotos, setCustomPhotos] = useState<PhotoPreset[]>([]);
  const [activeTab, setActiveTab] = useState<'my_uploads' | 'presets'>('my_uploads');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Editing state
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingPhotoName, setEditingPhotoName] = useState<string>('');

  // Replacing photo state
  const [replacingPhotoId, setReplacingPhotoId] = useState<string | null>(null);

  // Large preview modal state
  const [largePreviewPhoto, setLargePreviewPhoto] = useState<PhotoPreset | null>(null);

  // Assign to Menu modal state
  const [assigningPhoto, setAssigningPhoto] = useState<PhotoPreset | null>(null);
  const [packages, setPackages] = useState<PackageTier[]>(() => packageService.getPackages());
  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg-1800');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('c2');
  const [selectedDishId, setSelectedDishId] = useState<string>('');

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Load custom photos from IndexedDB & LocalStorage
  const loadPhotos = async () => {
    try {
      const dbPhotos = await imageStore.getAllCustomPhotos();
      let localPhotos: PhotoPreset[] = [];
      const saved = localStorage.getItem(CUSTOM_PHOTOS_KEY);
      if (saved) {
        try {
          localPhotos = JSON.parse(saved);
        } catch (e) {}
      }

      const combinedMap = new Map<string, PhotoPreset>();
      localPhotos.forEach((p) => {
        if (p && (p.id || p.url)) combinedMap.set(p.id || p.url, p);
      });
      dbPhotos.forEach((p) => {
        if (p && (p.id || p.url)) combinedMap.set(p.id || p.url, p);
      });

      const merged = Array.from(combinedMap.values()).sort(
        (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
      );

      setCustomPhotos(merged);
    } catch (e) {
      console.warn('Failed to load custom photos in PhotoManager:', e);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const savePhotosState = (newPhotos: PhotoPreset[]) => {
    setCustomPhotos(newPhotos);
    newPhotos.forEach((photo) => {
      imageStore.saveCustomPhoto(photo);
    });
    try {
      localStorage.setItem(CUSTOM_PHOTOS_KEY, JSON.stringify(newPhotos.slice(0, 20)));
    } catch (e) {}
  };

  const showNotification = (msg: string, isError: boolean = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Upload new photo
  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const dataUrl = await processImageFile(file, true);
      const rawDishName = file.name.replace(/\.[^/.]+$/, '').trim();
      const defaultDishName = rawDishName || 'เมนูอาหารใหม่';

      const newPhoto: PhotoPreset = {
        id: `upload-${Date.now()}`,
        name: defaultDishName,
        category: 'my_uploads',
        categoryLabel: 'รูปภาพที่คุณอัปโหลดเอง',
        url: dataUrl,
        tag: '📸 อัปโหลดเอง',
        timestamp: Date.now(),
      };

      await imageStore.saveCustomPhoto(newPhoto);
      await imageStore.setOverride(defaultDishName, dataUrl);

      const updated = [newPhoto, ...customPhotos.filter((p) => p.id !== newPhoto.id)];
      savePhotosState(updated);

      showNotification(`✓ อัปโหลดและบันทึกรูป "${defaultDishName}" เรียบร้อยแล้วค่ะ!`);
      setActiveTab('my_uploads');
    } catch (err: any) {
      showNotification(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', true);
    } finally {
      setIsUploading(false);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  // Replace existing photo
  const handleReplacePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !replacingPhotoId) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const dataUrl = await processImageFile(file, true);

      const targetPhoto = customPhotos.find((p) => p.id === replacingPhotoId);
      if (targetPhoto) {
        const updatedPhoto: PhotoPreset = {
          ...targetPhoto,
          url: dataUrl,
          timestamp: Date.now(),
        };

        await imageStore.saveCustomPhoto(updatedPhoto);
        await imageStore.setOverride(targetPhoto.name, dataUrl);

        const updated = customPhotos.map((p) => (p.id === replacingPhotoId ? updatedPhoto : p));
        savePhotosState(updated);

        // Also update any package dishes using this dish name
        const pkgs = packageService.getPackages();
        let changed = false;
        const normTarget = normalizeThaiDishName(targetPhoto.name);
        const newPkgs = pkgs.map((pkg) => ({
          ...pkg,
          courses: pkg.courses.map((course) => ({
            ...course,
            options: course.options.map((opt) => {
              if (normalizeThaiDishName(opt.name) === normTarget || opt.name === targetPhoto.name) {
                changed = true;
                return { ...opt, imageUrl: dataUrl };
              }
              return opt;
            }),
          })),
        }));
        if (changed) {
          packageService.savePackages(newPkgs);
        }

        showNotification(`✓ เปลี่ยนรูปสำหรับเมนู "${targetPhoto.name}" เรียบร้อยแล้วค่ะ!`);
      }
    } catch (err: any) {
      showNotification(err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรูปภาพ', true);
    } finally {
      setIsUploading(false);
      setReplacingPhotoId(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // Start Inline Rename
  const handleStartRename = (photo: PhotoPreset) => {
    setEditingPhotoId(photo.id);
    setEditingPhotoName(photo.name);
  };

  // Save Inline Rename
  const handleSaveRename = async (photoId: string, customName?: string) => {
    const newName = (customName !== undefined ? customName : editingPhotoName).trim();
    if (!newName) return;

    const targetPhoto = customPhotos.find((p) => p.id === photoId);
    if (targetPhoto) {
      const oldName = targetPhoto.name;
      const updatedPhoto = { ...targetPhoto, name: newName };

      await imageStore.saveCustomPhoto(updatedPhoto);
      await imageStore.setOverride(newName, targetPhoto.url);

      const updated = customPhotos.map((p) => (p.id === photoId ? updatedPhoto : p));
      savePhotosState(updated);

      if (largePreviewPhoto && largePreviewPhoto.id === photoId) {
        setLargePreviewPhoto({ ...largePreviewPhoto, name: newName });
      }

      showNotification(`✓ เปลี่ยนชื่อเมนูเป็น "${newName}" เรียบร้อยแล้วค่ะ`);
    }
    setEditingPhotoId(null);
  };

  // Delete Photo
  const handleDeletePhoto = async (photoId: string) => {
    const target = customPhotos.find((p) => p.id === photoId);
    if (!target) return;

    if (window.confirm(`คุณต้องการลบรูปภาพ "${target.name}" ออกจากระบบใช่หรือไม่?`)) {
      await imageStore.deleteCustomPhoto(photoId);
      const updated = customPhotos.filter((p) => p.id !== photoId);
      savePhotosState(updated);
      showNotification(`✓ ลบรูปภาพ "${target.name}" เรียบร้อยแล้วค่ะ`);
    }
  };

  // Auto-Trim White Margins
  const handleAutoTrimPhoto = async (photo: PhotoPreset) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const trimmed = trimCanvasWhiteMargins(canvas);
        const trimmedDataUrl = trimmed.toDataURL('image/jpeg', 0.90);

        const updatedPhoto = { ...photo, url: trimmedDataUrl, timestamp: Date.now() };
        await imageStore.saveCustomPhoto(updatedPhoto);
        await imageStore.setOverride(photo.name, trimmedDataUrl);

        const updated = customPhotos.map((p) => (p.id === photo.id ? updatedPhoto : p));
        savePhotosState(updated);

        if (largePreviewPhoto && largePreviewPhoto.id === photo.id) {
          setLargePreviewPhoto(updatedPhoto);
        }

        showNotification(`✓ ตัดขอบขาวอัตโนมัติสำหรับ "${photo.name}" เรียบร้อยแล้วค่ะ!`);
      };
      img.src = photo.url;
    } catch (e) {
      showNotification('ไม่สามารถตัดขอบรูปภาพนี้ได้', true);
    }
  };

  // Download Photo
  const handleDownloadPhoto = (photo: PhotoPreset) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.name || 'rapeephat_dish'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`✓ บันทึกรูป "${photo.name}" ลงเครื่องเรียบร้อยแล้วค่ะ`);
  };

  // Assign photo to a specific package course option
  const handleAssignToCourse = () => {
    if (!assigningPhoto) return;

    const currentPkgs = packageService.getPackages();
    let assigned = false;

    const newPkgs = currentPkgs.map((pkg) => {
      if (pkg.id === selectedPkgId) {
        return {
          ...pkg,
          courses: pkg.courses.map((course) => {
            if (course.id === selectedCourseId) {
              return {
                ...course,
                options: course.options.map((opt) => {
                  if (!selectedDishId || opt.id === selectedDishId) {
                    assigned = true;
                    return {
                      ...opt,
                      name: assigningPhoto.name || opt.name,
                      imageUrl: assigningPhoto.url,
                    };
                  }
                  return opt;
                }),
              };
            }
            return course;
          }),
        };
      }
      return pkg;
    });

    if (assigned) {
      packageService.savePackages(newPkgs);
      imageStore.setOverride(assigningPhoto.name, assigningPhoto.url);
      setPackages(newPkgs);
      showNotification(`✓ ผูกรูป "${assigningPhoto.name}" เข้ากับแพ็กเกจเรียบร้อยแล้วค่ะ!`);
      setAssigningPhoto(null);
    }
  };

  // Filter photos
  const normSearch = normalizeThaiDishName(searchTerm);
  const currentList = activeTab === 'my_uploads' ? customPhotos : DISH_PHOTO_PRESETS;

  const filteredPhotos = currentList.filter((photo) => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const pNameNorm = normalizeThaiDishName(photo.name);
    const pTagNorm = photo.tag ? normalizeThaiDishName(photo.tag) : '';
    const matchesSearch =
      !searchTerm ||
      photo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pNameNorm.includes(normSearch) ||
      (photo.tag && photo.tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pTagNorm && pTagNorm.includes(normSearch));
    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="space-y-6">
      
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={uploadInputRef}
        onChange={handleUploadNew}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplacePhotoFile}
        accept="image/*"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-amber-400/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/30">
              <FolderHeart className="w-4 h-4 text-amber-300" />
              <span>ระบบคลังรูปภาพอาหารหลังร้าน (Media & Dish Photo Manager)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              จัดการ & แก้ไขรูปภาพอาหารหลังร้าน
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              อัปโหลดรูปภาพอาหารจานจริง, แก้ไขชื่อเมนู, เปลี่ยนรูปใหม่, ตัดขอบขาวให้เต็มกรอบ, และบันทึกรูปเก็บไว้ในเครื่องได้ทันที
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              disabled={isUploading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-lg hover:shadow-emerald-900/30 transition-all transform hover:scale-102 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'กำลังอัปโหลด...' : '📤 อัปโหลดรูปอาหารใหม่'}</span>
            </button>

            <button
              type="button"
              onClick={loadPhotos}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-white/20"
              title="รีเฟรชคลังรูปภาพ"
            >
              <RefreshCw className="w-4 h-4" />
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mt-4 px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-black flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 px-4 py-2.5 rounded-2xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-black flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Main Tabs (รูปที่ฉันอัปโหลด vs คลังภาพโต๊ะจีนมาตรฐาน) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('my_uploads')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'my_uploads'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>📸 รูปที่ฉันอัปโหลดเอง ({customPhotos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>🍽️ คลังภาพโต๊ะจีนมาตรฐาน ({DISH_PHOTO_PRESETS.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อเมนู เช่น ออเดิร์ฟ 5 อย่าง, ปลากะพง, ขาหมู..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Categories Pills (When viewing presets or all) */}
        {activeTab === 'presets' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-black whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => {
            const isCustom = activeTab === 'my_uploads' || photo.category === 'my_uploads';

            return (
              <div
                key={photo.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <SmartDishImage
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Action Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    {photo.tag && (
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-amber-300 font-bold text-[10px] shadow-xs">
                        {photo.tag}
                      </span>
                    )}
                  </div>

                  {/* Quick View Large Button */}
                  <button
                    type="button"
                    onClick={() => setLargePreviewPhoto(photo)}
                    className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-amber-500 text-white font-bold text-[10.5px] flex items-center gap-1 transition-colors cursor-pointer shadow-md"
                  >
                    <Eye className="w-3 h-3 text-amber-300" />
                    <span>ดูรูปใหญ่</span>
                  </button>

                  {/* Delete Button for Uploaded Photos */}
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                      title="ลบรูปนี้ออกจากระบบ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dish Info & Action Buttons */}
                <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between bg-slate-50/50">
                  
                  {/* Dish Name Header / Inline Editor */}
                  {isCustom && editingPhotoId === photo.id ? (
                    <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <label className="text-[10px] font-bold text-slate-500">พิมพ์ชื่อเมนูอาหาร:</label>
                      <input
                        type="text"
                        value={editingPhotoName}
                        onChange={(e) => setEditingPhotoName(e.target.value)}
                        placeholder="เช่น ออเดิร์ฟ 5 อย่าง"
                        autoFocus
                        className="w-full px-2.5 py-1.5 bg-amber-50 border-2 border-amber-400 rounded-xl text-xs font-black text-slate-900 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(photo.id);
                          if (e.key === 'Escape') setEditingPhotoId(null);
                        }}
                      />
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleSaveRename(photo.id)}
                          className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>บันทึกชื่อ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPhotoId(null)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-2">
                          {photo.name}
                        </h4>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleStartRename(photo)}
                            className="p-1 rounded-lg bg-white hover:bg-amber-100 text-slate-600 hover:text-amber-900 border border-slate-200 transition-colors shrink-0 cursor-pointer"
                            title="✏️ คลิกเพื่อแก้ไขชื่อเมนูอาหาร"
                          >
                            <Edit3 className="w-3 h-3 text-amber-700" />
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">
                        หมวดหมู่: {photo.categoryLabel}
                      </p>
                    </div>
                  )}

                  {/* Operational Toolbar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    
                    {/* Primary Row: Replace Photo & Trim White Margins */}
                    {isCustom && (
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setReplacingPhotoId(photo.id);
                            replaceInputRef.current?.click();
                          }}
                          className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-[10.5px] border border-amber-300 flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          title="อัปโหลดรูปภาพใหม่มาแทนที่รูปนี้"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-700" />
                          <span>เปลี่ยนรูปใหม่</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAutoTrimPhoto(photo)}
                          className="py-1.5 px-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-950 font-black text-[10.5px] border border-teal-300 flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          title="ตัดขอบขาวอัตโนมัติให้รูปแสดงผลเต็มกรอบ"
                        >
                          <Scissors className="w-3 h-3 text-teal-700" />
                          <span>ตัดขอบขาว</span>
                        </button>
                      </div>
                    )}

                    {/* Secondary Row: Download to Computer & Assign to Package */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDownloadPhoto(photo)}
                        className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10.5px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="บันทึกรูปนี้เก็บไว้ในเครื่องคอมพิวเตอร์"
                      >
                        <Download className="w-3 h-3 text-slate-600" />
                        <span>บันทึกลงเครื่อง</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAssigningPhoto(photo);
                          setSelectedPkgId('pkg-1800');
                        }}
                        className="py-1.5 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[10.5px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="นำรูปนี้ไปผูกกับเมนูในแพ็กเกจทันที"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>ผูกเข้าเมนู</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-16 space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 p-8">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-800">
                {activeTab === 'my_uploads' ? 'ยังไม่มีรูปภาพที่คุณอัปโหลดเอง' : 'ไม่พบรูปภาพที่ตรงกับคำค้นหา'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {activeTab === 'my_uploads'
                  ? 'คุณสามารถกดปุ่ม "📤 อัปโหลดรูปอาหารใหม่" เพื่อนำเข้ารูปถ่ายอาหารจริงจากมือถือหรือคอมพิวเตอร์ได้ทันที'
                  : `ลองค้นหาด้วยคำอื่น เช่น ออเดิร์ฟ, ปลากะพง, ต้มยำ, ขาหมู`}
              </p>
            </div>
            {activeTab === 'my_uploads' && (
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>อัปโหลดรูปภาพแรก</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🖼️ LARGE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {largePreviewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setLargePreviewPhoto(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-amber-400 animate-scaleUp flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-black text-amber-300 truncate">
                    {largePreviewPhoto.name}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    หมวดหมู่: {largePreviewPhoto.categoryLabel}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLargePreviewPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Large Image */}
            <div className="relative bg-slate-950 aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden flex items-center justify-center">
              <SmartDishImage
                src={largePreviewPhoto.url}
                alt={largePreviewPhoto.name}
                className="w-full h-full object-cover scale-[1.02]"
              />
            </div>

            {/* Footer Toolbar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPhoto(largePreviewPhoto)}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>บันทึกลงเครื่อง</span>
                </button>

                {largePreviewPhoto.category === 'my_uploads' && (
                  <button
                    type="button"
                    onClick={() => handleAutoTrimPhoto(largePreviewPhoto)}
                    className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-950 text-xs font-bold border border-teal-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5 text-teal-700" />
                    <span>ตัดขอบขาว</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = largePreviewPhoto;
                    setLargePreviewPhoto(null);
                    setAssigningPhoto(target);
                  }}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>นำรูปนี้ไปผูกกับเมนู</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔗 ASSIGN PHOTO TO MENU MODAL */}
      {/* ========================================================================= */}
      {assigningPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setAssigningPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-red-500 animate-scaleUp p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    ผูกรูปภาพเข้ากับเมนูอาหาร
                  </h3>
                  <p className="text-xs text-slate-500">
                    เลือกแพ็กเกจและจานที่ต้องการนำรูปนี้ไปแสดงผล
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssigningPhoto(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo preview pill */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-amber-300">
                <SmartDishImage src={assigningPhoto.url} alt={assigningPhoto.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-amber-950 truncate">
                  {assigningPhoto.name}
                </div>
                <div className="text-[11px] text-amber-800">
                  {assigningPhoto.categoryLabel}
                </div>
              </div>
            </div>

            {/* Package selector */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">1. เลือกแพ็กเกจราคา:</label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => {
                    setSelectedPkgId(e.target.value);
                    const p = packages.find((x) => x.id === e.target.value);
                    if (p && p.courses[0]) {
                      setSelectedCourseId(p.courses[0].id);
                      setSelectedDishId(p.courses[0].options[0]?.id || '');
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-red-600"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.price.toLocaleString()} บาท)
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">2. เลือกจานลำดับที่:</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    const p = packages.find((x) => x.id === selectedPkgId);
                    const c = p?.courses.find((x) => x.id === e.target.value);
                    if (c && c.options[0]) {
                      setSelectedDishId(c.options[0].id);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-red-600"
                >
                  {packages.find((p) => p.id === selectedPkgId)?.courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dish Option Selector (if multiple) */}
              {(() => {
                const p = packages.find((x) => x.id === selectedPkgId);
                const c = p?.courses.find((x) => x.id === selectedCourseId);
                if (!c || c.options.length <= 1) return null;
                return (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">3. เลือกเมนูในจานนี้:</label>
                    <select
                      value={selectedDishId}
                      onChange={(e) => setSelectedDishId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-red-600"
                    >
                      {c.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} {opt.tag ? `(${opt.tag})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })()}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssigningPhoto(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleAssignToCourse}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>ยืนยันการผูกรูปภาพ</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
