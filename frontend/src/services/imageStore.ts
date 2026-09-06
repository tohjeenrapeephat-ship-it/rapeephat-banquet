/**
 * 📦 High-Capacity Image & Media Store (IndexedDB + In-Memory Cache + LocalStorage Hybrid)
 * Handles unlimited uploaded photos and dish image mappings without hitting the 5MB LocalStorage limit.
 */

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
   * Synchronous get for dish image override by dish name or ID
   */
  getOverride(dishNameOrId: string): string | undefined {
    if (!dishNameOrId) return undefined;
    const key = dishNameOrId.toLowerCase().trim();
    return inMemoryOverrides.get(key);
  },

  /**
   * Set dish image override synchronously in memory and persist asynchronously to IndexedDB
   */
  async setOverride(dishNameOrId: string, imageUrl: string): Promise<void> {
    if (!dishNameOrId || !imageUrl) return;
    const key = dishNameOrId.toLowerCase().trim();
    inMemoryOverrides.set(key, imageUrl);

    // Save lightweight backup to LocalStorage
    try {
      if (typeof window !== 'undefined') {
        const obj: Record<string, string> = {};
        // Only keep recent 20 overrides in localStorage to stay under 1MB
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
  }
};
