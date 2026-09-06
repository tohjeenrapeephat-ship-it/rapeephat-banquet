/**
 * 📦 High-Capacity Image & Media Store (IndexedDB + In-Memory Cache + LocalStorage Hybrid)
 * Handles unlimited uploaded photos and dish image mappings without hitting the 5MB LocalStorage limit.
 */

import { normalizeThaiDishName, extractDishBaseName } from '../utils/thaiTextNormalizer.js';

const DB_NAME = 'rapeephat_media_db';
const DB_VERSION = 1;
const STORE_PHOTOS = 'uploaded_photos';
const STORE_OVERRIDES = 'dish_overrides';

// In-Memory Fast Cache for Synchronous Access
const inMemoryOverrides = new Map<string, string>();
const inMemoryPhotos = new Map<string, any>();

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB not supported in SSR'));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
          db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_OVERRIDES)) {
          db.createObjectStore(STORE_OVERRIDES, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

// Initialize and preload from IndexedDB & LocalStorage on browser startup
if (typeof window !== 'undefined') {
  // 1. Initial preload from localStorage if any
  try {
    const rawOverrides = localStorage.getItem('rapeephat_dish_overrides_v1');
    if (rawOverrides) {
      const parsed = JSON.parse(rawOverrides);
      Object.entries(parsed).forEach(([k, v]) => inMemoryOverrides.set(k.toLowerCase().trim(), v as string));
    }
  } catch (e) {}

  // 2. Preload from IndexedDB
  getDB()
    .then((db) => {
      const tx = db.transaction([STORE_OVERRIDES, STORE_PHOTOS], 'readonly');
      const overrideStore = tx.objectStore(STORE_OVERRIDES);
      const req = overrideStore.getAll();
      req.onsuccess = () => {
        if (req.result && Array.isArray(req.result)) {
          req.result.forEach((item: { key: string; url: string }) => {
            if (item.key && item.url) {
              inMemoryOverrides.set(item.key.toLowerCase().trim(), item.url);
            }
          });
        }
      };

      const photoStore = tx.objectStore(STORE_PHOTOS);
      const reqPhotos = photoStore.getAll();
      reqPhotos.onsuccess = () => {
        if (reqPhotos.result && Array.isArray(reqPhotos.result)) {
          reqPhotos.result.forEach((photo: any) => {
            if (photo.id) {
              inMemoryPhotos.set(photo.id, photo);
            }
          });
        }
      };
    })
    .catch((e) => console.warn('IndexedDB preload notice:', e));
}

export const imageStore = {
  /**
   * Synchronous get for dish image override by dish name or ID (with Thai normalization)
   */
  getOverride(dishNameOrId: string): string | undefined {
    if (!dishNameOrId) return undefined;
    const key = dishNameOrId.toLowerCase().trim();
    
    // 1. Direct match
    const direct = inMemoryOverrides.get(key);
    if (direct) return direct;

    // 2. Normalized match (handles 'ออร์เดริ์ฟ', 'ออร์เดิร์ฟ', 'ออเดริฟ', etc.)
    const norm = normalizeThaiDishName(key);
    const normMatch = inMemoryOverrides.get(norm);
    if (normMatch) return normMatch;

    // 3. Base name match (strips parentheses e.g. '(ขนมจีบ, ไข่เยี่ยวม้า...)')
    const base = extractDishBaseName(key);
    if (base && base !== norm) {
      const baseMatch = inMemoryOverrides.get(base);
      if (baseMatch) return baseMatch;
    }

    // 4. Fuzzy in-memory scan for substring / base match
    for (const [k, url] of inMemoryOverrides.entries()) {
      if (k === 'undefined' || k === 'null' || !k) continue;
      const kNorm = normalizeThaiDishName(k);
      const kBase = extractDishBaseName(k);

      if (kNorm === norm || (base && (kBase === base || kNorm === base || kBase === norm))) {
        return url;
      }
      if (
        (norm.length > 5 && kNorm.includes(norm)) ||
        (kNorm.length > 5 && norm.includes(kNorm)) ||
        (base.length > 5 && kNorm.includes(base))
      ) {
        return url;
      }
    }

    return undefined;
  },

  /**
   * Set dish image override synchronously in memory and persist asynchronously to IndexedDB
   */
  async setOverride(dishNameOrId: string, imageUrl: string): Promise<void> {
    if (!dishNameOrId || !imageUrl) return;
    const key = dishNameOrId.toLowerCase().trim();
    const norm = normalizeThaiDishName(key);
    const base = extractDishBaseName(key);

    inMemoryOverrides.set(key, imageUrl);
    if (norm && norm !== key) {
      inMemoryOverrides.set(norm, imageUrl);
    }
    if (base && base !== key && base !== norm) {
      inMemoryOverrides.set(base, imageUrl);
    }

    // Save lightweight backup to LocalStorage
    try {
      if (typeof window !== 'undefined') {
        const obj: Record<string, string> = {};
        // Only keep recent 25 overrides in localStorage to stay under 1MB
        let count = 0;
        inMemoryOverrides.forEach((v, k) => {
          if (count < 25) {
            obj[k] = v;
            count++;
          }
        });
        localStorage.setItem('rapeephat_dish_overrides_v1', JSON.stringify(obj));
      }
    } catch (e) {
      console.warn('LocalStorage backup quota full, relying on IndexedDB', e);
    }

    // Persist to IndexedDB
    try {
      const db = await getDB();
      const tx = db.transaction([STORE_OVERRIDES], 'readwrite');
      tx.objectStore(STORE_OVERRIDES).put({ key, url: imageUrl, updatedAt: Date.now() });
      if (norm && norm !== key) {
        tx.objectStore(STORE_OVERRIDES).put({ key: norm, url: imageUrl, updatedAt: Date.now() });
      }
      if (base && base !== key && base !== norm) {
        tx.objectStore(STORE_OVERRIDES).put({ key: base, url: imageUrl, updatedAt: Date.now() });
      }
    } catch (e) {
      console.warn('IndexedDB setOverride error:', e);
    }
  },

  /**
   * Get all custom uploaded photos
   */
  async getAllCustomPhotos(): Promise<any[]> {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction([STORE_PHOTOS], 'readonly');
        const req = tx.objectStore(STORE_PHOTOS).getAll();
        req.onsuccess = () => {
          const res = req.result || [];
          resolve(res);
        };
        req.onerror = () => resolve(Array.from(inMemoryPhotos.values()));
      });
    } catch (e) {
      return Array.from(inMemoryPhotos.values());
    }
  },

  /**
   * Save custom uploaded photo to IndexedDB
   */
  async saveCustomPhoto(photo: any): Promise<void> {
    if (!photo || !photo.id) return;
    inMemoryPhotos.set(photo.id, photo);

    try {
      const db = await getDB();
      const tx = db.transaction([STORE_PHOTOS], 'readwrite');
      tx.objectStore(STORE_PHOTOS).put(photo);
    } catch (e) {
      console.warn('IndexedDB saveCustomPhoto error:', e);
    }
  },

  /**
   * Delete custom uploaded photo
   */
  async deleteCustomPhoto(photoId: string): Promise<void> {
    if (!photoId) return;
    inMemoryPhotos.delete(photoId);

    try {
      const db = await getDB();
      const tx = db.transaction([STORE_PHOTOS], 'readwrite');
      tx.objectStore(STORE_PHOTOS).delete(photoId);
    } catch (e) {
      console.warn('IndexedDB deleteCustomPhoto error:', e);
    }
  },

  /**
   * Remove dish image override
   */
  async removeOverride(dishNameOrId: string): Promise<void> {
    if (!dishNameOrId) return;
    const key = dishNameOrId.toLowerCase().trim();
    const norm = normalizeThaiDishName(key);
    const base = extractDishBaseName(key);

    inMemoryOverrides.delete(key);
    if (norm) inMemoryOverrides.delete(norm);
    if (base) inMemoryOverrides.delete(base);

    // Also remove from localStorage backup
    try {
      if (typeof window !== 'undefined') {
        const rawOverrides = localStorage.getItem('rapeephat_dish_overrides_v1');
        if (rawOverrides) {
          const parsed = JSON.parse(rawOverrides);
          delete parsed[key];
          if (norm) delete parsed[norm];
          if (base) delete parsed[base];
          localStorage.setItem('rapeephat_dish_overrides_v1', JSON.stringify(parsed));
        }
      }
    } catch (e) {}

    // Delete from IndexedDB
    try {
      const db = await getDB();
      const tx = db.transaction([STORE_OVERRIDES], 'readwrite');
      const store = tx.objectStore(STORE_OVERRIDES);
      store.delete(key);
      if (norm) store.delete(norm);
      if (base) store.delete(base);
    } catch (e) {
      console.warn('IndexedDB removeOverride error:', e);
    }
  },

  /**
   * Remove any overrides pointing to a specific image URL
   */
  async removeOverridesByUrl(imageUrl: string): Promise<void> {
    if (!imageUrl) return;
    const keysToDelete: string[] = [];
    inMemoryOverrides.forEach((url, k) => {
      if (url === imageUrl) keysToDelete.push(k);
    });
    keysToDelete.forEach((k) => inMemoryOverrides.delete(k));

    try {
      if (typeof window !== 'undefined') {
        const rawOverrides = localStorage.getItem('rapeephat_dish_overrides_v1');
        if (rawOverrides) {
          const parsed = JSON.parse(rawOverrides);
          keysToDelete.forEach((k) => delete parsed[k]);
          localStorage.setItem('rapeephat_dish_overrides_v1', JSON.stringify(parsed));
        }
      }
    } catch (e) {}

    try {
      const db = await getDB();
      const tx = db.transaction([STORE_OVERRIDES], 'readwrite');
      const store = tx.objectStore(STORE_OVERRIDES);
      keysToDelete.forEach((k) => store.delete(k));
    } catch (e) {
      console.warn('IndexedDB removeOverridesByUrl error:', e);
    }
  }
};
