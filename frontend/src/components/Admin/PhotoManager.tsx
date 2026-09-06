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
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { exportMenuToExcelFile } from '../../utils/excelMenuExporter.js';
import { SmartDishImage } from '../SmartDishImage.js';
import { imageStore } from '../../services/imageStore.js';
import { packageService } from '../../services/packageService.js';
import { normalizeThaiDishName, extractDishBaseName } from '../../utils/thaiTextNormalizer.js';
import { trimCanvasWhiteMargins } from '../../utils/imageTrimHelper.js';
import { DISH_PHOTO_PRESETS, PhotoPreset } from './DishPhotoLibraryModal.js';
import { PackageTier } from '../../types/quotation.js';

const CUSTOM_PHOTOS_KEY = 'rapeephat_custom_uploaded_photos_v1';
export const PRESET_NAMES_OVERRIDE_KEY = 'rapeephat_preset_names_override_v1';

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

// Smart dish and course matching helper for Thai banquet catering
export const checkDishMatch = (
  photoName: string = '',
  optName: string = '',
  courseTitle: string = '',
  optTag: string = ''
): boolean => {
  const photoNorm = normalizeThaiDishName(photoName);
  const photoBase = extractDishBaseName(photoName);
  const optNorm = normalizeThaiDishName(optName);
  const optBase = extractDishBaseName(optName);
  const courseNorm = normalizeThaiDishName(courseTitle);
  const tagNorm = optTag ? normalizeThaiDishName(optTag) : '';

  if (!photoNorm || !optNorm) return false;

  // 1. Direct or base equality / substring
  if (optNorm === photoNorm) return true;
  if (photoBase && optBase && photoBase === optBase) return true;
  if (photoNorm && optNorm.includes(photoNorm)) return true;
  if (optNorm && photoNorm.includes(optNorm)) return true;
  if (photoBase && optNorm.includes(photoBase)) return true;
  if (optBase && photoNorm.includes(optBase)) return true;

  // 2. Course title & Tag matching
  if (courseNorm && photoNorm && courseNorm.includes(photoNorm)) return true;
  if (courseNorm && photoBase && courseNorm.includes(photoBase)) return true;
  if (tagNorm && photoNorm && tagNorm.includes(photoNorm)) return true;

  // 3. Appetizers & 5-dish Platter matching
  const isPhotoAppetizer =
    photoNorm.includes('ออเดิร์ฟ') ||
    photoNorm.includes('5 อย่าง') ||
    photoNorm.includes('ของทานเล่น') ||
    photoNorm.includes('จานรวมมิตร');

  const isCourseAppetizer =
    courseNorm.includes('ออเดิร์ฟ') ||
    courseNorm.includes('จานที่ 2') ||
    courseNorm.includes('5 อย่าง');

  const isOptAppetizer =
    optNorm.includes('ขนมจีบ') ||
    optNorm.includes('ไข่เยี่ยวม้า') ||
    optNorm.includes('ไส้กรอก') ||
    optNorm.includes('หมูแผ่น') ||
    optNorm.includes('แฮม') ||
    optNorm.includes('ออเดิร์ฟ') ||
    optNorm.includes('5 อย่าง') ||
    optNorm.includes('ติ่มซำ');

  if (isPhotoAppetizer && (isCourseAppetizer || isOptAppetizer)) return true;

  // 4. Crackers
  if (
    photoNorm.includes('ข้าวเกรียบ') &&
    (optNorm.includes('ข้าวเกรียบ') || courseNorm.includes('จานที่ 1') || courseNorm.includes('ข้าวเกรียบ'))
  ) return true;

  // 5. Fish Maw Soup
  if (
    photoNorm.includes('กระเพาะปลา') &&
    (optNorm.includes('กระเพาะปลา') || courseNorm.includes('กระเพาะปลา') || courseNorm.includes('จานที่ 3'))
  ) return true;

  // 6. Shark Fin
  if (
    photoNorm.includes('หูฉลาม') &&
    (optNorm.includes('หูฉลาม') || courseNorm.includes('หูฉลาม'))
  ) return true;

  // 7. Pork Knuckle
  if (
    photoNorm.includes('ขาหมู') &&
    (optNorm.includes('ขาหมู') || courseNorm.includes('ขาหมู'))
  ) return true;

  // 8. Duck
  if (
    photoNorm.includes('เป็ด') &&
    (optNorm.includes('เป็ด') || courseNorm.includes('เป็ด'))
  ) return true;

  // 9. Fish
  if (photoNorm.includes('ปลากะพง') && (optNorm.includes('กะพง') || optNorm.includes('ปลากะพง'))) return true;
  if (photoNorm.includes('ปลาทับทิม') && (optNorm.includes('ทับทิม') || optNorm.includes('ปลาทับทิม'))) return true;
  if (photoNorm.includes('ปลา') && (courseNorm.includes('เมนูปลา') || optNorm.includes('ปลา'))) return true;

  // 10. Hotpot / Soup
  if (
    photoNorm.includes('ต้มยำ') &&
    (optNorm.includes('ต้มยำ') || courseNorm.includes('ต้มยำ'))
  ) return true;
  if (
    (photoNorm.includes('แกงจืด') || photoNorm.includes('ต้มจืด')) &&
    (optNorm.includes('จืด') || courseNorm.includes('จืด'))
  ) return true;

  // 11. Rice & Noodles
  if (
    photoNorm.includes('ข้าวผัด') &&
    (optNorm.includes('ข้าวผัด') || courseNorm.includes('ข้าวผัด'))
  ) return true;
  if (
    (photoNorm.includes('หมี่') || photoNorm.includes('ซั่ว')) &&
    (optNorm.includes('หมี่') || optNorm.includes('ซั่ว') || courseNorm.includes('หมี่'))
  ) return true;

  // 12. Desserts
  if (
    photoNorm.includes('ลอยแก้ว') &&
    (optNorm.includes('ลอยแก้ว') || optNorm.includes('เงาะ') || optNorm.includes('ลิ้นจี่') || courseNorm.includes('ของหวาน'))
  ) return true;
  if (
    (photoNorm.includes('โอวนี้') || photoNorm.includes('โอนี่') || photoNorm.includes('แปะก๊วย') || photoNorm.includes('เผือก')) &&
    (optNorm.includes('โอวนี้') || optNorm.includes('โอนี่') || optNorm.includes('แปะก๊วย') || optNorm.includes('เผือก'))
  ) return true;
  if (
    photoNorm.includes('เต้าทึง') &&
    (optNorm.includes('เต้าทึง') || courseNorm.includes('ของหวาน'))
  ) return true;
  if (
    photoNorm.includes('ผลไม้') &&
    (optNorm.includes('ผลไม้') || courseNorm.includes('ผลไม้'))
  ) return true;

  return false;
};

// Smart default course detector
export const detectCourseNumberFromDish = (photoName: string = '', category: string = ''): number => {
  const norm = normalizeThaiDishName(photoName);
  if (norm.includes('ข้าวเกรียบ') || norm.includes('ถั่วอบ')) return 1;
  if (
    norm.includes('ออเดิร์ฟ') ||
    norm.includes('5 อย่าง') ||
    norm.includes('ติ่มซำ') ||
    norm.includes('ซีฟู้ดนึ่งเตาซึ้ง') ||
    norm.includes('สี่สี') ||
    norm.includes('ทอดมันกุ้ง') ||
    norm.includes('โหงวก๊วย') ||
    norm.includes('เหล้าแดง')
  ) return 2;
  if (norm.includes('กระเพาะปลา') || norm.includes('หูฉลาม') || norm.includes('เยื่อไผ่') || norm.includes('ไก่ตุ๋น')) return 3;
  if (norm.includes('ยำ') || norm.includes('สลัด') || norm.includes('เป็ดย่าง') || norm.includes('ขาหมู')) return 4;
  if (norm.includes('ปลา') || norm.includes('ปลากะพง') || norm.includes('ปลาทับทิม')) return 5;
  if (norm.includes('ต้มยำ') || norm.includes('แกงส้ม') || norm.includes('หม้อไฟ') || norm.includes('ต้มจืด') || norm.includes('โป๊ะแตก')) return 6;
  if (norm.includes('ข้าวผัด') || norm.includes('ผัดหมี่') || norm.includes('หมี่ซั่ว')) return 7;
  if (
    norm.includes('ของหวาน') ||
    norm.includes('ลอยแก้ว') ||
    norm.includes('โอวนี้') ||
    norm.includes('โอนี่') ||
    norm.includes('แปะก๊วย') ||
    norm.includes('เต้าทึง') ||
    norm.includes('ผลไม้') ||
    norm.includes('วุ้นมะพร้าว')
  ) return 8;

  if (category === 'appetizers') return 2;
  if (category === 'soups') return 3;
  if (category === 'mains') return 4;
  if (category === 'fish') return 5;
  if (category === 'hotpot') return 6;
  if (category === 'rice') return 7;
  if (category === 'desserts') return 8;

  return 1;
};

export const PhotoManager: React.FC = () => {
  const [customPhotos, setCustomPhotos] = useState<PhotoPreset[]>([]);
  const [presetOverrides, setPresetOverrides] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(PRESET_NAMES_OVERRIDE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

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
  const [selectedPkgIds, setSelectedPkgIds] = useState<string[]>([]);
  const [assignCourseMode, setAssignCourseMode] = useState<'match_name' | 'specific_course'>('match_name');
  const [targetCourseNumber, setTargetCourseNumber] = useState<number>(1);
  const [selectedDishOptionName, setSelectedDishOptionName] = useState<string>('all');
  const [selectedDishKeys, setSelectedDishKeys] = useState<string[]>([]);

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

  const currentPresets: PhotoPreset[] = DISH_PHOTO_PRESETS.map((p) => {
    if (presetOverrides[p.id]) {
      return {
        ...p,
        name: presetOverrides[p.id],
      };
    }
    return p;
  });

  // Start Inline Rename
  const handleStartRename = (photo: PhotoPreset) => {
    setEditingPhotoId(photo.id);
    setEditingPhotoName(photo.name);
  };

  // Save Inline Rename
  const handleSaveRename = async (photoId: string, customName?: string) => {
    const newName = (customName !== undefined ? customName : editingPhotoName).trim();
    if (!newName) return;

    const isCustomPhoto = customPhotos.some((p) => p.id === photoId);
    const targetCustom = customPhotos.find((p) => p.id === photoId);
    const targetPreset = currentPresets.find((p) => p.id === photoId);
    const targetPhoto = targetCustom || targetPreset;

    if (targetPhoto) {
      if (isCustomPhoto && targetCustom) {
        const updatedPhoto = { ...targetCustom, name: newName };
        await imageStore.saveCustomPhoto(updatedPhoto);
        await imageStore.setOverride(newName, targetCustom.url);

        const updated = customPhotos.map((p) => (p.id === photoId ? updatedPhoto : p));
        savePhotosState(updated);
      } else if (targetPreset) {
        // Standard preset rename
        const newOverrides = { ...presetOverrides, [photoId]: newName };
        setPresetOverrides(newOverrides);
        try {
          localStorage.setItem(PRESET_NAMES_OVERRIDE_KEY, JSON.stringify(newOverrides));
        } catch (e) {}

        await imageStore.setOverride(newName, targetPreset.url);
      }

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

  // Open Assign Modal with multi-package selection
  const openAssignModal = (photo: PhotoPreset) => {
    setAssigningPhoto(photo);
    const currentPkgs = packageService.getPackages();
    setPackages(currentPkgs);

    // Start with NO packages pre-selected as requested by user
    setSelectedPkgIds([]);
    setSelectedDishKeys([]);

    setAssignCourseMode('match_name');
    const detectedCourse = detectCourseNumberFromDish(photo.name, photo.category);
    setTargetCourseNumber(detectedCourse);
    setSelectedDishOptionName('all');
  };

  // Assign photo to multiple packages at once
  const handleAssignToCourse = async () => {
    if (!assigningPhoto) return;
    if (selectedPkgIds.length === 0) {
      alert('⚠️ กรุณาเลือกอย่างน้อย 1 แพ็กเกจราคาที่ต้องการผูกรูปภาพค่ะ');
      return;
    }

    if (selectedDishKeys.length === 0) {
      alert('⚠️ กรุณาติ๊กเลือกอย่างน้อย 1 เมนูอาหารในรายการด้านล่างที่ต้องการเปลี่ยนรูปภาพค่ะ');
      return;
    }

    const currentPkgs = packageService.getPackages();
    let updatedDishesCount = 0;
    const affectedPackageIds = new Set<string>();

    const newPkgs = currentPkgs.map((pkg) => {
      if (!selectedPkgIds.includes(pkg.id)) return pkg;

      let pkgChanged = false;
      const newCourses = pkg.courses.map((course, cIdx) => {
        const cNum = course.courseIndex || cIdx + 1;
        const newOptions = course.options.map((opt) => {
          const dishKey = `${pkg.id}__${cNum}__${opt.id || opt.name}`;
          if (selectedDishKeys.includes(dishKey)) {
            pkgChanged = true;
            updatedDishesCount++;
            affectedPackageIds.add(pkg.id);
            return {
              ...opt,
              imageUrl: assigningPhoto.url,
            };
          }
          return opt;
        });

        return {
          ...course,
          options: newOptions,
        };
      });

      if (pkgChanged) {
        return {
          ...pkg,
          courses: newCourses,
        };
      }
      return pkg;
    });

    if (updatedDishesCount === 0) {
      alert(
        `⚠️ ไม่พบเมนูที่เลือก กรุณาติ๊กเลือกเมนูที่ต้องการเปลี่ยนรูปภาพในรายการด้านล่างค่ะ`
      );
      return;
    }

    // Also register image override globally
    await imageStore.setOverride(assigningPhoto.name, assigningPhoto.url);
    const photoBase = extractDishBaseName(assigningPhoto.name);
    if (photoBase) {
      await imageStore.setOverride(photoBase, assigningPhoto.url);
    }

    packageService.savePackages(newPkgs);
    setPackages(newPkgs);

    const updatedPackagesCount = affectedPackageIds.size;
    alert(
      `✓ ผูกรูปภาพสำเร็จเรียบร้อยแล้วค่ะ!\n\nอัปเดตเมนูอาหารไปทั้งหมด ${updatedDishesCount} เมนู ใน ${updatedPackagesCount} แพ็กเกจราคา`
    );
    showNotification(
      `✓ ผูกรูป "${assigningPhoto.name}" เข้ากับ ${updatedPackagesCount} แพ็กเกจ (${updatedDishesCount} เมนู) เรียบร้อยแล้วค่ะ!`
    );
    setAssigningPhoto(null);
  };

  // Filter photos
  const normSearch = normalizeThaiDishName(searchTerm);
  const currentList = activeTab === 'my_uploads' ? customPhotos : currentPresets;

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
              onClick={() => exportMenuToExcelFile('รายการเมนูอาหาร_โต๊ะจีนรพีพัฒน์_ครบทุกแพ็กเกจ.xlsx')}
              className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 transition-all transform hover:scale-102 cursor-pointer shadow-md"
              title="ดาวน์โหลดรายการเมนูอาหารทั้งหมดและรายการซ้ำเป็นไฟล์ Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>📊 ส่งออก Excel (.xlsx)</span>
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
                  {editingPhotoId === photo.id ? (
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
                        <button
                          type="button"
                          onClick={() => handleStartRename(photo)}
                          className="p-1 rounded-lg bg-white hover:bg-amber-100 text-slate-600 hover:text-amber-900 border border-slate-200 transition-colors shrink-0 cursor-pointer"
                          title="✏️ คลิกเพื่อแก้ไขชื่อเมนูอาหาร"
                        >
                          <Edit3 className="w-3 h-3 text-amber-700" />
                        </button>
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
                        onClick={() => openAssignModal(photo)}
                        className="py-1.5 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[10.5px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="นำรูปนี้ไปผูกกับเมนูในหลายแพ็กเกจพร้อมกัน"
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
      {/* 🔍 HIGH-RES LARGE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {largePreviewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setLargePreviewPhoto(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-amber-400 animate-scaleUp flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-black text-amber-300 truncate">
                      {largePreviewPhoto.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newName = prompt('แก้ไขชื่อเมนูอาหาร:', largePreviewPhoto.name);
                        if (newName && newName.trim()) {
                          handleSaveRename(largePreviewPhoto.id, newName.trim());
                        }
                      }}
                      className="px-2 py-0.5 rounded-lg bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 text-[10px] font-black flex items-center gap-1 transition-colors cursor-pointer border border-amber-400/40 shrink-0"
                      title="✏️ คลิกเพื่อแก้ไขชื่อเมนูอาหาร"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>เปลี่ยนชื่อ</span>
                    </button>
                  </div>
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
                    openAssignModal(target);
                  }}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>นำรูปนี้ไปผูกกับเมนูหลายแพ็กเกจ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔗 MULTI-PACKAGE ASSIGN PHOTO TO MENU MODAL */}
      {/* ========================================================================= */}
      {assigningPhoto && (() => {
        // Auto-detected matched packages using smart matching
        const matchedPkgs = packages.filter((pkg) =>
          pkg.courses.some((course) =>
            course.options.some((opt) =>
              checkDishMatch(assigningPhoto.name, opt.name, course.title, opt.tag)
            )
          )
        );
        const matchedPkgIds = matchedPkgs.map((p) => p.id);

        // Find which packages currently have this photo attached
        const alreadyBoundDishes: {
          pkgId: string;
          pkgPrice: number;
          optId?: string;
          optName: string;
          courseTitle: string;
          courseIndex: number;
        }[] = [];
        const alreadyBoundPkgIdsSet = new Set<string>();

        packages.forEach((pkg) => {
          pkg.courses.forEach((course, cIdx) => {
            const cNum = course.courseIndex || cIdx + 1;
            course.options.forEach((opt) => {
              if (opt.imageUrl === assigningPhoto.url) {
                alreadyBoundDishes.push({
                  pkgId: pkg.id,
                  pkgPrice: pkg.price,
                  optId: opt.id,
                  optName: opt.name,
                  courseTitle: course.title,
                  courseIndex: cNum,
                });
                alreadyBoundPkgIdsSet.add(pkg.id);
              }
            });
          });
        });
        const alreadyBoundPkgIds = Array.from(alreadyBoundPkgIdsSet);

        // Helper to unbind photo from a single dish
        const handleUnbindSingleDish = (
          pkgId: string,
          courseIdx: number,
          optIdentifier: string,
          pkgPrice: number,
          optName: string
        ) => {
          if (!assigningPhoto) return;
          if (
            !window.confirm(
              `คุณต้องการยกเลิกการผูกรูปภาพนี้ออกจากเมนู "${optName}" (แพ็กเกจราคา ${pkgPrice.toLocaleString()}.-) ใช่หรือไม่?`
            )
          ) {
            return;
          }

          const currentPkgs = packageService.getPackages();
          const newPkgs = currentPkgs.map((pkg) => {
            if (pkg.id !== pkgId) return pkg;
            return {
              ...pkg,
              courses: pkg.courses.map((course, cIdx) => {
                const cNum = course.courseIndex || cIdx + 1;
                if (cNum !== courseIdx && cIdx + 1 !== courseIdx) return course;
                return {
                  ...course,
                  options: course.options.map((opt) => {
                    if (
                      (opt.id && opt.id === optIdentifier) ||
                      opt.name === optIdentifier ||
                      opt.name === optName
                    ) {
                      return {
                        ...opt,
                        imageUrl: undefined,
                      };
                    }
                    return opt;
                  }),
                };
              }),
            };
          });

          packageService.savePackages(newPkgs);
          setPackages(newPkgs);
          showNotification(
            `✓ ยกเลิกการผูกรูปภาพออกจากเมนู "${optName}" (${pkgPrice.toLocaleString()}.-) เรียบร้อยแล้วค่ะ`
          );
        };

        // Helper to unbind photo from all packages at once
        const handleUnbindAllDishes = () => {
          if (!assigningPhoto || alreadyBoundDishes.length === 0) return;
          if (
            !window.confirm(
              `คุณต้องการยกเลิกการผูกรูปภาพ "${assigningPhoto.name}" ออกจากทุกเมนูที่ผูกไว้ทั้งหมด (${alreadyBoundDishes.length} รายการ) ใช่หรือไม่?`
            )
          ) {
            return;
          }

          const currentPkgs = packageService.getPackages();
          const targetUrl = assigningPhoto.url;
          let unbindCount = 0;

          const newPkgs = currentPkgs.map((pkg) => ({
            ...pkg,
            courses: pkg.courses.map((course) => ({
              ...course,
              options: course.options.map((opt) => {
                if (opt.imageUrl === targetUrl) {
                  unbindCount++;
                  return {
                    ...opt,
                    imageUrl: undefined,
                  };
                }
                return opt;
              }),
            })),
          }));

          packageService.savePackages(newPkgs);
          setPackages(newPkgs);
          showNotification(
            `✓ ยกเลิกการผูกรูปภาพออกจากทุกเมนู (${unbindCount} รายการ) เรียบร้อยแล้วค่ะ!`
          );
        };

        // Calculate available dish options in the selected target course across all packages
        const courseDishOptionCounts = new Map<string, number>();
        packages.forEach((pkg) => {
          pkg.courses.forEach((course, cIdx) => {
            const cNum = course.courseIndex || cIdx + 1;
            if (cNum === targetCourseNumber) {
              course.options.forEach((opt) => {
                courseDishOptionCounts.set(opt.name, (courseDishOptionCounts.get(opt.name) || 0) + 1);
              });
            }
          });
        });
        const availableDishOptions = Array.from(courseDishOptionCounts.entries()).map(([name, count]) => ({
          name,
          count,
        }));

        // Candidate dishes based STRICTLY on user-selected packages
        const candidateDishes: {
          key: string;
          pkgId: string;
          pkgPrice: number;
          pkgName: string;
          courseTitle: string;
          courseIndex: number;
          optName: string;
          currentImg?: string;
          isExactNameMatch: boolean;
        }[] = [];

        selectedPkgIds.forEach((pkgId) => {
          const pkg = packages.find((p) => p.id === pkgId);
          if (!pkg) return;
          pkg.courses.forEach((course, cIdx) => {
            const cNum = course.courseIndex || cIdx + 1;
            const isTargetCourse = (cNum === targetCourseNumber);

            course.options.forEach((opt) => {
              let isCandidate = false;
              const isNameMatch = checkDishMatch(assigningPhoto.name, opt.name, course.title, opt.tag);

              if (assignCourseMode === 'match_name') {
                isCandidate = isNameMatch;
              } else if (assignCourseMode === 'specific_course') {
                if (isTargetCourse) {
                  if (selectedDishOptionName === 'all') {
                    isCandidate = true;
                  } else {
                    isCandidate =
                      opt.name === selectedDishOptionName ||
                      normalizeThaiDishName(opt.name) === normalizeThaiDishName(selectedDishOptionName);
                  }
                }
              }

              if (isCandidate) {
                const key = `${pkg.id}__${cNum}__${opt.id || opt.name}`;
                candidateDishes.push({
                  key,
                  pkgId: pkg.id,
                  pkgPrice: pkg.price,
                  pkgName: pkg.name,
                  courseTitle: course.title,
                  courseIndex: cNum,
                  optName: opt.name,
                  currentImg: opt.imageUrl,
                  isExactNameMatch: isNameMatch,
                });
              }
            });
          });
        });

        // Compute currently selected dishes
        const selectedDishesCount = candidateDishes.filter((d) => selectedDishKeys.includes(d.key)).length;

        // Helpers to sync selectedDishKeys when filters change
        const syncKeysForPackages = (pkgIds: string[], mode: 'match_name' | 'specific_course', courseNum: number, dishOpt: string) => {
          const newKeys: string[] = [];
          pkgIds.forEach((pId) => {
            const pkg = packages.find((p) => p.id === pId);
            if (!pkg) return;
            pkg.courses.forEach((course, cIdx) => {
              const cNum = course.courseIndex || cIdx + 1;
              course.options.forEach((opt) => {
                let isMatch = false;
                if (mode === 'match_name') {
                  isMatch = checkDishMatch(assigningPhoto.name, opt.name, course.title, opt.tag);
                } else {
                  if (cNum === courseNum) {
                    isMatch =
                      dishOpt === 'all' ||
                      opt.name === dishOpt ||
                      normalizeThaiDishName(opt.name) === normalizeThaiDishName(dishOpt);
                  }
                }
                if (isMatch) {
                  newKeys.push(`${pkg.id}__${cNum}__${opt.id || opt.name}`);
                }
              });
            });
          });
          setSelectedDishKeys(newKeys);
        };

        const togglePackage = (pkgId: string) => {
          const nextPkgIds = selectedPkgIds.includes(pkgId)
            ? selectedPkgIds.filter((id) => id !== pkgId)
            : [...selectedPkgIds, pkgId];
          setSelectedPkgIds(nextPkgIds);
          syncKeysForPackages(nextPkgIds, assignCourseMode, targetCourseNumber, selectedDishOptionName);
        };

        const selectAllPackages = () => {
          const allIds = packages.map((p) => p.id);
          setSelectedPkgIds(allIds);
          syncKeysForPackages(allIds, assignCourseMode, targetCourseNumber, selectedDishOptionName);
        };

        const selectMatchedOnly = () => {
          const targetIds = matchedPkgIds.length > 0 ? matchedPkgIds : packages.map((p) => p.id);
          setSelectedPkgIds(targetIds);
          syncKeysForPackages(targetIds, assignCourseMode, targetCourseNumber, selectedDishOptionName);
        };

        const selectAlreadyBoundOnly = () => {
          if (alreadyBoundPkgIds.length > 0) {
            setSelectedPkgIds(alreadyBoundPkgIds);
            syncKeysForPackages(alreadyBoundPkgIds, assignCourseMode, targetCourseNumber, selectedDishOptionName);
          }
        };

        const clearSelectedPackages = () => {
          setSelectedPkgIds([]);
          setSelectedDishKeys([]);
        };

        const handleModeChange = (mode: 'match_name' | 'specific_course') => {
          setAssignCourseMode(mode);
          syncKeysForPackages(selectedPkgIds, mode, targetCourseNumber, selectedDishOptionName);
        };

        const handleCourseNumberChange = (courseNum: number) => {
          setTargetCourseNumber(courseNum);
          setSelectedDishOptionName('all');
          syncKeysForPackages(selectedPkgIds, 'specific_course', courseNum, 'all');
        };

        const handleDishOptionChange = (dishName: string) => {
          setSelectedDishOptionName(dishName);
          syncKeysForPackages(selectedPkgIds, 'specific_course', targetCourseNumber, dishName);
        };

        const toggleDishKey = (key: string) => {
          setSelectedDishKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
          );
        };

        const selectAllCandidateDishes = () => {
          setSelectedDishKeys(candidateDishes.map((d) => d.key));
        };

        const selectMatchedNameDishesOnly = () => {
          const matched = candidateDishes.filter((d) => d.isExactNameMatch).map((d) => d.key);
          setSelectedDishKeys(matched);
        };

        const clearAllDishes = () => {
          setSelectedDishKeys([]);
        };

        return (
          <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
            onClick={() => setAssigningPhoto(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-2 border-red-500 animate-scaleUp flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-50 via-white to-amber-50 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      ผูกรูปภาพเข้ากับเมนูอาหาร (หลายแพ็กเกจ)
                    </h3>
                    <p className="text-xs text-slate-500">
                      คลิกเลือกแพ็กเกจราคาที่ต้องการเพื่อนำรูปนี้ไปแสดงผลในเมนูอาหาร
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAssigningPhoto(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* Photo preview banner & current usage */}
                <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border-2 border-amber-400 shadow-xs">
                        <SmartDishImage src={assigningPhoto.url} alt={assigningPhoto.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black text-amber-950 truncate">
                          {assigningPhoto.name}
                        </div>
                        <div className="text-[11px] text-amber-800">
                          {assigningPhoto.categoryLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {alreadyBoundDishes.length > 0 ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] border border-emerald-300 shrink-0 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>ผูกใช้งานอยู่แล้ว {alreadyBoundDishes.length} เมนู ({alreadyBoundPkgIds.length} ราคา)</span>
                        </span>
                      ) : matchedPkgIds.length > 0 ? (
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] border border-blue-300 shrink-0 flex items-center gap-1">
                          <span>พบชื่อตรงกันใน {matchedPkgIds.length} แพ็กเกจ</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-300 shrink-0">
                          ยังไม่ได้ผูกกับแพ็กเกจ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* If already bound, show quick preview list of where it's used with cancel/unbind capability */}
                  {alreadyBoundDishes.length > 0 && (
                    <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-[11px] space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="font-black text-emerald-950 flex items-center gap-1.5 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>รายการที่ผูกรูปนี้ไว้ในปัจจุบัน ({alreadyBoundDishes.length} เมนู):</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleUnbindAllDishes}
                          className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 text-[11px] font-bold border border-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                          title="ยกเลิกการผูกรูปนี้ออกจากทุกเมนูในคลิกเดียว"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ยกเลิกการผูกทั้งหมด ({alreadyBoundDishes.length})</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {alreadyBoundDishes.map((b, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl bg-white border border-emerald-300 text-slate-800 text-xs shadow-2xs group hover:border-red-300 hover:bg-red-50/50 transition-all"
                          >
                            <span className="font-black text-red-600">{b.pkgPrice.toLocaleString()}.-</span>
                            <span className="text-slate-700 font-medium truncate max-w-[150px]">({b.optName})</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUnbindSingleDish(
                                  b.pkgId,
                                  b.courseIndex,
                                  b.optId || b.optName,
                                  b.pkgPrice,
                                  b.optName
                                )
                              }
                              title={`คลิกเพื่อยกเลิกการผูกรูปนี้ออกจากเมนู ${b.optName} (ราคา ${b.pkgPrice.toLocaleString()}.-)`}
                              className="w-5 h-5 rounded-lg bg-slate-100 group-hover:bg-red-100 text-slate-400 group-hover:text-red-600 hover:scale-110 flex items-center justify-center cursor-pointer transition-all ml-0.5"
                            >
                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-emerald-800 font-medium pt-0.5">
                        💡 <b>คำแนะนำ:</b> สามารถคลิกปุ่ม <b>✕</b> ท้ายแต่ละรายการ หรือกดปุ่ม <b>"ยกเลิกการผูกทั้งหมด"</b> เพื่อปลดรูปภาพออกได้ทันทีค่ะ
                      </p>
                    </div>
                  )}
                </div>

                {/* Step 1: Multi-package Selection */}
                <div className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-black text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center text-[10px] font-bold">1</span>
                      <span>เลือกแพ็กเกจราคาที่ต้องการผูกรูปนี้</span>
                      <span className={`font-black ${selectedPkgIds.length > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                        ({selectedPkgIds.length} / {packages.length} แพ็กเกจ)
                      </span>
                    </label>

                    {/* Quick Select Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={selectAllPackages}
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-black border border-red-200 cursor-pointer transition-colors"
                      >
                        เลือกทุกราคา ({packages.length})
                      </button>
                      {alreadyBoundPkgIds.length > 0 && (
                        <button
                          type="button"
                          onClick={selectAlreadyBoundOnly}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-200 cursor-pointer transition-colors"
                        >
                          ที่ผูกรูปนี้อยู่ ({alreadyBoundPkgIds.length})
                        </button>
                      )}
                      {matchedPkgIds.length > 0 && (
                        <button
                          type="button"
                          onClick={selectMatchedOnly}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-black border border-blue-200 cursor-pointer transition-colors"
                        >
                          เฉพาะชื่อตรงกัน ({matchedPkgIds.length})
                        </button>
                      )}
                      {selectedPkgIds.length > 0 && (
                        <button
                          type="button"
                          onClick={clearSelectedPackages}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          ล้าง
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Checkbox Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {packages.map((pkg) => {
                      const isChecked = selectedPkgIds.includes(pkg.id);
                      const isMatched = matchedPkgIds.includes(pkg.id);
                      const isAlreadyBound = alreadyBoundPkgIds.includes(pkg.id);

                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => togglePackage(pkg.id)}
                          className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                            isChecked
                              ? 'bg-gradient-to-br from-red-50 to-amber-50 border-red-600 shadow-sm ring-1 ring-red-400'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 w-full">
                            <div className="font-black text-xs text-slate-900">
                              {pkg.price.toLocaleString()}.-
                            </div>
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black transition-colors ${
                                isChecked
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'border-2 border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 w-full">
                            <span className="truncate">{pkg.name.replace('โต๊ะจีนราคา ', '')}</span>
                            {isAlreadyBound ? (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                ✓ ผูกรูปนี้อยู่
                              </span>
                            ) : isMatched ? (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                                มีเมนูนี้
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Assign Mode */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="font-black text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>เลือกวิธีการผูกรูปภาพ:</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option A: Match by Name */}
                    <div
                      onClick={() => handleModeChange('match_name')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        assignCourseMode === 'match_name'
                          ? 'bg-amber-50 border-red-600 shadow-xs ring-1 ring-red-400'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black text-xs text-slate-900 mb-1">
                        <input
                          type="radio"
                          name="assignMode"
                          checked={assignCourseMode === 'match_name'}
                          onChange={() => handleModeChange('match_name')}
                          className="accent-red-600"
                        />
                        <span>⚡ ผูกตามชื่อเมนูอัตโนมัติ (แนะนำ)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 pl-5 leading-relaxed">
                        ค้นหาจานที่มีชื่อตรงกับ <span className="font-bold text-red-700">"{assigningPhoto.name}"</span> ในทุกแพ็กเกจที่เลือก แล้วอัปเดตรูปให้ทันที
                      </p>
                    </div>

                    {/* Option B: Match by Specific Course Index */}
                    <div
                      onClick={() => handleModeChange('specific_course')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        assignCourseMode === 'specific_course'
                          ? 'bg-amber-50 border-red-600 shadow-xs ring-1 ring-red-400'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black text-xs text-slate-900 mb-1">
                        <input
                          type="radio"
                          name="assignMode"
                          checked={assignCourseMode === 'specific_course'}
                          onChange={() => handleModeChange('specific_course')}
                          className="accent-red-600"
                        />
                        <span>🎯 กำหนดใส่จานลำดับที่ระบุ</span>
                      </div>
                      <p className="text-[11px] text-slate-600 pl-5 leading-relaxed">
                        เลือกจานลำดับที่ (1-10) และสามารถเจาะจงเลือกเฉพาะเมนูในจานนั้นได้
                      </p>
                    </div>
                  </div>

                  {/* Course index dropdown & Dish Option dropdown when Option B is active */}
                  {assignCourseMode === 'specific_course' && (
                    <div className="p-3.5 bg-gradient-to-br from-amber-50/90 to-orange-50/60 border-2 border-amber-300 rounded-2xl space-y-3 animate-fadeIn">
                      <div className="space-y-1">
                        <label className="font-black text-slate-800 text-xs flex items-center justify-between">
                          <span>1️⃣ เลือกจานลำดับที่:</span>
                          <span className="text-[11px] text-red-700 font-bold">จานที่ {targetCourseNumber}</span>
                        </label>
                        <select
                          value={targetCourseNumber}
                          onChange={(e) => handleCourseNumberChange(Number(e.target.value))}
                          className="w-full px-3 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-red-600 shadow-xs cursor-pointer"
                        >
                          <option value={1}>จานที่ 1: ข้าวเกรียบ & ถั่วอบเนย / เม็ดมะม่วง (ของทานเล่น)</option>
                          <option value={2}>จานที่ 2: ออเดิร์ฟ 5 อย่าง / ติ่มซำ / ซีฟู้ดนึ่งเตาซึ้ง</option>
                          <option value={3}>จานที่ 3: กระเพาะปลาน้ำแดง / ซุปเยื่อไผ่ / หูฉลาม</option>
                          <option value={4}>จานที่ 4: ยำสามกรอบ / สลัดกุ้ง / ขาหมูน้ำแดง / เป็ดย่าง</option>
                          <option value={5}>จานที่ 5: เมนูปลา (ปลากะพง / ปลาทับทิม) หรือ ขาหมู</option>
                          <option value={6}>จานที่ 6: เมนูปลา / ต้มยำกุ้ง / แกงส้ม / หม้อไฟ</option>
                          <option value={7}>จานที่ 7: ต้มยำหม้อไฟ / แกงจืด / ข้าวผัดปู</option>
                          <option value={8}>จานที่ 8: ข้าวผัดปูก้อน / ผัดหมี่ฮ่องกง / ของหวาน</option>
                          <option value={9}>จานที่ 9: ของหวานมงคล (โอวนี้ / แปะก๊วย / เต้าทึง / ลอยแก้ว)</option>
                          <option value={10}>จานที่ 10: ผลไม้รวม / ของหวานลอยแก้ว</option>
                        </select>
                      </div>

                      {availableDishOptions.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-amber-200/60">
                          <label className="font-black text-slate-800 text-xs flex items-center justify-between">
                            <span>2️⃣ เลือกเมนูอาหารในจานนี้ (เมื่อมีหลายตัวเลือก):</span>
                            <span className="text-[11px] text-amber-900 font-bold">มี {availableDishOptions.length} เมนูในจานนี้</span>
                          </label>
                          <select
                            value={selectedDishOptionName}
                            onChange={(e) => handleDishOptionChange(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border-2 border-amber-400 rounded-xl font-black text-amber-950 text-xs focus:outline-none focus:border-red-600 shadow-xs cursor-pointer"
                          >
                            <option value="all">🍽️ ทุกเมนูตัวเลือกในจานนี้ (ทั้งหมด {availableDishOptions.length} เมนู)</option>
                            {availableDishOptions.map((opt) => (
                              <option key={opt.name} value={opt.name}>
                                🔹 เฉพาะเมนู: {opt.name} (พบใน {opt.count} แพ็กเกจ)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Live Preview & Interactive Selection of Matched Dishes */}
                  <div className="pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <label className="font-black text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center text-[10px] font-bold">3</span>
                        <span>รายการเมนูอาหารที่จะเปลี่ยนรูปภาพ:</span>
                        {selectedPkgIds.length > 0 && (
                          <span className={`font-black ${selectedDishesCount > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                            (เลือกแล้ว {selectedDishesCount} / {candidateDishes.length} รายการ)
                          </span>
                        )}
                      </label>

                      {/* Quick Dish Selection Buttons */}
                      {selectedPkgIds.length > 0 && candidateDishes.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={selectAllCandidateDishes}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 cursor-pointer transition-colors"
                          >
                            เลือกทั้งหมด ({candidateDishes.length})
                          </button>
                          {candidateDishes.some((d) => d.isExactNameMatch) && (
                            <button
                              type="button"
                              onClick={selectMatchedNameDishesOnly}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 cursor-pointer transition-colors"
                            >
                              เฉพาะชื่อตรงกับรูป
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={clearAllDishes}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            ล้างการเลือก
                          </button>
                        </div>
                      )}
                    </div>

                    {selectedPkgIds.length === 0 ? (
                      <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center py-6 space-y-2 animate-fadeIn">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold text-slate-700">
                          ยังไม่ได้เลือกแพ็กเกจราคา
                        </div>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                          กรุณาคลิกเลือกแพ็กเกจราคาในข้อ 1 ด้านบน เพื่อดูและเลือกเฉพาะรายการเมนูอาหารที่ต้องการเปลี่ยนรูปภาพค่ะ
                        </p>
                      </div>
                    ) : candidateDishes.length > 0 ? (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {candidateDishes.map((item) => {
                            const isDishChecked = selectedDishKeys.includes(item.key);
                            return (
                              <div
                                key={item.key}
                                onClick={() => toggleDishKey(item.key)}
                                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2.5 transition-all cursor-pointer select-none ${
                                  isDishChecked
                                    ? 'bg-white border-emerald-400 shadow-2xs ring-1 ring-emerald-300'
                                    : 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={isDishChecked}
                                    onChange={() => {}} // handled by parent onClick
                                    className="w-4 h-4 rounded text-red-600 accent-red-600 cursor-pointer shrink-0"
                                  />
                                  <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-black text-[11px] shrink-0 border border-red-200">
                                    {item.pkgPrice.toLocaleString()}.-
                                  </span>
                                  <span className="text-slate-600 text-xs truncate">
                                    {item.courseTitle}: <strong className="text-slate-900 font-bold">{item.optName}</strong>
                                  </span>
                                </div>

                                {item.isExactNameMatch && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                                    ✓ ชื่อตรงกับรูป
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 text-amber-950">
                        <div className="flex items-start gap-2 text-xs font-bold">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div>ไม่พบชื่อเมนูที่ตรงกับ <strong className="text-red-700 font-black">"{assigningPhoto.name}"</strong> ใน {selectedPkgIds.length} แพ็กเกจที่เลือก</div>
                            <p className="text-[11px] text-amber-800 font-normal mt-1">
                              💡 <b>คำแนะนำ:</b> กรุณากดเลือก <b>"🎯 กำหนดใส่จานลำดับที่ระบุ"</b> ด้านบน เพื่อเลือกจานที่ต้องการ แล้วกดยืนยันได้ทันทีค่ะ
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleModeChange('specific_course')}
                          className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>คลิกที่นี่เพื่อเปลี่ยนเป็น "🎯 กำหนดใส่จานลำดับที่ระบุ"</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Footer Toolbar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="font-bold text-slate-800">สรุปการเลือก:</span>
                  <span className="text-red-600 font-black">{selectedPkgIds.length} แพ็กเกจ</span>
                  {selectedPkgIds.length > 0 && (
                    <span className="text-emerald-700 font-black">({selectedDishesCount} เมนูที่จะเปลี่ยนรูปภาพ)</span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setAssigningPhoto(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignToCourse}
                    disabled={selectedPkgIds.length === 0 || selectedDishesCount === 0}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:from-red-700 active:to-amber-700 disabled:opacity-50 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer transform active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      ยืนยันการผูกรูปภาพ ({selectedPkgIds.length} ราคา • {selectedDishesCount} เมนู)
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
